'use client';

import { useState } from 'react';

export function TimeCalculatorTool() {
  const [mode, setMode] = useState<'add' | 'sub' | 'conv'>('add');
  const [h1, setH1] = useState('');
  const [m1, setM1] = useState('');
  const [s1, setS1] = useState('');
  const [h2, setH2] = useState('');
  const [m2, setM2] = useState('');
  const [s2, setS2] = useState('');
  const [convVal, setConvVal] = useState('');
  const [convFrom, setConvFrom] = useState('hours');

  const toSec = (h: string, m: string, s: string) => (parseInt(h) || 0) * 3600 + (parseInt(m) || 0) * 60 + (parseInt(s) || 0);
  const fromSec = (sec: number) => ({ h: Math.floor(sec / 3600), m: Math.floor((sec % 3600) / 60), s: sec % 60 });

  let result = '';

  if (mode === 'add') {
    const total = toSec(h1, m1, s1) + toSec(h2, m2, s2);
    const t = fromSec(total);
    result = `${t.h}h ${t.m}m ${t.s}s`;
  } else if (mode === 'sub') {
    const total = Math.max(0, toSec(h1, m1, s1) - toSec(h2, m2, s2));
    const t = fromSec(total);
    result = `${t.h}h ${t.m}m ${t.s}s`;
  } else {
    const v = parseFloat(convVal) || 0;
    let totalSec = 0;
    if (convFrom === 'hours') totalSec = v * 3600;
    else if (convFrom === 'minutes') totalSec = v * 60;
    else totalSec = v;
    const days = Math.floor(totalSec / 86400);
    const t = fromSec(totalSec % 86400);
    result = days > 0 ? `${days}d ${t.h}h ${t.m}m ${t.s}s` : `${t.h}h ${t.m}m ${t.s}s`;
  }

  return (
    <div className="card">
      <div className="space-y-6">
        <div>
          <label className="label">Mode</label>
          <div className="mt-2 grid grid-cols-3 gap-2">
            <button onClick={() => setMode('add')} className={`rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${mode === 'add' ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'}`}>Add</button>
            <button onClick={() => setMode('sub')} className={`rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${mode === 'sub' ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'}`}>Subtract</button>
            <button onClick={() => setMode('conv')} className={`rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${mode === 'conv' ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'}`}>Convert</button>
          </div>
        </div>

        {mode === 'conv' ? (
          <div>
            <label className="label">Value</label>
            <input type="number" value={convVal} onChange={(e) => setConvVal(e.target.value)} className="input mt-1" />
            <select value={convFrom} onChange={(e) => setConvFrom(e.target.value)} className="input mt-2">
              <option value="hours">Hours</option>
              <option value="minutes">Minutes</option>
              <option value="seconds">Seconds</option>
            </select>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Time 1</label>
              <div className="mt-1 grid grid-cols-3 gap-1">
                <input type="number" value={h1} onChange={(e) => setH1(e.target.value)} placeholder="H" className="input text-center" min="0" />
                <input type="number" value={m1} onChange={(e) => setM1(e.target.value)} placeholder="M" className="input text-center" min="0" max="59" />
                <input type="number" value={s1} onChange={(e) => setS1(e.target.value)} placeholder="S" className="input text-center" min="0" max="59" />
              </div>
            </div>
            <div>
              <label className="label">Time 2</label>
              <div className="mt-1 grid grid-cols-3 gap-1">
                <input type="number" value={h2} onChange={(e) => setH2(e.target.value)} placeholder="H" className="input text-center" min="0" />
                <input type="number" value={m2} onChange={(e) => setM2(e.target.value)} placeholder="M" className="input text-center" min="0" max="59" />
                <input type="number" value={s2} onChange={(e) => setS2(e.target.value)} placeholder="S" className="input text-center" min="0" max="59" />
              </div>
            </div>
          </div>
        )}

        <div className="rounded-xl bg-gray-50 p-5 text-center dark:bg-gray-800/50">
          <p className="text-xs text-gray-500 dark:text-gray-400">Result</p>
          <p className="mt-1 text-2xl font-bold text-brand-600 dark:text-brand-400">{result}</p>
        </div>
      </div>
    </div>
  );
}
