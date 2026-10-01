import { NextResponse } from "next/server";
import { getApiAdmin } from "@/lib/auth/utils";
import { prisma } from "@/lib/db/prisma";
import { AuditService } from "@/lib/services/auditService";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  try {
    const { session, errorResponse } = await getApiAdmin();
    if (errorResponse) return errorResponse;
    const orderId = resolvedParams.id;
    
    // In production, we'd use a payment gateway SDK to initiate refund
    // const rzp = new window.Razorpay({...})
    // await rzp.refunds.create({ payment_id: payment.providerRef })
    
    // For this architecture foundation, we update the DB state
    const result = await prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({
        where: { id: orderId },
        include: { payments: true }
      });
      
      if (!order) {
        throw new Error("ORDER_NOT_FOUND");
      }
      if (order.paymentStatus === 'REFUNDED') {
        throw new Error("ORDER_ALREADY_REFUNDED");
      }
      if (order.paymentStatus !== 'PAID') {
        throw new Error("ORDER_NOT_PAID");
      }
      
      const updatedOrder = await tx.order.update({
        where: { id: orderId },
        data: { paymentStatus: 'REFUNDED' }
      });
      
      // Attempt to revoke enrollment
      await tx.enrollment.deleteMany({
        where: { userId: order.userId, courseId: order.courseId }
      });
      
      return updatedOrder;
    });

    await AuditService.log({
      actor: (session!.user as any).email,
      action: "REFUND_COMPLETED",
      resource: "Order",
      resourceId: orderId,
    });

    return NextResponse.json({ success: true, order: result });
  } catch (error: any) {
    
    if (error.message === "ORDER_ALREADY_REFUNDED") {
      return NextResponse.json({ error: "Order is already refunded" }, { status: 400 });
    }
    if (error.message === "ORDER_NOT_PAID") {
      return NextResponse.json({ error: "Order is not paid" }, { status: 400 });
    }
    if (error.message === "ORDER_NOT_FOUND") {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
