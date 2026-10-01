# Certificate Verification

## Overview
Learning Hub certificates are publicly verifiable, ensuring that employers can trust the credentials issued by the platform.

## Security Constraints
The API endpoint `GET /api/certificates/verify/[certificateNumber]` strictly whitelists the fields returned:
- `certificateNumber`
- `studentName`
- `courseTitle`
- `instructorName`
- `issuedAt`
- `completedAt`
- `status` (ISSUED / REVOKED)

It explicitly hides:
- `userId`
- `user.email`
- `orderId`
- Internal IDs.

## Revocation
Certificates can be revoked by administrators if academic integrity is violated or refunds are issued. Once the `status` flag is switched to `REVOKED` in the database, the public verification page immediately displays the revoked status. No cache bypass is possible as this queries the primary database.
