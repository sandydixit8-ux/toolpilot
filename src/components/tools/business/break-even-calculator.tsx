'use client';

import { useState } from 'react';

export function BreakEvenCalculatorTool() {
  const [fixedCosts, setFixedCosts] = useState('');
  const [variableCostPerUnit, setVariableCostPerUnit] = useState('');
  const [sellingPricePerUnit, setSellingPricePerUnit] = useState('');

  const fixed = parseFloat(fixedCosts) || 0;
  const variable = parseFloat(variableCostPerUnit) || 0;
  const selling = parseFloat(sellingPricePerUnit) || 0;

  const contributionMargin = selling - variable;
  const breakEvenUnits = contributionMargin > 0 ? Math.ceil(fixed / contributionMargin) : 0;
  const breakEvenRevenue = breakEvenUnits * selling;
  const contributionMarginPercent = selling > 0 ? (contributionMargin / selling) * 100 : 0;

  const showResult = fixed > 0 && variable > 0 && selling > 0 && selling > variable;

  return (
    <div className="card">
      <div className="space-y-6">
        <div>
          <label className="label">Fixed Costs (monthly)</label>
          <input type="number" value={fixedCosts} onChange={(e) => setFixedCosts(e.target.value)} placeholder="e.g. 50000" className="input mt-1" min="0" />
        </div>
        <div>
          <label className="label">Variable Cost per Unit</label>
          <input type="number" value={variableCostPerUnit} onChange={(e) => setVariableCostPerUnit(e.target.value)} placeholder="e.g. 40" className="input mt-1" min="0" />
        </div>
        <div>
          <label className="label">Selling Price per Unit</label>
          <input type="number" value={sellingPricePerUnit} onChange={(e) => setSellingPricePerUnit(e.target.value)} placeholder="e.g. 100" className="input mt-1" min="0" />
        </div>

        {selling > 0 && selling <= variable && fixed > 0 && (
          <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700 dark:bg-red-950/50 dark:text-red-300">
            Selling price must be greater than variable cost per unit to break even.
          </div>
        )}

        {showResult && (
          <div className="rounded-xl bg-gray-50 p-5 dark:bg-gray-800/50">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Break-Even Analysis</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Contribution Margin per Unit</span>
                <span className="text-gray-900 dark:text-white">₹{contributionMargin.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Contribution Margin %</span>
                <span className="text-gray-900 dark:text-white">{contributionMarginPercent.toFixed(2)}%</span>
              </div>
              <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-3">
                <span className="font-semibold text-gray-900 dark:text-white">Break-Even Point (Units)</span>
                <span className="text-xl font-bold text-brand-600 dark:text-brand-400">{breakEvenUnits.toLocaleString()} units</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-900 dark:text-white">Break-Even Revenue</span>
                <span className="text-xl font-bold text-brand-600 dark:text-brand-400">₹{breakEvenRevenue.toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}

        <div className="rounded-lg bg-blue-50 p-4 text-xs text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">
          <strong>Formula:</strong> Break-Even Units = Fixed Costs / (Selling Price - Variable Cost per Unit).
          At break-even, total revenue equals total costs.
        </div>
      </div>
    </div>
  );
}
