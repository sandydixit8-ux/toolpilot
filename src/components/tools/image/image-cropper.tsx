/* eslint-disable @next/next/no-img-element */
'use client';

import { useState, useCallback, useRef } from 'react';
import { UploadBox } from '@/components/tools/upload-box';
import { Download, Crop } from 'lucide-react';
import { formatBytes } from '@/lib/utils';

interface CroppedResult {
  file: File;
  url: string;
  blob: Blob;
}

const ASPECT_RATIOS = [
  { label: 'Free', value: null },
  { label: '1:1', value: 1 },
  { label: '16:9', value: 16 / 9 },
  { label: '9:16', value: 9 / 16 },
  { label: '4:3', value: 4 / 3 },
  { label: '3:4', value: 3 / 4 },
  { label: '3:2', value: 3 / 2 },
];

export function ImageCropper() {
  const [files, setFiles] = useState<File[]>([]);
  const [preview, setPreview] = useState<string | null>(null);
  const [imgSize, setImgSize] = useState({ width: 0, height: 0 });
  const [cropX, setCropX] = useState(0);
  const [cropY, setCropY] = useState(0);
  const [cropW, setCropW] = useState(100);
  const [cropH, setCropH] = useState(100);
  const [selectedRatio, setSelectedRatio] = useState<string>('Free');
  const [result, setResult] = useState<CroppedResult | null>(null);
  const [processing, setProcessing] = useState(false);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const handleFiles = useCallback((newFiles: File[]) => {
    const file = newFiles[0];
    if (!file) return;
    setFiles([file]);
    setResult(null);
    const url = URL.createObjectURL(file);
    setPreview(url);
    const img = new Image();
    img.onload = () => {
      setImgSize({ width: img.width, height: img.height });
      setCropX(0);
      setCropY(0);
      setCropW(img.width);
      setCropH(img.height);
      imgRef.current = img;
    };
    img.src = url;
  }, []);

  const handleRemove = useCallback(() => {
    if (preview) URL.revokeObjectURL(preview);
    setFiles([]);
    setPreview(null);
    setResult(null);
  }, [preview]);

  const handleRatioSelect = (label: string, ratio: number | null) => {
    setSelectedRatio(label);
    if (ratio && imgSize.width && imgSize.height) {
      const imgRatio = imgSize.width / imgSize.height;
      if (ratio > imgRatio) {
        const newW = imgSize.height * ratio;
        setCropW(Math.min(newW, imgSize.width));
        setCropH(imgSize.height);
      } else {
        const newH = imgSize.width / ratio;
        setCropW(imgSize.width);
        setCropH(Math.min(newH, imgSize.height));
      }
      setCropX(0);
      setCropY(0);
    }
  };

  const handleCrop = async () => {
    if (!imgRef.current) return;
    setProcessing(true);
    try {
      const canvas = document.createElement('canvas');
      canvas.width = cropW;
      canvas.height = cropH;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(imgRef.current, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH);

      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((b) => {
          if (b) resolve(b);
          else reject(new Error('Failed to crop image'));
        }, files[0].type);
      });

      setResult({
        file: files[0],
        url: URL.createObjectURL(blob),
        blob,
      });
    } finally {
      setProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!result) return;
    const a = document.createElement('a');
    a.href = result.url;
    a.download = `cropped-${result.file.name}`;
    a.click();
  };

  return (
    <div className="card space-y-6">
      <UploadBox
        onFiles={handleFiles}
        files={files}
        onRemove={() => handleRemove()}
        accept={{ 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] }}
        multiple={false}
      />

      {preview && (
        <div className="space-y-4">
          <div className="relative overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800">
            <img
              src={preview}
              alt="Preview"
              className="max-h-80 w-full object-contain"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className="border-2 border-dashed border-brand-500 bg-brand-500/10"
                style={{
                  position: 'absolute',
                  left: `${(cropX / imgSize.width) * 100}%`,
                  top: `${(cropY / imgSize.height) * 100}%`,
                  width: `${(cropW / imgSize.width) * 100}%`,
                  height: `${(cropH / imgSize.height) * 100}%`,
                }}
              />
            </div>
          </div>

          <div>
            <label className="label">Aspect Ratio</label>
            <div className="mt-1 flex flex-wrap gap-2">
              {ASPECT_RATIOS.map((r) => (
                <button
                  key={r.label}
                  onClick={() => handleRatioSelect(r.label, r.value)}
                  className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                    selectedRatio === r.label
                      ? 'border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300 dark:border-gray-700 dark:text-gray-400'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div>
              <label className="label">X</label>
              <input
                type="number"
                value={cropX}
                onChange={(e) => setCropX(Math.max(0, Math.min(Number(e.target.value), imgSize.width - cropW)))}
                className="input mt-1"
                min={0}
                max={imgSize.width}
              />
            </div>
            <div>
              <label className="label">Y</label>
              <input
                type="number"
                value={cropY}
                onChange={(e) => setCropY(Math.max(0, Math.min(Number(e.target.value), imgSize.height - cropH)))}
                className="input mt-1"
                min={0}
                max={imgSize.height}
              />
            </div>
            <div>
              <label className="label">Width</label>
              <input
                type="number"
                value={cropW}
                onChange={(e) => setCropW(Math.max(1, Math.min(Number(e.target.value), imgSize.width - cropX)))}
                className="input mt-1"
                min={1}
                max={imgSize.width}
              />
            </div>
            <div>
              <label className="label">Height</label>
              <input
                type="number"
                value={cropH}
                onChange={(e) => setCropH(Math.max(1, Math.min(Number(e.target.value), imgSize.height - cropY)))}
                className="input mt-1"
                min={1}
                max={imgSize.height}
              />
            </div>
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-400">
            Image dimensions: {imgSize.width} × {imgSize.height} px
          </p>

          <div className="flex gap-3">
            <button onClick={handleCrop} disabled={processing} className="btn-primary flex items-center gap-2">
              <Crop className="h-4 w-4" />
              {processing ? 'Cropping...' : 'Crop Image'}
            </button>
            {result && (
              <button onClick={handleDownload} className="btn-secondary flex items-center gap-2">
                <Download className="h-4 w-4" />
                Download ({formatBytes(result.blob.size)})
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
