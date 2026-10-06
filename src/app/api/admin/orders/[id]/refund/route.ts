import { NextResponse } from "next/server";
import { getApiAdmin } from "@/lib/auth/utils";
import { prisma } from "@/lib/db/prisma";
import { AuditService } from "@/lib/services/auditService";
import Razorpay from "razorpay";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  try {
    const { session, errorResponse } = await getApiAdmin();
    if (errorResponse) return errorResponse;
    const orderId = resolvedParams.id;
    
    // 1. Validate Order State
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { payments: true }
    });
    
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    if (order.paymentStatus === 'REFUNDED') {
      return NextResponse.json({ error: "Order is already refunded" }, { status: 409 });
    }
    if (order.paymentStatus !== 'PAID') {
      return NextResponse.json({ error: "Order is not paid" }, { status: 400 });
    }

    // 2. Find successful payment
    const payment = order.payments.find(p => p.status === 'PAID' && p.provider === 'Razorpay' && p.providerRef);
    
    if (!payment || !payment.providerRef) {
       return NextResponse.json({ error: "No valid Razorpay payment found for this order" }, { status: 400 });
    }

    // 3. Call Razorpay Refund API
    if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
       // Cannot refund without Razorpay credentials
       console.error("Missing Razorpay credentials for refund");
       return NextResponse.json({ error: "Gateway Configuration Error" }, { status: 500 });
    }

    const razorpay = new Razorpay({
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    try {
      await razorpay.payments.refund(payment.providerRef, {
        amount: Math.round(payment.amount * 100), // Razorpay expects paise/cents
        notes: { reason: "Admin requested refund" }
      });
    } catch (rzpError: any) {
      const errorMsg = rzpError.description || rzpError.message || "";
      // If Razorpay says it's already fully refunded, we can safely proceed to reconcile our local DB
      const isAlreadyRefunded = errorMsg.toLowerCase().includes("fully refunded") || errorMsg.toLowerCase().includes("already refunded");
      
      if (!isAlreadyRefunded) {
        console.error("Razorpay Refund Error:", errorMsg);
        return NextResponse.json({ error: "Gateway refund failed: " + errorMsg }, { status: 502 });
      }
    }

    // 4. Update Database State (Only after gateway success or if gateway confirms it's already refunded)
    const result = await prisma.$transaction(async (tx) => {
      // Mark order as refunded
      const updatedOrder = await tx.order.update({
        where: { id: orderId },
        data: { paymentStatus: 'REFUNDED' }
      });
      
      // Mark payment as refunded
      await tx.payment.update({
        where: { id: payment.id },
        data: { status: 'REFUNDED' }
      });
      
      // Suspend enrollment (do not delete to preserve progress history)
      await tx.enrollment.updateMany({
        where: { userId: order.userId, courseId: order.courseId, status: { in: ['ACTIVE', 'COMPLETED'] } },
        data: { status: 'CANCELLED' } // 'CANCELLED' revokes access safely
      });
      
      return updatedOrder;
    });

    // 5. Audit Logging
    await AuditService.log({
      actor: session!.user.email ?? undefined,
      action: "REFUND_COMPLETED",
      resource: "Order",
      resourceId: orderId,
      details: { paymentId: payment.id, providerRef: payment.providerRef }
    });

    return NextResponse.json({ success: true, order: result });
  } catch (error: any) {
    console.error("Refund processing error:", error.message);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
