import { prisma } from "@/lib/db/prisma";
import crypto from "crypto";
import { EmailService } from "./emailService";

export interface CertificateEligibility {
  isEligible: boolean;
  reason?: string;
  enrollment?: any;
}

export class CertificateService {
  /**
   * Determine certificate eligibility entirely server-side.
   */
  static async getCertificateEligibility(userId: string, courseId: string): Promise<CertificateEligibility> {
    const enrollment = await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId, courseId } },
      include: { course: true, user: true }
    });

    if (!enrollment) return { isEligible: false, reason: "No enrollment found." };
    if (enrollment.status !== "COMPLETED") return { isEligible: false, reason: "Course not completed." };

    // In a stricter system, you would sum lesson progress here. 
    // Since ProgressService marks enrollment as COMPLETED when 100% is reached, 
    // this status check suffices for our foundation.

    // Check if certificate already exists
    const existingCert = await prisma.certificate.findUnique({
      where: { enrollmentId: enrollment.id }
    });

    if (existingCert) return { isEligible: false, reason: "Certificate already issued." };

    return { isEligible: true, enrollment };
  }

  /**
   * Issues the certificate safely
   */
  static async issueCertificate(userId: string, courseId: string) {
    const eligibility = await this.getCertificateEligibility(userId, courseId);
    
    if (!eligibility.isEligible || !eligibility.enrollment) {
      throw new Error(eligibility.reason || "Not eligible for certificate.");
    }

    const { enrollment } = eligibility;
    
    // Generate cryptographically secure parts
    const randomBytes = crypto.randomBytes(4).toString('hex').toUpperCase();
    const certificateNumber = `SF-${new Date().getFullYear()}-${randomBytes}`;
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const domain = process.env.NEXT_PUBLIC_APP_URL || "https://learninghub.io";
    const qrVerificationUrl = `${domain}/verify/${certificateNumber}`;

    // Get course details for snapshot
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: { instructor: true }
    });

    if (!course) throw new Error("Course not found");

    // In a real implementation, you'd generate a PDF here and store it using CertificateStorageProvider.
    // For this phase, we save the record and mock the PDF URL.
    const pdfUrl = `${domain}/api/certificates/pdf/${certificateNumber}`;

    const certificate = await prisma.certificate.create({
      data: {
        certificateNumber,
        userId,
        courseId,
        enrollmentId: enrollment.id,
        studentName: enrollment.user.name,
        courseTitle: course.titleEn,
        instructorName: course.instructor.name,
        verificationToken,
        qrVerificationUrl,
        pdfUrl,
        completedAt: enrollment.completedAt || new Date()
      }
    });

    // Send email notification
    await EmailService.sendCertificateIssued(
      userId, 
      enrollment.user.email, 
      course.titleEn, 
      qrVerificationUrl
    );

    return certificate;
  }
}
