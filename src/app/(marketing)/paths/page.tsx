"use client";
import React from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { Compass } from 'lucide-react';
import Link from 'next/link';

export default function PathsPage() {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-[#0a0f1c] pt-32 pb-24 font-sans">
      <div className="max-w-3xl mx-auto px-5 w-full text-center">
        <div className="w-16 h-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
          <Compass className="w-8 h-8 text-slate-400 dark:text-slate-500" />
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">
          {t('nav.learningPaths', 'Learning Paths')}
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 font-medium mb-12">
          {t('courses.emptyDesc', 'New practical courses and paths will be available on Learning Hub soon.')}
        </p>
        <Link
          href="/courses"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-white bg-slate-900 hover:bg-slate-800 dark:text-slate-950 dark:bg-sky-400 dark:hover:bg-sky-300 transition-colors focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:outline-none"
        >
          {t('courses.badge', 'Courses')}
          <span className="ml-1">→</span>
        </Link>
      </div>
    </div>
  );
}
