import { NextResponse } from "next/server";
import { NotificationService } from "@/lib/services/notificationService";
import { getApiSession } from "@/lib/auth/utils";

export async function POST(request: Request) {
  try {
    const { session, errorResponse } = await getApiSession();
    if (errorResponse) return errorResponse;
    
    await NotificationService.markAllAsRead(session!.user.id);
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
