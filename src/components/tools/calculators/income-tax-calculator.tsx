'use client';

import { useState } from 'react';

export function IncomeTaxCalculatorTool() {
  const [income, setIncome] = useState('');
  const [deductions, setDeductions] = useState('');
  const [regime, setRegime] = useState('new');

  const annualIncome = parseFloat(income) || 0;
  const totalDeductions = parseFloat(deductions) || 0;

  let oldTax = 0;
  let newTax = 0;

  if (annualIncome > 0) {
    const oldTaxable = Math.max(0, annualIncome - totalDeductions - 50000);
    if (oldTaxable <= 250000) oldTax = 0;
    else if (oldTaxable <= 500000) oldTax = (oldTaxable - 250000) * 0.05;
    else if (oldTaxable <= 1000000) oldTax = 12500 + (oldTaxable - 500000) * 0.20;
    else oldTax = 112500 + (oldTaxable - 1000000) * 0.30;

    const newTaxable = annualIncome;
    if (newTaxable <= 300000) newTax = 0;
    else if (newTaxable <= 600000) newTax = (newTaxable - 300000) * 0.05;
    else if (newTaxable <= 900000) newTax = 15000 + (newTaxable - 600000) * 0.10;
    else if (newTaxable <= 1200000) newTax = 45000 + (newTaxable - 900000) * 0.15;
    else if (newTaxable <= 1500000) newTax = 90000 + (newTaxable - 1200000) * 0.20;
    else newTax = 150000 + (newTaxable - 1500000) * 0.30;
  }

  const displayTax = regime === 'new' ? newTax : oldTax;
  const effectiveRate = annualIncome > 0 ? ((displayTax / annualIncome) * 100).toFixed(2) : '0';
  const takeHome = annualIncome - displayTax - 2400;

  return (
    <div className="card">
      <div className="space-y-6">
        <div>
          <label className="label">Annual Income (₹)</label>
          <input type="number" value={income} onChange={(e) => setIncome(e.target.value)} placeholder="e.g. 1200000" className="input mt-1" min="0" />
        </div>
        {regime === 'old' && (
          <div>
            <label className="label">Total Deductions (₹)</label>
            <input type="number" value={deductions} onChange={(e) => setDeductions(e.target.value)} placeholder="80C + 80D + HRA + etc." className="input mt-1" min="0" />
          </div>
        )}
        <div>
          <label className="label">Tax Regime</label>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <button onClick={() => setRegime('new')} className={`rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${regime === 'new' ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300'}`}>New Regime (Default)</button>
            <button onClick={() => setRegime('old')} className={`rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${regime === 'old' ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300'}`}>Old Regime</button>
          </div>
        </div>

        {annualIncome > 0 && (
          <div className="rounded-xl bg-gray-50 p-5 dark:bg-gray-800/50">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Tax Calculation</h3>
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between border-b border-gray-200 pb-3 dark:border-gray-700">
                <span className="text-sm text-gray-600 dark:text-gray-400">Tax Payable ({regime === 'new' ? 'New' : 'Old'} Regime)</span>
                <span className="text-xl font-bold text-brand-600 dark:text-brand-400">₹{displayTax.toFixed(0)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Effective Tax Rate</span>
                <span className="font-semibold text-gray-900 dark:text-white">{effectiveRate}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Estimated Take-Home</span>
                <span className="font-semibold text-green-600 dark:text-green-400">₹{takeHome.toFixed(0)}</span>
              </div>
              <div className="mt-2 flex items-center justify-between rounded-lg bg-white p-3 dark:bg-gray-900">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Old Regime Tax</span>
                <span className={`text-sm font-semibold ${oldTax <= newTax ? 'text-green-600 dark:text-green-400' : 'text-gray-900 dark:text-white'}`}>₹{oldTax.toFixed(0)} {oldTax <= newTax ? '(Better)' : ''}</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-white p-3 dark:bg-gray-900">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">New Regime Tax</span>
                <span className={`text-sm font-semibold ${newTax <= oldTax ? 'text-green-600 dark:text-green-400' : 'text-gray-900 dark:text-white'}`}>₹{newTax.toFixed(0)} {newTax <= oldTax ? '(Better)' : ''}</span>
              </div>
            </div>
          </div>
        )}

        <div className="rounded-lg bg-blue-50 p-4 text-xs text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">
          Tax calculations are based on FY 2024-25 slabs. This is an estimate only. Please consult a tax professional for actual tax planning.
        </div>
      </div>
    </div>
  );
}
