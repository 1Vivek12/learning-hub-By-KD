import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getApiAdmin } from "@/lib/auth/utils";

export async function GET() {
  try {
    const { session, errorResponse } = await getApiAdmin();
    if (errorResponse) return errorResponse;
    const quizzes = await prisma.quiz.findMany({
      include: {
        lesson: { select: { titleEn: true, module: { select: { courseId: true } } } },
        _count: { select: { questions: true, attempts: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(quizzes);
  } catch (error: any) {
    
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { session, errorResponse } = await getApiAdmin();
    if (errorResponse) return errorResponse;
    const body = await request.json();
    const { lessonId, title, instructions, passingScore, timeLimitMins, questions } = body;
    
    // Safety check - verify lesson doesn't already have a quiz
    const existing = await prisma.quiz.findUnique({ where: { lessonId } });
    if (existing) {
      return NextResponse.json({ error: "Lesson already has a quiz" }, { status: 409 });
    }

    const quiz = await prisma.quiz.create({
      data: {
        lessonId,
        title,
        instructions,
        passingScore: passingScore || 80,
        timeLimitMins,
        questions: {
          create: questions.map((q: any, i: number) => ({
            text: q.text,
            order: i,
            points: q.points || 10,
            options: {
              create: q.options.map((opt: any, j: number) => ({
                text: opt.text,
                isCorrect: opt.isCorrect,
                order: j
              }))
            }
          }))
        }
      }
    });

    return NextResponse.json(quiz, { status: 201 });
  } catch (error: any) {
    
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
