import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const PDF_CAT = "cmucgwqjf0000uf70pvarf359";

const C1 = "how-to-convert-pdf-to-word";
const C2 = "how-to-convert-word-to-pdf";
const C3 = "how-to-convert-jpg-to-pdf-online";

const c1Content = `PDFs are built for sharing but painful for editing. When a contract, report, or bank statement arrives as a PDF and you need to change a number, fix a typo, or reuse a table, the fastest fix is converting it back into an editable Word or Excel file. This guide shows both conversions, what happens to your formatting, and how to fix the common issues, all with free tools that run in your browser.

## Why Convert a PDF Back to an Editable File

- **Fix typos and update numbers** without recreating the document.
- **Reuse content** in a fresh report, assignment, or spreadsheet instead of retyping it.
- **Pull tables into Excel** so you can sort, sum, and filter the data.
- **Add your own branding or signature** to a document you only have as a PDF.

Retyping is slow and error-prone, and a converter extracts the content while keeping the layout close to the original.

## Convert PDF to Word (Editable Text)

The [PDF to Word](/tools/pdf-to-word) converter turns PDF pages into a .docx file that opens cleanly in Microsoft Word, Google Docs, or LibreOffice.

1. Open the [PDF to Word](/tools/pdf-to-word) converter.
2. Upload your PDF, drag and drop or browse.
3. Wait a few seconds for the conversion to finish.
4. Download the .docx and open it in Word or Google Docs.
5. Edit, format, and re-export to PDF when you are done.

Text-heavy PDFs convert best. Simple layouts preserve formatting better than complex multi-column designs, and fonts may shift slightly if the destination system does not have the same fonts installed.

## Convert PDF to Excel (Editable Tables)

If the PDF contains tables, financial statements, price lists, or inventory, the right tool is [PDF to Excel](/tools/pdf-to-excel). It converts tables into a real .xlsx workbook with selectable columns and rows you can sort and total.

1. Open the [PDF to Excel](/tools/pdf-to-excel) converter.
2. Upload the PDF.
3. Preview the extracted table data.
4. Download the workbook and work with the numbers.

## PDF to Word vs PDF to Excel: Which Do You Need?

| Your PDF contains | Convert to | Best tool |
| --- | --- | --- |
| Paragraphs, letters, reports | Word | [PDF to Word](/tools/pdf-to-word) |
| Tables, statements, price lists | Excel | [PDF to Excel](/tools/pdf-to-excel) |
| Images only (scans, photos) | Keep as is, or extract images | [PDF to JPG](/tools/pdf-to-jpg) |
| Everything, for sharing | Keep as PDF | [Word to PDF](/tools/word-to-pdf) |

## What Happens to the Formatting

| Type of content | How it converts |
| --- | --- |
| Body text | Clean editable text, keeping fonts and sizes |
| Headings | Converted to Word heading styles |
| Tables | Turned into real Word tables |
| Images | Kept in place at their original position |
| Scanned pages | Converted as images; use OCR for the text |

## Common Issues and Quick Fixes

- **Font looks different.** Install the original font, or pick a similar system font.
- **Tables shifted.** Drag the column edges to adjust widths, or re-apply a table style.
- **Text runs inline.** Change the converted paragraph style back to body text.
- **A scan appears as an image.** Run the scan through an OCR tool first so the text is real.
- **Missing images or headers.** Re-upload and try again; headers and footers are sometimes embedded as page elements rather than text.

## Tips for the Best Results

- **Use clean, text-based PDFs.** Heavily scanned pages may need an OCR-capable tool.
- **Check the first page.** Verify the formatting before converting a 50-page document.
- **Keep the source PDF** until you are happy with the output.
- **Compare totals** on Excel conversions from scanned documents before reusing the figures.

## The Whole Edit Pipeline

The loop you will actually use:

1. **Convert.** PDF to Word or Excel with the converters above.
2. **Edit.** Fix the text, rework the table, update the numbers.
3. **Re-export.** Back to PDF with [Word to PDF](/tools/word-to-pdf) for a clean, shareable final file.
4. **Compress.** If the result is too large to email, shrink it with the [PDF Compressor](/tools/pdf-compressor).

## Summary

Converting a PDF back to Word or Excel unlocks a document you only had for reading. Use PDF to Word for text and layout, PDF to Excel for tables and figures, and review the output once to fix small layout shifts. Both conversions are free, need no signup, and run in your browser. Start with the [PDF to Word](/tools/pdf-to-word) converter.`;

