import { NextResponse } from "next/server";
import { getApiSession } from "@/lib/auth/utils";
import { LiveClassService } from "@/lib/services/liveClassService";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  try {
    const { session, errorResponse } = await getApiSession();
    if (errorResponse) return errorResponse;
    const userId = session!.user.id;

    const result = await LiveClassService.leaveClass(userId, resolvedParams.id);
    return NextResponse.json(result);
  } catch (error: any) {
    
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
