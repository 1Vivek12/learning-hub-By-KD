import { prisma } from '@/lib/db/prisma';
import { CourseStatus } from '@prisma/client';

export class CourseService {
  static async getPublishedCourses() {
    return prisma.course.findMany({
      where: { status: CourseStatus.PUBLISHED },
      include: {
        instructor: true,
        category: true,
      },
    });
  }

  static async getCourseBySlug(slug: string) {
    return prisma.course.findUnique({
      where: { slug },
      include: {
        instructor: true,
        category: true,
        modules: {
          include: {
            lessons: {
              orderBy: { order: 'asc' },
            },
          },
          orderBy: { order: 'asc' },
        },
      },
    });
  }

  static async getCourseById(id: string) {
    return prisma.course.findUnique({
      where: { id },
      include: {
        instructor: true,
        category: true,
        modules: {
          include: {
            lessons: {
              orderBy: { order: 'asc' },
              include: { resources: true },
            },
          },
          orderBy: { order: 'asc' },
        },
        _count: { select: { enrollments: true } },
      },
    });
  }

  static async getAllCoursesAdmin() {
    return prisma.course.findMany({
      include: {
        instructor: true,
        category: true,
        modules: {
          include: {
            lessons: { select: { id: true } },
          },
        },
        _count: { select: { enrollments: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async createCourse(data: any) {
    return prisma.course.create({ data });
  }

  static async updateCourse(id: string, data: any) {
    return prisma.course.update({ where: { id }, data });
  }

  static async publishCourse(id: string) {
    return prisma.course.update({
      where: { id },
      data: { status: CourseStatus.PUBLISHED },
    });
  }

  static async unpublishCourse(id: string) {
    return prisma.course.update({
      where: { id },
      data: { status: CourseStatus.DRAFT },
    });
  }

  static async deleteCourse(id: string) {
    // Safety: check for enrollments
    const enrollmentCount = await prisma.enrollment.count({ where: { courseId: id } });
    if (enrollmentCount > 0) {
      throw new Error('COURSE_HAS_ENROLLMENTS');
    }
    return prisma.course.delete({ where: { id } });
  }
}
