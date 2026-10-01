import { NextResponse } from "next/server";
import { UserService } from "@/lib/services/userService";
import { AuditService } from "@/lib/services/auditService";
import { getApiAdmin } from "@/lib/auth/utils";

export async function GET() {
  try {
    const { session, errorResponse } = await getApiAdmin();
    if (errorResponse) return errorResponse;
    const users = await UserService.getAllUsers();
    return NextResponse.json(users);
  } catch (error: any) {
    
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
