import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getApiAdmin } from "@/lib/auth/utils";

export async function GET() {
  try {
    const { session, errorResponse } = await getApiAdmin();
    if (errorResponse) return errorResponse;
    const certificates = await prisma.certificate.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(certificates);
  } catch (error: any) {
    
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
