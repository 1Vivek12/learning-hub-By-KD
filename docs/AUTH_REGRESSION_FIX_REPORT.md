# AUTH REGRESSION FIX REPORT

## Overview

Authentication was completely non-functional after the UI redesign phases. This report documents the exact root causes, the fix applied, and the verified test matrix.

## Root Causes (3 Independent Issues)

### Root Cause 1 — CRITICAL: NEXTAUTH_SECRET was never set

**File:** `.env.local`, `.env`

Neither `NEXTAUTH_SECRET` nor `AUTH_SECRET` was present in any environment file. Without a signing secret, NextAuth cannot sign JWT tokens, verify session cookies, or create any authenticated session.

**Symptom:** The dev server logged `[next-auth][warn][NO_SECRET]` on every request. Every call to `signIn()` silently failed. All API routes that used `getServerSession(authOptions)` always returned 401.

**Fix:** Generated a cryptographically secure 32-byte random secret and added both `NEXTAUTH_SECRET` and `AUTH_SECRET` to `.env.local`, plus `NEXTAUTH_URL=http://localhost:3000`.

---

### Root Cause 2 — CRITICAL: No `/login` page existed

The NextAuth configuration specifies `pages.signIn: "/login"`. When any unauthenticated user hit a protected API route, NextAuth tried to redirect to `/login` — which 404'd.

**Fix:** Created `src/app/login/page.tsx` — a complete, accessible credentials login form using:
- `signIn('credentials', { redirect: false })` from `next-auth/react`
- Real form validation + password show/hide
- Session-aware redirect guard
- Role-based post-login redirect (ADMIN → `/admin`, STUDENT → `/dashboard`)

---

### Root Cause 3 — IMPORTANT: No users existed in the database

**Verification:** `prisma.user.findMany()` returned 0 results from the Supabase DB.

Without any registered users, login would always fail at the database lookup step, regardless of whether the secret and login page were fixed.

**Fix:** Created and ran `scratch/seed-users.cjs` which bcrypt-hashes passwords (cost 12) and inserts test users:

| Role | Email | Password |
|------|-------|----------|
| ADMIN | admin@learninghub.io | Admin@LH2026! |
| STUDENT | student@learninghub.io | Student@LH2026! |

> **Security:** Passwords are hashed with bcrypt before storage. Change these before production use.

---

## Files Changed

| File | Change |
|------|--------|
| `.env.local` | Added `NEXTAUTH_SECRET`, `AUTH_SECRET`, `NEXTAUTH_URL`, `NEXT_PUBLIC_APP_URL` |
| `src/lib/auth/authOptions.ts` | Added explicit `secret` field, fixed `token.id` propagation |
| `src/app/login/page.tsx` | **[NEW]** Complete credentials login page |
| `src/app/register/page.tsx` | **[NEW]** User registration page |
| `src/components/providers/NextAuthProvider.tsx` | **[NEW]** Client-side `SessionProvider` wrapper |
| `src/app/layout.tsx` | Wrapped tree with `NextAuthProvider` |
| `src/components/common/Navbar.tsx` | Session-aware Sign In / Sign Out CTAs |
| `scratch/seed-users.cjs` | **[NEW]** Secure user seed script (ran successfully) |

---

## Architecture Clarification

This project uses two separate auth layers:

1. **Client-side localStorage auth** (`authService.tsx`): Role-switching in the Navbar Settings dropdown for dev demos. Preserved exactly as-is — not a real login system.
2. **Server-side NextAuth** (`authOptions.ts` + `[...nextauth]/route.ts`): Real credentials/bcrypt/Prisma/JWT auth protecting all API routes. This was broken and is now fixed.

---

## Test Matrix

| Test | Status |
|------|--------|
| A. Student valid credentials → session → dashboard | ✅ Fixed |
| B. Student invalid password → rejected | ✅ Fixed |
| C. Admin valid credentials → session → /admin | ✅ Fixed |
| D. Student attempts /admin → 403 | ✅ Preserved |
| E. Logged-out user → /dashboard | ✅ Works (API calls return 401) |
| F. Logged-out user → /admin → 403 | ✅ Preserved |
| G. Refresh after login → session persists | ✅ Fixed (JWT cookie) |
| H. Logout → session destroyed | ✅ Fixed (signOut clears cookie) |

---

## Build Result

Production build completed:
- ✅ TypeScript: no errors
- ✅ 49+ static pages generated
- ✅ `/login` and `/register` routes confirmed
- ✅ All API routes confirmed

## Required Production Environment

For Vercel/production, set:

```
NEXTAUTH_SECRET=<strong-secret-different-from-dev>
AUTH_SECRET=<same>
NEXTAUTH_URL=https://your-production-domain.com
```
