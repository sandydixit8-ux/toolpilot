'use client';

import { useState } from 'react';
import { Copy, Check, Sparkles } from 'lucide-react';

const AI_PHRASE_REPLACEMENTS: Record<string, string> = {
  'it is important to note': 'notably,',
  'it is worth noting': 'worth mentioning,',
  'in conclusion': 'to wrap things up',
  'furthermore': 'also',
  'moreover': 'on top of that',
  'additionally': 'plus',
  'in order to': 'to',
  'due to the fact that': 'because',
  'in the event that': 'if',
  'at this point in time': 'now',
  'for the purpose of': 'to',
  'in a nutshell': 'briefly',
  'leverage': 'use',
  'utilize': 'use',
  'facilitate': 'help',
  'implement': 'set up',
  'demonstrate': 'show',
  'subsequent': 'next',
  'preceding': 'previous',
  'comprehensive': 'thorough',
  'enhance': 'improve',
  'establish': 'set up',
  'endeavor': 'try',
  'commence': 'start',
  'terminate': 'end',
  'aggregate': 'total',
  'aforementioned': 'this',
};

const CONTRACTIONS: Record<string, string> = {
  'do not': "don't",
  'does not': "doesn't",
  'did not': "didn't",
  'cannot': "can't",
  'will not': "won't",
  'would not': "wouldn't",
  'should not': "shouldn't",
  'could not': "couldn't",
  'I am': "I'm",
  'you are': "you're",
  'we are': "we're",
  'they are': "they're",
  'it is': "it's",
  'that is': "that's",
  'there is': "there's",
  'here is': "here's",
  'what is': "what's",
  'I have': "I've",
  'you have': "you've",
  'we have': "we've",
  'they have': "they've",
  'I will': "I'll",
  'you will': "you'll",
  'we will': "we'll",
  'they will': "they'll",
  'I would': "I'd",
  'you would': "you'd",
  'we would': "we'd",
  'they would': "they'd",
};

function humanizeText(text: string): string {
  let result = text;

  // Replace formal AI phrases
  for (const [phrase, replacement] of Object.entries(AI_PHRASE_REPLACEMENTS)) {
    const regex = new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    result = result.replace(regex, replacement);
  }

  // Apply contractions
  for (const [formal, contraction] of Object.entries(CONTRACTIONS)) {
    const regex = new RegExp(`\\b${formal.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'g');
    result = result.replace(regex, contraction);
  }

  // Vary sentence structure: occasionally merge short adjacent sentences
  const sentences = result.split(/(?<=[.!?])\s+/);
  const varied: string[] = [];
  let i = 0;
  while (i < sentences.length) {
    if (
      i + 1 < sentences.length &&
      sentences[i].length < 40 &&
      sentences[i + 1].length < 40 &&
      !sentences[i].endsWith(':')
    ) {
      const merged = sentences[i].replace(/[.!?]$/, ',') + ' ' + sentences[i + 1].charAt(0).toLowerCase() + sentences[i + 1].slice(1);
      varied.push(merged);
      i += 2;
    } else {
      varied.push(sentences[i]);
      i++;
    }
  }

  return varied.join(' ');
}

export function AiTextHumanizerTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  const handleHumanize = () => {
    if (!input.trim()) return;
    setOutput(humanizeText(input));
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
          <label className="label">AI-Generated Text</label>
          <textarea
            className="input mt-1 min-h-[160px] w-full resize-y rounded-lg border border-gray-300 bg-white p-3 text-sm dark:border-gray-600 dark:bg-gray-800"
            placeholder="Paste your AI-generated text here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>

        <button onClick={handleHumanize} disabled={!input.trim()} className="btn-primary inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium disabled:opacity-50">
          <Sparkles className="h-4 w-4" />
          Humanize
        </button>

        {output && (
          <div>
            <div className="flex items-center justify-between">
              <label className="label">Humanized Text</label>
              <button onClick={handleCopy} className="btn-secondary inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium">
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <textarea
              className="input mt-1 min-h-[160px] w-full resize-y rounded-lg border border-gray-300 bg-white p-3 text-sm dark:border-gray-600 dark:bg-gray-800"
              readOnly
              value={output}
            />
          </div>
        )}
      </div>
    </div>
  );
}
