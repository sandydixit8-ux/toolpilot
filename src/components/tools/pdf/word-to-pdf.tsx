'use client';

import { useState } from 'react';
import { UploadBox } from '@/components/tools/upload-box';
import { FileText, CheckCircle, Download, AlertTriangle } from 'lucide-react';
import { ProcessingOverlay } from '@/components/tools/processing-overlay';
import { Sparkles } from 'lucide-react';

export function WordToPdfTool() {
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<'idle' | 'processing' | 'complete' | 'error'>('idle');
  const [error, setError] = useState('');
  const [progress, setProgress] = useState('');
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [filename, setFilename] = useState('');
  const [pageCount, setPageCount] = useState(0);
  const [usedFallback, setUsedFallback] = useState(false);

  const CONVERSION_API = '/api/convert/docx-to-pdf';

  const convertViaClientSide = async (file: File): Promise<Blob> => {
    const [{ default: mammoth }, jspdfModule] = await Promise.all([
      import('mammoth'),
      import('jspdf'),
    ]);

    const { jsPDF } = jspdfModule;
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.convertToHtml({ arrayBuffer });

    const container = document.createElement('div');
    container.innerHTML = `<div style="font-family: Arial, Helvetica, sans-serif; font-size: 11pt; line-height: 1.6; color: #1a1a1a; padding: 20px;">
      ${result.value}
    </div>`;
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '210mm';
    container.style.zIndex = '99999';
    container.style.background = 'white';
    container.style.padding = '20px';
    document.body.appendChild(container);

    await new Promise((r) => setTimeout(r, 300));

    try {
      const pdf = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });

      await pdf.html(container, {
        callback: () => {},
        html2canvas: { scale: 0.264, useCORS: true, logging: false },
        x: 5, y: 5,
        width: 200,
        windowWidth: 800,
      });

      return pdf.output('blob');
    } finally {
      document.body.removeChild(container);
    }
  };

  const handleConvert = async () => {
    if (files.length === 0) return;
    setStatus('processing');
    setProgress('Uploading document...');
    setError('');
    setPdfUrl(null);
    setUsedFallback(false);

    try {
      const file = files[0];
      let pdfBlob: Blob;
      let serverSuccess = false;

      // Try server-side conversion first
      try {
        const formData = new FormData();
        formData.append('file', file);

        setProgress('Converting with LibreOffice engine...');

        const response = await fetch(CONVERSION_API, {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const blob = await response.blob();
          if (blob.size > 100) {
            pdfBlob = blob;
            serverSuccess = true;

            const pageCountHeader = response.headers.get('X-Page-Count');
            const pages = pageCountHeader ? parseInt(pageCountHeader, 10) : 0;
            setPageCount(pages);

            const isRasterized = response.headers.get('X-Rasterized') === 'true';
            const warnings = response.headers.get('X-Warnings');
            if (isRasterized) {
              setError('Warning: PDF may contain rasterized content. Text might not be fully selectable.');
            } else if (warnings) {
              setError(`Note: ${warnings}`);
            }
          }
        }
      } catch {
        // Server conversion failed, will use client-side fallback
      }

      // Fallback to client-side conversion
      if (!serverSuccess!) {
        setProgress('Using browser-based conversion...');
        setUsedFallback(true);
        pdfBlob = await convertViaClientSide(file);
        setPageCount(0);
        setError('');
      }

      const outFilename = file.name.replace(/\.(doc|docx)$/i, '.pdf');
      setFilename(outFilename);
      const url = URL.createObjectURL(pdfBlob!);
      setPdfUrl(url);
      setProgress('');
      setStatus('complete');
    } catch (err: unknown) {
      const error = err as { message?: string };
      console.error('Word to PDF conversion error:', err);
      if (error.message?.includes('Failed to fetch') || error.message?.includes('NetworkError')) {
        setError('Conversion service is unavailable. Please try again later.');
      } else {
        setError(error.message || 'Conversion failed. Please try a different file.');
      }
      setStatus('error');
    }
  };

  const handleDownload = () => {
    if (!pdfUrl) return;
    const a = document.createElement('a');
    a.href = pdfUrl;
    a.download = filename;
    a.click();
  };

  const handleReset = () => {
    if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    setFiles([]);
    setStatus('idle');
    setError('');
    setProgress('');
    setPdfUrl(null);
    setFilename('');
    setPageCount(0);
    setUsedFallback(false);
  };

  return (
    <div className="card">
      <div className="space-y-5">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-blue-500" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Word to PDF</h2>
        </div>

        <p className="text-sm text-gray-500 dark:text-gray-400">
          Convert your .doc or .docx files to PDF. 
          Server-side conversion (LibreOffice) for best quality, with automatic browser-based fallback.
        </p>

        {error && (
          <div className={`rounded-lg border p-3 text-sm ${
            error.startsWith('Warning') || error.startsWith('Note')
              ? 'border-yellow-200 bg-yellow-50 text-yellow-700 dark:border-yellow-800 dark:bg-yellow-950/50 dark:text-yellow-300'
              : 'border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950/50 dark:text-red-300'
          }`}>
            {error}
          </div>
        )}

        <UploadBox
          accept={{
            'application/msword': ['.doc'],
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
          }}
          multiple={false}
          files={files}
          onFiles={(f) => { setFiles(f); setStatus('idle'); setError(''); setPdfUrl(null); }}
          onRemove={(i) => { setFiles((prev) => prev.filter((_, idx) => idx !== i)); setStatus('idle'); setError(''); setPdfUrl(null); }}
          showSizeInfo
        />

        {status === 'processing' && (
          <ProcessingOverlay status="processing" progress={progress} />
        )}

        {status === 'complete' && (
          <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-950/50">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
              <p className="text-sm font-medium text-green-700 dark:text-green-400">
                PDF created successfully! {pageCount > 0 && `${pageCount} pages • `}
                {usedFallback ? 'Browser-based conversion' : 'LibreOffice engine'}
              </p>
            </div>
            {usedFallback && (
              <div className="mb-3 flex items-start gap-2 rounded-lg bg-amber-50 p-2.5 text-xs text-amber-700 dark:bg-amber-950/50 dark:text-amber-300">
                <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                <span>Browser-based conversion may not perfectly preserve complex layouts. For best results, use our API-based converter.</span>
              </div>
            )}
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              <Download className="h-4 w-4" />
              Download {filename}
            </button>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleConvert}
            disabled={files.length === 0 || status === 'processing'}
            className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Sparkles className="h-4 w-4" />
            {status === 'processing' ? 'Converting...' : 'Convert to PDF'}
          </button>
          {(status === 'complete' || status === 'error') && (
            <button onClick={handleReset} className="btn-secondary">
              Convert another
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
