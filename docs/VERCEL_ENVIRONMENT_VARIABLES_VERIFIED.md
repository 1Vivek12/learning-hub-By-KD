# Verified Vercel Environment Variables

A strict, code-level static analysis was performed against the `Learning Hub by KD` repository to determine exactly which environment variables are referenced by the application logic, Prisma configuration, and Next.js setup. 

This document overrides any previous assumptions.

---

## 1. Database (Prisma & Supabase)
| Variable | Referenced? | Required at Runtime? | Required at Build? | Req in Prod? | Req in Prev? | Secret? | File Referenced |
|----------|-------------|----------------------|--------------------|--------------|--------------|---------|-----------------|
| `DATABASE_URL` | YES | YES | YES | YES | YES | **YES** | `prisma/schema.prisma` |
| `DIRECT_URL` | YES | NO | YES | YES | YES | **YES** | `prisma/schema.prisma` |
| `NEXT_PUBLIC_SUPABASE_URL` | NO | NO | NO | NO | NO | NO | N/A |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | NO | NO | NO | NO | NO | NO | N/A |

**Configuration Notes:**
- Prisma Client explicitly connects via `DATABASE_URL`. Since Supabase Serverless requires connection pooling, this **MUST** be the pooler URL (port 6543, with `?pgbouncer=true` if using traditional pgbouncer, or standard pooling with Supavisor).
- Prisma Migrations connect via `DIRECT_URL`. This **MUST** be the direct Supabase PostgreSQL connection (port 5432).
- The Next.js application does **not** use the Supabase Javascript Client. Therefore, `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` are completely ignored by the code and should **NOT** be added.

## 2. Authentication (Auth.js)
| Variable | Referenced? | Required at Runtime? | Required at Build? | Req in Prod? | Req in Prev? | Secret? | File Referenced |
|----------|-------------|----------------------|--------------------|--------------|--------------|---------|-----------------|
| `AUTH_SECRET` | YES | YES | NO | YES | YES | **YES** | `NextAuth internal`, `api/health/route.ts` |
| `NEXTAUTH_URL` | NO | NO | NO | NO | NO | NO | N/A |

**Configuration Notes:**
- Auth.js inherently requires `AUTH_SECRET` to encrypt session tokens.
- `NEXTAUTH_URL` is safely omitted as Vercel automatically maps this variable using `VERCEL_URL`.

## 3. Core Application
| Variable | Referenced? | Required at Runtime? | Required at Build? | Req in Prod? | Req in Prev? | Secret? | File Referenced |
|----------|-------------|----------------------|--------------------|--------------|--------------|---------|-----------------|
| `NEXT_PUBLIC_APP_URL` | YES | YES | YES | YES | YES | NO | `sitemap.ts`, `robots.ts`, `layout.tsx`, `certificateService.ts` |
| `NODE_ENV` | YES | NO | NO | NO | NO | NO | `prisma.ts`, `CertificateStorageProvider.ts` |

**Configuration Notes:**
- `NEXT_PUBLIC_APP_URL` is heavily used for SEO metadata, canonicals, sitemaps, and absolute URLs in certificates.
- `NODE_ENV` is handled automatically by Vercel (`production` or `development`).

## 4. Payment Gateway (Razorpay)
| Variable | Referenced? | Required at Runtime? | Required at Build? | Req in Prod? | Req in Prev? | Secret? | File Referenced |
|----------|-------------|----------------------|--------------------|--------------|--------------|---------|-----------------|
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | YES | YES | NO | YES | YES | NO | `CheckoutModal.tsx`, `api/checkout/create-order/route.ts` |
| `RAZORPAY_KEY_SECRET` | YES | YES | NO | YES | YES | **YES** | `api/checkout/create-order`, `api/payments/verify` |
| `RAZORPAY_WEBHOOK_SECRET` | YES | YES | NO | YES | NO | **YES** | `api/payments/webhook/route.ts` |

**Configuration Notes:**
- All Razorpay variables are actively required for the checkout and verification workflows to succeed.

## 5. Live Classroom (LiveKit)
| Variable | Referenced? | Required at Runtime? | Required at Build? | Req in Prod? | Req in Prev? | Secret? | File Referenced |
|----------|-------------|----------------------|--------------------|--------------|--------------|---------|-----------------|
| `NEXT_PUBLIC_LIVEKIT_URL` | YES | YES | NO | YES | YES | NO | `api/live-classes/[id]/token/route.ts` |
| `LIVEKIT_API_KEY` | YES | YES | NO | YES | YES | **YES** | `liveKitService.ts` |
| `LIVEKIT_API_SECRET` | YES | YES | NO | YES | YES | **YES** | `liveKitService.ts`, `api/health/route.ts` |

