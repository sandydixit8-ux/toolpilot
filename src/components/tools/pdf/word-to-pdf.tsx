'use client';

import { useState, useEffect } from 'react';
import { UploadBox } from '@/components/tools/upload-box';
import { FileText, CheckCircle, Download } from 'lucide-react';
import { ProcessingOverlay } from '@/components/tools/processing-overlay';
import { Sparkles } from 'lucide-react';

const RENDER_URL = 'https://toolpilot-5b6c.onrender.com';

export function WordToPdfTool() {
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<'idle' | 'processing' | 'complete' | 'error'>('idle');
  const [error, setError] = useState('');
  const [progress, setProgress] = useState('');
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [filename, setFilename] = useState('');
  const [pageCount, setPageCount] = useState(0);

  useEffect(() => {
    fetch(`${RENDER_URL}/health`, { mode: 'no-cors', signal: AbortSignal.timeout(60000) }).catch(() => {});
  }, []);

  const handleConvert = async () => {
    if (files.length === 0) return;
    setStatus('processing');
    setError('');
    setPdfUrl(null);

    try {
      const file = files[0];
      const formData = new FormData();
      formData.append('file', file);

      setProgress('Converting with LibreOffice engine...');

      const response = await fetch('/api/convert/docx-to-pdf', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errBody = await response.json().catch(() => null);
        throw new Error(errBody?.error || 'Conversion failed');
      }

      const blob = await response.blob();
      if (blob.size < 100) throw new Error('Conversion produced empty file');

      const pageCountHeader = response.headers.get('X-Page-Count');
      if (pageCountHeader) setPageCount(parseInt(pageCountHeader, 10));

      const outFilename = file.name.replace(/\.(doc|docx)$/i, '.pdf');
      setFilename(outFilename);
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
      setProgress('');
      setStatus('complete');
    } catch (err: unknown) {
      const error = err as { message?: string };
      console.error('Word to PDF conversion error:', err);
      if (error.message?.includes('waking up') || error.message?.includes('unavailable')) {
        setError('Conversion service is starting up. Please try again in 30 seconds.');
      } else if (error.message?.includes('timed out') || error.message?.includes('timeout')) {
        setError('Conversion timed out. The document may be too large.');
      } else {
        setError(error.message || 'Conversion failed. Please try again.');
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
          Convert your .doc or .docx files to PDF using LibreOffice engine.
        </p>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/50 dark:text-red-300">
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
