import React from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { ThreeHeroScene } from './ThreeHeroScene';
import {
  Sparkles,
  ArrowRight,
  Radio,
  Star,
  Users,
  Award,
  Database,
  FileSpreadsheet,
  BarChart3,
  CheckCircle,
  Play,
} from 'lucide-react';

interface HeroSectionProps {
  onExploreCourses: () => void;
  onJoinLiveClass: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onExploreCourses, onJoinLiveClass }) => {
  const { t } = useLanguage();

  return (
    <section className="relative min-h-[680px] lg:min-h-[760px] flex items-center overflow-hidden pt-6 pb-16">
      {/* 3D Interactive Three.js Scene */}
      <ThreeHeroScene />

      {/* Atmospheric Cinematic Gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-sky-500/15 via-indigo-500/10 to-emerald-500/15 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Typography, Value Proposition & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Top Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-sky-500/30 bg-sky-500/10 backdrop-blur-md text-sky-400 text-xs font-semibold uppercase tracking-wider shadow-sm">
              <Sparkles className="w-3.5 h-3.5 animate-spin" />
              <span>{t('hero.badge')}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
              <span className="text-[11px] font-mono lowercase text-sky-300">v2.4 live</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white dark:text-white light:text-slate-900 leading-[1.12]">
              <span>{t('hero.titleLine1')} </span>
              <span className="bg-gradient-to-r from-sky-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent underline decoration-sky-500/40 decoration-wavy decoration-2">
                {t('hero.titleHighlight')}
              </span>{' '}
              <span>{t('hero.titleLine2')}</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-300 dark:text-slate-300 light:text-slate-700 max-w-2xl leading-relaxed font-normal">
              {t('hero.description')}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                id="hero-cta-explore"
                onClick={onExploreCourses}
                className="group flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-semibold text-sm text-slate-950 bg-gradient-to-r from-sky-400 via-teal-300 to-emerald-400 hover:shadow-lg hover:shadow-sky-500/25 transition-all transform active:scale-95"
              >
                <span>{t('hero.ctaPrimary')}</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                id="hero-cta-live"
                onClick={onJoinLiveClass}
                className="group flex items-center gap-2.5 px-5 py-3.5 rounded-xl font-semibold text-sm text-white dark:text-white light:text-slate-900 border border-white/20 hover:border-sky-400/60 bg-white/5 hover:bg-white/10 dark:bg-white/5 dark:hover:bg-white/10 light:bg-slate-100 light:border-slate-300 light:hover:bg-slate-200 transition-all active:scale-95"
              >
                <div className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
                </div>
                <span>{t('hero.ctaSecondary')}</span>
                <Radio className="w-4 h-4 text-rose-400" />
              </button>
            </div>

            {/* Micro Credibility Indicators */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-white/10 dark:border-white/10 light:border-slate-200">
              <div className="flex items-center gap-2 text-xs text-slate-300 dark:text-slate-300 light:text-slate-700">
                <Users className="w-4 h-4 text-sky-400" />
                <span className="font-semibold">{t('hero.statsLearners')}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-300 dark:text-slate-300 light:text-slate-700">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span className="font-semibold">{t('hero.statsRating')}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-300 dark:text-slate-300 light:text-slate-700">
                <Award className="w-4 h-4 text-emerald-400" />
                <span className="font-semibold">{t('hero.statsPlacement')}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Floating Interactive 3D Glass Cards */}
          <div className="lg:col-span-5 relative flex flex-col gap-4">
            {/* Card 1: Excel Macro & Formula Glass HUD */}
            <div className="glass-panel p-4 rounded-2xl shadow-xl transition-transform hover:-translate-y-1 duration-300 border border-emerald-500/20 bg-slate-900/80">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-emerald-500/15 text-emerald-400">
                    <FileSpreadsheet className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-100 dark:text-slate-100 light:text-slate-900">
                      {t('hero.cardExcel')}
                    </h4>
                    <p className="text-[10px] font-mono text-emerald-400">
                      =LAMBDA(arr, FILTER(arr, arr&gt;0))
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  AUTORUN
                </span>
              </div>
              {/* Mini Sheet Grid Preview */}
              <div className="grid grid-cols-3 gap-1.5 text-[11px] font-mono bg-slate-950/60 p-2.5 rounded-lg border border-white/5">
                <div className="text-slate-400">Gross Margin</div>
                <div className="text-right text-emerald-400 font-semibold">68.4%</div>
                <div className="text-right text-sky-400">▲ +12%</div>
                <div className="text-slate-400">EBITDA Mult</div>
                <div className="text-right text-slate-200">14.2x</div>
                <div className="text-right text-emerald-400">Optimal</div>
              </div>
            </div>

            {/* Card 2: Production SQL Querying Latency HUD */}
            <div className="glass-panel p-4 rounded-2xl shadow-xl transition-transform hover:-translate-y-1 duration-300 border border-sky-500/20 bg-slate-900/80 ml-0 lg:ml-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-sky-500/15 text-sky-400">
                    <Database className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-100 dark:text-slate-100 light:text-slate-900">
                      {t('hero.cardSql')}
                    </h4>
                    <p className="text-[10px] text-slate-400 font-mono">
                      EXPLAIN ANALYZE (Recursive CTE)
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30">
                  8.4ms
                </span>
              </div>
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-sky-400 to-emerald-400 w-4/5 rounded-full animate-pulse" />
              </div>
            </div>

            {/* Card 3: Live Classroom WebRTC Active Indicator */}
            <div className="glass-panel p-4 rounded-2xl shadow-xl transition-transform hover:-translate-y-1 duration-300 border border-rose-500/20 bg-slate-900/80">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative p-2 rounded-lg bg-rose-500/15 text-rose-400">
                    <Radio className="w-4 h-4 animate-pulse" />
                    <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-rose-400">
                      LIVE CLASSROOM
                    </span>
                    <h4 className="text-xs font-semibold text-slate-100 dark:text-slate-100 light:text-slate-900">
                      Executive Dashboards Masterclass
                    </h4>
                  </div>
                </div>
                <button
                  onClick={onJoinLiveClass}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-500 hover:bg-rose-400 text-white transition-colors"
                >
                  Join (47)
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
