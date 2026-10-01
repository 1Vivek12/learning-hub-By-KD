import { NextResponse } from "next/server";
import { NotificationService } from "@/lib/services/notificationService";
import { getApiSession } from "@/lib/auth/utils";

export async function GET(request: Request) {
  try {
    const { session, errorResponse } = await getApiSession();
    if (errorResponse) return errorResponse;
    const { searchParams } = new URL(request.url);
    const unreadOnly = searchParams.get('unreadOnly') === 'true';
    
    const notifications = await NotificationService.getNotificationsForUser(
      (session!.user as any).id,
      { unreadOnly }
    );
    const unreadCount = await NotificationService.getUnreadCount((session!.user as any).id);
    
    return NextResponse.json({ notifications, unreadCount });
  } catch (error: any) {
    
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { session, errorResponse } = await getApiSession();
    if (errorResponse) return errorResponse;
    const body = await request.json();
    
    if (body.markAllRead) {
      await NotificationService.markAllAsRead((session!.user as any).id);
      return NextResponse.json({ success: true });
    }
    
    if (body.notificationId) {
      await NotificationService.markAsRead(body.notificationId);
      return NextResponse.json({ success: true });
    }
    
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  } catch (error: any) {
    
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
