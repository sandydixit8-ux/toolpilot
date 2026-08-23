'use client';

import { useState } from 'react';

export function PercentageCalculatorTool() {
  const [mode, setMode] = useState<'of' | 'change' | 'difference'>('of');
  const [value1, setValue1] = useState('');
  const [value2, setValue2] = useState('');

  const a = parseFloat(value1) || 0;
  const b = parseFloat(value2) || 0;

  let result = 0;
  let formula = '';

  if (mode === 'of') {
    result = (a * b) / 100;
    formula = `${b}% of ${a} = ${result.toFixed(2)}`;
  } else if (mode === 'change') {
    result = a !== 0 ? ((b - a) / Math.abs(a)) * 100 : 0;
    formula = `Percentage change from ${a} to ${b} = ${result.toFixed(2)}%`;
  } else {
    result = (a + b) !== 0 ? (Math.abs(b - a) / ((a + b) / 2)) * 100 : 0;
    formula = `Percentage difference between ${a} and ${b} = ${result.toFixed(2)}%`;
  }

  return (
    <div className="card">
      <div className="space-y-6">
        <div>
          <label className="label">Calculation Type</label>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {[
              { key: 'of' as const, label: '% of' },
              { key: 'change' as const, label: '% Change' },
              { key: 'difference' as const, label: '% Diff' },
            ].map((m) => (
              <button key={m.key} onClick={() => setMode(m.key)} className={`rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${mode === m.key ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300'}`}>
                {m.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="label">
            {mode === 'of' ? 'Number' : mode === 'change' ? 'Original Value' : 'First Value'}
          </label>
          <input type="number" value={value1} onChange={(e) => setValue1(e.target.value)} className="input mt-1" />
        </div>
        <div>
          <label className="label">
            {mode === 'of' ? 'Percentage (%)' : 'New Value / Second Value'}
          </label>
          <input type="number" value={value2} onChange={(e) => setValue2(e.target.value)} className="input mt-1" />
        </div>

        {value1 && value2 && (
          <div className="rounded-xl bg-gray-50 p-5 dark:bg-gray-800/50">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Result</h3>
            <p className="mt-2 text-2xl font-bold text-brand-600 dark:text-brand-400">
              {mode === 'of' ? result.toFixed(2) : `${result.toFixed(2)}%`}
            </p>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{formula}</p>
          </div>
        )}
      </div>
    </div>
  );
}
