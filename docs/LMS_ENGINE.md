# LMS Engine Architecture

## Course Access System
The `CourseAccessService` acts as the single source of truth for course access authorization. 
- It validates the user's active enrollment against the PostgreSQL database.
- Prevents client-side spoofing by verifying real enrollment records rather than trusting a browser-side `isEnrolled` flag.

## Progress System
- **Lesson Progress**: The `ProgressService` tracks individual lesson completion (`LessonProgress`). For video lessons, it stores `percentage` and `lastPosition`. 
- **Course Progress**: It dynamically computes overall course completion as a percentage of completed lessons against total module lessons. No client-supplied completion payload is trusted directly.
- **Server API**: `POST /api/lessons/[lessonId]/progress` processes and enforces boundaries (0-100%).
- **Completion**: `POST /api/lessons/[lessonId]/complete` handles explicit completion requests, protected by ownership checks.

## Resource Access System
Prepared models for `LessonNote` and `LessonBookmark`. Access to paid materials is secured by the centralized `CourseAccessService`, preventing unauthorized direct link sharing or unauthenticated access.
