import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/i18n/LanguageContext';
import { useTheme } from '@/theme/ThemeContext';
import { useAuth } from '@/services/authService';
import { useSession, signOut } from 'next-auth/react';
import { Language } from '@/types';
import {
  Search,
  Moon,
  Sun,
  Globe,
  Radio,
  Sparkles,
  User,
  ShieldCheck,
  BookOpen,
  Compass,
  Menu,
  X,
  Layers,
  Settings,
} from 'lucide-react';
import { NotificationDropdown } from '@/components/dashboard/NotificationDropdown';

interface NavbarProps {
  onOpenSearch: () => void;
  onNavigate: (route: string) => void;
  currentRoute: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSearch, onNavigate, currentRoute }) => {
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme, isDark } = useTheme();
  const { user, isAdmin, loginAsStudent, loginAsAdmin } = useAuth();
  const { data: session } = useSession();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { label: t('nav.courses'), route: 'courses', href: '/courses', icon: BookOpen },
    { label: t('nav.learningPaths'), route: 'paths', href: '/paths', icon: Compass },
    {
      label: t('nav.liveClasses'),
      route: 'live-list',
      href: '/live-list',
      icon: Radio,
    },
  ];

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b backdrop-blur-xl transition-colors duration-300 bg-white/90 border-slate-200 dark:bg-[#0a0f1c]/90 dark:border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-[4.5rem]">
          {/* Brand Logo */}
          <Link 
            href="/"
            className="flex items-center gap-3 rounded-lg focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:outline-none"
            aria-label="Home"
          >
            <div className="w-10 h-10 rounded-xl bg-sky-100 dark:bg-sky-500/10 flex items-center justify-center border border-sky-200 dark:border-sky-500/20">
              <Sparkles className="w-5 h-5 text-sky-700 dark:text-sky-400" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                Learning Hub
              </span>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider -mt-1 hidden sm:inline">by KD</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentRoute === item.route;
              return (
                <Link
                  key={item.route}
                  id={`nav-link-${item.route}`}
                  href={item.href}
                  className={`relative flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:outline-none ${
                    isActive
                      ? 'text-sky-700 bg-sky-50 dark:text-sky-400 dark:bg-sky-500/10'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-sky-700 dark:text-sky-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Search, Actions, Settings */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Global Search Button */}
            <button
              id="global-search-trigger"
              onClick={onOpenSearch}
              aria-label="Search courses"
              className="flex items-center gap-2 px-3 py-2 rounded-lg border text-xs text-slate-500 transition-colors bg-slate-50 border-slate-200 hover:border-slate-400 hover:text-slate-900 dark:bg-slate-900/60 dark:border-white/10 dark:text-slate-400 dark:hover:border-white/20 dark:hover:text-white focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:outline-none"
              title="Search courses (Cmd+K)"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">{t('nav.searchPlaceholder', 'Search')}</span>
              <kbd className="hidden lg:inline text-[10px] bg-slate-100 text-slate-400 px-1.5 py-0.5 rounded border border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700">
                ⌘K
              </kbd>
            </button>

            {user && <NotificationDropdown />}

            {/* User Settings Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                aria-label="User Settings"
                aria-expanded={isSettingsOpen}
                className="p-2 rounded-lg border text-slate-600 transition-colors bg-slate-50 border-slate-200 hover:border-slate-400 dark:bg-slate-900/60 dark:border-white/10 dark:text-slate-300 dark:hover:border-white/20 focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:outline-none"
              >
                <Settings className="w-4 h-4" />
              </button>

              {isSettingsOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl shadow-2xl py-2 z-50 border backdrop-blur-xl bg-white border-slate-200 dark:bg-slate-900/95 dark:border-white/15">
                  <div className="px-4 py-2 border-b border-slate-100 dark:border-white/10 mb-2">
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{user?.name || 'Guest'}</p>
                    <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
                  </div>

                  <div className="px-2 space-y-1">
                    <button
                      onClick={toggleTheme}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-white/5 focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:outline-none"
                    >
                      <div className="flex items-center gap-2">
                        {isDark ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-sky-600" />}
                        <span>Toggle Theme</span>
                      </div>
                    </button>

                    <div className="pt-1 pb-1">
                      <p className="px-3 text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Language</p>
                      {['en', 'hinglish', 'hi'].map(lang => (
                        <button
                          key={lang}
                          onClick={() => handleLanguageChange(lang as Language)}
                          className={`w-full text-left px-3 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:outline-none ${
                            language === lang
                              ? 'bg-sky-50 text-sky-700 font-semibold dark:bg-sky-500/15 dark:text-sky-400'
                              : 'text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-white/5'
                          }`}
                        >
                          <span>{lang === 'hi' ? 'हिन्दी' : lang.toUpperCase()}</span>
                          {language === lang && <span className="text-[10px]">✓</span>}
                        </button>
                      ))}
                    </div>

                    {/* Dev-only role switcher — not rendered in production builds */}
                    {process.env.NODE_ENV === 'development' && (
                      <div className="pt-2 mt-2 border-t border-slate-100 dark:border-white/10">
                        <button
                          onClick={() => {
                            if (isAdmin) loginAsStudent();
                            else loginAsAdmin();
                            setIsSettingsOpen(false);
                          }}
                          className="w-full text-left px-3 py-2 rounded-lg text-xs flex items-center gap-2 text-amber-600 hover:bg-amber-50 dark:text-amber-400 dark:hover:bg-amber-500/10 focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:outline-none"
                        >
                          <User className="w-3.5 h-3.5" />
                          <span>[DEV] Switch to {isAdmin ? 'Student' : 'Admin'} View</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Dashboard / Auth CTAs */}
            {session ? (
              <>
                <Link
                  id="nav-primary-cta"
                  href="/dashboard"
                  className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 dark:text-slate-950 dark:bg-sky-400 dark:hover:bg-sky-300 transition-colors focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:outline-none"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>{t('nav.dashboard', 'Dashboard')}</span>
                </Link>
                <button
                  id="nav-signout-btn"
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-white/5 transition-colors focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:outline-none"
                >
                  <span>{t('nav.logout', 'Sign Out')}</span>
                </button>
              </>
            ) : (
              <Link
                id="nav-signin-btn"
                href="/login"
                className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 dark:text-slate-950 dark:bg-sky-400 dark:hover:bg-sky-300 transition-colors focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:outline-none"
              >
                <User className="w-3.5 h-3.5" />
                <span>{t('nav.login', 'Sign In')}</span>
              </Link>
            )}

            {/* Mobile Menu Trigger */}
            <button
              id="mobile-menu-toggle"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle Mobile Menu"
              aria-expanded={isMobileMenuOpen}
              className="md:hidden p-2 rounded-lg border border-slate-200 text-slate-600 hover:text-slate-900 dark:border-white/10 dark:text-slate-300 dark:hover:text-white focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:outline-none"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-200 dark:border-white/10 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.route}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:outline-none"
                >
                  <Icon className="w-4 h-4 text-slate-400" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            
            <Link
              href="/dashboard"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:outline-none"
            >
              <Layers className="w-4 h-4 text-slate-400" />
              <span>{t('nav.dashboard', 'Dashboard')}</span>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};
