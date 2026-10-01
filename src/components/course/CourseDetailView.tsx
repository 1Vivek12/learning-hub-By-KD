import React, { useState } from 'react';
import { Course, Instructor } from '@/types';
import { useLanguage } from '@/i18n/LanguageContext';
import { useAuth } from '@/services/authService';
import {
  Star,
  Clock,
  BookOpen,
  Award,
  CheckCircle2,
  Play,
  ShieldCheck,
  Globe,
  Share2,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  Video,
  FileText,
} from 'lucide-react';

interface CourseDetailViewProps {
  course: Course;
  instructor?: Instructor;
  onBack: () => void;
  onStartLearning: (lessonId?: string) => void;
  onEnroll: (course: Course) => void;
}

export const CourseDetailView: React.FC<CourseDetailViewProps> = ({
  course,
  instructor,
  onBack,
  onStartLearning,
  onEnroll,
}) => {
  const { t, l } = useLanguage();
  const { isEnrolled } = useAuth();
  const enrolled = isEnrolled(course.id);
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({
    [course.modules[0]?.id || '']: true,
  });
  const [activePreviewLessonVideo, setActivePreviewLessonVideo] = useState<string | null>(null);

  const toggleModule = (modId: string) => {
    setExpandedModules((prev) => ({ ...prev, [modId]: !prev[modId] }));
  };

  return (
    <div className="min-h-screen py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to All Courses</span>
      </button>

      {/* Main Header Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left 8 Cols: Course Presentation */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-md bg-sky-500/15 text-sky-400 border border-sky-500/30">
              {course.category}
            </span>
            <span className="text-xs font-medium px-2.5 py-1 rounded-md bg-slate-800 text-slate-300">
              {course.level}
            </span>
            <span className="text-xs font-medium px-2.5 py-1 rounded-md bg-emerald-500/15 text-emerald-400">
              {course.language}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white dark:text-white light:text-slate-900 leading-tight">
            {l(course.title)}
          </h1>

          <p className="text-base text-slate-300 dark:text-slate-300 light:text-slate-700 leading-relaxed">
            {l(course.longDescription)}
          </p>

          {/* Social Proof & Instructor Bar */}
          <div className="flex flex-wrap items-center gap-6 pt-2 border-y border-white/10 dark:border-white/10 light:border-slate-200 py-4">
            <div className="flex items-center gap-2 text-sm text-amber-400 font-bold">
              <Star className="w-4 h-4 fill-amber-400" />
              <span>{course.rating}</span>
              <span className="text-slate-400 font-normal">({course.reviewsCount} reviews)</span>
            </div>

            <div className="flex items-center gap-2 text-sm text-slate-300 dark:text-slate-300 light:text-slate-700">
              <Clock className="w-4 h-4 text-sky-400" />
              <span>{course.durationHours} hours on-demand</span>
            </div>

            <div className="flex items-center gap-2 text-sm text-slate-300 dark:text-slate-300 light:text-slate-700">
              <BookOpen className="w-4 h-4 text-emerald-400" />
              <span>{course.lessonsCount} lessons</span>
            </div>

            <div className="flex items-center gap-2 text-sm text-slate-300 dark:text-slate-300 light:text-slate-700">
              <Award className="w-4 h-4 text-purple-400" />
              <span>Verified Certificate</span>
            </div>
          </div>

          {/* What You Will Learn Grid */}
          <div className="p-6 rounded-2xl border bg-slate-900/60 border-white/10 dark:bg-slate-900/60 dark:border-white/10 light:bg-slate-50 light:border-slate-200">
            <h3 className="text-lg font-bold text-white dark:text-white light:text-slate-900 mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>{t('course.whatYouWillLearn')}</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {course.learningOutcomes.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300 dark:text-slate-300 light:text-slate-700 leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                  <span>{l(item)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Curriculum Section */}
          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white dark:text-white light:text-slate-900">
                {t('course.curriculum')}
              </h3>
              <span className="text-xs text-slate-400">
                {course.modules.length} modules • {course.lessonsCount} total lessons
              </span>
            </div>

            <div className="space-y-3">
              {course.modules.map((mod, modIdx) => {
                const isExpanded = !!expandedModules[mod.id];
                return (
                  <div
                    key={mod.id}
                    className="rounded-xl border overflow-hidden border-white/10 bg-slate-900/40 dark:border-white/10 dark:bg-slate-900/40 light:bg-white light:border-slate-200"
                  >
                    <button
                      onClick={() => toggleModule(mod.id)}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-white/5 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono text-sky-400 font-semibold">
                          0{modIdx + 1}
                        </span>
                        <h4 className="text-sm font-semibold text-slate-100 dark:text-slate-100 light:text-slate-900">
                          {l(mod.title)}
                        </h4>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-400">
                        <span>{mod.lessons.length} lessons</span>
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="divide-y divide-white/5 border-t border-white/5 dark:divide-white/5 light:divide-slate-100">
                        {mod.lessons.map((lesson) => (
                          <div
                            key={lesson.id}
                            className="flex items-center justify-between p-3.5 pl-10 text-xs text-slate-300 dark:text-slate-300 light:text-slate-700 hover:bg-white/5 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <Video className="w-4 h-4 text-slate-500" />
                              <span className="font-medium">{l(lesson.title)}</span>
                            </div>

                            <div className="flex items-center gap-3">
                              <span className="text-slate-500">{lesson.durationMinutes} min</span>
                              {lesson.isFreePreview && (
                                <button
                                  onClick={() => setActivePreviewLessonVideo(lesson.videoUrl)}
                                  className="px-2 py-0.5 rounded text-[11px] font-semibold text-sky-400 bg-sky-500/10 border border-sky-500/20 hover:bg-sky-500/20 flex items-center gap-1"
                                >
                                  <Play className="w-3 h-3 fill-sky-400" />
                                  <span>Preview</span>
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Instructor Bio Card */}
          {instructor && (
            <div className="p-6 rounded-2xl border bg-slate-900/60 border-white/10 dark:bg-slate-900/60 light:bg-slate-50 light:border-slate-200 mt-8">
              <h3 className="text-base font-bold text-white dark:text-white light:text-slate-900 mb-4">
                {t('course.instructor')}
              </h3>
              <div className="flex items-start gap-4">
                <img
                  src={instructor.avatar}
                  alt={instructor.name}
                  className="w-16 h-16 rounded-xl object-cover border border-white/10"
                />
                <div className="space-y-1">
                  <h4 className="text-base font-bold text-slate-100 dark:text-slate-100 light:text-slate-900">
                    {instructor.name}
                  </h4>
                  <p className="text-xs text-sky-400 font-medium">{l(instructor.title)}</p>
                  <p className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-600 leading-relaxed pt-1">
                    {l(instructor.bio)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right 4 Cols: Sticky Pricing & Action Widget */}
        <div className="lg:col-span-4">
          <div className="sticky top-28 rounded-2xl border p-6 space-y-6 bg-slate-900/90 border-white/10 backdrop-blur-xl shadow-2xl dark:bg-slate-900/90 dark:border-white/10 light:bg-white light:border-slate-200">
            {/* Thumbnail preview with play trailer icon */}
            <div
              className="relative aspect-video rounded-xl overflow-hidden border border-white/10 cursor-pointer group"
              onClick={() => setActivePreviewLessonVideo(course.trailerUrl || course.modules[0]?.lessons[0]?.videoUrl)}
            >
              <img
                src={course.thumbnail}
                alt={course.title.en}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/25 transition-colors">
                <div className="w-12 h-12 rounded-full bg-sky-500/90 text-white flex items-center justify-center shadow-lg shadow-sky-500/30">
                  <Play className="w-5 h-5 fill-white ml-0.5" />
                </div>
              </div>
              <span className="absolute bottom-2 left-2 text-[10px] font-semibold bg-black/70 px-2 py-0.5 rounded text-white">
                Preview Course Trailer
              </span>
            </div>

            {/* Price Box */}
            <div className="space-y-1">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-extrabold text-white dark:text-white light:text-slate-900">
                  ₹{course.price.toLocaleString()}
                </span>
                {course.originalPrice > course.price && (
                  <span className="text-base text-slate-500 line-through">
                    ₹{course.originalPrice.toLocaleString()}
                  </span>
                )}
                {course.discountPercent && (
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    {course.discountPercent}% OFF
                  </span>
                )}
              </div>
              <p className="text-[11px] text-rose-400 font-medium">
                ⏳ Early Bird Pricing ends soon!
              </p>
            </div>

            {/* Primary Action Button */}
            {enrolled ? (
              <button
                onClick={() => onStartLearning()}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-300 hover:opacity-95 shadow-lg shadow-emerald-500/20 transition-all"
              >
                <Play className="w-4 h-4 fill-slate-950" />
                <span>{t('course.continue')}</span>
              </button>
            ) : (
              <button
                onClick={() => onEnroll(course)}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm text-slate-950 bg-gradient-to-r from-sky-400 via-teal-300 to-emerald-400 hover:opacity-95 shadow-lg shadow-sky-500/25 transition-all"
              >
                <span>{t('course.enrollNow')}</span>
              </button>
            )}

            {/* Features Checklist */}
            <div className="space-y-2.5 pt-2 border-t border-white/10 dark:border-white/10 light:border-slate-200 text-xs text-slate-300 dark:text-slate-300 light:text-slate-600">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{t('course.lifetime')}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{t('course.certificate')}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Access to all future live cohort sessions</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Downloadable enterprise workbooks & datasets</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-sky-400" />
                <span>30-Day 100% Money-Back Guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trailer / Preview Video Modal */}
      {activePreviewLessonVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-3xl rounded-2xl overflow-hidden border border-white/20 bg-slate-950 shadow-2xl">
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-slate-900">
              <span className="text-xs font-semibold text-sky-400 uppercase tracking-wider">
                Video Preview
              </span>
              <button
                onClick={() => setActivePreviewLessonVideo(null)}
                className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded bg-white/10"
              >
                ✕ Close
              </button>
            </div>
            <video
              src={activePreviewLessonVideo}
              controls
              autoPlay
              className="w-full aspect-video bg-black"
            />
          </div>
        </div>
      )}
    </div>
  );
};
