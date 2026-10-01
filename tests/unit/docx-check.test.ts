import { describe, it, expect } from 'vitest';
import JSZip from 'jszip';
import { checkDocxContent } from '@/lib/converters/docx-check';

async function makeDocx(documentXml: string, extraFiles: Record<string, string> = {}): Promise<Buffer> {
  const zip = new JSZip();
  zip.file('[Content_Types].xml', '<?xml version="1.0"?><Types/>');
  zip.file('word/document.xml', documentXml);
  for (const [name, content] of Object.entries(extraFiles)) {
    zip.file(name, content);
  }
  return zip.generateAsync({ type: 'nodebuffer' });
}

const DOC_XML_NS = '<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">';

describe('checkDocxContent', () => {
  it('detects a blank DOCX (no text runs, no images) as empty', async () => {
    const buffer = await makeDocx(`${DOC_XML_NS}<w:body><w:p/><w:sectPr/></w:body></w:document>`);
    const result = await checkDocxContent(buffer);
    expect(result.empty).toBe(true);
    expect(result.hasText).toBe(false);
    expect(result.hasImage).toBe(false);
  });

  it('detects text content as non-empty', async () => {
    const buffer = await makeDocx(
      `${DOC_XML_NS}<w:body><w:p><w:r><w:t>Hello ToolPilot</w:t></w:r></w:p></w:body></w:document>`
    );
    const result = await checkDocxContent(buffer);
    expect(result.empty).toBe(false);
    expect(result.hasText).toBe(true);
  });

  it('treats whitespace-only text runs as empty', async () => {
    const buffer = await makeDocx(
      `${DOC_XML_NS}<w:body><w:p><w:r><w:t>   </w:t></w:r></w:p></w:body></w:document>`
    );
    const result = await checkDocxContent(buffer);
    expect(result.empty).toBe(true);
  });

  it('detects DrawingML images as non-empty', async () => {
    const buffer = await makeDocx(
      `${DOC_XML_NS}<w:body><w:p><w:r><w:drawing><wp:inline/></w:drawing></w:r></w:p></w:body></w:document>`
    );
    const result = await checkDocxContent(buffer);
    expect(result.empty).toBe(false);
    expect(result.hasImage).toBe(true);
  });

  it('detects images in word/media/ as non-empty even without a drawing tag', async () => {
    const buffer = await makeDocx(`${DOC_XML_NS}<w:body><w:p/></w:body></w:document>`, {
      'word/media/image1.png': 'fakepngbytes',
    });
    const result = await checkDocxContent(buffer);
    expect(result.empty).toBe(false);
    expect(result.hasImage).toBe(true);
  });

  it('fails open on unparseable buffers (does not report empty)', async () => {
    const result = await checkDocxContent(Buffer.from('this is not a zip file'));
    expect(result.empty).toBe(false);
  });

  it('fails open when word/document.xml is missing', async () => {
    const zip = new JSZip();
    zip.file('something.txt', 'hi');
    const buffer = await zip.generateAsync({ type: 'nodebuffer' });
    const result = await checkDocxContent(buffer);
    expect(result.empty).toBe(false);
  });
});
