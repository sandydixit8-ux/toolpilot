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
    const { stdout, stderr } = await execFileAsync(
      sofficePath,
      [
        '--headless',
        '--norestore',
        '--convert-to',
        'pdf:writer_pdf_Export',
        '--outdir',
        outputDir,
        inputPath,
      ],
      { timeout: TIMEOUT, maxBuffer: 50 * 1024 * 1024, env: { ...process.env, HOME: '/tmp' } }
    );

    const baseName = path.basename(req.file.originalname, path.extname(req.file.originalname));
    const pdfPath = path.join(outputDir, `${baseName}.pdf`);

    try {
      await fs.access(pdfPath);
    } catch {
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
    console.error('[DOCX-to-PDF]', err);

    if (err.killed || err.code === 'ETIMEDOUT') {
      return res.status(504).json({ success: false, error: 'Conversion timed out. Document may be too large.' });
    }

    res.status(500).json({ success: false, error: 'Conversion failed. Document may be corrupted.' });
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