const c2Content = `PDFs keep your layout, fonts, and margins intact on every device. A Word document can shift on someone else's laptop, but a PDF always looks the same, which is why resumes, official letters, and applications are almost always submitted as PDF. The [Word to PDF](/tools/word-to-pdf) converter does the job in seconds, right in your browser, with no signup and no watermark.

## Why Convert Word to PDF

- **Consistency.** The file looks identical on Windows, Mac, a phone, or a printer.
- **No accidental edits.** Recipients cannot easily change a PDF.
- **Reliable printing.** Page breaks and margins print as designed.
- **Acceptance.** Portals, recruiters, and colleges expect PDF.

## When You Should Convert to PDF

- **Job applications.** Resumes and cover letters as PDF every time, since recruiters and applicant tracking systems prefer them.
- **Official letters and applications.** Colleges and government offices usually ask for PDF.
- **Contracts and quotes.** Lock the formatting before sending.
- **Client deliverables.** Prevent accidental edits to a final version.
- **Printing.** PDF gives the most predictable output.

## How to Convert Word to PDF Online

1. Open the [Word to PDF converter](/tools/word-to-pdf).
2. Upload your .docx file.
3. Click convert.
4. Download the PDF. Fonts, tables, and images stay in place.

Everything runs locally in your browser, so your document never leaves your device.

## Word to PDF vs PDF to Word

They are opposite directions of the same workflow.

| Your task | Use | Why |
| --- | --- | --- |
| Share a finished file | [Word to PDF](/tools/word-to-pdf) | Formatting is locked and it opens anywhere |
| Send a professional resume | [Word to PDF](/tools/word-to-pdf) | Recruiters and ATS prefer PDFs |
| Edit a received PDF | [PDF to Word](/tools/pdf-to-word) | You get an editable document back |
| Pull tables out of a PDF | [PDF to Excel](/tools/pdf-to-excel) | Spreadsheet data comes back as cells |
| Shrink the final file | [PDF Compressor](/tools/pdf-compressor) | Reduce size without losing quality |

Pick the direction by asking one question: does this file need to look final, or does it need to be editable? Many people lock a resume as PDF and later wish they could edit it, so keeping the original Word copy saves that headache.

## Keep Formatting Perfect: Quick Checks

- **Use PDF-friendly fonts.** Arial, Calibri, and Times New Roman render reliably.
- **Check page margins and pagination** in Word first, since the PDF preserves them exactly.
- **Avoid text boxes and floating images.** They translate poorly in both directions.
- **Embed fonts** if you need an identical look on any device.
- **Name the file well.** Use something like Full-Name-Resume.pdf instead of Document1.pdf.

## Convert Word to PDF on Mobile

This works in Chrome, Safari, or Edge on both Android and iPhone:

1. Open the [Word to PDF converter](/tools/word-to-pdf) in your phone browser.
2. Tap to upload your .doc or .docx file from Files or Drive.
3. Wait a few seconds for the conversion.
4. Download the PDF and share or upload it.

iPhone users with Apple Pages files should first tap **Share, Export, Word** to create a .docx, then convert. No app download and no account are required.

## Converting Scans and Photos Instead

If your "document" is actually camera photos or scans rather than a Word file, turn them into one clean PDF with the [JPG to PDF](/tools/jpg-to-pdf) tool. Upload the images in order and download a single combined PDF.

## Summary

Converting Word to PDF locks your layout so it looks identical everywhere and cannot be edited by accident. Upload the .docx, convert, and download, then do a quick check of the page count and tables before sending. Convert your files free with the [Word to PDF](/tools/word-to-pdf) converter.`;

