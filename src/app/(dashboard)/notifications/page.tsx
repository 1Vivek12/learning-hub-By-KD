import React from 'react';
import { NotificationDropdown } from '@/components/dashboard/NotificationDropdown';
// Ideally a larger NotificationList component would go here, 
// for Phase 8B we provide a basic container since Dropdown holds most logic.

export default function NotificationsPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 md:p-12">
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Your Notifications</h1>
          <p className="text-slate-500 text-sm mt-1">View all recent system alerts and updates.</p>
        </div>
        
        {/* We can re-use the NotificationDropdown logic by rendering it differently, 
            but for this phase, dropping the user into the page is the foundation. */}
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-sm text-center">
          <p className="text-slate-500">
            For detailed notifications, click the bell icon in the header.
          </p>
        </div>
      </div>
    </div>
  );
}
