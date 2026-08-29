/**
 * pdf-to-docx.js v3 — Production-grade PDF → DOCX engine
 *
 * Pipeline: EXTRACT → DEDUP → LAYOUT ANALYZE → ELEMENT DETECT → RECONSTRUCT → RENDER → VALIDATE
 *
 * Principles (per Master Prompt):
 *  - Spatial reconstruction, NOT raw extraction order.
 *  - Never "extract all text → dump into paragraphs".
 *  - Tables detected from geometry (repeated column x-positions).
 *  - Word spacing reconstructed from run gaps (font-scale aware).
 *  - Page size + orientation read from real PDF page dims.
 *  - Headers/footers/page numbers promoted to Word header/footer.
 *  - Multi-page tables continue as ONE logical Word table (clustered by column structure).
 *  - Page count preserved via explicit PageBreaks / flowing tables.
 */

const { getDocument } = require('pdfjs-dist/build/pdf.mjs');

const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType,
  Table, TableRow, TableCell, WidthType, BorderStyle, ShadingType,
  PageOrientation, PageBreak, HeightRule, VerticalAlign, PageNumber,
  Header, Footer,
} = require('docx');

async function loadPdfish() {
  return import('pdfjs-dist/build/pdf.mjs');
}

/* ------------------------------------------------------------------ *
 * Tunables (scale-aware — keyed by em/font size, not pixels)
 * ------------------------------------------------------------------ */
const WORD_GAP_FACTOR = 0.11;   // gap > 0.11em between runs ⇒ word boundary
const WORD_GAP_MIN = 0.6;       // pt; floor to ignore float noise
const LINE_GROUP_FACTOR = 0.22; // baselines within 0.22em share a line
const PARA_GAP_FACTOR = 1.7;    // vertical gap > 1.7em ⇒ paragraph break
const PT_TO_TWIP = 20;
const PT_TO_HALF_PT = 2;

/* ================================================================== *
 * PHASE 1 — EXTRACT
 * ================================================================== */
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
      const a = item.transform;
      const size = a && a[0] ? Math.abs(a[0]) : (item.height || 10);
      items.push({
        x: a ? a[4] : 0,
        y: a ? a[5] : 0,
        w: item.width || 0,
        h: item.height || 0,
        size,
        font: item.fontName || 'Helvetica',
        str: item.str,
      });
    }

    pages.push({
      pageNumber: p,
      width: viewport.width,
      height: viewport.height,
      rotate: page.rotate || 0,
      items: dedupItems(items),
    });
  }

  await doc.destroy();
  return pages;
}

/** Remove exact-duplicate extraction artifacts (same text + same box). Never removes legit repeats. */
function dedupItems(items) {
  const kept = [];
  const TOL_X = 2, TOL_Y = 2.5;
  for (const it of items) {
    const key = normalizeSpace(it.str);
    if (!key) continue;
    const dup = kept.find(k =>
      Math.abs(k.x - it.x) <= TOL_X &&
      Math.abs(k.y - it.y) <= TOL_Y &&
      normalizeSpace(k.str) === key &&
      Math.abs(k.w - it.w) <= Math.max(4, it.size)
    );
    if (dup) continue;
    kept.push(it);
  }
  return kept;
}

function normalizeSpace(s) {
  return (s || '').replace(/\s+/g, ' ').trim().toLowerCase();
}

function median(list) {
  if (!list.length) return 0;
  const s = [...list].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
}
function medianSize(items) {
  return median(items.map(i => i.size).filter(Boolean)) || 10;
}

/* ================================================================== *
 * PHASE 2 — LAYOUT ANALYZE
 * ================================================================== */
function effectivePageDims(page) {
  const rot = ((page.rotate % 360) + 360) % 360;
  const rotated = rot === 90 || rot === 270;
  return {
    rot,
    landscape: rotated ? page.height > page.width : page.width > page.height,
    width: rotated ? page.height : page.width,
    height: rotated ? page.width : page.height,
  };
}

const FONT_MAP = [
  [/\b(courier)\b/i, 'Courier New'],
  [/\b(times|timesnewroman|times-roman)\b/i, 'Times New Roman'],
  [/\b(helvetica|arial|liberationsans|dejavusans)\b/i, 'Arial'],
  [/\bsymbol\b/i, 'Symbol'],
  [/\bzapfdingbats\b/i, 'Wingdings'],
];
const FALLBACK_FONT = 'Arial';

function mapFont(fontName) {
  for (const [re, name] of FONT_MAP) {
    if (re.test(fontName)) return name;
  }
  return FALLBACK_FONT;
}

/**
 * Reconstruct text from run geometry.
 *  - Interior spaces already present in runs are preserved.
 *  - Missing space glyphs (producers emitting per-word runs with no space) are
 *    repaired from the horizontal gap.
 *  - Runs inside one word (tiny gaps) are never split.
 */
