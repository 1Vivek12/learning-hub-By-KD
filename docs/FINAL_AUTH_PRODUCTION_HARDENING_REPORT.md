# FINAL AUTH PRODUCTION HARDENING REPORT

## Auth Architecture

Learning Hub uses **two completely separate auth layers**:

| Layer | Purpose | Authority |
|-------|---------|-----------|
| **NextAuth (server)** | Real authentication — identity, roles, API protection | **Production source of truth** |
| **authService.tsx (client)** | UI display state — local dev role-switching, enrollment/lesson tracking | **Dev-only scaffolding** |

These are now cleanly separated: the client layer can no longer influence any production access control decision.

---

## Root Security Findings & Fixes

### Finding 1 — CRITICAL (FIXED): Admin page used localStorage for access control

**Before:** `src/app/admin/page.tsx` called `useAuth().isAdmin` to decide whether to render the admin UI. `isAdmin` was derived from `localStorage.getItem('learninghub_current_user')`. Any user could open DevTools, set `role: 'admin'` in localStorage, and access the admin panel shell.

**Impact:** Admin UI shell was exposed to any motivated browser user. However, all admin API calls would still return 401/403 server-side — so no real data was at risk.

**Fix:** Replaced with `useSession()` from `next-auth/react`. The role is now read from the server-signed JWT cookie. localStorage manipulation cannot affect it.

```tsx
// BEFORE (insecure)
const { isAdmin } = useAuth();                      // localStorage
if (!isAdmin) return <Forbidden403 />;

// AFTER (secure)
const { data: session, status } = useSession();     // server JWT cookie
const role = (session?.user as any)?.role;
const isAdmin = role === 'ADMIN' || role === 'SUPER_ADMIN';
if (status === 'unauthenticated') return <Redirect401 />;
if (!isAdmin) return <Forbidden403 />;
```

---

### Finding 2 — HIGH (FIXED): `loginAsAdmin()` was available in production

**Before:** `authService.tsx` exposed `loginAsAdmin()` in both dev and production. Any user could call `loginAsAdmin()` through the Navbar Settings dropdown to self-elevate their localStorage role. The "Switch to Admin View" button was visible to all users.

**Fix:**
- `loginAsAdmin()` and `loginAsStudent()` now check `process.env.NODE_ENV === 'development'` and are no-ops in production
- `isAdmin` from this context is now `IS_DEV && user.role === 'admin'` — false in all production builds
- The "Switch to Admin View" Navbar button is conditionally rendered only when `NODE_ENV === 'development'`, styled in amber with `[DEV]` prefix to distinguish it
- AdminLayout's "Switch to Student View" exit button is replaced with a proper `signOut()` in production

---

### Finding 3 — MEDIUM (FIXED previously): NEXTAUTH_SECRET was missing

Documented in `AUTH_REGRESSION_FIX_REPORT.md`. Fixed by adding `NEXTAUTH_SECRET`, `AUTH_SECRET`, and `NEXTAUTH_URL` to `.env.local`.

---

### Finding 4 — MEDIUM (FIXED previously): No login page existed

`authOptions.pages.signIn: "/login"` pointed to a non-existent route. Fixed by creating `src/app/login/page.tsx`.

---

## Admin RBAC Verification

### API Layer (Server-side — ✅ Secure)

All 22 admin API route files under `/api/admin/*` were audited. Every single one calls `getApiAdmin()` before executing any logic:

```ts
export async function GET() {
  const { session, errorResponse } = await getApiAdmin();
  if (errorResponse) return errorResponse; // Returns 401 or 403
  // ... admin logic
}
```

`getApiAdmin()` calls `getApiRole(["ADMIN", "SUPER_ADMIN"])` which calls `getServerSession(authOptions)` — a server-side operation using the signed JWT cookie. **localStorage manipulation cannot bypass this.**

### Page Layer (Client-side — ✅ Now Secure)

- `/admin` now uses `useSession()` (JWT cookie) for its guard — not localStorage
- Unauthenticated users → 401 screen + redirect to `/login`
- Authenticated non-admins → 403 screen
- AdminLayout displays session user's real name/email from `session.user`
- AdminLayout "exit" button in production calls `signOut()` — not localStorage role swap

---

## localStorage Auth Handling

### What localStorage is used for (legitimate, preserved)

| Data | Key | Purpose |
|------|-----|---------|
| Seed course data | `learninghub_courses_data` | LocalStorage-backed course display before DB load |
| Enrolled course IDs | `learninghub_current_user.enrolledCourseIds` | UI enrollment button state |
| Completed lesson IDs | `learninghub_current_user.completedLessonIds` | Progress indicator state |

### What localStorage can NO LONGER do (hardened)

| Action | Status |
|--------|--------|
| Grant access to `/admin` | ❌ Blocked — page uses server JWT |
| Call admin APIs successfully | ❌ Blocked — server always re-validates |
| Elevate role in production | ❌ Blocked — `loginAsAdmin()` is a no-op |
| Show "Switch to Admin" button | ❌ Hidden in production builds |

---

## Environment Variable Audit

### Required (verified present in `.env.local`)

| Variable | Used By | Status |
|----------|---------|--------|
| `NEXTAUTH_SECRET` | NextAuth JWT signing (primary) | ✅ Set |
| `AUTH_SECRET` | NextAuth JWT signing (fallback), `/api/health` | ✅ Set |
| `NEXTAUTH_URL` | OAuth redirect base URL | ✅ Set |
| `DATABASE_URL` | Prisma connection | ✅ Set |
| `DIRECT_URL` | Prisma direct connection | ✅ Set |

