"use client";
import React from 'react';
import { StudentDashboard } from '@/components/dashboard/StudentDashboard';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();

  return (
    <StudentDashboard
      onOpenCoursePlayer={(course, lessonId) => router.push(`/learn/${course.slug}?lessonId=${lessonId || ''}`)}
      onJoinLiveClass={() => {}}
      onBrowseCourses={() => router.push('/courses')}
      onViewCertificate={() => {}}
    />
  );
}
