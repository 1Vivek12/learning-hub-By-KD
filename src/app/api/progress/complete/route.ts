import { NextResponse } from "next/server";
import { ProgressService } from "@/lib/services/progressService";
import { CourseAccessService } from "@/lib/services/courseAccessService";
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

    // Security Fix: Verify lesson access before allowing completion
    await CourseAccessService.requireLessonAccess(session!.user.id, lessonId);

    const progress = await ProgressService.markLessonComplete(session!.user.id, lessonId);
    return NextResponse.json(progress);
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED_COURSE_ACCESS" || error.message === "UNAUTHORIZED_LESSON_ACCESS") {
      return NextResponse.json({ error: "User is not enrolled in this course" }, { status: 403 });
    }
    if (error.message === "QUIZ_NOT_PASSED") {
      return NextResponse.json({ error: "Quiz must be passed before completing this lesson" }, { status: 403 });
    }
    if (error.message === "ENROLLMENT_NOT_FOUND") {
      return NextResponse.json({ error: "Enrollment not found" }, { status: 404 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
