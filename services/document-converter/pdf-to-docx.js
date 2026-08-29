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

/** Column boundaries separate cells: a wide middle cell (e.g. "MoU Reference"
 *  ending at ~x180 while the next column starts at x190) must NOT be split by
 *  a midpoint rule — every column's content ends at the NEXT column's left
 *  edge minus a small slack, so a boundary sits just before the next column. */
function columnBoundaries(columns, pageWidth, em) {
  const slack = Math.max(4, em * 0.2);
  const pts = [];
  for (let i = 0; i < columns.length - 1; i++) pts.push(columns[i + 1] - slack);
  pts.push(pageWidth);
  return pts;
}

/** Assign WORDS to columns. `boundaries[i]` is the RIGHT edge of column i
 *  (last = page width): column 0 spans [0, b0), column i spans [b_{i-1}, b_i).
 *  Word CENTER determines the containing cell. */
function assignRunsToColumns(runs, boundaries) {
  const n = boundaries.length;
  const cells = Array.from({ length: n }, () => []);
  for (const w of [...runs].sort((a, b) => a.x - b.x)) {
    const c = (w.x + w.x1) / 2;
    let idx = n - 1;
    for (let i = 0; i < n; i++) {
      if (c < boundaries[i]) { idx = i; break; }
    }
    cells[idx].push(w);
  }
  return cells.map(ws => ws.map(w => w.text).join(' ').replace(/\s+/g, ' ').trim());
}

/**
 * A line that visibly spans ≥2 table cells: ≥2 word-gaps wider than a
 * justified-space (~7.6pt at 11pt) but ≤ a real cell gap (≥10pt).
 */
function isRowishLine(line, em) {
  const gapMin = Math.max(8, em * 0.8);
  const ws = [...line.items].sort((a, b) => a.x - b.x);
  let big = 0, prevEnd = null;
  for (const w of ws) {
    if (prevEnd !== null && w.x - prevEnd >= gapMin) big += 1;
    prevEnd = Math.max(prevEnd, w.x1);
  }
  return big >= 2;
}

/**
 * Detect the table COLUMN GRID (master prompt §9-10).
 * COLUMN-0 = the leftmost DIGIT-LED leading cluster (≥2 lines whose first
 * token starts with a digit — S.No values like "1","2","12"), falling back
 * to the leftmost recurring leading edge. This keeps the body MARGIN
 * (non-digit, page-wide paragraphs like "This document records…") out of the
 * grid while still giving continuation pages a grid. Column candidates:
 *   - recurring LEFT EDGE (leadingCount ≥ 2 across all lines), OR
 *   - recurring boundary reached after a gap on ≥3 ROW-ISH lines that start
 *     in the column-0 band (single-word cells like "GSI"/"RACI") and their
 *     leading edges elsewhere.
 * The rowish+band restriction stops justified-text spread inside a cell from
 * seeding columns. Columns closer than ~1.4em merge (a centred S.No header at
 * x=45 + its 1-digit values at x=54 are ONE column); column-0 stays leftmost.
 */
