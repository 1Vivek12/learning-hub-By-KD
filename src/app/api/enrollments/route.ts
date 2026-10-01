import { NextResponse } from "next/server";
import { EnrollmentService } from "@/lib/services/enrollmentService";
import { getApiSession } from "@/lib/auth/utils";

export async function GET() {
  try {
    const { session, errorResponse } = await getApiSession();
    if (errorResponse) return errorResponse;
    const enrollments = await EnrollmentService.getEnrollmentsByUser((session!.user as any).id);
    return NextResponse.json(enrollments);
  } catch (error: any) {
    
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { session, errorResponse } = await getApiSession();
    if (errorResponse) return errorResponse;
    const body = await request.json();
    const { courseId } = body;
    
    if (!courseId) {
      return NextResponse.json({ error: "Course ID required" }, { status: 400 });
    }
    
    const enrollment = await EnrollmentService.createEnrollment((session!.user as any).id, courseId);
    return NextResponse.json(enrollment, { status: 201 });
  } catch (error: any) {
    
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
