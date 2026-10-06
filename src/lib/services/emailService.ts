import { NotificationService } from './notificationService';
import { prisma } from '@/lib/db/prisma';
import nodemailer from 'nodemailer';

// Helper to escape untrusted user input before injecting into email HTML
function escapeHtml(unsafe: string): string {
  if (!unsafe) return "";
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
    .replace(/\r?\n/g, "<br>"); // Handle newlines safely
}

// Ensure header values don't contain CRLF injections
function sanitizeHeader(value: string): string {
  if (!value) return "";
  return value.replace(/\r?\n|\r/g, " ").trim();
}

// Singleton transporter to reuse connection pool across requests if the lambda stays warm
let transporter: nodemailer.Transporter | null = null;

export class EmailService {
  private static getTransporter(): nodemailer.Transporter | null {
    if (transporter) return transporter;

    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, SMTP_FROM, SMTP_SECURE } = process.env;

    if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASSWORD || !SMTP_FROM) {
      return null;
    }

    const port = parseInt(SMTP_PORT, 10);
    if (isNaN(port)) return null;

    transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port,
      secure: SMTP_SECURE === 'true' || port === 465,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASSWORD,
      }
    });

    return transporter;
  }

  private static isValidEmail(email: string): boolean {
    if (!email || typeof email !== 'string') return false;
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email.trim());
  }

  static async getUserPreferences(userId: string) {
    try {
      const setting = await prisma.siteSetting.findUnique({
        where: { key: `user_prefs_${userId}` }
      });
      if (setting && setting.value) return setting.value as any;
    } catch (e) {}
    
    return {
      emailMarketing: false,
      emailCourseUpdates: true,
      emailLiveClasses: true,
      emailCertificates: true,
      emailSecurity: true
    };
  }

  /**
   * Core send logic. It isolates SMTP failure from business transactions.
   */
  static async sendEmail(to: string, subject: string, htmlBody: string): Promise<boolean> {
    const toEmail = sanitizeHeader(to).trim();
    if (!this.isValidEmail(toEmail)) {
      console.warn("[EmailService] Rejected invalid recipient email");
      return false;
    }

    const safeSubject = sanitizeHeader(subject);
    const transport = this.getTransporter();
    
    if (!transport) {
      console.log(`[EmailService] SMTP NOT CONFIGURED. Bypassed sending to ${toEmail}: ${safeSubject}`);
      return false;
    }

    const fromAddress = sanitizeHeader(process.env.SMTP_FROM || "");
    if (!fromAddress) return false;

    try {
      await transport.sendMail({
        from: fromAddress,
        to: toEmail,
        subject: safeSubject,
        html: htmlBody,
      });
      console.log(`[EmailService] Email successfully sent to ${toEmail}`);
      return true;
    } catch (error: any) {
      // Safe error logging: Do not leak credentials.
      console.error(`[EmailService] Failed to send email to ${toEmail}:`, error.message || "Unknown SMTP Error");
      return false;
    }
  }

  // EVENT INTEGRATIONS
  // These fire-and-forget the email (returning void/ignoring success) so that
  // the main transaction (like registration or payment) isn't blocked or reverted.

  static async sendWelcomeEmail(userId: string, email: string, name: string) {
    const safeName = escapeHtml(name);
    const subject = `Welcome to Learning Hub by KD, ${safeName}!`;
    const htmlBody = `
      <h1>Welcome to Learning Hub by KD</h1>
      <p>Your account has been successfully created. We're excited to have you.</p>
    `;
    
    // In-app notification remains independent
    await NotificationService.createNotification({
      userId,
      title: "Welcome to Learning Hub by KD!",
      message: "Your account is set up and ready to go.",
      type: "SYSTEM"
    }).catch(console.error);

    await this.sendEmail(email, subject, htmlBody);
  }

  static async sendEnrollmentConfirmation(userId: string, email: string, courseTitle: string) {
    const safeTitle = escapeHtml(courseTitle);
    const subject = `Enrollment Confirmed: ${safeTitle}`;
    const htmlBody = `
      <h1>Enrollment Successful</h1>
      <p>You have successfully enrolled in <strong>${safeTitle}</strong>. You can start learning right away!</p>
    `;

    await NotificationService.createNotification({
      userId,
      title: "Enrollment Confirmed",
      message: `You are now enrolled in ${safeTitle}.`,
      type: "COURSE_UPDATE"
    }).catch(console.error);

    const prefs = await this.getUserPreferences(userId);
    if (prefs.emailCourseUpdates) {
      await this.sendEmail(email, subject, htmlBody);
    }
  }

  static async sendPaymentConfirmation(userId: string, email: string, orderId: string, amount: number) {
    const safeOrderId = escapeHtml(orderId);
    const safeAmount = escapeHtml(amount.toString());
    const subject = `Payment Received for Order #${safeOrderId}`;
    const htmlBody = `
      <h1>Payment Confirmation</h1>
      <p>We received your payment of ₹${safeAmount}. Thank you for your purchase from Learning Hub by KD.</p>
    `;

    await NotificationService.createNotification({
      userId,
      title: "Payment Successful",
      message: `Payment of ₹${safeAmount} received for order #${safeOrderId}.`,
      type: "PAYMENT"
    }).catch(console.error);

    const prefs = await this.getUserPreferences(userId);
    if (prefs.emailCourseUpdates) {
      await this.sendEmail(email, subject, htmlBody);
    }
  }

  static async sendLiveClassReminder(userId: string, email: string, classTitle: string, joinUrl: string) {
    const safeTitle = escapeHtml(classTitle);
    
    // Validate joinUrl
    let safeUrl = "#";
    try {
      const parsedUrl = new URL(joinUrl);
      if (parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:') {
        safeUrl = parsedUrl.toString();
      }
    } catch (e) {
      console.warn("[EmailService] Invalid URL provided to sendLiveClassReminder");
    }

    const subject = `Reminder: Live Class "${safeTitle}" is starting soon!`;
    const htmlBody = `
      <h1>Live Class Reminder</h1>
      <p>Your live class <strong>${safeTitle}</strong> is starting soon.</p>
      <p><a href="${escapeHtml(safeUrl)}">Join here</a></p>
    `;

    await NotificationService.createNotification({
      userId,
      title: "Live Class Starting Soon",
      message: `Your class ${safeTitle} is starting shortly.`,
      type: "SYSTEM"
    }).catch(console.error);

    const prefs = await this.getUserPreferences(userId);
    if (prefs.emailLiveClasses) {
      await this.sendEmail(email, subject, htmlBody);
    }
  }

  static async sendCertificateIssued(userId: string, email: string, courseTitle: string, certUrl: string) {
    const safeTitle = escapeHtml(courseTitle);
    
    let safeUrl = "#";
    try {
      const parsedUrl = new URL(certUrl);
      if (parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:') {
        safeUrl = parsedUrl.toString();
      }
    } catch (e) {
      console.warn("[EmailService] Invalid URL provided to sendCertificateIssued");
    }

    const subject = `Congratulations! Your certificate for ${safeTitle} is ready`;
    const htmlBody = `
      <h1>Certificate Issued</h1>
      <p>Congratulations on completing <strong>${safeTitle}</strong> at Learning Hub by KD.</p>
      <p>You can view and download your certificate here: <a href="${escapeHtml(safeUrl)}">View Certificate</a></p>
    `;

    await NotificationService.createNotification({
      userId,
      title: "Certificate Issued!",
      message: `Your certificate for ${safeTitle} is now available.`,
      type: "SYSTEM"
    }).catch(console.error);

    const prefs = await this.getUserPreferences(userId);
    if (prefs.emailCertificates) {
      await this.sendEmail(email, subject, htmlBody);
    }
  }

  static async sendPasswordReset(email: string, resetLink: string) {
    let safeUrl = "#";
    try {
      const parsedUrl = new URL(resetLink);
      if (parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:') {
        safeUrl = parsedUrl.toString();
      }
    } catch (e) {
      console.warn("[EmailService] Invalid URL provided to sendPasswordReset");
      return; // Do not send if link is invalid
    }

    const subject = `Learning Hub by KD - Password Reset Request`;
    const htmlBody = `
      <h1>Password Reset</h1>
      <p>Click <a href="${escapeHtml(safeUrl)}">here</a> to reset your password. If you didn't request this, please ignore.</p>
    `;

    await this.sendEmail(email, subject, htmlBody);
  }
}
