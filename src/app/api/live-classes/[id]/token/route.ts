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
    const userId = session!.user.id;
    const userName = session!.user.name || "Participant";
    const role = session!.user.role;
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
    let isClassInstructor = false;
    let isAdmin = role === 'ADMIN' || role === 'SUPER_ADMIN';

    if (isAdmin) {
      isClassInstructor = true;
    } else if (role === 'INSTRUCTOR') {
      try {
        // Enforce the server-side ownership chain
        await LiveClassService.requireInstructorAccess(userId, liveClass.courseId, role);
        isClassInstructor = true;
      } catch (err) {
        // Not the instructor for this course. They might be a student, so fall through to enrollment check.
      }
    }

    if (!isClassInstructor) {
      // Students (or non-owning instructors) must be actively enrolled
      const hasAccess = await CourseAccessService.hasActiveEnrollment(userId, liveClass.courseId);
      if (!hasAccess) {
        return NextResponse.json({ error: "User is not authorized for this live class" }, { status: 403 });
      }
    }

    // 3. Sync participant record
    if (!isClassInstructor) {
      await LiveClassService.joinClass(userId, classId);
    }

    // 4. Generate token using the strictly verified contextual role
    const contextualRole = isClassInstructor ? 'INSTRUCTOR' : 'STUDENT';
    let token: string;
    try {
      token = await LiveKitService.generateToken(liveClass.roomId, userId, userName, contextualRole);
    } catch (tokenErr) {
      // If token generation fails, we must safely release the capacity reservation!
      if (!isClassInstructor) {
        await LiveClassService.leaveClass(userId, classId).catch(console.error);
      }
      throw tokenErr;
    }

    return NextResponse.json({ token, roomUrl: process.env.NEXT_PUBLIC_LIVEKIT_URL });
  } catch (error: any) {
    
    console.error("Token API Error:", error.message || error);
    if (error.message === 'CAPACITY_REJECTED') {
      return NextResponse.json({ error: "Live class is full" }, { status: 409 });
    }
    if (error.message === 'UNAUTHORIZED_INSTRUCTOR_ACCESS') {
      return NextResponse.json({ error: "Unauthorized access to course" }, { status: 403 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
