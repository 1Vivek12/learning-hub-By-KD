# Authentication & Authorization

The previous fake authentication (toggling user roles in local storage) has been completely removed from the security architecture.

## Implementation Details
- **Provider:** NextAuth / Auth.js with `CredentialsProvider`.
- **Session Strategy:** JWT-based sessions.
- **Security:** Passwords are hashed using `bcryptjs`.
- **Token Claims:** The JWT includes the user's `id` and `role`.

## Server-Side RBAC
A utility file `/src/lib/auth/utils.ts` provides server-side protection:
- `requireAuth()`: Ensures session exists.
- `requireRole(["ADMIN"])`: Checks the JWT token for specific roles.
- `requireAdmin()`, `requireInstructor()`: Convenience wrappers.

These functions must be called in Next.js Server Components or API Route Handlers before returning sensitive data.
