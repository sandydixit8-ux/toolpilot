import type { FAQ } from "@/types/tool";

/**
 * Long-form guides for the tools we most want indexed.
 *
 * The catalogue already carries a short description, a five-step "how to use"
 * and a handful of FAQs. That is enough to operate a tool but not enough to
 * rank for the questions people actually type, and it reads like boilerplate
 * to a human reviewer. These guides add the part that cannot be templated:
 * what the tool really does to a file, where the numbers come from, and the
 * mistakes that make people retry.
 *
 * Rendered server-side with `renderBlogContent`, so the same markdown subset
 * as blog posts applies (h2/h3, lists, tables, links, bold). Extra FAQs are
 * merged into FAQSection so the FAQPage schema follows automatically.
 */

export interface ToolGuide {
  markdown: string;
  faqs?: FAQ[];
}

export const TOOL_GUIDES: Record<string, ToolGuide> = {
  "pdf-to-word": {
    markdown: `## What really changes when a PDF becomes a Word file

A PDF stores the position of every letter, line and image on the page. It does not store paragraphs, headings or a reading order. A Word file does. Conversion is therefore a reconstruction, not a translation, and the quality of the result depends almost entirely on how the original PDF was produced.

PDFs exported from Word, Google Docs or LibreOffice carry an invisible text layer plus hints about fonts and spacing. Those convert well: paragraphs come back, bold and italic survive, and simple tables usually rebuild as editable tables. PDFs produced by a scanner or a phone camera carry no text at all, only a photograph of the page. Some converters place that photograph on a Word page, which looks correct but cannot be typed into.

## How to tell which kind of PDF you have

Open the file in any viewer and try to select a sentence with your mouse. If the text highlights cleanly, it has a text layer and will convert into editable words. If the selection snaps around the whole page, or nothing highlights, the file is an image and needs optical character recognition (OCR) before it can become text.

Two more checks are worth doing before you convert:

- Zoom to 200 percent. Fuzzy, pixelated letters mean a low-resolution scan, and OCR will make mistakes on them.
- Look for multi-column layouts, sidebars and footnotes. Converters read left to right across the whole page, so columns often get interleaved into one long paragraph.

## Getting a clean editable file

Convert first, then fix the structure in Word rather than fighting the converter. Apply Heading 1 and Heading 2 styles to the sections the converter flattened, and use Insert > Table > Convert Text to Table when a table arrives as tab-separated lines. Re-type short headings instead of pasting them, because pasted text often carries odd font runs that break later formatting.

If the document is long, split it before converting. A 300-page report gives the converter far more chances to misplace a page, and you will spend longer repairing it than converting five 60-page sections. Use the [PDF splitter](/tools/pdf-splitter) to break it up and the [PDF merger](/tools/pdf-merger) to reassemble the edited parts.

## When conversion is the wrong tool

If you only need to read the document, keep the PDF. If you need to fill in a form, a PDF editor is faster than converting and rebuilding the fields. And if the PDF is a signed contract, converting it can strip the signature and audit trail, so keep the original and edit a copy.`,
    faqs: [
      {
        question: "Why does my converted Word file look different from the PDF?",
        answer:
          "A PDF records exact positions while Word reflows text to fit the page. Margins, line breaks and page counts can shift even when every word is correct. Complex layouts with columns, text boxes or overlapping images are the most likely to move.",
      },
      {
        question: "Can it convert a scanned PDF into editable text?",
        answer:
          "Only if the converter includes OCR. A plain scanned PDF is an image with no text layer, so the output is an image placed on a Word page. Run it through an OCR tool first, then convert the searchable PDF to Word.",
      },
      {
        question: "Will my tables and images survive the conversion?",
        answer:
          "Simple tables with clear grid lines usually rebuild as editable tables, and standalone images are carried across. Tables without borders, nested tables and charts pasted as objects often arrive as plain text or separate images that need manual repair.",
      },
      {
        question: "Is there a file size limit?",
        answer:
          "Very large PDFs are accepted but take longer. If a file is over about 20 MB, compress it first with the PDF compressor; the text layer is unaffected and conversion finishes faster.",
      },
    ],
  },

  "pdf-compressor": {
    markdown: `## Why PDF files get so large

Most of the weight in a PDF is images, not text. A single page scanned at 600 dpi can hold 20 MB of pixels, while the same page typed as text is a few kilobytes. Presentation decks add full-page background images, brochures embed high-resolution photos, and exported reports often keep every image at print resolution even though nobody will ever print them.

A compressor reduces size in three ways: it downsamples images to a lower resolution, recompresses them as JPEG at a chosen quality, and removes duplicate objects, unused fonts and metadata. Text and vector lines are left alone, which is why a well-compressed document still looks sharp on screen.

## Choosing a compression level

There is no single best setting, because the right answer depends on where the file is going.

| Level | What it does | Best for |
| --- | --- | --- |
| Low | Light downsampling, keeps near-print quality | Documents that may be printed or archived |
| Medium | Images around 150 dpi, moderate JPEG quality | Email attachments and most uploads |
| High | Aggressive downsampling and stronger JPEG | Strict size limits and screen-only reading |

Start at medium. If the result is still too big, go to high and check one image-heavy page at 100 percent zoom before you send it. If the text looks grey or the photos look blocky, step back one level.

## Common size limits worth targeting

Gmail allows attachments up to 25 MB, Outlook commonly caps at 20 MB, and many government and university portals reject anything above 5 or 10 MB. WhatsApp accepts large documents but is slow to transfer them on mobile data. Aim for under 5 MB for portals, under 10 MB for email, and under 2 MB when a form only needs to be readable.

## What compression cannot fix

If a scan was made at 150 dpi with heavy JPEG artifacts, there is no quality left to remove and the savings will be small. The same applies to PDFs that were already optimized by another tool: the images are already compressed, so the second pass mostly removes metadata. In that case the real fix is rescanning at a sensible resolution, usually 300 dpi for text.

Compression also does not reduce the number of pages. If a file is large because it is 400 pages long, splitting it or removing pages you do not need will do more than any quality setting. Everything here happens in your browser, so you can test each level on the same file and compare the reported sizes before downloading.`,
    faqs: [
      {
        question: "Which compression level should I choose for an email attachment?",
        answer:
          "Medium is the safe default. It usually brings an image-heavy document well under the 20 to 25 MB limits most email providers enforce, and text stays crisp. Drop to high only if the file is still rejected.",
      },
      {
        question: "Does compressing a PDF make the text blurry?",
        answer:
          "No. Text and vector graphics are not images, so they are not downsampled. Blurriness appears only in photographs and scanned pages, and mainly at the high setting.",
      },
      {
        question: "Why did my PDF barely get smaller?",
        answer:
          "It was probably already compressed, or it contains mostly text and vector art rather than images. Running a second pass on an optimized file removes little more than metadata.",
      },
      {
        question: "Is it safe to compress a signed or legal document?",
        answer:
          "Compression can invalidate a digital signature because it alters the file bytes. Keep the original signed copy and compress a duplicate made for sharing.",
      },
    ],
  },

  "pdf-merger": {
    markdown: `## When merging PDFs is the right move

Merging is for documents that belong together but arrived separately: an invoice plus its receipt, a contract plus appendices, ten scanned pages exported one at a time, or a portfolio assembled from files made in different apps. Sending one file instead of eleven also removes the chance that a recipient opens only the first attachment.

It is not a substitute for editing. Merging does not renumber pages inside the original documents, fix inconsistent margins, or unify fonts. If the result needs to look like one designed document, merge first and then rebuild the layout in a word processor or design tool.

## Order and page setup matter more than people expect

The most common mistake is uploading files in the order the computer listed them rather than the order a reader needs. Drag each file into position before merging: cover page, then body, then appendices, then supporting evidence. If a scanned bundle is upside down, rotate it before you merge rather than after, because rotating pages inside a finished PDF is a separate job.

Mixed page sizes are the second common problem. A4 and US Letter are close enough to read but print with different margins, and a landscape page dropped into a portrait document will appear rotated. Check the page size of each source file if the merged document is going to a printer.

## A workflow that avoids rework

1. Compress the heaviest files first. Merging does not shrink anything, so a 30 MB scan stays 30 MB after it joins the bundle.
2. Remove blank pages and cover sheets you do not need. Fewer pages means a smaller, cleaner file.
3. Merge and check the first and last page of every source document, not just the overall start and end.
4. Rename the result with a date and a person or project name so it can be found later.

Bookmarks, form fields and annotations can be lost when files are combined, because each document may define its own outline and field names. If the PDF has fillable forms, flatten or complete them before merging.

## Privacy and limits

Processing happens in your browser, so the files are never uploaded and there is nothing left on a server afterwards. The practical limit is your device's memory rather than an arbitrary cap: twenty large scanned files can exhaust a phone browser. On mobile, merge in batches of five and combine the results.`,
    faqs: [
      {
        question: "Does merging reduce the quality of the original PDFs?",
        answer:
          "No. The pages are copied as they are, so text, images and fonts keep their original quality. Only metadata and some bookmarks may be dropped.",
      },
      {
        question: "Can I merge PDFs with different page sizes?",
        answer:
          "Yes, but the pages keep their own dimensions, so A4 and Letter pages will not match when printed. Standardize page size in the source files first if the output is for print.",
      },
      {
        question: "Why are my bookmarks missing after merging?",
        answer:
          "Each PDF can carry its own outline, and combining files often keeps only one or none of them. Add bookmarks again in a PDF editor after merging if navigation matters.",
      },
      {
        question: "Is there a limit on how many files I can combine?",
        answer:
          "The tool accepts up to twenty files at once. The real constraint is your device's memory, so very large scanned bundles are easier to merge in smaller batches.",
      },
    ],
  },

  "jpg-to-pdf": {
    markdown: `## Why so many forms ask for a PDF

Portals, visa applications, insurance claims and university submissions usually accept one PDF rather than a folder of images. A PDF fixes the page order, keeps every page the same size, and cannot be reordered by accident when it is forwarded. Converting photos to PDF also makes a scanned set searchable by filename and easy to print in one job.

## Match the resolution to the destination

The image you upload is placed on the page as it is, so the resolution decides whether the print looks sharp.

| Destination | Good pixel width | Why |
| --- | --- | --- |
| On-screen submission | 1000 to 1500 px | Readable and small enough to upload |
| Home or office printing | 2000 to 2500 px | Roughly 200 to 300 dpi on A4 |
| Photo album | 3000 px or more | Keeps detail when printed large |

Do not upscale a small image to hit a number. Enlarging adds pixels but no detail, so a 600 px photo stretched to 3000 px looks softer than the original. If a form demands 300 dpi and your scan is 150 dpi, rescanning is the only real fix.

## Page size, orientation and margins

A phone photo is rarely the same shape as A4 or Letter, so the converter either fits the image inside the page with white margins or stretches it to fill. Fitting is almost always better: stretching distorts faces, documents and signatures. Set the orientation to match the majority of your images, and rotate any landscape photo before converting so it does not appear sideways.

For documents, leave a small white margin. Printers clip the outer few millimeters, and signatures or page numbers placed at the very edge can disappear.

## A checklist before you convert

- Put the pages in reading order and remove duplicates.
- Rotate sideways photos so the text reads normally.
- Crop out table edges, fingers and shadows.
- Check that every page is legible at 100 percent zoom on a phone.
- Keep the original images until the PDF opens correctly on another device.

If the PDF is too large to upload, run it through the [PDF compressor](/tools/pdf-compressor) afterwards. Compression lowers the resolution of the embedded images without touching the page order.`,
    faqs: [
      {
        question: "Can I put several photos into one PDF?",
        answer:
          "Yes. Upload them together, drag them into the order you want, and the converter places each image on its own page in that sequence.",
      },
      {
        question: "What resolution should my images be?",
        answer:
          "About 2000 px on the long edge is a good balance for printing at A4. For screen-only submissions, 1000 to 1500 px is plenty and keeps the file small.",
      },
      {
        question: "Why is my PDF file so large?",
        answer:
          "Phone cameras produce 4 to 12 MB images, and each one becomes a full page. Compress the PDF afterwards, or resize the images before converting.",
      },
      {
        question: "Does converting a JPG to PDF reduce its quality?",
        answer:
          "The image is embedded without re-encoding, so there is no additional quality loss. The only change is that the picture is now placed on a page with margins.",
      },
    ],
  },

  "image-compressor": {
    markdown: `## What compression actually removes

Compression throws away detail the eye is unlikely to notice: subtle color variations, high-frequency noise and precision in areas of flat color. It does not change the pixel dimensions. A 4000 x 3000 photo stays 4000 x 3000 after compression; it just weighs less. That distinction matters because file size and display size are separate problems with separate fixes.

JPEG is good at this because it was designed for photographs. PNG is lossless, so compressing a PNG usually means reducing its color palette, which is great for logos and screenshots but wrong for photos. WebP combines both approaches and typically lands 25 to 35 percent smaller than JPEG at the same visual quality.

## Picking a quality level

The quality slider trades file size against artifacts. For most web images, 75 to 85 is invisible at normal viewing size and cuts the file dramatically. Below about 60, flat areas start to show blocky patterns and sharp edges develop halos, especially around text.

| Use | Suggested quality | Notes |
| --- | --- | --- |
| Hero or product photo | 80 to 85 | Detail still matters when zoomed |
| Blog and card images | 70 to 80 | Fine at 1x, acceptable at 2x |
| Thumbnails and avatars | 60 to 70 | Small display size hides artifacts |
| Screenshots and logos | Use PNG or WebP | JPEG blurs crisp text |

Always compare at 100 percent zoom before you publish. A photo can look perfect in a small preview and show banding in a full-width hero.

## Compression versus resizing

If an image is 5000 px wide but displayed at 800 px, resizing does far more for load time than any quality slider. Compress after resizing, not instead of it. A common workflow is: resize to roughly twice the display width for high-density screens, then compress to 80 percent quality, then convert to WebP if the platform supports it.

## Why this affects search and revenue

Large images are usually the heaviest part of a page. Google measures how quickly the main image finishes loading, and slow images hurt both the score and the number of people who stay. Moving a hero image from 1.8 MB to 180 KB often improves that metric more than any code change, and it costs nothing but a re-upload. Since the processing happens locally in your browser, you can test several quality levels and keep the smallest version that still looks right.`,
    faqs: [
      {
        question: "Does compressing an image reduce its dimensions?",
        answer:
          "No. Compression lowers file size by discarding invisible detail; the width and height in pixels stay the same. Use the image resizer if you also need smaller dimensions.",
      },
      {
        question: "Should I compress a PNG screenshot?",
        answer:
          "PNG compression is lossless or palette-based, so savings are modest for colorful screenshots. WebP usually does better, but keep PNG if the image has transparent areas or very sharp text.",
      },
      {
        question: "Can I compress an image more than once?",
        answer:
          "Yes, but repeated lossy compression stacks artifacts. Always compress from the original file rather than re-compressing an already compressed copy.",
      },
      {
        question: "What quality setting should I use for a website?",
        answer:
          "Start at 80. It is visually indistinguishable from the original at normal viewing size for most photographs and typically cuts the file size by more than half.",
      },
    ],
  },

  "image-resizer": {
    markdown: `## Pixels, aspect ratio and why photos stretch

Every image has a width and height in pixels. Changing those numbers is resizing; changing how many bytes the file occupies is compression. Resizing down removes pixels permanently, which is why you should keep the original and save the resized copy under a new name.

Aspect ratio is the relationship between width and height. A 3000 x 2000 photo is 3:2. If you type 1080 x 1080 without unlocking the ratio, the image will be squashed. Keeping the ratio locked and entering one dimension is the safe way to resize; unlocking it is only for deliberate crops, where you accept losing part of the frame.

## Preset sizes that actually get used

| Where it goes | Pixels | Ratio |
| --- | --- | --- |
| Instagram square post | 1080 x 1080 | 1:1 |
| Instagram portrait post | 1080 x 1350 | 4:5 |
| Story or Reel cover | 1080 x 1920 | 9:16 |
| YouTube thumbnail | 1280 x 720 | 16:9 |
| LinkedIn banner | 1584 x 396 | 4:1 |
| X (Twitter) header | 1500 x 500 | 3:1 |
| US passport photo | 600 x 600 | 1:1 at 300 dpi |
| UK passport photo | 413 x 531 | 35 x 45 mm at 300 dpi |

Social platforms re-encode everything you upload, so the numbers above are guidance rather than guarantees. What matters is uploading at least the recommended size and using the right ratio, so the platform crops rather than pads.

## Upscaling does not add detail

Enlarging an image interpolates new pixels from existing ones. It can look acceptable for a soft background, but it will never recover detail that was not captured. A 600 px portrait enlarged to 3000 px is still a 600 px portrait in terms of real information, and printed large it will look blurry. If a client needs a large print, the photo has to be shot or scanned at that size.

## Resize before you compress

Resizing first makes compression more effective, because there are fewer pixels to encode. For the web, a sensible order is: crop to the right ratio, resize to about twice the display width for high-density screens, then compress. A 4000 px photo resized to 1600 px and compressed often drops from 5 MB to under 300 KB, with no visible difference at the size it is shown.`,
    faqs: [
      {
        question: "Will resizing make my image blurry?",
        answer:
          "Shrinking an image usually keeps it sharp because extra pixels are averaged away. Enlarging makes it softer because new pixels are guessed. Avoid upscaling unless the image will only be seen small.",
      },
      {
        question: "How do I resize without stretching the photo?",
        answer:
          "Keep the aspect ratio locked and change only one dimension; the other adjusts automatically. Unlock it only when you intend to crop to a new shape.",
      },
      {
        question: "What is the best size for a website image?",
        answer:
          "Roughly twice the width it will be displayed at works well for high-density screens. A full-width image shown at 1200 px is well served by a 2400 px file, then compressed.",
      },
      {
        question: "Does resizing change the file format?",
        answer:
          "No. The output keeps the source format unless you choose another one. Convert separately if you need WebP or JPEG.",
      },
    ],
  },

  "us-income-tax-calculator": {
    markdown: `## How the US brackets actually work

The United States uses marginal brackets, which means only the income inside each band is taxed at that band's rate. Moving into a higher bracket never reduces your take-home pay; it only means the dollars above the threshold are taxed more. This is the single most misunderstood part of federal tax, and it is why a raise can feel smaller than expected but can never cost you money.

For a single filer in 2025, the brackets start at 10 percent on the first 11,925 dollars of taxable income, rise to 12 percent up to 48,475, then 22 percent up to 103,350, and continue upward through 24, 32, 35 and 37 percent. Married couples filing jointly get roughly double the band widths.

## A worked example

Take a single filer with 75,000 dollars of gross income and the 2025 standard deduction of 15,000 dollars. Taxable income is 60,000 dollars.

- 10 percent on the first 11,925 dollars: 1,192.50
- 12 percent on the next 36,550 dollars: 4,386.00
- 22 percent on the remaining 11,525 dollars: 2,535.50
- Total federal income tax: 8,114.00

The effective rate is 8,114 divided by 75,000, or about 10.8 percent. The marginal rate is 22 percent, because that is the band the last dollar falls into. Both numbers are correct and they answer different questions: the marginal rate helps you plan the next dollar of income, while the effective rate tells you what share of your salary goes to federal tax.

## What this calculator leaves out

It estimates federal income tax only. It does not include state income tax, which ranges from none in Texas and Florida to over 13 percent in California, nor FICA payroll taxes, which add 7.65 percent for most employees. It also ignores credits such as the child tax credit, pre-tax deductions like a 401(k) or health insurance, and investment income taxed at capital gains rates.

That makes it a planning tool, not a filing tool. Use it to sanity-check a salary offer, estimate a quarterly payment, or see how a bonus moves you between bands. For take-home pay after payroll taxes, use the paycheck calculator, and for self-employment, remember that you also owe the employer half of FICA. Tax rules change; confirm final figures with the IRS instructions for the year you are filing.`,
    faqs: [
      {
        question: "Does a raise ever leave me with less take-home pay?",
        answer:
          "No, not from federal brackets. Only income above each threshold is taxed at the higher rate, so every extra dollar adds to your after-tax income. Benefit cliffs and credits can behave differently, but the brackets themselves cannot reduce your pay.",
      },
      {
        question: "Should I use the standard deduction or itemize?",
        answer:
          "Use whichever is larger. The 2025 standard deduction is 15,000 dollars for single filers and 30,000 dollars for married filing jointly, so itemizing only helps if mortgage interest, state taxes and charitable gifts together exceed that amount.",
      },
      {
        question: "Why is my actual tax bill different from the estimate?",
        answer:
          "The estimate covers federal income tax only. Withholding, credits, state tax, payroll tax, retirement contributions and investment income all move the final number, and the calculator does not model any of them.",
      },
      {
        question: "Does this include self-employment tax?",
        answer:
          "No. Self-employed people pay both halves of Social Security and Medicare, about 15.3 percent on net earnings up to the annual cap, on top of income tax. Use the self-employment tax calculator for that portion.",
      },
    ],
  },

  "uk-income-tax-calculator": {
    markdown: `## The personal allowance is the starting point

For 2025/26, most people in England, Wales and Northern Ireland can earn 12,570 pounds before paying any income tax. Above that, the basic rate of 20 percent applies to the next 37,700 pounds of taxable income, the higher rate of 40 percent applies above that, and the additional rate of 45 percent starts at 125,140 pounds.

The allowance is not fixed for higher earners. For every 2 pounds of income above 100,000 pounds, the allowance drops by 1 pound, and it disappears completely at 125,140 pounds. That creates a narrow band where the effective marginal rate is 60 percent: 40 percent on the income itself plus the tax on the allowance being withdrawn.

## A worked example

Someone earning 60,000 pounds gets the full 12,570 pound allowance, leaving 47,430 pounds of taxable income.

- 20 percent on the first 37,700 pounds: 7,540 pounds
- 40 percent on the remaining 9,730 pounds: 3,892 pounds
- Total income tax: 11,432 pounds

The effective rate is about 19 percent of gross salary, while the marginal rate is 40 percent. The gap surprises people: earning more does push you into the higher rate, but the higher rate only applies to the slice above the basic-rate limit.

## National Insurance is separate

This calculator shows income tax only. Employee National Insurance is charged at 8 percent on earnings between the primary threshold and the upper earnings limit, then 2 percent above that. It is not part of income tax, it is not reduced by the personal allowance, and it is not included here. Add it separately if you want a take-home figure.

## Scotland and Wales

Scotland has its own income tax bands, including a starter rate and different thresholds, so the figures above do not apply to Scottish taxpayers. Wales uses the same bands as England for 2025/26, but rates are set by the Welsh Parliament, so check before relying on them for a payroll calculation.

## What the calculator is good for

Use it to compare job offers, estimate the tax on a bonus, understand why a pay rise feels smaller than the headline number, or plan pension contributions. Contributing to a workplace pension reduces taxable income, which is why salary sacrifice can be efficient for someone in the 60 percent band. It is not a substitute for a payslip or Self Assessment return, and thresholds can change at a Budget.`,
    faqs: [
      {
        question: "Why is the effective tax rate lower than my marginal rate?",
        answer:
          "Because only income above each threshold is taxed at the higher rate. The effective rate divides total tax by total income, while the marginal rate applies to your last pound of income.",
      },
      {
        question: "What happens to my tax-free allowance above 100,000 pounds?",
        answer:
          "It falls by 1 pound for every 2 pounds earned above 100,000 pounds and reaches zero at 125,140 pounds. In that range the marginal rate works out at 60 percent on income tax alone.",
      },
      {
        question: "Does this calculator include National Insurance?",
        answer:
          "No. It shows income tax only. National Insurance is calculated separately at 8 percent on most earnings between the thresholds, then 2 percent above the upper limit.",
      },
      {
        question: "Do the same bands apply in Scotland?",
        answer:
          "No. Scotland has its own starter, basic, intermediate, higher and top rates with different thresholds. This calculator covers England, Wales and Northern Ireland.",
      },
    ],
  },

  "gst-calculator": {
    markdown: `## Forward and reverse GST

GST is calculated in one of two directions and mixing them up is the most common source of invoice errors.

Forward calculation starts with a price before tax and adds GST. For an amount of 10,000 rupees at 18 percent, the tax is 1,800 rupees and the invoice total is 11,800 rupees. Reverse calculation starts with a total that already includes tax and extracts the base price. The same 11,800 rupees divided by 1.18 gives a base of 10,000 rupees and GST of 1,800. Subtracting 18 percent from 11,800 instead would give 9,676, which is wrong because the tax is levied on the base, not on the final amount.

## CGST, SGST and IGST

For a sale inside one state, the GST is split equally between central and state governments: 18 percent becomes 9 percent CGST plus 9 percent SGST. For a sale across state lines, a single IGST of 18 percent applies instead. The total tax is identical; only the destination of the money changes.

This matters on invoices because the wrong split can make an input tax credit unclaimable. If you are registered in Maharashtra and sell to a buyer in Karnataka, the invoice should carry IGST, not CGST and SGST. If the buyer takes the goods themselves and the sale is treated as intra-state, the split applies.

## Rates and common categories

The main GST slabs are 0, 5, 12, 18 and 28 percent. Most services sit at 18 percent, many packaged foods and essentials at 5 percent, and luxury or sin goods at 28 percent plus compensation cess. Exempt goods carry no GST but also give no input credit, which is why businesses sometimes prefer a taxable rate.

| Scenario | Rate | Split |
| --- | --- | --- |
| Local sale of goods | 18% | 9% CGST + 9% SGST |
| Inter-state sale of goods | 18% | 18% IGST |
| Restaurant service | 5% | 2.5% CGST + 2.5% SGST |
| Exempt essentials | 0% | No tax, no credit |

## Rounding and records

GST is usually rounded to the nearest rupee on the invoice, and small differences between line-level and invoice-level rounding are normal. Keep the calculator output with the invoice so the tax component can be matched later. For a business filing regularly, a spreadsheet or accounting package will be more reliable than manual entry, but the calculator is useful for quoting a price, checking a supplier invoice, or understanding why a bill total does not match the listed rate.`,
    faqs: [
      {
        question: "How do I remove GST from a total that already includes it?",
        answer:
          "Divide the total by 1 plus the rate. For 18 percent, divide by 1.18. Subtracting 18 percent from the total gives the wrong base because the tax was calculated on the pre-tax amount.",
      },
      {
        question: "When should I charge IGST instead of CGST and SGST?",
        answer:
          "IGST applies to inter-state supplies, where the supplier and place of supply are in different states. Intra-state supplies use CGST plus SGST in equal halves.",
      },
      {
        question: "Is the total tax different under IGST?",
        answer:
          "No. An 18 percent supply carries 18 percent either way. The split only decides how the revenue is shared between central and state governments.",
      },
      {
        question: "Can I use this calculator for a GST return?",
        answer:
          "It is fine for checking individual invoices and quotes, but returns need invoice-level records, input credit reconciliation and filing rules. Use accounting software for the actual return.",
      },
    ],
  },

  "emi-calculator": {
    markdown: `## What an EMI is made of

An equated monthly installment is a fixed payment that covers both interest and principal. The bank first takes the month's interest on the outstanding balance and puts the rest toward principal. Because the balance falls slowly at first, the interest share is high in the early years and the principal share grows over time.

The formula is EMI = P x r x (1 + r)^n / ((1 + r)^n - 1), where P is the loan amount, r is the monthly interest rate (annual rate divided by 12) and n is the number of months. You do not need to compute it by hand, but understanding the inputs explains why small changes have large effects.

## A worked example

On a loan of 25 lakh rupees at 8.5 percent for 20 years, the EMI is about 21,700 rupees. Multiply by 240 months and you pay about 52.07 lakh in total, of which roughly 27 lakh is interest, slightly more than the amount borrowed.

After five years you have paid about 13 lakh, but you still owe around 22 lakh. That is not a bank error: most of each early installment went to interest. The crossover, where principal starts to exceed interest within a single payment, usually happens around the middle of the tenure.

## Tenure is the biggest lever

Stretching a loan lowers the monthly payment but raises the total cost. The same 25 lakh at 8.5 percent over 10 years costs about 31,000 rupees a month and roughly 12 lakh in interest. Over 20 years the monthly burden halves, but the interest more than doubles.

That trade-off is why the right tenure depends on cash flow rather than on the lowest possible EMI. If the payment fits comfortably, a shorter tenure saves a large amount. If it does not, a longer tenure prevents default, and you can recover some of the cost by prepaying later.

## Prepayment and the amortization schedule

A prepayment goes entirely to principal, so it removes all the future interest that principal would have generated. Prepaying early is far more valuable than prepaying near the end, when little interest remains. Many floating-rate loans allow free prepayment after a few years; fixed-rate loans may charge a penalty, so check the terms.

Use the schedule to see exactly how much of each payment is interest before you decide. If you are comparing offers, run each one with the same amount and tenure and compare total interest, not just the EMI, because a slightly lower EMI can hide a much longer repayment.`,
    faqs: [
      {
        question: "Does a longer tenure reduce the total cost of the loan?",
        answer:
          "No. It reduces the monthly payment but increases total interest, because you owe the balance for longer. A shorter tenure costs more each month and less overall.",
      },
      {
        question: "How much does prepaying early save?",
        answer:
          "Prepayment removes the interest that the repaid principal would have earned over the remaining term, so the saving is largest in the early years. Use the amortization schedule to see the remaining interest before you prepay.",
      },
      {
        question: "Why does my loan balance fall so slowly at first?",
        answer:
          "Interest is charged on the outstanding balance, which is highest at the start. In the early months most of the EMI covers interest, leaving only a small amount for principal.",
      },
      {
        question: "Can I use this for a car or personal loan?",
        answer:
          "Yes. The formula is the same for any fixed-rate installment loan. Enter the amount, rate and tenure, and compare the total interest rather than only the monthly figure.",
      },
    ],
  },

  "resume-builder": {
    markdown: `## What an ATS actually reads

An applicant tracking system parses your resume into fields: name, contact details, employers, dates, job titles, education and skills. It does not judge design. It fails when it cannot tell which text is a heading, when dates are in a graphic, or when contact details sit inside a text box or header that the parser skips.

That is why plain structure beats decoration. Use standard section names such as Experience, Education and Skills. Put dates in a consistent format, for example "Jan 2022 - Present". Keep the file as a single column with real text, not an image of text. Tables and multi-column layouts are the most common reason a well-designed resume arrives in the system with the employer names scrambled.

## A structure that survives both bots and humans

- Contact block: name, city, phone, email, LinkedIn. No photo for most private-sector roles.
- Summary: two or three lines naming your role, years of experience and one measurable strength.
- Experience: reverse chronological, each role with three to five bullets.
- Education: degree, institution, year.
- Skills: the tools and technologies named in the job description.

Write bullets that start with a verb and end with a number: "Cut invoice processing time by 30 percent by automating reconciliation in Excel" is stronger than "Responsible for invoices". Recruiters scan for outcomes, and the parser scores keyword matches, so mirror the language of the posting without inventing experience.

## Length and formatting rules

One page is right for most candidates with under about eight years of experience; two pages are acceptable for senior or technical roles with a long project history. Use a single readable font at 10 to 12 points, consistent bullet indentation, and enough white space that the page does not look like a wall. Avoid headers and footers for contact details, because some parsers ignore them.

## Before you submit

Export to PDF unless the portal explicitly asks for DOCX; PDF keeps the layout intact on any device. Open the exported file on a phone and check that no line is cut off. Then paste the text into a plain text editor: if the order is jumbled or the headings disappear, the ATS will see the same mess. Check the job description for exact keywords, and make sure your most relevant experience appears in the top third of page one, because that is what a recruiter sees first. Run the finished file through the [resume analyzer](/tools/resume-analyzer) for a second opinion.`,
    faqs: [
      {
        question: "Should I send my resume as PDF or Word?",
        answer:
          "Send PDF unless the employer asks for DOCX. PDF preserves the layout everywhere. Keep a DOCX copy ready for portals that parse Word files more reliably.",
      },
      {
        question: "How long should a resume be?",
        answer:
          "One page for most candidates with under eight years of experience. Two pages are fine for senior roles where projects and leadership need space. Never pad it to fill a page.",
      },
      {
        question: "Should I include a photo and personal details?",
        answer:
          "For most private-sector applications, no. Modern ATS screens and international recruiters expect skills and experience, and photos can create bias or parsing problems. Follow local norms only where they are clearly expected.",
      },
      {
        question: "Why did my resume disappear in the ATS?",
        answer:
          "Usually because key details were in a text box, table, header or image. Rebuild it as a single-column document with standard headings and plain text, then test by pasting it into a text editor.",
      },
    ],
  },

  "json-formatter": {
    markdown: `## JSON in one paragraph

JSON stores data as keys and values. Objects use curly braces, arrays use square brackets, strings use double quotes, and values can be strings, numbers, true, false, null, objects or arrays. It is the default format for API responses, configuration files and data exports because it is compact and every language can parse it.

Formatting, sometimes called beautifying, adds indentation and line breaks. It does not change the data. The same object can be written on one line or across twenty, and a parser sees no difference. Minifying does the reverse: it strips whitespace to make the payload smaller for transport.

## The errors that break almost every JSON file

| Symptom | Cause | Fix |
| --- | --- | --- |
| Unexpected token | Trailing comma after the last item | Remove the final comma |
| Unexpected token | Single quotes around keys or values | Use double quotes |
| Unexpected token | Unquoted key | Wrap the key in double quotes |
| Unexpected end of input | Missing closing brace or bracket | Add the missing delimiter |
| Comment not allowed | // or /* */ comment in the file | Remove comments; JSON has none |

Copying from JavaScript is a frequent source of trouble, because JavaScript allows trailing commas, single quotes and comments while JSON does not. Copying from a document editor can also insert curly quotation marks, which look like quotes but are a different character.

## Reading an API response

When an API returns a wall of minified text, format it first, then collapse the top-level object to find the field you need. Large arrays are easier to inspect one item at a time, so copy a single object into a second tab rather than scrolling through thousands of records.

Validate as well as format. A formatter that only indents will happily indent broken JSON and leave you guessing. The related [JSON validator](/tools/json-validator) points at the exact line and character where parsing fails, which is much faster than eyeballing brackets.

## Size and privacy

Minified JSON is smaller and faster to send; formatted JSON is better for reading, logs and code review. Choose based on whether a machine or a person will read it next. Because formatting runs in your browser, tokens, customer records and internal configuration never leave your machine, which matters when the payload contains credentials. Remove secrets before pasting anything into a shared document, even a local tool.`,
    faqs: [
      {
        question: "Does formatting JSON change the data?",
        answer:
          "No. It only adds indentation and line breaks. Key order, values and types are unchanged, and a parser reads both versions identically.",
      },
      {
        question: "Why does JSON not allow comments?",
        answer:
          "The JSON specification has no comment syntax. Tools that accept comments are using a relaxed variant such as JSON5 or JSONC. Standard parsers reject them, so remove comments before sending data to an API.",
      },
      {
        question: "Can the formatter fix invalid JSON?",
        answer:
          "No. It can only format input that parses. For broken files, use a validator to find the exact line and character, fix the syntax, then format.",
      },
      {
        question: "Is my JSON uploaded anywhere?",
        answer:
          "No. Formatting and validation run locally in your browser, so the content stays on your device even when it contains tokens or customer data.",
      },
    ],
  },
};
