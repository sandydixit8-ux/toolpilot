'use client';

import { useState, useCallback } from 'react';
import { UploadBox } from '@/components/tools/upload-box';
import {
  FileText,
  Download,
  CheckCircle,
  Loader2,
  RotateCcw,
} from 'lucide-react';

export function PdfToWordTool() {
  const [files, setFiles] = useState<File[]>([]);
  const [converting, setConverting] = useState(false);
  const [progress, setProgress] = useState('');
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');
  const [docxBlob, setDocxBlob] = useState<Blob | null>(null);

  const handleFiles = useCallback((newFiles: File[]) => {
    setFiles(newFiles.slice(0, 1));
    setDone(false);
    setError('');
    setDocxBlob(null);
  }, []);

  const handleRemove = useCallback(() => {
    setFiles([]);
    setDone(false);
    setError('');
    setDocxBlob(null);
  }, []);

  const handleConvert = async () => {
    if (files.length === 0) return;
    setConverting(true);
    setError('');
    setProgress('Uploading PDF...');

    try {
      const file = files[0];
      const formData = new FormData();
      formData.append('file', file);

      setProgress('Converting PDF to Word (server-side via LibreOffice)...');

      const response = await fetch('/api/convert/pdf-to-docx', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error || 'Conversion failed');
      }

      setProgress('Preparing download...');
      const blob = await response.blob();
      setDocxBlob(blob);
      setProgress('');
      setDone(true);
    } catch (err) {
      console.error('Conversion error:', err);
      const msg = err instanceof Error ? err.message : 'Failed to convert PDF.';
      setError(msg);
      setProgress('');
    } finally {
      setConverting(false);
    }
  };

  const handleDownload = () => {
    if (!docxBlob || files.length === 0) return;
    const url = URL.createObjectURL(docxBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = files[0].name.replace(/\.pdf$/i, '.docx');
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    setFiles([]);
    setDone(false);
    setError('');
    setProgress('');
    setDocxBlob(null);
  };

  return (
    <div className="card">
      <div className="space-y-5">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-blue-500" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">PDF to Word</h2>
        </div>

        <p className="text-sm text-gray-500 dark:text-gray-400">
          Convert your PDF to an editable Word document. Preserves page orientation, tables, and formatting using LibreOffice.
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

        {converting && progress && (
          <div className="flex items-center gap-2 rounded-lg bg-blue-50 p-3 text-sm text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">
            <Loader2 className="h-4 w-4 animate-spin" />
            {progress}
          </div>
        )}

        {done && (
          <div className="flex items-center gap-2 rounded-lg bg-green-50 p-3 text-sm text-green-700 dark:bg-green-950/50 dark:text-green-300">
            <CheckCircle className="h-4 w-4" />
            Conversion complete! Your Word document is ready to download.
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleConvert}
            disabled={files.length === 0 || converting}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {converting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Converting...
              </span>
            ) : (
              'Convert to Word'
            )}
          </button>
          {done && (
            <button onClick={handleDownload} className="btn-secondary flex items-center gap-2">
              <Download className="h-4 w-4" />
              Download .docx
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
