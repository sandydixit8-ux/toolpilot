'use client';

import { useState } from 'react';

const OLD_STANDARD_DEDUCTION = 50000;
const NEW_STANDARD_DEDUCTION = 75000;
const CESS_RATE = 0.04;

const formatINR = (value: number) =>
  '₹' + new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(Math.round(value));

function calculateNewRegimeTax(taxable: number) {
  let slabTax = 0;
  if (taxable > 1500000) slabTax = 140000 + (taxable - 1500000) * 0.3;
  else if (taxable > 1200000) slabTax = 80000 + (taxable - 1200000) * 0.2;
  else if (taxable > 1000000) slabTax = 50000 + (taxable - 1000000) * 0.15;
  else if (taxable > 700000) slabTax = 20000 + (taxable - 700000) * 0.1;
  else if (taxable > 300000) slabTax = (taxable - 300000) * 0.05;

  const rebate = taxable <= 700000 ? slabTax : 0;
  const afterRebate = slabTax - rebate;
  const cess = afterRebate * CESS_RATE;
  return { slabTax, rebate, cess, total: afterRebate + cess };
}

function calculateOldRegimeTax(taxable: number) {
  let slabTax = 0;
  if (taxable > 1000000) slabTax = 112500 + (taxable - 1000000) * 0.3;
  else if (taxable > 500000) slabTax = 12500 + (taxable - 500000) * 0.2;
  else if (taxable > 250000) slabTax = (taxable - 250000) * 0.05;

  const rebate = taxable <= 500000 ? slabTax : 0;
  const afterRebate = slabTax - rebate;
  const cess = afterRebate * CESS_RATE;
  return { slabTax, rebate, cess, total: afterRebate + cess };
}

