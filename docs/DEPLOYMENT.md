# Learning Hub Deployment Guide

## 1. Prerequisites & Environment Variables
Before deploying to production, ensure you have a standard `.env` configuration as detailed in `.env.example`.
- **Database**: Supply `DATABASE_URL` (using the transaction pooler, typically port 6543) for application queries, and `DIRECT_URL` (direct connection, typically port 5432) for Prisma migrations. Ensure all passwords are URL encoded.
- **Keys**: Ensure `AUTH_SECRET`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`, `LIVEKIT_API_SECRET`, and `STORAGE_SECRET_ACCESS_KEY` are populated. 

## 2. Database Setup & Migrations
Learning Hub uses PostgreSQL and Prisma ORM.

### Production Migration Strategy
**NEVER** use `npx prisma db push` in production. It can cause data loss.
Instead, use the Prisma Migration workflow:
1. During development, create migrations: `npx prisma migrate dev --name <migration_name>`
2. During deployment/CI, apply migrations: `npx prisma migrate deploy`

## 3. Build & Start Commands
The application is built on Next.js App Router.

- **Build**: `npm run build` (Automatically triggers `prisma generate`)
- **Start**: `npm run start`

If deploying to Vercel, the Build command is usually mapped directly to `next build`, and Prisma generation is handled automatically by the Vercel builder. 

## 4. Third-Party Integrations
- **Razorpay**: Production webhooks must point to `https://<your-domain>/api/payments/webhook`. Verify that the secret generated in the Razorpay Dashboard matches `RAZORPAY_WEBHOOK_SECRET`.
- **LiveKit**: Point your production environment to your managed LiveKit Cloud URL.
- **Storage**: Configure R2/S3 bucket CORS to allow GET requests from your production domain.
- **Email**: Learning Hub abstracts emails via `EmailService`. Provide legitimate SMTP credentials for production.

## 5. Health Check
Once deployed, verify the deployment via the unauthenticated health endpoint:
`GET https://<your-domain>/api/health`
This validates database connectivity and the presence of configuration variables without leaking actual secrets.

## 6. Backup & Restore Procedures
- **Backups**: Use `pg_dump` to create logical backups on a scheduled basis (e.g., via cron or managed DB automated backups like AWS RDS / Supabase Point-in-Time recovery).
- **Restore**: Use `pg_restore` for restoring the database. 
*Do not run backup scripts directly on the Node server if using a managed database provider.*

## 7. Rollback Procedure
If a deployment introduces a critical regression:
1. Revert the infrastructure deployment via your platform dashboard (e.g., Vercel "Rollback" button).
2. If the deployment included a Prisma migration that broke backward compatibility, restore the database from the immediate pre-deployment snapshot before rolling back the application code.
