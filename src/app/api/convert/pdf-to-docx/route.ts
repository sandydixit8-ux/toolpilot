import { NextRequest, NextResponse } from 'next/server';
import { validateFile, sanitizeFilename } from '@/lib/converters/security';

export const maxDuration = 60;

const RENDER_URL = process.env.CONVERTER_SERVICE_URL || 'https://toolpilot-5b6c.onrender.com';

export async function POST(request: NextRequest) {
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

    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const safeFilename = sanitizeFilename(file.name);

    const remoteFormData = new FormData();
    const blob = new Blob([new Uint8Array(fileBuffer)], { type: file.type || 'application/pdf' });
    remoteFormData.append('file', blob, safeFilename);

    const response = await fetch(`${RENDER_URL}/convert/pdf-to-docx`, {
      method: 'POST',
      body: remoteFormData,
      signal: AbortSignal.timeout(120000),
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => null);
      const message = errorBody?.error || 'Conversion failed on remote service.';
      return NextResponse.json(
        { success: false, error: message },
        { status: response.status >= 500 ? 500 : response.status }
      );
    }

    const docxBuffer = Buffer.from(await response.arrayBuffer());

    const headers = new Headers({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'Content-Disposition': `attachment; filename="${safeFilename.replace(/\.pdf$/i, '.docx')}"`,
    });

    return new NextResponse(docxBuffer, { status: 200, headers });
  } catch (err: unknown) {
    const error = err as { message?: string };
    console.error('[PDF-to-DOCX]', err);

    let message: string;
    if (error.message?.includes('timeout') || error.message?.includes('aborted')) {
      message = 'Conversion service is waking up. Please try again in 30 seconds.';
    } else if (error.message?.includes('ECONNREFUSED')) {
      message = 'Document conversion service is temporarily unavailable.';
    } else {
      message = 'Conversion failed. Please try again.';
    }

    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
