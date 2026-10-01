import React from 'react';
import { Course, Instructor } from '@/types';
import { useLanguage } from '@/i18n/LanguageContext';
import { useAuth } from '@/services/authService';
import { Star, Clock, BookOpen, ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';

interface CourseCardProps {
  course: Course;
  instructor?: Instructor;
  onSelect: (slug: string) => void;
  onEnrollClick?: (course: Course) => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({
  course,
  instructor,
  onSelect,
  onEnrollClick,
}) => {
  const { t, l } = useLanguage();
  const { isEnrolled } = useAuth();
  const enrolled = isEnrolled(course.id);

  return (
    <div
      id={`course-card-${course.id}`}
      className="group relative flex flex-col rounded-2xl overflow-hidden border transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl bg-[#0f172a]/90 border-white/10 hover:border-sky-500/40 hover:shadow-sky-500/10 dark:bg-[#0f172a]/90 dark:border-white/10 dark:hover:border-sky-500/40 light:bg-white light:border-slate-200 light:hover:border-sky-400 light:hover:shadow-slate-200"
    >
      {/* Thumbnail Container */}
      <div className="relative aspect-video w-full overflow-hidden cursor-pointer" onClick={() => onSelect(course.slug)}>
        <img
          src={course.thumbnail}
          alt={course.title.en}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent opacity-80 dark:from-[#0f172a] light:from-slate-900/40" />

        {/* Category Pill */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md backdrop-blur-md bg-slate-950/80 text-sky-400 border border-sky-500/30">
            {course.category}
          </span>
          {course.isFeatured && (
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md backdrop-blur-md bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Featured
            </span>
          )}
        </div>

        {/* Level Tag */}
        <div className="absolute bottom-3 right-3 text-[11px] font-medium px-2 py-0.5 rounded bg-black/60 backdrop-blur-sm text-slate-300 border border-white/10">
          {course.level}
        </div>
      </div>

      {/* Card Content */}
      <div className="flex flex-col flex-1 p-5 space-y-3">
        {/* Title */}
        <h3
          onClick={() => onSelect(course.slug)}
          className="text-base font-bold line-clamp-2 cursor-pointer transition-colors text-white group-hover:text-sky-400 dark:text-white dark:group-hover:text-sky-400 light:text-slate-900 light:group-hover:text-sky-600"
        >
          {l(course.title)}
        </h3>

        {/* Short Description */}
        <p className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-600 line-clamp-2 leading-relaxed">
          {l(course.shortDescription)}
        </p>

        {/* Instructor Info */}
        {instructor && (
          <div className="flex items-center gap-2.5 pt-1">
            <img
              src={instructor.avatar}
              alt={instructor.name}
              className="w-6 h-6 rounded-full object-cover border border-white/10"
            />
            <span className="text-xs text-slate-300 dark:text-slate-300 light:text-slate-700 font-medium truncate">
              {instructor.name}
            </span>
          </div>
        )}

        {/* Meta Bar: Rating, Duration, Lessons */}
        <div className="flex items-center justify-between text-xs text-slate-400 dark:text-slate-400 light:text-slate-500 pt-2 border-t border-white/5 dark:border-white/5 light:border-slate-100">
          <div className="flex items-center gap-1 text-amber-400 font-semibold">
            <Star className="w-3.5 h-3.5 fill-amber-400" />
            <span>{course.rating}</span>
            <span className="text-[11px] text-slate-500">({course.reviewsCount})</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-400" />
              {course.durationHours}h
            </span>
            <span className="flex items-center gap-1">
              <BookOpen className="w-3 h-3 text-slate-400" />
              {course.lessonsCount}
            </span>
          </div>
        </div>

        {/* Pricing & CTA */}
        <div className="mt-auto pt-3 flex items-center justify-between">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-white dark:text-white light:text-slate-900">
                ₹{course.price.toLocaleString()}
              </span>
              {course.originalPrice > course.price && (
                <span className="text-xs text-slate-500 line-through">
                  ₹{course.originalPrice.toLocaleString()}
                </span>
              )}
            </div>
            {course.discountPercent && (
              <span className="text-[10px] font-semibold text-emerald-400">
                {course.discountPercent}% OFF Limited
              </span>
            )}
          </div>

          {enrolled ? (
            <button
              onClick={() => onSelect(course.slug)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 hover:bg-emerald-500/25 transition-all"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{t('course.continue')}</span>
            </button>
          ) : (
            <button
              onClick={() => (onEnrollClick ? onEnrollClick(course) : onSelect(course.slug))}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-slate-950 bg-gradient-to-r from-sky-400 to-teal-300 hover:opacity-95 shadow-sm transition-all"
            >
              <span>{t('course.enrollNow')}</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
