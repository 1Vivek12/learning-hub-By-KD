import React, { useState, useEffect } from 'react';
import { Shield, Clock, UserCheck, RefreshCw } from 'lucide-react';

export const AdminAuditLogs: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/admin/audit-logs')
      .then(r => r.json())
      .then(data => setLogs(data.logs || []))
      .catch(console.error);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white dark:text-white light:text-slate-900 flex items-center gap-2">
          <Shield className="w-5 h-5 text-amber-400" />
          <span>Security & Change Audit Trail</span>
        </h2>
        <p className="text-xs text-slate-400">
          Cryptographically timestamped actions tracking CMS section updates, course publication, live sessions, and financial adjustments.
        </p>
      </div>

      {/* Logs Table */}
      <div className="rounded-2xl border bg-slate-900/60 border-white/10 overflow-hidden dark:bg-slate-900/60 light:bg-white light:border-slate-200">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 bg-slate-950/40">
                <th className="p-4 font-semibold">Log ID</th>
                <th className="p-4 font-semibold">Admin Account</th>
                <th className="p-4 font-semibold">Action Trigger</th>
                <th className="p-4 font-semibold">Description / Scope</th>
                <th className="p-4 font-semibold">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-4 font-mono font-bold text-sky-400 text-[11px]">{log.id}</td>
                  <td className="p-4 font-medium text-slate-200">{log.actor || 'System'}</td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 font-mono text-[10px] font-bold border border-amber-500/30">
                      {log.action}
                    </span>
                  </td>
                  <td className="p-4 text-slate-300 max-w-md leading-relaxed">{typeof log.details === 'object' && log.details !== null ? JSON.stringify(log.details) : String(log.details || '')}</td>
                  <td className="p-4 font-mono text-slate-500 text-[11px]">{new Date(log.createdAt || log.timestamp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
