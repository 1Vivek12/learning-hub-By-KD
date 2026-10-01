# Certificate Architecture

## Issuance Workflow
1. Client requests `POST /api/certificates/issue` after seeing course completion.
2. Server calls `CertificateService.getCertificateEligibility()`.
3. Validates that `Enrollment.status === 'COMPLETED'` and checks for existing certificates to prevent duplicates.
4. Generates a secure `certificateNumber` and `verificationToken`.
5. Prepares PDF rendering context.
6. Calls `CertificateStorageProvider` to store the generated PDF to S3/R2.
7. Stores metadata in PostgreSQL.

## Idempotency and Duplication Prevention
- **Application Level**: Service layer explicitly checks `prisma.certificate.findUnique({ where: { enrollmentId } })`.
- **Database Level**: The Prisma model defines `@@unique([userId, courseId])` and `@unique` on `enrollmentId`.

## PDF Generation
The system rejects client-side HTML scraping or Canvas screenshots as insecure and unprofessional. It uses a server-driven PDF compilation pipeline, ensuring identical, high-fidelity branding across all users.
