import React, { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useLanguage } from '@/i18n/LanguageContext';
import { LiveClass } from '@/types';
import { AdminOverview } from './AdminOverview';
import { AdminCourses } from './AdminCourses';
import { AdminHomepageCMS } from './AdminHomepageCMS';
import { AdminLiveClasses } from './AdminLiveClasses';
import { AdminOrders } from './AdminOrders';
import { AdminUsers } from './AdminUsers';
import { AdminQuizzes } from './AdminQuizzes';
import { AdminCertificates } from './AdminCertificates';
import { AdminAuditLogs } from './AdminAuditLogs';
import { AdminSettings } from './AdminSettings';
import {
  LayoutDashboard,
  BookOpen,
  Layers,
  Radio,
  DollarSign,
  Users,
  Shield,
  HelpCircle,
  Award,
  Settings,
  ArrowLeft,
  ExternalLink,
  Laptop,
  Tablet,
  Smartphone,
  Sparkles,
} from 'lucide-react';

interface AdminLayoutProps {
  onBackToSite: () => void;
  onJoinLiveClassAsHost: (liveClass: LiveClass) => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  onBackToSite,
  onJoinLiveClassAsHost,
}) => {
  const { data: session } = useSession();
  const sessionUser = session?.user as any;
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<
    'overview' | 'courses' | 'cms' | 'live' | 'orders' | 'users' | 'quizzes' | 'certificates' | 'audit' | 'settings'
  >('overview');

  const navItems = [
    { id: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard },
    { id: 'courses', label: 'Course Management', icon: BookOpen },
    { id: 'cms', label: 'Homepage Builder', icon: Layers },
    { id: 'live', label: 'Live Masterclasses', icon: Radio },
    { id: 'orders', label: 'Orders & Payments', icon: DollarSign },
    { id: 'users', label: 'Users & Enrollments', icon: Users },
    { id: 'quizzes', label: 'Quizzes & Assessments', icon: HelpCircle },
    { id: 'certificates', label: 'Certificate Management', icon: Award },
    { id: 'audit', label: 'Security Audit Logs', icon: Shield },
    { id: 'settings', label: 'Platform Settings', icon: Settings },
  ] as const;

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 dark:bg-[#070b14] dark:text-slate-100 light:bg-slate-50 light:text-slate-900 flex flex-col">
      {/* Admin Top Header */}
      <header className="h-16 px-4 sm:px-6 border-b border-white/10 bg-[#0b0f19] dark:bg-[#0b0f19] dark:border-white/10 light:bg-white light:border-slate-200 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <button
            onClick={onBackToSite}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white dark:text-slate-400 dark:hover:text-white light:text-slate-500 light:hover:text-slate-900 transition-colors focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:outline-none rounded"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Learner Portal</span>
          </button>

          <span className="text-slate-700 hidden sm:inline">|</span>

          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-sky-500/20 text-sky-400 font-mono text-[11px] font-bold border border-sky-500/30">
              CMS ADMIN
            </span>
            <span className="text-xs font-bold text-slate-200 dark:text-slate-200 light:text-slate-800 hidden md:inline">
              Learning Hub Production Control Suite
            </span>
          </div>
        </div>

        {/* User Account & Switch Role */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <span className="block text-xs font-bold text-white dark:text-white light:text-slate-900">{sessionUser?.name || 'Admin'}</span>
            <span className="block text-[10px] text-sky-400 font-mono">{sessionUser?.email || ''}</span>
          </div>

          {process.env.NODE_ENV === 'development' ? (
            <button
              onClick={onBackToSite}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 transition-colors focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:outline-none"
            >
              [DEV] Back to Site
            </button>
          ) : (
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/10 hover:bg-white/20 text-slate-200 dark:bg-white/10 dark:hover:bg-white/20 dark:text-slate-200 light:bg-slate-200 light:hover:bg-slate-300 light:text-slate-800 transition-colors focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:outline-none"
            >
              Sign Out
            </button>
          )}
        </div>
      </header>

      {/* Main Admin Workspace Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 border-r border-white/10 bg-[#0b0f19]/80 dark:border-white/10 dark:bg-[#0b0f19]/80 light:border-slate-200 light:bg-white/90 backdrop-blur-md p-4 hidden md:flex flex-col gap-1 overflow-y-auto shrink-0">
          <div className="px-3 py-2 text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold">
            Administrative Modules
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all text-left ${
                  isActive
                    ? 'bg-sky-500/15 text-sky-400 border border-sky-500/30 shadow-sm'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white light:text-slate-600 light:hover:bg-slate-100 light:hover:text-slate-900'
                } focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:outline-none`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-sky-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}

          <div className="mt-auto pt-6 border-t border-white/10 dark:border-white/10 light:border-slate-200">
            <button
              onClick={onBackToSite}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-slate-400 hover:text-white hover:bg-white/5 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/5 light:text-slate-600 light:hover:text-slate-900 light:hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:outline-none"
            >
              <span>Live Preview App</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8">
          {/* Mobile Tab Bar */}
          <div className="md:hidden flex overflow-x-auto gap-2 pb-4 mb-4 border-b border-white/10 dark:border-white/10 light:border-slate-200">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap ${
                  activeTab === item.id
                    ? 'bg-sky-500 text-slate-950 font-bold'
                    : 'bg-slate-900 text-slate-300 dark:bg-slate-900 dark:text-slate-300 light:bg-slate-200 light:text-slate-700'
                } focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:outline-none`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {activeTab === 'overview' && <AdminOverview onNavigateTab={(t: any) => setActiveTab(t)} />}
          {activeTab === 'courses' && <AdminCourses />}
          {activeTab === 'cms' && <AdminHomepageCMS />}
          {activeTab === 'live' && (
            <AdminLiveClasses onJoinRoom={(cls) => onJoinLiveClassAsHost(cls)} />
          )}
          {activeTab === 'orders' && <AdminOrders />}
          {activeTab === 'users' && <AdminUsers />}
          {activeTab === 'quizzes' && <AdminQuizzes />}
          {activeTab === 'certificates' && <AdminCertificates />}
          {activeTab === 'audit' && <AdminAuditLogs />}
          {activeTab === 'settings' && <AdminSettings />}
        </main>
      </div>
    </div>
  );
};
