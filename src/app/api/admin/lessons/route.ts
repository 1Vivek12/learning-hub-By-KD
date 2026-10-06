import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { AuditService } from "@/lib/services/auditService";
import { getApiAdmin } from "@/lib/auth/utils";

// Get lessons for a module
export async function GET(request: Request) {
  try {
    const { session, errorResponse } = await getApiAdmin();
    if (errorResponse) return errorResponse;
    const { searchParams } = new URL(request.url);
    const moduleId = searchParams.get('moduleId');
    
    if (!moduleId) {
      return NextResponse.json({ error: "moduleId query param required" }, { status: 400 });
    }
    
    const lessons = await prisma.lesson.findMany({
      where: { moduleId },
      include: { resources: true },
      orderBy: { order: 'asc' },
    });
    return NextResponse.json(lessons);
  } catch (error: any) {
    
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// Create a lesson
export async function POST(request: Request) {
  try {
    const { session, errorResponse } = await getApiAdmin();
    if (errorResponse) return errorResponse;
    const body = await request.json();
    
    if (!body.titleEn || !body.moduleId || !body.slug) {
      return NextResponse.json({ error: "titleEn, slug, and moduleId are required" }, { status: 400 });
    }
    
    // Auto-assign order
    const maxOrder = await prisma.lesson.aggregate({
      where: { moduleId: body.moduleId },
      _max: { order: true },
    });
    
    const safeData = {
      titleEn: body.titleEn,
      titleHi: body.titleHi,
      titleHinglish: body.titleHinglish,
      slug: body.slug,
      descriptionEn: body.descriptionEn,
      descriptionHi: body.descriptionHi,
      descriptionHinglish: body.descriptionHinglish,
      type: body.type,
      videoUrl: body.videoUrl,
      isFreePreview: typeof body.isFreePreview === 'boolean' ? body.isFreePreview : false,
      moduleId: body.moduleId,
    };

    const lesson = await prisma.lesson.create({
      data: {
        ...safeData,
        order: typeof body.order === 'number' ? body.order : (maxOrder._max.order || 0) + 1,
        durationMinutes: typeof body.durationMinutes === 'number' ? body.durationMinutes : 0,
      },
    });
    
    await AuditService.log({
      actor: session!.user?.email ?? undefined,
      action: 'LESSON_CREATED',
      resource: 'Lesson',
      resourceId: lesson.id,
      details: { moduleId: body.moduleId, titleEn: body.titleEn },
    });
    
    return NextResponse.json(lesson, { status: 201 });
  } catch (error: any) {
    
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
