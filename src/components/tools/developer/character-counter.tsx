'use client';

import { useState, useMemo } from 'react';
import { countWords } from '@/tools/developer/index';

export function CharacterCounterTool() {
  const [text, setText] = useState('');

  const stats = useMemo(() => countWords(text), [text]);

  const items = [
    { label: 'Characters', value: stats.chars },
    { label: 'Characters (no spaces)', value: stats.charsNoSpaces },
    { label: 'Words', value: stats.words },
    { label: 'Sentences', value: stats.sentences },
    { label: 'Paragraphs', value: stats.paragraphs },
    { label: 'Reading Time', value: `${stats.readingTime} min` },
  ];

  const limits = [
    { label: 'X / Twitter', limit: 280 },
    { label: 'LinkedIn Post', limit: 3000 },
    { label: 'Instagram Caption', limit: 2200 },
    { label: 'TikTok Caption', limit: 2200 },
    { label: 'Facebook Post', limit: 63206 },
  ];

  return (
    <div className="card">
      <div className="space-y-4">
        <div>
          <label className="label">Input Text</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="input mt-1 min-h-[180px]"
            rows={8}
            placeholder="Start typing or paste your text here..."
          />
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {items.map((item) => (
            <div key={item.label} className="rounded-lg bg-gray-50 p-3 text-center dark:bg-gray-800/50">
              <div className="text-2xl font-bold text-brand-600 dark:text-brand-400">{item.value}</div>
              <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">{item.label}</div>
            </div>
          ))}
        </div>

        <div>
          <label className="label">Social Media Character Limits</label>
          <div className="mt-1 space-y-2">
            {limits.map((l) => {
              const pct = Math.min(100, (stats.chars / l.limit) * 100);
              const over = stats.chars > l.limit;
              return (
                <div key={l.label} className="flex items-center gap-3">
                  <span className="w-36 shrink-0 text-xs text-gray-500 dark:text-gray-400">{l.label}</span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                    <div
                      className={`h-full rounded-full ${over ? 'bg-red-500' : pct > 85 ? 'bg-amber-500' : 'bg-brand-600'}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className={`w-20 shrink-0 text-right text-xs ${over ? 'font-semibold text-red-500' : 'text-gray-500 dark:text-gray-400'}`}>
                    {stats.chars} / {l.limit}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}