'use client';

import { useState } from 'react';

export function SalaryCalculatorCareerTool() {
  const [currentSalary, setCurrentSalary] = useState('');
  const [hikePercent, setHikePercent] = useState('');
  const [showBreakdown, setShowBreakdown] = useState(false);

  const current = parseFloat(currentSalary) || 0;
  const hike = parseFloat(hikePercent) || 0;

  const newSalary = current + current * (hike / 100);
  const hikeAmount = current * (hike / 100);
  const monthlyNew = newSalary / 12;

  const pfCurrent = Math.min(current * 0.5, 180000) * 0.12;
  const pfNew = Math.min(newSalary * 0.5, 180000) * 0.12;
  const esiCurrent = current <= 210000 ? current * 0.0075 : 0;
  const esiNew = newSalary <= 210000 ? newSalary * 0.0075 : 0;

  const inHandCurrent = current - pfCurrent - esiCurrent - 2400;
  const inHandNew = newSalary - pfNew - esiNew - 2400;

  return (
    <div className="card">
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="label">Current Annual Salary (₹)</label>
            <input type="number" value={currentSalary} onChange={(e) => setCurrentSalary(e.target.value)} placeholder="e.g. 800000" className="input mt-1" min="0" />
          </div>
          <div>
            <label className="label">Expected Hike (%)</label>
            <input type="number" value={hikePercent} onChange={(e) => setHikePercent(e.target.value)} placeholder="e.g. 20" className="input mt-1" min="0" max="200" />
          </div>
        </div>

        {current > 0 && hike > 0 && (
          <div className="space-y-4">
            <div className="rounded-xl bg-gray-50 p-5 dark:bg-gray-800/50">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">New Salary</h3>
              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">New Annual CTC</span>
                  <span className="text-xl font-bold text-green-600 dark:text-green-400">₹{newSalary.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Hike Amount</span>
                  <span className="font-semibold text-green-600 dark:text-green-400">+₹{hikeAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">New Monthly CTC</span>
                  <span className="font-semibold text-gray-900 dark:text-white">₹{monthlyNew.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                </div>
              </div>
            </div>

            <button onClick={() => setShowBreakdown(!showBreakdown)} className="text-sm font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400">
              {showBreakdown ? 'Hide' : 'Show'} CTC Breakdown ↓
            </button>

            {showBreakdown && (
              <div className="rounded-xl bg-gray-50 p-5 dark:bg-gray-800/50">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Detailed Comparison</h3>
                <div className="mt-4 space-y-3">
                  {[
                    { label: 'Monthly In-Hand (Current)', value: `₹${(inHandCurrent / 12).toFixed(0)}` },
                    { label: 'Monthly In-Hand (New)', value: `₹${(inHandNew / 12).toFixed(0)}`, highlight: true },
                    { label: 'Annual In-Hand (Current)', value: `₹${inHandCurrent.toFixed(0)}` },
                    { label: 'Annual In-Hand (New)', value: `₹${inHandNew.toFixed(0)}`, highlight: true },
                    { label: 'PF (Current)', value: `-₹${pfCurrent.toFixed(0)}` },
                    { label: 'PF (New)', value: `-₹${pfNew.toFixed(0)}` },
                    { label: 'Monthly Hike', value: `+₹${(hikeAmount / 12).toFixed(0)}`, highlight: true },
                  ].map((row) => (
                    <div key={row.label} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">{row.label}</span>
                      <span className={`text-sm font-medium ${row.highlight ? 'text-green-600 dark:text-green-400' : 'text-gray-900 dark:text-white'}`}>{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="rounded-lg bg-blue-50 p-4 text-xs text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">
          This is an estimate based on standard Indian salary structures. Actual in-hand may vary based on company policies, tax declarations, and investment proofs.
        </div>
      </div>
    </div>
  );
}