function detectColumnGrid(lines, pageWidth, em) {
  const tol = Math.max(3, em * 0.5);
  const minColGap = Math.max(16, em * 1.4);
  const voidMin = Math.max(8, em * 0.8);

  const allLeadClusters = [];
  for (const line of lines) {
    if (line._isPageNumber) continue;
    const ws = [...line.items].sort((a, b) => a.x - b.x);
    if (ws.length) registerCluster(allLeadClusters, ws[0].x, ws[0].text, tol);
  }

  // column-0: leftmost cluster with ≥2 DIGIT-LED lines (S.No values "1","2",…,
  // while a body margin like "1. Purpose" counts 1) → any leftmost leading ≥2
  const leadn = allLeadClusters
    .filter(c => c.count >= 2 && c.x > 8 && c.x <= pageWidth - 20)
    .map(c => {
      c.digitCount = (c.firsts || []).filter(t => /^\d/.test(t)).length;
      return c;
    });
  const digitLed = leadn
    .filter(c => c.digitCount >= 2)
    .sort((a, b) => a.x - b.x);
  const col0 = digitLed[0] || leadn.sort((a, b) => a.x - b.x)[0];
  if (!col0) return [];

  const voidClusters = [];   // ROW-ISH lines ONLY (anchored to the col0 band)
  const bandMin = col0.x - Math.max(6, em * 0.5);
  const bandMax = col0.x + em * 1.2;
  for (const line of lines) {
    if (line._isPageNumber) continue;
    const ws = [...line.items].sort((a, b) => a.x - b.x);
    if (!ws.length || !isRowishLine(line, em)) continue;
    if (ws[0].x < bandMin || ws[0].x > bandMax) continue; // ref/span wrap lines skipped
    let prevEnd = null;
    for (const w of ws) {
      if (prevEnd !== null && w.x - prevEnd >= voidMin) registerCluster(voidClusters, w.x, tol);
      prevEnd = Math.max(prevEnd, w.x1);
    }
  }
  const byX = new Map();
  for (const c of allLeadClusters) byX.set(c.x, { x: c.x, count: c.count, voidCount: 0 });
  for (const c of voidClusters) {
    let hit = null;
    for (const k of byX.values()) { if (Math.abs(k.x - c.x) <= tol) { hit = k; break; } }
    if (hit) hit.voidCount += c.count;
    else byX.set(c.x, { x: c.x, count: 0, voidCount: c.count });
  }

  const candidates = [...byX.values()]
    .filter(c => {
      if (c.x <= 8 || c.x > pageWidth - 20) return false;
      if (c.count >= 2) return true;              // recurring LEFT EDGE
      return c.voidCount >= 3;                    // solid anchor-void evidence only
    })
    .sort((a, b) => a.x - b.x);

  const cols = [col0.x];
  for (const c of candidates) {
    if (c.x - cols[cols.length - 1] < minColGap) {
      if (cols.length === 1) continue;               // column-0 stays leftmost
      if (c.count + c.voidCount > candidateCount(cols[cols.length - 1], candidates)) cols[cols.length - 1] = c.x;
      continue;
    }
    cols.push(c.x);
  }
  return cols.length >= 2 ? cols : [];
}

function candidateCount(x, cands) {
  for (const c of cands) if (Math.abs(c.x - x) <= 0.5) return c.count + c.voidCount;
  return 0;
}

