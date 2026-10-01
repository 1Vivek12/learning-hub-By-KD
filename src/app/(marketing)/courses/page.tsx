"use client";
import React, { useState, useEffect } from 'react';
import { FeaturedCoursesSection } from '@/components/home/FeaturedCoursesSection';
import { useRouter } from 'next/navigation';
import { Course } from '@/types';

export default function CoursesPage() {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    fetch('/api/courses')
      .then(res => res.json())
      .then(data => setCourses(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="pt-8">
      <FeaturedCoursesSection
        courses={courses.filter((c) => c.status === 'published')}
        onSelectCourse={(slug) => router.push(`/courses/${slug}`)}
        onEnrollCourse={() => {}}
      />
    </div>
  );
}
