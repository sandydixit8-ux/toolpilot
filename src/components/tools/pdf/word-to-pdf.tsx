'use client';

import { useState } from 'react';
import { UploadBox } from '@/components/tools/upload-box';
import { FileText, Loader2, CheckCircle, Download } from 'lucide-react';
import { ProcessingOverlay } from '@/components/tools/processing-overlay';
import { Sparkles } from 'lucide-react';

export function WordToPdfTool() {
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<'idle' | 'processing' | 'complete' | 'error'>('idle');
  const [error, setError] = useState('');
  const [progress, setProgress] = useState('');
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [filename, setFilename] = useState('');

  const handleConvert = async () => {
    if (files.length === 0) return;
    setStatus('processing');
    setProgress('Reading document...');
    setError('');
    setPdfUrl(null);

    try {
      const mammoth = await import('mammoth');
      const { default: html2canvas } = await import('html2canvas');
      const { default: jsPDF } = await import('jspdf');

      const file = files[0];
      const arrayBuffer = await file.arrayBuffer();

      setProgress('Converting to HTML...');
      const result = await mammoth.convertToHtml({ arrayBuffer });
      const html = result.value;

      if (!html.trim()) {
        setError('Could not extract text from document. The file may be empty or corrupted.');
        setStatus('error');
        return;
      }

      setProgress('Rendering document...');
      const container = document.createElement('div');
      container.style.position = 'absolute';
      container.style.left = '-9999px';
      container.style.top = '0';
      container.style.width = '794px'; // A4 width at 96dpi
      container.style.padding = '40px';
      container.style.fontFamily = 'Arial, Helvetica, sans-serif';
      container.style.fontSize = '14px';
      container.style.lineHeight = '1.6';
      container.style.color = '#1a1a1a';
      container.style.background = '#ffffff';
      container.innerHTML = `
        <div style="margin-bottom: 20px; padding-bottom: 10px; border-bottom: 2px solid #2563eb;">
          <h1 style="margin: 0; font-size: 22px; color: #2563eb;">${file.name.replace(/\.(doc|docx)$/i, '')}</h1>
        </div>
        <div style="word-wrap: break-word; overflow-wrap: break-word;">
          ${html}
        </div>
      `;
      document.body.appendChild(container);

      setProgress('Generating PDF...');
      const canvas = await html2canvas(container, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });
      document.body.removeChild(container);

      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pdfWidth - 20; // 10mm margin each side
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 10; // top margin

      // First page
      pdf.addImage(imgData, 'JPEG', 10, position, imgWidth, imgHeight);
      heightLeft -= (pdfHeight - 20); // minus top/bottom margins

      // Additional pages if needed
      while (heightLeft > 0) {
        position = heightLeft - imgHeight + 10;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 10, position, imgWidth, imgHeight);
        heightLeft -= (pdfHeight - 20);
      }

      const outFilename = file.name.replace(/\.(doc|docx)$/i, '.pdf');
      setFilename(outFilename);
      const blob = pdf.output('blob');
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
          <ProcessingOverlay
            status="processing"
            progress={progress}
          />
        )}

        {status === 'complete' && (
          <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-950/50">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
              <p className="text-sm font-medium text-green-700 dark:text-green-400">
                PDF generated successfully!
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
