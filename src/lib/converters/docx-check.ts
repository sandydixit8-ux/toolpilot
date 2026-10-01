import JSZip from 'jszip';

export interface DocxContentCheck {
  empty: boolean;
  hasText: boolean;
  hasImage: boolean;
}

/**
 * Detects a "blank" DOCX output: no text runs and no embedded images.
 * Used to catch scanned/image-only PDFs that produce an empty Word file
 * instead of failing with a clear error.
 *
 * Fails open (returns empty: false) if the buffer cannot be parsed, so a
 * valid conversion is never blocked by a checker error.
 */
export async function checkDocxContent(buffer: Buffer): Promise<DocxContentCheck> {
  try {
    const zip = await JSZip.loadAsync(buffer);

    const docXmlFile = zip.file('word/document.xml');
    if (!docXmlFile) {
      // Not a recognizable DOCX — fail open, the conversion pipeline owns this error.
      return { empty: false, hasText: false, hasImage: false };
    }

    const docXml = await docXmlFile.async('string');

    // Visible text: <w:t> runs with non-whitespace content
    const hasText = /<w:t(?:\s[^>]*)?>([^<]*)<\/w:t>/g.test(docXml.replace(/<w:t(?:\s[^>]*)?>\s*<\/w:t>/g, ''));

    // Images: DrawingML, legacy VML pictures, or files under word/media/
    const hasDrawing = /<w:drawing[\s>]/.test(docXml) || /<w:pict[\s>]/.test(docXml);
    const mediaFiles = zip.file(/^word\/media\//);
    const hasImage = hasDrawing || mediaFiles.length > 0;

    return { empty: !hasText && !hasImage, hasText, hasImage };
  } catch {
    // Parse failure — do not block the conversion.
    return { empty: false, hasText: false, hasImage: false };
  }
}
