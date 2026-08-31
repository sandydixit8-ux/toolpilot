'use client';

import { useState, useCallback } from 'react';
import { UploadBox } from '@/components/tools/upload-box';
import { FileText, Loader2 } from 'lucide-react';

interface PdfInfo {
  pageCount: number;
  title: string;
  author: string;
  creator: string;
  producer: string;
  created: string;
  modified: string;
  fileSize: number;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function PdfPageCounterTool() {
  const [files, setFiles] = useState<File[]>([]);
  const [info, setInfo] = useState<PdfInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFiles = useCallback((newFiles: File[]) => {
    setFiles(newFiles.slice(0, 1));
    setInfo(null);
    setError('');
  }, []);

  const handleRemove = useCallback(() => {
    setFiles([]);
    setInfo(null);
    setError('');
  }, []);

  const handleAnalyze = async () => {
    if (files.length === 0) return;
    setLoading(true);
    setError('');

    try {
      const pdfjsLib = await import('pdfjs-dist');
      pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

      const arrayBuffer = await files[0].arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const meta = await pdf.getMetadata();

      const info = (meta.info || {}) as Record<string, string | Date | undefined>;
      let created = '';
      let modified = '';
      const createDate = info.CreationDate;
      const modDate = info.ModDate;
      created = createDate ? new Date(createDate).toLocaleDateString() : '';
      modified = modDate ? new Date(modDate).toLocaleDateString() : '';

      setInfo({
        pageCount: pdf.numPages,
        title: String(info.Title || 'Not available'),
        author: String(info.Author || 'Not available'),
        creator: String(info.Creator || 'Not available'),
        producer: String(info.Producer || 'Not available'),
        created,
        modified,
        fileSize: files[0].size,
      });
    } catch (err) {
      console.error('PDF read error:', err);
      setError('Failed to read PDF. Please try a different file.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFiles([]);
    setInfo(null);
    setError('');
  };

  return (
    <div className="card">
      <div className="space-y-5">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-blue-500" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">PDF Page Counter</h2>
        </div>

        <p className="text-sm text-gray-500 dark:text-gray-400">
          Upload a PDF to see its page count and document details instantly.
        </p>

        {files.length === 0 && (
          <UploadBox
            onFiles={handleFiles}
            accept={{ "application/pdf": [".pdf"] }}
            multiple={false}
          />
        )}

        {files.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{files[0].name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{formatBytes(files[0].size)}</p>
                </div>
              </div>
              <button
                onClick={handleRemove}
                className="text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                Remove
              </button>
            </div>

            {!info && (
              <button
                onClick={handleAnalyze}
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Reading PDF...
                  </>
                ) : (
                  'Count Pages'
                )}
              </button>
            )}

            {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

            {info && (
              <div className="rounded-xl bg-gray-50 p-5 dark:bg-gray-800/50">
                <div className="flex flex-col items-center py-2">
                  <span className="text-4xl font-bold text-brand-600 dark:text-brand-400">{info.pageCount}</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Total Pages</span>
                </div>
                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex justify-between border-b border-gray-200 pb-1 dark:border-gray-700">
                    <span className="text-gray-500 dark:text-gray-400">Filename</span>
                    <span className="font-medium text-gray-900 dark:text-white">{files[0].name}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-200 pb-1 dark:border-gray-700">
                    <span className="text-gray-500 dark:text-gray-400">File Size</span>
                    <span className="font-medium text-gray-900 dark:text-white">{formatBytes(info.fileSize)}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-200 pb-1 dark:border-gray-700">
                    <span className="text-gray-500 dark:text-gray-400">Title</span>
                    <span className="font-medium text-gray-900 dark:text-white">{info.title}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-200 pb-1 dark:border-gray-700">
                    <span className="text-gray-500 dark:text-gray-400">Author</span>
                    <span className="font-medium text-gray-900 dark:text-white">{info.author}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-200 pb-1 dark:border-gray-700">
                    <span className="text-gray-500 dark:text-gray-400">Created</span>
                    <span className="font-medium text-gray-900 dark:text-white">{info.created || 'Not available'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Producer</span>
                    <span className="font-medium text-gray-900 dark:text-white">{info.producer}</span>
                  </div>
                </div>
                <button
                  onClick={handleReset}
                  className="mt-4 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
                >
                  New File
                </button>
              </div>
            )}
          </div>
        )}

        <div className="rounded-lg bg-blue-50 p-4 text-xs text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">
          <strong>Info:</strong> Your PDF is processed entirely in your browser — nothing is uploaded to any server. Great for checking page counts before printing, submitting, or compressing.
        </div>
      </div>
    </div>
  );
}
