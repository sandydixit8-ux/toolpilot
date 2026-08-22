'use client';

import { useState, useRef } from 'react';
import { UploadBox } from '@/components/tools/upload-box';
import { FileText, Loader2, CheckCircle } from 'lucide-react';

export function WordToPdfTool() {
  const [files, setFiles] = useState<File[]>([]);
  const [converting, setConverting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  const handleConvert = async () => {
    if (files.length === 0) return;
    setConverting(true);
    setDone(false);
    setError('');
    setProgress('Reading document...');

    try {
      const mammoth = await import('mammoth');
      const html2pdf = (await import('html2pdf.js')).default;

      const file = files[0];
      const arrayBuffer = await file.arrayBuffer();

      setProgress('Converting to HTML...');
      const result = await mammoth.convertToHtml({ arrayBuffer });
      const html = result.value;

      if (!html.trim()) {
        setError('Could not extract text from document. The file may be empty or corrupted.');
        setConverting(false);
        return;
      }

      setProgress('Generating PDF...');
      const container = document.createElement('div');
      container.style.padding = '40px';
      container.style.fontFamily = 'Arial, Helvetica, sans-serif';
      container.style.fontSize = '14px';
      container.style.lineHeight = '1.6';
      container.style.color = '#1a1a1a';
      container.style.maxWidth = '800px';
      container.style.margin = '0 auto';
      container.innerHTML = `
        <div style="margin-bottom: 20px; padding-bottom: 10px; border-bottom: 2px solid #2563eb;">
          <h1 style="margin: 0; font-size: 24px; color: #2563eb;">${file.name.replace(/\.(doc|docx)$/i, '')}</h1>
        </div>
        ${html}
      `;
      document.body.appendChild(container);

      const filename = file.name.replace(/\.(doc|docx)$/i, '.pdf');
      await html2pdf()
        .set({
          margin: 10,
          filename,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        })
        .from(container)
        .save();

      document.body.removeChild(container);
      setProgress('');
      setDone(true);
    } catch (err) {
      console.error('Conversion error:', err);
      setError('Conversion failed. Please try a different file.');
      setProgress('');
    } finally {
      setConverting(false);
    }
  };

  const handleReset = () => {
    setFiles([]);
    setDone(false);
    setError('');
    setProgress('');
  };

  return (
    <div className="card">
      <div className="space-y-4" ref={containerRef}>
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-blue-500" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Word to PDF</h2>
        </div>

        <p className="text-sm text-gray-500 dark:text-gray-400">
          Convert your .doc or .docx files to PDF directly in your browser. No upload to servers.
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
          onFiles={(f) => { setFiles(f); setDone(false); setError(''); }}
          onRemove={(i) => { setFiles((prev) => prev.filter((_, idx) => idx !== i)); setDone(false); setError(''); }}
        />

        {converting && progress && (
          <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400">
            <Loader2 className="h-4 w-4 animate-spin" />
            {progress}
          </div>
        )}

        {done && (
          <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
            <CheckCircle className="h-4 w-4" />
            PDF downloaded successfully!
          </div>
        )}

        <div className="flex gap-2">
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
              'Convert to PDF'
            )}
          </button>
          {done && (
            <button onClick={handleReset} className="btn-secondary">
              Convert another
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
