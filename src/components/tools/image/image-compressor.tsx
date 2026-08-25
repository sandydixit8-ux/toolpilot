/* eslint-disable @next/next/no-img-element */
'use client';

import { useState, useCallback } from 'react';
import { UploadBox } from '@/components/tools/upload-box';
import { ProcessingOverlay } from '@/components/tools/processing-overlay';
import { Download, Trash2, Sparkles, CheckCircle } from 'lucide-react';
import { formatBytes } from '@/lib/utils';

interface CompressedResult {
  file: File;
  originalSize: number;
  compressedSize: number;
  url: string;
  blob: Blob;
}

export function ImageCompressor() {
  const [files, setFiles] = useState<File[]>([]);
  const [quality, setQuality] = useState(80);
  const [results, setResults] = useState<CompressedResult[]>([]);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

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

  const compressImage = async (file: File): Promise<CompressedResult> => {
    const img = await loadImage(file);
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(img, 0, 0);
    URL.revokeObjectURL(img.src);

    const mimeType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
    const q = quality / 100;

    const blob = await new Promise<Blob>((resolve) => {
      canvas.toBlob(
        (b) => resolve(b!),
        mimeType,
        mimeType === 'image/png' ? undefined : q
      );
    });

    const url = URL.createObjectURL(blob);
    return {
      file,
      originalSize: file.size,
      compressedSize: blob.size,
      url,
      blob,
    };
  };

  const handleCompress = async () => {
    setProcessing(true);
    setProgress(0);
    try {
      const compressed: CompressedResult[] = [];
      for (let i = 0; i < files.length; i++) {
        setProgress(((i + 1) / files.length) * 100);
        const result = await compressImage(files[i]);
        compressed.push(result);
      }
      setResults(compressed);
    } finally {
      setProcessing(false);
    }
  };

  const handleDownload = (result: CompressedResult) => {
    const a = document.createElement('a');
    a.href = result.url;
    const ext = result.file.type === 'image/png' ? '.png' : '.jpg';
    a.download = `compressed-${result.file.name.replace(/\.[^.]+$/, ext)}`;
    a.click();
  };

  const handleDownloadAll = () => {
    results.forEach((r) => handleDownload(r));
  };

  const totalOriginal = results.reduce((sum, r) => sum + r.originalSize, 0);
  const totalCompressed = results.reduce((sum, r) => sum + r.compressedSize, 0);
  const totalSavings = totalOriginal > 0 ? ((1 - totalCompressed / totalOriginal) * 100).toFixed(1) : '0';

  return (
    <div className="card space-y-6">
      <UploadBox
        onFiles={handleFiles}
        files={files}
        onRemove={handleRemove}
        accept={{ 'image/*': ['.jpg', '.jpeg', '.png', '.webp', '.gif'] }}
        showSizeInfo
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
              min={1}
              max={100}
              value={quality}
              onChange={(e) => setQuality(Number(e.target.value))}
              className="mt-2 w-full accent-brand-500"
            />
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>Smaller file</span>
              <span>Higher quality</span>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleCompress}
              disabled={processing}
              className="btn-primary flex items-center gap-2"
            >
              <Sparkles className="h-4 w-4" />
              {processing ? 'Compressing...' : 'Compress Images'}
            </button>
            {results.length > 0 && (
              <button onClick={handleDownloadAll} className="btn-secondary flex items-center gap-2">
                <Download className="h-4 w-4" />
                Download All
              </button>
            )}
          </div>
        </div>
      )}

      {processing && (
        <ProcessingOverlay
          status="processing"
          progress={`Compressing image ${Math.min(Math.ceil(progress / 100 * files.length), files.length)} of ${files.length}...`}
          percentage={progress}
        />
      )}

      {!processing && results.length > 0 && (
        <>
          <div className="flex items-center gap-2 rounded-lg bg-green-50 p-3 text-sm text-green-700 dark:bg-green-950/50 dark:text-green-300">
            <CheckCircle className="h-4 w-4" />
            Compressed {results.length} image{results.length > 1 ? 's' : ''} — saved {totalSavings}% overall
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Results</h3>
            {results.map((result, i) => {
              const savings = ((1 - result.compressedSize / result.originalSize) * 100).toFixed(1);
              return (
                <div
                  key={i}
                  className="flex items-center gap-4 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-800/50"
                >
                  {result.url && (
                    <img
                      src={result.url}
                      alt={result.file.name}
                      className="h-16 w-16 rounded object-cover"
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                      {result.file.name}
                    </p>
                    <div className="mt-1 flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                      <span>{formatBytes(result.originalSize)}</span>
                      <span>→</span>
                      <span>{formatBytes(result.compressedSize)}</span>
                      <span className={`font-medium ${Number(savings) > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        {Number(savings) > 0 ? `-${savings}%` : `+${Math.abs(Number(savings))}%`}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDownload(result)}
                    className="shrink-0 rounded-lg bg-brand-500 p-2 text-white hover:bg-brand-600 dark:bg-brand-600 dark:hover:bg-brand-700"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </>
      )}

      {files.length > 0 && results.length === 0 && !processing && (
        <button
          onClick={() => { setFiles([]); setResults([]); }}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
        >
          <Trash2 className="h-4 w-4" />
          Clear all
        </button>
      )}
    </div>
  );
}