## 6. Storage (Certificates & Media)
| Variable | Referenced? | Required at Runtime? | Required at Build? | Req in Prod? | Req in Prev? | Secret? | File Referenced |
|----------|-------------|----------------------|--------------------|--------------|--------------|---------|-----------------|
| `STORAGE_PROVIDER` | YES | NO | NO | NO | NO | NO | `api/health/route.ts` |
| `STORAGE_ACCESS_KEY_ID` | YES | YES (Prod) | NO | YES | NO | **YES** | `CertificateStorageProvider.ts` |
| `STORAGE_SECRET_ACCESS_KEY` | YES | YES (Prod) | NO | YES | NO | **YES** | `CertificateStorageProvider.ts` |
| `NEXT_PUBLIC_STORAGE_URL` | YES | NO | NO | NO | NO | NO | `CertificateStorageProvider.ts` |
| `STORAGE_BUCKET_NAME` | YES | YES (Prod) | NO | YES | NO | NO | `CertificateStorageProvider.ts` |

**Configuration Notes:**
- The code in `CertificateStorageProvider.ts` strictly checks `if (process.env.NODE_ENV === 'production')`. If true, it **mandates** S3/R2 credentials.
- In preview/development environments, the system safely falls back to a Mock storage provider.

## 7. Email Notifications
| Variable | Referenced? | Required at Runtime? | Required at Build? | Req in Prod? | Req in Prev? | Secret? | File Referenced |
|----------|-------------|----------------------|--------------------|--------------|--------------|---------|-----------------|
| `SMTP_HOST` | YES | NO | NO | NO | NO | NO | `emailService.ts` |
| `SMTP_USER` | YES | NO | NO | NO | NO | NO | `emailService.ts` |
| `SMTP_PASS` | YES | NO | NO | NO | NO | **YES** | `emailService.ts` |
| `EMAIL_FROM` | YES | NO | NO | NO | NO | NO | `emailService.ts` |

**Configuration Notes:**
- `emailService.ts` checks `if (!!process.env.SMTP_HOST && ...)`. The system handles missing SMTP credentials gracefully by bypassing the transport. These are **OPTIONAL** across all environments.

---

### A. REQUIRED FOR VERCEL PREVIEW
*These must be added to the Vercel "Preview" environment scope.*
1. `DATABASE_URL`
2. `DIRECT_URL`
3. `AUTH_SECRET`
4. `NEXT_PUBLIC_APP_URL`
5. `NEXT_PUBLIC_RAZORPAY_KEY_ID`
6. `RAZORPAY_KEY_SECRET`
7. `NEXT_PUBLIC_LIVEKIT_URL`
8. `LIVEKIT_API_KEY`
9. `LIVEKIT_API_SECRET`

### B. REQUIRED FOR VERCEL PRODUCTION
*These must be added to the Vercel "Production" environment scope.*
1. `DATABASE_URL` *(Must use Supabase connection pooler, port 6543)*
2. `DIRECT_URL` *(Must use Supabase direct connection, port 5432)*
3. `AUTH_SECRET`
4. `NEXT_PUBLIC_APP_URL`
5. `NEXT_PUBLIC_RAZORPAY_KEY_ID`
6. `RAZORPAY_KEY_SECRET`
7. `RAZORPAY_WEBHOOK_SECRET`
8. `NEXT_PUBLIC_LIVEKIT_URL`
9. `LIVEKIT_API_KEY`
10. `LIVEKIT_API_SECRET`
11. `STORAGE_ACCESS_KEY_ID`
12. `STORAGE_SECRET_ACCESS_KEY`
13. `STORAGE_BUCKET_NAME`

### C. NOT REQUIRED / OPTIONAL
*Do not enter these unless explicitly enabling their respective features.*
- `NEXT_PUBLIC_SUPABASE_URL` *(Do NOT enter)*
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` *(Do NOT enter)*
- `NEXTAUTH_URL` *(Do NOT enter)*
- `STORAGE_PROVIDER`
- `NEXT_PUBLIC_STORAGE_URL`
- `SMTP_HOST`
- `SMTP_USER`
- `SMTP_PASS`
- `EMAIL_FROM`

---
*Report compiled by Antigravity QA Agent.*
