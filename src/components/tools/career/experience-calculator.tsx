'use client';

import { useState } from 'react';

interface Tenure {
  id: number;
  start: string;
  end: string;
  isCurrent: boolean;
}

let nextId = 1;

function calcDuration(start: Date, end: Date) {
  let years = end.getFullYear() - start.getFullYear();
  let months = end.getMonth() - start.getMonth();
  let days = end.getDate() - start.getDate();

  if (days < 0) {
    months--;
    const prevMonth = new Date(end.getFullYear(), end.getMonth(), 0);
    days += prevMonth.getDate();
  }
  if (months < 0) {
    years--;
    months += 12;
  }

  return { years, months, days };
}

export function ExperienceCalculatorTool() {
  const [tenures, setTenures] = useState<Tenure[]>([
    { id: nextId++, start: '', end: '', isCurrent: false },
  ]);

  const addTenure = () => {
    setTenures((prev) => [...prev, { id: nextId++, start: '', end: '', isCurrent: false }]);
  };

  const removeTenure = (id: number) => {
    setTenures((prev) => (prev.length > 1 ? prev.filter((t) => t.id !== id) : prev));
  };

  const updateTenure = (id: number, field: keyof Tenure, value: string | boolean) => {
    setTenures((prev) => prev.map((t) => (t.id === id ? { ...t, [field]: value } : t)));
  };

  const totalTenures = tenures
    .filter((t) => t.start)
    .map((t) => {
      const start = new Date(t.start);
      const end = t.isCurrent ? new Date() : t.end ? new Date(t.end) : null;
      if (!end || isNaN(start.getTime()) || isNaN(end.getTime())) return null;
      return calcDuration(start, end);
    })
    .filter(Boolean) as { years: number; months: number; days: number }[];

  const totalDays = totalTenures.reduce((sum, t) => sum + t.years * 365 + t.months * 30 + t.days, 0);
  const totalYears = Math.floor(totalDays / 365);
  const remainingDays = totalDays % 365;
  const totalMonths = Math.floor(remainingDays / 30);
  const finalDays = remainingDays % 30;

  return (
    <div className="card">
      <div className="space-y-6">
        <p className="text-sm text-gray-600 dark:text-gray-400">Add each job tenure to calculate your total work experience.</p>

        {tenures.map((tenure, index) => (
          <div key={tenure.id} className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-900 dark:text-white">Tenure {index + 1}</span>
              {tenures.length > 1 && (
                <button onClick={() => removeTenure(tenure.id)} className="text-xs text-red-500 hover:text-red-700 dark:text-red-400">Remove</button>
              )}
            </div>
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="label text-xs">Start Date</label>
                <input type="date" value={tenure.start} onChange={(e) => updateTenure(tenure.id, 'start', e.target.value)} className="input mt-1" />
              </div>
              <div>
                <label className="label text-xs">End Date</label>
                <input type="date" value={tenure.end} disabled={tenure.isCurrent} onChange={(e) => updateTenure(tenure.id, 'end', e.target.value)} className="input mt-1 disabled:opacity-50" />
              </div>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <button onClick={() => updateTenure(tenure.id, 'isCurrent', !tenure.isCurrent)} className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${tenure.isCurrent ? 'bg-brand-600' : 'bg-gray-300 dark:bg-gray-600'}`}>
                <span className={`inline-block h-3.5 w-3.5 rounded-full bg-white transition-transform ${tenure.isCurrent ? 'translate-x-[18px]' : 'translate-x-[3px]'}`} />
              </button>
              <span className="text-xs text-gray-600 dark:text-gray-400">Currently working here</span>
            </div>
          </div>
        ))}

        <button onClick={addTenure} className="btn-secondary w-full">+ Add Another Tenure</button>

        {totalTenures.length > 0 && (
          <div className="rounded-xl bg-gray-50 p-5 text-center dark:bg-gray-800/50">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Experience</p>
            <p className="mt-1 text-3xl font-bold text-brand-600 dark:text-brand-400">
              {totalYears}y {totalMonths}m {finalDays}d
            </p>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              ({(totalYears * 12 + totalMonths)} months total • {totalDays} days)
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
