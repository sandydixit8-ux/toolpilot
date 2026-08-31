'use client';

import { useState, useCallback } from 'react';
import { UploadBox } from '@/components/tools/upload-box';
import { FileText, Download, CheckCircle, Loader2, RotateCcw } from 'lucide-react';
import { rowsToXlsxBlob, downloadXlsx } from '@/lib/xlsx-export';

interface TextItem {
  str: string;
  x: number;
  y: number;
  width: number;
}

function groupTextItemsIntoRows(items: TextItem[]): string[][] {
  // Sort top-to-bottom by Y, then left-to-right by X.
  items.sort((a, b) => {
    const yDiff = b.y - a.y;
    if (Math.abs(yDiff) > 2) return yDiff > 0 ? -1 : 1;
    return a.x - b.x;
  });

  const rows: string[][] = [];
  let currentRow: string[] = [];
  let lastY: number | null = null;

  for (const item of items) {
    if (lastY !== null && Math.abs(lastY - item.y) > 3) {
      rows.push(currentRow);
      currentRow = [item.str];
    } else {
      currentRow.push(item.str);
    }
    lastY = item.y;
  }
  if (currentRow.length > 0) rows.push(currentRow);

  return rows;
}

export function PdfToExcelTool() {
  const [files, setFiles] = useState<File[]>([]);
  const [converting, setConverting] = useState(false);
  const [progress, setProgress] = useState('');
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');
  const [xlsxBlob, setXlsxBlob] = useState<Blob | null>(null);

  const handleFiles = useCallback((newFiles: File[]) => {
    setFiles(newFiles.slice(0, 1));
    setDone(false);
    setError('');
    setXlsxBlob(null);
  }, []);

  const handleRemove = useCallback(() => {
    setFiles([]);
    setDone(false);
    setError('');
    setXlsxBlob(null);
  }, []);

  const handleConvert = async () => {
    if (files.length === 0) return;
    setConverting(true);
    setError('');
    setDone(false);
    setXlsxBlob(null);

    try {
      setProgress('Reading PDF...');
      const pdfjsLib = await import('pdfjs-dist');
      pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

      const arrayBuffer = await files[0].arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

      const allRows: (string | number)[][] = [];

      for (let i = 1; i <= pdf.numPages; i++) {
        setProgress(`Extracting page ${i} of ${pdf.numPages}...`);
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();

        const items: TextItem[] = content.items
          .map((it) => {
            const item = it as { str?: string; transform?: number[]; width?: number };
            const str = item.str || '';
            if (!str.trim()) return null;
            const transform = item.transform || [1, 0, 0, 1, 0, 0];
            return {
              str,
              x: transform[4],
              y: transform[5],
              width: item.width || 0,
            } as TextItem;
          })
          .filter((it): it is TextItem => it !== null);

        const rows = groupTextItemsIntoRows(items);
        rows.forEach((row) => allRows.push(row));
        allRows.push([]); // blank separator row between pages
      }

      const blob = await rowsToXlsxBlob(allRows);
      setXlsxBlob(blob);
      setDone(true);
      setProgress('');
    } catch (err) {
      console.error('Conversion error:', err);
      setError('Failed to convert PDF. Please try a file with selectable text.');
      setProgress('');
    } finally {
      setConverting(false);
    }
  };

  const handleDownload = () => {
    if (!xlsxBlob || files.length === 0) return;
    const baseName = files[0].name.replace(/\.pdf$/i, '') || 'document';
    downloadXlsx(xlsxBlob, `${baseName}.xlsx`);
  };

  const handleReset = () => {
    setFiles([]);
    setDone(false);
    setError('');
    setProgress('');
    setXlsxBlob(null);
  };

  return (
    <div className="card">
      <div className="space-y-5">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-blue-500" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">PDF to Excel</h2>
        </div>

        <p className="text-sm text-gray-500 dark:text-gray-400">
          Convert your PDF tables into an editable Excel (.xlsx) file.
        </p>

        {files.length === 0 && (
          <UploadBox
            onFiles={handleFiles}
            accept={{ "application/pdf": [".pdf"] }}
            multiple={false}
          />
        )}

        {files.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{files[0].name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{(files[0].size / 1024).toFixed(1)} KB</p>
                </div>
              </div>
              <button
                onClick={handleRemove}
                className="text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                Remove
              </button>
            </div>

            {!done && (
              <button
                onClick={handleConvert}
                disabled={converting}
                className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-60"
              >
                {converting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {progress || 'Converting...'}
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4" />
                    Convert to Excel
                  </>
                )}
              </button>
            )}

            {progress && !done && <p className="text-sm text-gray-500 dark:text-gray-400">{progress}</p>}
            {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

            {done && xlsxBlob && (
              <div className="flex flex-col items-center gap-3 rounded-xl bg-green-50 p-5 dark:bg-green-950/50">
                <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
                <p className="text-sm font-medium text-green-700 dark:text-green-300">Conversion complete!</p>
                <button
                  onClick={handleDownload}
                  className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-brand-700"
                >
                  <Download className="h-4 w-4" />
                  Download .xlsx
                </button>
                <button
                  onClick={handleReset}
                  className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  <RotateCcw className="h-4 w-4" />
                  Convert another file
                </button>
              </div>
            )}
          </div>
        )}

        <div className="rounded-lg bg-blue-50 p-4 text-xs text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">
          <strong>Tip:</strong> Works best with selectable (digital) PDFs that contain clear tables or columns.
          Scanned PDFs that are images need OCR and may not extract text. Everything runs in your browser.
        </div>
      </div>
    </div>
  );
}
