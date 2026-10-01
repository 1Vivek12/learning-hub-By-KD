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
    const lesson = await prisma.lesson.update({ where: { id: resolvedParams.id }, data: body });
    await AuditService.log({
      actor: (session!.user as any)?.email,
      action: 'LESSON_UPDATED',
      resource: 'Lesson',
      resourceId: resolvedParams.id,
    });
    return NextResponse.json(lesson);
  } catch (error: any) {
    
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  try {
    const { session, errorResponse } = await getApiAdmin();
    if (errorResponse) return errorResponse;

    // Check for existing progress records
    const progressCount = await prisma.lessonProgress.count({
      where: { lessonId: resolvedParams.id },
    });

    if (progressCount > 0) {
      return NextResponse.json(
        { error: "Cannot delete: this lesson has student progress records." },
        { status: 409 }
      );
    }

    await prisma.lesson.delete({ where: { id: resolvedParams.id } });
    await AuditService.log({
      actor: (session!.user as any)?.email,
      action: 'LESSON_DELETED',
      resource: 'Lesson',
      resourceId: resolvedParams.id,
    });
    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
