'use client';

import { useState } from 'react';

export function ProjectCostCalculatorTool() {
  const [hours, setHours] = useState('');
  const [rate, setRate] = useState('');
  const [materials, setMaterials] = useState('');
  const [equipment, setEquipment] = useState('');
  const [otherCosts, setOtherCosts] = useState('');
  const [contingency, setContingency] = useState('10');

  const laborCost = (parseFloat(hours) || 0) * (parseFloat(rate) || 0);
  const materialCost = parseFloat(materials) || 0;
  const equipmentCost = parseFloat(equipment) || 0;
  const other = parseFloat(otherCosts) || 0;
  const contingencyPercent = parseFloat(contingency) || 0;
  const subtotal = laborCost + materialCost + equipmentCost + other;
  const contingencyAmount = (subtotal * contingencyPercent) / 100;
  const totalCost = subtotal + contingencyAmount;

  const showResult = subtotal > 0;

  return (
    <div className="card">
      <div className="space-y-6">
        <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Labor Cost</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Hours</label>
              <input type="number" value={hours} onChange={(e) => setHours(e.target.value)} placeholder="e.g. 40" className="input mt-1" min="0" />
            </div>
            <div>
              <label className="label">Hourly Rate</label>
              <input type="number" value={rate} onChange={(e) => setRate(e.target.value)} placeholder="e.g. 500" className="input mt-1" min="0" />
            </div>
          </div>
          {laborCost > 0 && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Labor Total: ₹{laborCost.toLocaleString()}</p>
          )}
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="label">Materials Cost</label>
            <input type="number" value={materials} onChange={(e) => setMaterials(e.target.value)} placeholder="e.g. 25000" className="input mt-1" min="0" />
          </div>
          <div>
            <label className="label">Equipment Cost</label>
            <input type="number" value={equipment} onChange={(e) => setEquipment(e.target.value)} placeholder="e.g. 15000" className="input mt-1" min="0" />
          </div>
          <div>
            <label className="label">Other Costs</label>
            <input type="number" value={otherCosts} onChange={(e) => setOtherCosts(e.target.value)} placeholder="e.g. 5000" className="input mt-1" min="0" />
          </div>
        </div>

        <div>
          <label className="label">Contingency (%)</label>
          <input type="number" value={contingency} onChange={(e) => setContingency(e.target.value)} className="input mt-1" min="0" max="100" />
        </div>

        {showResult && (
          <div className="rounded-xl bg-gray-50 p-5 dark:bg-gray-800/50">
            <div className="space-y-3">
              {laborCost > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Labor Cost</span>
                  <span className="text-gray-900 dark:text-white">₹{laborCost.toLocaleString()}</span>
                </div>
              )}
              {materialCost > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Materials</span>
                  <span className="text-gray-900 dark:text-white">₹{materialCost.toLocaleString()}</span>
                </div>
              )}
              {equipmentCost > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Equipment</span>
                  <span className="text-gray-900 dark:text-white">₹{equipmentCost.toLocaleString()}</span>
                </div>
              )}
              {other > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Other Costs</span>
                  <span className="text-gray-900 dark:text-white">₹{other.toLocaleString()}</span>
                </div>
              )}
              <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-3">
                <span className="text-sm text-gray-600 dark:text-gray-400">Subtotal</span>
                <span className="text-gray-900 dark:text-white">₹{subtotal.toLocaleString()}</span>
              </div>
              {contingencyPercent > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Contingency ({contingencyPercent}%)</span>
                  <span className="text-gray-700 dark:text-gray-300">₹{contingencyAmount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-3">
                <span className="font-semibold text-gray-900 dark:text-white">Total Project Cost</span>
                <span className="text-xl font-bold text-brand-600 dark:text-brand-400">₹{totalCost.toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
