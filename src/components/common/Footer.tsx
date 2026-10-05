import React from 'react';
import { Sparkles, Shield } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/i18n/LanguageContext';

interface FooterProps {
  onNavigate: (route: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { t } = useLanguage();

  // We keep onNavigate support for backward compatibility with layout.tsx,
  // but transition to Link where standard routing applies.
  
  return (
    <footer className="w-full border-t border-slate-200 transition-colors duration-300 bg-white text-slate-600 dark:bg-[#070b14] dark:border-white/10 dark:text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-16">
          
          {/* Brand & Mission */}
          <div className="md:col-span-5 lg:col-span-4 space-y-4">
            <Link href="/" className="flex items-center gap-3 w-max focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:outline-none rounded-lg p-1 -ml-1">
              <div className="w-10 h-10 rounded-xl bg-sky-100 dark:bg-sky-500/10 flex items-center justify-center border border-sky-200 dark:border-sky-500/20">
                <Sparkles className="w-5 h-5 text-sky-600 dark:text-sky-400" />
              </div>
              <div className="flex flex-col">
                <span className="font-display text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Learning Hub
                </span>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider -mt-1">by KD</span>
              </div>
            </Link>
            <p className="text-sm leading-relaxed max-w-sm text-slate-600 dark:text-slate-400">
              {t('home.footer.desc')}
            </p>
          </div>

          {/* Navigation Columns */}
          <div className="md:col-span-7 lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-8">
            
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200">
                {t('footer.learning', 'Learning')}
              </h4>
              <ul className="space-y-3 text-sm font-medium">
                <li>
                  <button onClick={() => onNavigate('courses')} className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:outline-none rounded">
                    {t('nav.courses', 'Courses')}
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('paths')} className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:outline-none rounded">
                    {t('nav.learningPaths', 'Learning Paths')}
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('live-list')} className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:outline-none rounded">
                    {t('nav.liveClasses', 'Live Classes')}
                  </button>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200">
                {t('footer.company', 'Company')}
              </h4>
              <ul className="space-y-3 text-sm font-medium">
                <li>
                  <button onClick={() => onNavigate('about')} className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:outline-none rounded">
                    {t('footer.about', 'About Us')}
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('contact')} className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:outline-none rounded">
                    {t('footer.contact', 'Contact')}
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('faq')} className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:outline-none rounded">
                    {t('footer.faq', 'FAQ')}
                  </button>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200">
                {t('footer.legal', 'Legal')}
              </h4>
              <ul className="space-y-3 text-sm font-medium">
                <li>
                  <button onClick={() => onNavigate('privacy')} className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:outline-none rounded">
                    {t('footer.privacy', 'Privacy Policy')}
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('terms')} className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:outline-none rounded">
                    {t('footer.terms', 'Terms of Service')}
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('refunds')} className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:outline-none rounded">
                    {t('footer.refunds', 'Refund Policy')}
                  </button>
                </li>
              </ul>
            </div>
            
          </div>
        </div>

        {/* Lower Divider & Copyright */}
        <div className="mt-16 pt-8 border-t border-slate-200 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium">
          <div className="flex items-center gap-2">
            <span>© 2026 Learning Hub by KD. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
            <Shield className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
            <span>Verifiable Credentials Platform</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
