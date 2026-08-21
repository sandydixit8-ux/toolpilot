'use client';

import { useState, useMemo } from 'react';
import { testRegex } from '@/tools/developer/index';

export function RegexTesterTool() {
  const [pattern, setPattern] = useState('');
  const [flags, setFlags] = useState('g');
  const [testString, setTestString] = useState('');

  const result = useMemo(() => {
    if (!pattern) return null;
    return testRegex(pattern, flags, testString);
  }, [pattern, flags, testString]);

  const highlighted = useMemo(() => {
    if (!result || !result.valid || result.matches.length === 0) return null;
    const parts: { text: string; highlight: boolean }[] = [];
    let lastIndex = 0;
    for (const m of result.matches) {
      if (m.index > lastIndex) {
        parts.push({ text: testString.slice(lastIndex, m.index), highlight: false });
      }
      parts.push({ text: m.value, highlight: true });
      lastIndex = m.index + m.value.length;
    }
    if (lastIndex < testString.length) {
      parts.push({ text: testString.slice(lastIndex), highlight: false });
    }
    return parts;
  }, [result, testString]);

  return (
    <div className="card">
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-2">
            <label className="label">Pattern</label>
            <input
              type="text"
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              className="input mt-1 font-mono text-sm"
              placeholder="e.g. \d+"
            />
          </div>
          <div>
            <label className="label">Flags</label>
            <input
              type="text"
              value={flags}
              onChange={(e) => setFlags(e.target.value)}
              className="input mt-1 font-mono text-sm"
              placeholder="g, i, m"
            />
          </div>
        </div>

        <div>
          <label className="label">Test String</label>
          <textarea
            value={testString}
            onChange={(e) => setTestString(e.target.value)}
            className="input mt-1 font-mono text-sm"
            rows={5}
            placeholder="Enter test string..."
          />
        </div>

        {result && !result.valid && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/50 dark:text-red-300">
            <span className="font-semibold">Error:</span> {result.error}
          </div>
        )}

        {result && result.valid && result.matches.length > 0 && (
          <div className="space-y-3">
            <div>
              <label className="label">Highlighted Matches</label>
              <div className="mt-1 rounded-lg bg-gray-50 p-4 font-mono text-sm leading-relaxed dark:bg-gray-800/50">
                {highlighted?.map((part, i) =>
                  part.highlight ? (
                    <mark key={i} className="rounded bg-yellow-200 px-0.5 text-gray-900 dark:bg-yellow-500/30 dark:text-yellow-200">{part.text}</mark>
                  ) : (
                    <span key={i}>{part.text}</span>
                  )
                )}
              </div>
            </div>

            <div>
              <label className="label">Match Details ({result.matches.length} matches)</label>
              <div className="mt-1 max-h-48 space-y-1 overflow-auto">
                {result.matches.map((m, i) => (
                  <div key={i} className="flex items-center justify-between rounded bg-gray-50 px-3 py-1.5 text-xs dark:bg-gray-800/50">
                    <code className="font-mono text-gray-800 dark:text-gray-200">&quot;{m.value}&quot;</code>
                    <span className="text-gray-500 dark:text-gray-400">index: {m.index}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {result && result.valid && result.matches.length === 0 && pattern && (
          <div className="rounded-lg bg-gray-50 p-3 text-sm text-gray-500 dark:bg-gray-800/50 dark:text-gray-400">No matches found.</div>
        )}
      </div>
    </div>
  );
}
