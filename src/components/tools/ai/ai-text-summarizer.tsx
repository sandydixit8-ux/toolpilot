'use client';

import { useState } from 'react';
import { Copy, Check, Sparkles } from 'lucide-react';

type SummaryLength = 'short' | 'medium' | 'long';

const LENGTH_CONFIG: Record<SummaryLength, { label: string; maxSentences: number; maxChars: number }> = {
  short: { label: 'Short (1-2 sentences)', maxSentences: 2, maxChars: 200 },
  medium: { label: 'Medium (3-4 sentences)', maxSentences: 4, maxChars: 400 },
  long: { label: 'Long (5-6 sentences)', maxSentences: 6, maxChars: 600 },
};

function summarizeText(text: string, length: SummaryLength): string {
  const config = LENGTH_CONFIG[length];
  const paragraphs = text.split(/\n\s*\n/).filter((p) => p.trim().length > 0);

  // Extract the first sentence from each paragraph
  const firstSentences: string[] = [];
  for (const para of paragraphs) {
    const match = para.match(/^[^.!?]*[.!?]/);
    if (match) {
      firstSentences.push(match[0].trim());
    } else if (para.trim().length > 0) {
      firstSentences.push(para.trim().slice(0, 100));
    }
    if (firstSentences.length >= config.maxSentences) break;
  }

  let summary = firstSentences.join(' ');

  // Trim to max characters if needed
  if (summary.length > config.maxChars) {
    summary = summary.slice(0, config.maxChars).replace(/\s+\S*$/, '') + '...';
  }

  return summary || 'No summary could be generated from the provided text.';
}

export function AiTextSummarizerTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [length, setLength] = useState<SummaryLength>('medium');
  const [copied, setCopied] = useState(false);

  const handleSummarize = () => {
    if (!input.trim()) return;
    setOutput(summarizeText(input, length));
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="card">
      <div className="space-y-6">
        <div>
          <label className="label">Text to Summarize</label>
          <textarea
            className="input mt-1 min-h-[180px] resize-y"
            placeholder="Paste a long article, essay, or document here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>

        <div>
          <label className="label">Summary Length</label>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {(Object.entries(LENGTH_CONFIG) as [SummaryLength, (typeof LENGTH_CONFIG)[SummaryLength]][]).map(([key, config]) => (
              <button
                key={key}
                onClick={() => setLength(key)}
                className={`rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                  length === key
                    ? 'bg-brand-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300'
                }`}
              >
                {config.label}
              </button>
            ))}
          </div>
        </div>

        <button onClick={handleSummarize} disabled={!input.trim()} className="btn-primary inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium disabled:opacity-50">
          <Sparkles className="h-4 w-4" />
          Summarize
        </button>

        {output && (
          <div>
            <div className="flex items-center justify-between">
              <label className="label">Summary</label>
              <button onClick={handleCopy} className="btn-secondary inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium">
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <textarea
              className="input mt-1 min-h-[100px] resize-y"
              readOnly
              value={output}
            />
          </div>
        )}
      </div>
    </div>
  );
}
