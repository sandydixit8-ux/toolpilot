import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@ffmpeg/ffmpeg", "@ffmpeg/util"],
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
  },
  async redirects() {
    return [
      { source: "/tools/pdf-tools", destination: "/tools/pdf", permanent: true },
      { source: "/tools/image-tools", destination: "/tools/image", permanent: true },
      { source: "/tools/calculator-tools", destination: "/tools/calculators", permanent: true },
      { source: "/privacy-policy", destination: "/privacy", permanent: true },
      { source: "/cookie-policy", destination: "/cookies", permanent: true },
      { source: "/blog/compress-images-web-no-quality-loss", destination: "/blog/how-to-compress-image-without-losing-quality", permanent: true },
      { source: "/blog/compress-images-website-cut-page-load-time", destination: "/blog/how-to-compress-image-without-losing-quality", permanent: true },
      { source: "/blog/how-to-compress-images-for-web", destination: "/blog/how-to-compress-image-without-losing-quality", permanent: true },
      { source: "/blog/how-to-compress-images-for-whatsapp-email", destination: "/blog/how-to-compress-image-without-losing-quality", permanent: true },
      { source: "/blog/image-compressor-reduce-file-size", destination: "/blog/how-to-compress-image-without-losing-quality", permanent: true },
      { source: "/blog/online-image-compressor-whatsapp-send-photos", destination: "/blog/how-to-compress-image-without-losing-quality", permanent: true },
      { source: "/blog/resize-compress-images-email-attachments", destination: "/blog/how-to-compress-image-without-losing-quality", permanent: true },
      { source: "/blog/image-resizer-resize-images-different-platforms", destination: "/blog/how-to-resize-images-without-losing-quality", permanent: true },
      { source: "/blog/ats-resume-checker-guide", destination: "/blog/ats-resume-guide-2026", permanent: true },
      { source: "/blog/resume-ats-checker-guide", destination: "/blog/ats-resume-guide-2026", permanent: true },
      { source: "/blog/how-to-check-resume-ats-screening-free-tool", destination: "/blog/ats-resume-guide-2026", permanent: true },
      { source: "/blog/resume-ats-score-what-is-good-how-to-improve", destination: "/blog/ats-resume-guide-2026", permanent: true },
      { source: "/blog/how-to-make-ats-friendly-resume", destination: "/blog/ats-resume-guide-2026", permanent: true },
      { source: "/blog/build-ats-friendly-resume", destination: "/blog/ats-resume-guide-2026", permanent: true },
      { source: "/blog/pass-ats-naukri-linkedin-indeed-platform-specific-tips", destination: "/blog/ats-resume-guide-2026", permanent: true },
      { source: "/blog/resume-for-freshers-first-job", destination: "/blog/resume-builder-create-professional-resume", permanent: true },
      { source: "/blog/how-to-create-professional-resume-10-minutes", destination: "/blog/resume-builder-create-professional-resume", permanent: true },
      { source: "/blog/ai-resume-summary-generator-guide", destination: "/blog/resume-builder-create-professional-resume", permanent: true },
      { source: "/blog/gst-calculator-guide-india", destination: "/blog/gst-calculator-guide-india-2026", permanent: true },
      { source: "/blog/how-gst-works-india-guide", destination: "/blog/gst-calculator-guide-india-2026", permanent: true },
      { source: "/blog/how-to-calculate-gst-2026", destination: "/blog/gst-calculator-guide-india-2026", permanent: true },
      { source: "/blog/create-gst-invoice-legally-compliant-india", destination: "/blog/how-to-create-gst-invoice-for-small-business", permanent: true },
      { source: "/blog/how-to-create-invoices-online", destination: "/blog/how-to-create-gst-invoice-for-small-business", permanent: true },
      { source: "/blog/how-to-compress-pdf-for-email", destination: "/blog/how-to-compress-pdf-without-losing-quality", permanent: true },
      { source: "/blog/compress-pdf-under-5mb-email-free", destination: "/blog/how-to-compress-pdf-without-losing-quality", permanent: true },
      { source: "/blog/free-pdf-compressor-no-watermark-online", destination: "/blog/how-to-compress-pdf-without-losing-quality", permanent: true },
      { source: "/blog/reduce-pdf-size-government-portal-upload", destination: "/blog/how-to-compress-pdf-without-losing-quality", permanent: true },
      { source: "/blog/merge-multiple-pdf-files-into-one", destination: "/blog/how-to-merge-multiple-pdfs", permanent: true },
      { source: "/blog/merge-pdfs-college-assignments-projects", destination: "/blog/how-to-merge-multiple-pdfs", permanent: true },
      { source: "/blog/split-pdf-pages-for-document", destination: "/blog/how-to-split-pdf-files", permanent: true },
      { source: "/blog/how-to-extract-pages-from-pdf", destination: "/blog/how-to-split-pdf-files", permanent: true },
      { source: "/blog/how-to-count-pdf-pages", destination: "/blog/how-to-split-pdf-files", permanent: true },
      { source: "/blog/how-to-rotate-pdf-pages-online", destination: "/blog/how-to-rotate-pdf-pages", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/pdf.worker-legacy.min.mjs",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
};

export default nextConfig;
