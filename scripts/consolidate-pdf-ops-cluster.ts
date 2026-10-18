import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const PDF_CAT = "cmucgwqjf0000uf70pvarf359";

const P1 = "how-to-compress-pdf-without-losing-quality";
const P2 = "how-to-merge-multiple-pdfs";
const P3 = "how-to-split-pdf-files";
const P4 = "how-to-rotate-pdf-pages";

const p1Content = `Large PDF files are painful. They fail to upload, get bounced from email, and chew through cloud storage. Most of the time you can make a PDF dramatically smaller without visibly harming its content, and you can do it free in your browser. This guide explains why PDFs get big, how compression actually works, the settings that matter, and how to shrink a file in under a minute with the [PDF Compressor](/tools/pdf-compressor).

## Why PDF Files Get So Large

A PDF is a container. Its size is mostly the size of what is inside it:

- **Embedded images** are the biggest culprit. A single high-resolution photo can weigh several megabytes.
- **Scanned pages** store each page as an image, so a 50-page scan becomes a gallery of large pictures.
- **Embedded fonts** add weight, especially on documents with many font styles.
- **Vector graphics** such as logos and drawings usually add little and rarely need compression.

In short, the size of a PDF is usually the size of its images.

## What Actually Happens When You Compress a PDF

Compression decides which bytes matter and which can be discarded:

- **Text stays perfectly readable.** Compression targets image detail, not character data, so paragraphs and headings stay crisp and searchable.
- **Image resolution is reduced.** Photos pushed beyond roughly 220 pixels per inch almost never need to be that high for on-screen reading.
- **Color channels are simplified.** Some algorithms drop high-frequency colour noise the eye barely notices.

The practical rule: keep documents clear and professional and you will not see the difference. Only pixel-peeping at 400% zoom reveals it.

## How to Compress a PDF (Step by Step)

1. Open the [PDF Compressor](/tools/pdf-compressor).
2. Upload your PDF by drag and drop or browse.
3. Choose a compression level: Low, Medium, or High.
4. Check the new file size shown on screen.
5. Download the compressed PDF and attach or upload it.

The tool warns you if the result is still too large, so you never send a bouncing attachment. Nothing is uploaded to a server: the file is processed on your device.

## Which Compression Level Should You Pick?

| Level | Best for | Typical result |
| --- | --- | --- |
| Low | Contracts, forms, legal scans | 20-40% smaller, maximum quality |
| Medium | Reports and business documents | 40-60% smaller, very good quality |
| High | Photo-heavy files for quick sharing | 60-80% smaller |

Start with **Medium**, which usually gets a file under 10 MB with no visible change to text. Go **Low** if the file is a contract you may need to print. Go **High** for portals and messaging apps with small limits.

## How Much Smaller Will Your PDF Get?

| Original size | High compression | Balanced | Low |
| --- | --- | --- | --- |
| 10 MB | 1.5-3 MB | 3-5 MB | 6 MB |
| 25 MB | 3.5 MB | 7 MB | 14 MB |
| 50 MB | 5-10 MB | 12-20 MB | 28 MB |

If your PDF is mostly text, compression works extremely well. If it is mostly scanned images, you may need to combine compression with page removal.

## Compressing PDFs for Government Portals and 5 MB Limits

Most email providers cap attachments at 25 MB, but many Indian portals are far stricter.

| Portal | Typical limit |
| --- | --- |
| Passport application | 50 KB-200 KB per photo |
| Income tax filing | 5 MB per attachment |
| EPFO portal | 500 KB-1 MB |
| University admission | 1-5 MB |
| Job portals (Naukri, LinkedIn) | 2-5 MB |

For very small limits, compress first, then remove any pages you do not need. For example, use the [PDF Splitter](/tools/pdf-splitter) to drop blank or duplicate pages before compressing a scanned statement.

## If Compression Is Not Enough

Sometimes a file is simply too image-heavy:

- **Remove unneeded pages** with the [PDF Page Extractor](/tools/pdf-page-extractor) to cut blank or duplicate content.
- **Rescan at lower resolution.** If you control the source, choose 150 DPI instead of 300 DPI.
- **Compress in stages.** Apply medium compression, check, then strong if the portal still rejects it.
- **Compress the images first.** For scanned files, shrink the images with the [Image Compressor](/tools/image-compressor) before turning them into a PDF.

## Is Browser-Based Compression Safe?

Yes. The best modern compressors run entirely in your browser using JavaScript, so your PDF never leaves your device. That means no upload wait, nothing stored on a server, and no one else ever sees your document. This matters for bank statements, contracts, and ID documents.

## Summary

A PDF is only as big as the images inside it, so compression that shrinks images while protecting text is what makes files shareable. Pick Medium for everyday use, High for strict portals, and pair compression with page removal when a limit is very small. Shrink your next file free with the [PDF Compressor](/tools/pdf-compressor).`;

