import { prisma } from "@/lib/db/prisma";
import { CourseAccessService } from "./courseAccessService";

export class ProgressService {
  /**
   * Updates video progress and returns updated record.
   * Server-side validation ensures progress values are legitimate.
   */
  static async updateLessonProgress(userId: string, lessonId: string, currentPosition: number, percentage: number) {
    // Strict input validation
    if (typeof percentage !== 'number' || isNaN(percentage) || !isFinite(percentage)) {
      percentage = 0;
    }
    if (typeof currentPosition !== 'number' || isNaN(currentPosition) || !isFinite(currentPosition)) {
      currentPosition = 0;
    }
    if (percentage > 100) percentage = 100;
    if (percentage < 0) percentage = 0;
    if (currentPosition < 0) currentPosition = 0;

    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: { module: true }
    });

    if (!lesson) throw new Error("Lesson not found");

    // Security Fix: Derive courseId from the lesson's module, never trust client
    const courseId = lesson.module.courseId;

    // Require active enrollment before updating progress
    await CourseAccessService.requireCourseAccess(userId, courseId);

    // Cap currentPosition to lesson duration (in seconds) if known
    const maxPositionSeconds = lesson.durationMinutes * 60;
    if (maxPositionSeconds > 0 && currentPosition > maxPositionSeconds) {
      currentPosition = maxPositionSeconds;
    }

    // Fetch existing progress to prevent regression
    const existingProgress = await prisma.lessonProgress.findUnique({
      where: { userId_lessonId: { userId, lessonId } }
    });

    // Security Fix: Do not auto-complete from client-controlled percentage alone.
    // Completion should only happen through markLessonComplete which validates quiz requirements.
    const record = await prisma.lessonProgress.upsert({
      where: { userId_lessonId: { userId, lessonId } },
      create: {
        userId,
        lessonId,
        courseId,
        lastPosition: currentPosition,
        percentage,
        isCompleted: false // Never auto-complete from progress updates
      },
      update: {
        lastPosition: currentPosition,
        // Security Fix: Only allow percentage to increase, never decrease
        percentage: existingProgress ? Math.max(existingProgress.percentage, percentage) : percentage,
      }
    });

    return record;
  }

  /**
   * Marks a lesson as complete. Enforces quiz requirements for quiz-type lessons.
   */
  static async markLessonComplete(userId: string, lessonId: string) {
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: { module: true, quiz: true }
    });

    if (!lesson) throw new Error("Lesson not found");

    const courseId = lesson.module.courseId;

    // Require active enrollment before modifying progress
    await CourseAccessService.requireCourseAccess(userId, courseId);

    // Security Fix: If the lesson has a quiz, the user must have passed it
    if (lesson.quiz) {
      const passedAttempt = await prisma.quizAttempt.findFirst({
        where: {
          quizId: lesson.quiz.id,
          userId,
          passed: true
        }
      });

      if (!passedAttempt) {
        throw new Error("QUIZ_NOT_PASSED");
      }
    }

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

  /**
   * Gets course progress. Only counts PUBLISHED lessons for the total.
   */
  static async getCourseProgress(userId: string, courseId: string) {
    // Security Fix: Only count PUBLISHED lessons that students can actually access
    const lessonsCount = await prisma.lesson.count({
      where: {
        module: { courseId },
        status: 'PUBLISHED'
      }
    });

    if (lessonsCount === 0) return { percentage: 0, completedLessons: 0, totalLessons: 0 };

    // Security Fix: Only count progress for PUBLISHED lessons
    const completedCount = await prisma.lessonProgress.count({
      where: {
        userId,
        courseId,
        isCompleted: true,
        lesson: { status: 'PUBLISHED' }
      }
    });

    const percentage = Math.round((completedCount / lessonsCount) * 100);

    return {
      percentage,
      completedLessons: completedCount,
      totalLessons: lessonsCount
    };
  }

  /**
   * Checks course completion. Verifies all published lessons are completed
   * and all quiz requirements are satisfied before marking enrollment complete.
   */
  static async checkCourseCompletion(userId: string, courseId: string) {
    const enrollment = await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId, courseId } }
    });

    if (!enrollment) {
      throw new Error("ENROLLMENT_NOT_FOUND");
    }

    // Don't re-process already completed enrollments
    if (enrollment.status === 'COMPLETED') return;

    const progress = await this.getCourseProgress(userId, courseId);
    
    if (progress.percentage === 100) {
      // Security Fix: Double-check that all quizzes in this course are passed
      const quizzesInCourse = await prisma.quiz.findMany({
        where: {
          lesson: {
            status: 'PUBLISHED',
            module: { courseId }
          }
        },
        select: { id: true }
      });

      if (quizzesInCourse.length > 0) {
        const passedQuizCount = await prisma.quizAttempt.count({
          where: {
            userId,
            quizId: { in: quizzesInCourse.map(q => q.id) },
            passed: true
          }
        });

        // All quizzes must have at least one passed attempt
        if (passedQuizCount < quizzesInCourse.length) {
          return; // Not all quizzes passed — do not complete course
        }
      }

      // Mark enrollment as complete
      await prisma.enrollment.update({
        where: { userId_courseId: { userId, courseId } },
        data: { status: 'COMPLETED', completedAt: new Date() }
      });
    }
  }
}
