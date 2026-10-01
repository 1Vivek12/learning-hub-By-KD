"use client";
import React, { useState, useEffect } from 'react';
import { CourseDetailView } from '@/components/course/CourseDetailView';
import { useRouter, useParams } from 'next/navigation';
import { Course } from '@/types';

export default function CourseDetailPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;
  
  const [course, setCourse] = useState<Course | null>(null);
  const [instructor, setInstructor] = useState<any>(null);

  useEffect(() => {
    if (slug) {
      fetch(`/api/courses/${slug}`)
        .then(res => res.json())
        .then(data => {
          if (data && !data.error) {
            setCourse(data);
            setInstructor(data.instructor);
          }
        })
        .catch(err => console.error(err));
    }
  }, [slug]);

  if (!course) return <div className="p-8 text-center text-white">Course not found or loading...</div>;

  return (
    <CourseDetailView
      course={course}
      instructor={instructor}
      onBack={() => router.push('/courses')}
      onStartLearning={(lessonId) => router.push(`/learn/${course.slug}?lessonId=${lessonId || ''}`)}
      onEnroll={() => {}}
    />
  );
}
