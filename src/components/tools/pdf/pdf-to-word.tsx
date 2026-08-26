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

interface TextItem {
  str: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fontSize: number;
}

interface TextLine {
  items: TextItem[];
  y: number;
  xMin: number;
  xMax: number;
}

interface TextBlock {
  lines: TextLine[];
  isTable: boolean;
}

function detectTables(lines: TextLine[]): TextBlock[] {
  if (lines.length === 0) return [];

  const sortedLines = [...lines].sort((a, b) => b.y - a.y);
  const COLUMN_TOLERANCE = 15;
  const ROW_TOLERANCE = 8;

  const allXPositions: number[] = [];
  for (const line of sortedLines) {
    for (const item of line.items) {
      const x = Math.round(item.x / COLUMN_TOLERANCE) * COLUMN_TOLERANCE;
      if (!allXPositions.includes(x)) allXPositions.push(x);
    }
  }
  allXPositions.sort((a, b) => a - b);

  const mergedColumns: number[][] = [];
  for (const x of allXPositions) {
    const lastCol = mergedColumns[mergedColumns.length - 1];
    if (lastCol && Math.abs(x - lastCol[lastCol.length - 1]) < COLUMN_TOLERANCE * 1.5) {
      lastCol.push(x);
    } else {
      mergedColumns.push([x]);
    }
  }

  const columnCenters = mergedColumns.map(col => col.reduce((a, b) => a + b, 0) / col.length);

  const isLikelyTable = columnCenters.length >= 2 && sortedLines.length >= 2;

  if (!isLikelyTable) {
    return sortedLines.map(line => ({
      lines: [line],
      isTable: false,
    }));
  }

  const lineGroups: TextLine[][] = [];
  let currentGroup: TextLine[] = [sortedLines[0]];

  for (let i = 1; i < sortedLines.length; i++) {
    const prevY = currentGroup[0].y;
    const curY = sortedLines[i].y;
    if (Math.abs(prevY - curY) < ROW_TOLERANCE * 2) {
      currentGroup.push(sortedLines[i]);
    } else {
      lineGroups.push(currentGroup);
      currentGroup = [sortedLines[i]];
    }
  }
  lineGroups.push(currentGroup);

  const blocks: TextBlock[] = [];
  for (const group of lineGroups) {
    if (group.length >= 2) {
      blocks.push({ lines: group, isTable: true });
    } else {
      blocks.push({ lines: group, isTable: false });
    }
  }

  return blocks;
}

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
      pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

      const docxLib = await import('docx');

      const {
        Document,
        Packer,
        Paragraph,
        Table,
        TableRow,
        TableCell,
        WidthType,
        AlignmentType,
        HeadingLevel,
        PageOrientation,
        BorderStyle,
        TextRun,
        VerticalAlign,
        convertInchesToTwip,
      } = docxLib;

      const file = files[0];
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const pageCount = pdf.numPages;

      const allBlocks: { blocks: TextBlock[]; isLandscape: boolean; width: number; height: number }[] = [];

      for (let i = 1; i <= pageCount; i++) {
        setProgress(`Analyzing page ${i} of ${pageCount}...`);
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 1.0 });
        const textContent = await page.getTextContent();

        const isLandscape = viewport.width > viewport.height;

        interface RawTextItem {
          str: string;
          transform: number[];
          width?: number;
          height?: number;
        }
        const rawItems = textContent.items as RawTextItem[];
        const textItems: TextItem[] = rawItems
          .filter((item) => item.str && item.str.trim().length > 0)
          .map((item) => {
            const tx = item.transform;
            return {
              str: item.str,
              x: tx[4],
              y: tx[5],
              width: item.width || 0,
              height: item.height || 0,
              fontSize: Math.abs(tx[0]) || Math.abs(tx[3]) || 12,
            };
          });

        const lines: TextLine[] = [];
        const sorted = [...textItems].sort((a, b) => b.y - a.y);
        let currentLine: TextItem[] = [];
        let lineY = -1;

        for (const item of sorted) {
          if (lineY === -1 || Math.abs(item.y - lineY) < 5) {
            currentLine.push(item);
            if (lineY === -1) lineY = item.y;
          } else {
            if (currentLine.length > 0) {
              currentLine.sort((a, b) => a.x - b.x);
              lines.push({
                items: currentLine,
                y: lineY,
                xMin: Math.min(...currentLine.map(it => it.x)),
                xMax: Math.max(...currentLine.map(it => it.x + it.width)),
              });
            }
            currentLine = [item];
            lineY = item.y;
          }
        }
        if (currentLine.length > 0) {
          currentLine.sort((a, b) => a.x - b.x);
          lines.push({
            items: currentLine,
            y: lineY,
            xMin: Math.min(...currentLine.map(it => it.x)),
            xMax: Math.max(...currentLine.map(it => it.x + it.width)),
          });
        }

        const blocks = detectTables(lines);
        allBlocks.push({
          blocks,
          isLandscape,
          width: viewport.width,
          height: viewport.height,
        });
      }

      if (allBlocks.length === 0) {
        setError('No text found in PDF. The document may be image-based or scanned.');
        setConverting(false);
        setProgress('');
        return;
      }

      setProgress('Generating Word document...');

      const pageMargin = {
        top: convertInchesToTwip(1),
        right: convertInchesToTwip(1),
        bottom: convertInchesToTwip(1),
        left: convertInchesToTwip(1),
      };

      const sections = allBlocks.map((pageData, pageIdx) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const pageChildren: any[] = [];

        if (pageIdx === 0) {
          pageChildren.push(new Paragraph({
            children: [
              new TextRun({
                text: file.name.replace(/\.pdf$/i, ''),
                bold: true,
                size: 32,
              }),
            ],
            heading: HeadingLevel.HEADING_1,
            spacing: { after: 200 },
          }));

          pageChildren.push(new Paragraph({
            border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: '999999' } },
            spacing: { after: 300 },
          }));
        } else {
          pageChildren.push(new Paragraph({
            children: [
              new TextRun({
                text: `--- Page ${pageIdx + 1} ---`,
                color: '999999',
                size: 18,
                italics: true,
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { before: 400, after: 200 },
          }));
        }

        for (const block of pageData.blocks) {
          if (block.isTable && block.lines.length >= 2) {
            const maxCols = Math.max(...block.lines.map(l => l.items.length));

            const rows = block.lines.map(line => {
              const cells = [];
              for (let col = 0; col < maxCols; col++) {
                const item = line.items[col];
                cells.push(
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: item ? item.str : '',
                            size: 20,
                          }),
                        ],
                        spacing: { before: 40, after: 40 },
                      }),
                    ],
                    verticalAlign: VerticalAlign.CENTER,
                    borders: {
                      top: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' },
                      bottom: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' },
                      left: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' },
                      right: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' },
                    },
                  })
                );
              }
              return new TableRow({ children: cells });
            });

            pageChildren.push(
              new Table({
                rows,
                width: {
                  size: 100,
                  type: WidthType.PERCENTAGE,
                },
              })
            );
          } else {
            const text = block.lines
              .flatMap(l => l.items.map(it => it.str))
              .join(' ')
              .trim();

            if (text) {
              pageChildren.push(
                new Paragraph({
                  children: [
                    new TextRun({
                      text,
                      size: 22,
                    }),
                  ],
                  spacing: { before: 80, after: 80 },
                })
              );
            }
          }
        }

        return {
          properties: {
            page: {
              size: {
                width: Math.round(pageData.width * (1440 / 72)),
                height: Math.round(pageData.height * (1440 / 72)),
                orientation: pageData.isLandscape ? PageOrientation.LANDSCAPE : PageOrientation.PORTRAIT,
              },
              margin: pageMargin,
            },
          },
          children: pageChildren,
        };
      });

      const doc = new Document({
        sections,
      });

      const blob = await Packer.toBlob(doc);
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
    a.download = files[0].name.replace(/\.pdf$/i, '.docx');
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
          Convert your PDF to an editable Word document. Preserves page orientation, tables, and formatting. All processing happens in your browser.
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
              Download .docx
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
