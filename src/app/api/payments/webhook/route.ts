import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { AuditService } from "@/lib/services/auditService";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("x-razorpay-signature");

    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }

    // Verify signature strictly
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!secret) {
      console.error("Missing RAZORPAY_WEBHOOK_SECRET");
      return NextResponse.json({ error: "Configuration Error" }, { status: 500 });
    }
    
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(rawBody)
      .digest("hex");

    if (expectedSignature !== signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const event = JSON.parse(rawBody);

    if (event.event === "payment.captured") {
      const paymentData = event.payload.payment.entity;
      const orderId = paymentData.notes?.orderId; // Requires passing orderId in notes during creation

      if (orderId) {
        await prisma.$transaction(async (tx) => {
          const order = await tx.order.findUnique({ where: { id: orderId } });
          if (order && order.paymentStatus !== 'PAID') {
            await tx.order.update({
              where: { id: orderId },
              data: { paymentStatus: 'PAID' }
            });
            await tx.payment.create({
              data: {
                orderId,
                amount: order.amount,
                provider: 'Razorpay',
                providerRef: paymentData.id,
                status: 'PAID'
              }
            });
            await tx.enrollment.upsert({
              where: { userId_courseId: { userId: order.userId, courseId: order.courseId } },
              update: {},
              create: {
                userId: order.userId,
                courseId: order.courseId
              }
            });
          }
        });
      }
    }

    return NextResponse.json({ status: "ok" });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