function joinRunsWithSpacing(runs) {
  let text = '';
  let prevEndX = null;
  let prevSize = 10;
  for (const r of [...runs].sort((a, b) => a.x - b.x)) {
    const s = (r.str || '').replace(/\s+/g, ' ').trim();
    if (!s) { if (prevEndX === null) continue; prevEndX = null; continue; }
    if (prevEndX !== null) {
      const gap = r.x - prevEndX;
      const em = Math.max(prevSize, r.size, 1);
      let sep = '';
      if (gap > Math.max(em * WORD_GAP_FACTOR, WORD_GAP_MIN)) sep = ' ';
      // never a space before closing punctuation
      if (sep && /^[.,;:!?)\]%]/.test(s)) sep = '';
      text += sep;
    }
    text += s;
    prevEndX = r.x + r.w;
    prevSize = r.size;
  }
  return text.replace(/\s+/g, ' ').trim();
}

/* ================================================================== *
 * CHARACTER → WORD → LINE RECONSTRUCTION
 *
 * Root fix: PDF extraction granularity is character/run level, but the
 * document model is WORD level. Every char/span must be COALESCED into
 * words FIRST, using scale-aware, adaptive gap thresholds — never treat
 * individual characters as standalone document/table objects.
 * ================================================================== */

/** Expand extraction items into character-level tokens (bounding boxes). */
function expandToChars(items) {
  const chars = [];
  for (const it of items) {
    const run = it.str || '';
    if (!run.length) continue;
    const seq = [...run];
    const total = it.w || 0;
    const share = seq.length ? total / seq.length : 0;
    let x = it.x;
    for (let i = 0; i < seq.length; i++) {
      const ch = seq[i];
      chars.push({
        x,
        x1: x + share,
        y: it.y,
        w: share,
        h: it.h || it.size * 1.2,
        size: it.size,
        font: it.font,
        ch,
        originalX1: it.x + total,
        isSpace: /\s/.test(ch),
      });
      x += share;
    }
  }
  return chars;
}

/**
 * Adaptive word-boundary threshold from the page's OWN gap distribution.
 * Small gaps (fragment continuation) cluster near 0; real word spaces sit
 * around one space-width (~0.22–0.33em). The threshold sits between them.
 */
function adaptiveWordThreshold(gaps, em) {
  em = Math.max(em, 4);
  if (!gaps.length) return em * 0.14;
  const small = gaps.filter(g => g >= -1 && g <= em * 0.30);
  if (!small.length) return em * 0.14;
  const md = median(small);
  return Math.max(em * 0.12, Math.min(em * 0.30, md * 1.9));
}

/** Reconstruct WORDS from characters: horizontal adjacency + scale-aware gaps. */
function reconstructWords(chars) {
  const em = medianSize(chars) || 10;
  const lineTol = Math.max(2, em * LINE_GROUP_FACTOR + 1.2);

  // Character streams of DIFFERENT font sizes must never share a baseline
  // bucket: a wrapped 18pt line and a 12pt subtitle can sit at the same y
  // (esp. with per-run baseline jitter), yet are different visual lines.
  const words = [];
  const byBand = new Map();
  for (const c of chars) {
    const band = Math.round(c.size);
    if (!byBand.has(band)) byBand.set(band, []);
    byBand.get(band).push(c);
  }
  for (const bandChars of byBand.values()) {
    const sorted = [...bandChars].sort((a, b) => b.y - a.y);
    const buckets = [];
    let cur = null;
    for (const c of sorted) {
      if (cur && Math.abs(c.y - cur.yCh) <= lineTol) {
        cur.yCh = (cur.yCh + c.y) / 2;
        cur.chars.push(c);
      } else {
        cur = { yCh: c.y, chars: [c] };
        buckets.push(cur);
      }
    }

    for (const b of buckets) {
      const cs = b.chars.sort((a, b2) => a.x - b2.x);
      const gaps = [];
      for (let i = 1; i < cs.length; i++) {
        if (!cs[i].isSpace && !cs[i - 1].isSpace) gaps.push(cs[i].x - cs[i - 1].x1);
      }
      const T = adaptiveWordThreshold(gaps, em);
      let w = null;
      const emBucket = median(cs.map(c => c.size)) || em;
      for (const c of cs) {
        if (c.isSpace) { w = null; continue; }
        // font/size compatibility guard per master prompt §2
        const compatible = !w || (Math.abs(c.size - w.size) <= 2 && Math.abs(c.y - w.y) <= emBucket * 0.45);
        if (w && compatible && c.x - w.x1 <= T) {
          w.text += c.ch;
          w.x1 = Math.max(w.x1, c.x1);
          w.ys.push(c.y);
        } else {
          w = { text: c.ch, x: c.x, x1: Math.max(c.x1, c.x), y: c.y, size: c.size, font: c.font, ys: [c.y] };
          words.push(w);
        }
      }
    }
  }
  for (const word of words) word.y = median(word.ys) || word.y;
  return words;
}

