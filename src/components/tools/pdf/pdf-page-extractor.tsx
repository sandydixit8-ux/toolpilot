'use client';

import { useState, useCallback } from 'react';
import { PDFDocument } from 'pdf-lib';
import { UploadBox } from '@/components/tools/upload-box';
import { FileText, Download } from 'lucide-react';

export function PdfPageExtractorTool() {
  const [files, setFiles] = useState<File[]>([]);
  const [pageNumbers, setPageNumbers] = useState('');
  const [extracting, setExtracting] = useState(false);
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

  const handleExtract = async () => {
    if (files.length === 0 || !pageNumbers.trim()) return;
    setExtracting(true);
    setError('');

    try {
      const pdfBytes = await files[0].arrayBuffer();
      const pdf = await PDFDocument.load(pdfBytes);
      const pageCount = pdf.getPageCount();

      const indices = pageNumbers
        .split(',')
        .map((s) => parseInt(s.trim(), 10) - 1)
        .filter((n) => !isNaN(n) && n >= 0 && n < pageCount);

      if (indices.length === 0) {
        setError(`No valid pages found. Enter page numbers from 1 to ${pageCount}.`);
        setExtracting(false);
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
      setExtracting(false);
    }
  };

  const handleDownload = () => {
    if (!pdfUrl) return;
    const a = document.createElement('a');
    a.href = pdfUrl;
    a.download = 'extracted.pdf';
    a.click();
  };

  return (
    <div className="card">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-blue-500" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Page Extractor</h2>
        </div>

        <p className="text-sm text-gray-500 dark:text-gray-400">
          Extract specific pages from a PDF by entering page numbers separated by commas (e.g., &quot;1, 3, 5&quot;).
        </p>

        <UploadBox
          accept={{ 'application/pdf': ['.pdf'] }}
          multiple={false}
          files={files}
          onFiles={handleFiles}
          onRemove={handleRemove}
        />

        <div>
          <label className="label">Page Numbers</label>
          <input
            type="text"
            value={pageNumbers}
            onChange={(e) => { setPageNumbers(e.target.value); setPdfUrl(null); setError(''); }}
            placeholder="e.g., 1, 3, 5"
            className="input mt-1"
          />
        </div>

        {error && (
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        )}

        <div className="flex gap-2">
          <button
            onClick={handleExtract}
            disabled={files.length === 0 || !pageNumbers.trim() || extracting}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {extracting ? 'Extracting...' : 'Extract Pages'}
          </button>
          {pdfUrl && (
            <button onClick={handleDownload} className="btn-secondary flex items-center gap-2">
              <Download className="h-4 w-4" />
              Download Extracted PDF
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
