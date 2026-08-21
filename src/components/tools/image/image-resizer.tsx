/* eslint-disable @next/next/no-img-element */
'use client';

import { useState, useCallback } from 'react';
import { UploadBox } from '@/components/tools/upload-box';
import { Download, Lock, Unlock } from 'lucide-react';
import { formatBytes } from '@/lib/utils';

interface ResizedResult {
  file: File;
  originalWidth: number;
  originalHeight: number;
  newWidth: number;
  newHeight: number;
  url: string;
  blob: Blob;
}

export function ImageResizer() {
  const [files, setFiles] = useState<File[]>([]);
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(600);
  const [lockAspect, setLockAspect] = useState(true);
  const [aspectRatio, setAspectRatio] = useState(4 / 3);
  const [results, setResults] = useState<ResizedResult[]>([]);
  const [processing, setProcessing] = useState(false);

  const handleFiles = useCallback((newFiles: File[]) => {
    setFiles((prev) => [...prev, ...newFiles]);
    setResults([]);
    if (newFiles.length > 0) {
      const img = new Image();
      img.onload = () => {
        setAspectRatio(img.width / img.height);
        if (lockAspect) {
          setWidth(img.width);
          setHeight(img.height);
        }
      };
      img.src = URL.createObjectURL(newFiles[0]);
    }
  }, [lockAspect]);

  const handleRemove = useCallback((index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setResults([]);
  }, []);

  const handleWidthChange = (val: number) => {
    setWidth(val);
    if (lockAspect) {
      setHeight(Math.round(val / aspectRatio));
    }
  };

  const handleHeightChange = (val: number) => {
    setHeight(val);
    if (lockAspect) {
      setWidth(Math.round(val * aspectRatio));
    }
  };

  const loadImage = (file: File): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });

  const handleResize = async () => {
    setProcessing(true);
    try {
      const resized = await Promise.all(
        files.map(async (file) => {
          const img = await loadImage(file);
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d')!;
          ctx.drawImage(img, 0, 0, width, height);
          URL.revokeObjectURL(img.src);

          const blob = await new Promise<Blob>((resolve) => {
            canvas.toBlob((b) => resolve(b!), file.type);
          });

          return {
            file,
            originalWidth: img.width,
            originalHeight: img.height,
            newWidth: width,
            newHeight: height,
            url: URL.createObjectURL(blob),
            blob,
          };
        })
      );
      setResults(resized);
    } finally {
      setProcessing(false);
    }
  };

  const handleDownload = (result: ResizedResult) => {
    const a = document.createElement('a');
    a.href = result.url;
    a.download = `resized-${result.file.name}`;
    a.click();
  };

  return (
    <div className="card space-y-6">
      <UploadBox
        onFiles={handleFiles}
        files={files}
        onRemove={handleRemove}
        accept={{ 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] }}
      />

      {files.length > 0 && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Width (px)</label>
              <input
                type="number"
                value={width}
                onChange={(e) => handleWidthChange(Number(e.target.value))}
                className="input mt-1"
                min={1}
                max={10000}
              />
            </div>
            <div>
              <label className="label">Height (px)</label>
              <input
                type="number"
                value={height}
                onChange={(e) => handleHeightChange(Number(e.target.value))}
                className="input mt-1"
                min={1}
                max={10000}
              />
            </div>
          </div>

          <button
            onClick={() => setLockAspect(!lockAspect)}
            className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
              lockAspect
                ? 'border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300'
                : 'border-gray-200 text-gray-600 hover:border-gray-300 dark:border-gray-700 dark:text-gray-400'
            }`}
          >
            {lockAspect ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
            {lockAspect ? 'Aspect Ratio Locked' : 'Aspect Ratio Unlocked'}
          </button>

          <div className="flex gap-3">
            <button onClick={handleResize} disabled={processing} className="btn-primary">
              {processing ? 'Resizing...' : 'Resize Image'}
            </button>
          </div>
        </div>
      )}

      {results.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Results</h3>
          {results.map((result, i) => (
            <div
              key={i}
              className="flex items-center gap-4 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-800/50"
            >
              <img src={result.url} alt={result.file.name} className="h-16 w-16 rounded object-cover" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                  {result.file.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {result.originalWidth}×{result.originalHeight} → {result.newWidth}×{result.newHeight} ({formatBytes(result.blob.size)})
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
