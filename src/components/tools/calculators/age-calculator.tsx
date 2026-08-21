'use client';

import { useState } from 'react';

export function AgeCalculatorTool() {
  const [dob, setDob] = useState('');
  const [refDate, setRefDate] = useState('');

  const birthDate = dob ? new Date(dob) : null;
  const endDate = refDate ? new Date(refDate) : new Date();

  let years = 0, months = 0, days = 0, totalDays = 0;

  if (birthDate && birthDate < endDate) {
    years = endDate.getFullYear() - birthDate.getFullYear();
    months = endDate.getMonth() - birthDate.getMonth();
    days = endDate.getDate() - birthDate.getDate();

    if (days < 0) {
      months--;
      const prevMonth = new Date(endDate.getFullYear(), endDate.getMonth(), 0);
      days += prevMonth.getDate();
    }
    if (months < 0) {
      years--;
      months += 12;
    }

    const diffTime = endDate.getTime() - birthDate.getTime();
    totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  }

  return (
    <div className="card">
      <div className="space-y-6">
        <div>
          <label className="label">Date of Birth</label>
          <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} className="input mt-1" />
        </div>
        <div>
          <label className="label">Reference Date (optional, defaults to today)</label>
          <input type="date" value={refDate} onChange={(e) => setRefDate(e.target.value)} className="input mt-1" />
        </div>

        {birthDate && birthDate < endDate && (
          <div className="rounded-xl bg-gray-50 p-5 dark:bg-gray-800/50">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Your Age</h3>
            <div className="mt-4 grid grid-cols-3 gap-4 text-center">
              <div className="rounded-lg bg-white p-4 dark:bg-gray-900">
                <p className="text-3xl font-bold text-brand-600 dark:text-brand-400">{years}</p>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Years</p>
              </div>
              <div className="rounded-lg bg-white p-4 dark:bg-gray-900">
                <p className="text-3xl font-bold text-brand-600 dark:text-brand-400">{months}</p>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Months</p>
              </div>
              <div className="rounded-lg bg-white p-4 dark:bg-gray-900">
                <p className="text-3xl font-bold text-brand-600 dark:text-brand-400">{days}</p>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Days</p>
              </div>
            </div>
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Total: <strong>{totalDays.toLocaleString()}</strong> days | <strong>{Math.floor(totalDays / 7).toLocaleString()}</strong> weeks | <strong>{(totalDays * 24).toLocaleString()}</strong> hours
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
