import { NextResponse } from "next/server";
import { getApiSession } from "@/lib/auth/utils";
import { CertificateService } from "@/lib/services/certificateService";
import { AuditService } from "@/lib/services/auditService";

export async function POST(request: Request) {
  try {
    const { session, errorResponse } = await getApiSession();
    if (errorResponse) return errorResponse;
    const userId = (session!.user as any).id;
    const body = await request.json();
    const { courseId } = body;

    if (!courseId) {
      return NextResponse.json({ error: "Course ID required" }, { status: 400 });
    }

    const certificate = await CertificateService.issueCertificate(userId, courseId);

    await AuditService.log({
      actor: (session!.user as any).email,
      action: "CERTIFICATE_ISSUED",
      resource: "Certificate",
      resourceId: certificate.id,
      details: { certificateNumber: certificate.certificateNumber }
    });

    return NextResponse.json(certificate);
  } catch (error: any) {
    
    console.error("Certificate Issue Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 400 });
  }
}
