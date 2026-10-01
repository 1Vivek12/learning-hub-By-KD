import React, { useState } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { useTheme } from '@/theme/ThemeContext';
import { Sparkles, Shield, Send, CheckCircle2, Heart } from 'lucide-react';

interface FooterProps {
  onNavigate: (route: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { t } = useLanguage();
  const { isDark } = useTheme();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <footer className="w-full border-t border-white/10 transition-colors duration-300 bg-[#070b14] text-slate-400 dark:bg-[#070b14] dark:border-white/10 light:bg-slate-50 light:border-slate-200 light:text-slate-600">
      {/* Upper Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Col 1: Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('home')}>
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 via-sky-500 to-emerald-400 p-[2px]">
                <div className="w-full h-full rounded-[10px] bg-slate-950 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-sky-400" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-display text-xl font-bold tracking-tight text-white dark:text-white light:text-slate-900">
                  Learning Hub
                </span>
                <span className="text-[10px] text-slate-400 font-medium -mt-1">by KD</span>
              </div>
            </div>
            <p className="text-sm leading-relaxed max-w-sm text-slate-400 dark:text-slate-400 light:text-slate-600">
              The premier cinematic 3D edtech platform engineered for modern technical practitioners. Master high-income analytical, engineering, and artificial intelligence skills with live masterclasses and production curricula.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                WebRTC SFU Classrooms Operational
              </span>
            </div>
          </div>

          {/* Col 2: High-Demand Courses */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 dark:text-slate-200 light:text-slate-900">
              Flagship Curricula
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => onNavigate('course/microsoft-excel-mastery-vba-automation')}
                  className="hover:text-sky-400 transition-colors text-left"
                >
                  Microsoft Excel & VBA
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('course/production-sql-for-data-analytics-warehousing')}
                  className="hover:text-sky-400 transition-colors text-left"
                >
                  Production SQL Mastery
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('course/enterprise-power-bi-dax-data-modeling')}
                  className="hover:text-sky-400 transition-colors text-left"
                >
                  Enterprise Power BI & DAX
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('course/python-for-data-science-machine-learning-ai')}
                  className="hover:text-sky-400 transition-colors text-left"
                >
                  Python & AI Workflows
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Career Tracks & Live */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 dark:text-slate-200 light:text-slate-900">
              Navigation
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button onClick={() => onNavigate('paths')} className="hover:text-sky-400 transition-colors">
                  Career Roadmaps
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-sky-400 transition-colors">
                  About Us
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('faq')} className="hover:text-sky-400 transition-colors">
                  FAQ
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-sky-400 transition-colors">
                  Contact
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('live-list')} className="hover:text-sky-400 transition-colors">
                  Live Virtual Rooms
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('dashboard')} className="hover:text-sky-400 transition-colors">
                  Student Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('admin')} className="hover:text-sky-400 transition-colors">
                  Admin CMS Portal
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Newsletter & Updates */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 dark:text-slate-200 light:text-slate-900">
              Stay Ahead
            </h4>
            <p className="text-xs text-slate-400">
              Weekly curated SQL queries, Excel macro blueprints, and live masterclass schedules.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="analyst@enterprise.com"
                  required
                  className="w-full px-3 py-2 pr-10 rounded-lg text-xs border border-white/10 bg-slate-900/80 text-white placeholder-slate-500 focus:outline-none focus:border-sky-400 dark:bg-slate-900/80 dark:border-white/10 light:bg-white light:border-slate-300 light:text-slate-900"
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1 p-1.5 rounded-md bg-sky-500 text-white hover:bg-sky-400 transition-colors"
                  title="Subscribe"
                >
                  <Send className="w-3 h-3" />
                </button>
              </div>
              {subscribed && (
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 animate-fadeIn">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Subscribed! Check your inbox soon.</span>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Lower Divider & Copyright */}
        <div className="mt-14 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span>© 2026 Learning Hub Education Inc. All rights reserved.</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Shield className="w-3 h-3 text-sky-400" />
              Verifiable Credentials
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => onNavigate('privacy')} className="hover:text-slate-400 cursor-pointer">Privacy Policy</button>
            <span>•</span>
            <button onClick={() => onNavigate('terms')} className="hover:text-slate-400 cursor-pointer">Terms of Service</button>
            <span>•</span>
            <button onClick={() => onNavigate('refunds')} className="hover:text-slate-400 cursor-pointer">Refund Policy</button>
          </div>
        </div>
      </div>
    </footer>
  );
};
