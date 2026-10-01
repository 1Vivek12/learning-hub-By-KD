# Local Storage Migration Report

As part of the production audit and Phase 1 migration, we analyzed the usage of `localStorage` across the application. The goal is to eliminate `localStorage` as a source of truth for security or data integrity.

## MUST MIGRATE TO SERVER (Security & Data Risk)
The following data was previously stored in `localStorage` via `storageService.ts` and must be fully migrated to PostgreSQL/Server APIs:

1.  **Authentication & User Roles:** Toggling between 'Student' and 'Admin' was stored locally. *Migrated to NextAuth (JWT cookies).*
2.  **Course Enrollment:** Purchased courses were written to local storage. *Must be migrated to the `Enrollment` database model.*
3.  **Payment & Orders:** Fake transactions were saved locally. *Must be migrated to the `Order` database model via secure webhooks.*
4.  **Lesson Progress:** Checking off a lesson updated local storage. *Must be migrated to the `LessonProgress` database model to persist across devices.*
5.  **Certificate Data:** Claims and grades were generated locally. *Must be handled entirely on the backend.*
6.  **Audit Logs:** Admin actions were logged to `localStorage`. *Must be migrated to the `AuditLog` database model.*

## SAFE UI STATE (Can remain in localStorage or cookies)
The following items do not pose a security risk and can remain on the client (or be moved to secure cookies for SSR hydration):

1.  **Theme Preference:** `learninghub_theme` ('light' or 'dark'). Safe to keep in `localStorage` or move to a cookie to prevent hydration mismatch.
2.  **Language Preference:** `learninghub_language` ('en', 'hi', 'hinglish'). Safe to keep locally or in cookies.
3.  **Local Notes Drafts:** Temporary video player notes before explicit saving. (If auto-save is implemented, they should sync to DB).
