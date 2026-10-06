// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { Award, Search, Loader2, AlertCircle, XCircle } from 'lucide-react';
import { useSession } from 'next-auth/react';

export const AdminCertificates: React.FC = () => {
  const { data: session } = useSession();
  const user = session?.user;
  const [certificates, setCertificates] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 3000);
  };

  const fetchCertificates = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/certificates');
      if (!res.ok) throw new Error('Failed to fetch certificates');
      const data = await res.json();
      setCertificates(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, []);

  const handleRevoke = async (id: string) => {
    if (!confirm('Are you sure you want to revoke this certificate?')) return;
    try {
      const res = await fetch(`/api/admin/certificates/${id}/revoke`, { method: 'POST' });
      if (!res.ok) throw new Error('Failed to revoke certificate');
      showToast('Certificate revoked');
      fetchCertificates();
    } catch (err: any) {
      showToast(err.message);
    }
  };

  const filtered = certificates.filter((c) => {
    const s = search.toLowerCase();
    return (
      c.certificateNumber.toLowerCase().includes(s) ||
      c.studentName.toLowerCase().includes(s) ||
      c.courseTitle.toLowerCase().includes(s) ||
      c.status.toLowerCase().includes(s)
    );
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 gap-3">
        <Loader2 className="w-5 h-5 text-sky-400 animate-spin" />
        <span className="text-sm text-slate-400">Loading certificates…</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <AlertCircle className="w-8 h-8 text-rose-400" />
        <p className="text-sm text-slate-400">{error}</p>
        <button onClick={fetchCertificates} className="px-4 py-2 rounded-lg bg-sky-500 text-xs font-bold text-slate-950">
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

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <span>Certificate Management</span>
          </h2>
          <p className="text-xs text-slate-400">View issued certificates and revoke them if necessary.</p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search certificates..."
            className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-slate-900 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-sky-400"
          />
        </div>
      </div>

      <div className="rounded-2xl border bg-slate-900/60 border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 bg-slate-950/40">
                <th className="p-4 font-semibold">Certificate Number</th>
                <th className="p-4 font-semibold">Student Name</th>
                <th className="p-4 font-semibold">Course Title</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((cert) => (
                <tr key={cert.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-4 font-mono font-bold text-amber-400">{cert.certificateNumber}</td>
                  <td className="p-4 text-slate-200">{cert.studentName}</td>
                  <td className="p-4 text-slate-300 truncate max-w-[200px]">{cert.courseTitle}</td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      cert.status === 'ISSUED'
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                    }`}>
                      {cert.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    {cert.status === 'ISSUED' && (
                      <button
                        onClick={() => handleRevoke(cert.id)}
                        className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"
                        title="Revoke Certificate"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
