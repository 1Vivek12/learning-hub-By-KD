// @ts-nocheck
import React, { useState, useEffect, useCallback } from 'react';
import { Users, Search, Loader2, AlertCircle, Shield, CheckCircle2, UserX } from 'lucide-react';
import { useSession } from 'next-auth/react';

export const AdminUsers: React.FC = () => {
  const { data: session } = useSession();
  const user = session?.user;
  
  const [activeTab, setActiveTab] = useState<'users' | 'enrollments'>('users');

  // Users State
  const [users, setUsers] = useState<any[]>([]);
  const [searchUser, setSearchUser] = useState('');
  const [loadingUsers, setLoadingUsers] = useState(true);

  // Enrollments State
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [searchEnrollment, setSearchEnrollment] = useState('');
  const [loadingEnrollments, setLoadingEnrollments] = useState(true);

  const [feedback, setFeedback] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 3000);
  };

  const fetchUsers = useCallback(async () => {
    try {
      setLoadingUsers(true);
      const res = await fetch('/api/admin/users');
      if (!res.ok) throw new Error('Failed to fetch users');
      const data = await res.json();
      setUsers(data);
    } catch (err: any) {
      showToast(`Error loading users: ${err.message}`);
    } finally {
      setLoadingUsers(false);
    }
  }, []);

  const fetchEnrollments = useCallback(async () => {
    try {
      setLoadingEnrollments(true);
      const res = await fetch('/api/admin/enrollments');
      if (!res.ok) throw new Error('Failed to fetch enrollments');
      const data = await res.json();
      setEnrollments(data);
    } catch (err: any) {
      showToast(`Error loading enrollments: ${err.message}`);
    } finally {
      setLoadingEnrollments(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'users') fetchUsers();
    else fetchEnrollments();
  }, [activeTab, fetchUsers, fetchEnrollments]);

  const handleUpdateRole = async (userId: string, newRole: string) => {
    if (userId === user.id && newRole !== 'ADMIN' && newRole !== 'SUPER_ADMIN') {
      showToast("You cannot remove your own admin access.");
      return;
    }
    
    if (!confirm(`Are you sure you want to change this user's role to ${newRole}?`)) return;

    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      });
      if (!res.ok) throw new Error('Failed to update role');
      showToast('User role updated successfully');
      fetchUsers();
    } catch (err: any) {
      showToast(`Error: ${err.message}`);
    }
  };

  const handleUpdateEnrollmentStatus = async (enrollmentId: string, newStatus: string) => {
    if (!confirm(`Change enrollment status to ${newStatus}?`)) return;

    try {
      const res = await fetch(`/api/admin/enrollments/${enrollmentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error('Failed to update enrollment status');
      showToast('Enrollment status updated');
      fetchEnrollments();
    } catch (err: any) {
      showToast(`Error: ${err.message}`);
    }
  };

  const filteredUsers = users.filter((u) => {
    const s = searchUser.toLowerCase();
    return (
      u.name.toLowerCase().includes(s) ||
      u.email.toLowerCase().includes(s) ||
      u.role.toLowerCase().includes(s)
    );
  });

  const filteredEnrollments = enrollments.filter((e) => {
    const s = searchEnrollment.toLowerCase();
    return (
      e.user?.name?.toLowerCase().includes(s) ||
      e.user?.email?.toLowerCase().includes(s) ||
      e.course?.titleEn?.toLowerCase().includes(s) ||
      e.status.toLowerCase().includes(s)
    );
  });

  return (
    <div className="space-y-6">
      {/* Toast Feedback */}
      {feedback && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs shadow-2xl animate-bounce">
          {feedback}
        </div>
      )}

      {/* Header & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white dark:text-white light:text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-400" />
            <span>Users & Enrollments</span>
          </h2>
          <p className="text-xs text-slate-400">
            Manage students, instructors, admin roles, and course enrollments.
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex rounded-lg bg-slate-900 p-1 border border-white/10 text-xs">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-1.5 rounded-md font-semibold ${
              activeTab === 'users'
                ? 'bg-purple-500 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All Users
          </button>
          <button
            onClick={() => setActiveTab('enrollments')}
            className={`px-4 py-1.5 rounded-md font-semibold ${
              activeTab === 'enrollments'
                ? 'bg-purple-500 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Enrollments
          </button>
        </div>
      </div>

      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchUser}
              onChange={(e) => setSearchUser(e.target.value)}
              placeholder="Search users..."
              className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-slate-900 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-sky-400"
            />
          </div>

          <div className="rounded-2xl border bg-slate-900/60 border-white/10 overflow-hidden dark:bg-slate-900/60 light:bg-white light:border-slate-200">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-slate-400 bg-slate-950/40">
                    <th className="p-4 font-semibold">User</th>
                    <th className="p-4 font-semibold">Role</th>
                    <th className="p-4 font-semibold">Enrollments</th>
                    <th className="p-4 font-semibold">Joined At</th>
                    <th className="p-4 font-semibold text-right">Change Role</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {loadingUsers ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-slate-400">Loading...</td>
                    </tr>
                  ) : filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-4">
                        <div className="font-semibold text-slate-200 dark:text-slate-200 light:text-slate-800">
                          {u.name}
                        </div>
                        <div className="text-[10px] text-slate-500">{u.email}</div>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          u.role === 'ADMIN' || u.role === 'SUPER_ADMIN' 
                            ? 'bg-purple-500/15 text-purple-400 border border-purple-500/30'
                            : u.role === 'INSTRUCTOR'
                            ? 'bg-sky-500/15 text-sky-400 border border-sky-500/30'
                            : 'bg-slate-800 text-slate-300 border border-white/10'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="p-4 text-slate-300 font-medium">
                        {u._count?.enrollments || 0}
                      </td>
                      <td className="p-4 text-slate-400">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-right">
                        <select
                          value={u.role}
                          onChange={(e) => handleUpdateRole(u.id, e.target.value)}
                          disabled={u.id === user.id}
                          className="bg-slate-950 border border-white/10 text-white text-xs rounded-md px-2 py-1 disabled:opacity-50"
                        >
                          <option value="STUDENT">STUDENT</option>
                          <option value="INSTRUCTOR">INSTRUCTOR</option>
                          <option value="ADMIN">ADMIN</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'enrollments' && (
        <div className="space-y-4">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchEnrollment}
              onChange={(e) => setSearchEnrollment(e.target.value)}
              placeholder="Search enrollments..."
              className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-slate-900 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-sky-400"
            />
          </div>

          <div className="rounded-2xl border bg-slate-900/60 border-white/10 overflow-hidden dark:bg-slate-900/60 light:bg-white light:border-slate-200">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-slate-400 bg-slate-950/40">
                    <th className="p-4 font-semibold">Student</th>
                    <th className="p-4 font-semibold">Course</th>
                    <th className="p-4 font-semibold">Enrolled At</th>
                    <th className="p-4 font-semibold">Status</th>
                    <th className="p-4 font-semibold text-right">Change Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {loadingEnrollments ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-slate-400">Loading...</td>
                    </tr>
                  ) : filteredEnrollments.map((enr) => (
                    <tr key={enr.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-4">
                        <div className="font-semibold text-slate-200 dark:text-slate-200 light:text-slate-800">
                          {enr.user?.name}
                        </div>
                        <div className="text-[10px] text-slate-500">{enr.user?.email}</div>
                      </td>
                      <td className="p-4">
                        <div className="font-semibold text-sky-400">
                          {enr.course?.titleEn}
                        </div>
                        <div className="text-[10px] text-slate-500">/{enr.course?.slug}</div>
                      </td>
                      <td className="p-4 text-slate-400">
                        {new Date(enr.enrolledAt).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          enr.status === 'ACTIVE'
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : enr.status === 'COMPLETED'
                            ? 'bg-sky-500/15 text-sky-400 border border-sky-500/30'
                            : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                        }`}>
                          {enr.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <select
                          value={enr.status}
                          onChange={(e) => handleUpdateEnrollmentStatus(enr.id, e.target.value)}
                          className="bg-slate-950 border border-white/10 text-white text-xs rounded-md px-2 py-1"
                        >
                          <option value="ACTIVE">ACTIVE</option>
                          <option value="COMPLETED">COMPLETED</option>
                          <option value="CANCELLED">CANCELLED</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
