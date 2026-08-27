const express = require('express');
const multer = require('multer');
const cors = require('cors');
const { execFile } = require('child_process');
const { promisify } = require('util');
const fs = require('fs').promises;
const fsSync = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, TableRow, TableCell, Table, WidthType } = require('docx');

const execFileAsync = promisify(execFile);
const { execSync } = require('child_process');
const app = express();
const PORT = process.env.PORT || 3001;
const TIMEOUT = 120_000;

app.use(cors({ origin: '*' }));
app.use(express.json());

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (['.docx', '.doc', '.pdf'].includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Unsupported file format. Only .doc, .docx, and .pdf files are accepted.'));
    }
  },
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'toolpilotpro-document-converter', version: '2.0' });
});

// DOCX to PDF — uses LibreOffice (this works)
app.post('/convert/docx-to-pdf', upload.single('file'), async (req, res) => {
  const jobId = uuidv4();
  const jobDir = `/tmp/toolpilotpro/jobs/${jobId}`;

  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No file provided.' });
    }

    await fs.mkdir(jobDir, { recursive: true });
    await fs.mkdir(path.join(jobDir, 'output'), { recursive: true });
    try { execSync(`chmod -R 777 ${jobDir}`); } catch {}

    const inputPath = path.join(jobDir, `input${path.extname(req.file.originalname)}`);
    const outputDir = path.join(jobDir, 'output');

    await fs.writeFile(inputPath, req.file.buffer);

    const sofficePath = '/usr/bin/soffice';
    const lockDir = '/tmp/.~lock.X11-unix';
    try { await fs.rm(lockDir, { recursive: true, force: true }); } catch {}

    const args = [
      '--headless',
      '--norestore',
      '--nofirststartwizard',
      '--convert-to',
      'pdf:writer_pdf_Export',
      '--outdir',
      outputDir,
      inputPath,
    ];
    console.log('[DOCX-to-PDF] Running:', sofficePath, args.join(' '));
    console.log('[DOCX-to-PDF] Input file size:', req.file.size);

    let stdout = '', stderr = '';
    try {
      const result = await execFileAsync(sofficePath, args, {
        timeout: TIMEOUT,
        maxBuffer: 50 * 1024 * 1024,
        env: {
          HOME: '/tmp',
          USER: 'root',
          DBUS_SESSION_BUS_ADDRESS: '/dev/null',
          PATH: '/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin',
        },
      });
      stdout = result.stdout;
      stderr = result.stderr;
    } catch (sofficeErr) {
      stdout = sofficeErr.stdout || '';
      stderr = sofficeErr.stderr || '';
      console.error('[DOCX-to-PDF] soffice error:', sofficeErr.code, 'killed:', sofficeErr.killed);
      console.error('[DOCX-to-PDF] stdout:', stdout);
      console.error('[DOCX-to-PDF] stderr:', stderr);
      if (sofficeErr.killed) {
        return res.status(504).json({ success: false, error: 'Conversion timed out.' });
      }
    }

    console.log('[DOCX-to-PDF] soffice stdout:', stdout.trim());
    console.log('[DOCX-to-PDF] soffice stderr:', stderr.trim());

    const filesAfter = await fs.readdir(outputDir);
    console.log('[DOCX-to-PDF] Output dir contents:', filesAfter);

    let pdfPath = path.join(outputDir, 'input.pdf');
    let found = false;
    try { await fs.access(pdfPath); found = true; } catch {}

    if (!found) {
      const pdfFile = filesAfter.find(f => f.toLowerCase().endsWith('.pdf'));
      if (pdfFile) {
        pdfPath = path.join(outputDir, pdfFile);
        found = true;
      }
    }

    if (!found) {
      console.error('[DOCX-to-PDF] CRITICAL: No PDF produced. Input size:', req.file.size);
      return res.status(500).json({ success: false, error: 'PDF output not found after conversion.' });
    }

    const pdfBuffer = await fs.readFile(pdfPath);
    const pdfString = pdfBuffer.toString('latin1');
    const pageMatches = pdfString.match(/\/Type\s*\/Page[^s]/g);
    const pageCount = pageMatches ? pageMatches.length : 1;
    const textMatches = pdfString.match(/BT[\s\S]*?ET/g);
    const textLength = textMatches ? textMatches.join('').length : 0;
    const hasText = textLength > 50;
    const imageMatches = pdfString.match(/\/Subtype\s*\/Image/g);
    const imageCount = imageMatches ? imageMatches.length : 0;
    const isRasterized = pageCount > 0 && imageCount > 0 && !hasText;

    const outputFilename = req.file.originalname.replace(/\.(docx|doc)$/i, '.pdf');

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${outputFilename}"`);
    res.setHeader('X-Page-Count', String(pageCount));
    res.setHeader('X-Text-Selectable', String(hasText));
    res.setHeader('X-Rasterized', String(isRasterized));
    res.setHeader('X-Validation-Status', !isRasterized && pageCount > 0 ? 'PASS' : 'WARN');

    res.send(pdfBuffer);
  } catch (err) {
    console.error('[DOCX-to-PDF] FATAL:', err.message, err.stack);
    res.status(500).json({ success: false, error: 'Conversion failed. ' + (err.message || '') });
  } finally {
    try { await fs.rm(jobDir, { recursive: true, force: true }); } catch {}
  }
});

