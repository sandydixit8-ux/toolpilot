'use client';

import { useState, useCallback } from 'react';
import { PDFDocument, degrees } from 'pdf-lib';
import { UploadBox } from '@/components/tools/upload-box';
import { FileText, Download } from 'lucide-react';

type Rotation = 90 | 180 | 270;

export function PdfRotatorTool() {
  const [files, setFiles] = useState<File[]>([]);
  const [rotation, setRotation] = useState<Rotation>(90);
  const [rotating, setRotating] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [error, setError] = useState('');

  const handleRemove = useCallback((index: number) => {
    setFiles((prev) => prev.filter((_, idx) => idx !== index));
    setPdfUrl(null);
    setError('');
  }, []);

  const handleFiles = useCallback((newFiles: File[]) => {
    setFiles(newFiles.slice(0, 1));
    setPdfUrl(null);
    setError('');
  }, []);

  const handleRotate = async () => {
    if (files.length === 0) return;
    setRotating(true);
    setError('');

    try {
      const pdfBytes = await files[0].arrayBuffer();
      const pdf = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });

      const pages = pdf.getPages();
      for (const page of pages) {
        const currentRotation = page.getRotation().angle;
        page.setRotation(degrees((currentRotation + rotation) % 360));
      }

      const newBytes = await pdf.save();
      const blob = new Blob([newBytes as unknown as BlobPart], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
    } catch {
      setError('Failed to rotate PDF. Please try a different file.');
    } finally {
      setRotating(false);
    }
  };

  const handleDownload = () => {
    if (!pdfUrl) return;
    const a = document.createElement('a');
    a.href = pdfUrl;
    a.download = 'rotated.pdf';
    a.click();
  };

  return (
    <div className="card">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-blue-500" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">PDF Rotator</h2>
        </div>

        <p className="text-sm text-gray-500 dark:text-gray-400">
          Rotate all pages in a PDF document by your chosen angle.
        </p>

        <UploadBox
          accept={{ 'application/pdf': ['.pdf'] }}
          multiple={false}
          files={files}
          onFiles={handleFiles}
          onRemove={handleRemove}
        />

        <div>
          <label className="label">Rotation Angle</label>
          <div className="mt-1 flex gap-2">
            {([90, 180, 270] as Rotation[]).map((angle) => (
              <button
                key={angle}
                onClick={() => setRotation(angle)}
                className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                  rotation === angle
                    ? 'border-blue-500 bg-blue-50 text-blue-700 dark:border-blue-400 dark:bg-blue-950/50 dark:text-blue-300'
                    : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                {angle}°
              </button>
            ))}
          </div>
        </div>

        {error && (
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        )}

        <div className="flex gap-2">
          <button
            onClick={handleRotate}
            disabled={files.length === 0 || rotating}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {rotating ? 'Rotating...' : 'Rotate PDF'}
          </button>
          {pdfUrl && (
            <button onClick={handleDownload} className="btn-secondary flex items-center gap-2">
              <Download className="h-4 w-4" />
              Download Rotated PDF
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
