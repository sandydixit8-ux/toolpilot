'use client';

import { useState } from 'react';

export function SalaryCalculatorTool() {
  const [ctc, setCtc] = useState('');
  const [basicPct, setBasicPct] = useState('50');
  const [regime, setRegime] = useState('new');

  const annualCtc = parseFloat(ctc) || 0;
  const basicPercent = parseFloat(basicPct) || 50;

  const annualBasic = annualCtc * (basicPercent / 100);
  const pf = Math.min(annualBasic, 180000) * 0.12;
  const esi = annualCtc <= 210000 ? annualCtc * 0.0075 : 0;
  const profTax = 2400;

  let incomeTax = 0;
  if (regime === 'new') {
    const taxableIncome = annualCtc - pf - profTax;
    if (taxableIncome > 300000) incomeTax += Math.min(taxableIncome - 300000, 300000) * 0.05;
    if (taxableIncome > 600000) incomeTax += Math.min(taxableIncome - 600000, 300000) * 0.10;
    if (taxableIncome > 900000) incomeTax += Math.min(taxableIncome - 900000, 300000) * 0.15;
    if (taxableIncome > 1200000) incomeTax += Math.min(taxableIncome - 1200000, 300000) * 0.20;
    if (taxableIncome > 1500000) incomeTax += (taxableIncome - 1500000) * 0.30;
  } else {
    const taxableIncome = annualCtc - pf - profTax - 50000;
    if (taxableIncome > 0 && taxableIncome <= 250000) incomeTax = 0;
    else if (taxableIncome > 250000) incomeTax = Math.min(taxableIncome - 250000, 250000) * 0.05;
    if (taxableIncome > 500000) incomeTax += Math.min(taxableIncome - 500000, 500000) * 0.20;
    if (taxableIncome > 1000000) incomeTax += (taxableIncome - 1000000) * 0.30;
  }

  const totalDeductions = pf + esi + profTax + incomeTax;
  const annualInHand = annualCtc - totalDeductions;
  const monthlyInHand = annualInHand / 12;

  return (
    <div className="card">
      <div className="space-y-6">
        <div>
          <label className="label">Annual CTC (₹)</label>
          <input type="number" value={ctc} onChange={(e) => setCtc(e.target.value)} placeholder="e.g. 1200000" className="input mt-1" min="0" />
        </div>
        <div>
          <label className="label">Basic Salary (%)</label>
          <input type="number" value={basicPct} onChange={(e) => setBasicPct(e.target.value)} className="input mt-1" min="0" max="100" />
        </div>
        <div>
          <label className="label">Tax Regime</label>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <button onClick={() => setRegime('new')} className={`rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${regime === 'new' ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'}`}>New Regime</button>
            <button onClick={() => setRegime('old')} className={`rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${regime === 'old' ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'}`}>Old Regime</button>
          </div>
        </div>

        {annualCtc > 0 && (
          <div className="rounded-xl bg-gray-50 p-5 dark:bg-gray-800/50">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Salary Breakdown</h3>
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Monthly In-Hand</span>
                <span className="text-xl font-bold text-brand-600 dark:text-brand-400">₹{monthlyInHand.toFixed(0)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Annual In-Hand</span>
                <span className="font-semibold text-gray-900 dark:text-white">₹{annualInHand.toFixed(0)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Employee PF</span>
                <span className="text-sm text-orange-600 dark:text-orange-400">-₹{pf.toFixed(0)}</span>
              </div>
              {esi > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">ESI</span>
                  <span className="text-sm text-orange-600 dark:text-orange-400">-₹{esi.toFixed(0)}</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Professional Tax</span>
                <span className="text-sm text-orange-600 dark:text-orange-400">-₹{profTax}</span>
              </div>
              {incomeTax > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Income Tax</span>
                  <span className="text-sm text-orange-600 dark:text-orange-400">-₹{incomeTax.toFixed(0)}</span>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="rounded-lg bg-blue-50 p-4 text-xs text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">
          This calculator provides estimates based on standard deductions. Actual salary may vary based on company policies, additional deductions, and investment declarations.
        </div>
      </div>
    </div>
  );
}
