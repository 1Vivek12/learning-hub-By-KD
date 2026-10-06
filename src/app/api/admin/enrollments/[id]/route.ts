import { NextResponse } from "next/server";
import { EnrollmentService } from "@/lib/services/enrollmentService";
import { AuditService } from "@/lib/services/auditService";
import { getApiAdmin } from "@/lib/auth/utils";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  try {
    const { session, errorResponse } = await getApiAdmin();
    if (errorResponse) return errorResponse;
    const body = await request.json();

    if (body.status) {
      const validStatuses = ['ACTIVE', 'COMPLETED', 'CANCELLED', 'EXPIRED'];
      if (!validStatuses.includes(body.status)) {
        return NextResponse.json({ error: "Invalid status value" }, { status: 400 });
      }
      const enrollment = await EnrollmentService.updateEnrollmentStatus(resolvedParams.id, body.status);
      await AuditService.log({
        actor: session!.user?.email ?? undefined,
        action: 'ENROLLMENT_STATUS_UPDATED',
        resource: 'Enrollment',
        resourceId: resolvedParams.id,
        details: { newStatus: body.status },
      });
      return NextResponse.json(enrollment);
    }

    return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
  } catch (error: any) {
    
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
