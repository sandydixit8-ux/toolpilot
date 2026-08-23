'use client';

import { useState } from 'react';

const STANDARD_DEDUCTION_NEW = 75000;
const STANDARD_DEDUCTION_OLD = 50000;
const REBATE_LIMIT_NEW = 700000;
const REBATE_LIMIT_OLD = 500000;
const ESI_ANNUAL_WAGE_LIMIT = 252000;
const PROF_TAX = 2400;
const PF_RATE = 0.12;
const PF_BASIC_CAP = 180000;
const ESI_RATE = 0.0075;
const CESS_RATE = 0.04;

type Regime = 'new' | 'old';

const TAX_SLABS: Record<Regime, Array<{ upto: number; rate: number }>> = {
  new: [
    { upto: 300000, rate: 0 },
    { upto: 700000, rate: 0.05 },
    { upto: 1000000, rate: 0.1 },
    { upto: 1200000, rate: 0.15 },
    { upto: 1500000, rate: 0.2 },
    { upto: Infinity, rate: 0.3 },
  ],
  old: [
    { upto: 250000, rate: 0 },
    { upto: 500000, rate: 0.05 },
    { upto: 1000000, rate: 0.2 },
    { upto: Infinity, rate: 0.3 },
  ],
};

function calculateTaxBeforeRebate(taxableIncome: number, regime: Regime): number {
  let tax = 0;
  let previousLimit = 0;
  for (const slab of TAX_SLABS[regime]) {
    if (taxableIncome <= previousLimit) break;
    tax += (Math.min(taxableIncome, slab.upto) - previousLimit) * slab.rate;
    previousLimit = slab.upto;
  }
  return tax;
}

const formatINR = (value: number): string =>
  new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(Math.round(value));

export function SalaryCalculatorTool() {
  const [ctc, setCtc] = useState('');
  const [basicPct, setBasicPct] = useState('50');
  const [regime, setRegime] = useState<Regime>('new');

  const annualCtc = parseFloat(ctc) || 0;
  const basicPercent = Math.max(0, Math.min(100, parseFloat(basicPct) || 50));

  const annualBasic = annualCtc * (basicPercent / 100);
  const pf = Math.min(annualBasic, PF_BASIC_CAP) * PF_RATE;
  const esiApplicable = annualCtc > 0 && annualCtc <= ESI_ANNUAL_WAGE_LIMIT;
  const esi = esiApplicable ? annualCtc * ESI_RATE : 0;

  const standardDeduction = regime === 'new' ? STANDARD_DEDUCTION_NEW : STANDARD_DEDUCTION_OLD;
  const taxableIncome = Math.max(
    0,
    annualCtc - standardDeduction - (regime === 'old' ? PROF_TAX : 0)
  );

  const taxBeforeRebate = calculateTaxBeforeRebate(taxableIncome, regime);
  const rebateEligible =
    regime === 'new' ? taxableIncome <= REBATE_LIMIT_NEW : taxableIncome <= REBATE_LIMIT_OLD;
  const baseTax = rebateEligible ? 0 : taxBeforeRebate;
  const cess = baseTax * CESS_RATE;
  const totalIncomeTax = baseTax + cess;

  const totalDeductions = pf + esi + PROF_TAX + totalIncomeTax;
  const annualInHand = annualCtc - totalDeductions;
  const monthlyInHand = annualInHand / 12;
  const effectiveTaxRate = annualCtc > 0 ? (totalIncomeTax / annualCtc) * 100 : 0;

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
                <span className="text-xl font-bold text-brand-600 dark:text-brand-400">₹{formatINR(monthlyInHand)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Annual In-Hand</span>
                <span className="font-semibold text-gray-900 dark:text-white">₹{formatINR(annualInHand)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Employee PF</span>
                <span className="text-sm text-orange-600 dark:text-orange-400">-₹{formatINR(pf)}</span>
              </div>
              {esiApplicable && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">ESI</span>
                  <span className="text-sm text-orange-600 dark:text-orange-400">-₹{formatINR(esi)}</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Professional Tax</span>
                <span className="text-sm text-orange-600 dark:text-orange-400">-₹{formatINR(PROF_TAX)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Income Tax{rebateEligible && taxBeforeRebate > 0 ? ' (87A Rebate)' : ''}</span>
                <span className="text-sm text-orange-600 dark:text-orange-400">-₹{formatINR(totalIncomeTax)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Health &amp; Education Cess (4%)</span>
                <span className="text-sm text-orange-600 dark:text-orange-400">-₹{formatINR(cess)}</span>
              </div>
              <div className="flex items-center justify-between border-t border-gray-200 pt-3 dark:border-gray-700">
                <span className="text-sm text-gray-600 dark:text-gray-400">Effective Tax Rate</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">{effectiveTaxRate.toFixed(2)}%</span>
              </div>
            </div>
          </div>
        )}

        <div className="rounded-lg bg-blue-50 p-4 text-xs text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">
          This calculator provides estimates for FY 2024-25. Actual salary may vary based on company policies, additional deductions, and investment declarations.
        </div>
      </div>
    </div>
  );
}
