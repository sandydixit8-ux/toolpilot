'use client';

import { useState } from 'react';

export function NoticePeriodCalculatorTool() {
  const [startDate, setStartDate] = useState('');
  const [duration, setDuration] = useState('');
  const [durationType, setDurationType] = useState<'days' | 'months'>('months');
  const [excludeWeekends, setExcludeWeekends] = useState(true);

  const start = startDate ? new Date(startDate) : null;
  const durationNum = parseInt(duration) || 0;

  let lastWorkingDay = '';
  let totalDays = 0;
  let workingDays = 0;

  if (start && durationNum > 0) {
    const endDate = new Date(start);

    if (durationType === 'months') {
      endDate.setMonth(endDate.getMonth() + durationNum);
    } else {
      endDate.setDate(endDate.getDate() + durationNum);
    }

    lastWorkingDay = endDate.toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' });

    const diffTime = endDate.getTime() - start.getTime();
    totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (excludeWeekends) {
      const current = new Date(start);
      while (current <= endDate) {
        const day = current.getDay();
        if (day !== 0 && day !== 6) workingDays++;
        current.setDate(current.getDate() + 1);
      }
    } else {
      workingDays = totalDays;
    }
  }

  return (
    <div className="card">
      <div className="space-y-6">
        <div>
          <label className="label">Notice Period Start Date</label>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="input mt-1" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Duration</label>
            <input type="number" value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="e.g. 30" className="input mt-1" min="1" />
          </div>
          <div>
            <label className="label">Unit</label>
            <div className="mt-1 grid grid-cols-2 gap-2">
              <button onClick={() => setDurationType('days')} className={`rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${durationType === 'days' ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'}`}>Days</button>
              <button onClick={() => setDurationType('months')} className={`rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${durationType === 'months' ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'}`}>Months</button>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setExcludeWeekends(!excludeWeekends)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${excludeWeekends ? 'bg-brand-600' : 'bg-gray-300 dark:bg-gray-600'}`}>
            <span className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${excludeWeekends ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
          <label className="text-sm text-gray-700 dark:text-gray-300">Exclude weekends (Sat/Sun)</label>
        </div>

        {lastWorkingDay && (
          <div className="rounded-xl bg-gray-50 p-5 dark:bg-gray-800/50">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Last Working Day</h3>
            <p className="mt-2 text-lg font-bold text-brand-600 dark:text-brand-400">{lastWorkingDay}</p>
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Total Calendar Days</span>
                <span className="font-semibold text-gray-900 dark:text-white">{totalDays} days</span>
              </div>
              {excludeWeekends && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Working Days (excl. weekends)</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{workingDays} days</span>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="rounded-lg bg-blue-50 p-4 text-xs text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">
          This calculation excludes weekends (Saturday and Sunday) when enabled. Public holidays are not accounted for.
        </div>
      </div>
    </div>
  );
}
