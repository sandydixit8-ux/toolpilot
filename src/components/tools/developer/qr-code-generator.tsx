'use client';

import { useState, useEffect, useCallback } from 'react';
import QRCode from 'qrcode';

export function QrCodeGeneratorTool() {
  const [text, setText] = useState('https://www.toolpilotpro.in');
  const [dark, setDark] = useState('#1d4ed8');
  const [light, setLight] = useState('#ffffff');
  const [dataUrl, setDataUrl] = useState('');

  useEffect(() => {
    let cancelled = false;
    const render = async () => {
      try {
        const url = await QRCode.toDataURL(text || ' ', {
          width: 256,
          margin: 2,
          color: { dark, light },
        });
        if (!cancelled) setDataUrl(url);
      } catch {
        if (!cancelled) setDataUrl('');
      }
    };
    render();
    return () => {
      cancelled = true;
    };
  }, [text, dark, light]);

  const download = useCallback(() => {
    if (!dataUrl) return;
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = 'qrcode.png';
    a.click();
  }, [dataUrl]);

  return (
    <div className="card">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div>
            <label className="label">Content</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="input mt-1 min-h-[120px]"
              rows={5}
              placeholder="Enter a URL, text, or contact info..."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Foreground</label>
              <input
                type="color"
                value={dark}
                onChange={(e) => setDark(e.target.value)}
                className="mt-1 h-10 w-full cursor-pointer rounded-lg border border-gray-300 bg-white dark:border-gray-700"
              />
            </div>
            <div>
              <label className="label">Background</label>
              <input
                type="color"
                value={light}
                onChange={(e) => setLight(e.target.value)}
                className="mt-1 h-10 w-full cursor-pointer rounded-lg border border-gray-300 bg-white dark:border-gray-700"
              />
            </div>
          </div>
          {!dataUrl && <p className="text-sm text-red-600 dark:text-red-400">Enter some content to generate the QR code.</p>}
        </div>

        <div className="flex flex-col items-center justify-center gap-4">
          <p className="label">Preview</p>
          {dataUrl ? (
            <>
              <img src={dataUrl} alt="Generated QR code" className="rounded-lg border border-gray-200 dark:border-gray-700" width={200} height={200} />
              <button
                onClick={download}
                className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-brand-700"
              >
                Download PNG
              </button>
            </>
          ) : (
            <div className="flex h-56 w-56 items-center justify-center rounded-lg border border-dashed border-gray-300 text-sm text-gray-400 dark:border-gray-700">
              No QR yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
}