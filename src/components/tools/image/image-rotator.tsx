/* eslint-disable @next/next/no-img-element */
'use client';

import { useState, useCallback } from 'react';
import { UploadBox } from '@/components/tools/upload-box';
import {
  RotateCcw,
  RotateCw,
  RotateCcwIcon,
  FlipHorizontal,
  FlipVertical,
  Download,
} from 'lucide-react';
import { formatBytes } from '@/lib/utils';

interface RotatedResult {
  file: File;
  url: string;
  blob: Blob;
  description: string;
}

export function ImageRotator() {
  const [files, setFiles] = useState<File[]>([]);
  const [preview, setPreview] = useState<string | null>(null);
  const [currentRotation, setCurrentRotation] = useState(0);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
  const [result, setResult] = useState<RotatedResult | null>(null);
  const [processing, setProcessing] = useState(false);

  const handleFiles = useCallback((newFiles: File[]) => {
    const file = newFiles[0];
    if (!file) return;
    setFiles([file]);
    setResult(null);
    setCurrentRotation(0);
    setFlipH(false);
    setFlipV(false);
    setPreview(URL.createObjectURL(file));
  }, []);

  const handleRemove = useCallback(() => {
    if (preview) URL.revokeObjectURL(preview);
    setFiles([]);
    setPreview(null);
    setResult(null);
  }, [preview]);

  const loadImage = (file: File): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });

  const processImage = async (rotation: number, hFlip: boolean, vFlip: boolean) => {
    if (!files[0]) return;
    setProcessing(true);
    try {
      const img = await loadImage(files[0]);
      const rad = (rotation * Math.PI) / 180;
      const absRot = Math.abs(rotation % 360);
      const swapDims = absRot === 90 || absRot === 270;

      const canvas = document.createElement('canvas');
      canvas.width = swapDims ? img.height : img.width;
      canvas.height = swapDims ? img.width : img.height;
      const ctx = canvas.getContext('2d')!;

      ctx.translate(canvas.width / 2, canvas.height / 2);
      if (hFlip) ctx.scale(-1, 1);
      if (vFlip) ctx.scale(1, -1);
      ctx.rotate(rad);
      ctx.drawImage(img, -img.width / 2, -img.height / 2);
      URL.revokeObjectURL(img.src);

      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((b) => resolve(b!), files[0].type);
      });

      const descs: string[] = [];
      if (rotation !== 0) descs.push(`rotated ${rotation}°`);
      if (hFlip) descs.push('flipped horizontally');
      if (vFlip) descs.push('flipped vertically');

      setResult({
        file: files[0],
        url: URL.createObjectURL(blob),
        blob,
        description: descs.join(', ') || 'original',
      });
    } finally {
      setProcessing(false);
    }
  };

  const rotateLeft = () => {
    const newRot = (currentRotation - 90 + 360) % 360;
    setCurrentRotation(newRot);
    processImage(newRot, flipH, flipV);
  };

  const rotateRight = () => {
    const newRot = (currentRotation + 90) % 360;
    setCurrentRotation(newRot);
    processImage(newRot, flipH, flipV);
  };

  const rotate180 = () => {
    const newRot = (currentRotation + 180) % 360;
    setCurrentRotation(newRot);
    processImage(newRot, flipH, flipV);
  };

  const flipHorizontal = () => {
    const newFlip = !flipH;
    setFlipH(newFlip);
    processImage(currentRotation, newFlip, flipV);
  };

  const flipVertical = () => {
    const newFlip = !flipV;
    setFlipV(newFlip);
    processImage(currentRotation, flipH, newFlip);
  };

  const reset = () => {
    setCurrentRotation(0);
    setFlipH(false);
    setFlipV(false);
    setResult(null);
  };

  const handleDownload = () => {
    if (!result) return;
    const a = document.createElement('a');
    a.href = result.url;
    a.download = `rotated-${result.file.name}`;
    a.click();
  };

  const buttons = [
    { icon: RotateCcw, label: '90° Left', action: rotateLeft },
    { icon: RotateCw, label: '90° Right', action: rotateRight },
    { icon: RotateCcwIcon, label: '180°', action: rotate180 },
    { icon: FlipHorizontal, label: 'Flip H', action: flipHorizontal },
    { icon: FlipVertical, label: 'Flip V', action: flipVertical },
  ];

  return (
    <div className="card space-y-6">
      <UploadBox
        onFiles={handleFiles}
        files={files}
        onRemove={() => handleRemove()}
        accept={{ 'image/*': ['.jpg', '.jpeg', '.png', '.webp', '.gif'] }}
        multiple={false}
      />

      {preview && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {buttons.map((btn) => (
              <button
                key={btn.label}
                onClick={btn.action}
                disabled={processing}
                className="btn-secondary flex items-center gap-2"
              >
                <btn.icon className="h-4 w-4" />
                {btn.label}
              </button>
            ))}
            <button onClick={reset} className="btn-secondary flex items-center gap-2">
              Reset
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="mb-2 text-xs font-medium text-gray-500 dark:text-gray-400">Original</p>
              <img src={preview} alt="Original" className="max-h-60 w-full rounded-lg object-contain" />
            </div>
            <div>
              <p className="mb-2 text-xs font-medium text-gray-500 dark:text-gray-400">Preview</p>
              {result ? (
                <img src={result.url} alt="Result" className="max-h-60 w-full rounded-lg object-contain" />
              ) : (
                <div className="flex h-60 items-center justify-center rounded-lg border border-dashed border-gray-300 dark:border-gray-700">
                  <p className="text-sm text-gray-400">Click a button to transform</p>
                </div>
              )}
            </div>
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-400">
            Rotation: {currentRotation}° | Flip H: {flipH ? 'Yes' : 'No'} | Flip V: {flipV ? 'Yes' : 'No'}
          </p>

          {result && (
            <button onClick={handleDownload} className="btn-primary flex items-center gap-2">
              <Download className="h-4 w-4" />
              Download ({formatBytes(result.blob.size)})
            </button>
          )}
        </div>
      )}
    </div>
  );
}
