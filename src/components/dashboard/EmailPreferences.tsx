// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { Mail, Shield, Check, Loader2, AlertCircle } from 'lucide-react';

export const EmailPreferences: React.FC = () => {
  const [preferences, setPreferences] = useState({
    emailMarketing: false,
    emailCourseUpdates: true,
    emailLiveClasses: true,
    emailCertificates: true,
    emailSecurity: true
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/user/preferences')
      .then(res => res.json())
      .then(data => {
        setPreferences(data);
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  const handleToggle = (key: string) => {
    if (key === 'emailSecurity') return; // Security cannot be toggled
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const savePreferences = async () => {
    try {
      setSaving(true);
      const res = await fetch('/api/user/preferences', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(preferences)
      });
      if (res.ok) {
        setFeedback("Preferences saved successfully");
        setTimeout(() => setFeedback(null), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-sm text-slate-500 flex gap-2"><Loader2 className="w-4 h-4 animate-spin"/> Loading preferences...</div>;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-3xl p-6 md:p-8 space-y-8">
      <div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Mail className="w-5 h-5 text-sky-500" />
          Email Notifications
        </h2>
        <p className="text-sm text-slate-500 mt-1">Control which emails you want to receive from us.</p>
      </div>

      <div className="space-y-4">
        
        {/* Security (Mandatory) */}
        <div className="flex items-start justify-between gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-white/5 opacity-80">
          <div>
            <div className="font-semibold text-sm text-slate-800 dark:text-slate-200 flex items-center gap-2">
              Security & Account
              <Shield className="w-3.5 h-3.5 text-emerald-500" />
            </div>
            <p className="text-xs text-slate-500 mt-1">Password resets, login alerts, and critical account info.</p>
          </div>
          <div className="text-xs font-bold text-slate-400 uppercase bg-slate-200 dark:bg-slate-800 px-2 py-1 rounded">
            Required
          </div>
        </div>

        {/* Live Classes */}
        <div 
          onClick={() => handleToggle('emailLiveClasses')}
          className="flex items-start justify-between gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-white/5 cursor-pointer hover:border-sky-500/30 transition-colors"
        >
          <div>
            <div className="font-semibold text-sm text-slate-800 dark:text-slate-200">Live Class Reminders</div>
            <p className="text-xs text-slate-500 mt-1">Reminders when a live class you are enrolled in is about to start.</p>
          </div>
          <div className={`w-10 h-6 rounded-full p-1 transition-colors ${preferences.emailLiveClasses ? 'bg-sky-500' : 'bg-slate-300 dark:bg-slate-700'}`}>
            <div className={`w-4 h-4 bg-white rounded-full transition-transform ${preferences.emailLiveClasses ? 'translate-x-4' : 'translate-x-0'}`} />
          </div>
        </div>

        {/* Certificates */}
        <div 
          onClick={() => handleToggle('emailCertificates')}
          className="flex items-start justify-between gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-white/5 cursor-pointer hover:border-sky-500/30 transition-colors"
        >
          <div>
            <div className="font-semibold text-sm text-slate-800 dark:text-slate-200">Certificates Issued</div>
            <p className="text-xs text-slate-500 mt-1">Notifications when your digital certificate is generated.</p>
          </div>
          <div className={`w-10 h-6 rounded-full p-1 transition-colors ${preferences.emailCertificates ? 'bg-sky-500' : 'bg-slate-300 dark:bg-slate-700'}`}>
            <div className={`w-4 h-4 bg-white rounded-full transition-transform ${preferences.emailCertificates ? 'translate-x-4' : 'translate-x-0'}`} />
          </div>
        </div>

        {/* Course Updates */}
        <div 
          onClick={() => handleToggle('emailCourseUpdates')}
          className="flex items-start justify-between gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-white/5 cursor-pointer hover:border-sky-500/30 transition-colors"
        >
          <div>
            <div className="font-semibold text-sm text-slate-800 dark:text-slate-200">Course Updates</div>
            <p className="text-xs text-slate-500 mt-1">Enrollment confirmations and major curriculum changes.</p>
          </div>
          <div className={`w-10 h-6 rounded-full p-1 transition-colors ${preferences.emailCourseUpdates ? 'bg-sky-500' : 'bg-slate-300 dark:bg-slate-700'}`}>
            <div className={`w-4 h-4 bg-white rounded-full transition-transform ${preferences.emailCourseUpdates ? 'translate-x-4' : 'translate-x-0'}`} />
          </div>
        </div>

        {/* Marketing */}
        <div 
          onClick={() => handleToggle('emailMarketing')}
          className="flex items-start justify-between gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-white/5 cursor-pointer hover:border-sky-500/30 transition-colors"
        >
          <div>
            <div className="font-semibold text-sm text-slate-800 dark:text-slate-200">Marketing & Promos</div>
            <p className="text-xs text-slate-500 mt-1">Special offers, new courses, and community news.</p>
          </div>
          <div className={`w-10 h-6 rounded-full p-1 transition-colors ${preferences.emailMarketing ? 'bg-sky-500' : 'bg-slate-300 dark:bg-slate-700'}`}>
            <div className={`w-4 h-4 bg-white rounded-full transition-transform ${preferences.emailMarketing ? 'translate-x-4' : 'translate-x-0'}`} />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4">
        {feedback ? (
          <span className="text-emerald-500 text-sm font-bold flex items-center gap-1">
            <Check className="w-4 h-4" /> {feedback}
          </span>
        ) : <span />}
        <button
          onClick={savePreferences}
          disabled={saving}
          className="px-6 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-sm shadow-md transition-all disabled:opacity-50 flex items-center gap-2"
        >
          {saving && <Loader2 className="w-4 h-4 animate-spin" />}
          Save Preferences
        </button>
      </div>
    </div>
  );
};
