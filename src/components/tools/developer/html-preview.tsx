'use client';

import { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw } from 'lucide-react';

const DEFAULT_HTML = `<h1>Hello, world!</h1>
<p>This is a <strong>live HTML preview</strong>. Edit the code on the left and see the result instantly.</p>
<button style="padding: 8px 16px; background: #2563eb; color: white; border: 0; border-radius: 6px; cursor: pointer;">Click me</button>`;

export function HtmlPreviewTool() {
  const [html, setHtml] = useState(DEFAULT_HTML);
  const [renderKey, setRenderKey] = useState(0);
  const [error, setError] = useState(false);
  const frameRef = useRef<HTMLIFrameElement>(null);

  const run = () => {
    setError(false);
    setRenderKey((k) => k + 1);
  };

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;
    try {
      const doc = frame.contentDocument;
      if (doc) {
        doc.open();
        doc.write(html);
        doc.close();
      }
    } catch {
      setError(true);
    }
  }, [html, renderKey]);

  return (
    <div className="card">
      <div className="mb-4 flex items-center justify-between">
        <label className="label mb-0">HTML Editor</label>
        <div className="flex gap-2">
          <button
            onClick={run}
            className="inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-brand-700"
          >
            <Play className="h-3.5 w-3.5" />
            Run
          </button>
          <button
            onClick={() => setHtml(DEFAULT_HTML)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 px-4 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div>
          <textarea
            value={html}
            onChange={(e) => setHtml(e.target.value)}
            spellCheck={false}
            className="input min-h-[320px] font-mono text-xs leading-relaxed lg:h-full"
          />
        </div>
        <div>
          <div className="flex items-center justify-between">
            <span className="label">Preview</span>
            {error && <span className="text-xs text-red-500">Could not render</span>}
          </div>
          <div className="mt-1 h-[320px] overflow-auto rounded-lg border border-gray-200 bg-white dark:border-gray-700 lg:h-[420px]">
            <iframe
              key={renderKey}
              ref={frameRef}
              title="HTML Preview"
              sandbox="allow-modals"
              className="h-full w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}