# PHASE 12E: LOCAL 500 ERROR DIAGNOSTIC

## 1. Exact Root Cause
The `HTTP 500 Internal Server Error` returned by `/api/auth/session`, `/api/courses`, and other authenticated routes is caused by a **missing NextAuth secret**. 

NextAuth requires a secret key to sign and encrypt JWT sessions. In `src/lib/auth/authOptions.ts`, the secret is configured as `process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET`. Because neither of these variables is defined in the local `.env` file, NextAuth encounters a configuration error (`NO_SECRET`), fails to initialize the session, and throws a 500 error whenever the frontend attempts to fetch the session (resulting in `CLIENT_FETCH_ERROR`) or whenever a backend API route calls `getApiSession()`.

## 2. Evidence from Server Terminal
When the frontend attempts to call `/api/auth/session` without a secret configured, NextAuth logs a `NO_SECRET` configuration error and returns HTTP 500. This cascades to all protected API routes (like `/api/courses` and `/api/enrollments`), which depend on `getApiSession()` reading from NextAuth.

## 3. Affected API Routes
The following routes are affected because they all rely on `getServerSession(authOptions)` / NextAuth session management:
- `/api/auth/session`
- `/api/courses`
- `/api/live-classes`
- `/api/enrollments`
- `/api/notifications`

## 4. Environment Variables Checked
- `DATABASE_URL`: **PRESENT**
- `DIRECT_URL`: **PRESENT**
- `AUTH_SECRET`: **MISSING**
- `NEXTAUTH_SECRET`: **MISSING**
- `NEXTAUTH_URL`: **MISSING**
- `NEXT_PUBLIC_APP_URL`: **MISSING**

## 5. Database Connectivity Result
**PASS**. The database connection is healthy. A `prisma db push` check confirmed that the database schema is fully in sync with the Prisma models and the connection strings are valid.

## 6. NextAuth Result
**FAIL (Due to Configuration)**. NextAuth fails to initialize properly because it lacks the mandatory `NEXTAUTH_SECRET` (or `AUTH_SECRET`) environment variable required to sign JWTs.

## 7. Registration Result
**PASS**. The registration API (`/api/auth/register`) correctly creates the user in the database (returning `201 Created`). However, the immediate post-registration redirect to `/login` fails to establish a session due to the NextAuth configuration error.

## 8. Fixes Performed
No code fixes were performed. The codebase is structurally correct. As per instructions, no fake credentials or environment variables were invented or injected.

## 9. Verification Results
The APIs were tested locally using HTTP scripts. Unauthenticated access to public routes succeeds, while authenticated/session-dependent routes fail due to the missing secret. The issue will be completely resolved once the environment variables are supplied.

## 10. Build Result
**PASS**. `npm run build` succeeds with 0 TypeScript errors. The missing environment variables only affect runtime execution, not the static build process.

## 11. Remaining Blockers
You must add the following environment variables to your local `.env` file (and Vercel):
- `NEXTAUTH_SECRET` (A strong, random 32+ character string)
- `NEXTAUTH_URL` (e.g., `http://localhost:3000` for local development)
