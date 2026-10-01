import { NextResponse } from "next/server";
import { getApiSession } from "@/lib/auth/utils";
import { CourseAccessService } from "@/lib/services/courseAccessService";
import { prisma } from "@/lib/db/prisma";
import { getVideoProvider } from "@/lib/video/VideoProvider";
import { AuditService } from "@/lib/services/auditService";

export async function GET(request: Request, { params }: { params: Promise<{ lessonId: string }> }) {
  const resolvedParams = await params;
  try {
    const { session, errorResponse } = await getApiSession();
    if (errorResponse) return errorResponse;
    const userId = (session!.user as any).id;
    const lessonId = resolvedParams.lessonId;

    // 1. Check access
    await CourseAccessService.requireLessonAccess(userId, lessonId);

    // 2. Load asset
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: { videoAsset: true }
    });

    if (!lesson || lesson.type !== 'VIDEO') {
      return NextResponse.json({ error: "Lesson is not a video" }, { status: 400 });
    }

    if (!lesson.videoAsset) {
      return NextResponse.json({ error: "Video asset not found" }, { status: 404 });
    }

    // 3. Generate short-lived playback info
    const provider = getVideoProvider();
    const playbackInfo = await provider.getPlaybackAccess(lesson.videoAsset.providerRef, userId);

    // 4. Log access
    await AuditService.log({
      actor: (session!.user as any).email,
      action: "VIDEO_ACCESS_GRANTED",
      resource: "Lesson",
      resourceId: lessonId,
      details: { providerRef: lesson.videoAsset.providerRef }
    });

    return NextResponse.json(playbackInfo);
  } catch (error: any) {
    
    if (error.message === 'UNAUTHORIZED_LESSON_ACCESS') {
      return NextResponse.json({ error: "Unauthorized access to lesson" }, { status: 403 });
    }
    console.error("Playback error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
