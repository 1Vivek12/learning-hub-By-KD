import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { AuditService } from "@/lib/services/auditService";
import { getApiSession } from "@/lib/auth/utils";
import { EmailService } from "@/lib/services/emailService";

export async function POST(request: Request) {
  try {
    const { session, errorResponse } = await getApiSession();
    if (errorResponse) return errorResponse;
    const userId = (session!.user as any).id;
    const body = await request.json();
    
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = body;
    const paymentId = razorpay_payment_id;
    const status = body.status || 'SUCCESS';

    if (!orderId || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ error: "Missing required payment fields" }, { status: 400 });
    }

    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      console.error("Missing RAZORPAY_KEY_SECRET");
      return NextResponse.json({ error: "Configuration Error" }, { status: 500 });
    }

    const crypto = require('crypto');
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
    }

    // Use transaction to ensure idempotency and atomic updates
    const result = await prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({ 
        where: { id: orderId },
        include: { course: true, user: true }
      });
      
      if (!order) throw new Error("Order not found");
      if (order.userId !== userId) throw new Error("Unauthorized");
      if (order.paymentStatus === 'PAID') return { alreadyPaid: true, order };

      if (status === 'SUCCESS') {
        await tx.order.update({
          where: { id: orderId },
          data: { paymentStatus: 'PAID' }
        });

        await tx.payment.create({
          data: {
            orderId,
            amount: order.amount,
            provider: 'Razorpay',
            providerRef: paymentId || `mock_pay_${Date.now()}`,
            status: 'PAID'
          }
        });

        const enrollment = await tx.enrollment.upsert({
          where: { userId_courseId: { userId: order.userId, courseId: order.courseId } },
          update: {},
          create: {
            userId: order.userId,
            courseId: order.courseId
          }
        });

        order.paymentStatus = 'PAID';
        return { alreadyPaid: false, order, enrollment };
      } else {
        await tx.order.update({
          where: { id: orderId },
          data: { paymentStatus: 'FAILED' }
        });
        throw new Error("Payment failed");
      }
    });

    if (!result.alreadyPaid) {
      await AuditService.log({
        actor: (session!.user as any).email,
        action: "PAYMENT_VERIFIED",
        resource: "Order",
        resourceId: orderId,
      });
      await AuditService.log({
        actor: (session!.user as any).email,
        action: "ENROLLMENT_CREATED",
        resource: "Enrollment",
        resourceId: result.enrollment?.id,
      });

      if (result.order?.user?.email) {
        EmailService.sendPaymentConfirmation(
          result.order.userId,
          result.order.user.email,
          result.order.id,
          result.order.amount
        ).catch(console.error);

        if (result.order?.course?.titleEn) {
          EmailService.sendEnrollmentConfirmation(
            result.order.userId,
            result.order.user.email,
            result.order.course.titleEn
          ).catch(console.error);
        }
      }
    }

    return NextResponse.json({ success: true, order: result.order });

  } catch (error: any) {
    console.error("Verification error:", error);
    
    // Hide specific error messages from the client to prevent SQL/Prisma details leakage
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
