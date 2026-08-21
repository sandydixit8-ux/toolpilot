'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { encodeURL, decodeURL } from '@/tools/developer/index';

export function UrlEncoderTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  const handleEncode = () => {
    try {
      setOutput(encodeURL(input));
    } catch {
      setOutput('Error: Invalid input');
    }
  };

  const handleDecode = () => {
    try {
      setOutput(decodeURL(input));
    } catch {
      setOutput('Error: Invalid URL encoded string');
    }
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
          <label className="label">Input</label>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="input mt-1 font-mono text-sm"
            placeholder="Enter text or URL encoded string..."
          />
        </div>

        <div className="flex gap-2">
          <button onClick={handleEncode} className="btn-primary">Encode</button>
          <button onClick={handleDecode} className="btn-secondary">Decode</button>
        </div>

        {output && (
          <div>
            <div className="flex items-center justify-between">
              <label className="label">Result</label>
              <button onClick={handleCopy} className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
            <input
              type="text"
              readOnly
              value={output}
              className="input mt-1 font-mono text-sm"
            />
          </div>
        )}
      </div>
    </div>
  );
}
