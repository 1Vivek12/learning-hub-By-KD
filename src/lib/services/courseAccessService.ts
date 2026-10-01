import { prisma } from "@/lib/db/prisma";

export class CourseAccessService {
  /**
   * Check if user has active enrollment
   */
  static async hasActiveEnrollment(userId: string, courseId: string): Promise<boolean> {
    const enrollment = await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId, courseId } }
    });

    return enrollment?.status === 'ACTIVE' || enrollment?.status === 'COMPLETED';
  }

  /**
   * Check if a lesson can be accessed by the user
   */
  static async canAccessLesson(userId: string | undefined, lessonId: string): Promise<boolean> {
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: { module: { include: { course: true } } }
    });

    if (!lesson) return false;

    // Free preview logic
    if (lesson.isFreePreview) return true;

    // If not free preview, we need a user
    if (!userId) return false;

    // Check enrollment
    const courseId = lesson.module.courseId;
    return this.hasActiveEnrollment(userId, courseId);
  }

  /**
   * Throw error if course cannot be accessed
   */
  static async requireCourseAccess(userId: string, courseId: string): Promise<void> {
    const hasAccess = await this.hasActiveEnrollment(userId, courseId);
    if (!hasAccess) {
      throw new Error("UNAUTHORIZED_COURSE_ACCESS");
    }
  }

  /**
   * Throw error if lesson cannot be accessed
   */
  static async requireLessonAccess(userId: string | undefined, lessonId: string): Promise<void> {
    const hasAccess = await this.canAccessLesson(userId, lessonId);
    if (!hasAccess) {
      throw new Error("UNAUTHORIZED_LESSON_ACCESS");
    }
  }
}
