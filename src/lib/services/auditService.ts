import { prisma } from '@/lib/db/prisma';

export class AuditService {
  static async log(data: {
    actor?: string;
    action: string;
    resource?: string;
    resourceId?: string;
    details?: Record<string, unknown>;
  }) {
    return prisma.auditLog.create({ 
      data: {
        ...data,
        details: data.details as any
      } 
    });
  }

  static async getAuditLogs(options?: { limit?: number; offset?: number; action?: string }) {
    const { limit = 50, offset = 0, action } = options || {};
    return prisma.auditLog.findMany({
      where: action ? { action } : undefined,
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    });
  }

  static async getAuditLogCount() {
    return prisma.auditLog.count();
  }
}
