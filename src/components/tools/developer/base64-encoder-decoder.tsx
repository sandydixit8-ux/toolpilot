'use client';

import { useState } from 'react';
import { Copy, Check, ArrowDown, X } from 'lucide-react';

function bytesToBase64(bytes: Uint8Array): string {
  let binary = '';
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode.apply(null, Array.from(bytes.subarray(i, i + chunk)));
  }
  return btoa(binary);
}

function base64ToBytes(b64: string): Uint8Array {
  const binary = atob(b64.trim());
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

export function Base64EncoderDecoderTool() {
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const countChars = (s: string) => `~${new Blob([s]).size.toLocaleString('en-IN')} bytes`;

  const run = () => {
    setError('');
    setCopied(false);
    if (!input) {
      setOutput('');
      return;
    }
    try {
      if (mode === 'encode') {
        const bytes = new TextEncoder().encode(input);
        setOutput(bytesToBase64(bytes));
      } else {
        const bytes = base64ToBytes(input);
        setOutput(new TextDecoder('utf-8').decode(bytes));
      }
    } catch {
      setError(mode === 'decode' ? 'Invalid base64 string. Check your input and try again.' : 'Could not encode the input.');
      setOutput('');
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  const swap = () => {
    setMode((m) => (m === 'encode' ? 'decode' : 'encode'));
    setInput('');
    setOutput('');
    setError('');
    setCopied(false);
  };

  return (
    <div className="card">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex overflow-hidden rounded-lg border border-gray-300 dark:border-gray-700">
            {(['encode', 'decode'] as const).map((m) => (
              <button
                key={m}
                onClick={() => {
                  setMode(m);
                  setInput('');
                  setOutput('');
                  setError('');
                  setCopied(false);
                }}
                className={`px-4 py-2 text-sm font-medium capitalize ${
                  mode === m
                    ? 'bg-brand-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
          <div className="ml-auto text-sm text-gray-500 dark:text-gray-400">{countChars(input)}</div>
        </div>

        <div>
          <label className="label">{mode === 'encode' ? 'Plain Text' : 'Base64 Input'}</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="input mt-1 min-h-[140px]"
            rows={5}
            spellCheck={false}
            placeholder={mode === 'encode' ? 'Enter text to encode to base64...' : 'Enter base64 to decode...'}
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={run}
            className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-brand-700"
          >
            {mode === 'encode' ? 'Encode' : 'Decode'}
          </button>
          <button
            onClick={swap}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            <ArrowDown className="h-4 w-4 rotate-90" />
            Switch Mode
          </button>
          <button
            onClick={() => {
              setInput('');
              setOutput('');
              setError('');
              setCopied(false);
            }}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            <X className="h-4 w-4" />
            Clear
          </button>
        </div>

        {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

        <div>
          <div className="flex items-center justify-between">
            <label className="label">{mode === 'encode' ? 'Base64 Output' : 'Decoded Text'}</label>
            {output && (
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            )}
          </div>
          <div className="mt-1 min-h-[140px] overflow-auto rounded-lg border border-gray-200 bg-gray-50 p-3 font-mono text-sm break-all whitespace-pre-wrap dark:border-gray-700 dark:bg-gray-900">
            {output || <span className="text-gray-400">Output will appear here...</span>}
          </div>
        </div>
      </div>
    </div>
  );
}