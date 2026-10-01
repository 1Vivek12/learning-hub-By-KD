import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { AuditService } from "@/lib/services/auditService";
import { getApiAdmin } from "@/lib/auth/utils";

// Get modules for a course
export async function GET(request: Request) {
  try {
    const { session, errorResponse } = await getApiAdmin();
    if (errorResponse) return errorResponse;
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('courseId');
    
    if (!courseId) {
      return NextResponse.json({ error: "courseId query param required" }, { status: 400 });
    }
    
    const modules = await prisma.courseModule.findMany({
      where: { courseId },
      include: { lessons: { orderBy: { order: 'asc' } } },
      orderBy: { order: 'asc' },
    });
    return NextResponse.json(modules);
  } catch (error: any) {
    
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// Create a module
export async function POST(request: Request) {
  try {
    const { session, errorResponse } = await getApiAdmin();
    if (errorResponse) return errorResponse;
    const body = await request.json();
    
    if (!body.titleEn || !body.courseId) {
      return NextResponse.json({ error: "titleEn and courseId are required" }, { status: 400 });
    }
    
    // Auto-assign order
    const maxOrder = await prisma.courseModule.aggregate({
      where: { courseId: body.courseId },
      _max: { order: true },
    });
    
    const mod = await prisma.courseModule.create({
      data: {
        ...body,
        order: (maxOrder._max.order || 0) + 1,
      },
    });
    
    await AuditService.log({
      actor: (session!.user as any)?.email,
      action: 'MODULE_CREATED',
      resource: 'CourseModule',
      resourceId: mod.id,
      details: { courseId: body.courseId, titleEn: body.titleEn },
    });
    
    return NextResponse.json(mod, { status: 201 });
  } catch (error: any) {
    
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
