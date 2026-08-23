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
  Scissors,
} from 'lucide-react';

function parsePageRange(range: string, maxPage: number): number[] {
  const pages = new Set<number>();
  const parts = range.split(',').map((s) => s.trim());

  for (const part of parts) {
    if (part.includes('-')) {
      const [startStr, endStr] = part.split('-');
      const start = parseInt(startStr, 10);
      const end = parseInt(endStr, 10);
      if (isNaN(start) || isNaN(end)) continue;
      for (let i = Math.max(1, start); i <= Math.min(maxPage, end); i++) {
        pages.add(i - 1);
      }
    } else {
      const num = parseInt(part, 10);
      if (!isNaN(num) && num >= 1 && num <= maxPage) {
        pages.add(num - 1);
      }
    }
  }

  return Array.from(pages).sort((a, b) => a - b);
}

const QUICK_OPTIONS = [
  { label: 'All Pages', getRange: (max: number) => `1-${max}` },
  { label: 'First Half', getRange: (max: number) => `1-${Math.ceil(max / 2)}` },
  { label: 'Second Half', getRange: (max: number) => `${Math.ceil(max / 2) + 1}-${max}` },
  { label: 'Even Pages', getRange: (_max: number, pages: number[]) =>
    pages.filter((_, i) => (i + 1) % 2 === 0).map((p) => p + 1).join(', ') },
  { label: 'Odd Pages', getRange: (_max: number, pages: number[]) =>
    pages.filter((_, i) => i % 2 === 0).map((p) => p + 1).join(', ') },
];

export function PdfSplitterTool() {
  const [files, setFiles] = useState<File[]>([]);
  const [pageRange, setPageRange] = useState('');
  const [splitting, setSplitting] = useState(false);
  const [progress, setProgress] = useState('');
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');
  const [totalPages, setTotalPages] = useState(0);

  const handleFiles = useCallback(async (newFiles: File[]) => {
    const file = newFiles[0];
    setFiles(newFiles.slice(0, 1));
    setPdfUrl(null);
    setDone(false);
    setError('');
    setPageRange('');

    try {
      const bytes = await file.arrayBuffer();
      const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true });
      const count = pdf.getPageCount();
      setTotalPages(count);
      setPageRange(`1-${count}`);
    } catch {
      setTotalPages(0);
      setError('Could not read PDF. The file may be corrupted or password-protected.');
    }
  }, []);

  const handleRemove = useCallback(() => {
    setFiles([]);
    setPdfUrl(null);
    setDone(false);
    setError('');
    setPageRange('');
    setTotalPages(0);
  }, []);

  const handleQuickOption = (getRange: (max: number, pages: number[]) => string) => {
    const range = getRange(totalPages, Array.from({ length: totalPages }, (_, i) => i));
    setPageRange(range);
    setPdfUrl(null);
    setDone(false);
  };

  const handleSplit = async () => {
    if (files.length === 0 || !pageRange.trim()) return;
    setSplitting(true);
    setError('');
    setProgress('Reading PDF...');

    try {
      const pdfBytes = await files[0].arrayBuffer();
      const pdf = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
      const indices = parsePageRange(pageRange, totalPages);

      if (indices.length === 0) {
        setError(`No valid pages found. The document has ${totalPages} page(s). Valid range: 1-${totalPages}`);
        setSplitting(false);
        setProgress('');
        return;
      }

      setProgress(`Extracting ${indices.length} page${indices.length !== 1 ? 's' : ''}...`);
      const newPdf = await PDFDocument.create();
      const copiedPages = await newPdf.copyPages(pdf, indices);
      copiedPages.forEach((page) => newPdf.addPage(page));

      setProgress('Saving...');
      const newBytes = await newPdf.save();
      const blob = new Blob([newBytes as unknown as BlobPart], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
      setDone(true);
      setProgress('');
    } catch (err) {
      setError('Failed to split PDF. Please check your page range and try again.');
      setProgress('');
    } finally {
      setSplitting(false);
    }
  };

  const handleDownload = () => {
    if (!pdfUrl) return;
    const a = document.createElement('a');
    a.href = pdfUrl;
    a.download = files.length > 0 ? files[0].name.replace(/\.pdf$/i, '_split.pdf') : 'split.pdf';
    a.click();
  };

  const handleReset = () => {
    setFiles([]);
    setPdfUrl(null);
    setDone(false);
    setError('');
    setPageRange('');
    setTotalPages(0);
  };

  const selectedCount = pageRange.trim() ? parsePageRange(pageRange, totalPages).length : 0;

  return (
    <div className="card">
      <div className="space-y-5">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-blue-500" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">PDF Splitter</h2>
        </div>

        <p className="text-sm text-gray-500 dark:text-gray-400">
          Extract specific pages from a PDF. Use comma-separated values and ranges (e.g., &quot;1-3, 5, 7-9&quot;).
        </p>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/50 dark:text-red-300">
            {error}
          </div>
        )}

        <UploadBox
          accept={{ 'application/pdf': ['.pdf'] }}
          multiple={false}
          files={files}
          onFiles={handleFiles}
          onRemove={() => handleRemove()}
        />

        {totalPages > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Document has <span className="font-semibold">{totalPages}</span> page{totalPages !== 1 ? 's' : ''}
              </p>
              {selectedCount > 0 && (
                <p className="text-sm text-blue-600 dark:text-blue-400">
                  {selectedCount} page{selectedCount !== 1 ? 's' : ''} selected
                </p>
              )}
            </div>

            <div className="flex flex-wrap gap-1.5">
              {QUICK_OPTIONS.map((opt) => (
                <button
                  key={opt.label}
                  onClick={() => handleQuickOption(opt.getRange)}
                  className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-700 transition-all hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-blue-700 dark:hover:bg-blue-950/50 dark:hover:text-blue-300"
                >
                  {opt.label}
                </button>
              ))}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Page Range</label>
              <input
                type="text"
                value={pageRange}
                onChange={(e) => {
                  setPageRange(e.target.value);
                  setPdfUrl(null);
                  setDone(false);
                }}
                placeholder={`e.g., 1-3, 5, 7-${totalPages}`}
                className="input mt-1"
              />
            </div>
          </div>
        )}

        {splitting && progress && (
          <div className="flex items-center gap-2 rounded-lg bg-blue-50 p-3 text-sm text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">
            <Loader2 className="h-4 w-4 animate-spin" />
            {progress}
          </div>
        )}

        {done && (
          <div className="flex items-center gap-2 rounded-lg bg-green-50 p-3 text-sm text-green-700 dark:bg-green-950/50 dark:text-green-300">
            <CheckCircle className="h-4 w-4" />
            PDF split successfully! {selectedCount} page{selectedCount !== 1 ? 's' : ''} extracted.
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleSplit}
            disabled={files.length === 0 || !pageRange.trim() || splitting}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {splitting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Splitting...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Scissors className="h-4 w-4" />
                Split PDF
              </span>
            )}
          </button>
          {pdfUrl && (
            <button onClick={handleDownload} className="btn-secondary flex items-center gap-2">
              <Download className="h-4 w-4" />
              Download Split PDF
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
