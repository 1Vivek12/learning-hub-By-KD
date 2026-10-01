import { NextResponse } from "next/server";
import { getApiSession } from "@/lib/auth/utils";
import { CourseAccessService } from "@/lib/services/courseAccessService";
import { ProgressService } from "@/lib/services/progressService";
import { prisma } from "@/lib/db/prisma";
import { AuditService } from "@/lib/services/auditService";

export async function POST(request: Request, { params }: { params: Promise<{ lessonId: string }> }) {
  const resolvedParams = await params;
  try {
    const { session, errorResponse } = await getApiSession();
    if (errorResponse) return errorResponse;
    const userId = (session!.user as any).id;
    const body = await request.json();
    const { answers } = body; // { questionId: optionId }
    
    await CourseAccessService.requireLessonAccess(userId, resolvedParams.lessonId);
    
    const quiz = await prisma.quiz.findUnique({
      where: { lessonId: resolvedParams.lessonId },
      include: { questions: { include: { options: true } } }
    });

    if (!quiz) return NextResponse.json({ error: "Quiz not found" }, { status: 404 });

    let score = 0;
    let maxScore = 0;
    const answerRecords = [];

    // Calculate score on the server
    for (const question of quiz.questions) {
      maxScore += question.points;
      const submittedOptionId = answers[question.id];
      const correctOption = question.options.find(o => o.isCorrect);

      if (submittedOptionId && correctOption && submittedOptionId === correctOption.id) {
        score += question.points;
      }
      
      answerRecords.push({
        questionId: question.id,
        selectedOptionId: submittedOptionId || null
      });
    }

    const percentage = Math.round((score / maxScore) * 100);
    const passed = percentage >= quiz.passingScore;

    // Get previous attempt count
    const attemptCount = await prisma.quizAttempt.count({
      where: { quizId: quiz.id, userId }
    });

    const attempt = await prisma.quizAttempt.create({
      data: {
        quizId: quiz.id,
        userId,
        score: percentage,
        passed,
        attemptNum: attemptCount + 1,
        completedAt: new Date(),
        answers: {
          create: answerRecords
        }
      }
    });

    if (passed) {
      await ProgressService.markLessonComplete(userId, resolvedParams.lessonId);
    }

    await AuditService.log({
      actor: (session!.user as any).email,
      action: passed ? "QUIZ_PASSED" : "QUIZ_FAILED",
      resource: "QuizAttempt",
      resourceId: attempt.id,
      details: { score: percentage }
    });

    return NextResponse.json({ 
      attemptId: attempt.id,
      score: percentage, 
      passed,
      attemptNum: attempt.attemptNum
    });

  } catch (error: any) {
    
    if (error.message === 'UNAUTHORIZED_LESSON_ACCESS') return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
