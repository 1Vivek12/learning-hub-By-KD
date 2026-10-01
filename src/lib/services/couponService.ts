import { prisma } from '@/lib/db/prisma';

export class CouponService {
  static async getAllCoupons() {
    return prisma.coupon.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  static async getCouponByCode(code: string) {
    return prisma.coupon.findUnique({
      where: { code },
    });
  }

  static async validateCoupon(code: string): Promise<{ valid: boolean; discountPercent: number; couponId?: string }> {
    const coupon = await prisma.coupon.findUnique({ where: { code } });
    if (!coupon) return { valid: false, discountPercent: 0 };
    if (!coupon.isActive) return { valid: false, discountPercent: 0 };
    if (coupon.expiresAt && coupon.expiresAt < new Date()) return { valid: false, discountPercent: 0 };
    return { valid: true, discountPercent: coupon.discountPercent, couponId: coupon.id };
  }

  static async createCoupon(data: {
    code: string;
    discountPercent: number;
    isActive?: boolean;
    expiresAt?: Date;
  }) {
    return prisma.coupon.create({ data });
  }

  static async updateCoupon(id: string, data: Partial<{
    code: string;
    discountPercent: number;
    isActive: boolean;
    expiresAt: Date | null;
  }>) {
    return prisma.coupon.update({ where: { id }, data });
  }

  static async deleteCoupon(id: string) {
    return prisma.coupon.delete({ where: { id } });
  }
}
