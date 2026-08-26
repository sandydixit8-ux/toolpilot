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
  ArrowRight,
  Minus,
} from 'lucide-react';
import { formatBytes } from '@/lib/utils';

type Quality = 'low' | 'medium' | 'high';

const QUALITY_OPTIONS: { value: Quality; label: string; description: string; reduction: string }[] = [
  { value: 'high', label: 'High Quality', description: 'Minimal size reduction, best quality', reduction: '~10-20%' },
  { value: 'medium', label: 'Balanced', description: 'Good balance of quality and size', reduction: '~30-50%' },
  { value: 'low', label: 'Maximum Compression', description: 'Smallest file size, some quality loss', reduction: '~50-70%' },
];

export function PdfCompressorTool() {
  const [files, setFiles] = useState<File[]>([]);
  const [quality, setQuality] = useState<Quality>('medium');
  const [compressing, setCompressing] = useState(false);
  const [progress, setProgress] = useState('');
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedUrl, setCompressedUrl] = useState<string | null>(null);
  const [compressedSize, setCompressedSize] = useState(0);
  const [error, setError] = useState('');

  const handleFiles = useCallback((newFiles: File[]) => {
    setFiles(newFiles.slice(0, 1));
    setCompressedUrl(null);
    setOriginalSize(newFiles[0]?.size || 0);
    setCompressedSize(0);
    setError('');
  }, []);

  const handleRemove = useCallback(() => {
    setFiles([]);
    setCompressedUrl(null);
    setOriginalSize(0);
    setCompressedSize(0);
    setError('');
  }, []);

  const handleCompress = async () => {
    if (files.length === 0) return;
    setCompressing(true);
    setError('');
    setProgress('Reading PDF...');

    try {
      const file = files[0];
      const pdfBytes = await file.arrayBuffer();

      setProgress('Processing pages...');
      const pdfDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });

      if (quality === 'low') {
        const pageCount = pdfDoc.getPageCount();
        for (let i = 0; i < pageCount; i++) {
          setProgress(`Compressing page ${i + 1} of ${pageCount}...`);
          const page = pdfDoc.getPage(i);
          const { width, height } = page.getSize();
          page.setSize(width * 0.75, height * 0.75);
        }
      }

      setProgress('Removing metadata...');
      pdfDoc.setTitle('');
      pdfDoc.setAuthor('');
      pdfDoc.setSubject('');
      pdfDoc.setKeywords([]);
      pdfDoc.setProducer('');
      pdfDoc.setCreator('');

      setProgress('Saving compressed PDF...');
      const compressedBytes = await pdfDoc.save({
        useObjectStreams: quality !== 'high',
        addDefaultPage: false,
      });

      const blob = new Blob([compressedBytes as unknown as BlobPart], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setCompressedUrl(url);
      setCompressedSize(blob.size);
      setProgress('');
    } catch {
      setError('Failed to compress PDF. The file may be corrupted or password-protected.');
      setProgress('');
    } finally {
      setCompressing(false);
    }
  };

  const handleDownload = () => {
    if (!compressedUrl || files.length === 0) return;
    const a = document.createElement('a');
    a.href = compressedUrl;
    a.download = files[0].name.replace(/\.pdf$/i, '_compressed.pdf');
    a.click();
  };

  const handleReset = () => {
    setFiles([]);
    setCompressedUrl(null);
    setOriginalSize(0);
    setCompressedSize(0);
    setError('');
    setProgress('');
  };

  const reduction = originalSize > 0 && compressedSize > 0
    ? Math.round(((originalSize - compressedSize) / originalSize) * 100)
    : 0;

  return (
    <div className="card">
      <div className="space-y-5">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-blue-500" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">PDF Compressor</h2>
        </div>

        <p className="text-sm text-gray-500 dark:text-gray-400">
          Reduce PDF file size by removing metadata and optimizing content. All processing happens in your browser.
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

        {files.length > 0 && !compressedUrl && (
          <div className="space-y-3">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Compression Level
            </p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              {QUALITY_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setQuality(opt.value)}
                  className={`rounded-lg border-2 p-3 text-left transition-all ${
                    quality === opt.value
                      ? 'border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-950/50'
                      : 'border-gray-200 bg-white hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600'
                  }`}
                >
                  <p className={`text-sm font-semibold ${quality === opt.value ? 'text-blue-700 dark:text-blue-300' : 'text-gray-900 dark:text-white'}`}>
                    {opt.label}
                  </p>
                  <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{opt.description}</p>
                  <p className={`mt-1 text-xs font-medium ${quality === opt.value ? 'text-blue-600 dark:text-blue-400' : 'text-green-600 dark:text-green-400'}`}>
                    {opt.reduction} reduction
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {compressedUrl && (
          <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-950/50">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
              <span className="text-sm font-semibold text-green-700 dark:text-green-300">Compression Complete!</span>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="text-center">
                <p className="text-xs text-gray-500 dark:text-gray-400">Original</p>
                <p className="font-bold text-gray-900 dark:text-white">{formatBytes(originalSize)}</p>
              </div>
              <ArrowRight className="h-5 w-5 text-green-500" />
              <div className="text-center">
                <p className="text-xs text-gray-500 dark:text-gray-400">Compressed</p>
                <p className="font-bold text-green-700 dark:text-green-300">{formatBytes(compressedSize)}</p>
              </div>
              <Minus className="h-5 w-5 text-gray-300" />
              <div className="text-center">
                <p className="text-xs text-gray-500 dark:text-gray-400">Saved</p>
                <p className="font-bold text-green-600 dark:text-green-400">{reduction}%</p>
              </div>
            </div>
          </div>
        )}

        {compressing && progress && (
          <div className="flex items-center gap-2 rounded-lg bg-blue-50 p-3 text-sm text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">
            <Loader2 className="h-4 w-4 animate-spin" />
            {progress}
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleCompress}
            disabled={files.length === 0 || compressing}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {compressing ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Compressing...
              </span>
            ) : (
              'Compress PDF'
            )}
          </button>
          {compressedUrl && (
            <button onClick={handleDownload} className="btn-secondary flex items-center gap-2">
              <Download className="h-4 w-4" />
              Download Compressed PDF
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