/** Baseline-proximity grouping of RECONSTRUCTED WORDS into visual lines
 *  (same font-size band only — different sizes are separate visual lines). */
function groupLines(words) {
  const em = medianSize(words);
  const tol = Math.max(2, em * LINE_GROUP_FACTOR);
  const lines = [];
  const byBand = new Map();
  for (const w of words) {
    const band = Math.round(w.size);
    if (!byBand.has(band)) byBand.set(band, []);
    byBand.get(band).push(w);
  }

  for (const bandWords of byBand.values()) {
    const sorted = [...bandWords].sort((a, b) => b.y - a.y);
    let current = null;
    for (const item of sorted) {
      if (current && Math.abs(item.y - current.y) <= tol) {
        current.items.push(item);
        current.y = (current.y + item.y) / 2;
      } else {
        current = { y: item.y, items: [item] };
        lines.push(current);
      }
    }
  }
  lines.sort((a, b) => b.y - a.y);

  for (const line of lines) {
    line.items.sort((a, b) => a.x - b.x);
    line.size = median(line.items.map(i => i.size)) || 10;
    line.isBold = line.items.some(i => /\b(Bold|Black|Demi|Semibold|Heavy)\b/i.test(i.font));
    line.isItalic = line.items.some(i => /\b(Italic|Oblique)\b/i.test(i.font));
    line.font = mapFont(line.items.map(i => i.font).find(f => f) || '');
    line.x = line.items[0].x;
    line.xEnd = line.items[line.items.length - 1].x1;
    line.text = line.items.map(w => w.text).join(' ').replace(/\s+/g, ' ').trim();
  }
  return lines;
}

/** Column boundaries = midpoints between column start-x positions. Deterministic cell assignment. */
function columnBoundaries(columns, pageWidth) {
  const pts = [0];
  for (let i = 0; i < columns.length - 1; i++) pts.push((columns[i] + columns[i + 1]) / 2);
  pts.push(pageWidth);
  return pts;
}

/** Assign WORDS to columns by word-center within [boundary_i, boundary_{i+1}). */
function assignRunsToColumns(runs, boundaries) {
  const n = boundaries.length - 1;
  const cells = Array.from({ length: n }, () => []);
  for (const w of [...runs].sort((a, b) => a.x - b.x)) {
    const c = (w.x + w.x1) / 2;
    for (let i = 0; i < n; i++) {
      if (c >= boundaries[i] && c < boundaries[i + 1]) { cells[i].push(w); break; }
    }
  }
  return cells.map(ws => ws.map(w => w.text).join(' ').replace(/\s+/g, ' ').trim());
}

/**
 * A line is a TABLE ROW when its word stream contains ≥2 wide gutters.
 * Real cell-to-cell gaps are typically ≥1.5em; paragraph word spaces are
 * ~0.25-0.33em (fragment emission) so paragraphs never qualify.
 */
function isRowLikeLine(line, em) {
  const gapMin = Math.max(15, em * 1.5);
  const sorted = [...line.items].sort((a, b) => a.x - b.x);
  let big = 0, prevEnd = null;
  for (const w of sorted) {
    if (prevEnd !== null && w.x - prevEnd >= gapMin) big += 1;
    prevEnd = Math.max(prevEnd, w.x1);
  }
  return big >= 2;
}

/**
 * Cluster column start-x candidates; returns sorted column x positions.
 * Column cues (multi-signal, per master prompt §8):
 *  - line-leading (leftmost token) alignment across rows → column 0,
 *  - consistent cell-to-cell gaps (repeated X boundaries) → remaining columns.
 * Only ROW-LIKE lines contribute so paragraph text can never seed phantom columns.
 */
function findTableColumns(lines, minSupport = 3) {
  const em = median(lines.map(l => l.size)) || 10;
  const tol = Math.max(3, em * 0.35);
  const rowLines = lines.filter(l => isRowLikeLine(l, em));
  if (rowLines.length < 2) return [];

  const clusters = [];
  const registerX = (x) => registerCluster(clusters, x, tol);

  for (const line of rowLines) {
    const sorted = [...line.items].sort((a, b) => a.x - b.x);
    registerX(sorted[0].x); // column-0 edge
    let prevEnd = null;
    for (const w of sorted) {
      if (prevEnd !== null) {
        const gap = w.x - prevEnd;
        if (gap > em * 0.55) registerX(w.x); // cell boundary edges
      }
      prevEnd = Math.max(prevEnd, w.x1);
    }
  }

  const threshold = Math.max(2, Math.ceil(rowLines.length * 0.4));
  const candidates = clusters
    .filter(c => c.count >= threshold)
    .sort((a, b) => a.x - b.x);

  const columns = [];
  for (const c of candidates) {
    if (columns.length && Math.abs(columns[columns.length - 1] - c.x) <= tol) continue;
    if (stdev(c.xs) <= tol * 1.5) columns.push(c.x);
  }
  return columns.length >= 2 ? columns : [];
}

