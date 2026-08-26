const express = require('express');
const multer = require('multer');
const cors = require('cors');
const { execFile } = require('child_process');
const { promisify } = require('util');
const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const execFileAsync = promisify(execFile);
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
    if (ext === '.docx' || ext === '.doc') {
      cb(null, true);
    } else {
      cb(new Error('Unsupported file format. Only .doc and .docx files are accepted.'));
    }
  },
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'toolpilotpro-document-converter' });
});

app.post('/convert/docx-to-pdf', upload.single('file'), async (req, res) => {
  const jobId = uuidv4();
  const jobDir = `/tmp/toolpilotpro/jobs/${jobId}`;

  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No file provided.' });
    }

    await fs.mkdir(jobDir, { recursive: true });
    await fs.mkdir(path.join(jobDir, 'output'), { recursive: true });

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
    console.log('[DOCX-to-PDF] Input exists:', await fs.access(inputPath).then(() => 'yes').catch(() => 'no'));
    console.log('[DOCX-to-PDF] Output dir exists:', await fs.access(outputDir).then(() => 'yes').catch(() => 'no'));
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
      console.error('[DOCX-to-PDF] soffice error code:', sofficeErr.code);
      console.error('[DOCX-to-PDF] soffice signal:', sofficeErr.signal);
      console.error('[DOCX-to-PDF] soffice killed:', sofficeErr.killed);
      console.error('[DOCX-to-PDF] soffice stdout:', stdout);
      console.error('[DOCX-to-PDF] soffice stderr:', stderr);
      if (sofficeErr.killed) {
        return res.status(504).json({ success: false, error: 'Conversion timed out.' });
      }
    }

    console.log('[DOCX-to-PDF] soffice stdout:', stdout.trim());
    console.log('[DOCX-to-PDF] soffice stderr:', stderr.trim());

    const filesAfter = await fs.readdir(outputDir);
    console.log('[DOCX-to-PDF] Output dir contents after conversion:', filesAfter);

    let pdfPath = path.join(outputDir, 'input.pdf');
    let found = false;
    try {
      await fs.access(pdfPath);
      found = true;
    } catch {}

    if (!found) {
      const pdfFile = filesAfter.find(f => f.toLowerCase().endsWith('.pdf'));
      if (pdfFile) {
        pdfPath = path.join(outputDir, pdfFile);
        found = true;
      }
    }

    if (!found) {
      console.error('[DOCX-to-PDF] CRITICAL: No PDF produced. Input file size:', req.file.size);
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
    try {
      await fs.rm(jobDir, { recursive: true, force: true });
    } catch {}
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
