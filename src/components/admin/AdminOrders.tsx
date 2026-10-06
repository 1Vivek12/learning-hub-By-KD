// @ts-nocheck
import React, { useState, useEffect, useCallback } from 'react';
import { DollarSign, Search, RotateCcw, Loader2, AlertCircle } from 'lucide-react';
import { useSession } from 'next-auth/react';

export const AdminOrders: React.FC = () => {
  const { data: session } = useSession();
  const user = session?.user;
  const [orders, setOrders] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 3000);
  };

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/admin/orders');
      if (!res.ok) throw new Error('Failed to fetch orders');
      const data = await res.json();
      setOrders(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const filtered = orders.filter((o) => {
    const s = search.toLowerCase();
    return (
      o.id.toLowerCase().includes(s) ||
      o.user?.name?.toLowerCase().includes(s) ||
      o.user?.email?.toLowerCase().includes(s) ||
      o.course?.titleEn?.toLowerCase().includes(s) ||
      o.paymentProvider?.toLowerCase().includes(s)
    );
  });

  const handleRefund = async (orderId: string) => {
    if (!confirm(`Issue refund for order ${orderId}?`)) return;
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/refund`, { method: 'POST' });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to refund order');
      }
      showToast('Order refunded successfully');
      fetchOrders();
    } catch (err: any) {
      showToast(`Error: ${err.message}`);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 gap-3">
        <Loader2 className="w-5 h-5 text-sky-400 animate-spin" />
        <span className="text-sm text-slate-400">Loading orders…</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <AlertCircle className="w-8 h-8 text-rose-400" />
        <p className="text-sm text-slate-400">{error}</p>
        <button onClick={fetchOrders} className="px-4 py-2 rounded-lg bg-sky-500 text-xs font-bold text-slate-950">
          Retry
        </button>
      </div>
    );
  }

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
            <DollarSign className="w-5 h-5 text-emerald-400" />
            <span>Orders & Payment Transactions</span>
          </h2>
          <p className="text-xs text-slate-400">
            Real-time transaction ledgers, provider references, student enrollment details, and refund operations.
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search order ID, student..."
            className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-slate-900 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-sky-400"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="rounded-2xl border bg-slate-900/60 border-white/10 overflow-hidden dark:bg-slate-900/60 light:bg-white light:border-slate-200">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 bg-slate-950/40">
                <th className="p-4 font-semibold">Order ID</th>
                <th className="p-4 font-semibold">Student Name & Email</th>
                <th className="p-4 font-semibold">Course</th>
                <th className="p-4 font-semibold">Provider</th>
                <th className="p-4 font-semibold">Amount</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((order) => (
                <tr key={order.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-4 font-mono font-bold text-sky-400">{order.id}</td>

                  <td className="p-4">
                    <div className="font-semibold text-slate-200 dark:text-slate-200 light:text-slate-800">
                      {order.user?.name || 'Unknown'}
                    </div>
                    <div className="text-[10px] text-slate-500">{order.user?.email}</div>
                  </td>

                  <td className="p-4 text-slate-300 font-medium truncate max-w-[200px]">
                    {order.course?.titleEn || 'Unknown Course'}
                  </td>

                  <td className="p-4 font-mono text-slate-400 text-[11px]">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {order.paymentProvider || 'N/A'}
                    </span>
                  </td>

                  <td className="p-4 font-mono font-bold text-white dark:text-white light:text-slate-900">
                    ₹{order.amount.toLocaleString()}
                  </td>

                  <td className="p-4">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                        order.paymentStatus === 'PAID'
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : order.paymentStatus === 'REFUNDED'
                          ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                          : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      {order.paymentStatus}
                    </span>
                  </td>

                  <td className="p-4 text-right">
                    {order.paymentStatus === 'PAID' && (
                      <button
                        onClick={() => handleRefund(order.id)}
                        className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 text-xs font-semibold"
                        title="Issue Refund"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
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
