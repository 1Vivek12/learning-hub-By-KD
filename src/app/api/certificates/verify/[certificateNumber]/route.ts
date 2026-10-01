import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET(request: Request, { params }: { params: Promise<{ certificateNumber: string }> }) {
  const resolvedParams = await params;
  try {
    const cert = await prisma.certificate.findUnique({
      where: { certificateNumber: resolvedParams.certificateNumber },
      select: {
        certificateNumber: true,
        studentName: true,
        courseTitle: true,
        instructorName: true,
        issuedAt: true,
        completedAt: true,
        status: true,
        qrVerificationUrl: true
      }
    });

    if (!cert) {
      return NextResponse.json({ valid: false, error: "Certificate not found" }, { status: 404 });
    }

    return NextResponse.json({
      valid: cert.status === 'ISSUED',
      ...cert
    });
  } catch (error) {
    console.error("Certificate Verification Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