function registerCluster(clusters, x, first, tol) {
  for (const c of clusters) {
    if (Math.abs(c.x - x) <= tol) {
      c.x = (c.x * c.count + x) / (c.count + 1);
      c.count += 1;
      c.xs.push(x);
      if (first !== undefined) c.firsts.push(first);
      return;
    }
  }
  clusters.push({ x, count: 1, xs: [x], firsts: first !== undefined ? [first] : null });
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

  // 1) COLUMN GRID from alignment evidence (line-leading + void-reached starts)
  const columns = detectColumnGrid(lines, pageWidth, emPage);
  let boundaries = null;
  if (columns.length >= 2) boundaries = columnBoundaries(columns, pageWidth, emPage);

  for (const line of lines) {
    line._cells = boundaries ? assignRunsToColumns(line.items, boundaries) : [];
    line._filled = columns.length >= 2 ? line._cells.filter(c => c && c.trim()).length : 0;
  }

  // 2) TABLE ROWS: every line whose FIRST CELL has content is a row anchor
  //    (S.No column); col0-absent lines are wrap/continuation content absorbed
  //    by the nearest open row (vertically-centred S.No rows reconstruct whole).
  //    A line whose col0 starts at the true body MARGIN (left of the table's
  //    col0) is body text, not a cell — it must not seed a row.
  const tableRows = buildTableRows(lines, boundaries, emPage, columns);
  const consumedLines = new Set();
  for (const row of tableRows) for (const l of row.lines) consumedLines.add(l);
  const tableBlocks = boundaries && tableRows.length
    ? [{ rows: tableRows, columns, boundaries }]
    : [];

  // content box (body only — lines consumed by the table are excluded)
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

/**
 * Assemble LOGICAL rows from the per-line cell mapping.
 *  - A line whose cell[0] is non-empty is an ANCHOR (the row's S.No line).
 *    Adjacent anchors within 1.5em belong to one cell (wrapped S.No text).
 *  - col0-absent lines are wrap/continuation content: post-anchor lines attach
 *    while their gap stays ≤1.9em; pre-anchor lines buffer then flush into the
 *    next anchor (they sit ABOVE the S.No yet belong to the same row, e.g.
 *    vertically-centred S.No in a tall cell). A big gap (>2.2em) clears the
 *    pre-anchor buffer so body text above a table never leaks into it.
 */
function buildTableRows(lines, boundaries, emPage, columns) {
  if (!boundaries) return [];
  const col0X = columns[0] || 0;
  // the S.No header cell ("S.N") can sit ~9pt LEFT of the digit values below
  // it (narrow first column), so only exclude lines clearly left of the table.
  const col0Min = col0X - 14;
  const alignTol = Math.max(4, emPage * 0.3);
  const HEADER_TOKEN = /^(S\.?N|No\.?|Item|#\.?|o\.)$/i;

  const order = [...lines].sort((a, b) => b.y - a.y);
  const result = [];
  let pending = [];
  let open = null;

  const closeRow = () => {
    if (open && open.lines.length) result.push(open);
    open = null;
  };

  const col0Span = (line) => {
    const ws = [...line.items].sort((a, b) => a.x - b.x);
    return ws.length && ws[0].x >= col0Min;
  };

  // ≥2 of the trailing cells (c1..) start FLUSH at the grid's column left
  // edges — body text spread across the grid never aligns; real cells do.
  const rowAligned = (line) => {
    const ws = [...line.items].sort((a, b) => a.x - b.x);
    const firsts = new Map();
    for (const w of ws) {
      const c = (w.x + w.x1) / 2;
      let idx = boundaries.length - 1;
      for (let i = 0; i < boundaries.length; i++) { if (c < boundaries[i]) { idx = i; break; } }
      if (!firsts.has(idx) || w.x < firsts.get(idx)) firsts.set(idx, w.x);
    }
    let aligned = 0;
    for (let i = 1; i < columns.length; i++) {
      if (firsts.has(i) && Math.abs(firsts.get(i) - columns[i]) <= alignTol) aligned += 1;
    }
    return aligned >= 2;
  };

  const isAnchor = (line) => {
    if (line._cells[0].trim().length === 0 || !col0Span(line)) return false;
    const c0 = line._cells[0].trim();
    if (/^\d+[\.:]?\s*$/.test(c0)) return true;          // S.No number ("1", "9.")
    if (HEADER_TOKEN.test(c0)) return true;             // S.N / o. header cell
    return rowAligned(line);                            // RACI-style: activity col0 + flush codes
  };

  for (const line of order) {
    if (!line._cells || line._cells.length !== boundaries.length) {
      closeRow(); pending = []; continue;
    }
    const anchor = isAnchor(line);
    if (anchor) {
      // wrapped col0 continuation: a small S.No continuation ("S.N"+"o.") or a
      // vertically centred S.No line sits close above its row's anchor. REAL
      // next-row anchors are rowish (span ≥2 cells) and gap > 1.2em.
      const contGap = isRowishLine(line, emPage) ? emPage * 1.2 : emPage * 1.6;
      if (open && open.hasCol0 && open.y - line.y <= contGap && !pending.length) {
        open.lines.push(line); open.lastY = line.y; // wrapped col0 cell continuation
      } else {
        // pre-anchor content more than 2.2em above the anchor belongs to the
        // block ABOVE, not to this row → discard the stale buffer.
        if (pending.length && pending[pending.length - 1].y - line.y > emPage * 2.2) pending = [];
        const rowLines = [...pending, line];
        closeRow();
        open = { lines: rowLines, hasCol0: true, y: line.y, lastY: line.y };
      }
      pending = [];
    } else if (open && open.lastY - line.y <= emPage * 1.9) {
      open.lines.push(line); open.lastY = line.y;
    } else {
      pending.push(line);
      if (pending.length >= 2 && pending[pending.length - 2].y - line.y > emPage * 2.2) {
        pending = [line];
      }
    }
  }
  closeRow();
  // trailing pending lines are post-table body text, NOT a phantom row
  return result.map(rec => toLogicalRow(rec.lines, boundaries));
}

function toLogicalRow(lines, boundaries) {
  const cols = boundaries.length;
  const sorted = [...lines].sort((a, b) => b.y - a.y);
  const cells = [];
  for (let c = 0; c < cols; c++) {
    const cellLines = sorted
      .map(l => (l._cells[c] || '').trim())
      .filter(t => t && !isSeparatorText(t));
    cells.push(cellLines.length ? cellLines : ['']);
  }
  const c0Text = (cells[0] || ['']).join(' ').trim();
  const ys = sorted.map(l => l.y);
  return {
    cells,
    isHeader: /^\s*\d/.test(c0Text) ? false : (c0Text.length > 0 || lines.some(l => l.isBold || l.size >= 13)),
    y: lines[0].y,
    maxY: Math.max(...ys),
    minY: Math.min(...ys),
    size: median(lines.map(l => l.size)) || 10,
    font: lines[0].font || 'Arial',
    nLines: sorted.length,
    lines: sorted,
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

function rowHeightTwips(row, prevY) {
  const extent = row.nLines || 1;
  const pts = row.maxY && row.minY ? Math.min(180, Math.max(13, row.maxY - row.minY)) : 20;
  return Math.round(pts * PT_TO_TWIP * Math.max(0.7, Math.min(2.5, extent / 8)));
}

function buildTableElement(cluster, isCarriedHeader) {
  const n = cluster.columns.length;
  const rows = [];
  let prevY = null;
  for (let ri = 0; ri < cluster.rows.length; ri++) {
    const row = cluster.rows[ri];
    const cellsHtml = [];
    const cellText = t => (Array.isArray(t) ? t.join(' ') : String(t || ''));
    const filledIdx = row.cells.findIndex(c => cellText(c).trim().length > 0);
    const totalFilled = row.cells.filter(c => cellText(c).trim().length > 0).length;
    let singleMerged = filledIdx >= 0 && totalFilled === 1;

    if (singleMerged) {
      cellsHtml.push(cellFromText(row.cells[filledIdx], row.isHeader, n, row.font));
    } else {
      for (let i = 0; i < n; i++) cellsHtml.push(cellFromText(row.cells[i], row.isHeader, 1, row.font));
    }
    const rowOpts = { children: cellsHtml, height: { value: rowHeightTwips(row, prevY), rule: HeightRule.ATLEAST } };
    if (row.isHeader || (isCarriedHeader && ri === 0)) rowOpts.tableHeader = true;
    rows.push(new TableRow(rowOpts));
    prevY = row.y;
  }

  // column widths proportional to the detected grid (not equal-width):
  // boundary[i] is the RIGHT edge of column i (last boundary = page width)
  const rights = cluster.boundaries || columnBoundaries(cluster.columns, cluster.columns[cluster.columns.length - 1] + 150, 10);
  const colPts = [];
  for (let i = 0; i < n; i++) {
    const left = i === 0 ? cluster.columns[0] : rights[i - 1];
    const right = rights[i] || (cluster.columns[i] + 150);
    colPts.push(Math.max(20, right - left));
  }
  const sum = colPts.reduce((a, c) => a + c, 0) || 1;
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
      // continued block: same column grid → append rows to the open cluster
      if (lastOpen && sameColumns(lastOpen.columns, block.columns)) {
        const rows = [...block.rows];
        // the source repeats its header row on each page; Word repeats a
        // header via tableHeader, so drop the repeated copies.
        if (rows.length && rows[0].isHeader) rows.shift();
        lastOpen.rows.push(...rows);
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
  const zip = require('adm-zip')(buffer);
  const entry = zip.getEntry('word/document.xml');
  const xml = entry ? entry.getData().toString('latin1') : '';
  const xmlTables = (xml.match(/<w:tbl\b/g) || []).length;

  // text integrity: distinct source words vs distinct words in the DOCX XML
  const srcWords = new Set();
  for (const m of models) {
    for (const l of m.lines) {
      for (const t of l.text.split(/\s+/)) { const w = t.replace(/[^\w.-]/g, ''); if (w) srcWords.add(w.toLowerCase()); }
    }
  }
  const docxWords = new Set();
  const tRe = /<w:t[^>]*>([^<]*)<\/w:t>/g;
  let mm; while ((mm = tRe.exec(xml))) {
    for (const t of mm[1].split(/\s+/)) { const w = t.replace(/[^\w.-]/g, ''); if (w) docxWords.add(w.toLowerCase()); }
  }
  const coverage = srcWords.size ? Math.round((1000 * [...srcWords].filter(w => docxWords.has(w)).length) / srcWords.size) / 10 : 100;

  const blankPages = models.filter(m => {
    const nonFooter = m.lines.filter(l => !(l._isBottomZone && l._isPageNumber));
    return nonFooter.length === 0;
  }).map(m => m.pageNumber);

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
    xmlTables: xmlTables,
    tableValid: info.tableStats.count === 0 || xmlTables > 0,
    textCoveragePct: coverage,
    blankPages,
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
  detectColumnGrid,
  isLandscape: (page) => effectivePageDims(page).landscape,
};