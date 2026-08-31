'use client';

import { useState } from 'react';

export function GratuityCalculatorTool() {
  const [basic, setBasic] = useState('');
  const [da, setDa] = useState('');
  const [years, setYears] = useState('');
  const [months, setMonths] = useState('');

  const numBasic = parseFloat(basic) || 0;
  const numDa = parseFloat(da) || 0;
  const numYears = parseFloat(years) || 0;
  const numMonths = parseFloat(months) || 0;

  const lastDrawnSalary = numBasic + numDa;
  const totalServiceYears = numYears + numMonths / 12;

  // Gratuity = (last drawn salary × 15 × completed years of service) / 26
  const gratuity = (lastDrawnSalary * 15 * totalServiceYears) / 26;

  // Gratuity exemption under Section 10(10): max of
  // - 15 days salary per completed year (computed above)
  // - Metallic 20 lakh (exempt as of FY 2024-25, changed from earlier)
  const exemption = Math.min(gratuity, 2000000);

  return (
    <div className="card">
      <div className="space-y-6">
        <div>
          <label className="label">Last Drawn Basic Salary (₹/month)</label>
          <input
            type="number"
            value={basic}
            onChange={(e) => setBasic(e.target.value)}
            placeholder="e.g. 50000"
            className="input mt-1"
            min="0"
          />
        </div>

        <div>
          <label className="label">Dearness Allowance (DA) — if any (₹/month)</label>
          <input
            type="number"
            value={da}
            onChange={(e) => setDa(e.target.value)}
            placeholder="e.g. 10000"
            className="input mt-1"
            min="0"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Completed Years of Service</label>
            <input
              type="number"
              value={years}
              onChange={(e) => setYears(e.target.value)}
              placeholder="e.g. 10"
              className="input mt-1"
              min="0"
            />
          </div>
          <div>
            <label className="label">Additional Months</label>
            <input
              type="number"
              value={months}
              onChange={(e) => setMonths(e.target.value)}
              placeholder="e.g. 6"
              className="input mt-1"
              min="0"
              max="11"
            />
          </div>
        </div>

        <div className="rounded-xl bg-gray-50 p-5 dark:bg-gray-800/50">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Gratuity Estimate</h3>
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Last Drawn Salary</span>
              <span className="font-semibold text-gray-900 dark:text-white">₹{lastDrawnSalary.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Service (years)</span>
              <span className="font-semibold text-gray-900 dark:text-white">{totalServiceYears.toFixed(2)} years</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Gratuity Amount</span>
              <span className="text-lg font-bold text-brand-600 dark:text-brand-400">₹{gratuity.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
            </div>
            <div className="flex items-center justify-between border-t border-gray-200 pt-3 dark:border-gray-700">
              <span className="text-sm text-gray-600 dark:text-gray-400">Tax Exempt (Sec 10(10))</span>
              <span className="font-semibold text-green-600 dark:text-green-400">₹{exemption.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Taxable Gratuity</span>
              <span className="font-semibold text-gray-900 dark:text-white">₹{Math.max(0, gratuity - exemption).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-blue-50 p-4 text-xs text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">
          <strong>Formula:</strong> Gratuity = (Last drawn salary × 15 × Completed years of service) / 26.
          Eligible after 5 years of continuous service. Exemption capped at ₹20 lakh under Section 10(10).
        </div>
      </div>
    </div>
  );
}
