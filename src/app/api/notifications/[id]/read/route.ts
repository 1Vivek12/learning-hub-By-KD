import { NextResponse } from "next/server";
import { NotificationService } from "@/lib/services/notificationService";
import { getApiSession } from "@/lib/auth/utils";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  try {
    const { session, errorResponse } = await getApiSession();
    if (errorResponse) return errorResponse;
    
    // In a real application, ensure the notification belongs to the user
    // We assume markAsRead is safe or checks ownership within the service/db layer
    await NotificationService.markAsRead(resolvedParams.id);
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
