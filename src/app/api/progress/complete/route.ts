import { NextResponse } from "next/server";
import { ProgressService } from "@/lib/services/progressService";
import { getApiSession } from "@/lib/auth/utils";

export async function POST(request: Request) {
  try {
    const { session, errorResponse } = await getApiSession();
    if (errorResponse) return errorResponse;

    const body = await request.json();
    const { lessonId } = body;

    if (!lessonId) {
      return NextResponse.json({ error: "lessonId is required" }, { status: 400 });
    }

    const progress = await ProgressService.markLessonComplete((session!.user as any).id, lessonId);
    return NextResponse.json(progress);
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED_COURSE_ACCESS") {
      return NextResponse.json({ error: "User is not enrolled in this course" }, { status: 403 });
    }
    if (error.message === "ENROLLMENT_NOT_FOUND") {
      return NextResponse.json({ error: "Enrollment not found" }, { status: 404 });
    }
    console.error("Error completing lesson progress:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
