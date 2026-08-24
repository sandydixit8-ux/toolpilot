import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const posts = [
  {
    title: "How to Compress PDF Files for Email (Step-by-Step Guide)",
    slug: "how-to-compress-pdf-for-email",
    excerpt: "Learn how to compress PDF files before sending them via email. Reduce file size without losing quality using free tools.",
    content: `# How to Compress PDF Files for Email

Most email providers limit attachments to 25MB. Here's how to compress your PDFs to stay under the limit.

## Why Compress PDFs for Email?

- Gmail, Outlook, Yahoo all cap attachments at 25MB
- Large PDFs slow down downloads for recipients
- Compressed PDFs load faster on mobile devices

## Method 1: ToolPilot PDF Compressor

1. Go to [PDF Compressor](/tools/pdf-compressor)
2. Upload your PDF (drag & drop or click)
3. Choose compression level:
   - **High compression** — smallest file, slight quality loss
   - **Balanced** — good compromise
   - **Low compression** — minimal quality change
4. Download compressed PDF

## Method 2: Reduce PDF Size Manually

- **Remove images** — if images aren't essential, strip them
- **Lower image resolution** — 150 DPI is enough for screen viewing
- **Delete unused pages** — use [PDF Splitter](/tools/pdf-splitter) to extract only needed pages
- **Flatten layers** — merge all layers into one

## Compression Results

| Original Size | High Compressed | Balanced | Low Compressed |
|---------------|-----------------|----------|----------------|
| 10 MB | 1.5 MB | 3 MB | 6 MB |
| 25 MB | 3.5 MB | 7 MB | 14 MB |
| 50 MB | 7 MB | 14 MB | 28 MB |

## Tips

- Always check the compressed PDF before sending
- For legal documents, use low compression to preserve quality
- Consider using [PDF to Word](/tools/pdf-to-word) to extract text, then re-save as PDF

## Conclusion

Use ToolPilot's [PDF Compressor](/tools/pdf-compressor) to reduce file sizes instantly in your browser — no upload to servers required.`,
    author: "ToolPilot Team",
    seoTitle: "How to Compress PDF Files for Email | Free Tool | ToolPilot",
    seoDescription: "Learn how to compress PDF files before sending via email. Free online tool reduces file size without losing quality.",
    status: "PUBLISHED" as const,
  },
  {
    title: "Resume ATS Checker: How to Pass Applicant Tracking Systems",
    slug: "resume-ats-checker-guide",
    excerpt: "Learn how Applicant Tracking Systems work and how to optimize your resume to pass ATS screening with our free checker tool.",
    content: `# Resume ATS Checker: How to Pass Applicant Tracking Systems

Over 75% of resumes are rejected by ATS before a human ever sees them. Here's how to make sure yours gets through.

## What is an ATS?

An Applicant Tracking System (ATS) is software that:
- Scans resumes for keywords
- Filters candidates based on qualifications
- Ranks applicants by relevance
- Stores resumes in a database

Popular ATS tools: Taleo, Greenhouse, Lever, Workday, iCIMS.

## Common ATS Rejection Reasons

| Issue | Why It Fails |
|-------|-------------|
| Fancy formatting | ATS can't read tables, columns, text boxes |
| Missing keywords | No match against job description |
| Wrong file format | .doc or .pages may not parse correctly |
| Headers/footers | Content in these areas is often ignored |
| Images/graphics | ATS reads text only |

## How to Pass ATS Screening

### 1. Use Standard Formatting
- Single-column layout
- Standard fonts (Arial, Calibri, Times New Roman)
- No tables, text boxes, or columns
- Simple bullet points (• or -)

### 2. Match Keywords from the Job Description
- Read the job posting carefully
- Include exact phrases from the requirements
- Use both acronyms and full terms (e.g., "Search Engine Optimization (SEO)")

### 3. Use the Right File Format
- PDF (if the ATS supports it) or .docx
- Test with ToolPilot's [Resume ATS Checker](/tools/resume-ats-checker)

### 4. Structure Properly
- Clear section headers: "Experience", "Education", "Skills"
- Reverse chronological order
- Consistent date formatting

## Using ToolPilot's ATS Checker

Our [Resume ATS Checker](/tools/resume-ats-checker) analyzes your resume for:
- Formatting issues
- Missing keywords
- ATS compatibility score
- Improvement suggestions

### Steps:
1. Paste your resume text or upload file
2. Optionally paste the job description
3. Get your ATS score and recommendations
4. Fix issues and re-check

## ATS-Friendly Resume Template

\`\`\`
[Full Name]
[Email] | [Phone] | [LinkedIn] | [Location]

PROFESSIONAL SUMMARY
[2-3 sentences with keywords from job description]

EXPERIENCE
Job Title | Company | Dates
- Achievement with quantifiable result
- Achievement with quantifiable result

EDUCATION
Degree | University | Year

SKILLS
Skill 1, Skill 2, Skill 3, Skill 4, Skill 5
\`\`\`

## Conclusion

Before submitting your next application, run your resume through ToolPilot's [Resume ATS Checker](/tools/resume-ats-checker) to make sure it passes the first gate.`,
    author: "ToolPilot Team",
    seoTitle: "Resume ATS Checker: How to Pass Applicant Tracking Systems | ToolPilot",
    seoDescription: "Learn how ATS systems work and optimize your resume with our free Resume ATS Checker tool. Get past the first screening.",
    status: "PUBLISHED" as const,
  },
  {
    title: "How to Create Invoices Online: A Complete Guide for Small Business",
    slug: "how-to-create-invoices-online",
    excerpt: "Learn how to create professional invoices online for free. Includes GST invoice format, payment terms, and best practices.",
    content: `# How to Create Invoices Online: A Complete Guide for Small Business

Professional invoicing gets you paid faster. Here's everything you need to know about creating invoices that look great and get results.

## What Should an Invoice Include?

| Element | Why It Matters |
|---------|---------------|
| Your business name & address | Identifies who is billing |
| Client name & address | Identifies who is being billed |
| Invoice number | For tracking and reference |
| Invoice date | When the invoice was issued |
| Due date | When payment is expected |
| Line items with rates | What you're charging for |
| Subtotal | Amount before tax |
| Tax (GST if applicable) | Mandatory tax calculation |
| Total amount due | Final amount to pay |
| Payment terms | How to pay you |

## Create Invoices Free with ToolPilot

ToolPilot offers two invoice generators:

### 1. Standard Invoice Generator
- [Invoice Generator](/tools/invoice-generator) — simple, clean invoices
- Add company details, line items, taxes
- Download as PDF

### 2. GST Invoice Generator
- [GST Invoice Generator](/tools/gst-invoice-generator) — GST-compliant invoices
- Auto-calculates CGST, SGST, or IGST
- Mandatory GST fields included

### Steps:
1. Enter your business details
2. Add client information
3. Add line items (description, quantity, rate)
4. Select tax rate (0%, 5%, 12%, 18%, 28%)
5. Preview and download as PDF

## Invoice Best Practices

### Payment Terms
- **Net 15** — payment due in 15 days (best for freelancers)
- **Net 30** — payment due in 30 days (standard for businesses)
- **Due on receipt** — payment expected immediately
- **50% upfront** — for large projects

### Follow Up
1. Send invoice immediately after completing work
2. Send reminder 3 days before due date
3. Follow up on day 1 of overdue
4. Send final notice at 7 days overdue

### Organize
- Use sequential invoice numbers (INV-001, INV-002...)
- Keep copies of all sent invoices
- Track payment status regularly

## GST Invoice Requirements (India)

For businesses registered under GST:
- GSTIN of supplier
- GSTIN of recipient (for B2B)
- HSN/SAC code for goods/services
- Place of supply
- Rate and amount of tax
- Signature

Use ToolPilot's [GST Invoice Generator](/tools/gst-invoice-generator) to auto-fill all these fields.

## Conclusion

Professional invoicing is essential for getting paid on time. Use ToolPilot's free [Invoice Generator](/tools/invoice-generator) or [GST Invoice Generator](/tools/gst-invoice-generator) to create polished invoices in seconds.`,
    author: "ToolPilot Team",
    seoTitle: "How to Create Invoices Online: Complete Guide | ToolPilot",
    seoDescription: "Learn how to create professional invoices online for free. Includes GST format, payment terms, and best practices for small business.",
    status: "PUBLISHED" as const,
  },
  {
    title: "Image Optimization for Web: Complete Guide to Faster Websites",
    slug: "image-optimization-for-web-guide",
    excerpt: "Learn how to optimize images for faster websites. Covers compression, formats (WebP, AVIF), lazy loading, and free tools.",
    content: `# Image Optimization for Web: Complete Guide to Faster Websites

Images account for 50%+ of website page weight. Optimizing them is the fastest way to improve load times and SEO.

## Why Image Optimization Matters

- **Page speed** — Google uses Core Web Vitals for ranking
- **User experience** — 53% of users leave after 3 seconds
- **SEO** — Faster sites rank higher
- **Bandwidth** — Saves hosting costs
- **Mobile** — Most web traffic is mobile

## Image Formats Comparison

| Format | Best For | Transparency | Animation | Compression |
|--------|----------|-------------|-----------|-------------|
| JPG | Photos | No | No | Lossy |
| PNG | Graphics, logos | Yes | No | Lossless |
| WebP | Everything | Yes | Yes | Both |
| SVG | Icons, illustrations | Yes | Yes | N/A |
| AVIF | Next-gen photos | Yes | Yes | Better than WebP |

**Recommendation:** Use WebP for most images, PNG for logos with transparency, SVG for icons.

## Optimization Techniques

### 1. Compress Images
Use ToolPilot's [Image Compressor](/tools/image-compressor):
- Upload your image
- Choose quality level (70-80% is usually fine)
- Download compressed version

### 2. Resize to Actual Display Size
If your content area is 800px wide, don't serve a 4000px image:
- Use [Image Resizer](/tools/image-resizer) to match display dimensions
- This alone can reduce file size by 70%+

### 3. Convert to WebP
- [WebP Converter](/tools/webp-converter) — convert JPG/PNG to WebP
- WebP files are 25-35% smaller than JPG
- Supported by all modern browsers

### 4. Lazy Loading
Load images only when they enter the viewport:
\`\`\`html
<img src="photo.webp" loading="lazy" alt="description" width="800" height="600" />
\`\`\`

### 5. Use Responsive Images
Serve different sizes for different devices:
\`\`\`html
<img srcset="small.webp 480w, medium.webp 800w, large.webp 1200w" sizes="(max-width: 600px) 480px, 800px" src="medium.webp" alt="description" />
\`\`\`

## Image Optimization Checklist

- [ ] Compress all images before uploading
- [ ] Resize to maximum display size
- [ ] Convert to WebP format
- [ ] Add descriptive alt text
- [ ] Add width and height attributes
- [ ] Enable lazy loading
- [ ] Use a CDN for image delivery

## ToolPilot Image Tools

| Tool | Purpose |
|------|---------|
| [Image Compressor](/tools/image-compressor) | Reduce file size |
| [Image Resizer](/tools/image-resizer) | Change dimensions |
| [WebP Converter](/tools/webp-converter) | Convert to WebP |
| [Image Cropper](/tools/image-cropper) | Crop to focus area |
| [Image Quality Optimizer](/tools/image-quality-optimizer) | Balance quality and size |

## Conclusion

Start by compressing your largest images — that alone can cut page load time in half. Use ToolPilot's free [image tools](/tools/image) to optimize every image on your site.`,
    author: "ToolPilot Team",
    seoTitle: "Image Optimization for Web: Complete Guide | ToolPilot",
    seoDescription: "Learn how to optimize images for faster websites. Covers compression, WebP format, lazy loading, and free optimization tools.",
    status: "PUBLISHED" as const,
  },
  {
    title: "EMI Calculator: How to Calculate Loan EMI Before You Borrow",
    slug: "emi-calculator-guide",
    excerpt: "Learn how to calculate EMI for home loans, car loans, and personal loans. Understand amortization schedules and save lakhs in interest.",
    content: `# EMI Calculator: How to Calculate Loan EMI Before You Borrow

Before taking any loan, understanding your EMI helps you plan finances better. Here's how EMI works and how to calculate it.

## What is EMI?

EMI (Equated Monthly Installment) is the fixed monthly payment you make to repay a loan over a set period. It includes:
- **Principal** — the original loan amount
- **Interest** — the cost of borrowing

## EMI Formula

**EMI = P × r × (1+r)^n / ((1+r)^n - 1)**

Where:
- P = Principal loan amount
- r = Monthly interest rate (annual rate / 12)
- n = Number of monthly installments

### Example:
- Loan: ₹50,00,000 (home loan)
- Interest Rate: 8.5% per year
- Tenure: 20 years (240 months)
- Monthly rate: 0.085/12 = 0.007083
- **EMI = ₹43,391/month**

## EMI Comparison by Loan Type

| Loan Type | Typical Rate | ₹50L for 20yr EMI | Total Interest |
|-----------|-------------|-------------------|----------------|
| Home Loan | 8.5% | ₹43,391 | ₹54.14L |
| Car Loan | 9.0% | ₹44,986 | ₹57.97L |
| Personal Loan | 12.0% | ₹55,051 | ₹82.12L |
| Education Loan | 9.5% | ₹46,061 | ₹60.55L |

**Key insight:** A 1% difference in interest rate can cost you ₹5-10 lakhs over 20 years!

## How to Use ToolPilot's EMI Calculator

1. Go to [EMI Calculator](/tools/emi-calculator)
2. Enter loan amount
3. Enter interest rate
4. Select loan tenure
5. View EMI amount + full amortization schedule

### What You Get:
- Monthly EMI amount
- Total interest payable
- Total amount payable
- Year-by-year amortization table
- Principal vs interest breakdown

## Tips to Reduce Your EMI

### 1. Make a Larger Down Payment
- Paying 20% instead of 10% down reduces EMI significantly
- You also pay less total interest

### 2. Choose a Shorter Tenure
| Tenure | EMI (₹50L @ 8.5%) | Total Interest |
|--------|-------------------|----------------|
| 10 years | ₹61,959 | ₹24.35L |
| 15 years | ₹49,234 | ₹38.62L |
| 20 years | ₹43,391 | ₹54.14L |
| 30 years | ₹38,447 | ₹88.41L |

Shorter tenure = higher EMI but massive interest savings.

### 3. Negotiate Your Interest Rate
- Compare offers from multiple lenders
- Good credit score (750+) gets better rates
- Existing customers may get discounts

### 4. Prepay When Possible
- Even ₹50,000 extra per year can save lakhs
- Check for prepayment penalties first

## When to Refinance

Consider refinancing if:
- Your current rate is 1%+ higher than market rates
- You have a good credit score now
- Prepayment penalty is low or waived

## Conclusion

Use ToolPilot's [EMI Calculator](/tools/emi-calculator) to compare loan options before you borrow. Understanding your EMI helps you make smarter financial decisions.`,
    author: "ToolPilot Team",
    seoTitle: "EMI Calculator Guide: How to Calculate Loan EMI | ToolPilot",
    seoDescription: "Learn how to calculate EMI for home, car, and personal loans. Compare rates, understand amortization, and save lakhs in interest.",
    status: "PUBLISHED" as const,
  },
];

async function main() {
  for (const post of posts) {
    const existing = await prisma.blogPost.findUnique({ where: { slug: post.slug } });
    if (existing) {
      console.log(`Skip (exists): ${post.slug}`);
      continue;
    }
    const created = await prisma.blogPost.create({
      data: { ...post, publishedAt: new Date() },
    });
    console.log(`Created: ${created.title}`);
  }
  await prisma.$disconnect();
}

main().catch((e) => { console.error(e); process.exit(1); });
