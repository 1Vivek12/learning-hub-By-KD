import { NextResponse } from "next/server";
import { LiveClassService } from "@/lib/services/liveClassService";
import { getApiAdmin } from "@/lib/auth/utils";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  try {
    const { session, errorResponse } = await getApiAdmin();
    if (errorResponse) return errorResponse;
    const body = await request.json();
    
    let updated;
    if (body.action === 'start') {
      updated = await LiveClassService.startClass(session!.user.id, (session!.user as any).role, resolvedParams.id);
    } else if (body.action === 'end') {
      updated = await LiveClassService.endClass(session!.user.id, (session!.user as any).role, resolvedParams.id);
    } else {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
    
    return NextResponse.json(updated);
  } catch (error: any) {
    
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
