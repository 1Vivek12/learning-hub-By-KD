import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { AuditService } from "@/lib/services/auditService";
import { getApiAdmin } from "@/lib/auth/utils";

// Reorder modules for a course
export async function PATCH(request: Request) {
  try {
    const { session, errorResponse } = await getApiAdmin();
    if (errorResponse) return errorResponse;
    const body = await request.json();
    const { courseId, orderedIds } = body;
    
    if (!courseId || !Array.isArray(orderedIds)) {
      return NextResponse.json({ error: "courseId and orderedIds[] required" }, { status: 400 });
    }
    
    // Update each module's order
    const updates = orderedIds.map((id: string, index: number) =>
      prisma.courseModule.updateMany({
        where: { id, courseId },
        data: { order: index + 1 },
      })
    );
    
    await prisma.$transaction(updates);
    
    await AuditService.log({
      actor: session!.user?.email ?? undefined,
      action: 'MODULES_REORDERED',
      resource: 'Course',
      resourceId: courseId,
    });
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
