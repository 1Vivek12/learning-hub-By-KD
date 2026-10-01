"use client";
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

export default function CertificateVerificationPage() {
  const params = useParams();
  const certificateNumber = params.certificateNumber as string;
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (certificateNumber) {
      fetch(`/api/certificates/verify/${certificateNumber}`)
        .then(res => res.json())
        .then(d => {
          setData(d);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [certificateNumber]);

  if (loading) {
    return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Verifying Certificate...</div>;
  }

  if (!data || data.error) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold text-rose-500 mb-2">Verification Failed</h1>
        <p className="text-slate-400">The certificate could not be found or the link is invalid.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-slate-900 border border-white/10 rounded-2xl shadow-2xl p-8 md:p-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-white tracking-tight mb-2">Learning Hub</h2>
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
            data.valid ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
          }`}>
            {data.valid ? 'Valid Certificate' : 'Revoked Certificate'}
          </div>
        </div>

        <div className="space-y-6">
          <div className="border-b border-white/5 pb-4">
            <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Student</p>
            <p className="text-lg text-white font-semibold">{data.studentName}</p>
          </div>

          <div className="border-b border-white/5 pb-4">
            <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Course</p>
            <p className="text-lg text-white font-semibold">{data.courseTitle}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-4">
            <div>
              <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Instructor</p>
              <p className="text-sm text-slate-300">{data.instructorName}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Certificate No.</p>
              <p className="text-sm font-mono text-slate-300">{data.certificateNumber}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Issue Date</p>
              <p className="text-sm text-slate-300">{new Date(data.issuedAt).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Completion Date</p>
              <p className="text-sm text-slate-300">{new Date(data.completedAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {!data.valid && (
          <div className="mt-8 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-center">
            <p className="text-sm text-rose-400 font-medium">
              This certificate has been formally revoked by Learning Hub administration and is no longer valid.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
