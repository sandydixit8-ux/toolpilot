const { getDocument } = require('pdfjs-dist/build/pdf.mjs');

const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, Table, TableRow, TableCell, WidthType, BorderStyle, ShadingType, PageOrientation } = require('docx');

async function loadPdfish() {
  return import('pdfjs-dist/build/pdf.mjs');
}

const TY_TOLERANCE = 3.5;

async function extractStructure(pdfPath) {
  const pdfjs = await loadPdfish();
  const fsModule = require('fs');
  const data = new Uint8Array(fsModule.readFileSync(pdfPath));
  const doc = await pdfjs.getDocument({ data }).promise;

  const pages = [];
  for (let p = 1; p <= doc.numPages; p++) {
    const page = await doc.getPage(p);
    const viewport = page.getViewport({ scale: 1 });
    const content = await page.getTextContent();

    const items = [];
    for (const item of content.items) {
      if (!item.str || !item.str.trim()) continue;
      // item.transform[4] = x, [5] = y (y goes UP from bottom in pdfjs)
      items.push({
        x: item.transform[4],
        y: item.transform[5],
        w: item.width || 0,
        h: item.height || 0,
        fontSize: (item.transform[0] && item.transform[0] !== 0) ? Math.abs(item.transform[0]) : 10,
        str: item.str,
      });
    }

    pages.push({
      pageNumber: p,
      width: viewport.width,
      height: viewport.height,
      rotate: page.rotate,
      items,
    });
  }

  await doc.destroy();
  return pages;
}

function isLandscape(page) {
  const effectiveRotate = page.rotate ? ((page.rotate % 360) + 360) % 360 : 0;
  const rotated = effectiveRotate === 90 || effectiveRotate === 270;
  const w = rotated ? page.height : page.width;
  const h = rotated ? page.width : page.height;
  return w > h;
}

function groupLines(items) {
  const sorted = [...items].sort((a, b) => b.y - a.y);
  const lines = [];
  let currentLine = null;

  for (const item of sorted) {
    if (currentLine && Math.abs(item.y - currentLine.y) <= TY_TOLERANCE) {
      currentLine.items.push(item);
      currentLine.y = (currentLine.y + item.y) / 2;
    } else {
      currentLine = { y: item.y, items: [item] };
      lines.push(currentLine);
    }
  }

  for (const line of lines) {
    line.items.sort((a, b) => a.x - b.x);
    const avgSize = line.items.reduce((s, i) => s + i.fontSize, 0) / line.items.length;
    line.fontSize = avgSize;
    line.text = line.items.map(i => i.str).join(' ').replace(/\s+/g, ' ').trim();
  }

  return lines;
}

const CELL_GAP_MULTIPLIER = 1.8;

function splitCells(lineItems) {
  const cells = [];
  let currentWords = [lineItems[0]];

  for (let i = 1; i < lineItems.length; i++) {
    const prev = lineItems[i - 1];
    const cur = lineItems[i];
    const gap = cur.x - (prev.x + prev.w);
    const avgWordGapEstimate = currentWords.reduce((s, w) => s + (w.w || 10), 0) / Math.max(1, currentWords.length) * 0.15;
    const threshold = Math.max(avgWordGapEstimate * CELL_GAP_MULTIPLIER, 12);

    if (gap > threshold) {
      cells.push(currentWords);
      currentWords = [cur];
    } else {
      currentWords.push(cur);
    }
  }
  cells.push(currentWords);

  return cells.map(words => ({
    x: words[0].x,
    text: words.map(w => w.str).join('').replace(/\s+/g, ' '),
  }));
}

function buildPageModel(page) {
  const lines = groupLines(page.items);
  const cellLines = lines.map(line => ({
    y: line.y,
    fontSize: line.fontSize,
    text: line.text,
    cells: splitCells(line.items),
  }));

  // Collect all cell start-x positions across the page
  const xClusters = [];
  for (const line of cellLines) {
    for (const cell of line.cells) {
      let found = false;
      for (const cluster of xClusters) {
        if (Math.abs(cluster.x - cell.x) < 8) {
          cluster.x = (cluster.x * cluster.count + cell.x) / (cluster.count + 1);
          cluster.count += 1;
          found = true;
          break;
        }
      }
      if (!found) {
        xClusters.push({ x: cell.x, count: 1 });
      }
    }
  }

  // A column must appear in at least 2 distinct lines to be a real table column
  const columns = xClusters
    .filter(c => c.count >= 2)
    .sort((a, b) => a.x - b.x)
    .map(c => c.x);

  const isLikelyTable = columns.length >= 2;

  const rows = [];
  if (isLikelyTable) {
    // Assign lines to table rows: line spans >= 2 columns AND cells map to columns
    for (const line of cellLines) {
      const rowCells = [];
      for (const col of columns) {
        let match = null;
        let bestDist = 15;
        for (const cell of line.cells) {
          const dist = Math.abs(cell.x - col);
          if (dist < bestDist) {
            bestDist = dist;
            match = cell;
          }
        }
        rowCells.push(match ? match.text : '');
      }
      const filled = rowCells.filter(c => c !== '').length;
      if (filled >= 2) {
        rows.push({ y: line.y, fontSize: line.fontSize, cells: rowCells, isHeader: filled === rowCells.length && line.fontSize >= 11 });
      } else {
        rows.push(null);
      }
    }
  }

  return { isLikelyTable, columns, rows, rawLines: cellLines };
}

