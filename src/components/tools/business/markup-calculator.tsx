'use client';

import { useState } from 'react';

export function MarkupCalculatorTool() {
  const [costPrice, setCostPrice] = useState('');
  const [markupPercent, setMarkupPercent] = useState('');

  const cost = parseFloat(costPrice) || 0;
  const markup = parseFloat(markupPercent) || 0;
  const profitAmount = (cost * markup) / 100;
  const sellingPrice = cost + profitAmount;

  const showResult = cost > 0 && markup > 0;

  return (
    <div className="card">
      <div className="space-y-6">
        <div>
          <label className="label">Cost Price</label>
          <input type="number" value={costPrice} onChange={(e) => setCostPrice(e.target.value)} placeholder="e.g. 100" className="input mt-1" min="0" />
        </div>
        <div>
          <label className="label">Markup Percentage (%)</label>
          <input type="number" value={markupPercent} onChange={(e) => setMarkupPercent(e.target.value)} placeholder="e.g. 50" className="input mt-1" min="0" />
        </div>

        {showResult && (
          <div className="rounded-xl bg-gray-50 p-5 dark:bg-gray-800/50">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Cost Price</span>
                <span className="text-gray-900 dark:text-white">₹{cost.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Markup ({markup}%)</span>
                <span className="font-semibold text-green-600 dark:text-green-400">+₹{profitAmount.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-3">
                <span className="font-semibold text-gray-900 dark:text-white">Selling Price</span>
                <span className="text-xl font-bold text-brand-600 dark:text-brand-400">₹{sellingPrice.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Profit</span>
                <span className="text-green-600 dark:text-green-400 font-medium">₹{profitAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}

        <div className="rounded-lg bg-blue-50 p-4 text-xs text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">
          <strong>Formula:</strong> Selling Price = Cost x (1 + Markup / 100).
          e.g. 50% markup on ₹100 = ₹150 selling price.
        </div>
      </div>
    </div>
  );
}
