import React, { useState, useEffect } from 'react';
import { Course, LiveClass, Certificate } from '@/types';
import { useLanguage } from '@/i18n/LanguageContext';
import { useAuth } from '@/services/authService';
import {
  Play,
  BookOpen,
  Award,
  Radio,
  Clock,
  Flame,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  Shield,
  User as UserIcon,
} from 'lucide-react';

interface StudentDashboardProps {
  onOpenCoursePlayer: (course: Course, lessonId?: string) => void;
  onJoinLiveClass: (liveClass: LiveClass) => void;
  onBrowseCourses: () => void;
  onViewCertificate: (cert: Certificate) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  onOpenCoursePlayer,
  onJoinLiveClass,
  onBrowseCourses,
  onViewCertificate,
}) => {
  const { t, l } = useLanguage();
  const { user, loginAsAdmin } = useAuth();

  const [allCourses, setAllCourses] = useState<any[]>([]);
  const [enrolledCourses, setEnrolledCourses] = useState<any[]>([]);
  const [liveClasses, setLiveClasses] = useState<any[]>([]);
  const [certificates, setCertificates] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/courses')
      .then(r => r.json())
      .then(setAllCourses)
      .catch(console.error);
      
    fetch('/api/enrollments')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) {
          setEnrolledCourses(data.map((e: any) => e.course));
        }
      })
      .catch(console.error);

    // TODO: Connect live classes and certificates to real API in next phase
    setLiveClasses([]);
    setCertificates([]);
  }, []);

  // Active / featured continue course
  const continueCourse = enrolledCourses[0] || allCourses[0];

  return (
    <div className="min-h-screen py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      {/* Welcome & Stats Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-8 rounded-3xl border bg-gradient-to-br from-slate-900 via-[#0e172a] to-slate-950 border-white/10 dark:border-white/10 light:from-white light:via-slate-50 light:to-slate-100 light:border-slate-200 shadow-xl">
        <div className="space-y-2">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-sky-400">
            Student Learning Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white dark:text-white light:text-slate-900">
            {t('dashboard.welcome')} {user.name.split(' ')[0]} 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-lg">
            Track your enterprise analytics skills, participate in live masterclasses, and earn verified credentials.
          </p>
        </div>

        {/* 3 Metric Pills */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center">
            <span className="block text-xl font-bold font-mono text-emerald-400">
              {enrolledCourses.length}
            </span>
            <span className="text-[11px] text-slate-400">Enrolled Courses</span>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center">
            <span className="block text-xl font-bold font-mono text-sky-400">32h</span>
            <span className="text-[11px] text-slate-400">{t('dashboard.hoursLearned')}</span>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center">
            <span className="block text-xl font-bold font-mono text-amber-400 flex items-center justify-center gap-1">
              <Flame className="w-4 h-4 fill-amber-400" />
              14d
            </span>
            <span className="text-[11px] text-slate-400">{t('dashboard.activeStreak')}</span>
          </div>
        </div>
      </div>

      {/* Hero Continue Learning Card */}
      {continueCourse && (
        <div className="relative rounded-3xl overflow-hidden border p-6 sm:p-8 bg-slate-900/90 border-white/10 dark:bg-slate-900/90 dark:border-white/10 light:bg-white light:border-slate-200 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>{t('dashboard.continue')}</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-white dark:text-white light:text-slate-900">
                {l(continueCourse.title)}
              </h2>

              <p className="text-xs sm:text-sm text-slate-400 line-clamp-2">
                {l(continueCourse.shortDescription)}
              </p>

              {/* Progress bar */}
              <div className="space-y-1.5 pt-2 max-w-md">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Course Progress:</span>
                  <span className="font-mono text-emerald-400 font-bold">45% Complete</span>
                </div>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-sky-400 to-emerald-400 w-[45%] rounded-full" />
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => onOpenCoursePlayer(continueCourse)}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-300 hover:opacity-95 shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
                >
                  <Play className="w-4 h-4 fill-slate-950" />
                  <span>Resume Next Lesson</span>
                </button>
              </div>
            </div>

            <div className="lg:col-span-4 aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-lg">
              <img
                src={continueCourse.thumbnail}
                alt={continueCourse.title.en}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      )}

      {/* Upcoming Live Sessions Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-rose-500 animate-pulse" />
            <h3 className="text-lg font-bold text-white dark:text-white light:text-slate-900">
              {t('dashboard.upcomingLive')}
            </h3>
          </div>
          <span className="text-xs text-slate-400">Two-way WebRTC Video & Audio</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {liveClasses.map((cls) => (
            <div
              key={cls.id}
              className="p-5 rounded-2xl border bg-slate-900/60 border-white/10 hover:border-rose-500/30 transition-all space-y-3 dark:bg-slate-900/60 light:bg-white light:border-slate-200"
            >
              <div className="flex items-center justify-between">
                <span
                  className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded ${
                    cls.status === 'live'
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30 animate-pulse'
                      : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {cls.status === 'live' ? '🔴 LIVE NOW' : 'Scheduled'}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {cls.durationMinutes} minutes
                </span>
              </div>

              <h4 className="text-sm font-bold text-white dark:text-white light:text-slate-900">
                {l(cls.title)}
              </h4>

              <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                {l(cls.description)}
              </p>

              <div className="pt-2 flex items-center justify-between border-t border-white/5">
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-sky-400" />
                  Starts in 30 mins
                </span>

                <button
                  onClick={() => onJoinLiveClass(cls)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-rose-500 hover:bg-rose-400 text-white transition-colors shadow-md shadow-rose-500/20"
                >
                  <span>{t('live.joinNow')}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Enrolled Courses Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white dark:text-white light:text-slate-900">
            {t('dashboard.myCourses')} ({enrolledCourses.length})
          </h3>
          <button
            onClick={onBrowseCourses}
            className="text-xs font-semibold text-sky-400 hover:underline flex items-center gap-1"
          >
            <span>Explore More Courses</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {enrolledCourses.length === 0 ? (
          <div className="p-12 text-center rounded-2xl border border-dashed border-white/15 bg-slate-900/40">
            <BookOpen className="w-10 h-10 mx-auto text-slate-500 mb-2 opacity-60" />
            <h4 className="text-sm font-bold text-slate-200">No active course enrollments yet</h4>
            <p className="text-xs text-slate-400 mt-1 mb-4">
              Explore our production-grade curriculum in Excel, SQL, and Power BI.
            </p>
            <button
              onClick={onBrowseCourses}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-sky-500 text-slate-950"
            >
              Browse Catalog
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrolledCourses.map((course) => (
              <div
                key={course.id}
                className="group rounded-2xl border overflow-hidden bg-slate-900/80 border-white/10 hover:border-sky-500/40 transition-all flex flex-col dark:bg-slate-900/80 light:bg-white light:border-slate-200"
              >
                <div className="aspect-video relative overflow-hidden">
                  <img
                    src={course.thumbnail}
                    alt={course.title.en}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute top-2 left-2 text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-black/70 text-sky-400">
                    {course.category}
                  </div>
                </div>

                <div className="p-4 flex flex-col flex-1 space-y-3">
                  <h4 className="text-xs font-bold text-white dark:text-white light:text-slate-900 line-clamp-2">
                    {l(course.title)}
                  </h4>

                  <div className="mt-auto pt-2">
                    <button
                      onClick={() => onOpenCoursePlayer(course)}
                      className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/25 transition-all"
                    >
                      <Play className="w-3.5 h-3.5 fill-emerald-400" />
                      <span>{t('course.continue')}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Earned Certificates */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white dark:text-white light:text-slate-900 flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-400" />
          <span>{t('dashboard.certificates')}</span>
        </h3>

        {certificates.length === 0 ? (
          <div className="p-8 rounded-2xl border border-white/10 bg-slate-900/40 text-center text-xs text-slate-400">
            Complete all lessons in a course to unlock your cryptographically verified certificate.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {certificates.map((cert) => (
              <div
                key={cert.id}
                className="p-5 rounded-2xl border bg-gradient-to-br from-amber-500/10 via-slate-900 to-slate-950 border-amber-500/30 flex items-center justify-between"
              >
                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase text-amber-400 font-bold">
                    ID: {cert.id}
                  </span>
                  <h4 className="text-sm font-bold text-white">{cert.courseTitle}</h4>
                  <p className="text-xs text-slate-400">Completed on {cert.completionDate}</p>
                </div>

                <button
                  onClick={() => onViewCertificate(cert)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-amber-400 text-slate-950 hover:bg-amber-300 transition-colors shrink-0"
                >
                  <span>{t('dashboard.viewCert')}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
