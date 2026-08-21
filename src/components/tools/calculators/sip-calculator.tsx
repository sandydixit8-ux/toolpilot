'use client';

import { useState } from 'react';

export function SipCalculatorTool() {
  const [monthly, setMonthly] = useState('');
  const [rate, setRate] = useState('12');
  const [years, setYears] = useState('10');

  const P = parseFloat(monthly) || 0;
  const r = (parseFloat(rate) || 0) / 100 / 12;
  const n = (parseInt(years) || 0) * 12;

  const maturity = P && r && n ? P * ((Math.pow(1 + r, n) - 1) / r) * (1 + r) : P * n;
  const invested = P * n;
  const returns = maturity - invested;

  return (
    <div className="card">
      <div className="space-y-6">
        <div>
          <label className="label">Monthly SIP Amount (₹)</label>
          <input type="number" value={monthly} onChange={(e) => setMonthly(e.target.value)} placeholder="e.g. 5000" className="input mt-1" min="0" />
        </div>
        <div>
          <label className="label">Expected Annual Return (%)</label>
          <input type="number" value={rate} onChange={(e) => setRate(e.target.value)} className="input mt-1" min="0" max="50" step="0.5" />
        </div>
        <div>
          <label className="label">Investment Duration (years)</label>
          <input type="number" value={years} onChange={(e) => setYears(e.target.value)} className="input mt-1" min="0" max="50" />
        </div>

        {P > 0 && n > 0 && (
          <div className="rounded-xl bg-gray-50 p-5 dark:bg-gray-800/50">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Investment Summary</h3>
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between border-b border-gray-200 pb-3 dark:border-gray-700">
                <span className="text-sm text-gray-600 dark:text-gray-400">Maturity Value</span>
                <span className="text-xl font-bold text-brand-600 dark:text-brand-400">₹{maturity.toFixed(0)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Total Invested</span>
                <span className="font-semibold text-gray-900 dark:text-white">₹{invested.toFixed(0)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Estimated Returns</span>
                <span className="font-semibold text-green-600 dark:text-green-400">₹{returns.toFixed(0)}</span>
              </div>
            </div>
          </div>
        )}

        <div className="rounded-lg bg-blue-50 p-4 text-xs text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">
          SIP returns are estimated based on a fixed rate. Actual mutual fund returns vary and are not guaranteed.
        </div>
      </div>
    </div>
  );
}
