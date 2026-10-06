import { NextResponse } from "next/server";
import { getApiInstructor } from "@/lib/auth/utils";
import { LiveClassService } from "@/lib/services/liveClassService";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  try {
    const { session, errorResponse } = await getApiInstructor();
    if (errorResponse) return errorResponse;
    const userId = session!.user.id;
    const role = session!.user.role;

    const liveClass = await LiveClassService.startClass(userId, role, resolvedParams.id);
    return NextResponse.json(liveClass);
  } catch (error: any) {
    
    if (error.message === 'UNAUTHORIZED_INSTRUCTOR_ACCESS') return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
