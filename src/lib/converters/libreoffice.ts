import { execFile } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs/promises';
import fsSync from 'fs';
import os from 'os';

const execFileAsync = promisify(execFile);

const CONVERSION_TIMEOUT = 120_000;

function findLibreOfficePath(): string | null {
  const platform = os.platform();

  if (platform === 'win32') {
    const candidates = [
      'C:\\Program Files\\LibreOffice\\program\\soffice.exe',
      'C:\\Program Files (x86)\\LibreOffice\\program\\soffice.exe',
    ];
    for (const p of candidates) {
      try {
        fsSync.accessSync(p);
        return p;
      } catch {}
    }
    return null;
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
      fsSync.accessSync(p);
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

  if (!sofficePath) {
    return {
      success: false,
      error: 'LibreOffice is not installed. Please install LibreOffice to enable document conversion.',
      warnings: [],
    };
  }

  await fs.mkdir(outputDir, { recursive: true });

  const loProfileDir = path.join(os.tmpdir(), 'toolpilotpro', 'lo-profile');
  await fs.mkdir(loProfileDir, { recursive: true });

  try {
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

    const env: NodeJS.ProcessEnv = {
      ...process.env,
      HOME: os.tmpdir(),
      TMPDIR: os.tmpdir(),
      TEMP: os.tmpdir(),
      TMP: os.tmpdir(),
    };

    if (os.platform() === 'win32') {
      env.USERPROFILE = loProfileDir;
    }

    const baseName = path.basename(inputPath, path.extname(inputPath));
    const pdfPath = path.join(outputDir, `${baseName}.pdf`);

    let stdout = '';
    let stderr = '';

    try {
      const result = await execFileAsync(sofficePath, args, {
        timeout,
        maxBuffer: 50 * 1024 * 1024,
        env,
        windowsHide: true,
      });
      stdout = result.stdout;
      stderr = result.stderr;
    } catch (execErr: unknown) {
      const execError = execErr as { stderr?: string; stdout?: string };
      stderr = execError.stderr || '';
      stdout = execError.stdout || '';

      try {
        await fs.access(pdfPath);
      } catch {
        throw execErr;
      }
    }

    if (stderr && stderr.includes('Warning')) {
      warnings.push('LibreOffice reported warnings during conversion.');
    }

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
  } catch (err: unknown) {
    const error = err as { killed?: boolean; code?: string; message?: string };
    if (error.killed || error.code === 'ETIMEDOUT') {
      return {
        success: false,
        error: 'Conversion timed out. The document may be too large or complex.',
        warnings,
      };
    }
    return {
      success: false,
      error: `LibreOffice conversion failed: ${error.message || 'Unknown error'}`,
      warnings,
    };
  }
}
