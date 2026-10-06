import { NextResponse } from "next/server";
import { getApiSession, getApiInstructor } from "@/lib/auth/utils";
import { LiveClassService } from "@/lib/services/liveClassService";
import { prisma } from "@/lib/db/prisma";

export async function GET(request: Request) {
  try {
    const { session, errorResponse } = await getApiSession();
    if (errorResponse) return errorResponse;
    // Admin/Instructor can see all, students should only see classes for enrolled courses
    const role = session!.user.role;
    const userId = session!.user.id;

    if (role === 'STUDENT') {
      const enrollments = await prisma.enrollment.findMany({
        where: { userId, status: { in: ['ACTIVE', 'COMPLETED'] } },
        select: { courseId: true }
      });
      const courseIds = enrollments.map(e => e.courseId);
      
      const classes = await prisma.liveClass.findMany({
        where: { courseId: { in: courseIds } },
        orderBy: { scheduledStartTime: 'asc' }
      });
      return NextResponse.json(classes);
    } else {
      const classes = await prisma.liveClass.findMany({
        orderBy: { scheduledStartTime: 'asc' }
      });
      return NextResponse.json(classes);
    }
  } catch (error: any) {
    
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { session, errorResponse } = await getApiInstructor();
    if (errorResponse) return errorResponse;
    const userId = session!.user.id;
    const role = session!.user.role;
    const body = await request.json();
    
    // Quick validation
    if (!body.titleEn || !body.courseId || !body.scheduledStartTime || !body.durationMinutes) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const liveClass = await LiveClassService.createClass(userId, role, {
      roomId: `room_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      titleEn: body.titleEn,
      descriptionEn: body.descriptionEn,
      courseId: body.courseId,
      scheduledStartTime: new Date(body.scheduledStartTime),
      durationMinutes: body.durationMinutes,
      maxParticipants: body.maxParticipants || 100
    });

    return NextResponse.json(liveClass, { status: 201 });
  } catch (error: any) {
    
    if (error.message === 'UNAUTHORIZED_INSTRUCTOR_ACCESS') {
      return NextResponse.json({ error: "Unauthorized access to course" }, { status: 403 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
