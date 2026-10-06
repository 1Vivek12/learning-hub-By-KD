"use client";
import React, { useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Loader2 } from 'lucide-react';

export default function AdminPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const role = session?.user?.role as string | undefined;
  const isAdmin = role === 'ADMIN' || role === 'SUPER_ADMIN';

  // Loading state — wait for session to resolve before rendering
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <Loader2 className="w-8 h-8 animate-spin text-sky-500" />
      </div>
    );
  }

  // Not authenticated at all — redirect to login
  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white flex-col gap-4">
        <h1 className="text-3xl font-bold">401 - Unauthorised</h1>
        <p className="text-slate-400">You must be signed in to access this area.</p>
        <button
          onClick={() => router.push('/login')}
          className="px-4 py-2 bg-sky-500 rounded-lg text-white mt-4 hover:bg-sky-600"
        >
          Sign In
        </button>
      </div>
    );
  }

  // Authenticated but wrong role — 403
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white flex-col gap-4">
        <h1 className="text-3xl font-bold">403 - Forbidden</h1>
        <p className="text-slate-400">You do not have administrative privileges to access this area.</p>
        <button
          onClick={() => router.push('/')}
          className="px-4 py-2 bg-sky-500 rounded-lg text-white mt-4 hover:bg-sky-600"
        >
          Return to Home
        </button>
      </div>
    );
  }

  return (
    <AdminLayout
      onBackToSite={() => router.push('/')}
      onJoinLiveClassAsHost={() => {}}
    />
  );
}
