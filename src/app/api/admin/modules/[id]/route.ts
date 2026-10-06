import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { AuditService } from "@/lib/services/auditService";
import { getApiAdmin } from "@/lib/auth/utils";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  try {
    const { session, errorResponse } = await getApiAdmin();
    if (errorResponse) return errorResponse;
    const body = await request.json();
    const safeData: any = {};
    const allowedFields = ['titleEn', 'titleHi', 'titleHinglish', 'order'];
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        safeData[field] = body[field];
      }
    }
    const mod = await prisma.courseModule.update({ where: { id: resolvedParams.id }, data: safeData });
    await AuditService.log({
      actor: session!.user?.email ?? undefined,
      action: 'MODULE_UPDATED',
      resource: 'CourseModule',
      resourceId: resolvedParams.id,
    });
    return NextResponse.json(mod);
  } catch (error: any) {
    
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  try {
    const { session, errorResponse } = await getApiAdmin();
    if (errorResponse) return errorResponse;

    // Check for existing lesson progress within this module's lessons
    const lessonsWithProgress = await prisma.lesson.findMany({
      where: { moduleId: resolvedParams.id },
      include: { _count: { select: { progress: true } } },
    });

    const hasProgress = lessonsWithProgress.some(l => l._count.progress > 0);
    if (hasProgress) {
      return NextResponse.json(
        { error: "Cannot delete: this module contains lessons with student progress records. Archive or reassign them first." },
        { status: 409 }
      );
    }

    // Cascade delete is defined in Prisma schema (module -> lessons)
    await prisma.courseModule.delete({ where: { id: resolvedParams.id } });
    await AuditService.log({
      actor: session!.user?.email ?? undefined,
      action: 'MODULE_DELETED',
      resource: 'CourseModule',
      resourceId: resolvedParams.id,
    });
    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
