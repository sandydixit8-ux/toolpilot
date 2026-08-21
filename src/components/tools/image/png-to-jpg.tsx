/* eslint-disable @next/next/no-img-element */
'use client';

import { useState, useCallback } from 'react';
import { UploadBox } from '@/components/tools/upload-box';
import { Download } from 'lucide-react';
import { formatBytes } from '@/lib/utils';

interface ConvertedResult {
  file: File;
  url: string;
  blob: Blob;
}

export function PngToJpg() {
  const [files, setFiles] = useState<File[]>([]);
  const [quality, setQuality] = useState(92);
  const [bgColor, setBgColor] = useState('#ffffff');
  const [results, setResults] = useState<ConvertedResult[]>([]);
  const [processing, setProcessing] = useState(false);

  const handleFiles = useCallback((newFiles: File[]) => {
    setFiles((prev) => [...prev, ...newFiles]);
    setResults([]);
  }, []);

  const handleRemove = useCallback((index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setResults([]);
  }, []);

  const loadImage = (file: File): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });

  const handleConvert = async () => {
    setProcessing(true);
    try {
      const converted = await Promise.all(
        files.map(async (file) => {
          const img = await loadImage(file);
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d')!;

          ctx.fillStyle = bgColor;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0);
          URL.revokeObjectURL(img.src);

          const blob = await new Promise<Blob>((resolve) => {
            canvas.toBlob((b) => resolve(b!), 'image/jpeg', quality / 100);
          });

          return { file, url: URL.createObjectURL(blob), blob };
        })
      );
      setResults(converted);
    } finally {
      setProcessing(false);
    }
  };

  const handleDownload = (result: ConvertedResult) => {
    const a = document.createElement('a');
    a.href = result.url;
    a.download = result.file.name.replace(/\.[^.]+$/, '.jpg');
    a.click();
  };

  const handleDownloadAll = () => results.forEach(handleDownload);

  return (
    <div className="card space-y-6">
      <UploadBox
        onFiles={handleFiles}
        files={files}
        onRemove={handleRemove}
        accept={{ 'image/png': ['.png'] }}
      />

      {files.length > 0 && (
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <label className="label">Quality</label>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{quality}%</span>
            </div>
            <input
              type="range"
              min={10}
              max={100}
              value={quality}
              onChange={(e) => setQuality(Number(e.target.value))}
              className="mt-2 w-full accent-brand-500"
            />
          </div>

          <div>
            <label className="label">Background Color (for transparency)</label>
            <div className="mt-1 flex items-center gap-3">
              <input
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="h-10 w-10 cursor-pointer rounded border-0"
              />
              <input
                type="text"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="input w-32"
                placeholder="#ffffff"
              />
              <div className="flex gap-2">
                {['#ffffff', '#000000', '#ff0000', '#00ff00', '#0000ff'].map((c) => (
                  <button
                    key={c}
                    onClick={() => setBgColor(c)}
                    className="h-7 w-7 rounded-full border-2 border-gray-300 dark:border-gray-600"
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={handleConvert} disabled={processing} className="btn-primary">
              {processing ? 'Converting...' : 'Convert to JPG'}
            </button>
            {results.length > 0 && (
              <button onClick={handleDownloadAll} className="btn-secondary">
                Download All
              </button>
            )}
          </div>
        </div>
      )}

      {results.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Converted Files</h3>
          {results.map((result, i) => (
            <div
              key={i}
              className="flex items-center gap-4 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-800/50"
            >
              <img src={result.url} alt={result.file.name} className="h-16 w-16 rounded object-cover" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                  {result.file.name.replace(/\.[^.]+$/, '.jpg')}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  PNG ({formatBytes(result.file.size)}) → JPG ({formatBytes(result.blob.size)})
                </p>
              </div>
              <button
                onClick={() => handleDownload(result)}
                className="shrink-0 rounded-lg bg-brand-500 p-2 text-white hover:bg-brand-600 dark:bg-brand-600 dark:hover:bg-brand-700"
              >
                <Download className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