export function IncomeTaxCalculatorTool() {
  const [income, setIncome] = useState('');
  const [deductions, setDeductions] = useState('');
  const [regime, setRegime] = useState<'new' | 'old'>('new');

  const annualIncome = parseFloat(income) || 0;
  const claimedDeductions = parseFloat(deductions) || 0;

  const newTaxable = Math.max(0, annualIncome - NEW_STANDARD_DEDUCTION);
  const oldTaxable = Math.max(0, annualIncome - OLD_STANDARD_DEDUCTION - claimedDeductions);

  const newResult = calculateNewRegimeTax(newTaxable);
  const oldResult = calculateOldRegimeTax(oldTaxable);

  const better = oldResult.total < newResult.total ? 'old' : 'new';
  const savings = Math.abs(oldResult.total - newResult.total);

  const oldEffectiveRate = annualIncome > 0 ? ((oldResult.total / annualIncome) * 100).toFixed(2) : '0.00';
  const newEffectiveRate = annualIncome > 0 ? ((newResult.total / annualIncome) * 100).toFixed(2) : '0.00';

  const rows: { label: string; old: string; new: string; strong?: boolean; better?: 'old' | 'new' | null }[] = [
    { label: 'Gross Annual Income', old: formatINR(annualIncome), new: formatINR(annualIncome) },
    {
      label: 'Standard Deduction',
      old: `− ${formatINR(OLD_STANDARD_DEDUCTION)}`,
      new: `− ${formatINR(NEW_STANDARD_DEDUCTION)}`,
    },
    {
      label: 'Other Deductions (80C, 80D, HRA)',
      old: claimedDeductions > 0 ? `− ${formatINR(claimedDeductions)}` : '—',
      new: 'Not allowed',
    },
    { label: 'Taxable Income', old: formatINR(oldTaxable), new: formatINR(newTaxable), strong: true },
    { label: 'Tax as per Slabs', old: formatINR(oldResult.slabTax), new: formatINR(newResult.slabTax) },
    {
      label: 'Section 87A Rebate',
      old: oldResult.rebate > 0 ? `− ${formatINR(oldResult.rebate)}` : '—',
      new: newResult.rebate > 0 ? `− ${formatINR(newResult.rebate)}` : '—',
    },
    { label: 'Health & Education Cess (4%)', old: formatINR(oldResult.cess), new: formatINR(newResult.cess) },
    {
      label: 'Total Tax Payable',
      old: formatINR(oldResult.total),
      new: formatINR(newResult.total),
      strong: true,
      better: oldResult.total < newResult.total ? 'old' : newResult.total < oldResult.total ? 'new' : null,
    },
    {
      label: 'Effective Tax Rate',
      old: `${oldEffectiveRate}%`,
      new: `${newEffectiveRate}%`,
      better: parseFloat(oldEffectiveRate) < parseFloat(newEffectiveRate) ? 'old' : parseFloat(newEffectiveRate) < parseFloat(oldEffectiveRate) ? 'new' : null,
    },
    {
      label: 'Take-Home Income',
      old: formatINR(annualIncome - oldResult.total),
      new: formatINR(annualIncome - newResult.total),
      strong: true,
      better,
    },
  ];

  return (
    <div className="card">
      <div className="space-y-6">
        <div>
          <label className="label">Annual Income (₹)</label>
          <input type="number" value={income} onChange={(e) => setIncome(e.target.value)} placeholder="e.g. 1200000" className="input mt-1" min="0" />
        </div>
        <div>
          <label className="label">Tax Regime</label>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <button onClick={() => setRegime('new')} className={`rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${regime === 'new' ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300'}`}>New Regime (Default)</button>
            <button onClick={() => setRegime('old')} className={`rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${regime === 'old' ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300'}`}>Old Regime</button>
          </div>
        </div>
        {regime === 'old' && (
          <div>
            <label className="label">Total Deductions (₹)</label>
            <input type="number" value={deductions} onChange={(e) => setDeductions(e.target.value)} placeholder="80C + 80D + HRA + etc." className="input mt-1" min="0" />
            <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">Applicable to Old Regime only. New Regime does not allow these deductions.</p>
          </div>
        )}

        {annualIncome > 0 && (
          <div className="rounded-xl bg-gray-50 p-5 dark:bg-gray-800/50">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Old vs New Regime — FY 2024-25</h3>

            <div className={`mt-4 rounded-lg p-3 text-sm font-medium ${savings === 0 ? 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300' : better === 'new' ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300' : 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300'}`}>
              {savings === 0
                ? 'Both regimes result in the same tax.'
                : `${better === 'new' ? 'New' : 'Old'} Regime is better for you — save ${formatINR(savings)} in tax.`}
            </div>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="pb-2 text-left font-semibold text-gray-600 dark:text-gray-400">Particulars</th>
                    <th className={`pb-2 text-right font-semibold ${regime === 'old' ? 'text-brand-600 dark:text-brand-400' : 'text-gray-600 dark:text-gray-400'}`}>Old Regime</th>
                    <th className={`pb-2 text-right font-semibold ${regime === 'new' ? 'text-brand-600 dark:text-brand-400' : 'text-gray-600 dark:text-gray-400'}`}>New Regime</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.label} className="border-b border-gray-200 last:border-b-0 dark:border-gray-700">
                      <td className={`py-2 pr-2 ${row.strong ? 'font-semibold text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>{row.label}</td>
                      <td className={`py-2 pl-2 text-right tabular-nums ${row.better === 'old' ? 'font-semibold text-green-600 dark:text-green-400' : row.strong ? 'font-semibold text-gray-900 dark:text-white' : 'text-gray-900 dark:text-gray-200'}`}>{row.old}</td>
                      <td className={`py-2 pl-2 text-right tabular-nums ${row.better === 'new' ? 'font-semibold text-green-600 dark:text-green-400' : row.strong ? 'font-semibold text-gray-900 dark:text-white' : 'text-gray-900 dark:text-gray-200'}`}>{row.new}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">
              Section 87A rebate makes tax nil for taxable income up to ₹5,00,000 (Old Regime) or ₹7,00,000 (New Regime).
            </p>
          </div>
        )}

        <div className="rounded-lg bg-blue-50 p-4 text-xs text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">
          This calculator provides estimates for FY 2024-25. Please consult a tax professional for actual tax planning.
        </div>
      </div>
    </div>
  );
}
