import { NextRequest, NextResponse } from 'next/server';
import { validateFile, sanitizeFilename } from '@/lib/converters/security';
import { checkDocxContent } from '@/lib/converters/docx-check';
import { ENGINE_SOURCE_B64 } from '@/lib/converters/pdf-to-docx-source';
import fs from 'fs';
import path from 'path';
import os from 'os';

// Polyfill DOMMatrix for pdfjs-dist (Node lacks it).
if (typeof globalThis.DOMMatrix === 'undefined') {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    globalThis.DOMMatrix = require('@napi-rs/canvas').DOMMatrix;
  } catch { /* ignore */ }
}

// Polyfill Uint8Array.prototype.toHex if missing (pdfjs 4.8.69 needs it).
// eslint-disable-next-line @typescript-eslint/no-explicit-any
if (typeof (Uint8Array.prototype as any).toHex !== 'function') {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (Uint8Array.prototype as any).toHex = function () {
    return Array.from(this).map((b) => (b as number).toString(16).padStart(2, '0')).join('');
  };
}

export const maxDuration = 60;

const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;

async function loadEngine() {
  const code = Buffer.from(ENGINE_SOURCE_B64, 'base64').toString('utf8');
  const moduleObj: { exports: Record<string, unknown> } = { exports: {} };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const req = (id: string) => {
    if (id === 'docx') {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      return require('docx');
    }
    if (id === 'adm-zip') {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      return require('adm-zip');
    }
    if (id === '@napi-rs/canvas') {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      return require('@napi-rs/canvas');
    }
    if (id === 'fs') return fs;
    if (id === 'path') return path;
    if (id === 'os') return os;
    if (id === 'pdfjs-dist/build/pdf.mjs' || id === 'pdfjs-dist') {
      const pdfjsPath = 'pdfjs-dist/build/pdf.mjs';
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      return require(pdfjsPath);
    }
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return require(id);
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fn = new (AsyncFunction as any)('module', 'exports', 'require', code);
  await fn(moduleObj, moduleObj.exports, req);
  return moduleObj.exports as { convertPdfToDocx: (p: string, o?: { mode?: string }) => Promise<{ buffer: Buffer; report: { sourcePages: number; tables: number; tableRowsTotal: number } }> };
}

export async function POST(request: NextRequest) {
  const jobDir = path.join(os.tmpdir(), `toolpilotpro-${Date.now()}-${Math.random().toString(36).slice(2)}`);
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided.' },
        { status: 400 }
      );
    }

    const securityCheck = validateFile(file);
    if (!securityCheck.valid) {
      return NextResponse.json(
        { success: false, error: securityCheck.error },
        { status: 400 }
      );
    }

    await fs.promises.mkdir(jobDir, { recursive: true });
    const safeFilename = sanitizeFilename(file.name);
    const inputPath = path.join(jobDir, 'input.pdf');
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    await fs.promises.writeFile(inputPath, fileBuffer);

    const { convertPdfToDocx } = await loadEngine();
    const { buffer: docxBuffer, report } = await convertPdfToDocx(inputPath, { mode: 'highfidelity' });

    const contentCheck = await checkDocxContent(docxBuffer);
    if (contentCheck.empty) {
      return NextResponse.json(
        {
          success: false,
          error:
            'This PDF appears to be scanned or image-based (no text layer found), so there is nothing to convert to editable text. Try the PDF to JPG tool to extract pages as images, or use an OCR tool first.',
        },
        { status: 422 }
      );
    }

    const headers = new Headers({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'Content-Disposition': `attachment; filename="${safeFilename.replace(/\.pdf$/i, '.docx')}"`,
      'X-Pages': String(report.sourcePages),
      'X-Tables': String(report.tables),
      'X-Table-Rows': String(report.tableRowsTotal),
      'X-Layout-Fidelity': 'high',
    });

    return new NextResponse(new Uint8Array(docxBuffer), { status: 200, headers });
  } catch (err: unknown) {
    const error = err as { message?: string };
    console.error('[PDF-to-DOCX]', err);

    let message: string;
    if (error.message?.includes('timeout') || error.message?.includes('aborted')) {
      message = 'Conversion timed out. The document may be too large or complex.';
    } else {
      message = 'Conversion failed. ' + (error.message || 'Please try again.');
    }

    return NextResponse.json({ success: false, error: message }, { status: 500 });
  } finally {
    try { await fs.promises.rm(jobDir, { recursive: true, force: true }); } catch {}
  }
}
