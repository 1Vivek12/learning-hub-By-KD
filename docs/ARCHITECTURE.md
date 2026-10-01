# Architecture Migration

Learning Hub is transitioning from a static React/Vite SPA (where `localStorage` acted as the database) to a robust full-stack application using the Next.js App Router.

## Foundation Architecture
- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Auth:** Auth.js (NextAuth)

## Folder Structure
- `/src/app`: Contains Next.js file-based routing and layout wrappers.
  - `(marketing)`: Public pages (home, course catalog, landing pages).
  - `(student)`: Protected dashboard and LMS features.
  - `(admin)`: CMS and administration portal.
  - `learn/[courseSlug]`: Immersive course player UI.
  - `api`: Next.js Route Handlers (REST-like endpoints).
- `/src/components`: UI components, mostly preserved from the original Vite prototype.
- `/src/lib`: Utilities for Prisma DB client, Auth utilities, Zod validation, etc.
- `/prisma`: Contains `schema.prisma` and `seed.ts`.

## UI Preservation
The original visual identity, Tailwind CSS styles, and cinematic aesthetics have been preserved. The primary change is how data flows into these components (fetching from PostgreSQL via Prisma rather than reading from `localStorage`).
