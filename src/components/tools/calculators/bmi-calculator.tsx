'use client';

import { useState } from 'react';

export function BmiCalculatorTool() {
  const [weight, setWeight] = useState('');
  const [heightCm, setHeightCm] = useState('');
  const [unit, setUnit] = useState('metric');

  const w = parseFloat(weight) || 0;
  const h = parseFloat(heightCm) || 0;

  let bmi = 0;
  let category = '';
  let color = '';

  if (w > 0 && h > 0) {
    if (unit === 'metric') {
      bmi = w / Math.pow(h / 100, 2);
    } else {
      const heightInches = h;
      bmi = (w / (heightInches * heightInches)) * 703;
    }

    if (bmi < 18.5) { category = 'Underweight'; color = 'text-blue-600 dark:text-blue-400'; }
    else if (bmi < 25) { category = 'Normal Weight'; color = 'text-green-600 dark:text-green-400'; }
    else if (bmi < 30) { category = 'Overweight'; color = 'text-orange-600 dark:text-orange-400'; }
    else { category = 'Obese'; color = 'text-red-600 dark:text-red-400'; }
  }

  return (
    <div className="card">
      <div className="space-y-6">
        <div>
          <label className="label">Unit System</label>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <button onClick={() => setUnit('metric')} className={`rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${unit === 'metric' ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300'}`}>Metric (kg/cm)</button>
            <button onClick={() => setUnit('imperial')} className={`rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${unit === 'imperial' ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300'}`}>Imperial (lbs/in)</button>
          </div>
        </div>
        <div>
          <label className="label">{unit === 'metric' ? 'Weight (kg)' : 'Weight (lbs)'}</label>
          <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} className="input mt-1" min="0" />
        </div>
        <div>
          <label className="label">{unit === 'metric' ? 'Height (cm)' : 'Height (inches)'}</label>
          <input type="number" value={heightCm} onChange={(e) => setHeightCm(e.target.value)} className="input mt-1" min="0" />
        </div>

        {bmi > 0 && (
          <div className="rounded-xl bg-gray-50 p-5 dark:bg-gray-800/50">
            <div className="text-center">
              <p className="text-4xl font-bold text-brand-600 dark:text-brand-400">{bmi.toFixed(1)}</p>
              <p className={`mt-2 text-lg font-semibold ${color}`}>{category}</p>
            </div>
            <div className="mt-4">
              <div className="relative h-3 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                <div className="absolute inset-y-0 rounded-full bg-gradient-to-r from-blue-500 via-green-500 via-50% to-red-500" style={{ width: `${Math.min((bmi / 40) * 100, 100)}%` }} />
              </div>
              <div className="mt-2 flex justify-between text-[10px] text-gray-500 dark:text-gray-400">
                <span>Underweight</span>
                <span>Normal</span>
                <span>Overweight</span>
                <span>Obese</span>
              </div>
            </div>
          </div>
        )}

        <div className="rounded-lg bg-blue-50 p-4 text-xs text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">
          <strong>Formula:</strong> BMI = Weight (kg) / Height (m)². BMI is a general indicator and may not account for muscle mass, bone density, or other factors.
        </div>
      </div>
    </div>
  );
}
