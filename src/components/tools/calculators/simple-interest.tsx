'use client';

import { useState } from 'react';

export function SimpleInterestTool() {
  const [principal, setPrincipal] = useState('');
  const [rate, setRate] = useState('');
  const [time, setTime] = useState('');

  const P = parseFloat(principal) || 0;
  const R = parseFloat(rate) || 0;
  const T = parseFloat(time) || 0;

  const simpleInterest = (P * R * T) / 100;
  const totalAmount = P + simpleInterest;

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

        {P > 0 && R > 0 && T > 0 && (
          <div className="rounded-xl bg-gray-50 p-5 dark:bg-gray-800/50">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-gray-200 pb-3 dark:border-gray-700">
                <span className="text-sm text-gray-600 dark:text-gray-400">Total Amount</span>
                <span className="text-xl font-bold text-brand-600 dark:text-brand-400">₹{totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Simple Interest</span>
                <span className="font-semibold text-green-600 dark:text-green-400">₹{simpleInterest.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}

        <div className="rounded-lg bg-blue-50 p-4 text-xs text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">
          <strong>Formula:</strong> SI = P × R × T / 100, where P = Principal, R = Annual rate, T = Time in years.
        </div>
      </div>
    </div>
  );
}
