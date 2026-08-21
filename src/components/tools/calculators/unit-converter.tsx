'use client';

import { useState } from 'react';

const conversionFactors: Record<string, Record<string, number>> = {
  length: { m: 1, km: 0.001, cm: 100, mm: 1000, mi: 0.000621371, yd: 1.09361, in: 39.3701, ft: 3.28084 },
  weight: { kg: 1, g: 1000, mg: 1000000, lb: 2.20462, oz: 35.274, ton: 0.001 },
  temperature: { celsius: 1, fahrenheit: 1, kelvin: 1 },
  volume: { l: 1, ml: 1000, gal: 0.264172, qt: 1.05669, pt: 2.11338, cup: 4.22675 },
  area: { sqm: 1, sqkm: 0.000001, sqft: 10.7639, acre: 0.000247105, hectare: 0.0001 },
  speed: { mps: 1, kph: 3.6, mph: 2.23694, knot: 1.94384 },
};

export function UnitConverterTool() {
  const [category, setCategory] = useState('length');
  const [fromUnit, setFromUnit] = useState('m');
  const [toUnit, setToUnit] = useState('km');
  const [value, setValue] = useState('');

  const units = Object.keys(conversionFactors[category] || {});
  const numValue = parseFloat(value) || 0;

  let result = 0;
  if (category === 'temperature') {
    const v = numValue;
    if (fromUnit === 'celsius' && toUnit === 'fahrenheit') result = v * 9 / 5 + 32;
    else if (fromUnit === 'fahrenheit' && toUnit === 'celsius') result = (v - 32) * 5 / 9;
    else if (fromUnit === 'celsius' && toUnit === 'kelvin') result = v + 273.15;
    else if (fromUnit === 'kelvin' && toUnit === 'celsius') result = v - 273.15;
    else if (fromUnit === 'fahrenheit' && toUnit === 'kelvin') result = (v - 32) * 5 / 9 + 273.15;
    else if (fromUnit === 'kelvin' && toUnit === 'fahrenheit') result = (v - 273.15) * 9 / 5 + 32;
    else result = v;
  } else {
    const factors = conversionFactors[category] || {};
    const inBase = numValue / (factors[fromUnit] || 1);
    result = inBase * (factors[toUnit] || 1);
  }

  return (
    <div className="card">
      <div className="space-y-6">
        <div>
          <label className="label">Category</label>
          <select value={category} onChange={(e) => { setCategory(e.target.value); setFromUnit(Object.keys(conversionFactors[e.target.value])[0]); setToUnit(Object.keys(conversionFactors[e.target.value])[1]); }} className="input mt-1">
            {Object.keys(conversionFactors).map((c) => (
              <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-3">
          <div>
            <label className="label">From</label>
            <input type="number" value={value} onChange={(e) => setValue(e.target.value)} className="input mt-1" />
            <select value={fromUnit} onChange={(e) => setFromUnit(e.target.value)} className="input mt-2">
              {units.map((u) => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
          <button onClick={() => { const t = fromUnit; setFromUnit(toUnit); setToUnit(t); }} className="mb-6 rounded-lg bg-gray-100 p-2 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400">⇄</button>
          <div>
            <label className="label">To</label>
            <div className="input mt-1 flex items-center bg-gray-50 dark:bg-gray-800/50">{result.toFixed(4)}</div>
            <select value={toUnit} onChange={(e) => setToUnit(e.target.value)} className="input mt-2">
              {units.map((u) => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
