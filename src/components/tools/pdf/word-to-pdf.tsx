'use client';

import { useState } from 'react';
import { UploadBox } from '@/components/tools/upload-box';
import { FileText, CheckCircle, Download, AlertTriangle } from 'lucide-react';
import { ProcessingOverlay } from '@/components/tools/processing-overlay';
import { Sparkles } from 'lucide-react';

const RENDER_URL = process.env.NEXT_PUBLIC_RENDER_CONVERTER_URL || '';

export function WordToPdfTool() {
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<'idle' | 'processing' | 'complete' | 'error'>('idle');
  const [error, setError] = useState('');
  const [progress, setProgress] = useState('');
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [filename, setFilename] = useState('');
  const [pageCount, setPageCount] = useState(0);

  const handleConvert = async () => {
    if (files.length === 0) return;
    setStatus('processing');
    setProgress('Uploading document...');
    setError('');
    setPdfUrl(null);

    try {
      const file = files[0];
      let pdfBlob: Blob | null = null;

      const formData = new FormData();
      formData.append('file', file);

      const endpoints = [
        ...(RENDER_URL ? [`${RENDER_URL}/convert/docx-to-pdf`] : []),
        '/api/convert/docx-to-pdf',
      ];

      for (const endpoint of endpoints) {
        try {
          setProgress(endpoint.includes('render') ? 'Converting with LibreOffice engine...' : 'Converting with server...');
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 90000);

          const response = await fetch(endpoint, {
            method: 'POST',
            body: formData,
            signal: controller.signal,
          });
          clearTimeout(timeoutId);

          if (response.ok) {
            const blob = await response.blob();
            if (blob.size > 100 && (blob.type.includes('pdf') || blob.size > 1000)) {
              pdfBlob = blob;

              const pageCountHeader = response.headers.get('X-Page-Count');
              if (pageCountHeader) setPageCount(parseInt(pageCountHeader, 10));

              const isRasterized = response.headers.get('X-Rasterized') === 'true';
              const warnings = response.headers.get('X-Warnings');
              if (isRasterized) {
                setError('Warning: PDF may contain rasterized content.');
              } else if (warnings) {
                setError(`Note: ${warnings}`);
              }
              break;
            }
          }
        } catch {
          continue;
        }
      }

      if (!pdfBlob) {
        throw new Error('All conversion methods failed. Please try again later.');
      }

      const outFilename = file.name.replace(/\.(doc|docx)$/i, '.pdf');
      setFilename(outFilename);
      const url = URL.createObjectURL(pdfBlob);
      setPdfUrl(url);
      setProgress('');
      setStatus('complete');
    } catch (err: unknown) {
      const error = err as { message?: string };
      console.error('Word to PDF conversion error:', err);
      if (error.message?.includes('Failed to fetch') || error.message?.includes('NetworkError')) {
        setError('Conversion service is unavailable. Please try again later.');
      } else {
        setError(error.message || 'Conversion failed. The document may be corrupted or contain unsupported elements.');
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
          Server-side conversion (LibreOffice) for best quality.
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
                PDF created successfully! {pageCount > 0 && `${pageCount} pages`}
              </p>
            </div>
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
