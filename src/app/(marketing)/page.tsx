"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Course, LiveClass } from '@/types';
import { useLanguage } from '@/i18n/LanguageContext';
import { 
  ArrowRight, 
  PlayCircle, 
  MonitorPlay, 
  CheckCircle2, 
  Award,
  Video
} from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const { t, l } = useLanguage();
  const [courses, setCourses] = useState<Course[]>([]);
  const [liveClasses, setLiveClasses] = useState<LiveClass[]>([]);

  useEffect(() => {
    fetch('/api/courses')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setCourses(data.filter((c: Course) => c.status === 'published'));
        }
      })
      .catch(err => console.error(err));
    
    fetch('/api/live-classes')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setLiveClasses(data);
        }
      })
      .catch(err => console.error(err));
  }, []);

  const featuredCourse = courses[0];

  return (
    <div className="flex flex-col bg-slate-50 dark:bg-[#0a0f1c] font-sans">
      
      {/* ──────────────────────────────────────────────── */}
      {/* 1. HERO                                          */}
      {/* ──────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-white dark:bg-[#070b14] border-b border-slate-200 dark:border-white/5">
        {/* Background image — editorial workspace photography */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/hero-learning.jpg"
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover object-center"
            loading="eager"
          />
          <div className="absolute inset-0 bg-white/85 dark:bg-[#070b14]/90" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 pt-20 pb-24 lg:pt-32 lg:pb-32">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-8">
              <span className="text-[11px] font-extrabold tracking-[0.2em] uppercase text-sky-700 dark:text-sky-400">
                {t('hero.eyebrow')}
              </span>
              
              <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold text-slate-900 dark:text-white leading-[1.1] tracking-tight">
                {t('hero.title')}
              </h1>
              
              <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed max-w-lg font-medium">
                {t('hero.description')}
              </p>
              
              <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
                <Link
                  href="/courses"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-white bg-slate-900 hover:bg-slate-800 dark:text-slate-950 dark:bg-sky-400 dark:hover:bg-sky-300 transition-colors focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:outline-none"
                >
                  <span>{t('hero.ctaPrimary')}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/live-list"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-slate-700 bg-white/80 hover:bg-white dark:text-white dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 transition-colors focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:outline-none backdrop-blur-sm"
                >
                  <Video className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                  <span>{t('hero.ctaSecondary')}</span>
                </Link>
              </div>
            </div>

            {/* Right Content — Featured Course Preview */}
            <div className="lg:col-span-6 relative flex justify-center lg:justify-end">
              {featuredCourse ? (
                <div className="relative w-full max-w-lg rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-2xl dark:border-white/10 dark:bg-slate-900 transform lg:rotate-1 hover:rotate-0 transition-transform duration-500">
                  <div className="aspect-video relative overflow-hidden group border-b border-slate-100 dark:border-white/5">
                    <img
                      src={featuredCourse.thumbnail}
                      alt={l(featuredCourse.title, 'Featured Course')}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="inline-block px-3 py-1.5 rounded-lg bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-slate-900 dark:text-white text-[10px] font-bold uppercase tracking-wider shadow-sm border border-slate-200 dark:border-white/10">
                        {featuredCourse.category || 'Featured'}
                      </span>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                  </div>
                  <div className="p-6 sm:p-8 bg-white dark:bg-slate-900">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 line-clamp-1">
                      {l(featuredCourse.title)}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-6 line-clamp-1">
                      {l(featuredCourse.shortDescription)}
                    </p>
                    <div className="flex items-center justify-between border-t border-slate-100 dark:border-white/5 pt-6">
                      <div className="flex items-center gap-2 text-sm font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1.5 rounded-lg">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{t('hero.certBadge')}</span>
                      </div>
                      <Link
                        href={`/courses/${featuredCourse.slug}`}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-bold text-sky-700 bg-sky-50 hover:bg-sky-100 dark:text-sky-400 dark:bg-sky-500/10 dark:hover:bg-sky-500/20 transition-colors focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:outline-none"
                      >
                        {t('hero.viewCourse')}
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="w-full max-w-lg aspect-video rounded-2xl bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-white/10 flex flex-col items-center justify-center p-8 text-center shadow-sm">
                  <MonitorPlay className="w-12 h-12 text-slate-300 dark:text-slate-700 mb-4" />
                  <p className="text-slate-500 dark:text-slate-400 font-medium">{t('home.courses.empty')}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────── */}
      {/* 2. COURSE DISCOVERY                              */}
      {/* ──────────────────────────────────────────────── */}
      <section className="py-24 bg-slate-50 dark:bg-[#0a0f1c]">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12 border-b border-slate-200 dark:border-white/10 pb-8">
            <div className="max-w-2xl">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">
                {t('home.courses.title')}
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 font-medium">
                {t('home.courses.subtitle')}
              </p>
            </div>
            <Link
              href="/courses"
              className="inline-flex items-center gap-2 text-sky-700 dark:text-sky-400 font-bold hover:underline focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:outline-none rounded shrink-0 pb-1"
            >
              <span>{t('home.courses.viewAll')}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {courses.length === 0 ? (
            <div className="py-16 text-center max-w-xl mx-auto">
              <div className="w-14 h-14 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                <MonitorPlay className="w-7 h-7 text-slate-400 dark:text-slate-500" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">{t('home.courses.empty')}</h3>
              <p className="text-slate-600 dark:text-slate-400 text-lg mb-8">{t('home.courses.emptyDesc')}</p>
              <Link
                href="/courses"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white bg-slate-900 hover:bg-slate-800 dark:text-slate-950 dark:bg-sky-400 dark:hover:bg-sky-300 transition-colors focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:outline-none"
              >
                {t('home.courses.viewAll')}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.slice(0, 3).map((course) => (
                <Link
                  key={course.id}
                  href={`/courses/${course.slug}`}
                  className="group flex flex-col rounded-2xl border border-slate-200 bg-white hover:border-slate-300 hover:shadow-lg dark:border-white/10 dark:bg-slate-900 dark:hover:border-white/20 transition-all overflow-hidden focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:outline-none"
                >
                  <div className="aspect-[16/10] relative overflow-hidden bg-slate-100 dark:bg-slate-800 border-b border-slate-100 dark:border-white/5">
                    <img
                      src={course.thumbnail}
                      alt={l(course.title, 'Course')}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-6 sm:p-8 flex flex-col flex-1">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        {course.category}
                      </span>
                      <span className="text-sm font-bold text-slate-900 dark:text-white">
                        ₹{course.price?.toLocaleString()}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 line-clamp-2 leading-snug group-hover:text-sky-700 dark:group-hover:text-sky-400 transition-colors">
                      {l(course.title)}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 font-medium">
                      {l(course.shortDescription)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ──────────────────────────────────────────────── */}
      {/* 3. WHY LEARNING HUB — Editorial + Image          */}
      {/* ──────────────────────────────────────────────── */}
      <section className="py-24 bg-white dark:bg-[#070b14] border-t border-slate-100 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <div className="lg:sticky lg:top-32">
              <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white leading-[1.15] tracking-tight mb-12">
                {t('home.why.title')}
              </h2>
              <div className="space-y-10">
                <div className="flex gap-6 items-start">
                  <span className="text-2xl font-bold text-slate-300 dark:text-slate-700 font-mono shrink-0">01</span>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{t('home.why.structured')}</h3>
                    <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">{t('home.why.structuredDesc')}</p>
                  </div>
                </div>
                <div className="flex gap-6 items-start">
                  <span className="text-2xl font-bold text-slate-300 dark:text-slate-700 font-mono shrink-0">02</span>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{t('home.why.practical')}</h3>
                    <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">{t('home.why.practicalDesc')}</p>
                  </div>
                </div>
                <div className="flex gap-6 items-start">
                  <span className="text-2xl font-bold text-slate-300 dark:text-slate-700 font-mono shrink-0">03</span>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{t('home.why.live')}</h3>
                    <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">{t('home.why.liveDesc')}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Editorial image */}
            <div className="relative rounded-[2rem] overflow-hidden shadow-2xl">
              <img
                src="/images/why-learning.jpg"
                alt="Students collaborating in a modern learning workspace with data visualizations on screen"
                className="w-full h-auto object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────── */}
      {/* 4. HOW LEARNING WORKS                            */}
      {/* ──────────────────────────────────────────────── */}
      <section className="py-24 sm:py-32 bg-slate-900 text-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-20 tracking-tight">
            {t('home.process.title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8">
            
            <div className="flex flex-col items-center max-w-sm mx-auto">
              <div className="text-6xl font-extrabold text-slate-800 mb-8 font-mono">01</div>
              <h3 className="text-2xl font-bold mb-4">{t('home.process.step1')}</h3>
              <p className="text-slate-400 text-lg font-medium leading-relaxed">{t('home.process.step1Desc')}</p>
            </div>
            
            <div className="flex flex-col items-center max-w-sm mx-auto relative">
              <div className="hidden md:block absolute top-10 -left-1/2 w-full h-px bg-slate-800 z-0"></div>
              <div className="text-6xl font-extrabold text-slate-800 mb-8 font-mono relative z-10">02</div>
              <h3 className="text-2xl font-bold mb-4">{t('home.process.step2')}</h3>
              <p className="text-slate-400 text-lg font-medium leading-relaxed">{t('home.process.step2Desc')}</p>
            </div>

            <div className="flex flex-col items-center max-w-sm mx-auto relative">
              <div className="hidden md:block absolute top-10 -left-1/2 w-full h-px bg-slate-800 z-0"></div>
              <div className="text-6xl font-extrabold text-slate-800 mb-8 font-mono relative z-10">03</div>
              <h3 className="text-2xl font-bold mb-4">{t('home.process.step3')}</h3>
              <p className="text-slate-400 text-lg font-medium leading-relaxed">{t('home.process.step3Desc')}</p>
            </div>

          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────── */}
      {/* 5. LIVE LEARNING                                 */}
      {/* ──────────────────────────────────────────────── */}
      <section className="py-24 bg-slate-50 dark:bg-[#0a0f1c] border-b border-slate-200 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight">
              {t('home.live.title')}
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
              {t('home.live.subtitle')}
            </p>
          </div>

          {liveClasses.length === 0 ? (
            <div className="py-12 px-8 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 shadow-sm max-w-2xl">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{t('home.live.empty')}</h3>
              <p className="text-slate-600 dark:text-slate-400 font-medium">{t('home.live.emptyDesc')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {liveClasses.slice(0, 3).map((cls) => (
                <div key={cls.id} className="p-8 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 shadow-sm">
                  <div className="flex items-center gap-2 mb-6">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                    <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">Scheduled</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 line-clamp-2 leading-snug">
                    {l(cls.title)}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 font-medium">{cls.durationMinutes} min</p>
                  <Link
                    href="/live-list"
                    className="inline-flex items-center justify-center w-full py-3 rounded-lg font-bold text-sm bg-slate-100 hover:bg-slate-200 text-slate-900 dark:bg-white/5 dark:hover:bg-white/10 dark:text-white transition-colors focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:outline-none"
                  >
                    {t('hero.viewCourse', 'View Details')}
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ──────────────────────────────────────────────── */}
      {/* 6. CERTIFICATES — Elevated perspective            */}
      {/* ──────────────────────────────────────────────── */}
      <section className="py-24 sm:py-32 bg-white dark:bg-[#070b14]">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-5 space-y-8">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.15]">
                {t('home.cert.title')}
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                {t('home.cert.subtitle')}
              </p>
            </div>

            <div className="lg:col-span-7 flex justify-center lg:justify-end" style={{ perspective: '1200px' }}>
              <div 
                className="relative w-full max-w-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 p-8 sm:p-12 rounded-xl shadow-2xl"
                style={{ transform: 'rotateY(-4deg) rotateX(2deg)' }}
              >
                <div className="flex justify-between items-start mb-12">
                  <Award className="w-10 h-10 text-emerald-600 dark:text-emerald-500" />
                  <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Verifiable</span>
                </div>
                
                <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2 font-serif uppercase tracking-wider">
                  Certificate of Completion
                </h3>
                <div className="w-16 h-1 bg-emerald-500 my-8"></div>
                
                <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">{t('home.cert.awardedFor')}</p>
                <p className="text-lg font-bold text-slate-900 dark:text-white mb-10">{t('home.cert.courseName')}</p>
                
                <div className="flex justify-between items-end border-t border-slate-200 dark:border-white/10 pt-6">
                  <div className="text-left">
                    <p className="text-slate-900 dark:text-white font-bold font-serif">Learning Hub by KD</p>
                  </div>
                  <div className="text-right">
                    <p className="text-slate-900 dark:text-white font-bold text-sm">2026</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────── */}
      {/* 7. FINAL CTA                                     */}
      {/* ──────────────────────────────────────────────── */}
      <section className="py-24 sm:py-32 bg-slate-50 dark:bg-[#0a0f1c] border-t border-slate-200 dark:border-white/5 text-center">
        <div className="max-w-3xl mx-auto px-5 sm:px-6 lg:px-8">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight">
            {t('home.cta.title')}
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 font-medium mb-10 leading-relaxed">
            {t('home.cta.subtitle')}
          </p>
          <Link
            href="/courses"
            className="inline-flex items-center justify-center gap-2 px-10 py-5 rounded-2xl font-bold text-white bg-slate-900 hover:bg-slate-800 dark:text-slate-950 dark:bg-sky-400 dark:hover:bg-sky-300 transition-colors shadow-lg focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:outline-none"
          >
            <span className="text-lg">{t('home.cta.button')}</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

    </div>
  );
}
