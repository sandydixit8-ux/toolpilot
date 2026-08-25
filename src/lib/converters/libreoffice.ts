import { execFile } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs/promises';
import os from 'os';

const execFileAsync = promisify(execFile);

const CONVERSION_TIMEOUT = 120_000;

function findLibreOfficePath(): string {
  const platform = os.platform();

  if (platform === 'win32') {
    const candidates = [
      'C:\\Program Files\\LibreOffice\\program\\soffice.exe',
      'C:\\Program Files (x86)\\LibreOffice\\program\\soffice.exe',
    ];
    for (const p of candidates) {
      try {
        require('fs').accessSync(p);
        return p;
      } catch {}
    }
    return 'soffice';
  }

  const candidates = [
    '/usr/bin/soffice',
    '/usr/bin/libreoffice',
    '/usr/local/bin/soffice',
    '/snap/bin/libreoffice',
    '/Applications/LibreOffice.app/Contents/MacOS/soffice',
  ];
  for (const p of candidates) {
    try {
      require('fs').accessSync(p);
      return p;
    } catch {}
  }
  return 'soffice';
}

export interface ConversionResult {
  success: boolean;
  pdfPath?: string;
  pageCount?: number;
  error?: string;
  warnings: string[];
}

export async function convertDocxToPdf(
  inputPath: string,
  outputDir: string,
  timeout: number = CONVERSION_TIMEOUT
): Promise<ConversionResult> {
  const warnings: string[] = [];
  const sofficePath = findLibreOfficePath();

  await fs.mkdir(outputDir, { recursive: true });

  try {
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
      {
        timeout,
        maxBuffer: 50 * 1024 * 1024,
        env: {
          ...process.env,
          HOME: os.tmpdir(),
        },
      }
    );

    if (stderr && stderr.includes('Warning')) {
      warnings.push('LibreOffice reported warnings during conversion.');
    }

    const baseName = path.basename(inputPath, path.extname(inputPath));
    const pdfPath = path.join(outputDir, `${baseName}.pdf`);

    try {
      await fs.access(pdfPath);
    } catch {
      return {
        success: false,
        error: 'Conversion completed but output PDF was not found.',
        warnings,
      };
    }

    return {
      success: true,
      pdfPath,
      warnings,
    };
  } catch (err: any) {
    if (err.killed || err.code === 'ETIMEDOUT') {
      return {
        success: false,
        error: 'Conversion timed out. The document may be too large or complex.',
        warnings,
      };
    }
    return {
      success: false,
      error: `LibreOffice conversion failed: ${err.message || 'Unknown error'}`,
      warnings,
    };
  }
}