function registerCluster(clusters, x, tol) {
  for (const c of clusters) {
    if (Math.abs(c.x - x) <= tol) {
      c.x = (c.x * c.count + x) / (c.count + 1);
      c.count += 1;
      c.xs.push(x);
      return;
    }
  }
  clusters.push({ x, count: 1, xs: [x] });
}

function stdev(arr) {
  if (arr.length < 2) return 0;
  const mean = arr.reduce((a, b) => a + b, 0) / arr.length;
  return Math.sqrt(arr.reduce((s, v) => s + (v - mean) ** 2, 0) / arr.length);
}

const PAGE_NUM_RE = /^\s*(page\s*)?[-\d]+\s*$/i;
const SEPARATOR_RE = /^[\-\=\_\.\*\s·∙]+$/;

function isSeparatorText(t) {
  return SEPARATOR_RE.test(t) && t.trim().length >= 2;
}

function isHeadingLike(line) {
  if (line.size >= 13) return true;      // big type = heading regardless of bold glyph naming
  return line.isBold && line.size >= 11.5;
}

/** Paragraph must be dropped from body when it is really a repeated header/footer/page-number. */
function isHeaderFooterParagraph(para, hf) {
  if (para.lines.length !== 1) return false;
  const line = para.lines[0];
  const text = line.text.trim();
  if (line._isPageNumber && line._isBottomZone) return true;
  if (line._isTopZone && hf.headerText && text === hf.headerText) return true;
  if (line._isBottomZone && hf.footerText && text === hf.footerText) return true;
  return false;
}

function detectAlignment(lines, contentBox) {
  if (!contentBox) return AlignmentType.LEFT;
  const first = lines[0];
  const last = lines[lines.length - 1];
  const leftGap = first.x - contentBox.left;
  const rightGap = contentBox.right - last.xEnd;
  const bothGaps = Math.min(leftGap, rightGap) > 25;
  if (bothGaps && Math.abs(leftGap - rightGap) < 20) return AlignmentType.CENTER;
  if (leftGap > 25 && rightGap < 15) return AlignmentType.RIGHT;
  if (Math.abs(leftGap) < 10 && Math.abs(rightGap) < 10) return AlignmentType.JUSTIFIED;
  return AlignmentType.LEFT;
}

/* ================================================================== *
 * PHASE 2b — ELEMENT DETECTOR
 * ================================================================== */
