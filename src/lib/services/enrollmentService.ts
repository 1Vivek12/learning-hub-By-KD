import { prisma } from '@/lib/db/prisma';
import { EnrollmentStatus } from '@prisma/client';

export class EnrollmentService {
  static async getEnrollmentsByUser(userId: string) {
    return prisma.enrollment.findMany({
      where: { userId, status: EnrollmentStatus.ACTIVE },
      include: {
        course: {
          include: {
            instructor: true,
          }
        }
      },
      orderBy: { enrolledAt: 'desc' }
    });
  }

  static async getEnrollment(userId: string, courseId: string) {
    return prisma.enrollment.findUnique({
      where: {
        userId_courseId: { userId, courseId }
      }
    });
  }

  static async createEnrollment(userId: string, courseId: string) {
    return prisma.enrollment.upsert({
      where: {
        userId_courseId: { userId, courseId }
      },
      update: { status: EnrollmentStatus.ACTIVE },
      create: { userId, courseId, status: EnrollmentStatus.ACTIVE }
    });
  }

  static async getAllEnrollmentsAdmin() {
    return prisma.enrollment.findMany({
      include: {
        user: { select: { id: true, name: true, email: true } },
        course: { select: { id: true, titleEn: true, slug: true } }
      },
      orderBy: { enrolledAt: 'desc' }
    });
  }

  static async updateEnrollmentStatus(id: string, status: EnrollmentStatus) {
    return prisma.enrollment.update({
      where: { id },
      data: { status }
    });
  }
}
