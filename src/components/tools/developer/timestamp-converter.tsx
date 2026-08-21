'use client';

import { useState, useMemo } from 'react';
import { ArrowRightLeft } from 'lucide-react';
import { timestampToDate, dateToTimestamp } from '@/tools/developer/index';

export function TimestampConverterTool() {
  const [timestamp, setTimestamp] = useState('');
  const [dateStr, setDateStr] = useState('');

  const dateResult = useMemo(() => {
    if (!timestamp.trim()) return null;
    try {
      const d = timestampToDate(timestamp);
      if (isNaN(d.getTime())) return null;
      return {
        iso: d.toISOString(),
        utc: d.toUTCString(),
        local: d.toLocaleString(),
      };
    } catch {
      return null;
    }
  }, [timestamp]);

  const timestampResult = useMemo(() => {
    if (!dateStr.trim()) return null;
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return null;
      return dateToTimestamp(d);
    } catch {
      return null;
    }
  }, [dateStr]);

  const swap = () => {
    if (dateResult) {
      setTimestamp('');
      setDateStr(dateResult.iso);
    } else if (timestampResult) {
      setDateStr('');
      setTimestamp(String(timestampResult));
    }
  };

  return (
    <div className="card">
      <div className="space-y-6">
        <div>
          <label className="label">Unix Timestamp</label>
          <input
            type="text"
            value={timestamp}
            onChange={(e) => setTimestamp(e.target.value)}
            className="input mt-1 font-mono text-sm"
            placeholder="e.g. 1700000000"
          />
          {dateResult && (
            <div className="mt-3 space-y-1 rounded-lg bg-gray-50 p-3 dark:bg-gray-800/50">
              <div className="text-xs text-gray-500 dark:text-gray-400">ISO 8601</div>
              <div className="font-mono text-sm text-gray-800 dark:text-gray-200">{dateResult.iso}</div>
              <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">UTC</div>
              <div className="font-mono text-sm text-gray-800 dark:text-gray-200">{dateResult.utc}</div>
              <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">Local</div>
              <div className="font-mono text-sm text-gray-800 dark:text-gray-200">{dateResult.local}</div>
            </div>
          )}
        </div>

        <div className="flex justify-center">
          <button onClick={swap} className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800" title="Swap">
            <ArrowRightLeft className="h-5 w-5" />
          </button>
        </div>

        <div>
          <label className="label">Human-Readable Date</label>
          <input
            type="datetime-local"
            value={dateStr}
            onChange={(e) => setDateStr(e.target.value)}
            className="input mt-1"
          />
          {timestampResult !== null && (
            <div className="mt-3 rounded-lg bg-gray-50 p-3 dark:bg-gray-800/50">
              <div className="text-xs text-gray-500 dark:text-gray-400">Unix Timestamp (seconds)</div>
              <div className="mt-1 font-mono text-lg font-bold text-brand-600 dark:text-brand-400">{timestampResult}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
