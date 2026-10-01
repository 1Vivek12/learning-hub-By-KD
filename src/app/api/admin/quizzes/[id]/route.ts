import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getApiAdmin } from "@/lib/auth/utils";

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  try {
    const { session, errorResponse } = await getApiAdmin();
    if (errorResponse) return errorResponse;
    
    const quiz = await prisma.quiz.findUnique({
      where: { id: resolvedParams.id },
      include: { _count: { select: { attempts: true } } }
    });

    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    if (quiz._count.attempts > 0) {
      return NextResponse.json({ error: "Cannot delete a quiz that has student attempts" }, { status: 409 });
    }

    await prisma.quiz.delete({ where: { id: resolvedParams.id } });
    
    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
