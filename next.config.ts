import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
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
    ];
  },
};

export default nextConfig;
