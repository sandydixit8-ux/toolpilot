'use client';

import { useState } from 'react';

export function CgpaToPercentageTool() {
  const [cgpa, setCgpa] = useState('');

  const c = parseFloat(cgpa);
  const isValid = !isNaN(c) && c >= 0 && c <= 10;

  const cbse = isValid ? Math.min(c * 9.5, 100) : 0;
  const simple = isValid ? (c / 10) * 100 : 0;

  const gradeOf = (v: number) => {
    if (v >= 9) return { grade: 'A+', remark: 'Outstanding' };
    if (v >= 8) return { grade: 'A', remark: 'Excellent' };
    if (v >= 7) return { grade: 'B+', remark: 'Very Good' };
    if (v >= 6) return { grade: 'B', remark: 'Good' };
    if (v >= 5) return { grade: 'C', remark: 'Average' };
    return { grade: 'D', remark: 'Below Average' };
  };

  return (
    <div className="card">
      <div className="space-y-6">
        <div>
          <label className="label">Your CGPA (0 - 10)</label>
          <input
            type="number"
            min="0"
            max="10"
            step="0.01"
            value={cgpa}
            onChange={(e) => setCgpa(e.target.value)}
            placeholder="e.g. 8.6"
            className="input mt-1"
          />
        </div>

        {isValid && (
          <div className="rounded-xl bg-gray-50 p-5 dark:bg-gray-800/50">
            <div className="flex items-baseline justify-between">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Approx. Percentage</h3>
              <span className="inline-flex items-center rounded-full bg-brand-600/10 px-3 py-1 text-sm font-bold text-brand-600 dark:text-brand-400">
                {gradeOf(c).grade} · {gradeOf(c).remark}
              </span>
            </div>
            <p className="mt-2 text-3xl font-bold text-brand-600 dark:text-brand-400">{cbse.toFixed(2)}%</p>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              CBSE formula (CGPA × 9.5). On the 10-point scale that gives{' '}
              <span className="font-medium text-gray-700 dark:text-gray-300">{simple.toFixed(2)}%</span>.
            </p>

            <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
              {[
                { label: 'CGPA', value: c.toFixed(2) },
                { label: 'CBSE % (×9.5)', value: `${cbse.toFixed(2)}%` },
                { label: 'Grade', value: gradeOf(c).grade },
                { label: 'Remark', value: gradeOf(c).remark },
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
          <strong>Note:</strong> Many Indian boards (CBSE, ICSE) and universities use their own conversion
          formula. The ×9.5 CBSE rule is an approximation — always check your board/university&apos;s official
          conversion table before applying.
        </div>
      </div>
    </div>
  );
}