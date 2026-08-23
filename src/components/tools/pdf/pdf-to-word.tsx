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
    setProgress('Reading PDF...');

    try {
      const pdfjsLib = await import('pdfjs-dist');
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

      const file = files[0];
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const pageCount = pdf.numPages;

      const paragraphs: string[] = [];

      for (let i = 1; i <= pageCount; i++) {
        setProgress(`Extracting text from page ${i} of ${pageCount}...`);
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();

        let lastY = -1;
        let lineText = '';

        for (const item of textContent.items as { str: string; transform: number[] }[]) {
          const currentY = item.transform[5];
          if (lastY !== -1 && Math.abs(currentY - lastY) > 5) {
            if (lineText.trim()) paragraphs.push(lineText.trim());
            lineText = '';
          }
          lineText += item.str;
          lastY = currentY;
        }
        if (lineText.trim()) paragraphs.push(lineText.trim());
      }

      if (paragraphs.length === 0) {
        setError('No text found in PDF. The document may be image-based or scanned.');
        setConverting(false);
        setProgress('');
        return;
      }

      setProgress('Generating Word document...');

      const htmlContent = `
        <html xmlns:o="urn:schemas-microsoft-com:office:office"
              xmlns:w="urn:schemas-microsoft-com:office:word"
              xmlns="http://www.w3.org/TR/REC-html40">
        <head>
          <meta charset="utf-8">
          <title>${file.name.replace(/\.pdf$/i, '')}</title>
          <!--[if gte mso 9]>
          <xml>
            <w:WordDocument>
              <w:View>Print</w:View>
              <w:Zoom>100</w:Zoom>
            </w:WordDocument>
          </xml>
          <![endif]-->
          <style>
            body { font-family: Arial, sans-serif; font-size: 12pt; line-height: 1.5; color: #1a1a1a; max-width: 800px; margin: 0 auto; padding: 40px; }
            h1 { font-size: 20pt; color: #2563eb; margin-bottom: 5px; }
            hr { border: 1px solid #2563eb; margin-bottom: 20px; }
            p { margin: 8px 0; }
          </style>
        </head>
        <body>
          <h1>${file.name.replace(/\.pdf$/i, '')}</h1>
          <hr>
          ${paragraphs.map((p) => `<p>${p.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>`).join('\n')}
        </body>
        </html>
      `;

      const blob = new Blob([htmlContent], {
        type: 'application/msword',
      });
      setDocxBlob(blob);
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

  const handleDownload = () => {
    if (!docxBlob || files.length === 0) return;
    const url = URL.createObjectURL(docxBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = files[0].name.replace(/\.pdf$/i, '.doc');
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
          Extract text from your PDF and convert it to an editable Word document. All processing happens in your browser.
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
              Download .doc
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
