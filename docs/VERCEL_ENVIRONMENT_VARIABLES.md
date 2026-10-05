# Vercel Deployment Environment Variables Guide

When deploying Learning Hub by KD to Vercel, you must configure the following environment variables in your Vercel Project Settings (Settings > Environment Variables). 

**Do NOT check in any of these secrets into source control.**

## 1. Core Application & NextAuth
| Variable Name | Required? | Vercel Environment | Origin / How to get it | Secret? |
|--------------|-----------|-------------------|------------------------|---------|
| `NEXT_PUBLIC_APP_URL` | **Yes** | Production, Preview, Dev | The URL where the app is hosted (e.g., `https://learninghub.io`) | No |
| `NODE_ENV` | Optional | Production, Preview, Dev | Set automatically by Vercel to `production` or `development` | No |
| `AUTH_SECRET` | **Yes** | Production, Preview, Dev | A strong, random 32+ character string generated securely (e.g., via `openssl rand -base64 32`). Used to sign NextAuth session tokens. | **Yes** |
| `NEXTAUTH_URL` | Optional | Production | Usually inferred by NextAuth in Vercel, but good practice to explicitly set to your Vercel production domain. | No |

## 2. Database (Supabase & Prisma)
*Note: Ensure your database password is URL-encoded if it contains special characters (e.g., `@` becomes `%40`).*

| Variable Name | Required? | Vercel Environment | Origin / How to get it | Secret? |
|--------------|-----------|-------------------|------------------------|---------|
| `DATABASE_URL` | **Yes** | Production, Preview, Dev | From Supabase Dashboard. Use the Transaction Connection Pooler URL (typically port 6543) for Vercel Serverless Functions. | **Yes** |
| `DIRECT_URL` | **Yes** | Production, Preview, Dev | From Supabase Dashboard. Use the Direct Connection URL (typically port 5432) for Prisma schema migrations during the build step. | **Yes** |

## 3. Payment Gateway (Razorpay)
| Variable Name | Required? | Vercel Environment | Origin / How to get it | Secret? |
|--------------|-----------|-------------------|------------------------|---------|
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | **Yes** | Production, Preview, Dev | Razorpay Dashboard > API Keys | No |
| `RAZORPAY_KEY_SECRET` | **Yes** | Production, Preview, Dev | Razorpay Dashboard > API Keys (Server-side only) | **Yes** |
| `RAZORPAY_WEBHOOK_SECRET` | **Yes** | Production | Custom secret you generate and configure in the Razorpay Webhooks dashboard. | **Yes** |

## 4. Live Classroom (LiveKit)
| Variable Name | Required? | Vercel Environment | Origin / How to get it | Secret? |
|--------------|-----------|-------------------|------------------------|---------|
| `NEXT_PUBLIC_LIVEKIT_URL` | **Yes** | Production, Preview, Dev | LiveKit Cloud Dashboard (e.g., `wss://your-project.livekit.cloud`) | No |
| `LIVEKIT_API_KEY` | **Yes** | Production, Preview, Dev | LiveKit Cloud Dashboard > API Keys | **Yes** |
| `LIVEKIT_API_SECRET` | **Yes** | Production, Preview, Dev | LiveKit Cloud Dashboard > API Keys | **Yes** |

## 5. Storage (AWS S3 / Cloudflare R2)
| Variable Name | Required? | Vercel Environment | Origin / How to get it | Secret? |
|--------------|-----------|-------------------|------------------------|---------|
| `STORAGE_PROVIDER` | **Yes** | Production, Preview, Dev | String literal: `r2`, `s3`, or `local`. | No |
| `NEXT_PUBLIC_STORAGE_URL` | **Yes** | Production, Preview, Dev | Public facing URL mapped to your bucket (e.g., `https://assets.learninghub.io`). | No |
| `STORAGE_BUCKET_NAME` | **Yes** | Production, Preview, Dev | Name of your storage bucket. | No |
| `STORAGE_REGION` | **Yes** | Production, Preview, Dev | Storage region (use `auto` for Cloudflare R2). | No |
| `STORAGE_ACCESS_KEY_ID` | **Yes** | Production, Preview, Dev | Provider Dashboard > API Tokens/Credentials | **Yes** |
| `STORAGE_SECRET_ACCESS_KEY` | **Yes** | Production, Preview, Dev | Provider Dashboard > API Tokens/Credentials | **Yes** |
| `STORAGE_ENDPOINT` | **Yes** | Production, Preview, Dev | Provider endpoint (e.g., `https://<account_id>.r2.cloudflarestorage.com`). | No |

## 6. Email / SMTP Notifications
| Variable Name | Required? | Vercel Environment | Origin / How to get it | Secret? |
|--------------|-----------|-------------------|------------------------|---------|
| `SMTP_HOST` | **Yes** | Production, Preview, Dev | SMTP Provider (e.g., Resend, Sendgrid). | No |
| `SMTP_PORT` | **Yes** | Production, Preview, Dev | Usually `465` or `587`. | No |
| `SMTP_USER` | **Yes** | Production, Preview, Dev | SMTP Provider Credentials | No |
| `SMTP_PASS` | **Yes** | Production, Preview, Dev | SMTP Provider Credentials | **Yes** |
| `EMAIL_FROM` | **Yes** | Production, Preview, Dev | Configured sender address (e.g., `Learning Hub <no-reply@learninghub.io>`). | No |

---

## VERCEL ENVIRONMENT VARIABLES CHECKLIST

Here is the quick checklist of variables to copy from your `.env.local` directly into the Vercel dashboard:

- [ ] `NEXT_PUBLIC_APP_URL` (Required)
- [ ] `AUTH_SECRET` (Required)
- [ ] `DATABASE_URL` (Required)
- [ ] `DIRECT_URL` (Required)
- [ ] `NEXT_PUBLIC_RAZORPAY_KEY_ID` (Required)
- [ ] `RAZORPAY_KEY_SECRET` (Required)
- [ ] `RAZORPAY_WEBHOOK_SECRET` (Required)
- [ ] `NEXT_PUBLIC_LIVEKIT_URL` (Required)
- [ ] `LIVEKIT_API_KEY` (Required)
- [ ] `LIVEKIT_API_SECRET` (Required)
- [ ] `STORAGE_PROVIDER` (Required)
- [ ] `NEXT_PUBLIC_STORAGE_URL` (Required)
- [ ] `STORAGE_BUCKET_NAME` (Required)
- [ ] `STORAGE_REGION` (Required)
- [ ] `STORAGE_ACCESS_KEY_ID` (Required)
- [ ] `STORAGE_SECRET_ACCESS_KEY` (Required)
- [ ] `STORAGE_ENDPOINT` (Required)
- [ ] `SMTP_HOST` (Required)
- [ ] `SMTP_PORT` (Required)
- [ ] `SMTP_USER` (Required)
- [ ] `SMTP_PASS` (Required)
- [ ] `EMAIL_FROM` (Required)

*(Optional overrides: `NODE_ENV`, `NEXTAUTH_URL`)*
