# Production Go-Live Checklist

## Environment & Secrets
- [ ] `NODE_ENV` is set to `production`
- [ ] `NEXT_PUBLIC_APP_URL` is configured to the live domain
- [ ] `AUTH_SECRET` is generated using a secure 32+ byte string
- [ ] No development/mock secrets are in the production `.env`

## Database & Prisma
- [ ] Production PostgreSQL database is provisioned and scaled appropriately
- [ ] `DATABASE_URL` is set to the production connection string
- [ ] Connection pooling (PgBouncer/Prisma Accelerate) is configured if on serverless
- [ ] Database backups (daily or point-in-time) are enabled on the provider
- [ ] Initial schema deployed using `npx prisma migrate deploy` (NOT `db push`)

## Payments (Razorpay)
- [ ] Razorpay account is activated and KYC verified
- [ ] `NEXT_PUBLIC_RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` are set to LIVE mode keys
- [ ] Webhook endpoint `/api/payments/webhook` is registered in Razorpay dashboard
- [ ] Webhook secret matches `RAZORPAY_WEBHOOK_SECRET`

## Third-Party Services
- [ ] **LiveKit**: Connected to a production LiveKit Cloud or clustered deployment
- [ ] **Storage**: S3/R2 Bucket created, CORS configured, and API keys provisioned
- [ ] **Email**: SMTP transporter connected (e.g., Resend) with verified sending domains
- [ ] **Email**: DMARC/DKIM/SPF records verified for the sending domain

## Security & Reliability
- [ ] Security headers confirmed active via `next.config.js`
- [ ] `/api/health` reports status `healthy`
- [ ] Authentication flows tested in the live environment
- [ ] SSL/TLS Certificates are active on the apex domain and `www`
- [ ] Uptime monitoring (e.g., BetterStack, Pingdom) configured against `/api/health`
