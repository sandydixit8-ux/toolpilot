'use client';

import { useState } from 'react';

export function AttendanceCalculatorTool() {
  const [total, setTotal] = useState('');
  const [attended, setAttended] = useState('');
  const [target, setTarget] = useState('75');

  const T = parseFloat(total) || 0;
  const A = parseFloat(attended) || 0;
  const g = parseFloat(target) || 75;

  const currentPct = T > 0 ? (A / T) * 100 : 0;
  const valid = T > 0 && A <= T;

  // Classes you can still skip while keep >= g%: needed = ceil(g*T/100 - A)? 
  // If A < target: need N more classes such that (A+N)/(T+N) >= g/100
  let canMiss = 0;
  let need = 0;
  if (valid && g > 0 && g <= 100) {
    if (currentPct >= g && g < 100) {
      // max skips so that (A)/(T+skip) >= g/100 -> skip <= (100A/g - T)
      canMiss = Math.floor((A * 100) / g - T);
      if (canMiss < 0) canMiss = 0;
    } else if (g < 100) {
      need = Math.ceil((g * T - 100 * A) / (100 - g));
      if (need < 0) need = 0;
    } else {
      need = g * T - 100 * A <= 0 ? 0 : Math.ceil((g * T - 100 * A) / (100 - g));
    }
  }

  const status =
    !valid
      ? 'neutral'
      : currentPct >= g
        ? 'safe'
        : 'risk';

  return (
    <div className="card">
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="label">Total Classes</label>
            <input type="number" min="0" value={total} onChange={(e) => setTotal(e.target.value)} placeholder="e.g. 60" className="input mt-1" />
          </div>
          <div>
            <label className="label">Classes Attended</label>
            <input type="number" min="0" value={attended} onChange={(e) => setAttended(e.target.value)} placeholder="e.g. 45" className="input mt-1" />
          </div>
        </div>
        <div>
          <label className="label">Required Attendance (%)</label>
          <div className="mt-2 grid grid-cols-4 gap-2">
            {[75, 80, 85, 90].map((p) => (
              <button
                key={p}
                onClick={() => setTarget(String(p))}
                className={`rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  Number(target) === p
                    ? 'bg-brand-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300'
                }`}
              >
                {p}%
              </button>
            ))}
          </div>
        </div>

        {valid && g > 0 && (
          <div
            className={`rounded-xl p-5 ${
              status === 'safe'
                ? 'bg-emerald-50 dark:bg-emerald-900/20'
                : status === 'risk'
                  ? 'bg-red-50 dark:bg-red-900/20'
                  : 'bg-gray-50 dark:bg-gray-800/50'
            }`}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Current Attendance</h3>
              <span
                className={`rounded-full px-3 py-1 text-sm font-bold ${
                  status === 'safe'
                    ? 'bg-emerald-600/10 text-emerald-700 dark:text-emerald-400'
                    : status === 'risk'
                      ? 'bg-red-600/10 text-red-700 dark:text-red-400'
                      : 'bg-gray-600/10 text-gray-700 dark:text-gray-300'
                }`}
              >
                {status === 'safe' ? 'On Track' : status === 'risk' ? 'Below Target' : '—'}
              </span>
            </div>
            <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{currentPct.toFixed(2)}%</p>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {A} of {T} classes attended, target {g}%.
            </p>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-lg bg-white p-4 text-center shadow-sm dark:bg-gray-700">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {currentPct >= g ? 'Classes you can still miss' : 'Classes you must attend'}
                </p>
                <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
                  {currentPct >= g ? canMiss : need}
                </p>
              </div>
              <div className="rounded-lg bg-white p-4 text-center shadow-sm dark:bg-gray-700">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {currentPct >= g ? 'Miss one more and you fall below' : 'Each class you miss now adds'}
                </p>
                <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
                  {currentPct >= g ? `1 class of ${g}%` : 'to the shortfall'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}