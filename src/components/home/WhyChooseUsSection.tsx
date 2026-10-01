import React from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { Database, Video, Award, Languages, Cpu, CheckCircle } from 'lucide-react';

export const WhyChooseUsSection: React.FC = () => {
  const { t } = useLanguage();

  const features = [
    {
      icon: Database,
      color: 'text-sky-400 bg-sky-500/10 border-sky-500/20',
      title: 'Production Datasets Only',
      desc: 'No sanitized toy datasets. Work with 500,000+ row financial transactions, churn logs, and enterprise schemas.',
    },
    {
      icon: Video,
      color: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
      title: 'Real WebRTC Live Classes',
      desc: 'Interactive two-way audio & video cohort sessions. Share your screen and get live instructor code reviews.',
    },
    {
      icon: Languages,
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      title: 'Trilingual Learning (EN, Hinglish, HI)',
      desc: 'Learn complex recursive queries, DAX patterns, and VBA macros in natural, easy-to-digest colloquial language.',
    },
    {
      icon: Award,
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
      title: 'Verifiable Industry Credentials',
      desc: 'Earn digitally signed certificates recognized by top MNCs, complete with verification hashes and printable PDFs.',
    },
  ];

  return (
    <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white dark:text-white light:text-slate-900 tracking-tight">
          Engineered for Career Acceleration
        </h2>
        <p className="text-sm text-slate-400 dark:text-slate-400 light:text-slate-600">
          The difference between passing a multiple-choice quiz and passing a grueling technical interview.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((f, i) => {
          const Icon = f.icon;
          return (
            <div
              key={i}
              className="rounded-2xl border p-6 space-y-4 bg-slate-900/60 border-white/10 hover:border-sky-500/40 transition-all dark:bg-slate-900/60 dark:border-white/10 light:bg-white light:border-slate-200"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${f.color}`}>
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white dark:text-white light:text-slate-900">
                {f.title}
              </h3>
              <p className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-600 leading-relaxed">
                {f.desc}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
};
