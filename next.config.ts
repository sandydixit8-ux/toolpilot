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