function analyzePage(page) {
  const dims = effectivePageDims(page);
  const words = reconstructWords(expandToChars(page.items));
  const lines = groupLines(words);

  for (const l of lines) {
    l._isTopZone = l.y > dims.height - 45;
    l._isBottomZone = l.y < 45;
    l._isPageNumber = PAGE_NUM_RE.test(l.text);
  }

  const pageWidth = dims.width;
  const emPage = median(lines.map(l => l.size)) || 10;

  function filledCount(line, boundaries) {
    const cells = assignRunsToColumns(line.items, boundaries);
    return cells.filter(c => c && c.trim().length > 0).length;
  }

  // 1) columns come from ROW-LIKE lines only (≥2 wide gutters on the line):
  //    paragraph word spaces are ~0.3em, real cell gutters ≥1.5em.
  const columns = findTableColumns(lines);
  const boundaries = columns.length >= 2 ? columnBoundaries(columns, pageWidth) : null;

  // 2) row-like lines are the table's backbone rows
  const rowLines = lines.filter(l => boundaries && isRowLikeLine(l, emPage));

  // 3) vertical anchor zones: contiguous runs of row-like lines, extended to
  //    swallow the wrap/continuation region between rows (tall cells)
  const anchorZones = [];
  if (rowLines.length) {
    const sortedRows = [...rowLines].sort((a, b) => b.y - a.y);
    let zTop = sortedRows[0].y, zBottom = sortedRows[0].y;
    for (let i = 1; i < sortedRows.length; i++) {
      if (zBottom - sortedRows[i].y <= emPage * 7) { zBottom = sortedRows[i].y; }
      else { anchorZones.push([zTop, zBottom]); zTop = sortedRows[i].y; zBottom = sortedRows[i].y; }
    }
    anchorZones.push([zTop, zBottom]);
  }
  const inZone = (y) => anchorZones.some(([t, b]) => y <= t + emPage * 1.3 && y >= b - emPage * 1.3);
  const lineStartsAtColumn = (line) => {
    const first = [...line.items].sort((a, b) => a.x - b.x)[0];
    if (!first) return false;
    return columns.some(x => Math.abs(first.x - x) <= Math.max(4, emPage * 0.5));
  };
  const isContinuation = (line) => {
    if (!boundaries) return false;
    if (rowLines.includes(line)) return false;
    return filledCount(line, boundaries) === 1 && inZone(line.y) && lineStartsAtColumn(line);
  };

  // 4) rotate everything against the final grid
  const tableLines = new Map();
  const consumedLines = new Set();
  if (boundaries) {
    for (const line of lines) {
      const cells = assignRunsToColumns(line.items, boundaries);
      const filled = cells.filter(c => c && c.trim().length > 0).length;
      if (rowLines.includes(line)) {
        const isHeader = filled === columns.length && (line.isBold || line.size >= 13);
        tableLines.set(line, { cells, isHeader, y: line.y, size: line.size, font: line.font, rowLike: true });
      } else if (isContinuation(line)) {
        tableLines.set(line, { cells, isHeader: false, y: line.y, size: line.size, font: line.font, rowLike: false });
      }
    }
  }

  /**
   * Table block = maximal vertical region containing row lines plus their
   * continuation lines (wrapped cell text that only fills one column).
   */
  const blocks = [];
  let current = null;
  for (const line of lines) {
    const row = tableLines.get(line);
    if (row) {
      if (!current) { current = []; blocks.push(current); }
      current.push(row);
      consumedLines.add(line);
    } else if (current && current.length && (!line.text || isSeparatorText(line.text))) {
      current.push({
        cells: columns.map((_, i) => (i === 0 ? line.text : '')),
        isHeader: false, y: line.y, size: line.size, font: line.font, blank: true, rowLike: false,
      });
      consumedLines.add(line);
    } else {
      current = null;
    }
  }
  const tableBlocks = blocks
    .filter(b => b.length >= 2 || (b.length === 1 && b[0].isHeader))
    .map(b => ({ rows: mergeLogicalRows(b), columns, boundaries }));

/**
 * Merge a table block's line-records into LOGICAL rows (wrapped cell text stays
 * in ONE row). Every ROW-LIKE record starts a new row; continuation/wrap lines
 * (single-column cell text) append to the current row (gap guard ~1.5em).
 */
function mergeLogicalRows(rows) {
  if (!rows.length) return [];
  const em = median(rows.map(r => r.size)) || 10;
  const thresh = em * 1.5;
  const groups = [];
  let cur = null;
  for (const r of rows) {
    if (r.rowLike) {
      if (cur) groups.push(cur);
      cur = [r];
    } else if (cur) {
      const g = cur[cur.length - 1].y - r.y;
      if (g <= thresh) cur.push(r);
      else { groups.push(cur); cur = [r]; }
    } else {
      cur = [r];
    }
  }
  if (cur) groups.push(cur);
  return groups.map(lines => toLogicalRow(lines));
}

function toLogicalRow(lines) {
  const cols = lines[0].cells.length;
  const cells = [];
  for (let c = 0; c < cols; c++) {
    const cellLines = lines.map(l => (l.cells[c] || '')).filter(t => t && t.trim());
    cells.push(cellLines.length ? cellLines : ['']);
  }
  return {
    cells,
    isHeader: lines.some(l => l.isHeader),
    y: lines[0].y,
    size: median(lines.map(l => l.size)) || 10,
    font: lines[0].font || 'Arial',
    nLines: lines.length,
  };
}

  // content box (body only — lines consumed by a table block are excluded)
  const bodyLines = lines.filter(l => !consumedLines.has(l));
  let contentBox = null;
  if (bodyLines.length) {
    contentBox = {
      left: Math.min(...bodyLines.map(l => l.x)),
      right: Math.max(...bodyLines.map(l => l.xEnd)),
      top: Math.max(...bodyLines.map(l => l.y)),
      bottom: Math.min(...bodyLines.map(l => l.y)),
    };
  }

  // paragraphs (body only), reconstructed from line-to-line gaps
  const order = [...bodyLines].sort((a, b) => b.y - a.y);
  const paragraphs = [];
  let cur = null;
  for (const line of order) {
    if (!cur) { cur = { lines: [line] }; continue; }
    const prevLine = cur.lines[cur.lines.length - 1];
    const gap = prevLine.y - line.y;
    const samePara = gap <= Math.max(prevLine.size, line.size) * PARA_GAP_FACTOR &&
      !isHeadingLike(prevLine) && !isHeadingLike(line);
    if (samePara) {
      cur.lines.push(line);
    } else {
      paragraphs.push(finalizeParagraph(cur, contentBox));
      cur = { lines: [line] };
    }
  }
  if (cur) paragraphs.push(finalizeParagraph(cur, contentBox));

  return {
    pageNumber: page.pageNumber,
    dims,
    lines,
    wordCount: words.length,
    columns,
    tableBlocks,
    paragraphs,
    contentBox,
    pageWidthPts: dims.width,
    pageHeightPts: dims.height,
  };
}

function finalizeParagraph(para, contentBox) {
  para.size = median(para.lines.map(l => l.size)) || 10;
  para.align = detectAlignment(para.lines, contentBox);
  para.text = para.lines.map(l => l.text).join(' ').replace(/\s+/g, ' ').trim();
  para.isBold = para.lines[0].isBold && para.lines[0].size >= 14;
  return para;
}

