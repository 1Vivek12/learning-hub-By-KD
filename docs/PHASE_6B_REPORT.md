# Phase 6B Development Report
## Real LiveKit / WebRTC Integration

### Overview
Phase 6B bridged the gap between the Learning Hub authorization backend (built in Phase 6A) and the real-time `LiveKit` infrastructure. The application can now authorize and issue secure, cryptographic tokens to users, granting precise, role-based access to specific WebRTC rooms.

### LiveKit Configuration
- Updated `.env.example` to define standard LiveKit environment variables: `NEXT_PUBLIC_LIVEKIT_URL`, `LIVEKIT_API_KEY`, `LIVEKIT_API_SECRET`.
- Installed the official `livekit-server-sdk` to manage token generation cleanly and securely entirely on the server.

### Server-Side Token Generation
- Implemented `LiveKitService.generateToken()` inside `src/lib/services/liveKitService.ts`.
- The service maps Learning Hub User roles into LiveKit Grants:
  - **Instructors/Admins**: Can publish audio, video, and screen share.
  - **Students**: Are granted `canSubscribe: true` but `canPublish: false`, forcing them into an attendee role by default and preventing disruption in large classes.

### Join Token API (`POST /api/live-classes/[id]/token`)
- Connects the token issuer to the database authorization schema.
- **Workflow**:
  1. Verifies the user is authenticated.
  2. Ensures the `LiveClass` status is `LIVE`.
  3. Checks `LiveClassService.requireInstructorAccess` for instructors or `CourseAccessService.hasActiveEnrollment` for students.
  4. Automatically records/syncs the student's attendance in `LiveClassParticipant` utilizing `LiveClassService.joinClass()`.
  5. Finally returns the ephemeral JWT token and the public WebSocket URL.

### Room Mapping & Lifecycle
- `LiveClass` entities deterministically map their unique `roomId` (created in Phase 6A) to the `room` grant in the LiveKit token.
- Fake participants and mock connection delays have been entirely stripped from backend operations; the join/leave lifecycle directly interacts with both PostgreSQL and LiveKit securely.

### Remaining Work
- The frontend `VirtualClassroom` React component must be updated to consume this new token API. It currently has heavily mocked states relying on client-side timeouts. This will be updated in the upcoming polishing phase to hook directly into the `@livekit/components-react` SDK using the returned tokens.
