'use client';

import { useState } from 'react';

export function DateCalculatorTool() {
  const [mode, setMode] = useState<'diff' | 'add' | 'sub'>('diff');
  const [date1, setDate1] = useState('');
  const [date2, setDate2] = useState('');
  const [days, setDays] = useState('');

  const d1 = date1 ? new Date(date1) : null;
  const d2 = date2 ? new Date(date2) : null;
  const numDays = parseInt(days) || 0;

  let result = '';

  if (mode === 'diff' && d1 && d2) {
    const diff = Math.abs(d2.getTime() - d1.getTime());
    const totalDays = Math.floor(diff / (1000 * 60 * 60 * 24));
    const weeks = Math.floor(totalDays / 7);
    const remainDays = totalDays % 7;
    result = `${totalDays} days (${weeks} weeks and ${remainDays} days)`;
  } else if (mode === 'add' && d1 && numDays > 0) {
    const newDate = new Date(d1);
    newDate.setDate(newDate.getDate() + numDays);
    result = `Result date: ${newDate.toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}`;
  } else if (mode === 'sub' && d1 && numDays > 0) {
    const newDate = new Date(d1);
    newDate.setDate(newDate.getDate() - numDays);
    result = `Result date: ${newDate.toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}`;
  }

  return (
    <div className="card">
      <div className="space-y-6">
        <div>
          <label className="label">Calculation Type</label>
          <div className="mt-2 grid grid-cols-3 gap-2">
            <button onClick={() => setMode('diff')} className={`rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${mode === 'diff' ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'}`}>Date Diff</button>
            <button onClick={() => setMode('add')} className={`rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${mode === 'add' ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'}`}>Add Days</button>
            <button onClick={() => setMode('sub')} className={`rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${mode === 'sub' ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'}`}>Subtract Days</button>
          </div>
        </div>
        <div>
          <label className="label">{mode === 'diff' ? 'Start Date' : 'Date'}</label>
          <input type="date" value={date1} onChange={(e) => setDate1(e.target.value)} className="input mt-1" />
        </div>
        {mode === 'diff' && (
          <div>
            <label className="label">End Date</label>
            <input type="date" value={date2} onChange={(e) => setDate2(e.target.value)} className="input mt-1" />
          </div>
        )}
        {(mode === 'add' || mode === 'sub') && (
          <div>
            <label className="label">Number of Days</label>
            <input type="number" value={days} onChange={(e) => setDays(e.target.value)} className="input mt-1" min="0" />
          </div>
        )}
        {result && (
          <div className="rounded-xl bg-gray-50 p-5 text-center dark:bg-gray-800/50">
            <p className="text-lg font-semibold text-brand-600 dark:text-brand-400">{result}</p>
          </div>
        )}
      </div>
    </div>
  );
}