const p2Content = `Sending five separate PDFs for one task looks unprofessional and buries your documents in the recipient's inbox. Merging them into a single, well-ordered file makes sharing clean and reviewing effortless. The [PDF Merger](/tools/pdf-merger) combines any number of PDFs into one file in seconds, with no software to install, no signup, and no watermark.

## When Merging PDFs Helps

Combining files comes up constantly in everyday work:

- **Job applications** - resume, cover letter, and certificates submitted as one file.
- **Invoices** - three months of bills combined into one file for GST filing.
- **College work** - a report, appendix, and scanned signatures in a single submission.
- **Business documentation** - quote, terms, and invoice bundled for a client.
- **Insurance claims** - policy, hospital bills, and discharge summary together.
- **Travel files** - tickets, hotel bookings, and visas in one itinerary PDF.

## How to Merge PDFs Online

Using the [PDF merger](/tools/pdf-merger):

1. Upload the PDFs you want to combine.
2. Drag them into the correct order; this decides the page order in the result.
3. Click merge.
4. Download the single combined PDF.

That is the entire workflow, under thirty seconds from upload to download. Everything runs in your browser, so confidential reports never leave your device.

## Merge Order Matters

The final file follows the order of your uploads, so before you merge:

- Put the **cover or introductory page first**.
- Follow with the **main content** in reading order.
- End with **supporting documents and appendixes**.

Most tools show page thumbnails as you drag, so you can see the result before clicking merge. It is much harder to move pages after combining than before.

## What Merging Does Not Do

Merging only joins pages; it does not compress. A combined file can get large quickly. If your merged PDF is too big for an email or a portal upload, reduce it afterward with the [PDF Compressor](/tools/pdf-compressor), or drop extra pages with the [PDF Page Extractor](/tools/pdf-page-extractor).

## Merge vs Split vs Other PDF Jobs

| Task | Tool |
| --- | --- |
| Combine several PDFs into one | [PDF Merger](/tools/pdf-merger) |
| Pull out single pages or a range | [PDF Splitter](/tools/pdf-splitter) |
| Fix a sideways page after merging | [PDF Rotator](/tools/pdf-rotator) |
| Shrink the merged file for email | [PDF Compressor](/tools/pdf-compressor) |
| Check the final page count | [PDF Page Counter](/tools/pdf-page-counter) |

## Format and Size Limits

- Up to 20 files can be merged at once.
- Pages keep their original dimensions and rotation, so you can mix page sizes and orientations freely.
- Merged output is clean and ready to submit; no watermark is ever added.
- If the merged file is too large for a portal, compress it afterward.

## Who Merges PDFs Most

- **Students** combine a cover page, the main report, and scanned appendices into one submission file.
- **Job seekers** assemble a resume, cover letter, and certificates into a single document, after checking the application requirements.
- **Businesses** bundle proposals, quotations, and agreements into one polished pack.
- **Anyone filing paperwork** attaches one PDF instead of three when emailing a client.

## Do You Need Desktop Software to Merge PDFs?

No. A browser-based merger does everything desktop tools do, without installing anything. It keeps your files on your device, works on Windows, Mac, Android, and iPhone, and has no trial limit or watermark. The only thing desktop software adds is unattended batch automation over hundreds of files, which a single merge rarely needs.

## Merging Scanned Pages and Images

If your pages are already separate scanned PDFs, merge them directly rather than converting again. If they are loose images such as JPG or PNG, turn them into a PDF first with the [JPG to PDF](/tools/jpg-to-pdf) tool, then merge that with your other documents. Either way, confirm the final page count with the [PDF Page Counter](/tools/pdf-page-counter), and compress the result with the [PDF Compressor](/tools/pdf-compressor) if a portal rejects the size.

## Summary

Merging joins multiple PDFs into a single ordered file without recompressing or damaging them, so text stays searchable and images stay sharp. Upload in order, check the sequence, and download one clean document. Combine your files free with the [PDF Merger](/tools/pdf-merger).`;

