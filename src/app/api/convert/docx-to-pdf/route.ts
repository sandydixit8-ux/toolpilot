import { NextRequest, NextResponse } from 'next/server';
import { validateFile, sanitizeFilename } from '@/lib/converters/security';

const EXTERNAL_SERVICE_URL = process.env.CONVERTER_SERVICE_URL;

async function convertViaExternalService(
  fileBuffer: Buffer,
  filename: string,
  mimeType: string
): Promise<Response> {
  const formData = new FormData();
  const blob = new Blob([new Uint8Array(fileBuffer)], { type: mimeType });
  formData.append('file', blob, filename);

  const response = await fetch(`${EXTERNAL_SERVICE_URL}/convert/docx-to-pdf`, {
    method: 'POST',
    body: formData,
  });

  return response;
}

async function convertLocally(
  fileBuffer: Buffer,
  filename: string
): Promise<Response> {
  const { convertDocument } = await import('@/lib/converters');
  const result = await convertDocument(fileBuffer, filename);

  const headers = new Headers({
    'Content-Type': 'application/pdf',
    'Content-Disposition': `attachment; filename="${result.filename}"`,
    'X-Page-Count': String(result.pageCount),
    'X-Text-Selectable': String(result.validation.hasText),
    'X-Rasterized': String(result.validation.isRasterized),
    'X-Validation-Status': result.validation.valid ? 'PASS' : 'WARN',
  });

  if (result.conversion.warnings.length > 0) {
    headers.set('X-Warnings', result.conversion.warnings.join('; '));
  }

  return new NextResponse(new Uint8Array(result.buffer), { status: 200, headers });
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: { code: 'NO_FILE', message: 'No file provided.' } },
        { status: 400 }
      );
    }

    const securityCheck = validateFile(file);
    if (!securityCheck.valid) {
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_FILE', message: securityCheck.error } },
        { status: 400 }
      );
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const safeFilename = sanitizeFilename(file.name);

    let response: Response;

    if (EXTERNAL_SERVICE_URL) {
      response = await convertViaExternalService(fileBuffer, safeFilename, file.type);
    } else {
      response = await convertLocally(fileBuffer, safeFilename);
    }

    if (!response.ok) {
      const errorBody = await response.json().catch(() => null);
      const message = errorBody?.error || 'Conversion failed on remote service.';
      return NextResponse.json(
        { success: false, error: { code: 'CONVERSION_ERROR', message } },
        { status: response.status >= 500 ? 500 : response.status }
      );
    }

    const pdfBuffer = Buffer.from(await response.arrayBuffer());

    const headers = new Headers({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${safeFilename.replace(/\.(docx|doc)$/i, '.pdf')}"`,
    });

    const pageCount = response.headers.get('X-Page-Count');
    const hasText = response.headers.get('X-Text-Selectable');
    const isRasterized = response.headers.get('X-Rasterized');
    const validationStatus = response.headers.get('X-Validation-Status');
    const warnings = response.headers.get('X-Warnings');

    if (pageCount) headers.set('X-Page-Count', pageCount);
    if (hasText) headers.set('X-Text-Selectable', hasText);
    if (isRasterized) headers.set('X-Rasterized', isRasterized);
    if (validationStatus) headers.set('X-Validation-Status', validationStatus);
    if (warnings) headers.set('X-Warnings', warnings);

    return new NextResponse(pdfBuffer, { status: 200, headers });
  } catch (err: unknown) {
    const error = err as { message?: string };
    console.error('[DOCX-to-PDF]', err);

    let message: string;
    if (error.message?.includes('temporarily unavailable') || error.message?.includes('ECONNREFUSED')) {
      message = 'Document conversion service is temporarily unavailable. Please try again later.';
    } else if (error.message?.includes('timed out') || error.message?.includes('ETIMEDOUT')) {
      message = 'Conversion took too long. Please try a smaller document.';
    } else if (error.message?.includes('soffice') || error.message?.includes('ENOENT')) {
      message = 'Document conversion engine is not installed. Please contact support.';
    } else {
      message = 'Conversion failed. The document may be corrupted or contain unsupported elements.';
    }

    return NextResponse.json(
      { success: false, error: { code: 'CONVERSION_ERROR', message } },
      { status: 500 }
    );
  }
}