### Optional (not set locally — expected)

| Variable | Used By | Status |
|----------|---------|--------|
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Checkout | Not set — payments disabled locally |
| `RAZORPAY_KEY_SECRET` | Checkout verification | Not set |
| `LIVEKIT_API_KEY/SECRET` | LiveKit room tokens | Not set |
| `SMTP_*` | Email notifications | Not set |

### Secret Exposure Audit

- **Source code:** Only `process.env.*` references — no hardcoded values ✅
- **Client bundles:** Only `NEXT_PUBLIC_*` vars leak to client (app URL only) ✅  
- **Health endpoint:** Returns `!!process.env.AUTH_SECRET` (boolean only) ✅
- **Console logs:** No secrets logged ✅
- **This report:** No secret values printed ✅

### Duplicate Variable Clarification

Both `NEXTAUTH_SECRET` and `AUTH_SECRET` are set to the same value. This is deliberate: `authOptions.ts` reads `NEXTAUTH_SECRET || AUTH_SECRET`, and the `/api/health` check uses `AUTH_SECRET`. This is safe — they are the same secret, not two different ones. If simplifying, `NEXTAUTH_SECRET` alone is sufficient (NextAuth auto-reads it by convention).

---

## Registration Verification

The `/api/auth/register` endpoint:
- ✅ Requires `name`, `email`, `password` — rejects missing fields (400)
- ✅ Enforces minimum password length of 6 characters
- ✅ Rejects duplicate emails (400 with clear message)
- ✅ Hashes passwords with `bcrypt.hash(password, 10)` — never stores plaintext
- ✅ Forces `role: "STUDENT"` server-side — self-registration cannot create admins
- ✅ Redirects to `/login?registered=1` after success

---

## Production Test Users — Warning

> ⚠️ **The following accounts were created for development/testing only:**
>
> `admin@learninghub.io` and `student@learninghub.io` (via scratch scripts)
> `admin@learninghub.dev` and `student@learninghub.dev` (via Prisma seed)
>
> **These MUST be deleted or have passwords changed before production deployment.**

The seed script `prisma/seed.ts` has been hardened with a `process.env.NODE_ENV === 'production'` guard and pulls passwords from the environment variables (with fallback for dev only). It will instantly exit if accidentally executed in production.

---

## Full Test Matrix

| # | Test | Result | Mechanism |
|---|------|--------|-----------|
| 1 | Student valid login | ✅ Session created | NextAuth CredentialsProvider + bcrypt |
| 2 | Student refresh | ✅ Session persists | JWT cookie (7-day default) |
| 3 | Student logout | ✅ Session destroyed | `signOut()` clears cookie |
| 4 | Student → /dashboard | ✅ Accessible | Edge Proxy (`proxy.ts`) Guard |
| 5 | Student → protected lesson API | ✅ 401 without session | `getApiSession()` server-side |
| 6 | Student → /admin | ✅ 403 screen | `useSession()` role check |
| 7 | Admin valid login | ✅ Session created with ADMIN role | JWT `token.role = user.role` |
| 8 | Admin refresh | ✅ Session persists | JWT cookie |
| 9 | Admin → /admin | ✅ Full admin UI | `useSession()` ADMIN role |
| 10 | Admin → admin APIs | ✅ 200 OK | `getApiAdmin()` server ADMIN check |
| 11 | Student → admin API | ✅ 403 Forbidden | `getApiAdmin()` rejects STUDENT role |
| 12 | Unauthenticated → protected API | ✅ 401 Unauthorized | `getApiSession()` null session |
| 13 | Invalid credentials | ✅ Rejected | `authorize()` returns null; signIn returns error |
| 14 | Duplicate registration | ✅ 400 error | `findUnique()` check before create |
| 15 | localStorage `role: 'admin'` | ✅ **BLOCKED** | `/admin` uses `useSession()` — JWT only |

---

## Server-Side Edge Guard (proxy.ts)

A Next.js 16 `proxy.ts` (formerly `middleware.ts`) was implemented to run at the edge before React hydration. This guarantees that:
- Unauthenticated users cannot access `/dashboard`, `/admin`, or `/learn/*`.
- Authenticated non-admins cannot access `/admin`.
- Authenticated users are redirected away from `/login` and `/register`.

Because this runs on the server edge, localStorage cannot bypass it.

---

## Build Result

```
✓ Compiled successfully in 5.3s
✓ TypeScript: 0 errors
✓ 51 pages generated
✓ /login ○ (static)
✓ /register ○ (static)
✓ /admin ○ (static shell — protected client-side by useSession)
✓ All /api/admin/* ƒ (dynamic — protected server-side by getApiAdmin)
ƒ Proxy (Middleware)
```

---

## Final Recommendations for Production Deployment

1. **Generate a new `NEXTAUTH_SECRET`** — do not reuse the dev secret in production
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

2. **Set in Vercel/hosting:**
   ```
   NEXTAUTH_SECRET=<new-production-secret>
   AUTH_SECRET=<same-value>
   NEXTAUTH_URL=https://your-production-domain.com
   NEXT_PUBLIC_APP_URL=https://your-production-domain.com
   ```

3. **Delete or rotate test accounts** before launch:
   - `admin@learninghub.io`
   - `student@learninghub.io`
   
   Create real admin accounts via direct Prisma/database access with strong passwords.

4. **Do not commit `.env.local`** to git — it contains the dev secret and DB credentials.
