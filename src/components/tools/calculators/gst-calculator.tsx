'use client';

import { useState } from 'react';

export function GstCalculatorTool() {
  const [amount, setAmount] = useState('');
  const [rate, setRate] = useState('18');
  const [mode, setMode] = useState<'add' | 'remove'>('add');

  const numAmount = parseFloat(amount) || 0;
  const numRate = parseFloat(rate) || 0;

  let gstAmount = 0;
  let totalAmount = 0;
  let originalAmount = 0;

  if (mode === 'add') {
    gstAmount = (numAmount * numRate) / 100;
    totalAmount = numAmount + gstAmount;
    originalAmount = numAmount;
  } else {
    totalAmount = numAmount;
    originalAmount = (numAmount * 100) / (100 + numRate);
    gstAmount = totalAmount - originalAmount;
  }

  const halfGst = gstAmount / 2;

  return (
    <div className="card">
      <div className="space-y-6">
        <div>
          <label className="label">Amount (₹)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            className="input mt-1"
            min="0"
          />
        </div>

        <div>
          <label className="label">GST Rate (%)</label>
          <div className="mt-2 grid grid-cols-4 gap-2">
            {['5', '12', '18', '28'].map((r) => (
              <button
                key={r}
                onClick={() => setRate(r)}
                className={`rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                  rate === r
                    ? 'bg-brand-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                {r}%
              </button>
            ))}
          </div>
          <input
            type="number"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            placeholder="Custom rate"
            className="input mt-2"
            min="0"
            max="100"
          />
        </div>

        <div>
          <label className="label">Mode</label>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <button
              onClick={() => setMode('add')}
              className={`rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                mode === 'add'
                  ? 'bg-brand-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              Add GST
            </button>
            <button
              onClick={() => setMode('remove')}
              className={`rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                mode === 'remove'
                  ? 'bg-brand-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              Remove GST
            </button>
          </div>
        </div>

        <div className="rounded-xl bg-gray-50 p-5 dark:bg-gray-800/50">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Result</h3>
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {mode === 'add' ? 'Original Amount' : 'Amount without GST'}
              </span>
              <span className="font-semibold text-gray-900 dark:text-white">
                ₹{originalAmount.toFixed(2)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">GST ({numRate}%)</span>
              <span className="font-semibold text-brand-600 dark:text-brand-400">
                ₹{gstAmount.toFixed(2)}
              </span>
            </div>
            <div className="flex items-center justify-between border-t border-gray-200 pt-3 dark:border-gray-700">
              <span className="text-sm font-medium text-gray-900 dark:text-white">CGST</span>
              <span className="text-sm text-gray-600 dark:text-gray-400">₹{halfGst.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-900 dark:text-white">SGST</span>
              <span className="text-sm text-gray-600 dark:text-gray-400">₹{halfGst.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between border-t border-gray-200 pt-3 dark:border-gray-700">
              <span className="font-semibold text-gray-900 dark:text-white">Total Amount</span>
              <span className="text-lg font-bold text-brand-600 dark:text-brand-400">
                ₹{totalAmount.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-blue-50 p-4 text-xs text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">
          <strong>Formula:</strong> GST Amount = (Original Price × GST Rate) / 100.
          Total = Original Price + GST Amount.
        </div>
      </div>
    </div>
  );
}
