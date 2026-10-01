import { NextResponse } from "next/server";
import { getApiSession } from "@/lib/auth/utils";
import { LiveClassService } from "@/lib/services/liveClassService";
import { CourseAccessService } from "@/lib/services/courseAccessService";
import { LiveKitService } from "@/lib/services/liveKitService";
import { prisma } from "@/lib/db/prisma";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  try {
    const { session, errorResponse } = await getApiSession();
    if (errorResponse) return errorResponse;
    const userId = (session!.user as any).id;
    const userName = (session!.user as any).name || "Participant";
    const role = (session!.user as any).role;
    const classId = resolvedParams.id;

    // 1. Fetch live class to get room mapping
    const liveClass = await prisma.liveClass.findUnique({
      where: { id: classId }
    });

    if (!liveClass) {
      return NextResponse.json({ error: "Live class not found" }, { status: 404 });
    }

    if (liveClass.status !== 'LIVE') {
      return NextResponse.json({ error: "Live class is not currently active" }, { status: 400 });
    }

    // 2. Determine authorization
    const isInstructorOrAdmin = ['INSTRUCTOR', 'ADMIN', 'SUPER_ADMIN'].includes(role);
    
    if (isInstructorOrAdmin) {
      // Instructors must manage this course
      await LiveClassService.requireInstructorAccess(userId, liveClass.courseId, role);
    } else {
      // Students must be actively enrolled
      const hasAccess = await CourseAccessService.hasActiveEnrollment(userId, liveClass.courseId);
      if (!hasAccess) {
        return NextResponse.json({ error: "User is not enrolled in the required course" }, { status: 403 });
      }
    }

    // 3. Sync participant record (if Student, ensure they are in the participant list)
    if (!isInstructorOrAdmin) {
      await LiveClassService.joinClass(userId, classId);
    }

    // 4. Generate token
    const token = await LiveKitService.generateToken(liveClass.roomId, userId, userName, role);

    return NextResponse.json({ token, roomUrl: process.env.NEXT_PUBLIC_LIVEKIT_URL });
  } catch (error: any) {
    
    console.error("Token API Error:", error);
    if (error.message === 'UNAUTHORIZED_INSTRUCTOR_ACCESS') {
      return NextResponse.json({ error: "Unauthorized access to course" }, { status: 403 });
    }
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
