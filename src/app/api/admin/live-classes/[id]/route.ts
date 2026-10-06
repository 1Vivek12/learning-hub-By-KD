import { NextResponse } from "next/server";
import { LiveClassService } from "@/lib/services/liveClassService";
import { getApiAdmin } from "@/lib/auth/utils";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  try {
    const { session, errorResponse } = await getApiAdmin();
    if (errorResponse) return errorResponse;
    const body = await request.json();
    
    const safeData: any = {};
    const allowedFields = [
      'titleEn', 'descriptionEn', 'courseId', 'instructorId', 
      'maxParticipants', 'recordingAvailable', 'durationMinutes', 'joinUrl'
    ];
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        safeData[field] = body[field];
      }
    }
    
    if (body.scheduledStartTime) {
      safeData.scheduledStartTime = new Date(body.scheduledStartTime);
    }
    
    const updated = await LiveClassService.updateClass(session!.user.id, session!.user.role, resolvedParams.id, safeData);
    return NextResponse.json(updated);
  } catch (error: any) {
    
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  try {
    const { session, errorResponse } = await getApiAdmin();
    if (errorResponse) return errorResponse;
    await LiveClassService.deleteClass(session!.user.id, session!.user.role, resolvedParams.id);
    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
