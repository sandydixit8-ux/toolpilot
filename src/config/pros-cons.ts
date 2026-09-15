export interface ProsCons {
  pros: string[];
  cons: string[];
}

export const PROS_CONS: Record<string, ProsCons> = {
  "pdf-compressor": {
    pros: ["Free with no watermark or signup", "Runs in your browser — files never leave your device", "Multiple compression presets for email and portal uploads"],
    cons: ["Supports PDFs up to 50MB", "Heavily compressed scanned pages can lose fine detail"],
  },
  "word-to-pdf": {
    pros: ["Converts DOCX to PDF without installing Word", "Keeps fonts and layout intact", "Free and unlimited"],
    cons: ["Requires internet (server processing)", "Files are deleted after processing but are briefly uploaded"],
  },
  "pdf-to-word": {
    pros: ["Turns sealed PDFs into editable Word files", "Preserves tables, columns, and paragraphs", "Free with no account"],
    cons: ["Complex designs with many images may shift slightly", "Requires internet for processing"],
  },
  "pdf-merger": {
    pros: ["Combines as many PDFs as you need into one file", "Works fully in your browser", "Free, no watermarks, no signup"],
    cons: ["Large combined files may take a moment to download"],
  },
  "pdf-splitter": {
    pros: ["Extract any pages into a new PDF", "Browser-based and private", "No limits on document size"],
    cons: ["Page selection is manual per file"],
  },
  "image-compressor": {
    pros: ["Shrinks photos for WhatsApp, email, and websites", "All processing is local — nothing is uploaded", "Free with configurable quality and size"],
    cons: ["Very high-resolution photos benefit from resizing first"],
  },
  "image-resizer": {
    pros: ["Resize to exact pixels or preset sizes", "Fast and fully browser-based", "No signup, no watermarks"],
    cons: ["Enlarging a small image reduces sharpness"],
  },
  "webp-converter": {
    pros: ["WebP is dramatically smaller than PNG or JPG", "Keeps quality with lossless/lossy options", "Free and instant"],
    cons: ["Older software may not open WebP files"],
  },
  "income-tax-calculator": {
    pros: ["Side-by-side old vs new regime comparison for FY 2025-26", "India-specific slabs and deductions", "Instant and free"],
    cons: ["An estimate — confirm exact liability with your CA or employer"],
  },
  "emi-calculator": {
    pros: ["Shows monthly EMI and total interest instantly", "Works for home, car, and personal loans", "No account needed"],
    cons: ["Requires you to enter the interest rate manually"],
  },
  "gst-calculator": {
    pros: ["Adds and removes GST with correct CGST/SGST/IGST split", "Handles every standard GST rate in India", "Free and unlimited"],
    cons: ["Does not handle cess or special rates automatically"],
  },
  "sip-calculator": {
    pros: ["Projects your mutual fund SIP corpus over time", "Adjustable monthly amount, return, and tenure", "Good reality check before committing"],
    cons: ["Projections assume a constant return — markets fluctuate"],
  },
  "resume-builder": {
    pros: ["Creates ATS-friendly resumes in minutes", "Section-by-section guided flow", "Free PDF export"],
    cons: ["You still need to review and tailor content per job"],
  },
  "resume-ats-checker": {
    pros: ["Scores your resume instantly against ATS parsing", "Points out formatting and keyword issues", "Free and private"],
    cons: ["The score is a heuristic, not a recruiter's review"],
  },
  "invoice-generator": {
    pros: ["Professional invoices with your brand and GST details", "Unlimited invoices, free, no registration", "Print or download as PDF in seconds"],
    cons: ["Not full accounting software — it won't track payments over time"],
  },
  "gst-invoice-generator": {
    pros: ["Builds a GST-compliant invoice structure automatically", "Correct CGST/SGST/IGST split for any rate", "Free with no limits"],
    cons: ["You must enter accurate GSTIN and HSN details"],
  },
  "json-formatter": {
    pros: ["Formats and validates JSON instantly", "Fully client-side — your data never leaves the browser", "Free and beginner-friendly"],
    cons: ["Very large payloads can slow formatting"],
  },
  "base64-encoder-decoder": {
    pros: ["Encodes and decodes text and binary files", "Useful for images, tokens, and API data", "Private browser processing"],
    cons: ["Output grows by roughly a third in size"],
  },
  "uuid-generator": {
    pros: ["Generates v4 UUIDs in bulk", "One-click copy for each", "Instant and free"],
    cons: ["UUIDs are unique, not necessarily sequential"],
  },
  "qr-code-generator": {
    pros: ["Turns URLs and text into scannable QR codes", "Downloadable image for print or screens", "Free and unlimited"],
    cons: ["Long URLs produce denser, harder-to-scan codes"],
  },
  "ai-text-humanizer": {
    pros: ["Rewrites robotic AI output into natural, varied prose", "Useful for drafts, essays, and email tone", "Free and instant"],
    cons: ["Needs internet and a quick human review of the result"],
  },
  "ai-text-summarizer": {
    pros: ["Condenses long articles into key points in seconds", "Great for research and revision", "Free with no signup"],
    cons: ["Very long documents are best summarized section by section"],
  },
  "text-translator": {
    pros: ["Translates between dozens of languages instantly", "Good for emails, product text, and study notes", "No account needed"],
    cons: ["Machine translation — get a human review for official documents"],
  },
  transliteration: {
    pros: ["Type Hindi in Roman letters and get Devanagari instantly", "No keyboard install or IME setup", "Free and private"],
    cons: ["Proper nouns and borrowed words may need manual tweaks"],
  },
};

export function getProsCons(slug: string): ProsCons | undefined {
  return PROS_CONS[slug];
}