export interface RelatedArticle {
  slug: string;
  title: string;
}

/**
 * Static map of tool slug -> related PUBLISHED blog guides.
 *
 * Every slug here must be a PUBLISHED blog post. Archived (308-redirected)
 * slugs must never appear. Run `npx tsx scripts/validate-blog-links.ts`
 * before committing to verify all slugs still resolve to live posts.
 */
const BLOG_LINKS: Record<string, RelatedArticle[]> = {
  // PDF
  "pdf-to-word": [
    { slug: "how-to-convert-pdf-to-word", title: "How to Convert PDF to Word and Excel (Free, Keep Formatting)" },
  ],
  "word-to-pdf": [
    { slug: "how-to-convert-word-to-pdf", title: "How to Convert Word to PDF Without Losing Formatting (Free)" },
  ],
  "jpg-to-pdf": [
    { slug: "how-to-convert-jpg-to-pdf-online", title: "How to Convert JPG to PDF (Free, On Phone or PC)" },
  ],
  "pdf-to-jpg": [
    { slug: "convert-pdf-to-jpg-high-quality", title: "Convert PDF to JPG Without Losing Quality (Full Guide)" },
  ],
  "pdf-compressor": [
    { slug: "how-to-compress-pdf-without-losing-quality", title: "How to Compress a PDF Without Losing Quality (Free, No Watermark)" },
  ],
  "pdf-merger": [
    { slug: "how-to-merge-multiple-pdfs", title: "How to Merge PDF Files Into One (Free, Private, No Watermark)" },
  ],
  "pdf-splitter": [
    { slug: "how-to-split-pdf-files", title: "How to Split and Extract Pages From a PDF (Free Guide)" },
  ],
  "pdf-page-extractor": [
    { slug: "how-to-split-pdf-files", title: "How to Split and Extract Pages From a PDF (Free Guide)" },
  ],
  "pdf-rotator": [
    { slug: "how-to-rotate-pdf-pages", title: "How to Rotate PDF Pages (Fix Sideways Scans, Free)" },
  ],
  "pdf-page-counter": [
    { slug: "how-to-split-pdf-files", title: "How to Split and Extract Pages From a PDF (Free Guide)" },
    { slug: "how-to-compress-pdf-without-losing-quality", title: "How to Compress a PDF Without Losing Quality (Free)" },
  ],
  "pdf-to-excel": [
    { slug: "how-to-convert-pdf-to-word", title: "How to Convert PDF to Word and Excel (Free, Keep Formatting)" },
  ],

  // Image
  "image-compressor": [
    { slug: "how-to-compress-image-without-losing-quality", title: "How to Compress Images Without Losing Quality (2026 Guide)" },
    { slug: "image-optimization-for-web-guide", title: "Image Optimization for Web: The Complete 2026 Guide" },
  ],
  "image-resizer": [
    { slug: "how-to-resize-images-without-losing-quality", title: "How to Resize Images Without Losing Quality (2026 Guide)" },
    { slug: "image-optimization-for-web-guide", title: "Image Optimization for Web: The Complete 2026 Guide" },
  ],
  "jpg-to-png": [
    { slug: "convert-jpg-to-png-online-free", title: "How to Convert JPG to PNG Online Without Quality Loss" },
  ],
  "png-to-jpg": [
    { slug: "how-to-convert-png-to-jpg", title: "How to Convert PNG to JPG (Free Online, No Quality Loss)" },
  ],
  "webp-converter": [
    { slug: "image-optimization-for-web-guide", title: "Image Optimization for Web: The Complete 2026 Guide" },
  ],
  "image-cropper": [
    { slug: "how-to-resize-images-without-losing-quality", title: "How to Resize Images Without Losing Quality (2026 Guide)" },
    { slug: "image-optimization-for-web-guide", title: "Image Optimization for Web: The Complete 2026 Guide" },
  ],
  "image-rotator": [
    { slug: "image-optimization-for-web-guide", title: "Image Optimization for Web: The Complete 2026 Guide" },
  ],
  "image-quality-optimizer": [
    { slug: "image-optimization-for-web-guide", title: "Image Optimization for Web: The Complete 2026 Guide" },
    { slug: "how-to-compress-image-without-losing-quality", title: "How to Compress Images Without Losing Quality (2026 Guide)" },
  ],
  "image-to-text": [
    { slug: "how-to-extract-text-from-image-ocr", title: "How to Extract Text from an Image (Free OCR Tool, No Sign-Up)" },
  ],

  // Calculators
  "gst-calculator": [
    { slug: "gst-calculator-guide-india-2026", title: "GST Calculator Guide: How to Calculate GST in India (2026)" },
    { slug: "how-to-create-gst-invoice-for-small-business", title: "How to Create a GST Invoice in India: Format, Rules & Free Generator" },
  ],
  "emi-calculator": [
    { slug: "emi-calculator-guide", title: "EMI Calculator: How Loan EMI Is Calculated (Home, Car, Personal)" },
    { slug: "compound-interest-calculator-grow-wealth", title: "Compound Interest Calculator: Simple vs Compound Interest & ROI" },
  ],
  "salary-calculator": [
    { slug: "how-to-calculate-take-home-salary-from-ctc-india", title: "How to Calculate Take-Home Salary from CTC in India (2026)" },
    { slug: "income-tax-calculator-guide", title: "Income Tax Calculator India: New vs Old Regime (FY 2026-27)" },
  ],
  "income-tax-calculator": [
    { slug: "income-tax-calculator-guide", title: "Income Tax Calculator India: New vs Old Regime (FY 2026-27)" },
  ],
  "us-income-tax-calculator": [
    { slug: "us-income-tax-calculator-guide-2025", title: "US Income Tax Calculator 2025: Brackets, Rates and How to Estimate Your Tax" },
  ],
  "us-self-employment-tax-calculator": [
    { slug: "self-employment-tax-calculator-guide-2025", title: "Self-Employment Tax 2025: How Much Freelancers Owe and How to Calculate It" },
    { slug: "us-income-tax-calculator-guide-2025", title: "US Income Tax Calculator 2025: Brackets, Rates and How to Estimate Your Tax" },
  ],
  "us-paycheck-calculator": [
    { slug: "us-income-tax-calculator-guide-2025", title: "US Income Tax Calculator 2025: Brackets, Rates and How to Estimate Your Tax" },
    { slug: "self-employment-tax-calculator-guide-2025", title: "Self-Employment Tax 2025: How Much Freelancers Owe and How to Calculate It" },
  ],
  "uk-income-tax-calculator": [
    { slug: "uk-income-tax-calculator-guide-2025-26", title: "UK Income Tax 2025/26: Personal Allowance, Bands and Take-Home Pay Explained" },
    { slug: "uk-take-home-pay-examples-2025-26", title: "UK Take-Home Pay 2025/26: What £25k, £35k, £50k and £70k Actually Pay" },
    { slug: "uk-payslip-explained-2025-26", title: "UK Payslip Explained: What Every Line on Your Pay Slip Means (2025/26)" },
  ],
  "uk-national-insurance-calculator": [
    { slug: "uk-national-insurance-rates-2025-26", title: "National Insurance 2025/26: Rates, Thresholds and What You Actually Pay" },
    { slug: "uk-payslip-explained-2025-26", title: "UK Payslip Explained: What Every Line on Your Pay Slip Means (2025/26)" },
    { slug: "uk-income-tax-calculator-guide-2025-26", title: "UK Income Tax 2025/26: Personal Allowance, Bands and Take-Home Pay Explained" },
  ],
  "uk-vat-calculator": [
    { slug: "uk-vat-rates-guide", title: "UK VAT Rates Explained: 20%, 5% and 0% with Worked Examples" },
    { slug: "uk-income-tax-calculator-guide-2025-26", title: "UK Income Tax 2025/26: Personal Allowance, Bands and Take-Home Pay Explained" },
  ],
  "sip-calculator": [
    { slug: "sip-calculator-guide-india", title: "SIP Calculator: How to Calculate SIP Returns & Maturity (India)" },
  ],
  "percentage-calculator": [
    { slug: "percentage-calculator-complete-guide", title: "Percentage Calculator: Percentage Of, Increase, Marks & CGPA" },
  ],
  "age-calculator": [
    { slug: "age-calculator-find-exact-age", title: "Age Calculator: Find Your Exact Age" },
  ],
  "discount-calculator": [
    { slug: "markup-vs-margin-selling-price", title: "Markup, Margin, Break-Even and Discounts: Pricing Calculations Explained" },
    { slug: "percentage-calculator-complete-guide", title: "Percentage Calculator: Percentage Of, Increase, Marks & CGPA" },
  ],
  "compound-interest-calculator": [
    { slug: "compound-interest-calculator-grow-wealth", title: "Compound Interest Calculator: Simple vs Compound Interest & ROI" },
    { slug: "sip-calculator-guide-india", title: "SIP Calculator: How to Calculate SIP Returns & Maturity (India)" },
  ],
  "simple-interest-calculator": [
    { slug: "compound-interest-calculator-grow-wealth", title: "Compound Interest Calculator: Simple vs Compound Interest & ROI" },
  ],
  "bmi-calculator": [
    { slug: "bmi-calculator-body-mass-index", title: "BMI Calculator: How to Calculate Your Body Mass Index" },
  ],
  "unit-converter": [
    { slug: "unit-converter-metric-imperial-guide", title: "Unit Converter: Metric to Imperial Conversions Made Simple" },
  ],
  "date-calculator": [
    { slug: "date-calculator-days-between-dates", title: "Date Calculator: Calculate Days Between Any Two Dates" },
  ],
  "time-calculator": [
    { slug: "date-calculator-days-between-dates", title: "Date Calculator: Calculate Days Between Any Two Dates" },
  ],
  "gratuity-calculator": [
    { slug: "how-to-calculate-gratuity-resignation-india", title: "Gratuity and PF: How to Calculate Your Full and Final Settlement" },
    { slug: "how-to-calculate-take-home-salary-from-ctc-india", title: "How to Calculate Take-Home Salary from CTC in India (2026)" },
  ],
  "epf-interest-calculator": [
    { slug: "how-to-calculate-gratuity-resignation-india", title: "Gratuity and PF: How to Calculate Your Full and Final Settlement" },
  ],
  "cgpa-to-percentage": [
    { slug: "percentage-calculator-complete-guide", title: "Percentage Calculator: Percentage Of, Increase, Marks & CGPA" },
  ],
  "gpa-to-percentage": [
    { slug: "percentage-calculator-complete-guide", title: "Percentage Calculator: Percentage Of, Increase, Marks & CGPA" },
  ],
  "attendance-calculator": [
    { slug: "percentage-calculator-complete-guide", title: "Percentage Calculator: Percentage Of, Increase, Marks & CGPA" },
  ],

  // Developer
  "json-formatter": [
    { slug: "json-formatter-validate-json", title: "JSON Formatter: Pretty Print and Validate JSON Data" },
  ],
  "json-validator": [
    { slug: "json-formatter-validate-json", title: "JSON Formatter: Pretty Print and Validate JSON Data" },
  ],
  "json-minifier": [
    { slug: "json-formatter-validate-json", title: "JSON Formatter: Pretty Print and Validate JSON Data" },
  ],
  "base64-encoder": [
    { slug: "what-is-base64-encode-decode-free-tool", title: "Base64 and URL Encoding Explained: When to Use Each (Free Tools)" },
  ],
  "base64-decoder": [
    { slug: "what-is-base64-encode-decode-free-tool", title: "Base64 and URL Encoding Explained: When to Use Each (Free Tools)" },
  ],
  "base64-encoder-decoder": [
    { slug: "what-is-base64-encode-decode-free-tool", title: "Base64 and URL Encoding Explained: When to Use Each (Free Tools)" },
  ],
  "url-encoder": [
    { slug: "what-is-base64-encode-decode-free-tool", title: "Base64 and URL Encoding Explained: When to Use Each (Free Tools)" },
  ],
  "url-decoder": [
    { slug: "what-is-base64-encode-decode-free-tool", title: "Base64 and URL Encoding Explained: When to Use Each (Free Tools)" },
  ],
  "uuid-generator": [
    { slug: "uuid-generator-what-it-is-developers", title: "UUID Generator: What It Is and Why Developers Need It" },
  ],
  "timestamp-converter": [
    { slug: "unix-timestamp-converter-guide", title: "Unix Timestamp Converter: Convert Timestamps to Dates (Free)" },
  ],
  "regex-tester": [
    { slug: "how-to-test-regex-online", title: "How to Test Regular Expressions Online (Free Regex Tester)" },
  ],
  "word-counter": [
    { slug: "best-word-counter-for-essays", title: "Word Counter and Character Counter: Count Words, Characters & Limits" },
  ],
  "character-counter": [
    { slug: "best-word-counter-for-essays", title: "Word Counter and Character Counter: Count Words, Characters & Limits" },
  ],
  "lorem-ipsum-generator": [
    { slug: "what-is-lorem-ipsum-placeholder-text", title: "What Is Lorem Ipsum? How to Generate Placeholder Text" },
  ],
  "qr-code-generator": [
    { slug: "qr-code-generator-guide", title: "QR Code Generator: Free QR Codes for Links, Wi-Fi, Menus & UPI" },
  ],
  "password-generator": [
    { slug: "password-generator-create-strong-passwords", title: "Password Generator: How to Create Strong, Random Passwords Online" },
  ],
  "color-picker": [
    { slug: "color-picker-choose-right-colors-design", title: "Color Picker: How to Choose the Right Colors for Your Design" },
  ],
  "html-preview": [
    { slug: "html-preview-tool-test-debug", title: "HTML Preview Tool: Test and Debug HTML Code Instantly" },
  ],
  "markdown-preview": [
    { slug: "markdown-editor-why-developers-love", title: "Markdown Editor: Why Developers Love Writing in Markdown" },
  ],

  // Career
  "resume-builder": [
    { slug: "resume-builder-create-professional-resume", title: "How to Build a Professional Resume: Complete Guide (2026)" },
    { slug: "ats-resume-guide-2026", title: "ATS Resume Guide 2026: How to Pass Applicant Tracking Systems" },
  ],
  "resume-analyzer": [
    { slug: "ats-resume-guide-2026", title: "ATS Resume Guide 2026: How to Pass Applicant Tracking Systems" },
    { slug: "resume-builder-create-professional-resume", title: "How to Build a Professional Resume: Complete Guide (2026)" },
  ],
  "resume-ats-checker": [
    { slug: "ats-resume-guide-2026", title: "ATS Resume Guide 2026: How to Pass Applicant Tracking Systems" },
  ],
  "resume-jd-matcher": [
    { slug: "ats-resume-guide-2026", title: "ATS Resume Guide 2026: How to Pass Applicant Tracking Systems" },
  ],
  "cover-letter-generator": [
    { slug: "cover-letter-generator-guide", title: "Cover Letter Generator: Write a Winning Cover Letter in Minutes" },
  ],
  "salary-calculator-career": [
    { slug: "how-to-calculate-take-home-salary-from-ctc-india", title: "How to Calculate Take-Home Salary from CTC in India (2026)" },
  ],
  "notice-period-calculator": [
    { slug: "notice-period-calculator-last-working-day", title: "Notice Period Calculator: How to Find Your Last Working Day" },
  ],
  "experience-calculator": [
    { slug: "how-to-calculate-take-home-salary-from-ctc-india", title: "How to Calculate Take-Home Salary from CTC in India (2026)" },
    { slug: "notice-period-calculator-last-working-day", title: "Notice Period Calculator: How to Find Your Last Working Day" },
  ],
  "interview-question-generator": [
    { slug: "how-to-prepare-interview-ai-generator", title: "How to Prepare for an Interview with AI (Free Question Generator)" },
  ],
  "job-description-analyzer": [
    { slug: "ats-resume-guide-2026", title: "ATS Resume Guide 2026: How to Pass Applicant Tracking Systems" },
  ],
  "sarkari-resume-template": [
    { slug: "resume-builder-create-professional-resume", title: "How to Build a Professional Resume: Complete Guide (2026)" },
  ],

  // Business
  "invoice-generator": [
    { slug: "how-to-create-gst-invoice-for-small-business", title: "How to Create a GST Invoice in India: Format, Rules & Free Generator" },
    { slug: "how-to-create-quotation-for-clients", title: "How to Create a Quotation for Clients (Free Quotation Generator)" },
  ],
  "quotation-generator": [
    { slug: "how-to-create-quotation-for-clients", title: "How to Create a Quotation for Clients (Free Quotation Generator)" },
  ],
  "gst-invoice-generator": [
    { slug: "how-to-create-gst-invoice-for-small-business", title: "How to Create a GST Invoice in India: Format, Rules & Free Generator" },
    { slug: "gst-calculator-guide-india-2026", title: "GST Calculator Guide: How to Calculate GST in India (2026)" },
  ],
  "profit-margin-calculator": [
    { slug: "markup-vs-margin-selling-price", title: "Markup, Margin, Break-Even and Discounts: Pricing Calculations Explained" },
  ],
  "markup-calculator": [
    { slug: "markup-vs-margin-selling-price", title: "Markup, Margin, Break-Even and Discounts: Pricing Calculations Explained" },
  ],
  "break-even-calculator": [
    { slug: "markup-vs-margin-selling-price", title: "Markup, Margin, Break-Even and Discounts: Pricing Calculations Explained" },
  ],
  "roi-calculator": [
    { slug: "compound-interest-calculator-grow-wealth", title: "Compound Interest Calculator: Simple vs Compound Interest & ROI" },
    { slug: "markup-vs-margin-selling-price", title: "Markup, Margin, Break-Even and Discounts: Pricing Calculations Explained" },
  ],
  "business-name-generator": [
    { slug: "business-name-generator-startup", title: "Business Name Generator: Find the Perfect Name for Your Startup" },
  ],
  "project-cost-calculator": [
    { slug: "how-to-estimate-construction-project-cost", title: "How to Estimate Construction & Project Cost (Free Calculators)" },
  ],
  "construction-cost-calculator": [
    { slug: "how-to-estimate-construction-project-cost", title: "How to Estimate Construction & Project Cost (Free Calculators)" },
  ],
  "boq-calculator": [
    { slug: "how-to-estimate-construction-project-cost", title: "How to Estimate Construction & Project Cost (Free Calculators)" },
  ],

  // AI
  "ai-text-humanizer": [
    { slug: "ai-paraphrase-rewrite-text-free", title: "AI Paraphrasing and Humanizing: Rewrite Text Without Plagiarism" },
  ],
  "ai-paraphraser": [
    { slug: "ai-paraphrase-rewrite-text-free", title: "AI Paraphrasing and Humanizing: Rewrite Text Without Plagiarism" },
  ],
  "ai-text-summarizer": [
    { slug: "how-to-summarize-long-text-ai", title: "AI Text Summarizer: Summarize Long Text into Study Notes" },
  ],
  "ai-cover-letter-generator": [
    { slug: "cover-letter-generator-guide", title: "Cover Letter Generator: Write a Winning Cover Letter in Minutes" },
  ],
  "ai-resume-summary-generator": [
    { slug: "resume-builder-create-professional-resume", title: "How to Build a Professional Resume: Complete Guide (2026)" },
    { slug: "how-to-summarize-long-text-ai", title: "AI Text Summarizer: Summarize Long Text into Study Notes" },
  ],
  "ai-email-generator": [
    { slug: "how-to-write-professional-email-ai", title: "How to Write a Professional Email with AI (Free Generator)" },
  ],

  // Translation
  "text-translator": [
    { slug: "hindi-to-english-translation-free-online", title: "Hindi to English Translation: Free Tools and Tips for Accuracy" },
  ],
  "transliteration": [
    { slug: "hindi-transliteration-roman-to-devanagari", title: "Hindi Transliteration: Convert Roman Hindi to Devanagari Online" },
  ],

  // Video
  "video-compressor": [
    { slug: "how-to-compress-video-for-whatsapp-email", title: "How to Compress a Video for WhatsApp, Email & Upload (Free Tool)" },
  ],
  "mp4-to-mp3": [
    { slug: "convert-mp4-to-mp3-extract-audio", title: "MP4 to MP3: How to Extract Audio from a Video (Free)" },
  ],
  "m4a-to-mp3": [
    { slug: "convert-mp4-to-mp3-extract-audio", title: "MP4 to MP3: How to Extract Audio from a Video (Free)" },
  ],
  "wav-to-mp3": [
    { slug: "convert-mp4-to-mp3-extract-audio", title: "MP4 to MP3: How to Extract Audio from a Video (Free)" },
  ],
  "video-to-gif": [
    { slug: "how-to-convert-video-to-gif", title: "How to Convert a Video to GIF (Free, No Watermark)" },
  ],
};

export function getRelatedArticles(toolSlug: string): RelatedArticle[] {
  return BLOG_LINKS[toolSlug] || [];
}
