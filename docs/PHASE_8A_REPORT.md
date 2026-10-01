# Phase 8A Development Report
## Notification & Email Backend

### Overview
Phase 8A focused on building the foundational notification and email communication layer for the platform. It establishes a centralized Notification model in the database, REST APIs for managing notifications, and a modular EmailService with template abstraction.

### 1. Schema & Database
- The schema uses the existing `Notification` model which stores `userId`, `title`, `message`, `type`, and `readAt` timestamp.
- Allows the UI to show both total history and currently unread counts effortlessly.

### 2. Service Architecture
#### NotificationService
- `getNotificationsForUser`: Fetches 50 most recent notifications, with options for unread-only.
- `createNotification`: Internal method used by system events to write notifications.
- `markAsRead` / `markAllAsRead`: Allows a user to acknowledge notifications, storing the current date in `readAt`.

#### EmailService
- Provides an abstraction layer for email (`src/lib/services/emailService.ts`).
- Uses environment-based configuration (`SMTP_HOST`, `SMTP_USER`, `SMTP_PASS`).
- Has development-safe behavior: it logs the email to the console instead of crashing if SMTP variables are not set.
- Generates corresponding in-app `Notification` database entries whenever an email is successfully "sent".

### 3. API Endpoints
- `GET /api/notifications` (Returns unread counts and up to 50 recent notifications)
- `POST /api/notifications/[id]/read` (Marks a single notification as read securely)
- `POST /api/notifications/read-all` (Marks all unread notifications as read for the user)

### 4. Email Templates and Event Integrations
Implemented reusable templates and hooked them directly into the relevant business flows:
1. **Welcome Email:** Triggered in `src/app/api/auth/register/route.ts` upon successful creation.
2. **Payment Confirmation:** Triggered in `src/app/api/payments/verify/route.ts` when order status transitions to PAID.
3. **Enrollment Confirmation:** Triggered in `src/app/api/payments/verify/route.ts` simultaneously with payment completion.
4. **Live Class Reminder:** Hooked into `LiveClassService.startClass`, fetching all actively enrolled students and dispatching a reminder with the join URL.
5. **Certificate Issued:** Hooked into `CertificateService.issueCertificate`, sending the secure URL.
6. **Password Reset:** Template exists in `EmailService`, ready to be wired up once the Forgot Password flow is built.

### Security
- **Data Isolation:** Both GET and POST endpoints verify user session (`requireAuth()`) and enforce operations only within their scope.
- **Credential Protection:** Secrets are scoped purely to `EmailService` relying solely on `process.env`.
- **Fail-safes:** Email triggers operate asynchronously (`.catch(console.error)`) or gracefully log rather than halting core workflows like transactions.

### Remaining Work
- Notification UI: Build the frontend `NotificationDropdown.tsx` or bell icon to poll/fetch the unread counts.
- Production Email Provider: Hook `nodemailer` or `Resend` SDK directly into `EmailService.sendEmail`.
