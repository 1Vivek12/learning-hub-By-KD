import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { AuditService } from "@/lib/services/auditService";
import { getApiAdmin } from "@/lib/auth/utils";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  try {
    const { session, errorResponse } = await getApiAdmin();
    if (errorResponse) return errorResponse;

    // Security: Verify certificate exists before updating
    const existingCert = await prisma.certificate.findUnique({ where: { id: resolvedParams.id } });
    if (!existingCert) {
      return NextResponse.json({ error: "Certificate not found" }, { status: 404 });
    }
    if (existingCert.status === 'REVOKED') {
      return NextResponse.json({ error: "Certificate is already revoked" }, { status: 409 });
    }

    const certificate = await prisma.certificate.update({
      where: { id: resolvedParams.id },
      data: { status: 'REVOKED' }
    });
    
    await AuditService.log({
      actor: session!.user?.email ?? undefined,
      action: 'CERTIFICATE_REVOKED',
      resource: 'Certificate',
      resourceId: resolvedParams.id,
    });
    return NextResponse.json(certificate);
  } catch (error: any) {
    
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
