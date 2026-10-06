import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { AuditService } from "@/lib/services/auditService";
import { getApiAdmin } from "@/lib/auth/utils";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  try {
    const { session, errorResponse } = await getApiAdmin();
    if (errorResponse) return errorResponse;
    const instructor = await prisma.instructor.findUnique({
      where: { id: resolvedParams.id },
      include: { courses: true },
    });
    if (!instructor) {
      return NextResponse.json({ error: "Instructor not found" }, { status: 404 });
    }
    return NextResponse.json(instructor);
  } catch (error: any) {
    
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  try {
    const { session, errorResponse } = await getApiAdmin();
    if (errorResponse) return errorResponse;
    const body = await request.json();
    const safeData: any = {};
    const allowedFields = [
      'name', 'titleEn', 'titleHi', 'titleHinglish',
      'bioEn', 'bioHi', 'bioHinglish', 'avatar',
      'company', 'socials', 'userId'
    ];
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        safeData[field] = body[field];
      }
    }
    const instructor = await prisma.instructor.update({ where: { id: resolvedParams.id }, data: safeData });
    await AuditService.log({
      actor: session!.user?.email ?? undefined,
      action: 'INSTRUCTOR_UPDATED',
      resource: 'Instructor',
      resourceId: resolvedParams.id,
    });
    return NextResponse.json(instructor);
  } catch (error: any) {
    
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  try {
    const { session, errorResponse } = await getApiAdmin();
    if (errorResponse) return errorResponse;
    await prisma.instructor.delete({ where: { id: resolvedParams.id } });
    await AuditService.log({
      actor: session!.user?.email ?? undefined,
      action: 'INSTRUCTOR_DELETED',
      resource: 'Instructor',
      resourceId: resolvedParams.id,
    });
    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
