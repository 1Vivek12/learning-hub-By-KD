# Learning Hub by KD

A comprehensive modern e-learning platform built with a robust technology stack.

## Technology Stack

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Database:** PostgreSQL (via Supabase)
- **ORM:** Prisma
- **Authentication:** NextAuth
- **Live Classes:** LiveKit
- **Payments:** Razorpay
- **Email Delivery:** Nodemailer
- **Testing:** Vitest

## Getting Started

1. **Install dependencies:**
   `npm install`

2. **Configure environment variables:**
   Copy `.env.example` to `.env` and `.env.local`, then fill in your credentials.

3. **Run database migrations (if necessary):**
   `npm run prisma:generate` (and deploy schema if required)

4. **Start the development server:**
   `npm run dev`

5. **Run tests:**
   `npm run test:ci`
