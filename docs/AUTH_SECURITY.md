# Authentication Security Architecture

## Overview
Learning Hub uses NextAuth.js configured with a `CredentialsProvider` for authentication, backed by PostgreSQL. 

## Registration
- **Endpoint**: `POST /api/auth/register`
- **Security**: Passwords must be >= 6 characters. Hashed using `bcryptjs` before storage. Duplicate emails are prevented.
- **Roles**: All users register as `STUDENT` by default. Role elevation is strictly handled server-side by administrators.

## Authorization (RBAC)
- **Roles**: `STUDENT`, `INSTRUCTOR`, `ADMIN`, `SUPER_ADMIN`.
- **Helpers**: 
  - `requireAuth()`
  - `requireRole(roles[])`
  - `requireAdmin()`
  - `requireInstructor()`
- **Enforcement**: Role validation occurs entirely on the server within Route Handlers, Server Actions, or Server Components. The JWT token holds the role state securely.

## Audit Logging
Security events (e.g. `USER_REGISTERED`, `USER_ROLE_CHANGED`) are immediately logged to the database via `AuditService`.
