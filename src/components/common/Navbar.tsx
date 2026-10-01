import React, { useState } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { useTheme } from '@/theme/ThemeContext';
import { useAuth } from '@/services/authService';
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
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { label: t('nav.courses'), route: 'courses', icon: BookOpen },
    { label: t('nav.learningPaths'), route: 'paths', icon: Compass },
    {
      label: t('nav.liveClasses'),
      route: 'live-list',
      icon: Radio,
      badge: 'LIVE',
    },
    { label: t('nav.dashboard'), route: 'dashboard', icon: User },
    {
      label: t('nav.admin'),
      route: 'admin',
      icon: ShieldCheck,
      adminOnly: true,
    },
  ];

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    setIsLangOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b backdrop-blur-xl transition-colors duration-300 bg-[#0b0f19]/85 border-white/10 dark:bg-[#0b0f19]/85 dark:border-white/10 light:bg-white/90 light:border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('home')}>
            <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 via-sky-500 to-emerald-400 p-[2px] shadow-lg shadow-sky-500/20">
              <div className="w-full h-full rounded-[10px] bg-slate-950 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-sky-400 animate-pulse" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-display text-xl font-bold tracking-tight text-white dark:text-white light:text-slate-900 flex items-center gap-1.5">
                Learning Hub
                <span className="text-[10px] uppercase font-mono tracking-wider px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/30">
                  3D PRO
                </span>
              </span>
              <span className="text-[10px] text-slate-400 font-medium hidden sm:inline -mt-1">by KD</span>
              <span className="text-[11px] text-slate-400 -mt-0.5 hidden sm:inline">
                Cinematic EdTech & Live Classes
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentRoute === item.route;
              return (
                <button
                  key={item.route}
                  id={`nav-link-${item.route}`}
                  onClick={() => onNavigate(item.route)}
                  className={`relative flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'text-sky-400 bg-sky-500/10 border border-sky-500/20 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-white/5 dark:text-slate-300 dark:hover:text-white light:text-slate-700 light:hover:text-slate-950 light:hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-sky-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Search, Language, Theme, Role Switcher, Auth */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Global Search Button */}
            <button
              id="global-search-trigger"
              onClick={onOpenSearch}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border text-xs text-slate-400 transition-colors bg-slate-900/60 border-white/10 hover:border-sky-500/40 hover:text-slate-200 dark:bg-slate-900/60 dark:border-white/10 light:bg-slate-100 light:border-slate-300 light:text-slate-600"
              title="Search courses (Cmd+K)"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">{t('nav.searchPlaceholder')}</span>
              <kbd className="hidden lg:inline text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded border border-slate-700">
                ⌘K
              </kbd>
            </button>

            {/* Language Switcher Dropdown */}
            <div className="relative">
              <button
                id="language-switcher-button"
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center gap-1.5 px-2.5 py-2 rounded-lg border text-xs font-semibold uppercase tracking-wider transition-all bg-slate-900/60 border-white/10 text-slate-200 hover:border-sky-500/30 dark:bg-slate-900/60 dark:border-white/10 light:bg-slate-100 light:border-slate-300 light:text-slate-800"
              >
                <Globe className="w-3.5 h-3.5 text-sky-400" />
                <span>{language === 'hinglish' ? 'HING' : language.toUpperCase()}</span>
              </button>

              {isLangOpen && (
                <div className="absolute right-0 mt-2 w-36 rounded-xl shadow-2xl py-1 z-50 border backdrop-blur-xl bg-slate-900/95 border-white/15 dark:bg-slate-900/95 dark:border-white/15 light:bg-white light:border-slate-200">
                  <button
                    onClick={() => handleLanguageChange('en')}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between transition-colors ${
                      language === 'en'
                        ? 'bg-sky-500/15 text-sky-400 font-semibold'
                        : 'text-slate-300 hover:bg-white/5 dark:text-slate-300 light:text-slate-700 light:hover:bg-slate-50'
                    }`}
                  >
                    <span>English</span>
                    {language === 'en' && <span className="text-[10px]">✓</span>}
                  </button>
                  <button
                    onClick={() => handleLanguageChange('hinglish')}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between transition-colors ${
                      language === 'hinglish'
                        ? 'bg-sky-500/15 text-sky-400 font-semibold'
                        : 'text-slate-300 hover:bg-white/5 dark:text-slate-300 light:text-slate-700 light:hover:bg-slate-50'
                    }`}
                  >
                    <span>Hinglish</span>
                    {language === 'hinglish' && <span className="text-[10px]">✓</span>}
                  </button>
                  <button
                    onClick={() => handleLanguageChange('hi')}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between transition-colors ${
                      language === 'hi'
                        ? 'bg-sky-500/15 text-sky-400 font-semibold'
                        : 'text-slate-300 hover:bg-white/5 dark:text-slate-300 light:text-slate-700 light:hover:bg-slate-50'
                    }`}
                  >
                    <span>हिन्दी (Hindi)</span>
                    {language === 'hi' && <span className="text-[10px]">✓</span>}
                  </button>
                </div>
              )}
            </div>

            {/* Theme Toggle (Dark / Light) */}
            <button
              id="theme-toggle-button"
              onClick={toggleTheme}
              className="p-2 rounded-lg border text-slate-300 transition-colors bg-slate-900/60 border-white/10 hover:border-sky-500/30 hover:text-white dark:bg-slate-900/60 dark:border-white/10 dark:text-slate-300 light:bg-slate-100 light:border-slate-300 light:text-slate-700"
              title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-sky-600" />}
            </button>

            {user && <NotificationDropdown />}

            {/* Role Quick Toggle for effortless evaluation */}
            <button
              id="role-switch-button"
              onClick={() => (isAdmin ? loginAsStudent() : loginAsAdmin())}
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                isAdmin
                  ? 'bg-purple-500/20 border-purple-500/40 text-purple-300 hover:bg-purple-500/30'
                  : 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/25'
              }`}
              title="Toggle current persona to test student vs admin permissions"
            >
              {isAdmin ? <ShieldCheck className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
              <span>{isAdmin ? 'Admin View' : 'Student View'}</span>
            </button>

            {/* CTA / Dashboard link */}
            <button
              id="nav-primary-cta"
              onClick={() => onNavigate(isAdmin ? 'admin' : 'dashboard')}
              className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider text-slate-950 bg-gradient-to-r from-sky-400 via-teal-300 to-emerald-400 hover:opacity-95 shadow-md shadow-sky-500/20 transition-all active:scale-95"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{isAdmin ? 'Admin CMS' : t('nav.dashboard')}</span>
            </button>

            {/* Mobile Menu Trigger */}
            <button
              id="mobile-menu-toggle"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg border border-white/10 text-slate-300 hover:text-white"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/10 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.route}
                  onClick={() => {
                    onNavigate(item.route);
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-sm text-slate-300 hover:bg-white/5 hover:text-white"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-sky-400" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
            <div className="pt-2 border-t border-white/10 flex items-center justify-between px-4">
              <span className="text-xs text-slate-400">Current Role:</span>
              <button
                onClick={() => (isAdmin ? loginAsStudent() : loginAsAdmin())}
                className="text-xs font-semibold px-2.5 py-1 rounded bg-white/10 text-white"
              >
                Switch to {isAdmin ? 'Student' : 'Admin'}
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
