'use client';

import { useState, useCallback } from 'react';
import { PDFDocument } from 'pdf-lib';
import { UploadBox } from '@/components/tools/upload-box';
import {
  FileText,
  Download,
  CheckCircle,
  Loader2,
  RotateCcw,
  ArrowUp,
  ArrowDown,
  Trash2,
  GripVertical,
} from 'lucide-react';
import { formatBytes } from '@/lib/utils';

type PageSize = 'a4' | 'letter' | 'fit' | 'square';

const PAGE_SIZES: { value: PageSize; label: string; description: string }[] = [
  { value: 'fit', label: 'Fit to Image', description: 'Page matches image dimensions' },
  { value: 'a4', label: 'A4 (210 x 297mm)', description: 'Standard A4 paper' },
  { value: 'letter', label: 'Letter (8.5 x 11")', description: 'US Letter size' },
  { value: 'square', label: 'Square (1:1)', description: 'Square page format' },
];

function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
      URL.revokeObjectURL(img.src);
    };
    img.onerror = () => resolve({ width: 800, height: 600 });
    img.src = URL.createObjectURL(file);
  });
}

export function JpgToPdfTool() {
  const [files, setFiles] = useState<File[]>([]);
  const [pageSize, setPageSize] = useState<PageSize>('fit');
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState('');
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');
  const [previews, setPreviews] = useState<string[]>([]);

  const handleFiles = useCallback(async (newFiles: File[]) => {
    setFiles((prev) => [...prev, ...newFiles]);
    setPdfUrl(null);
    setDone(false);
    setError('');
    const newPreviews = await Promise.all(
      newFiles.map(
        (f) =>
          new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.readAsDataURL(f);
          })
      )
    );
    setPreviews((prev) => [...prev, ...newPreviews]);
  }, []);

  const handleRemove = useCallback((index: number) => {
    setFiles((prev) => prev.filter((_, idx) => idx !== index));
    setPreviews((prev) => prev.filter((_, idx) => idx !== index));
    setPdfUrl(null);
    setDone(false);
  }, []);

  const moveUp = useCallback((index: number) => {
    if (index === 0) return;
    setFiles((prev) => {
      const arr = [...prev];
      [arr[index - 1], arr[index]] = [arr[index], arr[index - 1]];
      return arr;
    });
    setPreviews((prev) => {
      const arr = [...prev];
      [arr[index - 1], arr[index]] = [arr[index], arr[index - 1]];
      return arr;
    });
  }, []);

  const moveDown = useCallback((index: number) => {
    setFiles((prev) => {
      if (index >= prev.length - 1) return prev;
      const arr = [...prev];
      [arr[index], arr[index + 1]] = [arr[index + 1], arr[index]];
      return arr;
    });
    setPreviews((prev) => {
      if (index >= prev.length - 1) return prev;
      const arr = [...prev];
      [arr[index], arr[index + 1]] = [arr[index + 1], arr[index]];
      return arr;
    });
  }, []);

  const getPageSizeDimensions = (
    imgWidth: number,
    imgHeight: number
  ): { width: number; height: number } => {
    switch (pageSize) {
      case 'a4':
        return { width: 595.28, height: 841.89 };
      case 'letter':
        return { width: 612, height: 792 };
      case 'square': {
        const size = Math.max(imgWidth, imgHeight);
        return { width: size, height: size };
      }
      case 'fit':
      default:
        return { width: imgWidth, height: imgHeight };
    }
  };

  const handleConvert = async () => {
    if (files.length === 0) return;
    setGenerating(true);
    setError('');
    setProgress('Creating PDF...');

    try {
      const pdfDoc = await PDFDocument.create();

      for (let i = 0; i < files.length; i++) {
        setProgress(`Processing image ${i + 1} of ${files.length}...`);
        const file = files[i];
        const imageBytes = await file.arrayBuffer();
        const dims = await getImageDimensions(file);

        let image;
        if (file.type === 'image/png') {
          image = await pdfDoc.embedPng(imageBytes);
        } else {
          image = await pdfDoc.embedJpg(imageBytes);
        }

        const pageDims = getPageSizeDimensions(dims.width, dims.height);
        const page = pdfDoc.addPage([pageDims.width, pageDims.height]);

        const scaleX = pageDims.width / dims.width;
        const scaleY = pageDims.height / dims.height;
        const scale = pageSize === 'fit' ? 1 : Math.min(scaleX, scaleY);

        const drawWidth = dims.width * scale;
        const drawHeight = dims.height * scale;
        const x = (pageDims.width - drawWidth) / 2;
        const y = (pageDims.height - drawHeight) / 2;

        page.drawImage(image, { x, y, width: drawWidth, height: drawHeight });
      }

      setProgress('Saving PDF...');
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
      setDone(true);
      setProgress('');
    } catch (err) {
      console.error('Failed to create PDF:', err);
      setError('Failed to create PDF. One or more images may be corrupted.');
      setProgress('');
    } finally {
      setGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!pdfUrl) return;
    const a = document.createElement('a');
    a.href = pdfUrl;
    a.download = 'images.pdf';
    a.click();
  };

  const handleReset = () => {
    setFiles([]);
    setPreviews([]);
    setPdfUrl(null);
    setDone(false);
    setError('');
    setProgress('');
  };

  return (
    <div className="card">
      <div className="space-y-5">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-blue-500" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">JPG to PDF</h2>
          {files.length > 0 && (
            <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
              {files.length} image{files.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        <p className="text-sm text-gray-500 dark:text-gray-400">
          Convert your JPG/PNG images into a PDF document. Drag to reorder.
        </p>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/50 dark:text-red-300">
            {error}
          </div>
        )}

        <UploadBox
          accept={{ 'image/jpeg': ['.jpg', '.jpeg'], 'image/png': ['.png'] }}
          multiple
          files={files}
          onFiles={handleFiles}
          onRemove={handleRemove}
        />

        {files.length > 0 && (
          <div className="space-y-3">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Page Size
            </p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {PAGE_SIZES.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setPageSize(opt.value)}
                  className={`rounded-lg border-2 p-2.5 text-left transition-all ${
                    pageSize === opt.value
                      ? 'border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-950/50'
                      : 'border-gray-200 bg-white hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600'
                  }`}
                >
                  <p className={`text-xs font-semibold ${pageSize === opt.value ? 'text-blue-700 dark:text-blue-300' : 'text-gray-900 dark:text-white'}`}>
                    {opt.label}
                  </p>
                  <p className="mt-0.5 text-[10px] text-gray-500 dark:text-gray-400">{opt.description}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {files.length > 1 && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Image Order
            </p>
            {files.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-3 py-2 transition-all hover:border-blue-200 hover:shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-800"
              >
                {previews[index] && (
                  <img src={previews[index]} alt="" className="h-10 w-10 rounded object-cover" />
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-900 dark:text-white">{file.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{formatBytes(file.size)}</p>
                </div>
                <div className="flex items-center gap-0.5">
                  <button
                    onClick={() => moveUp(index)}
                    disabled={index === 0}
                    className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 disabled:opacity-30 dark:hover:bg-gray-700"
                  >
                    <ArrowUp className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => moveDown(index)}
                    disabled={index === files.length - 1}
                    className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 disabled:opacity-30 dark:hover:bg-gray-700"
                  >
                    <ArrowDown className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => handleRemove(index)}
                    className="rounded p-1 text-gray-400 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/50 dark:hover:text-red-400"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {generating && progress && (
          <div className="flex items-center gap-2 rounded-lg bg-blue-50 p-3 text-sm text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">
            <Loader2 className="h-4 w-4 animate-spin" />
            {progress}
          </div>
        )}

        {done && (
          <div className="flex items-center gap-2 rounded-lg bg-green-50 p-3 text-sm text-green-700 dark:bg-green-950/50 dark:text-green-300">
            <CheckCircle className="h-4 w-4" />
            PDF created successfully! Ready to download.
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleConvert}
            disabled={files.length === 0 || generating}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {generating ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Converting...
              </span>
            ) : (
              `Convert to PDF`
            )}
          </button>
          {pdfUrl && (
            <button onClick={handleDownload} className="btn-secondary flex items-center gap-2">
              <Download className="h-4 w-4" />
              Download PDF
            </button>
          )}
          {files.length > 0 && (
            <button onClick={handleReset} className="btn-secondary flex items-center gap-2">
              <RotateCcw className="h-4 w-4" />
              Reset
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
