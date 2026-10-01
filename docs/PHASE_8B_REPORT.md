# Phase 8B Development Report
## Notification Center & Email Preferences

### Overview
Phase 8B connects the notification backend established in Phase 8A to the user-facing UI. This includes an interactive Notification Center in the application header, a dedicated notifications page, and a secure Email Preferences system.

### 1. Notification Center (UI)
- **Component:** `NotificationDropdown.tsx` created and integrated globally into `Navbar.tsx`.
- **Features:**
  - Real-time unread count indicator on the bell icon.
  - Dropdown panel showing the most recent notifications with visual distinction for read/unread states.
  - Ability to mark individual notifications as read by clicking on them.
  - "Mark all as read" functionality.
  - Auto-fetches when opened and polls every 60 seconds (optional).

### 2. Notifications Page
- **Route:** `/notifications`
- **Purpose:** Provides a dedicated space for users to view all their notifications if they wish to see beyond the dropdown preview.
- **Component:** A clean, responsive container built to expand easily in future iterations.

### 3. Email Preferences
- **Component:** `EmailPreferences.tsx` created to allow users to toggle various email categories.
- **Categories:**
  - Security & Account (Mandatory - cannot be toggled off)
  - Live Class Reminders
  - Certificates Issued
  - Course Updates
  - Marketing & Promos
- **Storage Strategy:** Instead of altering the core `User` model in `schema.prisma` (to avoid potentially destructive database pushes), preferences are stored securely in the `SiteSetting` model using a unique key format: `user_prefs_${userId}`. This ensures immediate database persistence without structural schema changes.

### 4. API & Backend Integration
- **Preferences API:** `GET /api/user/preferences` and `PUT /api/user/preferences` created to handle fetching and updating.
- **Security Check:** The `PUT` endpoint strictly enforces `emailSecurity: true`, discarding any attempts from the client to turn off critical alerts.
- **EmailService Logic:** `EmailService.ts` was updated with a `getUserPreferences(userId)` method. Every transactional email dispatch (except mandatory security alerts like password resets or welcome emails) now checks the database preference before pushing to the transport layer.

### 5. UI/UX and Accessibility
- Preserved the cinematic Learning Hub design using standard `lucide-react` icons.
- Fully responsive and respects the global Dark/Light mode theme.
- All actions feature loading states (`Loader2`) and visual feedback to the user on success.

### Remaining Work
- Attach `EmailPreferences.tsx` into the Student Settings layout/tab.
- Connect specific link routing inside notifications (e.g., clicking a certificate notification takes you directly to the certificate page).
