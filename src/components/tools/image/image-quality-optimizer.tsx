/* eslint-disable @next/next/no-img-element */
'use client';

import { useState, useCallback } from 'react';
import { UploadBox } from '@/components/tools/upload-box';
import { Download, Zap, ArrowRight } from 'lucide-react';
import { formatBytes } from '@/lib/utils';

interface QualityVariant {
  quality: number;
  url: string;
  blob: Blob;
  size: number;
}

interface OptimizedResult {
  file: File;
  variants: QualityVariant[];
  recommended: number;
}

const OPTIMIZATION_LEVELS = [
  { label: 'Aggressive', quality: 40, description: 'Smallest file, noticeable quality loss' },
  { label: 'Balanced', quality: 65, description: 'Good balance of size and quality' },
  { label: 'Standard', quality: 80, description: 'Recommended for most web use' },
  { label: 'High Quality', quality: 92, description: 'Minimal quality loss, larger files' },
];

export function ImageQualityOptimizer() {
  const [files, setFiles] = useState<File[]>([]);
  const [results, setResults] = useState<OptimizedResult[]>([]);
  const [processing, setProcessing] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState('Standard');

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

  const createVariant = async (
    img: HTMLImageElement,
    file: File,
    quality: number
  ): Promise<QualityVariant> => {
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(img, 0, 0);

    const mimeType = 'image/jpeg';
    const blob = await new Promise<Blob>((resolve) => {
      canvas.toBlob((b) => resolve(b!), mimeType, quality / 100);
    });

    return {
      quality,
      url: URL.createObjectURL(blob),
      blob,
      size: blob.size,
    };
  };

  const handleOptimize = async () => {
    setProcessing(true);
    try {
      const optimized = await Promise.all(
        files.map(async (file) => {
          const img = await loadImage(file);
          const levels = OPTIMIZATION_LEVELS.map((l) => l.quality);
          const variants = await Promise.all(levels.map((q) => createVariant(img, file, q)));
          URL.revokeObjectURL(img.src);

          const targetSize = file.size * 0.5;
          let recommended = 1;
          for (let i = variants.length - 1; i >= 0; i--) {
            if (variants[i].size <= targetSize) {
              recommended = i;
              break;
            }
          }

          return { file, variants, recommended };
        })
      );
      setResults(optimized);
    } finally {
      setProcessing(false);
    }
  };

  const handleDownload = (variant: QualityVariant, fileName: string) => {
    const a = document.createElement('a');
    a.href = variant.url;
    a.download = `${variant.quality}q-${fileName.replace(/\.[^.]+$/, '.jpg')}`;
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
          <div>
            <label className="label">Optimization Level</label>
            <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {OPTIMIZATION_LEVELS.map((level) => (
                <button
                  key={level.label}
                  onClick={() => setSelectedLevel(level.label)}
                  className={`rounded-lg border p-3 text-left transition-colors ${
                    selectedLevel === level.label
                      ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/30'
                      : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600'
                  }`}
                >
                  <p className={`text-sm font-medium ${
                    selectedLevel === level.label
                      ? 'text-brand-700 dark:text-brand-300'
                      : 'text-gray-900 dark:text-white'
                  }`}>
                    {level.label}
                  </p>
                  <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                    {level.description}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleOptimize}
            disabled={processing}
            className="btn-primary flex items-center gap-2"
          >
            <Zap className="h-4 w-4" />
            {processing ? 'Optimizing...' : 'Optimize Images'}
          </button>
        </div>
      )}

      {results.length > 0 && (
        <div className="space-y-6">
          {results.map((result, ri) => (
            <div key={ri} className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                  {result.file.name}
                </h3>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Original: {formatBytes(result.file.size)}
                </span>
              </div>

              <div className="space-y-2">
                {result.variants.map((variant, vi) => {
                  const saving = ((1 - variant.size / result.file.size) * 100).toFixed(1);
                  const isRecommended = vi === result.recommended;
                  return (
                    <div
                      key={vi}
                      className={`flex items-center gap-4 rounded-lg border p-4 transition-colors ${
                        isRecommended
                          ? 'border-green-300 bg-green-50 dark:border-green-700 dark:bg-green-900/20'
                          : 'border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-800/50'
                      }`}
                    >
                      <img
                        src={variant.url}
                        alt={`Quality ${variant.quality}`}
                        className="h-14 w-14 rounded object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {OPTIMIZATION_LEVELS[vi].label} ({variant.quality}%)
                          </p>
                          {isRecommended && (
                            <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/40 dark:text-green-300">
                              Recommended
                            </span>
                          )}
                        </div>
                        <div className="mt-0.5 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                          <span>{formatBytes(result.file.size)}</span>
                          <ArrowRight className="h-3 w-3" />
                          <span>{formatBytes(variant.size)}</span>
                          <span className={`font-medium ${Number(saving) > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                            {Number(saving) > 0 ? `-${saving}%` : `+${Math.abs(Number(saving))}%`}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDownload(variant, result.file.name)}
                        className="shrink-0 rounded-lg bg-brand-500 p-2 text-white hover:bg-brand-600 dark:bg-brand-600 dark:hover:bg-brand-700"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
