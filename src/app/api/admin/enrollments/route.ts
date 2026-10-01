import { NextResponse } from "next/server";
import { EnrollmentService } from "@/lib/services/enrollmentService";
import { getApiAdmin } from "@/lib/auth/utils";

export async function GET() {
  try {
    const { session, errorResponse } = await getApiAdmin();
    if (errorResponse) return errorResponse;
    const enrollments = await EnrollmentService.getAllEnrollmentsAdmin();
    return NextResponse.json(enrollments);
  } catch (error: any) {
    
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
