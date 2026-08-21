'use client';

import { useState } from 'react';
import { UploadBox } from '@/components/tools/upload-box';
import { FileText, Download, AlertCircle } from 'lucide-react';

export function PdfToJpgTool() {
  const [files, setFiles] = useState<File[]>([]);
  const [converting, setConverting] = useState(false);
  const [done, setDone] = useState(false);

  const handleConvert = () => {
    if (files.length === 0) return;
    setConverting(true);
    setTimeout(() => {
      setConverting(false);
      setDone(true);
    }, 1500);
  };

  const handleDownload = () => {
    if (files.length === 0) return;
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 1100;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#000000';
      ctx.font = '20px sans-serif';
      ctx.fillText('Mock page 1 image', 50, 50);
    }
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = files[0].name.replace(/\.pdf$/i, '.jpg');
      a.click();
      URL.revokeObjectURL(url);
    }, 'image/jpeg', 0.95);
  };

  return (
    <div className="card">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-blue-500" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">PDF to JPG</h2>
        </div>

        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-700 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-300">
          <div className="flex items-start gap-2">
            <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
            <span>Full PDF to JPG conversion requires server-side rendering. This is a demo flow for now.</span>
          </div>
        </div>

        <UploadBox
          accept={{ 'application/pdf': ['.pdf'] }}
          multiple={false}
          files={files}
          onFiles={(f) => { setFiles(f); setDone(false); }}
          onRemove={(i) => { setFiles((prev) => prev.filter((_, idx) => idx !== i)); setDone(false); }}
        />

        <div className="flex gap-2">
          <button
            onClick={handleConvert}
            disabled={files.length === 0 || converting}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {converting ? 'Converting...' : 'Convert'}
          </button>
          {done && (
            <button onClick={handleDownload} className="btn-secondary flex items-center gap-2">
              <Download className="h-4 w-4" />
              Download .jpg
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