function detectTableBlocks(model) {
  // Convert rows[] (with nulls for non-table lines) into contiguous table blocks.
  // Filter out separator lines like "----".
  const blocks = [];
  let current = null;

  const isSeparator = (text) => /^[\-\=\_\s]+$/.test((text || '').trim()) && (text || '').trim().length > 0;

  for (let i = 0; i < model.rows.length; i++) {
    const row = model.rows[i];
    if (row && !isSeparator(row.cells.join('|'))) {
      if (!current) {
        current = { rows: [] };
        blocks.push(current);
      }
      current.rows.push(row);
    } else {
      current = null;
    }
  }

  // Only keep blocks with 2+ rows (header + data)
  return blocks.filter(b => b.rows.length >= 2);
}

function buildDocxFromPages(pages, opts = {}) {
  const sections = [];

  for (const page of pages) {
    const landscape = isLandscape(page);
    const model = buildPageModel(page);
    const tableBlocks = model.isLikelyTable ? detectTableBlocks(model) : [];
    const remainingLines = [];

    // Build a map of y-position -> used in table block
    const usedY = new Set();
    for (const block of tableBlocks) {
      for (const row of block.rows) {
        usedY.add(row.y.toFixed(2));
      }
    }

    for (const line of model.rawLines) {
      // Only include non-table lines as paragraphs
      for (const blk of tableBlocks) {
        const blkYs = new Set(blk.rows.map(r => r.y.toFixed(2)));
        if (blkYs.has(line.y.toFixed(2))) {
          line._inTable = true;
        }
      }
      if (!line._inTable) {
        remainingLines.push(line);
      }
    }

    // Separate text before table blocks and after (approximate by y order)
    const sortedBlocks = tableBlocks.map((b, idx) => ({ block: b, idx }));
    const blockYMin = sortedBlocks.map(sb => Math.min(...sb.block.rows.map(r => r.y)));

    const children = [];

    // Lines above the first table
    const firstTableY = tableBlocks.length ? Math.min(...tableBlocks.map(b => Math.min(...b.rows.map(r => r.y)))) : Infinity;
    const linesAbove = remainingLines.filter(l => l.y > firstTableY);
    const linesBelow = remainingLines.filter(l => l.y <= firstTableY);

    for (const line of [...linesAbove.sort((a, b) => b.y - a.y), ...linesBelow.sort((a, b) => b.y - a.y)]) {
      children.push(paragraphFromLine(line));
    }

    // Insert tables at appropriate positions
    // For simplicity: tables rendered after the above text, then below text.
    // (Approximation — better than before, and tables + orientation preserved.)

    for (const block of tableBlocks) {
      const rows = block.rows.map(row =>
        new TableRow({
          children: row.cells.map(cellText =>
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: cellText, size: 20, font: 'Calibri' })], spacing: { after: 40 } })],
              shading: row.isHeader ? { type: ShadingType.CLEAR, fill: 'F2F2F2' } : undefined,
            })
          ),
        })
      );
      children.push(
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows,
        })
      );
      children.push(new Paragraph({ spacing: { after: 120 } }));
    }

    // docx library expects base (portrait) dimensions when orientation is set;
    // it automatically swaps them for LANDSCAPE.
    sections.push({
      properties: {
        page: {
          size: {
            width: 12240,
            height: 15840,
            orientation: landscape ? PageOrientation.LANDSCAPE : PageOrientation.PORTRAIT,
          },
          margin: { top: 1008, right: 1008, bottom: 1008, left: 1008 },
        },
      },
      children,
    });
  }

  const doc = new Document({ sections });
  return Packer.toBuffer(doc);
}

function headingLevelFor(fontSize) {
  if (fontSize >= 20) return HeadingLevel.HEADING_1;
  if (fontSize >= 16) return HeadingLevel.HEADING_2;
  if (fontSize >= 13) return HeadingLevel.HEADING_3;
  return null;
}

function paragraphFromLine(line) {
  const level = headingLevelFor(line.fontSize);
  const text = line.text;
  if (level) {
    return new Paragraph({
      children: [new TextRun({ text, bold: true, size: 28, font: 'Calibri' })],
      heading: level,
      spacing: { before: 160, after: 80 },
    });
  }
  return new Paragraph({
    children: [new TextRun({ text, size: 22, font: 'Calibri' })],
    spacing: { after: 100 },
  });
}

module.exports = {
  extractStructure,
  isLandscape,
  buildPageModel,
  groupLines,
  splitCells,
  detectTableBlocks,
  buildDocxFromPages,
  paragraphFromLine,
};