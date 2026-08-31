import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const posts = [
  {
    title: "How to Reduce PDF Size for Government Portal Upload",
    slug: "reduce-pdf-size-government-portal-upload",
    excerpt: "Government portals reject large PDFs. Here is how to compress any PDF under 1MB for Income Tax, EPFO, and passport uploads.",
    content: "Indian government portals are strict about file sizes. Income Tax filing limits attachments to 5MB, EPFO to 1MB, and passport applications to 50KB per photo.\n\n## Common Government Portal File Limits\n\n| Portal | File Limit | Common Issue |\n|--------|-----------|--------------|\n| Income Tax e-Filing | 5 MB | Scanned Form 16 too large |\n| EPFO Unified Portal | 1 MB | KYC documents rejected |\n| Passport Seva | 50-200 KB | Photo uploads fail |\n| NSDL/UTIITSL | 2 MB | Form 49A attachments |\n\n## How to Compress to Under 1MB\n\n1. Go to [PDF Compressor](/tools/pdf-compressor)\n2. Upload your PDF\n3. Choose High Compression\n4. Check output size\n\nIf still over 1MB:\n- Remove unnecessary pages with [PDF Splitter](/tools/pdf-splitter)\n- Extract only required pages with [PDF Page Extractor](/tools/pdf-page-extractor)\n\n## For Scanned Documents\n\nScanned PDFs are the biggest problem. Each page is an image. To compress:\n\n1. Use High Compression mode\n2. Remove unnecessary pages\n3. For very strict limits under 200KB, re-scan at lower quality\n\n## Tips\n\n- Compress first, then check file size\n- Remove cover pages and blank pages\n- Name files clearly\n- Test before deadline\n\nUse the free [PDF Compressor](/tools/pdf-compressor) to reduce your PDF size in seconds.",
    author: "ToolPilot Team",
    seoTitle: "Reduce PDF Size for Government Portal Upload | Free Tool",
    seoDescription: "Compress PDF under 1MB for government portals like Income Tax, EPFO, and Passport Seva. Free online tool.",
    status: "PUBLISHED" as const,
  },
  {
    title: "SIP vs Lump Sum: Which Investment Strategy Works Better in 2026",
    slug: "sip-vs-lump-sum-investment-strategy-2026",
    excerpt: "Should you invest monthly through SIP or put in a lump sum? Here is a data-backed comparison with examples for Indian investors.",
    content: "The biggest question for new investors: should you invest monthly (SIP) or invest everything at once (lump sum)?\n\n## What Is SIP?\n\nSIP lets you invest a fixed amount monthly in a mutual fund. You buy more units when prices are low and fewer when prices are high. This is called rupee cost averaging.\n\n## What Is Lump Sum?\n\nLump sum means investing a large amount at once. If the market goes up, you earn more. If it goes down, you lose more.\n\n## SIP vs Lump Sum\n\n| Factor | SIP | Lump Sum |\n|--------|-----|----------|\n| Risk | Lower | Higher |\n| Best for | Salaried individuals | Windfall amounts |\n| Discipline | Automatic monthly | One-time decision |\n| Bull market returns | Good | Better |\n| Bear market returns | Better | Worse |\n| Emotional stress | Low | High |\n\n## When SIP Wins\n\n- Volatile markets\n- Regular income from salary\n- New investors\n- Long-term goals (5+ years)\n\nExample: 5,000/month SIP for 10 years at 12% = 11.6 lakhs invested to 23.2 lakhs.\n\n## When Lump Sum Wins\n\n- Stable or rising markets\n- Large amounts available\n- Experienced investors\n\n## The Hybrid Approach\n\n1. SIP for regular income\n2. Lump sum for windfalls when markets correct\n\n## How to Start\n\n1. Go to [SIP Calculator](/tools/sip-calculator)\n2. Enter monthly amount\n3. Set return rate\n4. See projected value\n\n## Tips\n\n- Start early\n- Increase SIP annually\n- Stay invested during dips\n- Review once a year\n\nUse the free [SIP Calculator](/tools/sip-calculator) to plan your investments.",
    author: "ToolPilot Team",
    seoTitle: "SIP vs Lump Sum 2026: Which Is Better? | Free Calculator",
    seoDescription: "Compare SIP vs lump sum investment strategies. Data-backed analysis with examples and a free SIP calculator.",
    status: "PUBLISHED" as const,
  },
  {
    title: "How to Convert PDF to Word Without Losing Formatting",
    slug: "convert-pdf-to-word-edit-without-losing-formatting",
    excerpt: "Need to edit a PDF? Here is how to convert PDF to Word while preserving fonts, images, and formatting.",
    content: "PDFs are great for sharing but terrible for editing. Converting to Word is the fastest way to make changes.\n\n## Why Convert PDF to Word?\n\n- Edit text and fix typos\n- Update content in reports\n- Extract text that cannot be selected\n- Share editable versions with your team\n\n## How to Convert\n\n1. Go to [PDF to Word](/tools/pdf-to-word)\n2. Upload your PDF\n3. Wait for conversion\n4. Download your .docx file\n5. Edit in Word or Google Docs\n\n## Common Issues\n\n| Issue | Solution |\n|-------|----------|\n| Font changes | Install the same font |\n| Table misalignment | Adjust manually |\n| Missing text | Use OCR instead |\n| Formatting shift | Accept minor differences |\n\n## Tips for Best Results\n\n- Text-heavy PDFs convert best\n- Avoid scanned PDFs\n- Always review the converted document\n- Save as PDF again after editing: use [Word to PDF](/tools/word-to-pdf)\n\nUse the free [PDF to Word Converter](/tools/pdf-to-word) to convert your PDF in seconds.",
    author: "ToolPilot Team",
    seoTitle: "Convert PDF to Word Without Losing Formatting | Free Tool",
    seoDescription: "Convert PDF to Word while preserving fonts and formatting. Free online converter, no signup needed.",
    status: "PUBLISHED" as const,
  },
  {
    title: "How to Create a GST Invoice That Is Legally Compliant in India",
    slug: "create-gst-invoice-legally-compliant-india",
    excerpt: "Every GST-registered business must issue compliant invoices. Here is exactly what a GST invoice must include.",
    content: "If your business is registered under GST, every invoice must meet specific legal requirements.\n\n## What a GST Invoice Must Include\n\n| Field | Mandatory? |\n|-------|-----------|\n| Supplier Name | Yes |\n| Supplier GSTIN | Yes |\n| Invoice Number | Yes |\n| Invoice Date | Yes |\n| Recipient Name | Yes |\n| Recipient GSTIN (B2B) | Yes |\n| HSN/SAC Code | Yes |\n| Description | Yes |\n| Quantity and Unit | Yes |\n| Total Value | Yes |\n| GST Rate | Yes |\n| GST Amount | Yes |\n| Place of Supply | Yes |\n| Signature | Yes |\n\n## CGST + SGST vs IGST\n\n| Transaction | Tax Applied |\n|-------------|------------|\n| Within same state | CGST + SGST |\n| Between states | IGST |\n\nExample: 10,000 at 18% GST:\n- Intra-state: 900 CGST + 900 SGST\n- Inter-state: 1,800 IGST\n\n## Create GST Invoices Free\n\n1. Go to [GST Invoice Generator](/tools/gst-invoice-generator)\n2. Enter business details\n3. Add client info\n4. Add line items\n5. Select GST rate\n6. Download as PDF\n\n## Invoice Number Rules\n\n- Sequential (INV-001, INV-002...)\n- Cannot repeat\n- Maximum 16 characters\n\n## Tips\n\n- Keep copies for 6 years\n- Issue within 30 days of supply\n- Verify with [GST Calculator](/tools/gst-calculator)\n\nUse the free [GST Invoice Generator](/tools/gst-invoice-generator) to create compliant invoices.",
    author: "ToolPilot Team",
    seoTitle: "Create GST Invoice Legally Compliant India | Free Generator",
    seoDescription: "Learn what a GST invoice must include and create one for free. Auto-calculates CGST, SGST, and IGST.",
    status: "PUBLISHED" as const,
  },
  {
    title: "How to Pass ATS on Naukri, LinkedIn, and Indeed",
    slug: "pass-ats-naukri-linkedin-indeed-platform-specific-tips",
    excerpt: "Each job portal has its own ATS quirks. Here is how to optimize your resume for Naukri, LinkedIn, and Indeed.",
    content: "Getting zero callbacks? The problem might be how each platform processes your resume.\n\n## How Each Platform Works\n\n| Platform | Key Quirk |\n|----------|-----------|\n| Naukri | Heavily keyword-based |\n| LinkedIn | Skills match + profile completeness |\n| Indeed | Job title match emphasis |\n\n## Naukri Optimization\n\nDo:\n- Fill in every field\n- Use the exact job title\n- Add 10+ relevant skills\n- Write a detailed summary\n- Upload as PDF\n\nDo not:\n- Use creative job titles\n- Leave skills empty\n- Use tables or columns\n\n## LinkedIn Optimization\n\nDo:\n- Use headline for keywords\n- Add matching skills\n- Get endorsements\n- Turn on Open to Work\n\nDo not:\n- Copy-paste resume verbatim\n- Use generic headline\n- Ignore the skills section\n\n## Indeed Optimization\n\nDo:\n- Use standard job titles\n- Include keywords\n- Upload as PDF\n- Complete your profile\n\nDo not:\n- Use fancy formatting\n- Submit only through Easy Apply\n\n## Universal Tips\n\n1. Match the job title exactly\n2. Include keywords from the description\n3. Use standard formatting\n4. Quantify achievements\n5. Save as PDF\n\n## Test Your Resume\n\n> Upload to [Resume ATS Checker](/tools/resume-ats-checker) for your score and improvement suggestions.\n\nApply smart with [Resume Builder](/tools/resume-builder) and [Cover Letter Generator](/tools/cover-letter-generator).",
    author: "ToolPilot Team",
    seoTitle: "Pass ATS on Naukri, LinkedIn, Indeed | Free Resume Tips",
    seoDescription: "Optimize your resume for Naukri, LinkedIn, and Indeed ATS systems. Platform-specific tips to get more callbacks.",
    status: "PUBLISHED" as const,
  },
  {
    title: "How to Compress Images for Website: Cut Page Load Time in Half",
    slug: "compress-images-website-cut-page-load-time",
    excerpt: "Images account for 50% of page weight. Learn how to compress images to improve load time, Core Web Vitals, and SEO.",
    content: "Images are the biggest cause of slow websites. Compressing them is the fastest way to improve speed.\n\n## Why Image Compression Matters\n\n- Google ranks faster sites higher\n- 53% of mobile users leave after 3 seconds\n- Core Web Vitals use image optimization as ranking factor\n- Smaller images mean lower hosting costs\n\n## How Much Can You Compress?\n\n| Format | Typical Savings |\n|--------|----------------|\n| JPEG | 60-80% |\n| PNG | 40-60% |\n| WebP | 25-50% over JPEG |\n\n## How to Compress\n\n1. Go to [Image Compressor](/tools/image-compressor)\n2. Upload images\n3. Choose compression level\n4. Download optimized images\n\n## Image Format Guide\n\n| Format | Best For |\n|--------|----------|\n| JPEG | Photos |\n| PNG | Graphics with transparency |\n| WebP | All web images |\n| SVG | Icons and logos |\n\nUse [WebP Converter](/tools/webp-converter) to convert to WebP for 25-50% savings.\n\n## Optimization Checklist\n\n- Compress all images before uploading\n- Resize to maximum display size\n- Convert to WebP format\n- Add alt text for SEO\n- Use lazy loading\n\n## Tools\n\n| Tool | Purpose |\n|------|---------|\n| [Image Compressor](/tools/image-compressor) | Reduce file size |\n| [Image Resizer](/tools/image-resizer) | Change dimensions |\n| [WebP Converter](/tools/webp-converter) | Convert to WebP |\n\nUse the free [Image Compressor](/tools/image-compressor) to optimize your images.",
    author: "ToolPilot Team",
    seoTitle: "Compress Images for Website: Cut Load Time | Free Tool",
    seoDescription: "Compress images for faster websites. Free online Image Compressor reduces file sizes without visible quality loss.",
    status: "PUBLISHED" as const,
  },
  {
    title: "How to Check Your Monthly Budget with a Salary Calculator",
    slug: "check-monthly-budget-salary-calculator",
    excerpt: "Do you really know where your salary goes? Use a salary calculator to understand your exact take-home and plan your monthly budget.",
    content: "Most people think they know their salary. But after PF, tax, and deductions, the actual amount is much less.\n\n## Why You Need to Know Your Exact Take-Home\n\n- Plan monthly expenses accurately\n- Know how much you can save\n- Decide if a new job offer is actually better\n- Set realistic investment targets\n\n## What Reduces Your Salary\n\n| Deduction | Impact |\n|-----------|--------|\n| PF (Employee) | 12% of basic |\n| Professional Tax | 200/month |\n| Income Tax | Depends on regime |\n| ESI | If gross under 21,000/month |\n\n## CTC vs In-Hand Example\n\nFor a 10,00,000 CTC:\n- Basic (40%): 4,00,000\n- PF: 48,000\n- Professional Tax: 2,400\n- Income Tax: ~49,200\n- **In-Hand: ~7,90,800**\n\nThat is a 21% gap.\n\n## How to Calculate\n\n1. Go to [Salary Calculator](/tools/salary-calculator)\n2. Enter your CTC\n3. Select city type\n4. Choose tax regime\n5. See your detailed breakdown\n\n## Budget Planning\n\nOnce you know your take-home:\n\n- 50% needs (rent, food, bills)\n- 30% wants (entertainment, shopping)\n- 20% savings and investments\n\nUse [Income Tax Calculator](/tools/income-tax-calculator) to compare regimes and maximize your take-home.\n\nStart with the free [Salary Calculator](/tools/salary-calculator) to know your exact monthly income.",
    author: "ToolPilot Team",
    seoTitle: "Check Monthly Budget with Salary Calculator | Free Tool",
    seoDescription: "Know your exact take-home salary and plan your monthly budget. Free online salary calculator for Indian employees.",
    status: "PUBLISHED" as const,
  },
  {
    title: "How to Merge PDFs for College Assignments and Projects",
    slug: "merge-pdfs-college-assignments-projects",
    excerpt: "Submit one clean PDF instead of multiple files. Here is how to merge PDFs for college assignments, projects, and reports.",
    content: "College portals often accept only one PDF. But your assignment has a cover page, content, references, and appendices. Here is how to merge them.\n\n## Why Merge PDFs for College?\n\n- Most portals accept one file only\n- Professors prefer organized submissions\n- Easier to grade and review\n- Looks more professional\n\n## How to Merge\n\n1. Go to [PDF Merger](/tools/pdf-merger)\n2. Upload multiple PDFs\n3. Drag to reorder\n4. Click Merge PDF\n5. Download combined file\n\n## Recommended Order\n\n1. Cover page\n2. Table of contents\n3. Introduction\n4. Main content\n5. Results and discussion\n6. Conclusion\n7. References\n8. Appendices\n\n## Common Issues\n\n| Problem | Solution |\n|---------|----------|\n| File too large | Use [PDF Compressor](/tools/pdf-compressor) after merging |\n| Wrong page order | Reorder before merging |\n| Password-protected PDF | Remove password first |\n\n## Tips\n\n- Name files logically before uploading (01_cover.pdf, 02_content.pdf)\n- Check page count after merging\n- Compress the final file if over portal limit\n\nUse the free [PDF Merger](/tools/pdf-merger) to combine your assignment files.",
    author: "ToolPilot Team",
    seoTitle: "Merge PDFs for College Assignments | Free Online Tool",
    seoDescription: "Merge multiple PDF files for college assignments and projects. Free online PDF Merger, no signup required.",
    status: "PUBLISHED" as const,
  },
];

async function main() {
  console.log("Seeding blog posts (batch 7)...\n");

  for (const post of posts) {
    const existing = await prisma.blogPost.findUnique({ where: { slug: post.slug } });
    if (existing) {
      console.log(`Skip (exists): ${post.slug}`);
      continue;
    }
    await prisma.blogPost.create({
      data: { ...post, publishedAt: new Date() },
    });
    console.log(`Created: ${post.title}`);
  }

  const total = await prisma.blogPost.count();
  console.log(`\nTotal blog posts: ${total}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
