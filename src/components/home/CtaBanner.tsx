import React from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';

export const CtaBanner: React.FC<{ onExplore: () => void }> = ({ onExplore }) => {
  const { t } = useLanguage();

  return (
    <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="relative rounded-3xl overflow-hidden p-8 sm:p-14 text-center bg-gradient-to-tr from-sky-950 via-slate-900 to-emerald-950 border border-sky-500/30 shadow-2xl space-y-6">
        {/* Glow */}
        <div className="absolute inset-0 bg-sky-500/10 blur-3xl rounded-full pointer-events-none" />

        <div className="relative space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 text-xs font-semibold border border-emerald-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Accelerate Your Analytics Career</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Ready to Build Production-Grade Data Models?
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Join over 50,000+ data analysts and consultants mastering modern Excel, SQL, and Power BI. Start today with early-bird cohort pricing.
          </p>
        </div>

        <div className="relative flex flex-wrap items-center justify-center gap-4 pt-2">
          <button
            onClick={onExplore}
            className="flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider text-slate-950 bg-gradient-to-r from-sky-400 via-teal-300 to-emerald-400 hover:opacity-95 shadow-xl shadow-sky-500/25 transition-all transform active:scale-95"
          >
            <span>Explore All Curricula</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="relative pt-4 flex items-center justify-center gap-6 text-[11px] text-slate-400">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            30-Day Money-Back Guarantee
          </span>
          <span>•</span>
          <span>Lifetime Access & Updates</span>
          <span>•</span>
          <span>Verified Certification</span>
        </div>
      </div>
    </section>
  );
};
