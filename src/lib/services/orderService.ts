import { prisma } from '@/lib/db/prisma';

export class OrderService {
  static async getOrdersByUser(userId: string) {
    return prisma.order.findMany({
      where: { userId },
      include: { course: true, coupon: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async getAllOrders() {
    return prisma.order.findMany({
      include: { user: { select: { id: true, name: true, email: true } }, course: true, coupon: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async getOrderById(id: string) {
    return prisma.order.findUnique({
      where: { id },
      include: { user: { select: { id: true, name: true, email: true } }, course: true, payments: true },
    });
  }

  static async createOrder(data: {
    userId: string;
    courseId: string;
    amount: number;
    discount?: number;
    couponId?: string;
  }) {
    return prisma.order.create({ data });
  }

  static async getOrderCount() {
    return prisma.order.count();
  }

  static async getRevenue() {
    const result = await prisma.order.aggregate({
      where: { paymentStatus: 'PAID' },
      _sum: { amount: true },
    });
    return result._sum.amount || 0;
  }
}
