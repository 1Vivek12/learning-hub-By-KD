import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { AuditService } from "@/lib/services/auditService";
import { getApiAdmin } from "@/lib/auth/utils";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  try {
    const { session, errorResponse } = await getApiAdmin();
    if (errorResponse) return errorResponse;
    const certificate = await prisma.certificate.update({
      where: { id: resolvedParams.id },
      data: { status: 'REVOKED' }
    });
    
    await AuditService.log({
      actor: (session!.user as any)?.email,
      action: 'CERTIFICATE_REVOKED',
      resource: 'Certificate',
      resourceId: resolvedParams.id,
    });
    return NextResponse.json(certificate);
  } catch (error: any) {
    
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
