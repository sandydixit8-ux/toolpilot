'use client';

import { useState, useCallback } from 'react';
import { PDFDocument } from 'pdf-lib';
import { UploadBox } from '@/components/tools/upload-box';
import { FileText, Download } from 'lucide-react';

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

export function PdfSplitterTool() {
  const [files, setFiles] = useState<File[]>([]);
  const [pageRange, setPageRange] = useState('');
  const [splitting, setSplitting] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [error, setError] = useState('');

  const handleRemove = useCallback((index: number) => {
    setFiles((prev) => prev.filter((_, idx) => idx !== index));
    setPdfUrl(null);
    setError('');
  }, []);

  const handleFiles = useCallback((newFiles: File[]) => {
    setFiles(newFiles.slice(0, 1));
    setPdfUrl(null);
    setError('');
  }, []);

  const handleSplit = async () => {
    if (files.length === 0 || !pageRange.trim()) return;
    setSplitting(true);
    setError('');

    try {
      const pdfBytes = await files[0].arrayBuffer();
      const pdf = await PDFDocument.load(pdfBytes);
      const pageCount = pdf.getPageCount();
      const indices = parsePageRange(pageRange, pageCount);

      if (indices.length === 0) {
        setError(`No valid pages found. The document has ${pageCount} page(s).`);
        setSplitting(false);
        return;
      }

      const newPdf = await PDFDocument.create();
      const copiedPages = await newPdf.copyPages(pdf, indices);
      copiedPages.forEach((page) => newPdf.addPage(page));

      const newBytes = await newPdf.save();
      const blob = new Blob([newBytes as unknown as BlobPart], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSplitting(false);
    }
  };

  const handleDownload = () => {
    if (!pdfUrl) return;
    const a = document.createElement('a');
    a.href = pdfUrl;
    a.download = 'split.pdf';
    a.click();
  };

  return (
    <div className="card">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-blue-500" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">PDF Splitter</h2>
        </div>

        <p className="text-sm text-gray-500 dark:text-gray-400">
          Extract specific pages from a PDF. Use comma-separated values and ranges (e.g., &quot;1-3, 5, 7-9&quot;).
        </p>

        <UploadBox
          accept={{ 'application/pdf': ['.pdf'] }}
          multiple={false}
          files={files}
          onFiles={handleFiles}
          onRemove={handleRemove}
        />

        <div>
          <label className="label">Page Range</label>
          <input
            type="text"
            value={pageRange}
            onChange={(e) => { setPageRange(e.target.value); setPdfUrl(null); setError(''); }}
            placeholder="e.g., 1-3, 5, 7-9"
            className="input mt-1"
          />
        </div>

        {error && (
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        )}

        <div className="flex gap-2">
          <button
            onClick={handleSplit}
            disabled={files.length === 0 || !pageRange.trim() || splitting}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {splitting ? 'Splitting...' : 'Split PDF'}
          </button>
          {pdfUrl && (
            <button onClick={handleDownload} className="btn-secondary flex items-center gap-2">
              <Download className="h-4 w-4" />
              Download Split PDF
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
