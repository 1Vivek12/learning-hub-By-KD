import React, { useState, useEffect } from 'react';
import { Course } from '@/types';
import { useLanguage } from '@/i18n/LanguageContext';
import { CourseCard } from '@/components/course/CourseCard';
import { Sparkles, Filter, Search } from 'lucide-react';

interface FeaturedCoursesSectionProps {
  courses: Course[];
  onSelectCourse: (slug: string) => void;
  onEnrollCourse: (course: Course) => void;
}

export const FeaturedCoursesSection: React.FC<FeaturedCoursesSectionProps> = ({
  courses,
  onSelectCourse,
  onEnrollCourse,
}) => {
  const { t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [filterQuery, setFilterQuery] = useState<string>('');
  const [instructors, setInstructors] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/courses').then(r => r.json()).then(data => {
      // Extract unique instructors from course data
      const instMap = new Map();
      data.forEach((c: any) => {
        if (c.instructor) instMap.set(c.instructor.id, c.instructor);
      });
      setInstructors(Array.from(instMap.values()));
    }).catch(console.error);
  }, []);

  const categories = ['All', 'Excel', 'SQL', 'Power BI'];

  const filtered = courses.filter((c) => {
    const matchesCategory =
      activeCategory === 'All' || c.category.toLowerCase() === activeCategory.toLowerCase();
    const q = filterQuery.toLowerCase();
    const matchesQuery =
      !q ||
      c.title.en.toLowerCase().includes(q) ||
      c.title.hinglish.toLowerCase().includes(q) ||
      c.shortDescription.en.toLowerCase().includes(q) ||
      c.skills.some((s) => s.toLowerCase().includes(q));

    return matchesCategory && matchesQuery;
  });

  return (
    <section id="courses-section" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 text-sky-400 text-xs font-semibold uppercase tracking-wider border border-sky-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t('courses.badge')}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white dark:text-white light:text-slate-900 tracking-tight">
            {t('courses.title')}
          </h2>
          <p className="text-sm text-slate-400 dark:text-slate-400 light:text-slate-600 max-w-xl">
            {t('courses.subtitle')}
          </p>
        </div>

        {/* Category Pills & Search */}
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeCategory === cat
                  ? 'bg-sky-500 text-slate-950 font-bold shadow-md shadow-sky-500/20'
                  : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 dark:bg-white/5 dark:border-white/10 light:bg-slate-100 light:border-slate-300 light:text-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Courses Cards Grid */}
      {filtered.length === 0 ? (
        <div className="py-16 text-center text-slate-400">
          <p className="text-base font-semibold">{t('course.noResults')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((course) => {
            const instructor = instructors.find((i) => i.id === course.instructorId);
            return (
              <CourseCard
                key={course.id}
                course={course}
                instructor={instructor}
                onSelect={onSelectCourse}
                onEnrollClick={onEnrollCourse}
              />
            );
          })}
        </div>
      )}
    </section>
  );
};