const p3Content = `Large PDFs are difficult to share, upload, and organise. Splitting and extracting let you send the exact pages someone needs: a single chapter from a book, page 3 of an agreement, or only the last two pages of a long bank statement. This guide covers splitting a PDF into separate files, extracting specific pages into one clean PDF, and counting pages first, all with free browser-based tools.

## When You Need to Split or Extract Pages

- A portal or email accepts only the **signature page**, not the whole contract.
- You need to send **one chapter** of a textbook, not the entire book.
- A file is too big to attach, so you want just the few relevant pages.
- You need to right-size a document so it passes a portal's page or size limit.
- You want to break a giant scan into smaller, searchable batches.

## Split vs Extract: What Is the Difference?

They sound similar but serve different purposes.

| Tool | What it does | Best for |
| --- | --- | --- |
| [PDF Splitter](/tools/pdf-splitter) | Divides one PDF into several separate files | Sharing chapters, page-by-page organisation |
| [PDF Page Extractor](/tools/pdf-page-extractor) | Pulls selected pages into one new PDF | Sending a clean 3-page extract of a 40-page file |

To email just the final two invoice pages, use the extractor to make one 2-page PDF. To hand out each chapter as its own file, use the splitter.

## How to Split a PDF

1. **Upload** your PDF to the [PDF Splitter](/tools/pdf-splitter).
2. **Choose the split mode:** one page per file, or a custom range such as pages 3-6.
3. **Click split.**
4. **Download** the resulting page files, or a single PDF with just the selected range.

## How to Extract Specific Pages

1. Upload your PDF to the [PDF Page Extractor](/tools/pdf-page-extractor).
2. Choose which pages to keep, for example pages 2, 5, and 8.
3. Preview the selection.
4. Download your new PDF with only those pages.

Extracted pages keep their original text and quality. The process is lossless, and you can still copy text, search inside the PDF, and print it clearly.

## Count the Pages First

Before splitting, confirm the total so you pick the right range. The [PDF Page Counter](/tools/pdf-page-counter) reads the exact count instantly, with no scrolling through 40 pages.

| Detail | Why it helps |
| --- | --- |
| Page count | Verify submission limits |
| File size | Check email and portal limits |
| Title and author | Confirm you have the right version |
| Creation date | Find the latest draft among similar files |

## Tips for Clean Splits

- **Check the range carefully.** One wrong number means redoing it.
- **Name outputs clearly.** Page numbers in filenames make the split files easy to reassemble.
- **Keep the original.** Splitting and extracting create new files; your source stays intact.
- **Compress afterward if needed.** A single extracted page is rarely heavy, but a full chapter may need the [PDF Compressor](/tools/pdf-compressor).

## Related PDF Jobs

| Task | Tool |
| --- | --- |
| Pull out specific pages | [PDF Splitter](/tools/pdf-splitter) |
| Combine files into one | [PDF Merger](/tools/pdf-merger) |
| Rotate a mis-scanned page | [PDF Rotator](/tools/pdf-rotator) |
| Shrink the result for email | [PDF Compressor](/tools/pdf-compressor) |
| Count the final page total | [PDF Page Counter](/tools/pdf-page-counter) |

## Common Split Scenarios

- **Submit only the signed page** of a contract: extract that one page.
- **Share a single chapter** of a PDF book: split by range.
- **Send a 3-page extract** of a 40-page bank statement: extract the pages.
- **Break a 200-page scan** into 20-page batches for archiving: split by range.
- **Right-size an upload** that a portal keeps rejecting: extract only the required pages, then compress if needed.

## Do Bookmarks, Links, and Text Survive?

Yes. Splitting and extracting keep the text layer, so content stays searchable and copyable, and images keep their original resolution. Links that point within a page still work. Links that jumped to a page now in another file are broken by the cut, so check any cross-references if you split a heavily linked report.

## Summary

Use the splitter to divide a PDF into separate files and the page extractor to pull selected pages into one new PDF. Count the pages first so your range is right, keep the original, and compress only if a portal rejects the size. Everything runs in your browser, so your document never leaves your device. Start with the free [PDF Splitter](/tools/pdf-splitter).`;

