'use client';

import { useState } from 'react';

export function EmiCalculatorTool() {
  const [principal, setPrincipal] = useState('');
  const [rate, setRate] = useState('');
  const [tenure, setTenure] = useState('');

  const P = parseFloat(principal) || 0;
  const annualRate = parseFloat(rate) || 0;
  const N = parseInt(tenure) || 0;

  const r = annualRate / 12 / 100;
  const emi = P && r && N ? (P * r * Math.pow(1 + r, N)) / (Math.pow(1 + r, N) - 1) : 0;
  const totalPayment = emi * N;
  const totalInterest = totalPayment - P;

  return (
    <div className="card">
      <div className="space-y-6">
        <div>
          <label className="label">Loan Amount (₹)</label>
          <input
            type="number"
            value={principal}
            onChange={(e) => setPrincipal(e.target.value)}
            placeholder="e.g. 1000000"
            className="input mt-1"
            min="0"
          />
        </div>
        <div>
          <label className="label">Annual Interest Rate (%)</label>
          <input
            type="number"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            placeholder="e.g. 8.5"
            className="input mt-1"
            min="0"
            step="0.1"
          />
        </div>
        <div>
          <label className="label">Loan Tenure (months)</label>
          <input
            type="number"
            value={tenure}
            onChange={(e) => setTenure(e.target.value)}
            placeholder="e.g. 240"
            className="input mt-1"
            min="0"
          />
          {tenure && (
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              = {Math.floor(N / 12)} years {N % 12} months
            </p>
          )}
        </div>

        {emi > 0 && (
          <div className="rounded-xl bg-gray-50 p-5 dark:bg-gray-800/50">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Result</h3>
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between border-b border-gray-200 pb-3 dark:border-gray-700">
                <span className="text-sm text-gray-600 dark:text-gray-400">Monthly EMI</span>
                <span className="text-xl font-bold text-brand-600 dark:text-brand-400">
                  ₹{emi.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Principal Amount</span>
                <span className="font-semibold text-gray-900 dark:text-white">₹{P.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Total Interest</span>
                <span className="font-semibold text-orange-600 dark:text-orange-400">
                  ₹{totalInterest.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between border-t border-gray-200 pt-3 dark:border-gray-700">
                <span className="text-sm font-medium text-gray-900 dark:text-white">Total Payment</span>
                <span className="font-bold text-gray-900 dark:text-white">₹{totalPayment.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-4">
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="h-3 w-3 rounded bg-brand-500" />
                  <span className="text-gray-600 dark:text-gray-400">Principal ({((P / totalPayment) * 100).toFixed(1)}%)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-3 w-3 rounded bg-orange-400" />
                  <span className="text-gray-600 dark:text-gray-400">Interest ({((totalInterest / totalPayment) * 100).toFixed(1)}%)</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="rounded-lg bg-blue-50 p-4 text-xs text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">
          <strong>Formula:</strong> EMI = P × r × (1 + r)^n / ((1 + r)^n – 1), where P = Principal, r = Monthly interest rate, n = Loan tenure in months.
        </div>
      </div>
    </div>
  );
}
