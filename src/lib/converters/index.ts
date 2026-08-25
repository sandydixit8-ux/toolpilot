import fs from 'fs/promises';
import path from 'path';
import { convertDocxToPdf, ConversionResult } from './libreoffice';
import { validatePdf, ValidationResult } from './validation';
import { createJobDir, cleanupDir } from './cleanup';

export interface ConvertedFile {
  buffer: Buffer;
  filename: string;
  pageCount: number;
  validation: ValidationResult;
  conversion: ConversionResult;
}

export async function convertDocument(
  fileBuffer: Buffer,
  originalFilename: string
): Promise<ConvertedFile> {
  const jobDir = createJobDir();
  await fs.mkdir(jobDir, { recursive: true });
  await fs.mkdir(path.join(jobDir, 'output'), { recursive: true });

  const inputFilename = `input${path.extname(originalFilename)}`;
  const inputPath = path.join(jobDir, inputFilename);
  const outputDir = path.join(jobDir, 'output');

  try {
    await fs.writeFile(inputPath, fileBuffer);

    const conversionResult = await convertDocxToPdf(inputPath, outputDir);

    if (!conversionResult.success || !conversionResult.pdfPath) {
      throw new Error(conversionResult.error || 'Conversion failed');
    }

    const validation = await validatePdf(conversionResult.pdfPath);

    const pdfBuffer = await fs.readFile(conversionResult.pdfPath);
    const outputFilename = originalFilename.replace(/\.(docx|doc)$/i, '.pdf');

    cleanupDir(jobDir);

    return {
      buffer: pdfBuffer,
      filename: outputFilename,
      pageCount: validation.pageCount,
      validation,
      conversion: conversionResult,
    };
  } catch (err) {
    cleanupDir(jobDir, 5000);
    throw err;
  }
}
