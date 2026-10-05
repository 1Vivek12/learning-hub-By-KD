"use client";
import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { Radio, MonitorPlay } from 'lucide-react';
import { LiveClass } from '@/types';
import Link from 'next/link';

export default function LiveListPage() {
  const { t, l } = useLanguage();
  const [classes, setClasses] = useState<LiveClass[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/live-classes')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setClasses(data);
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-[#0a0f1c] pt-32 pb-24 font-sans">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 w-full">
        
        <div className="max-w-3xl mb-16">
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight">
            {t('home.live.title', 'Live Classes')}
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 font-medium">
            {t('home.live.subtitle', 'Connect directly with instructors and learners in live sessions.')}
          </p>
        </div>

        {loading ? (
          <div className="animate-pulse space-y-8">
            <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-2xl w-full max-w-2xl"></div>
          </div>
        ) : classes.length === 0 ? (
          <div className="py-24 text-center max-w-xl mx-auto">
            <div className="w-16 h-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
              <MonitorPlay className="w-8 h-8 text-slate-400 dark:text-slate-500" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
              {t('home.live.empty', 'No upcoming live classes right now.')}
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-lg mb-8">
              {t('home.live.emptyDesc', 'New live sessions will appear here when scheduled.')}
            </p>
            <Link
              href="/courses"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-white bg-slate-900 hover:bg-slate-800 dark:text-slate-950 dark:bg-sky-400 dark:hover:bg-sky-300 transition-colors focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:outline-none"
            >
              {t('courses.badge', 'Courses')}
              <span className="ml-1">→</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {classes.map((cls) => (
              <div key={cls.id} className="p-8 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 shadow-sm flex flex-col">
                <div className="flex items-center gap-2 mb-6">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">Scheduled</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 leading-snug">
                  {l(cls.title)}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-8 flex-1">
                  {cls.durationMinutes} min
                </p>
                <button
                  disabled
                  className="inline-flex items-center justify-center w-full py-3 rounded-lg font-bold text-sm bg-slate-100 text-slate-400 dark:bg-white/5 dark:text-slate-500 cursor-not-allowed transition-colors"
                >
                  Join (Coming Soon)
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