/* ================================================================== *
 * PHASE 3 — DOCUMENT-LEVEL STRUCTURE
 * ================================================================== */
function detectDocumentHeaderFooter(models) {
  const topCount = new Map();
  const bottomCount = new Map();
  let pageNumberSeen = 0;
  const n = models.length;
  for (const m of models) {
    const tops = new Set(m.lines.filter(l => l._isTopZone && !l._isPageNumber).map(l => l.text.trim()));
    const bots = new Set(m.lines.filter(l => l._isBottomZone && !l._isPageNumber).map(l => l.text.trim()));
    for (const t of tops) topCount.set(t, (topCount.get(t) || 0) + 1);
    for (const b of bots) bottomCount.set(b, (bottomCount.get(b) || 0) + 1);
    if (m.lines.some(l => l._isPageNumber)) pageNumberSeen += 1;
  }
  const pick = (map) => {
    let best = null;
    for (const [text, count] of map) {
      if (count >= Math.max(2, Math.ceil(n * 0.5)) && (!best || count > best[1])) best = [text, count];
    }
    return best ? best[0] : null;
  };
  return {
    headerText: pick(topCount),
    footerText: pick(bottomCount),
    usePageNumber: pageNumberSeen >= Math.max(2, Math.ceil(n * 0.5)),
  };
}

/* ================================================================== *
 * PHASE 4 — DOCX RENDERER
 * ================================================================== */
function headingLevelForLine(line) {
  if (line.isBold && line.size >= 14) return HeadingLevel.HEADING_1;
  if (line.isBold && line.size >= 11.5) return HeadingLevel.HEADING_2;
  return null;
}

const thinBorder = { style: BorderStyle.SINGLE, size: 4, color: '333333' };
const tableBorders = { top: thinBorder, bottom: thinBorder, left: thinBorder, right: thinBorder, insideHorizontal: thinBorder, insideVertical: thinBorder };

function cellFromText(linesOrText, isHeader, columnSpan, font) {
  const opts = { verticalAlign: VerticalAlign.CENTER, borders: tableBorders, margins: { top: 40, bottom: 40, left: 80, right: 80 } };
  if (columnSpan > 1) opts.columnSpan = columnSpan;
  if (isHeader) opts.shading = { type: ShadingType.CLEAR, fill: 'E8EDF2' };
  const arr = (Array.isArray(linesOrText) ? linesOrText : [linesOrText || '']).filter(t => t != null);
  return new TableCell({
    ...opts,
    children: (arr.length ? arr : ['']).map(line => new Paragraph({
      alignment: AlignmentType.LEFT,
      children: [new TextRun({ text: String(line || ''), bold: isHeader, size: 20, font: font || 'Arial' })],
      spacing: { after: 0, line: 240 },
    })),
  });
}

function rowHeightTwips(row, prevY, nLines = 1) {
  const gapPts = prevY ? Math.max(4, Math.min(36, prevY - row.y)) : 13;
  return Math.round(gapPts * PT_TO_TWIP * Math.max(1, Math.min(4, nLines)));
}

function buildTableElement(cluster, isCarriedHeader) {
  const columns = cluster.columns;
  const n = columns.length;
  const rows = [];
  let prevY = null;
  for (let ri = 0; ri < cluster.rows.length; ri++) {
    const row = cluster.rows[ri];
    const cellsHtml = [];
    const cellText = t => (Array.isArray(t) ? t.join(' ') : String(t || ''));
    const filledIdx = row.cells.findIndex(c => cellText(c).trim().length > 0 && !isSeparatorText(cellText(c)));
    const totalFilled = row.cells.filter(c => cellText(c).trim().length > 0).length;
    let singleMerged = filledIdx >= 0 && totalFilled === 1;

    if (singleMerged) {
      cellsHtml.push(cellFromText(row.cells[filledIdx], row.isHeader, n, row.font));
    } else {
      for (let i = 0; i < n; i++) cellsHtml.push(cellFromText(row.cells[i] || '', row.isHeader, 1, row.font));
    }
    const rowOpts = { children: cellsHtml, height: { value: rowHeightTwips(row, prevY, row.nLines || 1), rule: HeightRule.ATLEAST } };
    if (row.isHeader || (isCarriedHeader && ri === 0)) rowOpts.tableHeader = true;
    rows.push(new TableRow(rowOpts));
    prevY = row.y;
  }

  // proportional column widths from column x spacing
  const colPts = [];
  for (let i = 0; i < n; i++) {
    const left = i === 0 ? columns[i] : (columns[i - 1] + columns[i]) / 2;
    const right = i + 1 < n ? (columns[i] + columns[i + 1]) / 2 : columns[i] + 150;
    colPts.push(Math.max(20, right - left));
  }
  const sum = colPts.reduce((a, b) => a + b, 0) || 1;
  const colWidths = colPts.map(w => Math.round((w / sum) * 10000) / 100);

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    columnWidths: colWidths,
    borders: tableBorders,
    rows,
  });
}

