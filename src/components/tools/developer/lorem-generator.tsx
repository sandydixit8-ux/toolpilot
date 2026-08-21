'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { generateLorem } from '@/tools/developer/index';

export function LoremGeneratorTool() {
  const [paragraphs, setParagraphs] = useState(3);
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    setOutput(generateLorem(Math.max(1, Math.min(20, paragraphs))));
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="card">
      <div className="space-y-4">
        <div>
          <label className="label">Number of Paragraphs</label>
          <input
            type="number"
            value={paragraphs}
            onChange={(e) => setParagraphs(Math.max(1, Math.min(20, parseInt(e.target.value) || 1)))}
            className="input mt-1 w-32"
            min={1}
            max={20}
          />
        </div>

        <button onClick={handleGenerate} className="btn-primary">Generate</button>

        {output && (
          <div>
            <div className="flex items-center justify-between">
              <label className="label">Generated Text</label>
              <button onClick={handleCopy} className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
            <textarea
              readOnly
              value={output}
              className="input mt-1"
              rows={10}
            />
          </div>
        )}
      </div>
    </div>
  );
}
