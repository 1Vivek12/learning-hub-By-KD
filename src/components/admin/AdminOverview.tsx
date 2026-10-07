// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import {
  Users,
  BookOpen,
  DollarSign,
  Radio,
  TrendingUp,
  Star,
  CheckCircle2,
  Clock,
  ArrowUpRight,
} from 'lucide-react';

export const AdminOverview: React.FC<{ onNavigateTab: (tab: string) => void }> = ({
  onNavigateTab,
}) => {
  const { l } = useLanguage();
  const [stats, setStats] = useState<any>({ users: 0, courses: 0, orders: 0, enrollments: 0, revenue: 0 });
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/admin/overview').then(r => r.json()).then(setStats).catch(console.error);
    fetch('/api/admin/audit-logs').then(r => r.json()).then(d => setLogs(d.logs || [])).catch(console.error);
  }, []);

  const totalRevenue = stats.revenue ?? 0;
  const activeLiveCount = 0; // Will be connected in live class phase
  const courses: any[] = [];
  const orders: any[] = [];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Revenue */}
        <div className="p-5 rounded-2xl border bg-slate-900/80 border-white/10 dark:bg-slate-900/80 light:bg-white light:border-slate-200">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Total Revenue</span>
            <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold font-mono text-white dark:text-white light:text-slate-900">
              ₹{totalRevenue.toLocaleString()}
            </h3>
            <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1 mt-1">
              <TrendingUp className="w-3.5 h-3.5" />
              +28.4% from last week
            </span>
          </div>
        </div>

        {/* Total Courses */}
        <div className="p-5 rounded-2xl border bg-slate-900/80 border-white/10 dark:bg-slate-900/80 light:bg-white light:border-slate-200">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Active Curricula</span>
            <div className="p-2 rounded-xl bg-sky-500/15 text-sky-400">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold font-mono text-white dark:text-white light:text-slate-900">
              {courses.length}
            </h3>
            <span className="text-xs text-sky-400 font-semibold flex items-center gap-1 mt-1">
              {courses.filter((c) => c.status === 'published').length} Published Courses
            </span>
          </div>
        </div>

        {/* Students Enrolled */}
        <div className="p-5 rounded-2xl border bg-slate-900/80 border-white/10 dark:bg-slate-900/80 light:bg-white light:border-slate-200">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Total Students</span>
            <div className="p-2 rounded-xl bg-purple-500/15 text-purple-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold font-mono text-white dark:text-white light:text-slate-900">
              51,480
            </h3>
            <span className="text-xs text-purple-400 font-semibold flex items-center gap-1 mt-1">
              +142 enrolled today
            </span>
          </div>
        </div>

        {/* Live Masterclasses */}
        <div className="p-5 rounded-2xl border bg-slate-900/80 border-white/10 dark:bg-slate-900/80 light:bg-white light:border-slate-200">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Live Classrooms</span>
            <div className="p-2 rounded-xl bg-rose-500/15 text-rose-400">
              <Radio className="w-4 h-4 animate-pulse" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold font-mono text-white dark:text-white light:text-slate-900">
              {activeLiveCount} Live Now
            </h3>
            <span className="text-xs text-rose-400 font-semibold flex items-center gap-1 mt-1">
              {stats.liveClasses?.length || 0} Scheduled Sessions
            </span>
          </div>
        </div>
      </div>

      {/* Grid: Recent Orders & Recent Admin Audit Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Orders (7 cols) */}
        <div className="lg:col-span-7 p-6 rounded-2xl border bg-slate-900/60 border-white/10 space-y-4 dark:bg-slate-900/60 light:bg-white light:border-slate-200">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white dark:text-white light:text-slate-900">
              Recent Transactions & Enrollments
            </h3>
            <button
              onClick={() => onNavigateTab('orders')}
              className="text-xs text-sky-400 hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-slate-400">
                  <th className="pb-3 font-semibold">Order ID</th>
                  <th className="pb-3 font-semibold">Student</th>
                  <th className="pb-3 font-semibold">Course</th>
                  <th className="pb-3 font-semibold">Amount</th>
                  <th className="pb-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {orders.slice(0, 5).map((order) => (
                  <tr key={order.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 font-mono text-sky-400 font-semibold">{order.id}</td>
                    <td className="py-3 font-medium text-slate-200 dark:text-slate-200 light:text-slate-800">
                      {order.studentName}
                    </td>
                    <td className="py-3 text-slate-400 truncate max-w-[180px]">
                      {order.courseTitle}
                    </td>
                    <td className="py-3 font-mono font-bold text-white dark:text-white light:text-slate-900">
                      ₹{order.amount.toLocaleString()}
                    </td>
                    <td className="py-3">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                        {order.paymentStatus.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Security Audit Activity Feed (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-2xl border bg-slate-900/60 border-white/10 space-y-4 dark:bg-slate-900/60 light:bg-white light:border-slate-200">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white dark:text-white light:text-slate-900">
              CMS Security & Audit Logs
            </h3>
            <button
              onClick={() => onNavigateTab('audit')}
              className="text-xs text-sky-400 hover:underline"
            >
              All Logs
            </button>
          </div>

          <div className="space-y-3">
            {logs.slice(0, 5).map((log) => (
              <div
                key={log.id}
                className="p-3 rounded-xl bg-slate-950/60 border border-white/5 space-y-1 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-bold text-amber-400 uppercase">
                    {log.action}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">{new Date(log.createdAt || log.timestamp).toLocaleString()}</span>
                </div>
                <p className="text-slate-300 dark:text-slate-300 light:text-slate-700">
                  {typeof log.details === 'object' && log.details !== null ? JSON.stringify(log.details) : String(log.details || '')}
                </p>
                <span className="text-[10px] text-slate-500">Actor ID: {log.actor || 'System'}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
