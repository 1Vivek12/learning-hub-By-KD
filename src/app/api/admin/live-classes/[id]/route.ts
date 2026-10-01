import { NextResponse } from "next/server";
import { LiveClassService } from "@/lib/services/liveClassService";
import { getApiAdmin } from "@/lib/auth/utils";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  try {
    const { session, errorResponse } = await getApiAdmin();
    if (errorResponse) return errorResponse;
    const body = await request.json();
    
    // For start/end we use dedicated actions, so here we remove status just in case.
    if (body.status) delete body.status;
    if (body.scheduledStartTime) body.scheduledStartTime = new Date(body.scheduledStartTime);
    
    const updated = await LiveClassService.updateClass(session!.user.id, (session!.user as any).role, resolvedParams.id, body);
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
    await LiveClassService.deleteClass(session!.user.id, (session!.user as any).role, resolvedParams.id);
    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
