import React from 'react';
import Link from 'next/link';
import { Course } from '@/types';
import { useLanguage } from '@/i18n/LanguageContext';
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Video
} from 'lucide-react';

interface HeroSectionProps {
  onExploreCourses: () => void;
  onJoinLiveClass: () => void;
  featuredCourse?: Course;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ 
  onExploreCourses, 
  onJoinLiveClass,
  featuredCourse 
}) => {
  const { t, l } = useLanguage();

  return (
    <section className="relative min-h-[600px] lg:min-h-[680px] flex items-center overflow-hidden pt-12 pb-20 bg-white dark:bg-[#070b14]">
      {/* Clean Background with Subtle EdTech Accent */}
      <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900/50 dark:to-[#070b14] pointer-events-none -z-10" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Typography, Value Proposition & CTAs */}
          <div className="lg:col-span-6 space-y-8 text-left">
            
            {/* Branding Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-slate-900/50 text-slate-600 dark:text-slate-300 text-xs font-semibold uppercase tracking-wider">
              <BookOpen className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              <span>Learning Hub by KD</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
              Master Enterprise <br className="hidden sm:block" />
              <span className="text-sky-600 dark:text-sky-400">
                Analytics & Data
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-lg leading-relaxed font-medium">
              Join production-grade masterclasses. Learn SQL, Excel, and Power BI through hands-on, real-world curriculum designed for modern professionals.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
              <Link
                href="/courses"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm text-white bg-slate-900 hover:bg-slate-800 dark:text-slate-950 dark:bg-sky-400 dark:hover:bg-sky-300 transition-colors focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:outline-none"
              >
                <span>Explore Catalog</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/live-list"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm text-slate-700 bg-slate-100 hover:bg-slate-200 dark:text-white border border-transparent dark:border-white/20 dark:bg-transparent dark:hover:bg-white/5 transition-colors focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:outline-none"
              >
                <Video className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                <span>Join Live Sessions</span>
              </Link>
            </div>

            {/* Key Value Props */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 pt-6 border-t border-slate-200 dark:border-white/10">
              <div className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Industry-aligned curriculum</span>
              </div>
              <div className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Verified Certificates</span>
              </div>
            </div>
          </div>

          {/* Right Column: Authentic Course Preview */}
          <div className="lg:col-span-6 relative flex justify-center lg:justify-end">
            {featuredCourse ? (
              <div className="relative w-full max-w-md group rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-xl dark:border-white/10 dark:bg-slate-900">
                <div className="aspect-video relative overflow-hidden">
                  <img
                    src={featuredCourse.thumbnail}
                    alt={featuredCourse.title.en}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors" />
                  <div className="absolute top-4 left-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-md bg-white/90 text-slate-900 dark:bg-slate-950/80 dark:text-sky-400 backdrop-blur-md shadow-sm">
                      {featuredCourse.category}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                    {l(featuredCourse.title)}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-6">
                    {l(featuredCourse.shortDescription)}
                  </p>
                  
                  <div className="flex items-center justify-between border-t border-slate-100 dark:border-white/10 pt-4">
                    <div className="flex flex-col">
                      <span className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">Course Access</span>
                      <span className="text-sm font-bold text-slate-900 dark:text-white">
                        ₹{featuredCourse.price.toLocaleString()}
                      </span>
                    </div>
                    <Link
                      href={`/courses/${featuredCourse.slug}`}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 dark:text-slate-950 dark:bg-sky-400 dark:hover:bg-sky-300 transition-colors focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:outline-none"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              /* Fallback static visual composition if no course data */
              <div className="relative w-full max-w-md aspect-square rounded-full bg-slate-50 dark:bg-slate-900/20 border border-slate-100 dark:border-white/5 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-10 rounded-full border border-slate-200 dark:border-white/10 flex items-center justify-center">
                  <div className="absolute inset-10 rounded-full border border-slate-200 dark:border-white/10 flex items-center justify-center">
                    <BookOpen className="w-16 h-16 text-slate-300 dark:text-slate-700" />
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
};
