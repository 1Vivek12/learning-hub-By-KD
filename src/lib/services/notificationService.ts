import { prisma } from '@/lib/db/prisma';

export class NotificationService {
  static async getNotificationsForUser(userId: string, options?: { unreadOnly?: boolean }) {
    const where: any = { userId };
    if (options?.unreadOnly) {
      where.readAt = null;
    }
    return prisma.notification.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  static async createNotification(data: {
    userId: string;
    title: string;
    message: string;
    type: string;
  }) {
    return prisma.notification.create({ data });
  }

  static async markAsRead(id: string, userId: string) {
    const result = await prisma.notification.updateMany({
      where: { id, userId },
      data: { readAt: new Date() },
    });

    if (result.count === 0) {
      throw new Error("NOT_FOUND_OR_UNAUTHORIZED");
    }

    return { success: true };
  }

  static async markAllAsRead(userId: string) {
    return prisma.notification.updateMany({
      where: { userId, readAt: null },
      data: { readAt: new Date() },
    });
  }

  static async getUnreadCount(userId: string) {
    return prisma.notification.count({
      where: { userId, readAt: null },
    });
  }
}
