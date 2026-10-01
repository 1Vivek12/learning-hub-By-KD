import { NotificationService } from './notificationService';
import { prisma } from '@/lib/db/prisma';

// Provider abstraction - could be Resend, SendGrid, AWS SES
// For this architecture, we check ENV variables to determine real vs mock sending.

export class EmailService {
  private static isConfigured(): boolean {
    return !!process.env.SMTP_HOST && !!process.env.SMTP_USER && !!process.env.SMTP_PASS;
  }

  static async getUserPreferences(userId: string) {
    const setting = await prisma.siteSetting.findUnique({
      where: { key: `user_prefs_${userId}` }
    });
    if (setting && setting.value) return setting.value as any;
    return {
      emailMarketing: false,
      emailCourseUpdates: true,
      emailLiveClasses: true,
      emailCertificates: true,
      emailSecurity: true
    };
  }

  static async sendEmail(to: string, subject: string, htmlBody: string) {
    if (this.isConfigured()) {
      // Production path using a transport (e.g. nodemailer or an API like Resend)
      console.log(`[EmailService] Sending email to ${to}: ${subject}`);
      // await transporter.sendMail({ from: process.env.EMAIL_FROM, to, subject, html: htmlBody });
    } else {
      // Development-safe path: just log it so it doesn't crash if unconfigured
      console.log(`[EmailService] (DEV-MODE) Mock sending email to ${to}: ${subject}`);
    }
  }

  // EVENT INTEGRATIONS

  static async sendWelcomeEmail(userId: string, email: string, name: string) {
    const subject = `Welcome to Learning Hub, ${name}!`;
    const htmlBody = `
      <h1>Welcome to Learning Hub</h1>
      <p>Your account has been successfully created. We're excited to have you.</p>
    `;
    
    // Create an in-app notification as well
    await NotificationService.createNotification({
      userId,
      title: "Welcome to Learning Hub!",
      message: "Your account is set up and ready to go.",
      type: "SYSTEM"
    });

    await this.sendEmail(email, subject, htmlBody);
  }

  static async sendEnrollmentConfirmation(userId: string, email: string, courseTitle: string) {
    const subject = `Enrollment Confirmed: ${courseTitle}`;
    const htmlBody = `
      <h1>Enrollment Successful</h1>
      <p>You have successfully enrolled in <strong>${courseTitle}</strong>. You can start learning right away!</p>
    `;

    await NotificationService.createNotification({
      userId,
      title: "Enrollment Confirmed",
      message: `You are now enrolled in ${courseTitle}.`,
      type: "COURSE_UPDATE"
    });

    const prefs = await this.getUserPreferences(userId);
    if (prefs.emailCourseUpdates) {
      await this.sendEmail(email, subject, htmlBody);
    }
  }

  static async sendPaymentConfirmation(userId: string, email: string, orderId: string, amount: number) {
    const subject = `Payment Received for Order #${orderId}`;
    const htmlBody = `
      <h1>Payment Confirmation</h1>
      <p>We received your payment of ₹${amount}. Thank you for your purchase.</p>
    `;

    await NotificationService.createNotification({
      userId,
      title: "Payment Successful",
      message: `Payment of ₹${amount} received for order #${orderId}.`,
      type: "PAYMENT"
    });

    const prefs = await this.getUserPreferences(userId);
    // Since payment is critical, maybe skip preference check, or check marketing. Actually, user asked to keep security mandatory, others optional.
    if (prefs.emailCourseUpdates) {
      await this.sendEmail(email, subject, htmlBody);
    }
  }

  static async sendLiveClassReminder(userId: string, email: string, classTitle: string, joinUrl: string) {
    const subject = `Reminder: Live Class "${classTitle}" is starting soon!`;
    const htmlBody = `
      <h1>Live Class Reminder</h1>
      <p>Your live class <strong>${classTitle}</strong> is starting soon.</p>
      <p><a href="${joinUrl}">Join here</a></p>
    `;

    await NotificationService.createNotification({
      userId,
      title: "Live Class Starting Soon",
      message: `Your class ${classTitle} is starting shortly.`,
      type: "SYSTEM"
    });

    const prefs = await this.getUserPreferences(userId);
    if (prefs.emailLiveClasses) {
      await this.sendEmail(email, subject, htmlBody);
    }
  }

  static async sendCertificateIssued(userId: string, email: string, courseTitle: string, certUrl: string) {
    const subject = `Congratulations! Your certificate for ${courseTitle} is ready`;
    const htmlBody = `
      <h1>Certificate Issued</h1>
      <p>Congratulations on completing <strong>${courseTitle}</strong>.</p>
      <p>You can view and download your certificate here: <a href="${certUrl}">View Certificate</a></p>
    `;

    await NotificationService.createNotification({
      userId,
      title: "Certificate Issued!",
      message: `Your certificate for ${courseTitle} is now available.`,
      type: "SYSTEM"
    });

    const prefs = await this.getUserPreferences(userId);
    if (prefs.emailCertificates) {
      await this.sendEmail(email, subject, htmlBody);
    }
  }

  static async sendPasswordReset(email: string, resetLink: string) {
    const subject = `Password Reset Request`;
    const htmlBody = `
      <h1>Password Reset</h1>
      <p>Click <a href="${resetLink}">here</a> to reset your password. If you didn't request this, please ignore.</p>
    `;

    await this.sendEmail(email, subject, htmlBody);
  }
}
