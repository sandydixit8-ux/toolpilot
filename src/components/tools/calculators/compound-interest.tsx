'use client';

import { useState } from 'react';

export function CompoundInterestTool() {
  const [principal, setPrincipal] = useState('');
  const [rate, setRate] = useState('');
  const [time, setTime] = useState('');
  const [frequency, setFrequency] = useState('12');

  const P = parseFloat(principal) || 0;
  const r = (parseFloat(rate) || 0) / 100;
  const t = parseFloat(time) || 0;
  const n = parseInt(frequency) || 12;

  const amount = P * Math.pow(1 + r / n, n * t);
  const compoundInterest = amount - P;

  return (
    <div className="card">
      <div className="space-y-6">
        <div>
          <label className="label">Principal Amount (₹)</label>
          <input type="number" value={principal} onChange={(e) => setPrincipal(e.target.value)} className="input mt-1" min="0" />
        </div>
        <div>
          <label className="label">Annual Interest Rate (%)</label>
          <input type="number" value={rate} onChange={(e) => setRate(e.target.value)} className="input mt-1" min="0" step="0.1" />
        </div>
        <div>
          <label className="label">Time Period (years)</label>
          <input type="number" value={time} onChange={(e) => setTime(e.target.value)} className="input mt-1" min="0" step="0.5" />
        </div>
        <div>
          <label className="label">Compounding Frequency</label>
          <div className="mt-2 grid grid-cols-4 gap-2">
            {[{ v: '1', l: 'Yearly' }, { v: '4', l: 'Quarterly' }, { v: '12', l: 'Monthly' }, { v: '365', l: 'Daily' }].map((f) => (
              <button key={f.v} onClick={() => setFrequency(f.v)} className={`rounded-lg px-3 py-2 text-xs font-medium transition-colors ${frequency === f.v ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300'}`}>
                {f.l}
              </button>
            ))}
          </div>
        </div>

        {P > 0 && r > 0 && t > 0 && (
          <div className="rounded-xl bg-gray-50 p-5 dark:bg-gray-800/50">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-gray-200 pb-3 dark:border-gray-700">
                <span className="text-sm text-gray-600 dark:text-gray-400">Total Amount</span>
                <span className="text-xl font-bold text-brand-600 dark:text-brand-400">₹{amount.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Principal</span>
                <span className="font-semibold text-gray-900 dark:text-white">₹{P.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Compound Interest</span>
                <span className="font-semibold text-green-600 dark:text-green-400">₹{compoundInterest.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}

        <div className="rounded-lg bg-blue-50 p-4 text-xs text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">
          <strong>Formula:</strong> A = P(1 + r/n)^(nt), where A = Amount, P = Principal, r = Annual rate, n = Compounding frequency, t = Time in years.
        </div>
      </div>
    </div>
  );
}
