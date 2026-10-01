# Phase 7A Development Report
## Admin Course & Curriculum Management

### Overview
Phase 7A converted the Admin course and curriculum management system from a fully localStorage-driven prototype into a production database-backed implementation. All course CRUD, module/lesson management, reorder, publish/unpublish, and delete operations now go through authenticated admin-only APIs with full audit logging and data integrity protection.

### APIs

#### Course APIs
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/courses` | List all courses with modules, lesson counts, enrollment counts |
| POST | `/api/admin/courses` | Create a new course (validates `titleEn` + `slug`, detects duplicate slugs) |
| GET | `/api/admin/courses/[id]` | Get full course with modules, lessons, resources, enrollment count |
| PATCH | `/api/admin/courses/[id]` | Update course metadata (title, pricing, description, etc.) |
| DELETE | `/api/admin/courses/[id]` | Safe delete — blocks if course has enrollments |
| POST | `/api/admin/courses/[id]/publish` | Set course status to `PUBLISHED` |
| POST | `/api/admin/courses/[id]/unpublish` | Set course status to `DRAFT` |

#### Module APIs
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/modules?courseId=` | List modules for a course with lessons |
| POST | `/api/admin/modules` | Create module with auto-order assignment |
| PATCH | `/api/admin/modules/[id]` | Update module fields |
| DELETE | `/api/admin/modules/[id]` | Safe delete — blocks if lessons have progress |
| PATCH | `/api/admin/modules/reorder` | Reorder modules via `orderedIds[]` array |

#### Lesson APIs
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/lessons?moduleId=` | List lessons for a module |
| POST | `/api/admin/lessons` | Create lesson with auto-order assignment |
| PATCH | `/api/admin/lessons/[id]` | Update lesson fields |
| DELETE | `/api/admin/lessons/[id]` | Safe delete — blocks if lesson has progress records |
| PATCH | `/api/admin/lessons/reorder` | Reorder lessons via `orderedIds[]` array |

### Database Changes
No schema migrations were required. All operations use existing Prisma models:
- `Course` (with `CourseStatus` enum: `DRAFT`, `PUBLISHED`, `ARCHIVED`)
- `CourseModule` (with `onDelete: Cascade` from Course)
- `Lesson` (with `onDelete: Cascade` from CourseModule)

### Authorization
- All admin API endpoints are protected by `requireAdmin()`.
- The session is verified server-side; no client-side role checks determine access.
- Every mutation (create, update, delete, publish, reorder) is audit-logged via `AuditService.log()`.

### Data Integrity Protections
- **Course delete**: Blocked (HTTP 409) if course has any `Enrollment` records.
- **Module delete**: Blocked (HTTP 409) if any child lesson has `LessonProgress` records.
- **Lesson delete**: Blocked (HTTP 409) if lesson has `LessonProgress` records.
- **Course create**: Returns HTTP 409 on duplicate `slug` (Prisma unique constraint `P2002`).

### UI Changes
- `AdminCourses.tsx` completely rewritten:
  - Removed all `StorageService` / localStorage imports and calls.
  - Courses are fetched from `GET /api/admin/courses` on mount.
  - Course editing loads full detail via `GET /api/admin/courses/[id]`.
  - Module/lesson CRUD is performed via individual API calls (not bulk save).
  - Module title and lesson title edits use `onBlur` to auto-save individually.
  - Lesson duration and free preview changes are saved immediately.
  - Module and lesson reordering uses up/down chevron buttons that call the reorder APIs.
  - Publish/unpublish toggles call the dedicated endpoints.
  - Delete operations show confirmation and handle 409 errors gracefully.
  - Loading and error states display properly.
  - Existing Learning Hub dark theme and visual design preserved.

### Files Changed

| File | Change |
|------|--------|
| `src/lib/services/courseService.ts` | Added `getCourseById`, `publishCourse`, `unpublishCourse`, safe `deleteCourse` |
| `src/app/api/admin/courses/route.ts` | Added validation, audit logging, duplicate slug detection |
| `src/app/api/admin/courses/[id]/route.ts` | Added audit logging, safe delete with enrollment check |
| `src/app/api/admin/courses/[id]/publish/route.ts` | Created — publish endpoint |
| `src/app/api/admin/courses/[id]/unpublish/route.ts` | Created — unpublish endpoint |
| `src/app/api/admin/modules/[id]/route.ts` | Added safe delete with progress check |
| `src/app/api/admin/lessons/[id]/route.ts` | Added safe delete with progress check |
| `src/components/admin/AdminCourses.tsx` | Complete rewrite — database-backed CRUD |

### Remaining Admin/CMS Work
- Admin user management panel (database-backed)
- Admin orders/payments panel (database-backed)
- Admin live classes panel (database-backed)
- Admin homepage CMS panel (database-backed)
- Category management CRUD
- Instructor management CRUD
- Coupon management CRUD
- Media/asset upload management
- Bulk operations (publish all, archive, etc.)