const c3Content = `Converting images into a single PDF is the standard way to share photos, receipts, and scanned documents in a format everyone can open, on any phone, computer, or portal. Whether you are submitting ID proofs, emailing a client, or preparing an assignment, this guide covers the whole process, identical on phone and desktop, using a tool that runs in your browser with no signup and no watermark.

## When You Need JPG to PDF

- **KYC and form uploads.** Many applications and portals accept only PDF.
- **Emails.** One PDF is cleaner than five loose images.
- **College and office submissions.** Reports and assignments look professional as a single PDF.
- **Scanned documents.** Multi-page forms become one tidy, ordered file.
- **Print shops.** A PDF keeps image order and page size predictable.

## How to Convert JPG to PDF

Using the [JPG to PDF converter](/tools/jpg-to-pdf):

1. Open the tool on any device.
2. Upload one or more JPG or PNG images, drag and drop works.
3. Arrange them in the order you want.
4. Choose the layout: one image per page, or fit them together.
5. Click convert and download your PDF.

Everything happens in your browser, so your photos are never uploaded to a server.

## Combine Multiple Images Into One PDF

The same tool combines many images into a single PDF, which is what most tasks actually need:

- **ID proofs and certificates** (Aadhaar, PAN) sent as one file.
- **Photo shoots or designs** emailed to a client as one deliverable.
- **Assignments and receipts** that must be a single document.

| Step | What to do |
| --- | --- |
| 1 | Open the [JPG to PDF tool](/tools/jpg-to-pdf) |
| 2 | Upload multiple images (JPG, PNG, or WebP) |
| 3 | Reorder them with drag and drop |
| 4 | Convert and download the single PDF |

If your pages are already separate PDFs, do not convert them again. Merge them directly with the [PDF Merger](/tools/pdf-merger), which keeps formatting intact.

## How to Convert on a Phone

1. On your phone's browser, open the [image to PDF converter](/tools/jpg-to-pdf).
2. Select several photos from your gallery.
3. Arrange the order, then convert.
4. Save the PDF to Files, or share it straight from your email app.

For good scans, hold the camera level, use daylight, and avoid shadows across the page. A slightly rotated image converts fine but looks unprofessional once it becomes a fixed PDF page, so straighten it first.

## JPG vs PNG: Which to Use

Both formats work. PNG keeps sharper edges for text and logos, so convert from PNG when the source contains text or line art. For photos, JPG is lighter and produces smaller PDFs.

## Keep the File Small: Combine, Then Compress

Combining images into a PDF does not compress them. A 12 MP photo stays a 12 MP photo inside the PDF, so a batch of photos can produce a large file. If a portal rejects the size, run the finished PDF through the [PDF Compressor](/tools/pdf-compressor). For very large scans, shrink the images first with the [Image Compressor](/tools/image-compressor).

## PDF Back the Other Way

Need images after converting? The reverse direction works too. A [PDF to JPG](/tools/pdf-to-jpg) converter turns individual PDF pages into images, which is useful for slides, thumbnails, or sharing a single page from a long document.

## Tips for Clean Output

- **Order matters.** Arrange images before converting so you do not redo the merge.
- **Name the file** before sending; ID-proof_Ankit.pdf beats IMG_9481.pdf.
- **Keep images at 1-3 MB each** for clear pages without bloating the file.
- **Keep the batch manageable,** ideally under 200 pages, for a smooth conversion.

## Summary

JPG to PDF turns loose photos and scans into one clean, ordered document that any portal, email, or printer accepts. Upload in order, pick the layout, and download, then compress only if the size is a problem. Convert your images free with the [JPG to PDF](/tools/jpg-to-pdf) converter.`;

type Pillar = {
  slug: string;
  title: string;
  seoTitle: string;
  seoDescription: string;
  excerpt: string;
  content: string;
  faqs: { question: string; answer: string }[];
};

