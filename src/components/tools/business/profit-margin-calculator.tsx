'use client';

import { useState } from 'react';

export function ProfitMarginCalculatorTool() {
  const [mode, setMode] = useState<'margin' | 'target'>('margin');
  const [costPrice, setCostPrice] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const [desiredMargin, setDesiredMargin] = useState('');

  const cost = parseFloat(costPrice) || 0;
  const sell = parseFloat(sellingPrice) || 0;
  const margin = parseFloat(desiredMargin) || 0;

  const profit = sell - cost;
  const profitMargin = sell > 0 ? (profit / sell) * 100 : 0;
  const markup = cost > 0 ? (profit / cost) * 100 : 0;
  const targetSellingPrice = mode === 'target' && cost > 0 && margin > 0 ? cost / (1 - margin / 100) : 0;
  const targetProfit = targetSellingPrice - cost;

  const showResult = mode === 'margin' ? cost > 0 && sell > 0 : cost > 0 && margin > 0;

  return (
    <div className="card">
      <div className="space-y-6">
        <div>
          <label className="label">Mode</label>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <button
              onClick={() => setMode('margin')}
              className={`rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${mode === 'margin' ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'}`}
            >
              Calculate Margin
            </button>
            <button
              onClick={() => setMode('target')}
              className={`rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${mode === 'target' ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'}`}
            >
              Find Selling Price
            </button>
          </div>
        </div>

        <div>
          <label className="label">Cost Price</label>
          <input type="number" value={costPrice} onChange={(e) => setCostPrice(e.target.value)} placeholder="e.g. 100" className="input mt-1" min="0" />
        </div>

        {mode === 'margin' ? (
          <div>
            <label className="label">Selling Price</label>
            <input type="number" value={sellingPrice} onChange={(e) => setSellingPrice(e.target.value)} placeholder="e.g. 150" className="input mt-1" min="0" />
          </div>
        ) : (
          <div>
            <label className="label">Desired Profit Margin (%)</label>
            <input type="number" value={desiredMargin} onChange={(e) => setDesiredMargin(e.target.value)} placeholder="e.g. 30" className="input mt-1" min="0" max="99" />
          </div>
        )}

        {showResult && (
          <div className="rounded-xl bg-gray-50 p-5 dark:bg-gray-800/50">
            <div className="space-y-3">
              {mode === 'margin' ? (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Cost Price</span>
                    <span className="text-gray-900 dark:text-white">₹{cost.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Selling Price</span>
                    <span className="text-gray-900 dark:text-white">₹{sell.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Profit Amount</span>
                    <span className={`font-semibold ${profit >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      ₹{profit.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-3">
                    <span className="font-medium text-gray-900 dark:text-white">Profit Margin</span>
                    <span className="text-lg font-bold text-brand-600 dark:text-brand-400">{profitMargin.toFixed(2)}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900 dark:text-white">Markup %</span>
                    <span className="text-lg font-bold text-brand-600 dark:text-brand-400">{markup.toFixed(2)}%</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Cost Price</span>
                    <span className="text-gray-900 dark:text-white">₹{cost.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Desired Margin</span>
                    <span className="text-gray-900 dark:text-white">{margin}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Required Profit</span>
                    <span className="font-semibold text-green-600 dark:text-green-400">₹{targetProfit.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-3">
                    <span className="font-semibold text-gray-900 dark:text-white">Selling Price</span>
                    <span className="text-xl font-bold text-brand-600 dark:text-brand-400">₹{targetSellingPrice.toFixed(2)}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        <div className="rounded-lg bg-blue-50 p-4 text-xs text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">
          <strong>Margin vs Markup:</strong> Margin = (Profit / Selling Price) x 100. Markup = (Profit / Cost Price) x 100.
        </div>
      </div>
    </div>
  );
}
