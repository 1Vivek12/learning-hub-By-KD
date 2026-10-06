import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { LiveClassService } from "@/lib/services/liveClassService";
import { getApiAdmin } from "@/lib/auth/utils";

export async function GET() {
  try {
    const { session, errorResponse } = await getApiAdmin();
    if (errorResponse) return errorResponse;
    const classes = await prisma.liveClass.findMany({
      include: {
        course: { select: { titleEn: true, slug: true } }
      },
      orderBy: { scheduledStartTime: 'asc' }
    });
    return NextResponse.json(classes);
  } catch (error: any) {
    
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { session, errorResponse } = await getApiAdmin();
    if (errorResponse) return errorResponse;
    const body = await request.json();
    
    // Auto-generate a secure roomId
    const roomId = `room-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 7)}`;
    
    const safeData = {
      titleEn: body.titleEn,
      descriptionEn: body.descriptionEn,
      courseId: body.courseId,
      instructorId: body.instructorId,
      maxParticipants: typeof body.maxParticipants === 'number' ? body.maxParticipants : 100,
      recordingAvailable: typeof body.recordingAvailable === 'boolean' ? body.recordingAvailable : false,
      roomId,
      scheduledStartTime: new Date(body.scheduledStartTime),
      joinUrl: `/live/${roomId}`
    };

    const newClass = await LiveClassService.createClass(session!.user.id, session!.user.role, safeData);
    
    return NextResponse.json(newClass, { status: 201 });
  } catch (error: any) {
    
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