const pillars: Pillar[] = [
  {
    slug: C1,
    title: "How to Convert PDF to Word and Excel (Free, Keep Formatting)",
    seoTitle: "How to Convert PDF to Word & Excel | Free, Keeps Formatting",
    seoDescription:
      "Convert a PDF back into an editable Word document or Excel spreadsheet. Fix typos, reuse tables, and preserve fonts and layout with free browser-based converters.",
    excerpt:
      "Turn a PDF back into an editable Word document or Excel spreadsheet: which converter to use, what happens to formatting, common fixes, and free tools that run in your browser.",
    content: c1Content,
    faqs: [
      {
        question: "Can I edit a scanned PDF?",
        answer:
          "A PDF whose pages are images needs OCR before the text is editable. Text-based converters handle digital PDFs well; for scans, run them through an OCR tool first.",
      },
      {
        question: "Will my formatting be exactly preserved?",
        answer:
          "Basic layout is preserved. Very complex two-column pages or heavily figured documents may need minor fixes in Word after converting.",
      },
      {
        question: "Should I convert to Word or Excel?",
        answer:
          "Use PDF to Word for paragraphs, letters, and reports. Use PDF to Excel when the content is a table, financial statement, or price list you want to sort and total.",
      },
      {
        question: "Are my files kept on a server?",
        answer:
          "No. The converters process files in your browser or delete them right after conversion, so your document stays private.",
      },
      {
        question: "Is PDF to Word conversion free?",
        answer:
          "Yes. Both the PDF to Word and PDF to Excel converters are free, need no signup, add no watermark, and have no page limit.",
      },
      {
        question: "How do I turn the edited file back into a PDF?",
        answer:
          "After editing in Word or Excel, export it back to PDF with the Word to PDF converter, then compress it if the file is too large to email.",
      },
    ],
  },
  {
    slug: C2,
    title: "How to Convert Word to PDF Without Losing Formatting (Free)",
    seoTitle: "How to Convert Word to PDF Without Losing Formatting | Free",
    seoDescription:
      "Convert a Word document to PDF while keeping fonts, tables, and margins intact. Free, no signup, and it works on desktop and mobile in your browser.",
    excerpt:
      "Convert Word documents to PDF without losing formatting: when to convert, how the two PDF directions differ, keep-formatting checks, and mobile steps, all free in your browser.",
    content: c2Content,
    faqs: [
      {
        question: "Is Word to PDF conversion accurate?",
        answer:
          "Yes. Tables, images, headings, and page breaks carry over cleanly, so the PDF looks identical to your Word document.",
      },
      {
        question: "Does it accept older .doc files?",
        answer:
          "Upload .docx for the best results. For older .doc files, open them in Word or Google Docs and save as .docx first, then convert.",
      },
      {
        question: "Will my resume formatting stay the same?",
        answer:
          "Yes. Fonts, tables, and spacing are preserved, so the PDF looks the same as the original. Do a quick page-count check to make sure nothing spilled onto an extra page.",
      },
      {
        question: "Can I convert Word to PDF on my phone?",
        answer:
          "Yes. Open the Word to PDF converter in Chrome, Safari, or Edge on Android or iPhone, upload the file, and download the PDF. No app is needed.",
      },
      {
        question: "Does the conversion add a watermark?",
        answer:
          "No. The output is clean and ready to submit, with no watermark and no signup required.",
      },
      {
        question: "What is the difference between Word to PDF and PDF to Word?",
        answer:
          "Word to PDF locks a finished document for sharing or printing. PDF to Word unlocks a received PDF so you can edit its text and layout.",
      },
    ],
  },
  {
    slug: C3,
    title: "How to Convert JPG to PDF (Free, On Phone or PC)",
    seoTitle: "How to Convert JPG to PDF | Free, Phone & Desktop",
    seoDescription:
      "Turn one or many images into a single clean PDF for uploads, emails, and submissions. Same steps on phone and desktop, free, private, and no watermark.",
    excerpt:
      "Convert JPG and PNG images into one clean PDF on phone or PC: combine multiple images, order pages, keep the file small, and the reverse PDF to JPG direction.",
    content: c3Content,
    faqs: [
      {
        question: "Can I combine multiple images into one PDF?",
        answer:
          "Yes. Upload them all together and they merge into a single file in your chosen order. You can also mix JPG and PNG in the same PDF.",
      },
      {
        question: "Is there a file or page limit?",
        answer:
          "There is no practical limit, and since processing is local to your browser, large batches still work smoothly. Keep pages under roughly 200 for the fastest conversion.",
      },
      {
        question: "Does converting JPG to PDF reduce image quality?",
        answer:
          "No. Images keep their original resolution, so a 12 MP photo stays a 12 MP photo inside the PDF. Compress afterward only if the file is too large.",
      },
      {
        question: "Are my images uploaded to a server?",
        answer:
          "No. The conversion runs in your browser, so your photos and scans stay on your device.",
      },
      {
        question: "How do I make the PDF smaller for a portal?",
        answer:
          "Run the finished PDF through the PDF Compressor, or shrink the source images with the Image Compressor before converting.",
      },
      {
        question: "Can I convert a PDF back to images?",
        answer:
          "Yes. The PDF to JPG converter turns individual PDF pages into images, which is useful for slides, thumbnails, or sharing a single page.",
      },
    ],
  },
];

