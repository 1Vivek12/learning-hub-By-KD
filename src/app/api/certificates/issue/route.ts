import { NextResponse } from "next/server";
import { getApiSession } from "@/lib/auth/utils";
import { CertificateService } from "@/lib/services/certificateService";
import { AuditService } from "@/lib/services/auditService";

export async function POST(request: Request) {
  try {
    const { session, errorResponse } = await getApiSession();
    if (errorResponse) return errorResponse;
    const userId = session!.user.id;
    const body = await request.json();
    const { courseId } = body;

    if (!courseId) {
      return NextResponse.json({ error: "Course ID required" }, { status: 400 });
    }

    const certificate = await CertificateService.issueCertificate(userId, courseId);

    await AuditService.log({
      actor: session!.user.email ?? undefined,
      action: "CERTIFICATE_ISSUED",
      resource: "Certificate",
      resourceId: certificate.id,
      details: { certificateNumber: certificate.certificateNumber }
    });

    return NextResponse.json(certificate);
  } catch (error: any) {
    const message = error.message || "";
    if (message.includes("Not eligible") || message.includes("not completed") || message.includes("not all") || message.includes("not been")) {
      return NextResponse.json({ error: message }, { status: 403 });
    }
    if (message.includes("already issued")) {
      return NextResponse.json({ error: message }, { status: 409 });
    }
    if (message.includes("No enrollment") || message.includes("not found")) {
      return NextResponse.json({ error: message }, { status: 404 });
    }
    if (message.includes("no longer active")) {
      return NextResponse.json({ error: message }, { status: 403 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
