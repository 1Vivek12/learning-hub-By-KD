import { NextResponse } from "next/server";
import { OrderService } from "@/lib/services/orderService";
import { getApiAdmin } from "@/lib/auth/utils";

export async function GET() {
  try {
    const { session, errorResponse } = await getApiAdmin();
    if (errorResponse) return errorResponse;
    const orders = await OrderService.getAllOrders();
    return NextResponse.json(orders);
  } catch (error: any) {
    
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