// PDF to DOCX — uses pdftotext + docx library (pure Node.js, no LibreOffice)
app.post('/convert/pdf-to-docx', upload.single('file'), async (req, res) => {
  const jobId = uuidv4();
  const jobDir = `/tmp/toolpilotpro/jobs/${jobId}`;

  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No file provided.' });
    }

    await fs.mkdir(jobDir, { recursive: true });

    const inputPath = path.join(jobDir, 'input.pdf');
    await fs.writeFile(inputPath, req.file.buffer);

    console.log('[PDF-to-DOCX] Input file size:', req.file.size);

    // Step 1: Extract text using pdftotext (from poppler-utils, pre-installed in Docker)
    let textContent = '';
    try {
      const result = await execFileAsync('pdftotext', ['-layout', inputPath, '-'], {
        timeout: 60_000,
        maxBuffer: 50 * 1024 * 1024,
      });
      textContent = result.stdout || '';
      console.log('[PDF-to-DOCX] Extracted text length:', textContent.length);
    } catch (pdftotextErr) {
      console.error('[PDF-to-DOCX] pdftotext failed:', pdftotextErr.message);
      return res.status(500).json({ success: false, error: 'Failed to extract text from PDF. The file may be image-based or corrupted.' });
    }

    if (!textContent.trim()) {
      return res.status(400).json({ success: false, error: 'No text could be extracted from this PDF. It may be a scanned/image-based document.' });
    }

    // Step 2: Parse text into structured paragraphs
    const lines = textContent.split('\n');
    const paragraphs = [];
    let currentParagraph = [];

    for (const line of lines) {
      const trimmed = line.trim();

      if (trimmed === '') {
        if (currentParagraph.length > 0) {
          paragraphs.push(currentParagraph.join(' '));
          currentParagraph = [];
        }
        continue;
      }

      // Detect headings: short lines that look like titles (uppercase, bold-like patterns)
      const isLikelyHeading = trimmed.length < 100 &&
        (trimmed === trimmed.toUpperCase() && trimmed.length > 2 ||
         /^[A-Z][A-Za-z\s:,\-—–]+$/.test(trimmed) && trimmed.length < 80 &&
         !trimmed.endsWith('.') && !trimmed.endsWith(','));

      if (isLikelyHeading && currentParagraph.length === 0) {
        if (currentParagraph.length > 0) {
          paragraphs.push(currentParagraph.join(' '));
          currentParagraph = [];
        }
        paragraphs.push('__HEADING__' + trimmed);
        continue;
      }

      currentParagraph.push(trimmed);
    }

    if (currentParagraph.length > 0) {
      paragraphs.push(currentParagraph.join(' '));
    }

    console.log('[PDF-to-DOCX] Parsed paragraphs:', paragraphs.length);

    // Step 3: Create DOCX using docx library
    const docxParagraphs = paragraphs.map(text => {
      if (text.startsWith('__HEADING__')) {
        const headingText = text.replace('__HEADING__', '');
        return new Paragraph({
          children: [
            new TextRun({ text: headingText, bold: true, size: 28, font: 'Calibri' }),
          ],
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 240, after: 120 },
        });
      }

      return new Paragraph({
        children: [
          new TextRun({ text, size: 22, font: 'Calibri' }),
        ],
        spacing: { after: 120 },
      });
    });

    const doc = new Document({
      sections: [{
        properties: {
          page: {
            margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
          },
        },
        children: docxParagraphs,
      }],
    });

    const docxBuffer = await Packer.toBuffer(doc);
    const outputFilename = req.file.originalname.replace(/\.pdf$/i, '.docx');

    console.log('[PDF-to-DOCX] DOCX created, size:', docxBuffer.length);

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', `attachment; filename="${outputFilename}"`);
    res.send(docxBuffer);
  } catch (err) {
    console.error('[PDF-to-DOCX] FATAL:', err.message, err.stack);
    res.status(500).json({ success: false, error: 'Conversion failed. ' + (err.message || '') });
  } finally {
    try { await fs.rm(jobDir, { recursive: true, force: true }); } catch {}
  }
});

app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({ success: false, error: 'File too large. Maximum size is 50MB.' });
    }
    return res.status(400).json({ success: false, error: err.message });
  }
  if (err.message && err.message.includes('Unsupported')) {
    return res.status(400).json({ success: false, error: err.message });
  }
  res.status(500).json({ success: false, error: 'Internal server error.' });
});

app.listen(PORT, () => {
  console.log(`Document converter service running on port ${PORT}`);
});
