import { describe, it, expect } from "vitest";
import {
  cn,
  slugify,
  formatDate,
  formatNumber,
  truncate,
  formatBytes,
  parseJsonArrayField,
} from "@/lib/utils";

describe("cn", () => {
  it("merges class names", () => {
    expect(cn("foo", "bar")).toContain("foo");
    expect(cn("foo", "bar")).toContain("bar");
  });

  it("deduplicates tailwind classes", () => {
    const result = cn("px-4", "px-8");
    expect(result).toBe("px-8");
  });
});

describe("slugify", () => {
  it("converts text to URL-safe slug", () => {
    expect(slugify("Hello World")).toBe("hello-world");
    expect(slugify("PDF Tools & More!")).toBe("pdf-tools-more");
    expect(slugify("  spaces  ")).toBe("spaces");
    expect(slugify("already-slug")).toBe("already-slug");
  });
});

describe("formatDate", () => {
  it("formats date string", () => {
    const result = formatDate("2025-01-15");
    expect(result).toContain("January");
    expect(result).toContain("15");
    expect(result).toContain("2025");
  });

  it("formats Date object", () => {
    const result = formatDate(new Date("2025-06-01"));
    expect(result).toContain("June");
  });
});

describe("formatNumber", () => {
  it("formats numbers with Indian locale", () => {
    expect(formatNumber(1000)).toBe("1,000");
    expect(formatNumber(100000)).toBe("1,00,000");
    expect(formatNumber(0)).toBe("0");
  });
});

describe("truncate", () => {
  it("truncates long text", () => {
    expect(truncate("Hello World this is long", 10)).toBe("Hello Worl...");
  });

  it("does not truncate short text", () => {
    expect(truncate("Hi", 10)).toBe("Hi");
  });
});

describe("formatBytes", () => {
  it("formats bytes to readable sizes", () => {
    expect(formatBytes(0)).toBe("0 Bytes");
    expect(formatBytes(1024)).toBe("1 KB");
    expect(formatBytes(1048576)).toBe("1 MB");
    expect(formatBytes(1500)).toBe("1.46 KB");
  });
});

describe("parseJsonArrayField", () => {
  it("parses valid JSON array string", () => {
    expect(parseJsonArrayField('["a","b","c"]')).toEqual(["a", "b", "c"]);
  });

  it("returns empty array for invalid JSON", () => {
    expect(parseJsonArrayField("not json")).toEqual([]);
  });

  it("returns empty array for null/undefined", () => {
    expect(parseJsonArrayField(null)).toEqual([]);
    expect(parseJsonArrayField(undefined)).toEqual([]);
  });

  it("passes through actual arrays", () => {
    expect(parseJsonArrayField(["x", "y"])).toEqual(["x", "y"]);
  });

  it("returns empty array for non-array JSON", () => {
    expect(parseJsonArrayField('{"key":"value"}')).toEqual([]);
  });
});
