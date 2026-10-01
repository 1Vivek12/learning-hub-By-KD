import { NextResponse } from "next/server";
import { OrderService } from "@/lib/services/orderService";
import { UserService } from "@/lib/services/userService";
import { getApiAdmin } from "@/lib/auth/utils";
import { prisma } from "@/lib/db/prisma";

export async function GET() {
  try {
    const { session, errorResponse } = await getApiAdmin();
    if (errorResponse) return errorResponse;
    
    const [
      userCount,
      courseCount,
      orderCount,
      enrollmentCount,
      revenue,
    ] = await Promise.all([
      UserService.getUserCount(),
      prisma.course.count(),
      OrderService.getOrderCount(),
      prisma.enrollment.count(),
      OrderService.getRevenue(),
    ]);
    
    return NextResponse.json({
      users: userCount,
      courses: courseCount,
      orders: orderCount,
      enrollments: enrollmentCount,
      revenue,
    });
  } catch (error: any) {
    
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
