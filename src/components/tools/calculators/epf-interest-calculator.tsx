'use client';

import { useState } from 'react';

export function EpfInterestCalculatorTool() {
  const [basic, setBasic] = useState('15000');
  const [epfRate, setEpfRate] = useState('12');
  const [age, setAge] = useState('30');
  const [retire, setRetire] = useState('60');
  const [rate, setRate] = useState('8.25');
  const [empPpf, setEmpPpf] = useState('0');

  const numBasic = parseFloat(basic) || 0;
  const numEpfRate = parseFloat(epfRate) || 0;
  const numAge = parseFloat(age) || 0;
  const numRetire = parseFloat(retire) || 0;
  const numRate = parseFloat(rate) || 0;
  const numEmpPpf = parseFloat(empPpf) || 0;

  const years = Math.max(0, numRetire - numAge);

  // Employee + employer EPF contribution (12% each of basic)
  const empContribution = (numBasic * numEpfRate) / 100;
  const employerPension = Math.min((numBasic * 8.33) / 100, 1250);
  const employerEpf = (numBasic * numEpfRate) / 100 - employerPension + numEmpPpf;
  const monthlyTotal = empContribution + employerEpf;

  const monthlyRate = numRate / 100 / 12;

  let balance = 0;
  const yearsWithInterest: { year: number; balance: number; interest: number }[] = [];
  for (let y = 1; y <= years; y++) {
    let yearStart = balance;
    let yearInterest = 0;
    for (let m = 1; m <= 12; m++) {
      const monthlyInterest = (balance * monthlyRate);
      balance += monthlyInterest + monthlyTotal;
      yearInterest += monthlyInterest;
    }
    yearsWithInterest.push({
      year: y,
      balance: Math.round(balance),
      interest: Math.round(yearInterest),
    });
    yearStart = balance;
  }

  const employeeTotal = empContribution * 12 * years;
  const totalDeposited = monthlyTotal * 12 * years;
  const totalInterest = balance - totalDeposited;

  return (
    <div className="card">
      <div className="space-y-6">
        <div>
          <label className="label">Basic Salary + DA (₹/month)</label>
          <input
            type="number"
            value={basic}
            onChange={(e) => setBasic(e.target.value)}
            placeholder="e.g. 15000"
            className="input mt-1"
            min="0"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">EPF Contribution Rate (%)</label>
            <input
              type="number"
              value={epfRate}
              onChange={(e) => setEpfRate(e.target.value)}
              className="input mt-1"
              min="0"
              max="100"
            />
          </div>
          <div>
            <label className="label">Interest Rate (%) per year</label>
            <input
              type="number"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              placeholder="e.g. 8.25"
              className="input mt-1"
              min="0"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Current Age</label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="input mt-1"
              min="0"
            />
          </div>
          <div>
            <label className="label">Retirement Age</label>
            <input
              type="number"
              value={retire}
              onChange={(e) => setRetire(e.target.value)}
              className="input mt-1"
              min="0"
            />
          </div>
        </div>

        <div>
          <label className="label">Voluntary PF Contribution (₹/month)</label>
          <input
            type="number"
            value={empPpf}
            onChange={(e) => setEmpPpf(e.target.value)}
            placeholder="e.g. 5000"
            className="input mt-1"
            min="0"
          />
        </div>

        <div className="rounded-xl bg-gray-50 p-5 dark:bg-gray-800/50">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">EPF Projection at Retirement ({years} years)</h3>
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Monthly Contribution (Emp + Emp)</span>
              <span className="font-semibold text-gray-900 dark:text-white">₹{Math.round(monthlyTotal).toLocaleString('en-IN')}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Total Deposited</span>
              <span className="font-semibold text-gray-900 dark:text-white">₹{Math.round(totalDeposited).toLocaleString('en-IN')}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Interest Earned</span>
              <span className="font-semibold text-brand-600 dark:text-brand-400">₹{Math.round(totalInterest).toLocaleString('en-IN')}</span>
            </div>
            <div className="flex items-center justify-between border-t border-gray-200 pt-3 dark:border-gray-700">
              <span className="font-medium text-gray-900 dark:text-white">Projected Balance</span>
              <span className="text-lg font-bold text-brand-600 dark:text-brand-400">₹{Math.round(balance).toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        {yearsWithInterest.length > 0 && (
          <div className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="max-h-64 overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-800 sticky top-0">
                  <tr>
                    <th className="px-4 py-2 text-left font-medium text-gray-600 dark:text-gray-300">Year</th>
                    <th className="px-4 py-2 text-right font-medium text-gray-600 dark:text-gray-300">Interest (₹)</th>
                    <th className="px-4 py-2 text-right font-medium text-gray-600 dark:text-gray-300">Balance (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {yearsWithInterest.map((row) => (
                    <tr key={row.year} className="border-t border-gray-100 dark:border-gray-800">
                      <td className="px-4 py-2 text-gray-700 dark:text-gray-300">Year {row.year}</td>
                      <td className="px-4 py-2 text-right text-gray-600 dark:text-gray-400">{row.interest.toLocaleString('en-IN')}</td>
                      <td className="px-4 py-2 text-right font-medium text-gray-900 dark:text-white">{row.balance.toLocaleString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="rounded-lg bg-blue-50 p-4 text-xs text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">
          <strong>Note:</strong> EPF interest is compounded yearly. Contributions: 12% employee + 12% employer (pension 8.33% of basic up to ₹15,000). This is an estimate; actual rates change each year.
        </div>
      </div>
    </div>
  );
}
