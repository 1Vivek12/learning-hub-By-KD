# Production Environment Variable Audit

This document outlines every environment variable actually referenced by the application code. No variables have been invented; this is a strict reflection of the current codebase.

## 1. Core Platform & Database

| Variable | Referenced In | Required | Secret/Public | Vercel Config | Description / Notes |
|----------|---------------|----------|---------------|---------------|---------------------|
| `NODE_ENV` | Multiple (`authService.tsx`, `prisma.ts`, `Navbar.tsx`, etc.) | Yes | Public | Auto | Automatically set by Node/Vercel (development/production). Controls dev-only UI tools and seed script execution. |
| `DATABASE_URL` | Prisma config | Yes | Secret | Yes | Connection string for Prisma queries. |
| `DIRECT_URL` | Prisma config | Yes | Secret | Yes | Direct connection string for Prisma migrations. |
| `NEXT_PUBLIC_APP_URL` | `certificateService.ts`, `robots.ts`, `sitemap.ts`, `layout.tsx`, etc. | Yes | Public | Yes | The canonical URL of the production application (e.g., `https://learninghub.io`). |

## 2. Authentication (NextAuth)

| Variable | Referenced In | Required | Secret/Public | Vercel Config | Description / Notes |
|----------|---------------|----------|---------------|---------------|---------------------|
| `NEXTAUTH_SECRET` | `proxy.ts`, `authOptions.ts` | Yes | Secret | Yes | Primary secret used to sign NextAuth JWTs. Must be a strong, unique, unguessable string. |
| `AUTH_SECRET` | `proxy.ts`, `authOptions.ts`, `health/route.ts` | No (Fallback) | Secret | Optional | Used as a fallback if `NEXTAUTH_SECRET` is missing. We recommend only setting `NEXTAUTH_SECRET` in production for simplicity. |
| `NEXTAUTH_URL` | NextAuth core (implicit) | Yes | Public | Yes | The canonical URL used by NextAuth to resolve callbacks. Typically matches `NEXT_PUBLIC_APP_URL`. |

## 3. Payments (Razorpay)

| Variable | Referenced In | Required | Secret/Public | Vercel Config | Description / Notes |
|----------|---------------|----------|---------------|---------------|---------------------|
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | `CheckoutModal.tsx`, `create-order/route.ts` | Yes (for payments) | Public | Yes | Razorpay public key ID used to initialize the client-side checkout widget. |
| `RAZORPAY_KEY_SECRET` | `verify/route.ts`, `create-order/route.ts`, `health/route.ts` | Yes (for payments) | Secret | Yes | Secret key used to create orders and verify payment signatures securely on the server. |
| `RAZORPAY_WEBHOOK_SECRET` | `webhook/route.ts` | Yes (for webhooks) | Secret | Yes | Secret used to verify incoming webhook payloads from Razorpay. |

## 4. Live Classes (LiveKit)

| Variable | Referenced In | Required | Secret/Public | Vercel Config | Description / Notes |
|----------|---------------|----------|---------------|---------------|---------------------|
| `NEXT_PUBLIC_LIVEKIT_URL` | `token/route.ts` | Yes (for live classes) | Public | Yes | The WebRTC/WebSocket endpoint for the LiveKit server. |
| `LIVEKIT_API_KEY` | `liveKitService.ts` | Yes (for live classes) | Secret | Yes | API Key to generate room access tokens. |
| `LIVEKIT_API_SECRET` | `liveKitService.ts`, `health/route.ts` | Yes (for live classes) | Secret | Yes | API Secret to sign room access tokens. |

## 5. Storage / Certificates

| Variable | Referenced In | Required | Secret/Public | Vercel Config | Description / Notes |
|----------|---------------|----------|---------------|---------------|---------------------|
| `STORAGE_PROVIDER` | `health/route.ts` | No | Public | Optional | Health check flag (e.g., 'R2', 'S3'). |
| `STORAGE_ACCESS_KEY_ID` | `CertificateStorageProvider.ts` | Yes (if using storage) | Secret | Yes | Object storage access key (e.g., Cloudflare R2). |
| `STORAGE_SECRET_ACCESS_KEY`| `CertificateStorageProvider.ts` | Yes (if using storage) | Secret | Yes | Object storage secret key. |
| `STORAGE_BUCKET_NAME` | `CertificateStorageProvider.ts` | Yes (if using storage) | Public | Yes | The name of the storage bucket. |
| `NEXT_PUBLIC_STORAGE_URL` | `CertificateStorageProvider.ts` | No | Public | Optional | Custom domain for the storage bucket. Fallbacks to R2 URL pattern. |

## 6. Email (SMTP)

| Variable | Referenced In | Required | Secret/Public | Vercel Config | Description / Notes |
|----------|---------------|----------|---------------|---------------|---------------------|
| `SMTP_HOST` | `emailService.ts` | No | Public | Optional | SMTP Server Hostname. |
| `SMTP_USER` | `emailService.ts` | No | Public | Optional | SMTP Username. |
| `SMTP_PASS` | `emailService.ts` | No | Secret | Optional | SMTP Password. |
| `EMAIL_FROM` | `emailService.ts` | No | Public | Optional | Sender email address (e.g., `noreply@learninghub.io`). |

## Summary of Vercel Configuration

For a complete production deployment, you **MUST** configure the following variables in the Vercel dashboard before deploying:

1. `DATABASE_URL`
2. `DIRECT_URL`
3. `NEXTAUTH_SECRET`
4. `NEXTAUTH_URL`
5. `NEXT_PUBLIC_APP_URL`

If enabling Payments, Live Classes, or Storage, you must also add the respective block of variables listed above.
