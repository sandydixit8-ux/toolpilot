'use client';

import { useState } from 'react';

export function DiscountCalculatorTool() {
  const [price, setPrice] = useState('');
  const [discount, setDiscount] = useState('');

  const originalPrice = parseFloat(price) || 0;
  const discountPercent = parseFloat(discount) || 0;
  const discountAmount = (originalPrice * discountPercent) / 100;
  const finalPrice = originalPrice - discountAmount;

  return (
    <div className="card">
      <div className="space-y-6">
        <div>
          <label className="label">Original Price (₹)</label>
          <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="e.g. 999" className="input mt-1" min="0" />
        </div>
        <div>
          <label className="label">Discount (%)</label>
          <input type="number" value={discount} onChange={(e) => setDiscount(e.target.value)} placeholder="e.g. 25" className="input mt-1" min="0" max="100" />
        </div>

        {originalPrice > 0 && discountPercent > 0 && (
          <div className="rounded-xl bg-gray-50 p-5 dark:bg-gray-800/50">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Original Price</span>
                <span className="text-gray-400 line-through">₹{originalPrice.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Discount Amount</span>
                <span className="font-semibold text-green-600 dark:text-green-400">-₹{discountAmount.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between border-t border-gray-200 pt-3 dark:border-gray-700">
                <span className="font-semibold text-gray-900 dark:text-white">Final Price</span>
                <span className="text-xl font-bold text-brand-600 dark:text-brand-400">₹{finalPrice.toFixed(2)}</span>
              </div>
              <p className="text-sm text-green-600 dark:text-green-400">You save ₹{discountAmount.toFixed(2)}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
