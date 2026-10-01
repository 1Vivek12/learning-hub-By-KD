import { NextResponse } from "next/server";
import { getApiSession } from "@/lib/auth/utils";
import { prisma } from "@/lib/db/prisma";
import { CouponService } from "@/lib/services/couponService";
import { AuditService } from "@/lib/services/auditService";
import Razorpay from "razorpay";

export async function POST(request: Request) {
  try {
    const { session, errorResponse } = await getApiSession();
    if (errorResponse) return errorResponse;
    const userId = (session!.user as any).id;
    const body = await request.json();
    const { courseId, couponCode } = body;

    if (!courseId) {
      return NextResponse.json({ error: "Course ID is required" }, { status: 400 });
    }

    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    if (course.status !== 'PUBLISHED') {
      return NextResponse.json({ error: "Course is not available for purchase" }, { status: 400 });
    }

    const existingEnrollment = await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId, courseId } }
    });

    if (existingEnrollment) {
      return NextResponse.json({ error: "Already enrolled" }, { status: 400 });
    }

    let discountAmount = 0;
    let couponId = null;

    if (couponCode) {
      const { valid, discountPercent, couponId: id } = await CouponService.validateCoupon(couponCode);
      if (valid) {
        discountAmount = (course.price * discountPercent) / 100;
        couponId = id;
      } else {
        return NextResponse.json({ error: "Invalid or expired coupon" }, { status: 400 });
      }
    }

    const finalAmount = Math.max(0, course.price - discountAmount);

    const order = await prisma.order.create({
      data: {
        userId,
        courseId,
        amount: finalAmount,
        paymentStatus: finalAmount === 0 ? 'PAID' : 'PENDING',
        couponId,
      }
    });

    await AuditService.log({
      actor: (session!.user as any).email,
      action: "ORDER_CREATED",
      resource: "Order",
      resourceId: order.id,
      details: { courseId, amount: finalAmount }
    });

    // If free (100% discount or free course), enroll immediately
    if (finalAmount === 0) {
      await prisma.enrollment.create({
        data: { userId, courseId }
      });
      return NextResponse.json({ orderId: order.id, status: "PAID", message: "Enrolled successfully" });
    }

    // Real Razorpay integration
    if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      console.error("Razorpay credentials missing");
      return NextResponse.json({ error: "Payment gateway not configured" }, { status: 500 });
    }

    const razorpay = new Razorpay({
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const gatewayOrder = await razorpay.orders.create({
      amount: finalAmount * 100, // paise
      currency: 'INR',
      receipt: order.id,
      notes: { orderId: order.id },
    });

    return NextResponse.json({
      orderId: order.id,
      gatewayOrderId: gatewayOrder.id,
      amount: gatewayOrder.amount,
      currency: gatewayOrder.currency,
      status: "PENDING",
    });

  } catch (error: any) {
    console.error("Checkout error:", error);
    
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
