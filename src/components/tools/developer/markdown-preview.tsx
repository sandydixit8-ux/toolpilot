'use client';

import { useState } from 'react';
import { marked } from 'marked';
import { Copy, Check } from 'lucide-react';

const DEFAULT_MD = `# Heading 1

Write **markdown** on the left and see the *rendered* result here.

## Lists

- First item
- Second item
  1. Nested one
  2. Nested two

## Code

\`\`\`js
console.log("Hello, Markdown!");
\`\`\`

## Quote

> Markdown previews make it easy to check your formatting before publishing.

[Visit ToolPilot](https://www.toolpilotpro.in)`;

export function MarkdownPreviewTool() {
  const [md, setMd] = useState(DEFAULT_MD);
  const [copied, setCopied] = useState(false);
  const [html, setHtml] = useState<string>(() => marked.parse(DEFAULT_MD, { async: false }) as string);

  const render = (value: string) => {
    try {
      setHtml(marked.parse(value, { async: false }) as string);
    } catch {
      setHtml('<p class="text-red-500">There was an error parsing your markdown.</p>');
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(html);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="card">
      <div className="mb-4 flex items-center justify-between">
        <label className="label mb-0">Markdown Editor</label>
        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 px-4 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? 'Copied HTML' : 'Copy HTML'}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div>
          <textarea
            value={md}
            onChange={(e) => {
              setMd(e.target.value);
              render(e.target.value);
            }}
            spellCheck={false}
            className="input min-h-[320px] font-mono text-xs leading-relaxed lg:h-full"
          />
        </div>
        <div>
          <span className="label">Preview</span>
          <div
            className="prose-sm prose prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-brand-600 prose-blockquote:border-l-brand-600 prose-code:bg-gray-100 prose-code:text-gray-800 dark:prose-invert mt-1 min-h-[320px] overflow-auto rounded-lg border border-gray-200 bg-white p-4 lg:h-[420px] dark:border-gray-700 dark:bg-gray-900 dark:prose-headings:text-gray-100"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      </div>
    </div>
  );
}