import { NextResponse } from "next/server";
import { getApiSession } from "@/lib/auth/utils";
import { ProgressService } from "@/lib/services/progressService";
import { CourseAccessService } from "@/lib/services/courseAccessService";
import { AuditService } from "@/lib/services/auditService";

export async function POST(request: Request, { params }: { params: Promise<{ lessonId: string }> }) {
  const resolvedParams = await params;
  try {
    const { session, errorResponse } = await getApiSession();
    if (errorResponse) return errorResponse;
    const userId = session!.user.id;
    
    await CourseAccessService.requireLessonAccess(userId, resolvedParams.lessonId);
    
    const record = await ProgressService.markLessonComplete(userId, resolvedParams.lessonId);

    await AuditService.log({
      actor: session!.user.email ?? undefined,
      action: "LESSON_COMPLETED",
      resource: "Lesson",
      resourceId: resolvedParams.lessonId
    });

    return NextResponse.json(record);
  } catch (error: any) {
    
    if (error.message === 'UNAUTHORIZED_LESSON_ACCESS') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }
    if (error.message === 'QUIZ_NOT_PASSED') {
      return NextResponse.json({ error: "Quiz must be passed before completing this lesson" }, { status: 403 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
