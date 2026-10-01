import { NextResponse } from "next/server";
import { getApiSession } from "@/lib/auth/utils";
import { ProgressService } from "@/lib/services/progressService";
import { CourseAccessService } from "@/lib/services/courseAccessService";
import { prisma } from "@/lib/db/prisma";

export async function GET(request: Request, { params }: { params: Promise<{ lessonId: string }> }) {
  const resolvedParams = await params;
  try {
    const { session, errorResponse } = await getApiSession();
    if (errorResponse) return errorResponse;
    const userId = (session!.user as any).id;
    
    const progress = await prisma.lessonProgress.findUnique({
      where: { userId_lessonId: { userId, lessonId: resolvedParams.lessonId } }
    });

    return NextResponse.json(progress || { percentage: 0, lastPosition: 0, isCompleted: false });
  } catch (error: any) {
    
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ lessonId: string }> }) {
  const resolvedParams = await params;
  try {
    const { session, errorResponse } = await getApiSession();
    if (errorResponse) return errorResponse;
    const userId = (session!.user as any).id;
    const body = await request.json();
    const { currentPosition, percentage } = body;
    
    await CourseAccessService.requireLessonAccess(userId, resolvedParams.lessonId);
    
    const record = await ProgressService.updateLessonProgress(
      userId, 
      resolvedParams.lessonId, 
      currentPosition || 0, 
      percentage || 0
    );

    return NextResponse.json(record);
  } catch (error: any) {
    
    if (error.message === 'UNAUTHORIZED_LESSON_ACCESS') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