const ARCHIVE: { slug: string; to: string }[] = [
  { slug: "pdf-to-word-converter-complete-guide", to: C1 },
  { slug: "convert-pdf-to-word-edit-without-losing-formatting", to: C1 },
  { slug: "pdf-to-editable-word-excel-guide", to: C1 },
  { slug: "convert-pdf-to-excel-free-online", to: C1 },
  { slug: "word-to-pdf-vs-pdf-to-word", to: C2 },
  { slug: "word-to-pdf-mobile-tips", to: C2 },
  { slug: "jpg-to-pdf-conversion-guide", to: C3 },
  { slug: "how-to-combine-images-into-one-pdf", to: C3 },
];

async function run() {
  for (const p of pillars) {
    const existing = await prisma.blogPost.findUnique({ where: { slug: p.slug } });
    if (!existing) {
      console.log("MISSING pillar, skipping:", p.slug);
      continue;
    }
    await prisma.blogPost.update({
      where: { slug: p.slug },
      data: {
        title: p.title,
        seoTitle: p.seoTitle,
        seoDescription: p.seoDescription,
        excerpt: p.excerpt,
        content: p.content,
        status: "PUBLISHED",
        categoryId: PDF_CAT,
        publishedAt: existing.publishedAt ?? new Date("2026-09-21T09:53:54.585Z"),
      },
    });
    await prisma.fAQ.deleteMany({ where: { blogPostId: existing.id } });
    await prisma.fAQ.createMany({
      data: p.faqs.map((f, i) => ({ question: f.question, answer: f.answer, blogPostId: existing.id, order: i })),
    });
    console.log("UPDATED pillar:", p.slug, "| words:", p.content.split(/\s+/).length, "| faqs:", p.faqs.length);
  }

  for (const a of ARCHIVE) {
    const r = await prisma.blogPost.updateMany({ where: { slug: a.slug }, data: { status: "ARCHIVED" } });
    console.log("ARCHIVED:", a.slug, "->", a.to, "| rows:", r.count);
  }

  const published = await prisma.blogPost.count({ where: { status: "PUBLISHED" } });
  const archived = await prisma.blogPost.count({ where: { status: "ARCHIVED" } });
  console.log("PUBLISHED now:", published, "| ARCHIVED now:", archived);
}

async function main() {
  for (let i = 0; i < 4; i++) {
    try {
      await run();
      break;
    } catch (e: any) {
      console.log("retry", i, e?.message?.slice(0, 90));
      await new Promise((r) => setTimeout(r, 3000));
    }
  }
}

main().finally(() => prisma.$disconnect());
