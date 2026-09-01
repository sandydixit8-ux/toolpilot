'use client';

import { useState, useCallback } from 'react';
import { UploadBox } from '@/components/tools/upload-box';
import { FileText, Copy, CheckCircle, Loader2, RotateCcw, Download } from 'lucide-react';

const TESS_VERSION = '7.0.0';
const CORE_VERSION = '7.0.0';
const WORKER_PATH = `https://cdn.jsdelivr.net/npm/tesseract.js@${TESS_VERSION}/dist/worker.min.js`;
const CORE_PATH = `https://cdn.jsdelivr.net/npm/tesseract.js-core@${CORE_VERSION}`;
const LANG_PATH = 'https://tessdata.projectnaptha.com/4.0.0';

export function ImageToTextTool() {
  const [files, setFiles] = useState<File[]>([]);
  const [preview, setPreview] = useState<string | null>(null);
  const [ocrText, setOcrText] = useState('');
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState('');
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleFiles = useCallback((newFiles: File[]) => {
    setFiles(newFiles.slice(0, 1));
    setOcrText('');
    setDone(false);
    setError('');
    setPreview(null);
    if (newFiles[0]) {
      setPreview(URL.createObjectURL(newFiles[0]));
    }
  }, []);

  const handleRemove = useCallback(() => {
    setFiles([]);
    setPreview(null);
    setOcrText('');
    setDone(false);
    setError('');
  }, []);

  const handleExtract = async () => {
    if (files.length === 0) return;
    setProcessing(true);
    setError('');
    setDone(false);
    setOcrText('');
    setProgress('Loading OCR engine...');

    try {
      const { createWorker } = await import('tesseract.js');
      const worker = await createWorker('eng', 1, {
        workerPath: WORKER_PATH,
        corePath: CORE_PATH,
        langPath: LANG_PATH,
        logger: (m: { status: string; progress: number }) => {
          if (m.status === 'recognizing text') {
            setProgress(`Recognizing text... ${Math.round(m.progress * 100)}%`);
          } else {
            setProgress(m.status);
          }
        },
      });

      const result = await worker.recognize(files[0]);
      const text = result.data.text;
      await worker.terminate();

      setOcrText(text);
      setDone(true);
      setProgress('');
    } catch (err) {
      console.error('OCR error:', err);
      setError('Failed to extract text. Please try a clearer image.');
      setProgress('');
    } finally {
      setProcessing(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(ocrText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard not available
    }
  };

  const handleDownload = () => {
    const blob = new Blob([ocrText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const baseName = files[0]?.name.replace(/\.[^.]+$/, '') || 'extracted-text';
    a.download = `${baseName}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    setFiles([]);
    setPreview(null);
    setOcrText('');
    setDone(false);
    setError('');
    setProgress('');
  };

  return (
    <div className="card">
      <div className="space-y-5">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-blue-500" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Image to Text (OCR)</h2>
        </div>

        <p className="text-sm text-gray-500 dark:text-gray-400">
          Extract editable text from scanned documents, screenshots, and photos.
        </p>

        {files.length === 0 && (
          <UploadBox
            onFiles={handleFiles}
            accept={{
              "image/png": [".png"],
              "image/jpeg": [".jpg", ".jpeg"],
              "image/webp": [".webp"],
              "image/bmp": [".bmp"],
              "image/gif": [".gif"],
            }}
            multiple={false}
          />
        )}

        {files.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-3 rounded-lg border border-gray-200 p-4 dark:border-gray-700">
              {preview && (
                <img
                  src={preview}
                  alt="Preview"
                  className="h-32 w-32 rounded-lg object-contain border border-gray-200 dark:border-gray-700"
                />
              )}
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">{files[0].name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {(files[0].size / 1024).toFixed(1)} KB
                </p>
              </div>
              <button
                onClick={handleRemove}
                className="text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                Remove
              </button>
            </div>

            {!done && !processing && (
              <button
                onClick={handleExtract}
                className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-brand-700"
              >
                <FileText className="h-4 w-4" />
                Extract Text
              </button>
            )}

            {processing && (
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Loader2 className="h-4 w-4 animate-spin" />
                {progress}
              </div>
            )}

            {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

            {done && (
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                  >
                    {copied ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                    {copied ? 'Copied!' : 'Copy Text'}
                  </button>
                  <button
                    onClick={handleDownload}
                    className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                  >
                    <Download className="h-4 w-4" />
                    Download .txt
                  </button>
                  <button
                    onClick={handleReset}
                    className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  >
                    <RotateCcw className="h-4 w-4" />
                    New Image
                  </button>
                </div>

                <textarea
                  value={ocrText}
                  onChange={(e) => setOcrText(e.target.value)}
                  rows={10}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm text-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
                  placeholder="Extracted text will appear here..."
                />
              </div>
            )}
          </div>
        )}

        <div className="rounded-lg bg-blue-50 p-4 text-xs text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">
          <strong>Note:</strong> OCR works best with clear, well-lit images and printed text. Text is extracted
          in your browser (English). The first run downloads language data from a CDN, so it may take a moment.
        </div>
      </div>
    </div>
  );
}
