# Automated Testing and CI

This project uses **Vitest** as the primary testing framework to protect against security and business logic regressions.

## Test Commands

- `npm run test` — Runs the test suite once (CI-friendly)
- `npm run test:watch` — Runs the test suite in watch mode
- `npm run typecheck` — Validates TypeScript types (fails on errors)
- `npm run lint` — Runs ESLint

## Test Structure

Tests are organized under the `tests/` directory:
- `tests/security/` - Regression tests ensuring auth, RBAC, and ownership boundaries remain intact.

## Test Environment

Tests run with mocked credentials and services.
**CRITICAL:** Tests must NEVER execute destructive operations against the production database. 
- The `PrismaClient` is mocked by default in `vitest.setup.ts` using `vitest-mock-extended` (or explicit mocks).
- External services (Razorpay, LiveKit, Nodemailer) must be mocked using `vi.mock()`.

## CI Workflow

A GitHub Actions workflow is located at `.github/workflows/ci.yml`.
On `push` and `pull_request` to `main`, it runs:
1. `npm ci`
2. `npm run typecheck`
3. `npm run lint`
4. `npm run test:ci`
5. `npm run build`

The CI environment uses placeholder secrets and fake database URLs to ensure builds do not depend on production credentials.

## Regression Areas Covered

- **TASK 1:** RBAC Authorization (`tests/security/rbac.test.ts`)
- **TASK 2:** Instructor Ownership (`tests/security/ownership.test.ts`)
- **TASK 9:** Draft Exposure (`tests/security/regression.test.ts`)

*(Additional regression tests for Notification IDOR, Progress Security, Refund Security, etc., should be expanded in `regression.test.ts` following the established mocking patterns).*
