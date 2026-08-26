import { NextResponse } from 'next/server';

export async function GET() {
  const converterUrl = process.env.CONVERTER_SERVICE_URL;
  return NextResponse.json({
    CONVERTER_SERVICE_URL: converterUrl ? 'SET (length: ' + converterUrl.length + ')' : 'NOT SET',
    url: converterUrl || 'none',
  });
}
