'use client';

import { useState } from 'react';

const qualityPresets = [
  { label: 'Basic', costPerSqFt: 1400, description: 'Standard finishes, basic fittings' },
  { label: 'Medium', costPerSqFt: 2000, description: 'Good quality finishes, branded fittings' },
  { label: 'Premium', costPerSqFt: 3000, description: 'High-end finishes, premium fittings' },
  { label: 'Luxury', costPerSqFt: 4500, description: 'Ultra-premium, imported fittings' },
];

export function ConstructionCostCalculatorTool() {
  const [area, setArea] = useState('');
  const [costPerSqFt, setCostPerSqFt] = useState('2000');
  const [selectedPreset, setSelectedPreset] = useState<number | null>(1);
  const [additionalPercent, setAdditionalPercent] = useState('10');

  const areaSqFt = parseFloat(area) || 0;
  const rate = parseFloat(costPerSqFt) || 0;
  const additional = parseFloat(additionalPercent) || 0;

  const baseCost = areaSqFt * rate;
  const additionalCost = (baseCost * additional) / 100;
  const totalCost = baseCost + additionalCost;

  const handlePreset = (index: number) => {
    setSelectedPreset(index);
    setCostPerSqFt(String(qualityPresets[index].costPerSqFt));
  };

  const showResult = areaSqFt > 0 && rate > 0;

  return (
    <div className="card">
      <div className="space-y-6">
        <div>
          <label className="label">Construction Area (sq ft)</label>
          <input type="number" value={area} onChange={(e) => setArea(e.target.value)} placeholder="e.g. 1200" className="input mt-1" min="0" />
        </div>

        <div>
          <label className="label">Quality Type</label>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {qualityPresets.map((preset, i) => (
              <button
                key={preset.label}
                onClick={() => handlePreset(i)}
                className={`rounded-lg px-4 py-3 text-left transition-colors ${
                  selectedPreset === i
                    ? 'bg-brand-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                <span className="text-sm font-medium">{preset.label}</span>
                <span className={`block text-xs mt-0.5 ${selectedPreset === i ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'}`}>
                  ₹{preset.costPerSqFt.toLocaleString()}/sq ft
                </span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="label">Cost per Sq Ft (custom)</label>
          <input type="number" value={costPerSqFt} onChange={(e) => { setCostPerSqFt(e.target.value); setSelectedPreset(null); }} className="input mt-1" min="0" />
        </div>

        <div>
          <label className="label">Additional Costs (%) - permits, fees, misc</label>
          <input type="number" value={additionalPercent} onChange={(e) => setAdditionalPercent(e.target.value)} className="input mt-1" min="0" max="100" />
        </div>

        {showResult && (
          <div className="rounded-xl bg-gray-50 p-5 dark:bg-gray-800/50">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Area</span>
                <span className="text-gray-900 dark:text-white">{areaSqFt.toLocaleString()} sq ft</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Rate per Sq Ft</span>
                <span className="text-gray-900 dark:text-white">₹{rate.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Base Construction Cost</span>
                <span className="text-gray-900 dark:text-white">₹{baseCost.toLocaleString()}</span>
              </div>
              {additional > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Additional ({additional}%)</span>
                  <span className="text-gray-700 dark:text-gray-300">₹{additionalCost.toLocaleString()}</span>
                </div>
              )}
              <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-3">
                <span className="font-semibold text-gray-900 dark:text-white">Estimated Total Cost</span>
                <span className="text-xl font-bold text-brand-600 dark:text-brand-400">₹{totalCost.toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}

        <div className="rounded-lg bg-blue-50 p-4 text-xs text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">
          <strong>Note:</strong> Estimates are indicative. Actual costs vary by location, design complexity, material availability, and labor rates. Always consult a professional for accurate quotations.
        </div>
      </div>
    </div>
  );
}
