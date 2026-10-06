import { prisma } from "@/lib/db/prisma";
import crypto from "crypto";
import { EmailService } from "./emailService";
import { ProgressService } from "./progressService";

export interface CertificateEligibility {
  isEligible: boolean;
  reason?: string;
  enrollment?: any;
}

export class CertificateService {
  /**
   * Determine certificate eligibility entirely server-side.
   * Reuses TASK #5's hardened ProgressService for completion verification.
   */
  static async getCertificateEligibility(userId: string, courseId: string): Promise<CertificateEligibility> {
    const enrollment = await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId, courseId } },
      include: { course: true, user: true }
    });

    if (!enrollment) return { isEligible: false, reason: "No enrollment found." };

    // Security Fix: Reject invalid enrollment states
    if (enrollment.status === 'CANCELLED' || enrollment.status === 'EXPIRED') {
      return { isEligible: false, reason: "Enrollment is no longer active." };
    }

    if (enrollment.status !== "COMPLETED") {
      return { isEligible: false, reason: "Course not completed." };
    }

    // Security Fix: Do NOT trust enrollment.status alone.
    // Re-verify actual completion from authoritative progress/quiz state.
    const progress = await ProgressService.getCourseProgress(userId, courseId);
    if (progress.percentage < 100) {
      return { isEligible: false, reason: "Not all lessons have been completed." };
    }

    // Security Fix: Verify all quizzes in the course are passed
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
      for (const quiz of quizzesInCourse) {
        const passedAttempt = await prisma.quizAttempt.findFirst({
          where: {
            quizId: quiz.id,
            userId,
            passed: true
          }
        });

        if (!passedAttempt) {
          return { isEligible: false, reason: "Not all quiz requirements have been satisfied." };
        }
      }
    }

    // Check if certificate already exists
    const existingCert = await prisma.certificate.findUnique({
      where: { enrollmentId: enrollment.id }
    });

    if (existingCert) return { isEligible: false, reason: "Certificate already issued." };

    // Also check by userId + courseId unique constraint
    const existingCertByCourse = await prisma.certificate.findUnique({
      where: { userId_courseId: { userId, courseId } }
    });

    if (existingCertByCourse) return { isEligible: false, reason: "Certificate already issued." };

    return { isEligible: true, enrollment };
  }

  /**
   * Issues the certificate safely. All identity and data are derived server-side.
   */
  static async issueCertificate(userId: string, courseId: string) {
    const eligibility = await this.getCertificateEligibility(userId, courseId);
    
    if (!eligibility.isEligible || !eligibility.enrollment) {
      throw new Error(eligibility.reason || "Not eligible for certificate.");
    }

    const { enrollment } = eligibility;
    
    // Generate cryptographically secure parts — never client-controlled
    const randomBytes = crypto.randomBytes(4).toString('hex').toUpperCase();
    const certificateNumber = `SF-${new Date().getFullYear()}-${randomBytes}`;
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const domain = process.env.NEXT_PUBLIC_APP_URL || "https://learning-hub-by-kd.vercel.app";
    const qrVerificationUrl = `${domain}/verify/${certificateNumber}`;

    // Security Fix: Derive course from enrollment, not client input
    const course = await prisma.course.findUnique({
      where: { id: enrollment.courseId },
      include: { instructor: true }
    });

    if (!course) throw new Error("Course not found");

    const pdfUrl = `${domain}/api/certificates/pdf/${certificateNumber}`;

    // Security Fix: All snapshot data derived from authoritative DB records
    const certificate = await prisma.certificate.create({
      data: {
        certificateNumber,
        userId,
        courseId: enrollment.courseId, // Always from enrollment, never from client
        enrollmentId: enrollment.id,
        studentName: enrollment.user.name, // From User record
        courseTitle: course.titleEn, // From Course record
        instructorName: course.instructor.name, // From Instructor record
        verificationToken,
        qrVerificationUrl,
        pdfUrl,
        completedAt: enrollment.completedAt || new Date()
      }
    });

    // Send email notification (non-blocking side effect after commit)
    await EmailService.sendCertificateIssued(
      userId, 
      enrollment.user.email, 
      course.titleEn, 
      qrVerificationUrl
    ).catch(() => {}); // Don't fail certificate issuance if email fails

    return certificate;
  }
}
