'use client';

import { useState, useCallback } from 'react';
import { PDFDocument } from 'pdf-lib';
import { UploadBox } from '@/components/tools/upload-box';
import { FileText, Download } from 'lucide-react';

export function PdfMergerTool() {
  const [files, setFiles] = useState<File[]>([]);
  const [merging, setMerging] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const handleRemove = useCallback((index: number) => {
    setFiles((prev) => prev.filter((_, idx) => idx !== index));
    setPdfUrl(null);
  }, []);

  const handleFiles = useCallback((newFiles: File[]) => {
    setFiles((prev) => [...prev, ...newFiles]);
    setPdfUrl(null);
  }, []);

  const handleMerge = async () => {
    if (files.length < 2) return;
    setMerging(true);

    try {
      const mergedPdf = await PDFDocument.create();

      for (const file of files) {
        const pdfBytes = await file.arrayBuffer();
        const pdf = await PDFDocument.load(pdfBytes);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      const mergedBytes = await mergedPdf.save();
      const blob = new Blob([mergedBytes as unknown as BlobPart], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
    } catch (err) {
      console.error('Failed to merge PDFs:', err);
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

  return (
    <div className="card">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-blue-500" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">PDF Merger</h2>
        </div>

        <p className="text-sm text-gray-500 dark:text-gray-400">
          Combine multiple PDF files into a single document. Files are merged in the order they are uploaded.
        </p>

        <UploadBox
          accept={{ 'application/pdf': ['.pdf'] }}
          multiple
          files={files}
          onFiles={handleFiles}
          onRemove={handleRemove}
        />

        <div className="flex gap-2">
          <button
            onClick={handleMerge}
            disabled={files.length < 2 || merging}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {merging ? 'Merging...' : 'Merge PDFs'}
          </button>
          {pdfUrl && (
            <button onClick={handleDownload} className="btn-secondary flex items-center gap-2">
              <Download className="h-4 w-4" />
              Download Merged PDF
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
