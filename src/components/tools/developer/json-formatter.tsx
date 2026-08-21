'use client';

import { useState } from 'react';
import { Copy, Check, AlertCircle } from 'lucide-react';
import { formatJSON, validateJSON, minifyJSON } from '@/tools/developer/index';

type Tab = 'format' | 'validate' | 'minify';

export function JsonFormatterTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleAction = (action: Tab) => {
    setError('');
    try {
      if (action === 'format') {
        setOutput(formatJSON(input));
      } else if (action === 'validate') {
        const result = validateJSON(input);
        if (result.valid) {
          setOutput('✓ Valid JSON');
        } else {
          setOutput('');
          setError(result.error || 'Invalid JSON');
        }
      } else {
        setOutput(minifyJSON(input));
      }
    } catch (e) {
      setError((e as Error).message);
      setOutput('');
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
          <label className="label">Input JSON</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="input mt-1 font-mono text-sm"
            rows={8}
            placeholder='{"key": "value"}'
          />
        </div>

        <div className="flex gap-2">
          <button onClick={() => handleAction('format')} className="btn-primary">Format</button>
          <button onClick={() => handleAction('validate')} className="btn-secondary">Validate</button>
          <button onClick={() => handleAction('minify')} className="btn-secondary">Minify</button>
        </div>

        {error && (
          <div className="flex items-start gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/50 dark:text-red-300">
            <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
            <span className="font-mono text-xs">{error}</span>
          </div>
        )}

        {output && (
          <div>
            <div className="flex items-center justify-between">
              <label className="label">Result</label>
              <button onClick={handleCopy} className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
            <pre className="mt-1 max-h-80 overflow-auto rounded-lg bg-gray-50 p-4 font-mono text-xs dark:bg-gray-800/50">{output}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