const p4Content = `Nearly every PDF arrives in the wrong orientation sometimes. A colleague scans a document sideways, a downloaded bank statement renders upside down, or an exam paper mixes landscape and portrait pages. Reading a sideways PDF is painful, and submitting one that way looks unprofessional. The fix takes seconds with the [PDF Rotator](/tools/pdf-rotator), which turns any page by 90 degrees left, 90 degrees right, or 180 degrees.

## Why PDFs Arrive Rotated

- **Scanned documents.** Photocopiers and phone scan apps often produce landscape scans from portrait pages.
- **Bank and insurance statements.** Downloaded statements sometimes render rotated.
- **Mobile photos saved as PDF.** Photos taken vertically often end up sideways.
- **Mixed-orientation files.** Wide tables or charts sit sideways next to portrait pages.
- **Government uploads.** Many portals reject incorrectly oriented submissions.

## How to Rotate PDF Pages

1. Open the [PDF Rotator](/tools/pdf-rotator).
2. Upload the PDF.
3. Pick the pages to rotate, either a single page or the whole file.
4. Select the angle: 90 degrees left, 90 degrees right, or 180 degrees.
5. Download the corrected PDF.

You can rotate a single page without touching the rest of the document. The whole process happens in your browser, so your file never leaves your device, and there is no signup or charge.

## Common Fixes

| Problem | Fix |
| --- | --- |
| Whole PDF is sideways | Rotate all pages 90 degrees |
| One page is upside down | Rotate only that page 180 degrees |
| Document saved wrong after a quick edit | Rotate the whole file once and re-save |
| Mixed orientations from camera scans | Rotate page by page |

## Rotate All Pages or Just One?

A good rotator handles both:

- **Rotate all pages** for a document scanned entirely sideways.
- **Rotate a single page** when only one chart or photo is out of alignment.
- **Rotate specific pages** such as pages 3 and 7, leaving the rest untouched.

## Does Rotation Hurt Quality?

No. Rotating a PDF page changes orientation only. It does not recompress or degrade the content, so text and images stay at their original resolution. Rotation is completely lossless.

## What Rotation Does Not Fix

- **Blur.** That is a scanning problem, not an orientation problem. Rescan at a higher DPI.
- **Cropping.** If the scan cut off content, rotate first, then crop the exported image with the [Image Cropper](/tools/image-cropper).
- **Page order.** If pages are mixed up, use the [PDF Splitter](/tools/pdf-splitter) and [PDF Merger](/tools/pdf-merger) to reassemble them.

## Tips

- **Rotate before splitting.** A correctly oriented document is easier to work with.
- **Check the preview.** Most rotators show thumbnails, so you see the fix before downloading.
- **For image files** that are sideways, the [Image Rotator](/tools/image-rotator) does the same job on JPG and PNG.
- **Prepare for upload.** Before rotating, make sure the file is a real PDF and not a renamed image, and compress it if the portal has a size limit.

## Rotating a PDF on Your Phone

The same browser tool works on Android and iPhone. Open the [PDF Rotator](/tools/pdf-rotator) in your mobile browser, upload the file from your Files or Downloads folder, pick the angle, and save the corrected PDF back to your device. No app install is needed on either platform.

## Rotating a PDF Before Uploading to a Portal

Many government and job portals reject a submission that is not correctly oriented, or that mixes portrait and landscape pages. Rotate the whole file to portrait as a final step, then check the page count and file size before you upload, so the submission is not rejected for a different reason.

## Summary

Rotating a PDF page is a lossless, one-step fix for sideways and upside-down scans. Rotate a single page or the whole file by 90 or 180 degrees, preview the result, and download a clean document. Fix your crooked PDFs free with the [PDF Rotator](/tools/pdf-rotator).`;

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
    slug: P1,
    title: "How to Compress a PDF Without Losing Quality (Free, No Watermark)",
    seoTitle: "How to Compress a PDF Without Losing Quality | Free PDF Compressor",
    seoDescription:
      "Why PDFs get large, how compression works, which level to pick, and how to shrink a PDF for email or government portals to under 5 MB, free and in your browser.",
    excerpt:
      "Reduce PDF file size without ruining quality: why files get big, which compression level to choose, how to hit a 5 MB or 200 KB portal limit, and a free browser-based compressor.",
    content: p1Content,
    faqs: [
      {
        question: "Will compressing a PDF reduce its quality?",
        answer:
          "Text stays sharp and searchable; heavy images are downsampled. Choose Low or Medium for near-invisible changes, and High only when you need the smallest possible file.",
      },
      {
        question: "How much can a PDF be compressed?",
        answer:
          "Most PDFs shrink by 40% to 80% depending on how many images they contain. Text-heavy files compress the most; photo-heavy scans compress less.",
      },
      {
        question: "Is it safe to compress a confidential PDF online?",
        answer:
          "Yes, with a browser-based compressor. The file is processed on your device and never uploaded to a server, so no one else sees your document.",
      },
      {
        question: "How do I get a PDF under 5 MB or 200 KB for a portal?",
        answer:
          "Apply High compression first. If a portal needs an even smaller file, remove unnecessary pages with the PDF Splitter or Page Extractor, then compress again.",
      },
      {
        question: "Does compression remove watermarks or pages?",
        answer:
          "No. Compression only reduces file size. The content, layout, and page count stay exactly the same.",
      },
      {
        question: "Is the PDF Compressor free?",
        answer:
          "Yes. The PDF Compressor is free, needs no signup, adds no watermark, and runs entirely in your browser.",
      },
    ],
  },
  {
    slug: P2,
    title: "How to Merge PDF Files Into One (Free, Private, No Watermark)",
    seoTitle: "How to Merge PDF Files Into One | Free Online PDF Merger",
    seoDescription:
      "Combine two or more PDFs into a single ordered document for job applications, invoices, or reports. Free, private, no signup and no watermark, right in your browser.",
    excerpt:
      "Combine multiple PDFs into one clean, ordered file: when to merge, how to set the page order, merge vs split, and a free browser-based merger with no watermark.",
    content: p2Content,
    faqs: [
      {
        question: "How many PDFs can I merge at once?",
        answer:
          "Up to 20 files in a single go, as long as they fit in your browser's memory. There is no account or daily limit.",
      },
      {
        question: "Does merging reduce quality?",
        answer:
          "No. Merging joins pages without recompressing them, so text stays searchable and images stay at their original resolution.",
      },
      {
        question: "Can I reorder files before merging?",
        answer:
          "Yes. Drag and drop sets the exact final page order. Arrange the cover page first, main content next, and appendixes last.",
      },
      {
        question: "Can I merge PDFs of different page sizes?",
        answer:
          "Yes. Pages keep their original dimensions and rotation, so you can freely mix portrait, landscape, and different page sizes.",
      },
      {
        question: "Are my files uploaded to a server?",
        answer:
          "No. The merger processes everything in your browser, so confidential reports and documents stay on your device.",
      },
      {
        question: "Is the PDF Merger free?",
        answer:
          "Yes. It is free, needs no signup, and adds no watermark to the merged output.",
      },
    ],
  },
  {
    slug: P3,
    title: "How to Split and Extract Pages From a PDF (Free Guide)",
    seoTitle: "How to Split a PDF & Extract Pages | Free PDF Splitter",
    seoDescription:
      "Split a PDF into separate files or extract specific pages into one clean PDF. Count pages first, understand split vs extract, and use free browser-based tools.",
    excerpt:
      "How to split a PDF into separate files or extract specific pages into one new PDF, how the two differ, how to count pages first, and free tools that run in your browser.",
    content: p3Content,
    faqs: [
      {
        question: "What is the difference between splitting and extracting?",
        answer:
          "Splitting divides one PDF into several separate files, such as one per page or per range. Extracting pulls selected pages into one new PDF, keeping them together.",
      },
      {
        question: "Can I split by page ranges?",
        answer:
          "Yes. Choose any range such as 1-5 or 7-12, or split every page into its own file.",
      },
      {
        question: "Does splitting or extracting lower quality?",
        answer:
          "No. Both are lossless. Pages keep their original resolution and their text layer, so you can still search and copy text.",
      },
      {
        question: "How do I find the total page count first?",
        answer:
          "Use the PDF Page Counter. It reads the exact count and extra details such as file size, title, author, and creation date instantly.",
      },
      {
        question: "Is splitting free and unlimited?",
        answer:
          "Yes. There is no signup, no watermark, and no daily limit, and the original file is never changed.",
      },
      {
        question: "Are my files uploaded to a server?",
        answer:
          "No. The tools run in your browser, so your document is processed locally and never leaves your device.",
      },
    ],
  },
  {
    slug: P4,
    title: "How to Rotate PDF Pages (Fix Sideways Scans, Free)",
    seoTitle: "How to Rotate PDF Pages | Free Online PDF Rotator",
    seoDescription:
      "Rotate a single page or a whole PDF by 90 or 180 degrees to fix sideways and upside-down scans. Lossless, free, and fully private in your browser.",
    excerpt:
      "Fix sideways and upside-down PDF pages: rotate a single page or the whole file by 90 or 180 degrees, why rotation is lossless, and a free browser-based rotator.",
    content: p4Content,
    faqs: [
      {
        question: "Can I rotate just one page in a PDF?",
        answer:
          "Yes. Pick a single page, a range such as pages 3 and 7, or the entire document, without rebuilding the PDF from scratch.",
      },
      {
        question: "Does rotating a PDF reduce its quality?",
        answer:
          "No. Rotation is lossless and only changes page orientation. Text and images stay at their original resolution.",
      },
      {
        question: "Can I rotate a password-protected PDF?",
        answer:
          "Only if you have the password, which must be removed first. Remove the protection, then rotate the file.",
      },
      {
        question: "Is the PDF Rotator free and private?",
        answer:
          "Yes. It is free, needs no signup, adds no watermark, and processes the file locally in your browser, so nothing is uploaded.",
      },
      {
        question: "Will my original file be changed?",
        answer:
          "Never. Rotation creates a new corrected PDF, leaving your source file intact.",
      },
      {
        question: "What if my sideways file is a JPG or PNG, not a PDF?",
        answer:
          "Use the Image Rotator for image files. It rotates JPG and PNG the same way the PDF Rotator handles PDFs.",
      },
    ],
  },
];

const ARCHIVE: { slug: string; to: string }[] = [
  { slug: "how-to-compress-pdf-for-email", to: P1 },
  { slug: "compress-pdf-under-5mb-email-free", to: P1 },
  { slug: "free-pdf-compressor-no-watermark-online", to: P1 },
  { slug: "reduce-pdf-size-government-portal-upload", to: P1 },
  { slug: "merge-multiple-pdf-files-into-one", to: P2 },
  { slug: "merge-pdfs-college-assignments-projects", to: P2 },
  { slug: "split-pdf-pages-for-document", to: P3 },
  { slug: "how-to-extract-pages-from-pdf", to: P3 },
  { slug: "how-to-count-pdf-pages", to: P3 },
  { slug: "how-to-rotate-pdf-pages-online", to: P4 },
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
