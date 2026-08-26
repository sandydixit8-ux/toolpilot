'use client';

import { useState, useCallback } from 'react';
import { UploadBox } from '@/components/tools/upload-box';
import {
  FileText,
  Download,
  Loader2,
  RotateCcw,
} from 'lucide-react';

export function PdfToJpgTool() {
  const [files, setFiles] = useState<File[]>([]);
  const [converting, setConverting] = useState(false);
  const [progress, setProgress] = useState('');
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');
  const [pageImages, setPageImages] = useState<{ url: string; page: number }[]>([]);
  const handleFiles = useCallback((newFiles: File[]) => {
    setFiles(newFiles.slice(0, 1));
    setDone(false);
    setError('');
    setPageImages([]);
  }, []);

  const handleRemove = useCallback(() => {
    setFiles([]);
    setDone(false);
    setError('');
    setPageImages([]);
  }, []);

  const handleConvert = async () => {
    if (files.length === 0) return;
    setConverting(true);
    setError('');
    setPageImages([]);
    setProgress('Reading PDF...');

    try {
      const pdfjsLib = await import('pdfjs-dist');
      pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

      const file = files[0];
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const pageCount = pdf.numPages;
      const images: { url: string; page: number }[] = [];

      for (let i = 1; i <= pageCount; i++) {
        setProgress(`Rendering page ${i} of ${pageCount}...`);
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 2.0 });

        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext('2d');

        if (ctx) {
          await page.render({ canvasContext: ctx, viewport, canvas } as never).promise;
          const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
          images.push({ url: dataUrl, page: i });
        }
      }

      setPageImages(images);
      setProgress('');
      setDone(true);
    } catch (err) {
      console.error('Conversion error:', err);
      setError('Failed to convert PDF. Please try a different file.');
      setProgress('');
    } finally {
      setConverting(false);
    }
  };

  const handleDownloadAll = () => {
    if (pageImages.length === 0 || files.length === 0) return;
    pageImages.forEach((img) => {
      const a = document.createElement('a');
      a.href = img.url;
      const baseName = files[0].name.replace(/\.pdf$/i, '');
      a.download = `${baseName}_page_${img.page}.jpg`;
      a.click();
    });
  };

  const handleDownloadSingle = (url: string, page: number) => {
    const a = document.createElement('a');
    a.href = url;
    const baseName = files.length > 0 ? files[0].name.replace(/\.pdf$/i, '') : 'page';
    a.download = `${baseName}_page_${page}.jpg`;
    a.click();
  };

  const handleReset = () => {
    setFiles([]);
    setDone(false);
    setError('');
    setProgress('');
    setPageImages([]);
  };

  return (
    <div className="card">
      <div className="space-y-5">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-blue-500" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">PDF to JPG</h2>
        </div>

        <p className="text-sm text-gray-500 dark:text-gray-400">
          Convert each page of your PDF into high-quality JPG images. All processing happens in your browser.
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

        {done && pageImages.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {pageImages.length} page{pageImages.length !== 1 ? 's' : ''} converted
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {pageImages.map((img) => (
                <div
                  key={img.page}
                  className="group relative overflow-hidden rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800"
                >
                  <img
                    src={img.url}
                    alt={`Page ${img.page}`}
                    className="aspect-[3/4] w-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-all group-hover:bg-black/40">
                    <button
                      onClick={() => handleDownloadSingle(img.url, img.page)}
                      className="rounded-lg bg-white/90 px-3 py-1.5 text-xs font-medium text-gray-900 opacity-0 shadow-lg transition-all group-hover:opacity-100 hover:bg-white"
                    >
                      <Download className="mr-1 inline h-3 w-3" />
                      Page {img.page}
                    </button>
                  </div>
                </div>
              ))}
            </div>
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
              'Convert to JPG'
            )}
          </button>
          {done && pageImages.length > 0 && (
            <button onClick={handleDownloadAll} className="btn-secondary flex items-center gap-2">
              <Download className="h-4 w-4" />
              Download All Pages
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
