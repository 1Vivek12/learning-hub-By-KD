import { NextResponse } from "next/server";
import { InstructorService } from "@/lib/services/instructorService";
import { prisma } from "@/lib/db/prisma";
import { AuditService } from "@/lib/services/auditService";
import { getApiAdmin } from "@/lib/auth/utils";

export async function GET() {
  try {
    const { session, errorResponse } = await getApiAdmin();
    if (errorResponse) return errorResponse;
    const instructors = await InstructorService.getAllInstructors();
    return NextResponse.json(instructors);
  } catch (error: any) {
    
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { session, errorResponse } = await getApiAdmin();
    if (errorResponse) return errorResponse;
    const body = await request.json();
    
    if (!body.name || !body.titleEn || !body.bioEn) {
      return NextResponse.json({ error: "name, titleEn, and bioEn are required" }, { status: 400 });
    }
    
    const instructor = await prisma.instructor.create({ data: body });
    await AuditService.log({
      actor: (session!.user as any)?.email,
      action: 'INSTRUCTOR_CREATED',
      resource: 'Instructor',
      resourceId: instructor.id,
      details: { name: body.name },
    });
    return NextResponse.json(instructor, { status: 201 });
  } catch (error: any) {
    
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
