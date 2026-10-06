import { NextResponse } from "next/server";
import { NotificationService } from "@/lib/services/notificationService";
import { getApiSession } from "@/lib/auth/utils";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  try {
    const { session, errorResponse } = await getApiSession();
    if (errorResponse) return errorResponse;
    const userId = session!.user.id;
    
    await NotificationService.markAsRead(resolvedParams.id, userId);
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.message === 'NOT_FOUND_OR_UNAUTHORIZED') {
      return NextResponse.json({ error: "Notification not found" }, { status: 404 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
