"use client";
import React, { useState, useEffect } from 'react';
import { HeroSection } from '@/components/hero/HeroSection';
import { FeaturedCoursesSection } from '@/components/home/FeaturedCoursesSection';
import { LiveMasterclassesSection } from '@/components/home/LiveMasterclassesSection';
import { WhyChooseUsSection } from '@/components/home/WhyChooseUsSection';
import { TestimonialsSection } from '@/components/home/TestimonialsSection';
import { FaqSection } from '@/components/home/FaqSection';
import { CtaBanner } from '@/components/home/CtaBanner';
import { useRouter } from 'next/navigation';
import { Course, LiveClass } from '@/types';

export default function HomePage() {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [liveClasses, setLiveClasses] = useState<LiveClass[]>([]);

  useEffect(() => {
    fetch('/api/courses')
      .then(res => res.json())
      .then(data => setCourses(data))
      .catch(err => console.error(err));
    
    // Live classes will be connected to real API in later phase
    setLiveClasses([]);
  }, []);

  return (
    <div>
      <HeroSection
        onExploreCourses={() => router.push('/courses')}
        onJoinLiveClass={() => {}}
      />
      <FeaturedCoursesSection
        courses={courses.filter((c) => c.status === 'published')}
        onSelectCourse={(slug) => router.push(`/courses/${slug}`)}
        onEnrollCourse={() => {}}
      />
      <LiveMasterclassesSection
        liveClasses={liveClasses}
        onJoinLiveClass={() => {}}
      />
      <WhyChooseUsSection />
      <TestimonialsSection />
      <FaqSection />
      <CtaBanner onExplore={() => router.push('/courses')} />
    </div>
  );
}
