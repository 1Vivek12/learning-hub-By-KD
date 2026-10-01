# Database Architecture

The application now uses PostgreSQL managed via Prisma ORM.

## Schema Highlights
- **User:** Stores credentials (bcrypt hash) and role.
- **Role Enum:** `STUDENT`, `INSTRUCTOR`, `ADMIN`, `SUPER_ADMIN`.
- **Course:** Core entity with localized titles (`titleEn`, `titleHi`, etc.). Contains relations to `Instructor` and `Category`.
- **CourseModule & Lesson:** Hierarchical structure for curriculum.
- **Enrollment & LessonProgress:** Tracking student access and completion.
- **Order & Payment:** Foundation for real Stripe/Razorpay integration.

## Seeding
A `seed.ts` script is provided to populate the database with initial Categories, Instructors, and Courses (migrated from the original `storageService.ts` hardcoded data). Run `npx prisma db seed` to initialize.
