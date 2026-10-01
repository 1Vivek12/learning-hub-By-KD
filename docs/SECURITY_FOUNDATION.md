# Security Foundation

This document outlines the security foundation implemented in Phase 1 and the limitations that remain for subsequent phases.

## Implemented in Phase 1
1.  **Secure Password Hashing:** User passwords are now hashed using `bcryptjs` before storage. Plaintext passwords are not stored in the repository or database.
2.  **Authentication Architecture:** Removed client-side mock authentication. Integrated `NextAuth` with JWT strategy, moving session management to secure HTTP-only cookies.
3.  **Server-Side RBAC (Role-Based Access Control):** Created server-side utilities (`requireAuth`, `requireRole`, `requireAdmin`) to validate JWT claims on the server before rendering sensitive views or executing API endpoints.
4.  **Database Separation:** Abstracted sensitive data logic to Prisma and PostgreSQL, eliminating the `localStorage` JSON object vulnerability.
5.  **Secure Environment Variables:** Secrets (`AUTH_SECRET`, `DATABASE_URL`) are loaded from `.env` which is strictly excluded from version control via `.gitignore`.

## Remaining Security Limitations (Do NOT deploy to production yet)
1.  **Missing Zod Validation:** API Route handlers need comprehensive `zod` schema validation for all incoming request bodies (e.g., registration, profile updates).
2.  **No Rate Limiting:** Brute force login attempts or API abuse are not yet mitigated (needs Redis/Upstash rate limiting).
3.  **Video DRM:** Course videos still point to public `.mp4` URLs. Signed URLs or DRM (Mux/Vdocipher) are required.
4.  **Fake Payments:** The checkout flow does not securely validate real transactions yet.
5.  **Security Headers:** Missing CSP (Content Security Policy) and strict CORS configurations in `next.config.ts`.
