'use client';

import { useState } from 'react';
import { Copy, Check, Trash2 } from 'lucide-react';
import { generateUUID } from '@/tools/developer/index';

export function UuidGeneratorTool() {
  const [uuids, setUuids] = useState<string[]>([]);
  const [count, setCount] = useState(1);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [allCopied, setAllCopied] = useState(false);

  const handleGenerate = () => {
    const newUuids = Array.from({ length: count }, () => generateUUID());
    setUuids((prev) => [...newUuids, ...prev]);
  };

  const handleCopy = async (text: string, idx: number) => {
    await navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const handleCopyAll = async () => {
    await navigator.clipboard.writeText(uuids.join('\n'));
    setAllCopied(true);
    setTimeout(() => setAllCopied(false), 2000);
  };

  const handleClear = () => setUuids([]);

  return (
    <div className="card">
      <div className="space-y-4">
        <div>
          <label className="label">Number of UUIDs</label>
          <input
            type="number"
            value={count}
            onChange={(e) => setCount(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))}
            className="input mt-1 w-32"
            min={1}
            max={100}
          />
        </div>

        <div className="flex gap-2">
          <button onClick={handleGenerate} className="btn-primary">Generate</button>
          {uuids.length > 0 && (
            <>
              <button onClick={handleCopyAll} className="btn-secondary flex items-center gap-1">
                {allCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {allCopied ? 'Copied All' : 'Copy All'}
              </button>
              <button onClick={handleClear} className="btn-secondary flex items-center gap-1 text-red-600 dark:text-red-400">
                <Trash2 className="h-4 w-4" />
                Clear
              </button>
            </>
          )}
        </div>

        {uuids.length > 0 && (
          <div className="max-h-64 space-y-1 overflow-auto">
            {uuids.map((uuid, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2 dark:bg-gray-800/50">
                <code className="font-mono text-xs text-gray-800 dark:text-gray-200">{uuid}</code>
                <button onClick={() => handleCopy(uuid, i)} className="ml-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                  {copiedIdx === i ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
