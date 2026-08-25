'use client';

import { useState, useCallback } from 'react';
import { PDFDocument } from 'pdf-lib';
import { UploadBox } from '@/components/tools/upload-box';
import { ProcessingOverlay } from '@/components/tools/processing-overlay';
import {
  FileText,
  Download,
  GripVertical,
  ArrowUp,
  ArrowDown,
  Trash2,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { formatBytes } from '@/lib/utils';

export function PdfMergerTool() {
  const [files, setFiles] = useState<File[]>([]);
  const [merging, setMerging] = useState(false);
  const [progress, setProgress] = useState('');
  const [progressPercent, setProgressPercent] = useState(0);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [pageCounts, setPageCounts] = useState<Record<number, number>>({});
  const [status, setStatus] = useState<'idle' | 'processing' | 'complete' | 'error'>('idle');

  const getPageCount = async (file: File) => {
    try {
      const bytes = await file.arrayBuffer();
      const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true });
      return pdf.getPageCount();
    } catch {
      return 0;
    }
  };

  const handleFiles = useCallback(async (newFiles: File[]) => {
    setPdfUrl(null);
    setError('');
    setFiles((prev) => [...prev, ...newFiles]);
    for (let i = 0; i < newFiles.length; i++) {
      const count = await getPageCount(newFiles[i]);
      setPageCounts((prev) => ({ ...prev, [Date.now() + i]: count }));
    }
  }, []);

  const handleRemove = useCallback((index: number) => {
    setFiles((prev) => prev.filter((_, idx) => idx !== index));
    setPdfUrl(null);
    setError('');
  }, []);

  const moveUp = useCallback((index: number) => {
    if (index === 0) return;
    setFiles((prev) => {
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
  }, []);

  const handleMerge = async () => {
    if (files.length < 2) return;
    setMerging(true);
    setError('');
    setStatus('processing');
    setProgress('Creating merged document...');
    setProgressPercent(0);

    try {
      const mergedPdf = await PDFDocument.create();

      for (let i = 0; i < files.length; i++) {
        const pct = ((i + 1) / files.length) * 100;
        setProgress(`Processing file ${i + 1} of ${files.length}...`);
        setProgressPercent(pct);
        const pdfBytes = await files[i].arrayBuffer();
        const pdf = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      setProgress('Finalizing...');
      setProgressPercent(95);
      const mergedBytes = await mergedPdf.save();
      const blob = new Blob([mergedBytes as unknown as BlobPart], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
      setProgress('');
      setProgressPercent(100);
      setStatus('complete');
    } catch {
      setError('Failed to merge PDFs. One or more files may be corrupted or password-protected.');
      setProgress('');
      setStatus('error');
    } finally {
      setMerging(false);
    }
  };

  const handleDownload = () => {
    if (!pdfUrl) return;
    const a = document.createElement('a');
    a.href = pdfUrl;
    a.download = 'merged.pdf';
    a.click();
  };

  const handleReset = () => {
    setFiles([]);
    setPdfUrl(null);
    setError('');
    setProgress('');
    setProgressPercent(0);
    setPageCounts({});
    setStatus('idle');
  };

  return (
    <div className="card">
      <div className="space-y-5">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-blue-500" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">PDF Merger</h2>
          {files.length > 0 && (
            <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
              {files.length} file{files.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        <p className="text-sm text-gray-500 dark:text-gray-400">
          Combine multiple PDF files into one. Drag to reorder before merging.
        </p>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/50 dark:text-red-300">
            {error}
          </div>
        )}

        <UploadBox
          accept={{ 'application/pdf': ['.pdf'] }}
          multiple
          files={files}
          onFiles={handleFiles}
          onRemove={handleRemove}
          showSizeInfo
        />

        {files.length > 1 && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              File Order (use arrows to reorder)
            </p>
            {files.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3 transition-all hover:border-blue-200 hover:shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-800"
              >
                <GripVertical className="h-4 w-4 shrink-0 text-gray-300 dark:text-gray-600" />
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
                  {index + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-900 dark:text-white">{file.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{formatBytes(file.size)}</p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => moveUp(index)}
                    disabled={index === 0}
                    className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 disabled:opacity-30 dark:hover:bg-gray-700"
                    title="Move up"
                  >
                    <ArrowUp className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => moveDown(index)}
                    disabled={index === files.length - 1}
                    className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 disabled:opacity-30 dark:hover:bg-gray-700"
                    title="Move down"
                  >
                    <ArrowDown className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleRemove(index)}
                    className="rounded p-1 text-gray-400 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/50 dark:hover:text-red-400"
                    title="Remove"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {merging && (
          <ProcessingOverlay
            status="processing"
            progress={progress}
            percentage={progressPercent}
          />
        )}

        {!merging && status === 'complete' && (
          <ProcessingOverlay
            status="complete"
            onDownload={handleDownload}
          />
        )}

        {!merging && status === 'error' && (
          <ProcessingOverlay
            status="error"
            error={error}
          />
        )}

        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleMerge}
            disabled={files.length < 2 || merging}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Sparkles className="h-4 w-4" />
            Merge {files.length} PDFs
          </button>
          {pdfUrl && (
            <button onClick={handleDownload} className="btn-secondary flex items-center gap-2">
              <Download className="h-4 w-4" />
              Download Merged PDF
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
