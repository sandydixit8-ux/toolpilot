import fs from 'fs/promises';

export interface ValidationResult {
  valid: boolean;
  pageCount: number;
  hasText: boolean;
  hasImages: boolean;
  isRasterized: boolean;
  textLength: number;
  warnings: string[];
}

export async function validatePdf(pdfPath: string): Promise<ValidationResult> {
  const warnings: string[] = [];
  let pageCount = 0;
  let hasText = false;
  let hasImages = false;
  let isRasterized = false;
  let textLength = 0;

  try {
    const buffer = await fs.readFile(pdfPath);
    const pdfString = buffer.toString('latin1');

    const pageMatches = pdfString.match(/\/Type\s*\/Page[^s]/g);
    pageCount = pageMatches ? pageMatches.length : 0;

    const textMatches = pdfString.match(/BT[\s\S]*?ET/g);
    textLength = textMatches ? textMatches.join('').length : 0;
    hasText = textLength > 50;

    const imageMatches = pdfString.match(/\/Subtype\s*\/Image/g);
    hasImages = imageMatches ? imageMatches.length > 0 : false;

    const imageCount = imageMatches ? imageMatches.length : 0;
    if (pageCount > 0 && imageCount > 0 && !hasText) {
      isRasterized = true;
      warnings.push('PDF appears to be rasterized (image-only). Text may not be selectable.');
    }

    if (pageCount === 0) {
      warnings.push('Could not determine page count from PDF.');
      pageCount = 1;
    }

    if (!hasText && pageCount > 0) {
      warnings.push('No selectable text detected in PDF.');
    }
  } catch {
    warnings.push('PDF validation could not be performed.');
  }

  return {
    valid: !isRasterized && pageCount > 0,
    pageCount,
    hasText,
    hasImages,
    isRasterized,
    textLength,
    warnings,
  };
}
