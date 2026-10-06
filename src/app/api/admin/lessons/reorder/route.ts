import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { AuditService } from "@/lib/services/auditService";
import { getApiAdmin } from "@/lib/auth/utils";

// Reorder lessons within a module
export async function PATCH(request: Request) {
  try {
    const { session, errorResponse } = await getApiAdmin();
    if (errorResponse) return errorResponse;
    const body = await request.json();
    const { moduleId, orderedIds } = body;
    
    if (!moduleId || !Array.isArray(orderedIds)) {
      return NextResponse.json({ error: "moduleId and orderedIds[] required" }, { status: 400 });
    }
    
    const updates = orderedIds.map((id: string, index: number) =>
      prisma.lesson.updateMany({
        where: { id, moduleId },
        data: { order: index + 1 },
      })
    );
    
    await prisma.$transaction(updates);
    
    await AuditService.log({
      actor: session!.user?.email ?? undefined,
      action: 'LESSONS_REORDERED',
      resource: 'CourseModule',
      resourceId: moduleId,
    });
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
