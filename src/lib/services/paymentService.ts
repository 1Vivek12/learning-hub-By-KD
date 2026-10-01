import { prisma } from '@/lib/db/prisma';

export class PaymentService {
  static async createPayment(data: {
    orderId: string;
    amount: number;
    provider: string;
    providerRef?: string;
  }) {
    return prisma.payment.create({ data });
  }

  static async getPaymentsByOrder(orderId: string) {
    return prisma.payment.findMany({
      where: { orderId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
