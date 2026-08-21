import { describe, it, expect } from "vitest";
import { getToolsByCategory, getFeaturedTools, getPopularTools } from "@/config/tools";

describe("tools config", () => {
  it("returns tools for each category", () => {
    const categories = ["pdf", "image", "calculators", "developer", "career", "business", "ai"];
    for (const cat of categories) {
      const tools = getToolsByCategory(cat);
      expect(tools.length).toBeGreaterThan(0);
      for (const tool of tools) {
        expect(tool.categorySlug).toBe(cat);
        expect(tool.slug).toBeTruthy();
        expect(tool.name).toBeTruthy();
      }
    }
  });

  it("returns featured tools", () => {
    const featured = getFeaturedTools();
    expect(featured.length).toBeGreaterThan(0);
    for (const tool of featured) {
      expect(tool.featured).toBe(true);
    }
  });

  it("returns popular tools", () => {
    const popular = getPopularTools();
    expect(popular.length).toBeGreaterThan(0);
    for (const tool of popular) {
      expect(tool.popular).toBe(true);
    }
  });

  it("has valid slugs (no spaces)", () => {
    const allTools = [...getFeaturedTools(), ...getPopularTools()];
    for (const tool of allTools) {
      expect(tool.slug).not.toContain(" ");
      expect(tool.slug).not.toContain("  ");
    }
  });

  it("each tool has required fields", () => {
    const allTools = getToolsByCategory("pdf");
    for (const tool of allTools) {
      expect(tool.name).toBeTruthy();
      expect(tool.slug).toBeTruthy();
      expect(tool.description).toBeTruthy();
      expect(tool.icon).toBeTruthy();
      expect(tool.seoTitle).toBeTruthy();
      expect(tool.seoDescription).toBeTruthy();
      expect(Array.isArray(tool.keywords)).toBe(true);
      expect(Array.isArray(tool.faqs)).toBe(true);
      expect(Array.isArray(tool.relatedTools)).toBe(true);
    }
  });
});
