'use client';

import { useState } from 'react';

export function RoiCalculatorTool() {
  const [investment, setInvestment] = useState('');
  const [returns, setReturns] = useState('');
  const [timePeriod, setTimePeriod] = useState('1');

  const investAmount = parseFloat(investment) || 0;
  const returnAmount = parseFloat(returns) || 0;
  const years = parseFloat(timePeriod) || 1;

  const profit = returnAmount - investAmount;
  const roi = investAmount > 0 ? (profit / investAmount) * 100 : 0;
  const annualizedRoi = years > 0 && investAmount > 0 ? (Math.pow(returnAmount / investAmount, 1 / years) - 1) * 100 : 0;

  const showResult = investAmount > 0 && returnAmount > 0;

  return (
    <div className="card">
      <div className="space-y-6">
        <div>
          <label className="label">Investment Amount</label>
          <input type="number" value={investment} onChange={(e) => setInvestment(e.target.value)} placeholder="e.g. 100000" className="input mt-1" min="0" />
        </div>
        <div>
          <label className="label">Return Amount (final value)</label>
          <input type="number" value={returns} onChange={(e) => setReturns(e.target.value)} placeholder="e.g. 150000" className="input mt-1" min="0" />
        </div>
        <div>
          <label className="label">Time Period (years)</label>
          <input type="number" value={timePeriod} onChange={(e) => setTimePeriod(e.target.value)} className="input mt-1" min="0.1" step="0.1" />
        </div>

        {showResult && (
          <div className="rounded-xl bg-gray-50 p-5 dark:bg-gray-800/50">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Investment</span>
                <span className="text-gray-900 dark:text-white">₹{investAmount.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Final Value</span>
                <span className="text-gray-900 dark:text-white">₹{returnAmount.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Profit / Loss</span>
                <span className={`font-semibold ${profit >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  ₹{profit.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-3">
                <span className="font-semibold text-gray-900 dark:text-white">ROI</span>
                <span className={`text-xl font-bold ${roi >= 0 ? 'text-brand-600 dark:text-brand-400' : 'text-red-600 dark:text-red-400'}`}>
                  {roi.toFixed(2)}%
                </span>
              </div>
              {years > 1 && (
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-900 dark:text-white">Annualized ROI</span>
                  <span className={`text-lg font-bold ${annualizedRoi >= 0 ? 'text-brand-600 dark:text-brand-400' : 'text-red-600 dark:text-red-400'}`}>
                    {annualizedRoi.toFixed(2)}%
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="rounded-lg bg-blue-50 p-4 text-xs text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">
          <strong>Formula:</strong> ROI = ((Return - Investment) / Investment) x 100.
          Annualized ROI = ((Return / Investment) ^ (1 / years) - 1) x 100.
        </div>
      </div>
    </div>
  );
}
