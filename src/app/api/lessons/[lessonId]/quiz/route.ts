import { NextResponse } from "next/server";
import { getApiSession } from "@/lib/auth/utils";
import { CourseAccessService } from "@/lib/services/courseAccessService";
import { prisma } from "@/lib/db/prisma";

export async function GET(request: Request, { params }: { params: Promise<{ lessonId: string }> }) {
  const resolvedParams = await params;
  try {
    const { session, errorResponse } = await getApiSession();
    if (errorResponse) return errorResponse;
    const userId = session!.user.id;
    
    // 1. Verify lesson access
    await CourseAccessService.requireLessonAccess(userId, resolvedParams.lessonId);
    
    // 2. Fetch quiz without correct answers
    const quiz = await prisma.quiz.findUnique({
      where: { lessonId: resolvedParams.lessonId },
      include: {
        questions: {
          orderBy: { order: 'asc' },
          select: {
            id: true,
            text: true,
            points: true,
            options: {
              orderBy: { order: 'asc' },
              select: {
                id: true,
                text: true
              }
            }
          }
        }
      }
    });

    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    return NextResponse.json(quiz);
  } catch (error: any) {
    
    if (error.message === 'UNAUTHORIZED_LESSON_ACCESS') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
