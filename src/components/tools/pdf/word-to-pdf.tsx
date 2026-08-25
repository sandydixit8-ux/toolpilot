'use client';

import { useState } from 'react';
import { UploadBox } from '@/components/tools/upload-box';
import { FileText, CheckCircle, Download } from 'lucide-react';
import { ProcessingOverlay } from '@/components/tools/processing-overlay';
import { Sparkles } from 'lucide-react';

interface PageChunk {
  html: string;
}

function splitHtmlIntoPages(html: string, containerWidth: number, pageHeightPx: number): string[] {
  const fullContainer = document.createElement('div');
  fullContainer.style.position = 'absolute';
  fullContainer.style.left = '-9999px';
  fullContainer.style.top = '0';
  fullContainer.style.width = `${containerWidth}px`;
  fullContainer.style.fontFamily = 'Arial, Helvetica, sans-serif';
  fullContainer.style.fontSize = '14px';
  fullContainer.style.lineHeight = '1.6';
  fullContainer.style.padding = '40px';
  fullContainer.style.wordWrap = 'break-word';
  fullContainer.style.overflowWrap = 'break-word';
  fullContainer.innerHTML = html;
  document.body.appendChild(fullContainer);

  const totalHeight = fullContainer.scrollHeight;
  document.body.removeChild(fullContainer);

  if (totalHeight <= pageHeightPx) {
    return [html];
  }

  const doc = new DOMParser().parseFromString(html, 'text/html');
  const elements = Array.from(doc.body.childNodes);
  const pages: string[] = [];
  let currentChunks: string[] = [];

  const measureContainer = document.createElement('div');
  measureContainer.style.position = 'absolute';
  measureContainer.style.left = '-9999px';
  measureContainer.style.width = `${containerWidth}px`;
  measureContainer.style.fontFamily = 'Arial, Helvetica, sans-serif';
  measureContainer.style.fontSize = '14px';
  measureContainer.style.lineHeight = '1.6';
  measureContainer.style.padding = '40px';
  measureContainer.style.wordWrap = 'break-word';
  measureContainer.style.overflowWrap = 'break-word';
  document.body.appendChild(measureContainer);

  const getHtml = (el: ChildNode): string => {
    if (el.nodeType === 1) return (el as Element).outerHTML;
    return el.textContent || '';
  };

  for (let i = 0; i < elements.length; i++) {
    const el = elements[i];
    const elHtml = getHtml(el);
    measureContainer.innerHTML = currentChunks.join('') + elHtml;
    const newHeight = measureContainer.scrollHeight;

    if (newHeight > pageHeightPx && currentChunks.length > 0) {
      pages.push(currentChunks.join(''));
      currentChunks = [];
      measureContainer.innerHTML = elHtml;
      currentChunks.push(elHtml);
    } else {
      currentChunks.push(elHtml);
    }
  }

  document.body.removeChild(measureContainer);

  if (currentChunks.length > 0) {
    pages.push(currentChunks.join(''));
  }

  return pages;
}

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

      setProgress('Detecting layout...');

      const CONTAINER_WIDTH = 1123;
      const SCALE = 2;
      const A4_W = 210;
      const A4_H = 297;
      const MARGIN = 10;

      const probeContainer = document.createElement('div');
      probeContainer.style.position = 'absolute';
      probeContainer.style.left = '-9999px';
      probeContainer.style.width = `${CONTAINER_WIDTH}px`;
      probeContainer.style.fontFamily = 'Arial, Helvetica, sans-serif';
      probeContainer.style.fontSize = '14px';
      probeContainer.style.lineHeight = '1.6';
      probeContainer.style.padding = '40px';
      probeContainer.style.wordWrap = 'break-word';
      probeContainer.style.overflowWrap = 'break-word';
      probeContainer.innerHTML = `<div>${bodyHtml}</div>`;
      document.body.appendChild(probeContainer);
      const naturalHeight = probeContainer.scrollHeight;
      document.body.removeChild(probeContainer);

      const probeCanvas = document.createElement('canvas');
      probeCanvas.width = CONTAINER_WIDTH;
      probeCanvas.height = Math.min(naturalHeight, 4000);
      const probeCtx = probeCanvas.getContext('2d')!;
      const probeImg = await html2canvas(probeContainer, { scale: SCALE, useCORS: true, logging: false, backgroundColor: '#ffffff', windowWidth: CONTAINER_WIDTH }).catch(() => null);

      let isLandscape: boolean;
      if (probeImg) {
        isLandscape = probeImg.width > probeImg.height;
      } else {
        isLandscape = naturalHeight < CONTAINER_WIDTH * 0.7;
      }

      const pageWidthMM = isLandscape ? A4_H : A4_W;
      const pageHeightMM = isLandscape ? A4_W : A4_H;
      const contentWidthMM = pageWidthMM - MARGIN * 2;
      const contentHeightMM = pageHeightMM - MARGIN * 2;

      const containerWidth = CONTAINER_WIDTH;
      const pxPerMM = (containerWidth * SCALE) / contentWidthMM;
      const pageContentHeightPx = Math.floor(contentHeightMM * pxPerMM);

      setProgress('Splitting into pages...');
      const pageHtmls = splitHtmlIntoPages(
        `<div style="margin-bottom: 20px; padding-bottom: 10px; border-bottom: 2px solid #2563eb;">
          <h1 style="margin: 0; font-size: 22px; color: #2563eb;">${file.name.replace(/\.(doc|docx)$/i, '')}</h1>
        </div>
        <div>${bodyHtml}</div>`,
        containerWidth,
        pageContentHeightPx
      );

      setProgress(`Rendering ${pageHtmls.length} pages...`);
      const pdfDoc = await PDFDocument.create();

      for (let i = 0; i < pageHtmls.length; i++) {
        setProgress(`Rendering page ${i + 1} of ${pageHtmls.length}...`);

        const pageContainer = document.createElement('div');
        pageContainer.style.position = 'absolute';
        pageContainer.style.left = '-9999px';
        pageContainer.style.top = '0';
        pageContainer.style.width = `${containerWidth}px`;
        pageContainer.style.padding = '40px';
        pageContainer.style.fontFamily = 'Arial, Helvetica, sans-serif';
        pageContainer.style.fontSize = '14px';
        pageContainer.style.lineHeight = '1.6';
        pageContainer.style.color = '#1a1a1a';
        pageContainer.style.background = '#ffffff';
        pageContainer.style.wordWrap = 'break-word';
        pageContainer.style.overflowWrap = 'break-word';
        pageContainer.innerHTML = pageHtmls[i];
        document.body.appendChild(pageContainer);

        const pageCanvas = await html2canvas(pageContainer, {
          scale: SCALE,
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff',
          windowWidth: containerWidth,
        });
        document.body.removeChild(pageContainer);

        const jpegDataUrl = pageCanvas.toDataURL('image/jpeg', 0.92);
        const jpegBytes = Uint8Array.from(atob(jpegDataUrl.split(',')[1]), c => c.charCodeAt(0));
        const jpegImage = await pdfDoc.embedJpg(jpegBytes);

        const imgAspect = pageCanvas.width / pageCanvas.height;
        const pdfContentAspect = contentWidthMM / contentHeightMM;

        let drawWidth: number;
        let drawHeight: number;

        if (imgAspect > pdfContentAspect) {
          drawWidth = contentWidthMM;
          drawHeight = contentWidthMM / imgAspect;
        } else {
          drawHeight = contentHeightMM;
          drawWidth = contentHeightMM * imgAspect;
        }

        const drawX = MARGIN + (contentWidthMM - drawWidth) / 2;
        const drawY = MARGIN + (contentHeightMM - drawHeight) / 2;

        const page = pdfDoc.addPage([pageWidthMM, pageHeightMM]);
        page.drawImage(jpegImage, {
          x: drawX,
          y: pageHeightMM - drawY - drawHeight,
          width: drawWidth,
          height: drawHeight,
        });
      }

      setProgress('Finalizing PDF...');
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });
      const outFilename = file.name.replace(/\.(doc|docx)$/i, '.pdf');
      setFilename(outFilename);
      setPageCount(pageHtmls.length);
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
