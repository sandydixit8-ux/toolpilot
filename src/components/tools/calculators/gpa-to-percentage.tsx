'use client';

import { useState } from 'react';

export function GpaToPercentageTool() {
  const [gpa, setGpa] = useState('');
  const [scale, setScale] = useState<'10' | '4'>('10');

  const g = parseFloat(gpa);
  const max = parseInt(scale, 10);
  const isValid = !isNaN(g) && g >= 0 && g <= max;

  const percentage = isValid ? (g / max) * 100 : 0;

  return (
    <div className="card">
      <div className="space-y-6">
        <div>
          <label className="label">GPA Scale</label>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {(['10', '4'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setScale(s)}
                className={`rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  scale === s
                    ? 'bg-brand-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300'
                }`}
              >
                {s}-point scale
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="label">Your GPA (0 - {max})</label>
          <input
            type="number"
            min="0"
            max={max}
            step="0.01"
            value={gpa}
            onChange={(e) => setGpa(e.target.value)}
            placeholder={scale === '10' ? 'e.g. 8.7' : 'e.g. 3.6'}
            className="input mt-1"
          />
        </div>

        {isValid && (
          <div className="rounded-xl bg-gray-50 p-5 dark:bg-gray-800/50">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Equivalent Percentage</h3>
            <p className="mt-2 text-3xl font-bold text-brand-600 dark:text-brand-400">
              {percentage.toFixed(2)}%
            </p>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              ({g.toFixed(2)} / {max} × 100). This follows the standard proportional conversion.
            </p>

            <div className="mt-4 grid grid-cols-2 gap-3">
              {[
                { label: 'Percentage', value: `${percentage.toFixed(2)}%` },
                { label: 'Out of', value: `${max} points` },
                { label: 'GPA', value: g.toFixed(2) },
                { label: 'Class', value: percentage >= 80 ? 'Distinction' : percentage >= 60 ? 'First Class' : percentage >= 50 ? 'Second Class' : 'Pass' },
              ].map((item) => (
                <div key={item.label} className="rounded-lg bg-white p-3 text-center shadow-sm dark:bg-gray-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400">{item.label}</p>
                  <p className="mt-1 font-semibold text-gray-900 dark:text-white">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-800/40 dark:bg-amber-900/20 dark:text-amber-200">
          <strong>Note:</strong> Different universities convert GPA to percentage differently (some use a
          weighted table, not a simple ratio). Use this as an estimate and verify your institute&apos;s
          official conversion formula.
        </div>
      </div>
    </div>
  );
}