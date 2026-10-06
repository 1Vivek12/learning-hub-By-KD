// @ts-nocheck
import React, { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useLanguage } from '@/i18n/LanguageContext';
import {
  Radio, Plus, Play, Square, Clock, Copy, Check, Calendar, Users, Video, Loader2, AlertCircle
} from 'lucide-react';

interface AdminLiveClassesProps {
  onJoinRoom?: (liveClass: any) => void;
}

export const AdminLiveClasses: React.FC<AdminLiveClassesProps> = ({ onJoinRoom }) => {
  const { data: session } = useSession();
  const user = session?.user;
  const { l } = useLanguage();
  
  const [classes, setClasses] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // New Class State
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newDuration, setNewDuration] = useState(60);
  const [newCourseId, setNewCourseId] = useState('');
  const [newDate, setNewDate] = useState('');

  const showToast = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 3000);
  };

  const fetchClasses = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/live-classes');
      if (!res.ok) throw new Error('Failed to fetch live classes');
      const data = await res.json();
      setClasses(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCourses = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/courses');
      if (res.ok) {
        const data = await res.json();
        setCourses(data);
        if (data.length > 0) setNewCourseId(data[0].id);
      }
    } catch (err: any) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    fetchClasses();
    fetchCourses();
  }, [fetchClasses, fetchCourses]);

  const handleCopyLink = (roomId: string) => {
    const fullUrl = `${window.location.origin}/live/${roomId}`;
    navigator.clipboard?.writeText(fullUrl);
    setCopiedId(roomId);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleToggleStatus = async (cls: any) => {
    const action = cls.status === 'LIVE' ? 'end' : 'start';
    if (!confirm(`Are you sure you want to ${action} this class?`)) return;

    try {
      const res = await fetch(`/api/admin/live-classes/${cls.id}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || `Failed to ${action} class`);
      }
      showToast(`Class marked as ${action === 'end' ? 'COMPLETED' : 'LIVE'}`);
      fetchClasses();
    } catch (err: any) {
      showToast(`Error: ${err.message}`);
    }
  };

  const handleDeleteClass = async (id: string) => {
    if (!confirm("Delete this scheduled class?")) return;
    try {
      const res = await fetch(`/api/admin/live-classes/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error("Failed to delete class");
      showToast("Class deleted");
      fetchClasses();
    } catch (err: any) {
      showToast(`Error: ${err.message}`);
    }
  };

  const handleCreateClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newCourseId) {
      showToast("Title and Course are required.");
      return;
    }

    try {
      const startTime = newDate ? new Date(newDate).toISOString() : new Date(Date.now() + 3600000).toISOString();
      const res = await fetch('/api/admin/live-classes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titleEn: newTitle,
          descriptionEn: newDesc || 'Interactive high-impact live training with real-time Q&A.',
          courseId: newCourseId,
          instructorId: user.id, 
          scheduledStartTime: startTime,
          durationMinutes: newDuration,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create class');
      }

      showToast("Live Class scheduled successfully!");
      fetchClasses();
      setIsCreating(false);
      setNewTitle('');
      setNewDesc('');
    } catch (err: any) {
      showToast(`Error: ${err.message}`);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 gap-3">
        <Loader2 className="w-5 h-5 text-sky-400 animate-spin" />
        <span className="text-sm text-slate-400">Loading live classes…</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <AlertCircle className="w-8 h-8 text-rose-400" />
        <p className="text-sm text-slate-400">{error}</p>
        <button onClick={fetchClasses} className="px-4 py-2 rounded-lg bg-sky-500 text-xs font-bold text-slate-950">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {feedback && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs shadow-2xl animate-bounce">
          {feedback}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white dark:text-white light:text-slate-900 flex items-center gap-2">
            <Radio className="w-5 h-5 text-rose-500 animate-pulse" />
            <span>Live Classrooms & Virtual Cohorts</span>
          </h2>
          <p className="text-xs text-slate-400">
            Schedule interactive WebRTC sessions, broadcast live audio/video, and manage join permissions.
          </p>
        </div>

        <button
          onClick={() => setIsCreating(!isCreating)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-rose-400 to-amber-300 hover:opacity-95 shadow-md shadow-rose-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule Live Class</span>
        </button>
      </div>

      {/* Creation Modal */}
      {isCreating && (
        <div className="p-6 rounded-2xl border bg-slate-900 border-rose-500/30 space-y-4 shadow-xl">
          <h3 className="text-sm font-bold text-white">Create New Live Class Session</h3>
          <form onSubmit={handleCreateClass} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-400 mb-1">Session Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Advanced SQL Optimization Masterclass"
                  required
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white font-semibold"
                />
              </div>
              
              <div>
                <label className="block text-slate-400 mb-1">Related Course</label>
                <select
                  value={newCourseId}
                  onChange={(e) => setNewCourseId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white"
                >
                  {courses.map(c => (
                    <option key={c.id} value={c.id}>{c.titleEn}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Description / Key Agenda</label>
              <textarea
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                placeholder="Brief breakdown of live session..."
                rows={2}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-400 mb-1">Date & Time</label>
                <input
                  type="datetime-local"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white"
                  required
                />
              </div>

              <div className="flex items-center gap-4">
                <div className="w-full">
                  <label className="block text-slate-400 mb-1">Duration (Mins)</label>
                  <input
                    type="number"
                    value={newDuration}
                    onChange={(e) => setNewDuration(parseInt(e.target.value) || 60)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-end justify-end gap-2 pt-4">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="px-4 py-2 rounded-xl bg-white/10 text-slate-300 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-bold"
              >
                Publish Schedule
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Classes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {classes.length === 0 && (
           <div className="col-span-2 text-center text-slate-400 py-10 border border-dashed border-white/10 rounded-2xl">
             No live classes scheduled.
           </div>
        )}
        {classes.map((cls) => (
          <div
            key={cls.id}
            className="p-5 rounded-2xl border bg-slate-900/60 border-white/10 hover:border-white/20 transition-all space-y-4 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span
                  className={`text-[10px] font-bold font-mono uppercase px-2.5 py-1 rounded-md ${
                    cls.status === 'LIVE'
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30 animate-pulse'
                      : cls.status === 'SCHEDULED'
                      ? 'bg-sky-500/15 text-sky-400 border border-sky-500/30'
                      : 'bg-slate-800 text-slate-500'
                  }`}
                >
                  {cls.status === 'LIVE' ? '🔴 LIVE BROADCASTING' : cls.status}
                </span>

                <div className="flex gap-2">
                  <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {cls.durationMinutes}m
                  </span>
                  <button onClick={() => handleDeleteClass(cls.id)} className="text-rose-400 hover:text-rose-300 p-0.5 ml-2" title="Delete Class">
                    <XCircle className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-base font-bold text-white dark:text-white light:text-slate-900">
                  {cls.titleEn}
                </h3>
                <p className="text-xs text-slate-400 mt-1">Course: {cls.course?.titleEn}</p>
                <p className="text-xs text-slate-400 line-clamp-2 mt-2">
                  {cls.descriptionEn}
                </p>
                <p className="text-xs text-slate-400 font-mono mt-2">
                  Scheduled: {new Date(cls.scheduledStartTime).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="space-y-3 mt-4">
              {/* Room info & link */}
              <div className="p-3 rounded-xl bg-slate-950/60 border border-white/5 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">Room: {cls.roomId}</span>
                <button
                  onClick={() => handleCopyLink(cls.roomId)}
                  className="flex items-center gap-1 text-sky-400 hover:underline"
                >
                  {copiedId === cls.roomId ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Join Link</span>
                    </>
                  )}
                </button>
              </div>

              {/* Actions Bar */}
              <div className="pt-2 flex items-center justify-between border-t border-white/5">
                {cls.status !== 'COMPLETED' && cls.status !== 'CANCELLED' && (
                  <button
                    onClick={() => handleToggleStatus(cls)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      cls.status === 'LIVE'
                        ? 'bg-rose-500/15 text-rose-400 hover:bg-rose-500/25 border border-rose-500/30'
                        : 'bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25 border border-emerald-500/30'
                    }`}
                  >
                    {cls.status === 'LIVE' ? (
                      <>
                        <Square className="w-3.5 h-3.5 fill-rose-400" />
                        <span>End Live Session</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 fill-emerald-400" />
                        <span>Start Session Now</span>
                      </>
                    )}
                  </button>
                )}
                
                {(cls.status === 'COMPLETED' || cls.status === 'CANCELLED') && (
                  <span className="text-xs text-slate-500">Session ended</span>
                )}

                {onJoinRoom && cls.status === 'LIVE' && (
                  <button
                    onClick={() => onJoinRoom(cls)}
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white"
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Enter Stage</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
