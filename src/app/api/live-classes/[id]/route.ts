import { NextResponse } from "next/server";
import { getApiSession, getApiInstructor } from "@/lib/auth/utils";
import { LiveClassService } from "@/lib/services/liveClassService";
import { prisma } from "@/lib/db/prisma";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  try {
    const { session, errorResponse } = await getApiSession();
    if (errorResponse) return errorResponse;
    const liveClass = await prisma.liveClass.findUnique({
      where: { id: resolvedParams.id },
      include: { course: true }
    });

    if (!liveClass) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(liveClass);
  } catch (error: any) {
    
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  try {
    const { session, errorResponse } = await getApiInstructor();
    if (errorResponse) return errorResponse;
    const userId = (session!.user as any).id;
    const role = (session!.user as any).role;
    const body = await request.json();

    const liveClass = await LiveClassService.updateClass(userId, role, resolvedParams.id, body);
    return NextResponse.json(liveClass);
  } catch (error: any) {
    
    if (error.message === 'UNAUTHORIZED_INSTRUCTOR_ACCESS') return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  try {
    const { session, errorResponse } = await getApiInstructor();
    if (errorResponse) return errorResponse;
    const userId = (session!.user as any).id;
    const role = (session!.user as any).role;

    await LiveClassService.deleteClass(userId, role, resolvedParams.id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    
    if (error.message === 'UNAUTHORIZED_INSTRUCTOR_ACCESS') return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
