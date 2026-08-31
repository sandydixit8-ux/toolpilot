export interface RelatedArticle {
  slug: string;
  title: string;
}

const BLOG_LINKS: Record<string, RelatedArticle[]> = {
  "income-tax-calculator": [
    { slug: "income-tax-calculator-fy-2025-26-old-vs-new-regime", title: "Income Tax FY 2025-26: Old vs New Regime" },
  ],
  "salary-calculator": [
    { slug: "income-tax-calculator-fy-2025-26-old-vs-new-regime", title: "Income Tax FY 2025-26: Old vs New Regime" },
  ],
  "emi-calculator": [
    { slug: "how-to-calculate-home-loan-emi", title: "How to Calculate Your Home Loan EMI" },
  ],
  "gst-calculator": [
    { slug: "gst-calculator-india-cgst-sgst-igst", title: "GST in India: CGST, SGST & IGST Explained" },
  ],
  "resume-ats-checker": [
    { slug: "how-to-pass-ats-screening-resume-tips", title: "How to Pass ATS Screening: 7 Resume Tips" },
  ],
  "resume-builder": [
    { slug: "how-to-pass-ats-screening-resume-tips", title: "How to Pass ATS Screening: 7 Resume Tips" },
  ],
  "notice-period-calculator": [
    { slug: "how-to-calculate-notice-period-and-experience", title: "Notice Period & Experience: How to Calculate" },
  ],
  "experience-calculator": [
    { slug: "how-to-calculate-notice-period-and-experience", title: "Notice Period & Experience: How to Calculate" },
  ],
  "image-compressor": [
    { slug: "compress-resize-images-for-whatsapp", title: "Compress & Resize Images for WhatsApp" },
  ],
  "image-resizer": [
    { slug: "compress-resize-images-for-whatsapp", title: "Compress & Resize Images for WhatsApp" },
  ],
};

export function getRelatedArticles(toolSlug: string): RelatedArticle[] {
  return BLOG_LINKS[toolSlug] || [];
}