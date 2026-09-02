'use client';

import { useState } from 'react';
import { Languages, Copy, ArrowDownUp, Loader2, ArrowLeftRight, Check } from 'lucide-react';

const MAX_LIMIT_TEXT = 5000;

const LANGUAGES: { code: string; name: string }[] = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'Hindi' },
  { code: 'ta', name: 'Tamil' },
  { code: 'te', name: 'Telugu' },
  { code: 'kn', name: 'Kannada' },
  { code: 'ml', name: 'Malayalam' },
  { code: 'bn', name: 'Bengali' },
  { code: 'gu', name: 'Gujarati' },
  { code: 'mr', name: 'Marathi' },
  { code: 'pa', name: 'Punjabi' },
  { code: 'ur', name: 'Urdu' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'ar', name: 'Arabic' },
  { code: 'zh-CN', name: 'Chinese (Simplified)' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ru', name: 'Russian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'it', name: 'Italian' },
];

export function TextTranslatorTool() {
  const [text, setText] = useState('');
  const [sourceLang, setSourceLang] = useState('en');
  const [targetLang, setTargetLang] = useState('hi');
  const [translated, setTranslated] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleSwap = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    setText(translated);
    setTranslated(text);
    setError('');
  };

  const handleTranslate = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, sourceLang, targetLang }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Translation failed.');
        return;
      }
      setTranslated(data.translatedText);
    } catch {
      setError('Failed to reach the translation service. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(translated);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard not available
    }
  };

  const sourceLabel = LANGUAGES.find((l) => l.code === sourceLang)?.name || sourceLang;
  const targetLabel = LANGUAGES.find((l) => l.code === targetLang)?.name || targetLang;

  return (
    <div className="card">
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Languages className="h-5 w-5 text-blue-500" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Text Translator
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={sourceLang}
            onChange={(e) => setSourceLang(e.target.value)}
            className="input flex-1"
            aria-label="Source language"
          >
            {LANGUAGES.map((l) => (
              <option key={l.code} value={l.code}>{l.name}</option>
            ))}
          </select>
          <button
            onClick={handleSwap}
            title="Swap languages"
            className="rounded-lg border border-gray-300 p-2.5 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
            aria-label="Swap languages"
          >
            <ArrowLeftRight className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          </button>
          <select
            value={targetLang}
            onChange={(e) => setTargetLang(e.target.value)}
            className="input flex-1"
            aria-label="Target language"
          >
            {LANGUAGES.map((l) => (
              <option key={l.code} value={l.code}>{l.name}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <div className="mb-1 flex items-center justify-between">
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400">
                {sourceLabel}
              </label>
              <span className="text-xs text-gray-400">{text.length} chars</span>
            </div>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={5}
              placeholder="Enter text to translate..."
              className="w-full rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm text-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
            />
          </div>

          <div>
            <div className="mb-1 flex items-center justify-between">
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400">
                {targetLabel}
              </label>
              {translated && (
                <button
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {copied ? (
                    <Check className="h-3.5 w-3.5 text-green-500" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              )}
            </div>
            <textarea
              value={translated}
              readOnly
              rows={5}
              placeholder="Translation will appear here..."
              className="w-full rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm text-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
            />
          </div>
        </div>

        {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

        <button
          onClick={handleTranslate}
          disabled={loading || !text.trim()}
          className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Translating...
            </>
          ) : (
            <>
              <ArrowDownUp className="h-4 w-4" />
              Translate
            </>
          )}
        </button>

        <div className="rounded-lg bg-blue-50 p-4 text-xs text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">
          <strong>Note:</strong> Free translation supports up to {MAX_LIMIT_TEXT} characters per
          request across {LANGUAGES.length} languages. Works best for shorter sentences and paragraphs.
        </div>
      </div>
    </div>
  );
}