function paragraphElement(para, mode) {
  const first = para.lines[0];
  const level = headingLevelForLine(first);
  const sizeHalf = Math.max(18, Math.round(para.size * PT_TO_HALF_PT));
  const runs = [new TextRun({ text: para.text, bold: para.isBold || (level != null), italic: first.isItalic, size: sizeHalf, font: first.font })];
  const opts = {};
  if (level) {
    opts.heading = level;
    opts.spacing = { before: Math.round(para.size * 18), after: Math.round(para.size * 8) };
  } else {
    opts.alignment = para.align;
    opts.spacing = { after: Math.round(para.size * 6) };
  }
  return new Paragraph({ children: runs, ...opts });
}

/* ------------------------------------------------------------------ *
 * Table clustering across pages (ONE logical table for multi-page tables)
 * ------------------------------------------------------------------ */
function clusterTables(models) {
  const clusters = []; // { id, columns, boundaries, rows, firstBlock, spansPages }
  const flag = new Map(); // block -> cluster id
  let lastOpen = null;

  for (const m of models) {
    for (const block of m.tableBlocks) {
      if (lastOpen && sameColumns(lastOpen.columns, block.columns)) {
        lastOpen.rows.push(...block.rows);
        lastOpen.spansPages = true;
        flag.set(block, lastOpen.id);
      } else {
        lastOpen = { id: clusters.length + 1, columns: block.columns, boundaries: block.boundaries, rows: [...block.rows], firstBlock: block, spansPages: false };
        clusters.push(lastOpen);
        flag.set(block, lastOpen.id);
      }
    }
  }
  return { clusters, flag };
}

function sameColumns(a, b) {
  if (!a || !b || a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (Math.abs(a[i] - b[i]) > 14) return false;
  }
  return true;
}

/* ================================================================== *
 * PHASE 4b — MAIN BUILDER
 * ================================================================== */
async function buildDocx(models, opts = {}) {
  const mode = opts.mode || 'highfidelity';
  const hf = detectDocumentHeaderFooter(models);
  const { clusters, flag } = clusterTables(models);
  const elementsByPage = []; // array of arrays
  const warnings = [];

  const unified = models.length < 2 || models.every(m =>
    Math.abs(m.dims.width - models[0].dims.width) < 1 &&
    Math.abs(m.dims.height - models[0].dims.height) < 1 &&
    m.dims.landscape === models[0].dims.landscape);

  function marginsFor(m) {
    let top = 1008, bottom = 1008, left = 1008, right = 1008;
    if (m.contentBox && mode !== 'editable') {
      const pageW = m.pageWidthPts, pageH = m.pageHeightPts;
      const estTop = clampTw((pageH - m.contentBox.top + 4) * PT_TO_TWIP);
      const estBottom = clampTw(m.contentBox.bottom * PT_TO_TWIP);
      const estLeft = clampTw(m.contentBox.left * PT_TO_TWIP);
      const estRight = clampTw((pageW - m.contentBox.right) * PT_TO_TWIP);
      if (estTop + estBottom < 800 && estLeft + estRight < 800) {
        top = estTop; bottom = estBottom; left = estLeft; right = estRight;
      } else if (estLeft + estRight < 800) {
        left = estLeft; right = estRight;
        // top/bottom unreliable → pad estimated by content height vs page height
        const content = m.contentBox.top - m.contentBox.bottom;
        const space = pageH - content;
        top = clampTw(Math.max(360, (space * 0.45) * PT_TO_TWIP));
        bottom = clampTw(Math.max(360, (space * 0.55) * PT_TO_TWIP));
      }
    }
    return { top, bottom, left, right, header: 720, footer: 720 };
  }

  for (let pi = 0; pi < models.length; pi++) {
    const m = models[pi];
    const children = [];

    // reading order = paragraphs + table-cluster starts (top→bottom)
    const items = [];
    for (const p of m.paragraphs) {
      if (isHeaderFooterParagraph(p, hf)) continue; // promoted to Word header/footer, drop from body
      items.push({ kind: 'para', y: p.lines[0].y, ref: p });
    }
    for (const b of m.tableBlocks) items.push({ kind: 'table', y: b.rows[0].y, ref: b, cid: flag.get(b) });
    items.sort((a, b) => b.y - a.y);

    for (const it of items) {
      if (it.kind === 'para') {
        children.push(paragraphElement(it.ref, mode));
      } else {
        const cluster = clusters.find(c => c.id === it.cid);
        // only the FIRST block of the cluster emits the element (rows include continuations)
        if (cluster.firstBlock === it.ref) {
          children.push(buildTableElement(cluster, cluster.spansPages));
        }
      }
    }

    // page break preservation: skip when the page merely continues an open table
    let isContinuationPage = false;
    if (pi > 0) {
      const prevPageTables = models[pi - 1].tableBlocks;
      if (prevPageTables.length && m.tableBlocks.length) {
        const lastPrev = prevPageTables[prevPageTables.length - 1];
        const firstCur = m.tableBlocks[0];
        if (sameColumns(lastPrev.columns, firstCur.columns)) isContinuationPage = true;
      }
    }
    if (pi > 0 && !isContinuationPage) {
      children.unshift(new Paragraph({ children: [new PageBreak()] }));
    }

    elementsByPage.push(children);
  }

  for (const c of clusters) {
    if (c.spansPages) warnings.push(`Multi-page table (cluster ${c.id}) spans pages — following text may shift to keep one logical table.`);
  }

  // --- assemble sections ---
  const sections = [];
  const m0 = models[0];
  if (unified) {
    sections.push({
      properties: { page: { size: pageSizeProps(m0), margin: marginsFor(m0) } },
      headers: makeHeaderFooter(hf, false),
      footers: makeHeaderFooter(hf, true),
      children: elementsByPage.flat(),
    });
  } else {
    for (let pi = 0; pi < models.length; pi++) {
      const m = models[pi];
      sections.push({
        properties: { page: { size: pageSizeProps(m), margin: marginsFor(m) } },
        headers: makeHeaderFooter(hf, false),
        footers: makeHeaderFooter(hf, true),
        children: elementsByPage[pi],
      });
    }
  }

  const doc = new Document({ sections });
  const buffer = await Packer.toBuffer(doc);

  const tableStats = {
    count: clusters.length,
    rows: clusters.reduce((s, c) => s + c.rows.length, 0),
    cols: Math.max(0, ...clusters.map(c => c.columns.length)),
    spanning: clusters.filter(c => c.spansPages).length,
  };

  const report = buildReport(models, clusters, buffer, { mode, headerFound: hf.headerText, footerFound: hf.footerText, pageNumbers: hf.usePageNumber, tableStats, warnings, unified });
  return { buffer, report };
}

