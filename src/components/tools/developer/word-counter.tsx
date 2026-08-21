'use client';

import { useState, useMemo } from 'react';
import { countWords } from '@/tools/developer/index';

export function WordCounterTool() {
  const [text, setText] = useState('');

  const stats = useMemo(() => countWords(text), [text]);

  const items = [
    { label: 'Words', value: stats.words },
    { label: 'Characters', value: stats.chars },
    { label: 'Characters (no spaces)', value: stats.charsNoSpaces },
    { label: 'Sentences', value: stats.sentences },
    { label: 'Paragraphs', value: stats.paragraphs },
    { label: 'Reading Time', value: `${stats.readingTime} min` },
  ];

  return (
    <div className="card">
      <div className="space-y-4">
        <div>
          <label className="label">Input Text</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="input mt-1"
            rows={10}
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
      </div>
    </div>
  );
}
