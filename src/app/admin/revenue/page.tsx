'use client';

import { useState, useEffect } from 'react';
import { Plus, Download, Trash2, TrendingUp, DollarSign, BarChart3, Calendar } from 'lucide-react';

interface RevenueEntry {
  id: string;
  date: string;
  source: 'adsense' | 'affiliate' | 'tips' | 'newsletter' | 'other';
  amount: number;
  notes: string;
}

const SOURCE_LABELS: Record<string, { label: string; color: string }> = {
  adsense: { label: 'Google AdSense', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400' },
  affiliate: { label: 'Amazon Affiliate', color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400' },
  tips: { label: 'Tips (Buy Me Coffee)', color: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400' },
  newsletter: { label: 'Newsletter Sponsor', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400' },
  other: { label: 'Other', color: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400' },
};

function getStoredEntries(): RevenueEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem('toolpilot_revenue') || '[]');
  } catch { return []; }
}

function saveEntries(entries: RevenueEntry[]) {
  localStorage.setItem('toolpilot_revenue', JSON.stringify(entries));
}

function exportCSV(entries: RevenueEntry[]) {
  const header = 'Date,Source,Amount (₹),Notes\n';
  const rows = entries.map(e => `${e.date},${SOURCE_LABELS[e.source]?.label || e.source},${e.amount},"${e.notes}"`).join('\n');
  const blob = new Blob([header + rows], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `toolpilot_revenue_${new Date().toISOString().slice(0, 7)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function RevenuePage() {
  const [entries, setEntries] = useState<RevenueEntry[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ date: new Date().toISOString().slice(0, 10), source: 'adsense' as RevenueEntry['source'], amount: '', notes: '' });

  useEffect(() => { setEntries(getStoredEntries()); }, []);

  const addEntry = () => {
    if (!form.amount) return;
    const newEntry: RevenueEntry = { id: Date.now().toString(), ...form, amount: parseFloat(form.amount) };
    const updated = [newEntry, ...entries];
    setEntries(updated);
    saveEntries(updated);
    setForm({ date: new Date().toISOString().slice(0, 10), source: 'adsense', amount: '', notes: '' });
    setShowForm(false);
  };

  const deleteEntry = (id: string) => {
    const updated = entries.filter(e => e.id !== id);
    setEntries(updated);
    saveEntries(updated);
  };

  const totalRevenue = entries.reduce((sum, e) => sum + e.amount, 0);
  const thisMonth = entries.filter(e => e.date.startsWith(new Date().toISOString().slice(0, 7)));
  const thisMonthTotal = thisMonth.reduce((sum, e) => sum + e.amount, 0);
  const lastMonth = new Date();
  lastMonth.setMonth(lastMonth.getMonth() - 1);
  const lastMonthKey = lastMonth.toISOString().slice(0, 7);
  const lastMonthEntries = entries.filter(e => e.date.startsWith(lastMonthKey));
  const lastMonthTotal = lastMonthEntries.reduce((sum, e) => sum + e.amount, 0);

  const bySource = Object.keys(SOURCE_LABELS).map(source => ({
    source,
    ...SOURCE_LABELS[source],
    total: entries.filter(e => e.source === source).reduce((sum, e) => sum + e.amount, 0),
  })).filter(s => s.total > 0);

  const monthlyData: Record<string, number> = {};
  entries.forEach(e => {
    const month = e.date.slice(0, 7);
    monthlyData[month] = (monthlyData[month] || 0) + e.amount;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Revenue Dashboard</h1>
          <p className="text-sm text-gray-500">Track and monitor all revenue sources</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => exportCSV(entries)} className="btn-secondary flex items-center gap-2"><Download className="h-4 w-4" /> Export CSV</button>
          <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center gap-2"><Plus className="h-4 w-4" /> Add Entry</button>
        </div>
      </div>

      {showForm && (
        <div className="card space-y-4">
          <h3 className="font-semibold text-gray-900 dark:text-white">Add Revenue Entry</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div><label className="label text-xs">Date</label><input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="input mt-1" /></div>
            <div><label className="label text-xs">Source</label>
              <select value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value as RevenueEntry['source'] })} className="input mt-1">
                <option value="adsense">Google AdSense</option>
                <option value="affiliate">Amazon Affiliate</option>
                <option value="tips">Tips (Buy Me Coffee)</option>
                <option value="newsletter">Newsletter Sponsor</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div><label className="label text-xs">Amount (₹)</label><input type="number" step="0.01" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} placeholder="0.00" className="input mt-1" /></div>
            <div><label className="label text-xs">Notes</label><input type="text" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Optional" className="input mt-1" /></div>
          </div>
          <button onClick={addEntry} disabled={!form.amount} className="btn-primary disabled:opacity-40">Save Entry</button>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card text-center">
          <DollarSign className="h-6 w-6 mx-auto text-green-500 mb-1" />
          <p className="text-2xl font-bold text-gray-900 dark:text-white">₹{thisMonthTotal.toLocaleString()}</p>
          <p className="text-xs text-gray-500">This Month</p>
        </div>
        <div className="card text-center">
          <Calendar className="h-6 w-6 mx-auto text-blue-500 mb-1" />
          <p className="text-2xl font-bold text-gray-900 dark:text-white">₹{lastMonthTotal.toLocaleString()}</p>
          <p className="text-xs text-gray-500">Last Month</p>
        </div>
        <div className="card text-center">
          <TrendingUp className="h-6 w-6 mx-auto text-purple-500 mb-1" />
          <p className="text-2xl font-bold text-gray-900 dark:text-white">₹{totalRevenue.toLocaleString()}</p>
          <p className="text-xs text-gray-500">All Time</p>
        </div>
        <div className="card text-center">
          <BarChart3 className="h-6 w-6 mx-auto text-orange-500 mb-1" />
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{entries.length}</p>
          <p className="text-xs text-gray-500">Total Entries</p>
        </div>
      </div>

      {bySource.length > 0 && (
        <div className="card">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Revenue by Source</h3>
          <div className="space-y-2">
            {bySource.map(s => (
              <div key={s.source} className="flex items-center justify-between">
                <span className={`text-xs px-2 py-0.5 rounded-full ${s.color}`}>{s.label}</span>
                <span className="font-medium text-gray-900 dark:text-white">₹{s.total.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {Object.keys(monthlyData).length > 0 && (
        <div className="card">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Monthly Breakdown</h3>
          <div className="space-y-2">
            {Object.entries(monthlyData).sort((a, b) => b[0].localeCompare(a[0])).map(([month, total]) => (
              <div key={month} className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{month}</span>
                <span className="font-bold text-gray-900 dark:text-white">₹{total.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-3">All Entries</h3>
        {entries.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-8">No entries yet. Click &ldquo;Add Entry&rdquo; to start tracking.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-2 text-gray-500 font-medium">Date</th>
                  <th className="text-left py-2 text-gray-500 font-medium">Source</th>
                  <th className="text-right py-2 text-gray-500 font-medium">Amount</th>
                  <th className="text-left py-2 text-gray-500 font-medium">Notes</th>
                  <th className="text-right py-2 text-gray-500 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {entries.map(e => (
                  <tr key={e.id} className="border-b border-gray-100 dark:border-gray-800">
                    <td className="py-2 text-gray-700 dark:text-gray-300">{e.date}</td>
                    <td className="py-2"><span className={`text-xs px-2 py-0.5 rounded-full ${SOURCE_LABELS[e.source]?.color || ''}`}>{SOURCE_LABELS[e.source]?.label || e.source}</span></td>
                    <td className="py-2 text-right font-medium text-gray-900 dark:text-white">₹{e.amount.toLocaleString()}</td>
                    <td className="py-2 text-gray-500 text-xs">{e.notes}</td>
                    <td className="py-2 text-right"><button onClick={() => deleteEntry(e.id)} className="text-red-500 hover:text-red-700"><Trash2 className="h-4 w-4" /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
