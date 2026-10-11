import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const posts = [
  {
    title: "How to Calculate GST in India: CGST, SGST & IGST Explained (Free Calculator)",
    slug: "how-to-calculate-gst-2026",
    excerpt:
      "GST is calculated at 0%, 5%, 12%, 18% or 28%. Learn the forward and reverse formulas with examples, the CGST-SGST split, and a free GST calculator.",
    categorySlug: "calculators",
    categoryName: "Calculators",
    content: `## What Is GST and How Is It Calculated?

GST (Goods and Services Tax) is an indirect tax added to almost every product and service in India. You calculate it as a **percentage of the base price**, using one of five rates: 0%, 5%, 12%, 18%, or 28%.

The [GST Calculator](/tools/gst-calculator) does the math instantly, but knowing the formula helps you understand your invoices and check whether you are being charged correctly.

## The Two Ways GST Is Calculated

**Forward calculation (add GST to a base amount)**

GST = Base amount × GST rate

If a product costs ₹1,000 and attracts 18% GST:
- GST = 1,000 × 18% = ₹180
- Final price = ₹1,180

**Reverse calculation (remove GST from a bill total)**

Base amount = Total ÷ (1 + GST rate)

If you paid ₹1,180 total and the GST rate is 18%:
- Base = 1,180 ÷ 1.18 = ₹1,000
- GST inside the bill = ₹180

The reverse mode is useful when you are reimbursing expenses or working out taxable value from a receipt.

## CGST, SGST, and IGST: The Split

GST is divided based on where the transaction happens:

| Transaction | Tax split | Example |
| --- | --- | --- |
| Within the same state | Half to Central (CGST), half to State (SGST) | Delhi to Delhi: 9% CGST + 9% SGST = 18% |
| Between different states | Full amount as IGST | Delhi to Mumbai: 18% IGST |
| Import / export | IGST applies | Imported goods: IGST |

So at 18% within your own state, the tax is printed on the invoice as **9% CGST + 9% SGST**, not one 18% line. The [GST Invoice Generator](/tools/gst-invoice-generator) fills in this split automatically for you.

## GST Rates You Will Actually See

| Category | GST rate |
| --- | --- |
| Essential food items | 0% |
| Packaged foods, some services | 5% |
| Processed foods, computers | 12% |
| Electronics, furniture, most services | 18% |
| Luxury goods, cars, tobacco | 28% |

## Step-by-Step: Calculate GST on Any Product

1. Find the base price (before tax) or the bill total (after tax).
2. Pick the right GST rate for the product category.
3. Use forward or reverse math from above.
4. Split the central tax into CGST and SGST (half each) for same-state sales.
5. Cross-check with the free [GST Calculator](/tools/gst-calculator).

## Common GST Mistakes to Avoid

- **Adding 18% on an amount that already includes GST** — you must divide, not multiply, to get the base.
- **Forgetting the CGST/SGST split on invoices** — it is mandatory on same-state invoices.
- **Rounding each tax line separately** — GST rounds per item, keep the GST amount as a single sum, then split.
- **Using the wrong rate** — hotels, cabs, and AC restaurants each have different effective rates.

For business owners, pair the calculator with the [Invoice Generator](/tools/invoice-generator) to produce clean, GST-ready invoices and the [Profit Margin Calculator](/tools/profit-margin-calculator) to price products correctly before tax.

## FAQ

### Is GST always 18%?
No. GST has five slabs — 0%, 5%, 12%, 18%, and 28% — depending on the product or service.

### How do I remove GST from a total?
Divide the total by (1 + rate). For 18%, divide by 1.18 to get the base amount.

### What is the difference between CGST and SGST?
CGST goes to the central government and SGST to the state government. Both are charged only on same-state (intra-state) sales, each at half the total rate.

### Can I calculate GST without an online calculator?
Yes. Use base × rate to add GST, or total ÷ (1 + rate) to remove it. But the free [GST Calculator](/tools/gst-calculator) is faster and avoids rounding errors.

Use the [GST Calculator](/tools/gst-calculator) for any amount, rate, or direction — it runs instantly in your browser and is completely free.`,
    seoTitle: "How to Calculate GST in India: CGST, SGST & IGST Explained",
    seoDescription:
      "Learn how to calculate GST in India with forward and reverse formulas, CGST/SGST/IGST splits, GST rate slabs, and a free GST calculator.",
    status: "PUBLISHED" as const,
  },
  {
    title: "How to Compress Images for WhatsApp & Email Without Losing Quality",
    slug: "how-to-compress-images-for-whatsapp-email",
    excerpt:
      "Large photos hit WhatsApp and email limits. Learn how to compress and resize images without losing visible quality using free browser tools.",
    categorySlug: "guides",
    categoryName: "Guides",
    content: `## Why Your Images Need to Be Compressed

WhatsApp displays full-resolution photos but compresses them at send time, and email providers cap attachments at 25MB. Oversized images cause slow uploads, failed sends, and blurry results because the app compresses aggressively as a fallback.

Compressing in advance keeps control on your side: the file is small enough to send fast, and the quality is exactly where you want it.

## How Much Should You Compress?

| Use case | Recommended size |
| --- | --- |
| WhatsApp photo (single) | Under 1–2 MB |
| WhatsApp status / story | Under 500 KB |
| Email attachment | Under 2–3 MB |
| Website / blog image | Under 200 KB |

## Step-by-Step: Compress for WhatsApp & Email

1. Open the free [Image Compressor](/tools/image-compressor).
2. Upload your photos (you can batch several at once).
3. Choose **Balanced** compression (around 70–80% quality).
4. Download the compressed files and send.

For maximum savings, resize first to the size the recipient actually needs — see below.

## Resize First, Then Compress

Phone cameras shoot at 12MP and above, far larger than any chat needs. Resizing to a practical width gives the biggest size drop with zero visible loss.

| Where it is going | Best width |
| --- | --- |
| WhatsApp | 1280–1600 px |
| Email | 1280 px |
| Social media | 1080–1200 px |
| Website | 800–1200 px |

Use the [Image Resizer](/tools/image-resizer) to set the exact width, then compress the result.

## Convert to WebP for the Smallest Files

WebP is 25–35% smaller than JPEG at the same visual quality. If the recipient does not need an exact format, convert first with the [WebP Converter](/tools/webp-converter) — most phones and email apps open WebP files normally.

## Quick Checklist Before You Send

- [ ] Image is resized to a practical width
- [ ] Compressed with the [Image Compressor](/tools/image-compressor)
- [ ] Under 1–2 MB for WhatsApp, under 2–3 MB for email
- [ ] Fine-tuned with the [Image Quality Optimizer](/tools/image-quality-optimizer) if it still looks heavy

## FAQ

### Does compressing reduce image quality?
Only if you push quality below ~60%. At 70–80% quality, the size drops dramatically while the photo still looks sharp on a phone screen.

### Why is my WhatsApp photo coming out blurry?
WhatsApp re-compresses full-size photos. If you send a file that is already small (under 1 MB), WhatsApp sends it closer to its original quality.

### What is the best file size for email attachments?
Keep every attachment under 2–3 MB. Large attachments are rejected by many servers and slow down the recipient.

### Can I compress multiple images at once?
Yes. The [Image Compressor](/tools/image-compressor) accepts several images in one go, so you can batch-optimize before a WhatsApp broadcast or email send.

All the tools above run in your browser with no signup, no upload, and no size limits that matter — your photos never leave your device.`,
    seoTitle: "How to Compress Images for WhatsApp & Email Without Losing Quality",
    seoDescription:
      "Compress and resize images for WhatsApp and email attachments for free. Step-by-step guide with recommended sizes, quality tips, and browser tools.",
    status: "PUBLISHED" as const,
  },
  {
    title: "What Is Base64? How to Encode and Decode Text & Images (Free Tool)",
    slug: "what-is-base64-encode-decode-free-tool",
    excerpt:
      "Base64 turns binary data into safe text for emails, URLs, and JSON. Learn what it is, why it is used, and decode or encode instantly with a free tool.",
    categorySlug: "developer",
    categoryName: "Developer Tools",
    content: `## What Is Base64?

Base64 is an encoding that converts binary data (images, files, PDFs) into a **plain-text format** made of letters, numbers, and a few symbols: A–Z, a–z, 0–9, plus **+** and **/**. It exists because most network protocols and file formats (email, JSON, URLs) only safely carry text.

The name comes from the **64 characters** in its alphabet. Every 3 bytes of binary data become 4 Base64 characters, and padding **=** is added when data does not divide evenly by three.

## Why Developers Use Base64

- **Email attachments** — old email servers only carried 7-bit text, so attachments were Base64-encoded (this is what MIME does).
- **Embedding images in HTML/CSS** — a small image can be inlined as a data URI instead of a separate file:
  \`data:image/png;base64,iVBORw0KGgo...\`
- **JSON payloads** — binary data inside JSON must be text, so files are Base64-encoded before being sent.
- **JWT tokens** — the header and payload of a JWT are Base64-encoded JSON.

## Encode and Decode in Two Steps

1. Paste your text, or drop a file, into the [Base64 Encoder](/tools/base64-encoder).
2. Click encode — you get a Base64 string you can paste into email, JSON, or a URL.

To go the other way, paste the Base64 string into the [Base64 Decoder](/tools/base64-decoder) and decode it back to the original text or file.

## Base64 or URL encoding — which one?

Base64 is not the same as URL encoding:

| Encoding | Used for | Example |
| --- | --- | --- |
| Base64 | Binary to text (images, files) | dG9vbHBpbG90 |
| URL encoding | Special characters in a URL | hello world → hello%20world |

If your data contains spaces, &, or ? inside a link, use the [URL Encoder](/tools/url-encoder) instead of Base64.

## Base64 in APIs and JSON

Many APIs accept Base64-encoded files:

- **Images** — upload an avatar as a Base64 string inside a JSON body.
- **PDFs and documents** — send a Base64 file in a webhook payload.
- **Snippets** — encode small executable scripts for testing.

When you decode an API response, paste the string into the [Base64 Decoder](/tools/base64-decoder) to extract the original file. For cleaning up the surrounding JSON, format it first with the [JSON Formatter](/tools/json-formatter).

## FAQ

### Is Base64 encryption?
No. Base64 is encoding, not encryption. Anyone can decode it. It only changes how the data is represented, not its security.

### Does Base64 make data smaller?
No — it makes it about 33% larger (3 bytes become 4 characters).

### Why does a Base64 string end with =
The = sign is padding, added when the data length is not a multiple of 3. Not every Base64 string has it.

### I decoded a file and got a blank image. What went wrong?
The file may be corrupt, or you copied only part of the string. Decode the complete string; if it is an image, copy the full \`data:image/...;base64,...\` or the entire Base64 block.

Encode, decode, and verify your data with the free [Base64 Encoder](/tools/base64-encoder) and [Base64 Decoder](/tools/base64-decoder) — everything runs in your browser.`,
    seoTitle: "What Is Base64? How to Encode and Decode Text & Images",
    seoDescription:
      "Learn what Base64 is, why developers use it for emails, JSON, and images, and encode or decode instantly with free browser tools.",
    status: "PUBLISHED" as const,
  },
];

async function main() {
  for (const post of posts) {
    let category = await prisma.blogCategory.findUnique({ where: { slug: post.categorySlug } });
    if (!category) {
      category = await prisma.blogCategory.create({ data: { name: post.categoryName, slug: post.categorySlug } });
    }

    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: {
        title: post.title,
        content: post.content,
        excerpt: post.excerpt,
        seoTitle: post.seoTitle,
        seoDescription: post.seoDescription,
        status: "PUBLISHED",
        publishedAt: new Date(),
        author: "ToolPilot Team",
        categoryId: category.id,
      },
      create: {
        title: post.title,
        slug: post.slug,
        content: post.content,
        excerpt: post.excerpt,
        seoTitle: post.seoTitle,
        seoDescription: post.seoDescription,
        status: "PUBLISHED",
        publishedAt: new Date(),
        author: "ToolPilot Team",
        categoryId: category.id,
      },
    });
    console.log(`Upserted: ${post.title}`);
  }

  const total = await prisma.blogPost.count();
  console.log(`Total blog posts: ${total}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());