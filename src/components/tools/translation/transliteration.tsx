'use client';

import { useState } from 'react';
import { Type, Copy, Repeat, Loader2, AlertCircle } from 'lucide-react';

export function TransliterationTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [candidates, setCandidates] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleConvert = async () => {
    const text = input.trim();
    if (!text) return;
    setLoading(true);
    setError('');
    setOutput('');
    setCandidates([]);
    try {
      const res = await fetch('/api/transliterate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error || 'Transliteration failed. Please try again.');
      } else {
        setOutput(data?.transliterated || '');
        setCandidates(data?.candidates || []);
      }
    } catch {
      setError('Failed to transliterate. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard not available
    }
  };

  return (
    <div className="card">
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Type className="h-5 w-5 text-blue-500" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            English to Hindi Transliteration
          </h2>
        </div>

        <p className="text-sm text-gray-500 dark:text-gray-400">
          Type Hindi using English letters (Roman) and instantly get Devanagari —
          e.g. &quot;namaste dosto&quot; becomes &quot;नमस्ते दोस्तो&quot;.
        </p>

        <div>
          <label className="text-xs font-medium text-gray-500 dark:text-gray-400">
            Roman Hindi
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={4}
            placeholder="e.g. namaste dosto, aaj hum seekhenge"
            className="mt-1 w-full rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm text-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleConvert}
            disabled={loading || !input.trim()}
            className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-60"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Repeat className="h-4 w-4" />
            )}
            Convert
          </button>
          {output && (
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              <Copy className="h-4 w-4" />
              {copied ? 'Copied!' : 'Copy'}
            </button>
          )}
        </div>

        {error && (
          <div className="flex items-start gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/50 dark:text-red-300">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        {output && (
          <div className="rounded-xl bg-gray-50 p-5 dark:bg-gray-800/50">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              Devanagari (Hindi)
            </h3>
            <p className="mt-3 text-lg leading-relaxed text-gray-800 dark:text-gray-200">
              {output}
            </p>

            {candidates.length > 1 && (
              <div className="mt-4">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  Alternatives
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {candidates.slice(1).map((c, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setOutput(c);
                        setCopied(false);
                      }}
                      className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 hover:border-brand-500 hover:text-brand-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="rounded-lg bg-blue-50 p-4 text-xs text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">
          <strong>Tip:</strong> Works offline-ready with smart suggestions — try short phrases like
          &quot;main aaj ghar jaunga&quot; or &quot;yeh kitna hoga&quot;.
        </div>
      </div>
    </div>
  );
}