export interface RelatedArticle {
  slug: string;
  title: string;
}

const BLOG_LINKS: Record<string, RelatedArticle[]> = {
  "income-tax-calculator": [
    { slug: "income-tax-calculator-fy-2025-26-old-vs-new-regime", title: "Income Tax FY 2025-26: Old vs New Regime" },
    { slug: "old-vs-new-tax-regime-2025-26-which-saves-more", title: "Old vs New Regime 2025-26: Which Saves More?" },
    { slug: "income-tax-on-12-lakh-salary-zero-tax-new-regime", title: "Income Tax on ₹12 Lakh: Zero Tax Under New Regime" },
  ],
  "salary-calculator": [
    { slug: "income-tax-calculator-fy-2025-26-old-vs-new-regime", title: "Income Tax FY 2025-26: Old vs New Regime" },
    { slug: "salary-calculator-take-home-pay-india", title: "Salary Calculator: Take-Home Pay in India" },
    { slug: "how-to-calculate-take-home-salary-from-ctc-india", title: "How to Calculate Take-Home from CTC" },
    { slug: "check-monthly-budget-salary-calculator", title: "Check Monthly Budget with Salary Calculator" },
  ],
  "invoice-generator": [
    { slug: "how-to-create-invoices-online", title: "How to Create Invoices Online" },
  ],
  "gst-invoice-generator": [
    { slug: "how-to-create-invoices-online", title: "How to Create Invoices Online" },
    { slug: "create-gst-invoice-legally-compliant-india", title: "Create GST Invoice Legally Compliant" },
  ],
  "word-to-pdf": [
    { slug: "how-to-convert-word-to-pdf", title: "How to Convert Word to PDF" },
    { slug: "convert-pdf-to-word-edit-without-losing-formatting", title: "Convert PDF to Word" },
  ],
  "pdf-to-word": [
    { slug: "convert-pdf-to-word-edit-without-losing-formatting", title: "Convert PDF to Word" },
  ],
  "emi-calculator": [
    { slug: "how-to-calculate-home-loan-emi", title: "How to Calculate Your Home Loan EMI" },
    { slug: "emi-calculator-guide", title: "EMI Calculator: How to Calculate Loan EMI" },
  ],
  "gst-calculator": [
    { slug: "gst-calculator-india-cgst-sgst-igst", title: "GST in India: CGST, SGST & IGST Explained" },
    { slug: "how-gst-works-india-guide", title: "GST Calculator: How GST Works in India" },
  ],
  "resume-ats-checker": [
    { slug: "how-to-pass-ats-screening-resume-tips", title: "How to Pass ATS Screening: 7 Resume Tips" },
    { slug: "resume-ats-checker-guide", title: "Resume ATS Checker: How to Pass ATS Screening" },
    { slug: "resume-ats-score-what-is-good-how-to-improve", title: "Resume ATS Score: What Is Good & How to Improve" },
    { slug: "how-to-check-resume-ats-screening-free-tool", title: "How to Check If Your Resume Passes ATS" },
  ],
  "resume-builder": [
    { slug: "how-to-pass-ats-screening-resume-tips", title: "How to Pass ATS Screening: 7 Resume Tips" },
    { slug: "resume-builder-create-professional-resume", title: "Resume Builder: Create a Professional Resume" },
    { slug: "how-to-create-professional-resume-10-minutes", title: "How to Create a Resume in 10 Minutes" },
  ],
  "notice-period-calculator": [
    { slug: "how-to-calculate-notice-period-and-experience", title: "Notice Period & Experience: How to Calculate" },
  ],
  "experience-calculator": [
    { slug: "how-to-calculate-notice-period-and-experience", title: "Notice Period & Experience: How to Calculate" },
  ],
  "image-compressor": [
    { slug: "compress-resize-images-for-whatsapp", title: "Compress & Resize Images for WhatsApp" },
    { slug: "image-compressor-reduce-file-size", title: "Image Compressor: Reduce File Size" },
    { slug: "compress-images-web-no-quality-loss", title: "Compress Images for Web: No Quality Loss" },
    { slug: "online-image-compressor-whatsapp-send-photos", title: "Online Image Compressor for WhatsApp" },
    { slug: "resize-compress-images-email-attachments", title: "Resize & Compress Images for Email" },
    { slug: "compress-images-website-cut-page-load-time", title: "Compress Images for Website" },
  ],
  "image-resizer": [
    { slug: "compress-resize-images-for-whatsapp", title: "Compress & Resize Images for WhatsApp" },
    { slug: "how-to-resize-images-without-losing-quality", title: "How to Resize Images Without Losing Quality" },
    { slug: "image-resizer-resize-images-different-platforms", title: "Image Resizer for Different Platforms" },
    { slug: "resize-compress-images-email-attachments", title: "Resize & Compress Images for Email" },
  ],
  "pdf-compressor": [
    { slug: "how-to-compress-pdf-for-email", title: "How to Compress PDF for Email" },
    { slug: "compress-pdf-under-5mb-email-free", title: "Compress PDF Under 5MB for Email" },
    { slug: "free-pdf-compressor-no-watermark-online", title: "Free PDF Compressor No Watermark" },
    { slug: "reduce-pdf-size-government-portal-upload", title: "Reduce PDF Size for Government Portals" },
  ],
  "pdf-merger": [
    { slug: "how-to-merge-multiple-pdfs", title: "How to Merge Multiple PDFs" },
    { slug: "merge-pdfs-college-assignments-projects", title: "Merge PDFs for College Assignments" },
  ],
  "pdf-splitter": [
    { slug: "how-to-split-pdf-files", title: "How to Split a PDF" },
  ],
  "jpg-to-pdf": [
    { slug: "how-to-convert-jpg-to-pdf-online", title: "How to Convert JPG to PDF" },
  ],
  "percentage-calculator": [
    { slug: "percentage-calculator-complete-guide", title: "Percentage Calculator: All Calculations" },
    { slug: "how-to-calculate-percentage-increase", title: "How to Calculate Percentage Increase" },
  ],
  "password-generator": [
    { slug: "password-generator-create-strong-passwords", title: "Password Generator: Create Strong Passwords" },
  ],
  "uuid-generator": [
    { slug: "uuid-generator-what-it-is-developers", title: "UUID Generator: What It Is" },
  ],
  "qr-code-generator": [
    { slug: "qr-code-generator-create-free", title: "QR Code Generator: Create QR Codes" },
  ],
  "json-formatter": [
    { slug: "json-formatter-validate-json", title: "JSON Formatter: Pretty Print & Validate" },
  ],
  "base64-encoder-decoder": [
    { slug: "base64-encoder-decoder-guide", title: "Base64 Encoder/Decoder: What It Is" },
  ],
  "word-counter": [
    { slug: "word-counter-why-word-count-matters", title: "Word Counter: Why Word Count Matters" },
  ],
  "character-counter": [
    { slug: "character-counter-social-media-seo", title: "Character Counter: Social Media & SEO" },
  ],
  "bmi-calculator": [
    { slug: "bmi-calculator-body-mass-index", title: "BMI Calculator: Body Mass Index" },
  ],
  "unit-converter": [
    { slug: "unit-converter-quick-guide", title: "Unit Converter: Convert Any Unit" },
  ],
  "markdown-preview": [
    { slug: "markdown-editor-why-developers-love", title: "Markdown Editor: Why Developers Love It" },
  ],
  "html-preview": [
    { slug: "html-preview-tool-test-debug", title: "HTML Preview: Test & Debug HTML" },
  ],
  "color-picker": [
    { slug: "color-picker-choose-right-colors-design", title: "Color Picker: Choose the Right Colors" },
  ],
  "cover-letter-generator": [
    { slug: "cover-letter-generator-guide", title: "Cover Letter Generator Guide" },
  ],
  "sip-calculator": [
    { slug: "sip-calculator-guide-india", title: "SIP Calculator: Plan Mutual Fund Investments" },
    { slug: "sip-vs-lump-sum-investment-strategy-2026", title: "SIP vs Lump Sum: Which Is Better?" },
  ],
  "compound-interest-calculator": [
    { slug: "compound-interest-calculator-grow-wealth", title: "Compound Interest Calculator" },
    { slug: "simple-interest-vs-compound-interest-calculator", title: "Simple vs Compound Interest" },
  ],
  "simple-interest-calculator": [
    { slug: "simple-interest-vs-compound-interest-calculator", title: "Simple vs Compound Interest" },
  ],
  "roi-calculator": [
    { slug: "roi-calculator-measure-investment-returns", title: "ROI Calculator: Measure Returns" },
  ],
  "age-calculator": [
    { slug: "age-calculator-find-exact-age", title: "Age Calculator: Exact Age in Years, Months, Days" },
  ],
  "date-calculator": [
    { slug: "date-calculator-days-between-dates", title: "Date Calculator: Days Between Dates" },
  ],
  "discount-calculator": [
    { slug: "discount-calculator-never-overpay", title: "Discount Calculator: Never Overpay" },
  ],
  "business-name-generator": [
    { slug: "business-name-generator-startup", title: "Business Name Generator: Find the Perfect Name" },
  ],
  "webp-converter": [
    { slug: "image-optimization-for-web-guide", title: "Image Optimization for Web Guide" },
  ],
  "image-cropper": [
    { slug: "image-optimization-for-web-guide", title: "Image Optimization for Web Guide" },
  ],
};

export function getRelatedArticles(toolSlug: string): RelatedArticle[] {
  return BLOG_LINKS[toolSlug] || [];
}
