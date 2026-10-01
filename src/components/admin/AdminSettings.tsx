import React, { useState, useEffect } from 'react';
import { Settings, Save, Shield, Globe, Bell, CreditCard, Sparkles } from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const [settings, setSettings] = useState<any>({
    siteName: 'Learning Hub',
    logoUrl: '',
    supportEmail: '',
    supportPhone: '',
    currency: 'INR',
    defaultLanguage: 'en',
    maintenanceMode: false,
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch('/api/admin/settings')
      .then(r => r.json())
      .then(data => setSettings((prev: any) => ({ ...prev, ...data })))
      .catch(console.error);
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    fetch('/api/admin/settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    })
      .then(() => {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      })
      .catch(console.error);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-xl font-bold text-white dark:text-white light:text-slate-900 flex items-center gap-2">
          <Settings className="w-5 h-5 text-sky-400" />
          <span>Platform Settings & Global Integrations</span>
        </h2>
        <p className="text-xs text-slate-400">
          Configure site identity, default currency, media providers, and global announcement bar.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* Branding */}
        <div className="p-6 rounded-2xl border bg-slate-900/60 border-white/10 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Globe className="w-4 h-4 text-sky-400" />
            <span>Brand Identity & General</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 mb-1">Platform Name</label>
              <input
                type="text"
                value={settings.siteName}
                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white font-semibold"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Currency Symbol</label>
              <input
                type="text"
                value={settings.currency}
                onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white font-mono"
              />
            </div>
          </div>
        </div>

        {/* Global Announcement Banner */}
        <div className="p-6 rounded-2xl border bg-slate-900/60 border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Bell className="w-4 h-4 text-amber-400" />
              <span>Announcement Top Bar</span>
            </h3>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.announcementBarEnabled}
                onChange={(e) =>
                  setSettings({ ...settings, announcementBarEnabled: e.target.checked })
                }
                className="rounded accent-sky-400"
              />
              <span className="text-slate-300 font-semibold">Enable Banner</span>
            </label>
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Banner Announcement Text</label>
            <input
              type="text"
              value={settings.announcementText}
              onChange={(e) => setSettings({ ...settings, announcementText: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white"
            />
          </div>
        </div>

        {/* Architecture & Infrastructure Providers */}
        <div className="p-6 rounded-2xl border bg-slate-900/60 border-white/10 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-emerald-400" />
            <span>Infrastructure Gateway Defaults</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-400 mb-1">Video Stream Host</label>
              <select
                value={settings.videoProvider}
                onChange={(e) => setSettings({ ...settings, videoProvider: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white"
              >
                <option value="HLS Multi-CDN">HLS Multi-CDN (Fastly + Cloudflare)</option>
                <option value="Vimeo Enterprise">Vimeo Enterprise</option>
                <option value="AWS CloudFront">AWS CloudFront S3</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Default Payment Gateway</label>
              <select
                value={settings.paymentProvider}
                onChange={(e) => setSettings({ ...settings, paymentProvider: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white"
              >
                <option value="Razorpay Standard">Razorpay Standard (Cards, UPI, Netbanking)</option>
                <option value="Stripe Global">Stripe Global</option>
                <option value="Direct UPI QR">Direct UPI Auto-Collect</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Live SFU Mesh</label>
              <select
                value={settings.liveClassProvider}
                onChange={(e) => setSettings({ ...settings, liveClassProvider: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white"
              >
                <option value="Native WebRTC SFU">Native WebRTC SFU Mesh</option>
                <option value="LiveKit Cloud">LiveKit Cloud</option>
                <option value="Agora RTC">Agora RTC Engine</option>
              </select>
            </div>
          </div>
        </div>

        {/* Save CTA */}
        <div className="flex items-center justify-between pt-2">
          {saved && (
            <span className="text-xs text-emerald-400 font-semibold animate-fadeIn">
              ✓ Platform settings saved successfully!
            </span>
          )}

          <button
            type="submit"
            className="ml-auto flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs text-slate-950 bg-gradient-to-r from-sky-400 to-teal-300 hover:opacity-95 shadow-md transition-all active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>Save Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};
