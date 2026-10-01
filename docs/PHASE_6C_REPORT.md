# Phase 6C Development Report
## Real Live Classroom Frontend

### Overview
Phase 6C replaced all mock/fake WebRTC behavior in the Learning Hub classroom with a real LiveKit integration. The `VirtualClassroom` component now connects to the authorized backend token endpoint, joins a real LiveKit room, and renders live audio/video tracks from actual participants.

### LiveKit Frontend Integration

**Packages installed:**
- `livekit-client` — Core LiveKit client SDK
- `@livekit/components-react` — React component helpers (available for future component-level refinements)

**Connection flow:**
1. Component mounts → calls `POST /api/live-classes/[id]/token`
2. Backend validates authentication + enrollment/instructor ownership (Phase 6A/6B RBAC)
3. Backend returns an ephemeral JWT token + LiveKit WebSocket URL
4. Client dynamically imports `livekit-client` (avoids SSR issues)
5. Client creates a `Room`, attaches event listeners, and calls `room.connect()`
6. On `RoomEvent.Connected`, local tracks are enabled based on server-granted permissions

### Components Changed

| File | Change |
|------|--------|
| `src/components/live/VirtualClassroom.tsx` | Complete rewrite: removed all mock WebRTC, fake participants, and fake chat. Now uses real LiveKit `Room` API. |
| `src/services/liveClassService.ts` | Stripped all mock data generators (`getInitialRoomParticipants`, `getInitialChatMessages`, `requestMediaPermissions`, `startScreenShare`, `stopScreenShare`, `stopLocalStream`). Only device enumeration utility retained. |

### Instructor/Student Behavior

- **Instructor/Admin**: Server grants `canPublish: true` in the LiveKit token. The UI enables camera, microphone, and screen share controls.
- **Student**: Server grants `canPublish: false` by default. Camera/mic toggle buttons are present but will gracefully fail with a `try/catch` if the server hasn't granted publish permissions. Subscribe permissions are always granted.
- **All**: `canPublishData: true` is granted for real-time chat via LiveKit data channels.

### Participant Grid
- Real participants are rendered from `room.remoteParticipants` and `room.localParticipant`
- Video tracks are attached to `<video>` elements via `track.attach()`
- Active speaker detection uses `RoomEvent.ActiveSpeakersChanged` — speaking participants get a green border highlight
- Mute/camera state is synced from track publication metadata

### Chat System
- Chat messages are sent via LiveKit's data channel (`publishData`) using JSON-encoded payloads
- Incoming messages are decoded from `RoomEvent.DataReceived`
- Chat UI is preserved from the original design (sky/amber color coding, host badges)

### Error/Reconnection Handling
- **Connecting**: Full-screen spinner with "Connecting to classroom…"
- **Error**: Full-screen error with message + Retry/Leave buttons
- **Reconnecting**: Amber banner overlay "Reconnecting to classroom…" while maintaining the last known participant state
- **Disconnected**: State tracked and reflected in the bottom status bar

### Removed Mock Logic
- `LiveClassService.getInitialRoomParticipants()` — fake hardcoded participants (Meera, Harshvardhan, etc.)
- `LiveClassService.getInitialChatMessages()` — fake hardcoded chat messages
- `LiveClassService.requestMediaPermissions()` — replaced by LiveKit's built-in `enableCameraAndMicrophone()`
- `LiveClassService.startScreenShare()` / `stopScreenShare()` — replaced by `setScreenShareEnabled()`
- All `initialStream`, `initialMuted`, `initialCameraOff` prop dependencies removed from the connection flow
- Hardcoded instructor avatar image from Unsplash removed from the stage area

### Security Enforcement
- Token generation happens exclusively on the server (`POST /api/live-classes/[id]/token`)
- No client-side role or permission values are trusted
- No localStorage is used for classroom authorization
- No fake participants are created

### Remaining Development Work
- Pre-join lobby UI (device selection before entering the room)
- Recording integration (LiveKit Egress)
- Breakout rooms
- Whiteboard/annotation overlay
- Mobile-responsive classroom layout refinements
