"use client";
import React, { useState, useEffect } from 'react';
import { CoursePlayer } from '@/components/player/CoursePlayer';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { Course } from '@/types';

export default function CoursePlayerPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  
  const courseSlug = params.courseSlug as string;
  const lessonId = searchParams.get('lessonId');
  
  const [course, setCourse] = useState<Course | null>(null);

  useEffect(() => {
    if (courseSlug) {
      fetch(`/api/courses/${courseSlug}`)
        .then(res => res.json())
        .then(data => {
          if (data && !data.error) {
            setCourse(data);
          }
        })
        .catch(err => console.error(err));
    }
  }, [courseSlug]);

  if (!course) return <div className="p-8 text-center text-white">Loading course...</div>;

  return (
    <CoursePlayer
      course={course}
      initialLessonId={lessonId || undefined}
      onBackToCourse={() => router.push(`/courses/${course.slug}`)}
      onClaimCertificate={() => {}}
    />
  );
}
