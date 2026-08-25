'use client';

import { useState } from 'react';
import { UploadBox } from '@/components/tools/upload-box';
import { FileText, CheckCircle, Download } from 'lucide-react';
import { ProcessingOverlay } from '@/components/tools/processing-overlay';
import { Sparkles } from 'lucide-react';

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
    setProgress('Reading document...');
    setError('');
    setPdfUrl(null);

    try {
      const mammoth = await import('mammoth');
      const html2canvas = (await import('html2canvas')).default;
      const { PDFDocument } = await import('pdf-lib');

      const file = files[0];
      const arrayBuffer = await file.arrayBuffer();

      setProgress('Converting to HTML...');
      const result = await mammoth.convertToHtml({ arrayBuffer });
      const bodyHtml = result.value;

      if (!bodyHtml.trim()) {
        setError('Could not extract text from document.');
        setStatus('error');
        return;
      }

      const TABLE_CSS = `
        table { border-collapse: collapse; width: 100%; margin: 12px 0; font-size: 13px; }
        th, td { border: 1px solid #333; padding: 6px 10px; text-align: left; vertical-align: top; }
        th { background: #f0f0f0; font-weight: bold; }
        tr:nth-child(even) { background: #fafafa; }
      `;

      const TITLE_HTML = `
        <div style="margin-bottom: 20px; padding-bottom: 10px; border-bottom: 2px solid #2563eb;">
          <h1 style="margin: 0; font-size: 22px; color: #2563eb;">${file.name.replace(/\.(doc|docx)$/i, '')}</h1>
        </div>
      `;

      setProgress('Rendering full document...');
      const CONTAINER_WIDTH = 1123;
      const SCALE = 2;
      const A4_W = 210;
      const A4_H = 297;
      const MARGIN = 10;

      const fullContainer = document.createElement('div');
      fullContainer.style.position = 'absolute';
      fullContainer.style.left = '-9999px';
      fullContainer.style.top = '0';
      fullContainer.style.width = `${CONTAINER_WIDTH}px`;
      fullContainer.style.padding = '40px';
      fullContainer.style.fontFamily = 'Arial, Helvetica, sans-serif';
      fullContainer.style.fontSize = '14px';
      fullContainer.style.lineHeight = '1.6';
      fullContainer.style.color = '#1a1a1a';
      fullContainer.style.background = '#ffffff';
      fullContainer.style.wordWrap = 'break-word';
      fullContainer.style.overflowWrap = 'break-word';
      fullContainer.innerHTML = `<style>${TABLE_CSS}</style>${TITLE_HTML}<div>${bodyHtml}</div>`;
      document.body.appendChild(fullContainer);

      const fullCanvas = await html2canvas(fullContainer, {
        scale: SCALE,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: CONTAINER_WIDTH,
      });
      document.body.removeChild(fullContainer);

      setProgress('Detecting layout...');
      const isLandscape = fullCanvas.width > fullCanvas.height;

      const pageWidthMM = isLandscape ? A4_H : A4_W;
      const pageHeightMM = isLandscape ? A4_W : A4_H;
      const contentWidthMM = pageWidthMM - MARGIN * 2;
      const contentHeightMM = pageHeightMM - MARGIN * 2;

      const pxPerMM = fullCanvas.width / contentWidthMM;
      const pageContentHeightPx = Math.floor(contentHeightMM * pxPerMM);

      setProgress(`Generating PDF (${isLandscape ? 'landscape' : 'portrait'})...`);
      const pdfDoc = await PDFDocument.create();

      let srcY = 0;
      let pageNum = 0;

      while (srcY < fullCanvas.height) {
        setProgress(`Rendering page ${pageNum + 1}...`);

        const currentSrcHeight = Math.min(pageContentHeightPx, fullCanvas.height - srcY);
        const destHeightMM = currentSrcHeight / pxPerMM;

        const pageCanvas = document.createElement('canvas');
        pageCanvas.width = fullCanvas.width;
        pageCanvas.height = currentSrcHeight;
        const ctx = pageCanvas.getContext('2d')!;
        ctx.drawImage(
          fullCanvas,
          0, srcY, fullCanvas.width, currentSrcHeight,
          0, 0, fullCanvas.width, currentSrcHeight
        );

        const jpegDataUrl = pageCanvas.toDataURL('image/jpeg', 0.92);
        const jpegBytes = Uint8Array.from(atob(jpegDataUrl.split(',')[1]), c => c.charCodeAt(0));
        const jpegImage = await pdfDoc.embedJpg(jpegBytes);

        const drawX = MARGIN;
        const drawY = pageHeightMM - MARGIN - destHeightMM;

        const page = pdfDoc.addPage([pageWidthMM, pageHeightMM]);
        page.drawImage(jpegImage, {
          x: drawX,
          y: drawY,
          width: contentWidthMM,
          height: destHeightMM,
        });

        srcY += currentSrcHeight;
        pageNum++;
      }

      setProgress('Finalizing PDF...');
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });
      const outFilename = file.name.replace(/\.(doc|docx)$/i, '.pdf');
      setFilename(outFilename);
      setPageCount(pageNum);
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
      setProgress('');
      setStatus('complete');
    } catch (err) {
      console.error('Word to PDF conversion error:', err);
      setError('Conversion failed. Please try a different file.');
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
                PDF generated successfully! ({pageCount} pages)
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
