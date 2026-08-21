import { describe, it, expect } from "vitest";
import {
  contactSchema,
  newsletterSchema,
  blogPostSchema,
  analyticsEventSchema,
} from "@/lib/validations";

describe("contactSchema", () => {
  it("accepts valid contact data", () => {
    const result = contactSchema.safeParse({
      name: "John Doe",
      email: "john@example.com",
      subject: "Hello",
      message: "This is a test message with enough chars.",
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing name", () => {
    const result = contactSchema.safeParse({
      name: "",
      email: "john@example.com",
      subject: "Hello",
      message: "Test message here.",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid email", () => {
    const result = contactSchema.safeParse({
      name: "John",
      email: "not-an-email",
      subject: "Hello",
      message: "Test message here.",
    });
    expect(result.success).toBe(false);
  });
});

describe("newsletterSchema", () => {
  it("accepts valid email", () => {
    expect(newsletterSchema.safeParse({ email: "test@example.com" }).success).toBe(true);
  });

  it("rejects invalid email", () => {
    expect(newsletterSchema.safeParse({ email: "bad" }).success).toBe(false);
  });
});

describe("blogPostSchema", () => {
  const validPost = {
    title: "Test Post",
    slug: "test-post",
    content: "Some content here.",
    excerpt: "Short excerpt",
    author: "Admin",
    tags: ["test"],
    seoTitle: "Test Post SEO",
    seoDescription: "Description for SEO",
    status: "DRAFT" as const,
  };

  it("accepts valid blog post", () => {
    expect(blogPostSchema.safeParse(validPost).success).toBe(true);
  });

  it("rejects empty title", () => {
    expect(blogPostSchema.safeParse({ ...validPost, title: "" }).success).toBe(false);
  });

  it("rejects empty slug", () => {
    expect(blogPostSchema.safeParse({ ...validPost, slug: "" }).success).toBe(false);
  });
});

describe("analyticsEventSchema", () => {
  it("accepts valid event", () => {
    const result = analyticsEventSchema.safeParse({
      event: "page_view",
      page: "/tools/pdf",
    });
    expect(result.success).toBe(true);
  });

  it("accepts event with metadata", () => {
    const result = analyticsEventSchema.safeParse({
      event: "tool_use",
      page: "/tools/image",
      metadata: { format: "png" },
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty event", () => {
    expect(analyticsEventSchema.safeParse({ event: "", page: "/" }).success).toBe(false);
  });
});
