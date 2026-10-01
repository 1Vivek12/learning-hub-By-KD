import React from 'react';
import { LiveClass } from '@/types';
import { useLanguage } from '@/i18n/LanguageContext';
import { Radio, Clock, Users, ArrowRight, Video, Sparkles } from 'lucide-react';

interface LiveMasterclassesSectionProps {
  liveClasses: LiveClass[];
  onJoinLiveClass: (liveClass: LiveClass) => void;
}

export const LiveMasterclassesSection: React.FC<LiveMasterclassesSectionProps> = ({
  liveClasses,
  onJoinLiveClass,
}) => {
  const { t, l } = useLanguage();

  return (
    <section id="live-section" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 text-xs font-semibold uppercase tracking-wider border border-rose-500/20">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>{t('live.badge')}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white dark:text-white light:text-slate-900 tracking-tight">
            {t('live.title')}
          </h2>
          <p className="text-sm text-slate-400 dark:text-slate-400 light:text-slate-600 max-w-xl">
            {t('live.subtitle')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {liveClasses.map((cls) => (
          <div
            key={cls.id}
            className="group relative rounded-2xl border p-6 flex flex-col justify-between transition-all duration-300 bg-slate-900/60 border-white/10 hover:border-rose-500/40 hover:shadow-2xl hover:shadow-rose-500/10 dark:bg-slate-900/60 dark:border-white/10 light:bg-white light:border-slate-200"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span
                  className={`text-[10px] font-bold font-mono uppercase px-2.5 py-1 rounded-md ${
                    cls.status === 'live'
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30 animate-pulse'
                      : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {cls.status === 'live' ? '🔴 LIVE NOW' : 'Upcoming Session'}
                </span>

                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-sky-400" />
                    {cls.durationMinutes}m
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-purple-400" />
                    {cls.currentParticipantsCount} Joined
                  </span>
                </div>
              </div>

              <h3 className="text-lg font-bold text-white dark:text-white light:text-slate-900 group-hover:text-rose-400 transition-colors">
                {l(cls.title)}
              </h3>

              <p className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-600 leading-relaxed line-clamp-2">
                {l(cls.description)}
              </p>
            </div>

            <div className="pt-6 mt-4 border-t border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-xs text-slate-300 font-medium">
                  Status: {cls.status === 'live' ? 'In Progress' : 'Scheduled Cohort'}
                </span>
              </div>

              <button
                onClick={() => onJoinLiveClass(cls)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-rose-500 hover:bg-rose-400 text-white transition-all shadow-md shadow-rose-500/20 active:scale-95"
              >
                <Video className="w-3.5 h-3.5" />
                <span>{t('live.joinNow')}</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