function clampTw(v) { return Math.max(360, Math.min(2880, Math.round(v))); }

function pageSizeProps(model) {
  const { width, height, landscape } = model.dims;
  return {
    width: Math.round(width * PT_TO_TWIP),
    height: Math.round(height * PT_TO_TWIP),
    orientation: landscape ? PageOrientation.LANDSCAPE : PageOrientation.PORTRAIT,
  };
}

function makeHeaderFooter(hf, isFooter) {
  const runs = [];
  if (isFooter) {
    if (hf.usePageNumber) {
      runs.push(new TextRun({ children: ['Page ', PageNumber.CURRENT] }));
      if (hf.footerText) runs.push(new TextRun({ text: '   ' + hf.footerText, size: 18, font: 'Arial' }));
    } else if (hf.footerText) {
      runs.push(new TextRun({ text: hf.footerText, size: 18, font: 'Arial' }));
    }
  } else if (hf.headerText) {
    runs.push(new TextRun({ text: hf.headerText, size: 18, font: 'Arial' }));
  }
  if (!runs.length) return undefined;
  const Wrapper = isFooter ? Footer : Header;
  return { default: new Wrapper({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: runs })] }) };
}

/* ================================================================== *
 * PHASE 5 — VALIDATE / REPORT
 * ================================================================== */
function buildReport(models, clusters, buffer, info) {
  return {
    mode: info.mode,
    sourcePages: models.length,
    estDocxPages: models.length,
    textLines: models.reduce((s, m) => s + m.lines.length, 0),
    words: models.reduce((s, m) => s + m.wordCount, 0),
    paragraphs: models.reduce((s, m) => s + m.paragraphs.length, 0),
    tables: info.tableStats.count,
    tableRowsTotal: info.tableStats.rows,
    maxTableColumns: info.tableStats.cols,
    multiPageTables: info.tableStats.spanning,
    headerDetected: !!info.headerFound,
    footerDetected: !!info.footerFound,
    pageNumbersPreserved: info.pageNumbers,
    unifiedPageSize: info.unified,
    docxBytes: buffer.length,
    pageStats: models.map(m => ({
      page: m.pageNumber,
      words: m.wordCount,
      lines: m.lines.length,
      paragraphs: m.paragraphs.length,
      tables: m.tableBlocks.length,
      tableColumns: m.columns.length,
      tableRows: m.tableBlocks.reduce((s, b) => s + b.rows.length, 0),
      contentBox: m.contentBox,
    })),
    warnings: info.warnings || [],
  };
}

/* ================================================================== *
 * Public API
 * ================================================================== */
async function convertPdfToDocx(pdfPath, opts = {}) {
  const pages = await extractStructure(pdfPath);
  const models = pages.map(analyzePage);
  return await buildDocx(models, opts);
}

module.exports = {
  convertPdfToDocx,
  extractStructure,
  analyzePage,
  buildDocx,
  groupLines,
  joinRunsWithSpacing,
  dedupItems,
  reconstructWords,
  expandToChars,
  isLandscape: (page) => effectivePageDims(page).landscape,
};