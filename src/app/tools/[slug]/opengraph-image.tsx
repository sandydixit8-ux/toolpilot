import { ImageResponse } from "next/og";
import { getToolBySlug } from "@/config/tools";
import { categories } from "@/config/categories";

export const alt = "ToolPilot — Free Online Tools";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  const cat = categories.find((c) => c.slug === slug);
  const title = tool ? tool.name : cat?.name ?? "ToolPilot";
  const description = tool
    ? tool.seoDescription
    : cat?.description ?? "Fast, simple and privacy-friendly tools — no complicated software required.";

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #1d4ed8 0%, #1e3a8a 60%, #172554 100%)",
          padding: 48,
        }}
      >
        <div style={{ display: "flex", fontSize: 26, color: "#bfdbfe", marginBottom: 20 }}>
          ToolPilot — Free Online Tools
        </div>
        <div style={{ display: "flex", fontSize: 76, fontWeight: 700, color: "#ffffff", textAlign: "center", marginBottom: 20, lineHeight: 1.15 }}>
          {title}
        </div>
        <div style={{ display: "flex", fontSize: 30, color: "#e2e8f0", textAlign: "center", maxWidth: 940, lineHeight: 1.4 }}>
          {description}
        </div>
      </div>
    ),
    size
  );
}