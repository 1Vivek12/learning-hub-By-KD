import { prisma } from "@/lib/db/prisma";
import { CourseAccessService } from "./courseAccessService";

export class ProgressService {
  /**
   * Updates video progress and returns updated record
   */
  static async updateLessonProgress(userId: string, lessonId: string, currentPosition: number, percentage: number) {
    // Sanity checks
    if (percentage > 100) percentage = 100;
    if (percentage < 0) percentage = 0;
    if (currentPosition < 0) currentPosition = 0;

    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: { module: true }
    });

    if (!lesson) throw new Error("Lesson not found");

    const courseId = lesson.module.courseId;

    // Require active enrollment before updating progress
    await CourseAccessService.requireCourseAccess(userId, courseId);

    const record = await prisma.lessonProgress.upsert({
      where: { userId_lessonId: { userId, lessonId } },
      create: {
        userId,
        lessonId,
        courseId,
        lastPosition: currentPosition,
        percentage,
        isCompleted: percentage >= 95 // Auto-complete at 95%
      },
      update: {
        lastPosition: currentPosition,
        percentage: { set: Math.max(percentage) }, // ensure we don't go backwards in % if they replay
        isCompleted: percentage >= 95 ? true : undefined,
        completedAt: percentage >= 95 ? new Date() : undefined
      }
    });

    if (record.isCompleted) {
      await this.checkCourseCompletion(userId, courseId);
    }

    return record;
  }

  static async markLessonComplete(userId: string, lessonId: string) {
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: { module: true }
    });

    if (!lesson) throw new Error("Lesson not found");

    const courseId = lesson.module.courseId;

    // Require active enrollment before modifying progress
    await CourseAccessService.requireCourseAccess(userId, courseId);

    const record = await prisma.lessonProgress.upsert({
      where: { userId_lessonId: { userId, lessonId } },
      create: {
        userId,
        lessonId,
        courseId,
        lastPosition: lesson.durationMinutes * 60,
        percentage: 100,
        isCompleted: true,
        completedAt: new Date()
      },
      update: {
        percentage: 100,
        isCompleted: true,
        completedAt: new Date()
      }
    });

    await this.checkCourseCompletion(userId, courseId);
    return record;
  }

  static async getCourseProgress(userId: string, courseId: string) {
    const lessonsCount = await prisma.lesson.count({
      where: { module: { courseId } }
    });

    if (lessonsCount === 0) return { percentage: 0, completedLessons: 0, totalLessons: 0 };

    const completedCount = await prisma.lessonProgress.count({
      where: { userId, courseId, isCompleted: true }
    });

    const percentage = Math.round((completedCount / lessonsCount) * 100);

    return {
      percentage,
      completedLessons: completedCount,
      totalLessons: lessonsCount
    };
  }

  static async checkCourseCompletion(userId: string, courseId: string) {
    const enrollment = await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId, courseId } }
    });

    if (!enrollment) {
      throw new Error("ENROLLMENT_NOT_FOUND");
    }

    const progress = await this.getCourseProgress(userId, courseId);
    
    if (progress.percentage === 100) {
      // Mark enrollment as complete
      await prisma.enrollment.update({
        where: { userId_courseId: { userId, courseId } },
        data: { status: 'COMPLETED', completedAt: new Date() }
      });
    }
  }
}

