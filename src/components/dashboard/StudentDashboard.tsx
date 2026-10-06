import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Course, LiveClass, Certificate } from '@/types';
import { useLanguage } from '@/i18n/LanguageContext';
import { useSession } from 'next-auth/react';
import {
  Play,
  BookOpen,
  Award,
  Video,
  Clock,
  Flame,
  ArrowRight,
  ExternalLink,
  Calendar,
  CheckCircle2
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
  const { data: session } = useSession();
  const user = session?.user;

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

  return (
    <div className="min-h-screen py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      
      {/* 1. WELCOME HEADER & 2. LEARNING PROGRESS */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-8 border-b border-slate-200 dark:border-white/10">
        <div className="space-y-3">
          <p className="text-sm font-medium text-sky-600 dark:text-sky-400 uppercase tracking-wider">
            Student Portal
          </p>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {t('dashboard.welcome')} {user?.name?.split(' ')[0] || ''} 👋
          </h1>
          <p className="text-base text-slate-600 dark:text-slate-400 max-w-2xl">
            Track your enterprise analytics skills, participate in interactive masterclasses, and earn verified credentials.
          </p>
        </div>

        {/* Premium Learning Progress Metrics */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 dark:bg-slate-900/50 dark:border-white/10">
            <div className="p-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-white/5">
              <BookOpen className="w-5 h-5 text-sky-600 dark:text-sky-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Enrolled</p>
              <p className="text-xl font-bold text-slate-900 dark:text-white">{enrolledCourses.length}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 dark:bg-slate-900/50 dark:border-white/10">
            <div className="p-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-white/5">
              <Clock className="w-5 h-5 text-sky-600 dark:text-sky-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Hours Learned</p>
              <p className="text-xl font-bold text-slate-900 dark:text-white">32h</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 dark:bg-slate-900/50 dark:border-white/10">
            <div className="p-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-white/5">
              <Flame className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Active Streak</p>
              <p className="text-xl font-bold text-slate-900 dark:text-white">14d</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Main Content Column */}
        <div className="lg:col-span-8 space-y-12">
          
          {/* 3. CONTINUE LEARNING */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Courses in Progress
              </h2>
              {enrolledCourses.length > 0 && (
                <Link
                  href="/courses"
                  className="text-sm font-medium text-sky-600 hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300 flex items-center gap-1 focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:outline-none rounded"
                >
                  Explore Catalog
                  <ArrowRight className="w-4 h-4" />
                </Link>
              )}
            </div>

            {enrolledCourses.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 dark:border-white/10 dark:bg-slate-900/40">
                <div className="p-4 bg-white dark:bg-slate-800 rounded-full shadow-sm mb-4">
                  <BookOpen className="w-8 h-8 text-slate-400 dark:text-slate-500" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No active enrollments</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6">
                  You haven't enrolled in any courses yet. Explore our production-grade curriculum in Excel, SQL, and Power BI to get started.
                </p>
                <Link
                  href="/courses"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-xl text-sm font-bold bg-slate-900 text-white hover:bg-slate-800 dark:bg-sky-500 dark:text-slate-950 dark:hover:bg-sky-400 focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:outline-none transition-colors"
                >
                  Browse Catalog
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {enrolledCourses.map((course) => (
                  <div
                    key={course.id}
                    className="group flex flex-col rounded-2xl border border-slate-200 bg-white hover:border-slate-300 hover:shadow-md dark:border-white/10 dark:bg-slate-900/60 dark:hover:border-white/20 transition-all overflow-hidden"
                  >
                    <Link
                      href={`/learn/${course.slug}`}
                      className="aspect-video relative overflow-hidden block focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:outline-none"
                    >
                      <img
                        src={course.thumbnail}
                        alt={course.title.en}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors" />
                    </Link>

                    <div className="p-5 flex flex-col flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-sky-600 bg-sky-50 dark:text-sky-400 dark:bg-sky-500/10 px-2 py-1 rounded-md">
                          {course.category}
                        </span>
                      </div>
                      
                      <Link
                        href={`/learn/${course.slug}`}
                        className="text-base font-bold text-slate-900 dark:text-white line-clamp-2 hover:text-sky-600 dark:hover:text-sky-400 transition-colors focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:outline-none rounded mb-4"
                      >
                        {l(course.title)}
                      </Link>

                      {/* Clean Progress Indicator */}
                      <div className="mt-auto space-y-2">
                        <div className="flex justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
                          <span>45% Complete</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-sky-500 w-[45%] rounded-full" />
                        </div>
                      </div>

                      <div className="pt-5 mt-5 border-t border-slate-100 dark:border-white/5">
                        <Link
                          href={`/learn/${course.slug}`}
                          className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold bg-slate-50 text-slate-900 hover:bg-slate-100 dark:bg-white/5 dark:text-white dark:hover:bg-white/10 transition-colors focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:outline-none"
                        >
                          <Play className="w-4 h-4" />
                          <span>Continue Learning</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Sidebar Column */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* 4. UPCOMING LIVE CLASSES */}
          <section className="bg-slate-50 rounded-3xl p-6 border border-slate-200 dark:bg-slate-900/30 dark:border-white/10">
            <div className="flex items-center gap-2 mb-6">
              <div className="p-2 bg-rose-100 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400 rounded-lg">
                <Video className="w-4 h-4" />
              </div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Interactive Live Sessions
              </h2>
            </div>

            {liveClasses.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                <p className="text-sm font-medium text-slate-900 dark:text-white mb-1">No upcoming sessions</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Check back later for new live classes.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {liveClasses.map((cls) => (
                  <div
                    key={cls.id}
                    className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 dark:bg-slate-900/60 dark:border-white/10 dark:hover:border-white/20 transition-colors"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                        cls.status === 'live'
                          ? 'bg-rose-100 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400 animate-pulse'
                          : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                      }`}>
                        {cls.status === 'live' ? '🔴 LIVE NOW' : 'Scheduled'}
                      </span>
                    </div>
                    
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                      {l(cls.title)}
                    </h4>
                    
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-4">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Starts in 30 mins • {cls.durationMinutes}m</span>
                    </div>

                    <button
                      onClick={() => onJoinLiveClass(cls)}
                      className="w-full inline-flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200 transition-colors focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:outline-none"
                    >
                      <span>Join Session</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* 5. CERTIFICATES / ACHIEVEMENTS */}
          <section className="bg-slate-50 rounded-3xl p-6 border border-slate-200 dark:bg-slate-900/30 dark:border-white/10">
            <div className="flex items-center gap-2 mb-6">
              <div className="p-2 bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400 rounded-lg">
                <Award className="w-4 h-4" />
              </div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Earned Certificates
              </h2>
            </div>

            {certificates.length === 0 ? (
              <div className="text-center py-8">
                <Award className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                <p className="text-sm font-medium text-slate-900 dark:text-white mb-1">No certificates yet</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Complete all lessons in a course to unlock your credentials.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {certificates.map((cert) => (
                  <div
                    key={cert.id}
                    className="p-4 rounded-2xl bg-white border border-slate-200 dark:bg-slate-900/60 dark:border-white/10 flex flex-col gap-3"
                  >
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">{cert.courseTitle}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Issued: {cert.completionDate}</p>
                    </div>

                    <button
                      onClick={() => onViewCertificate(cert)}
                      className="inline-flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 dark:text-slate-300 dark:bg-white/5 dark:hover:bg-white/10 transition-colors focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:outline-none"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>View Credential</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

        </div>
      </div>
    </div>
  );
};
