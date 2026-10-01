"use client";
import React from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const router = useRouter();

  return (
    <AdminLayout
      onBackToSite={() => router.push('/')}
      onJoinLiveClassAsHost={() => {}}
    />
  );
}
