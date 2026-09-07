'use client';

import { useState, useCallback } from 'react';
import { Copy, Check, RefreshCw, Shield } from 'lucide-react';

const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWER = 'abcdefghijklmnopqrstuvwxyz';
const DIGITS = '0123456789';
const SYMBOLS = '!@#$%^&*()-_=+[]{};:,.<>?';
const AMBIGUOUS = /[O0Il1]/g;

interface Options {
  length: number;
  upper: boolean;
  lower: boolean;
  numbers: boolean;
  symbols: boolean;
  noAmbiguous: boolean;
}

type BoolKeys = 'upper' | 'lower' | 'numbers' | 'symbols' | 'noAmbiguous';

function generate(opts: Options): string {
  let pool = '';
  if (opts.upper) pool += UPPER;
  if (opts.lower) pool += LOWER;
  if (opts.numbers) pool += DIGITS;
  if (opts.symbols) pool += SYMBOLS;
  if (opts.noAmbiguous) pool = pool.replace(AMBIGUOUS, '');
  if (!pool) return '';

  const bytes = new Uint32Array(opts.length);
  crypto.getRandomValues(bytes);
  let result = '';
  for (let i = 0; i < opts.length; i++) {
    result += pool[bytes[i] % pool.length];
  }
  return result;
}

function strengthScore(pw: string): number {
  if (!pw) return 0;
  let score = 0;
  if (pw.length >= 12) score += 1;
  if (pw.length >= 16) score += 1;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score += 1;
  if (/\d/.test(pw)) score += 1;
  if (/[^a-zA-Z0-9]/.test(pw)) score += 1;
  return score;
}

const DEFAULT_OPTS: Options = { length: 16, upper: true, lower: true, numbers: true, symbols: true, noAmbiguous: false };

export function PasswordGeneratorTool() {
  const [opts, setOpts] = useState<Options>(DEFAULT_OPTS);
  const [password, setPassword] = useState(() => generate(DEFAULT_OPTS));
  const [copied, setCopied] = useState(false);

  const regenerate = useCallback(() => {
    setPassword(generate(opts));
    setCopied(false);
  }, [opts]);

  const strength = strengthScore(password);
  const strengthLabel = strength <= 1 ? 'Weak' : strength === 2 ? 'Fair' : strength <= 4 ? 'Good' : 'Strong';

  const toggle = (key: BoolKeys) => {
    setOpts((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="card">
      <div className="space-y-6">
        <div>
          <label className="label">Generated Password</label>
          <div className="mt-1 flex gap-2">
            <input
              readOnly
              value={password}
              className="input flex-1 font-mono"
            />
            <button
              onClick={handleCopy}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-gray-300 px-4 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
              title="Copy password"
            >
              {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <Shield className="h-4 w-4 text-brand-600 dark:text-brand-400" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Strength: <strong className={strength === 0 ? 'text-red-500' : strength <= 2 ? 'text-amber-500' : 'text-green-600 dark:text-green-400'}>{strengthLabel}</strong>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="label">
              Length: <span className="text-brand-600 dark:text-brand-400">{opts.length}</span>
            </label>
            <input
              type="range"
              min={6}
              max={64}
              value={opts.length}
              onChange={(e) => setOpts((prev) => ({ ...prev, length: Number(e.target.value) }))}
              className="mt-2 w-full accent-brand-500"
            />
          </div>
          <div className="flex flex-wrap items-center gap-4">
            {(
              [
                ['upper', 'Uppercase (A-Z)'],
                ['lower', 'Lowercase (a-z)'],
                ['numbers', 'Numbers (0-9)'],
                ['symbols', 'Symbols (!@#$)'],
                ['noAmbiguous', 'Avoid similar chars (O,0,l,1)'],
              ] as [BoolKeys, string][]
            ).map(([key, label]) => (
              <label key={key} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                <input
                  type="checkbox"
                  checked={opts[key]}
                  onChange={() => toggle(key)}
                  className="h-4 w-4 rounded border-gray-300 accent-blue-600"
                />
                {label}
              </label>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={regenerate}
            className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-brand-700"
          >
            <RefreshCw className="h-4 w-4" />
            Generate Password
          </button>
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            <Copy className="h-4 w-4" />
            Copy
          </button>
        </div>
      </div>
    </div>
  );
}