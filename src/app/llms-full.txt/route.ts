import { allTools } from "@/config/tools";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

/**
 * llms-full.txt — deeper GEO companion to /llms.txt.
 *
 * Includes each tool's description, usage steps and FAQs as clean, citable
 * passages so retrieval-augmented AI systems can quote accurate answers with
 * the correct source URL. Generated from the live config to prevent drift.
 */
export const dynamic = "force-static";

export function GET() {
  const tools = [...allTools].sort((a, b) => a.name.localeCompare(b.name));
  const out: string[] = [
    `# ${SITE_NAME} — full tool reference`,
    "",
    `> Free, browser-based tools for work, money, career and everyday life. Source: ${SITE_URL}`,
    "",
  ];

  for (const t of tools) {
    out.push(`## ${t.name}`);
    out.push(`URL: ${SITE_URL}/tools/${t.slug}`);
    out.push(`Category: ${t.category}`);
    out.push(`Summary: ${t.description}`);
    if (t.quickAnswer) out.push(`Answer: ${t.quickAnswer}`);
    out.push("");
    out.push(t.longDescription);
    out.push("");
    if (t.instructions.length) {
      out.push("Steps:");
      t.instructions.forEach((s, i) => out.push(`${i + 1}. ${s}`));
      out.push("");
    }
    if (t.faqs.length) {
      out.push("FAQ:");
      for (const f of t.faqs) out.push(`Q: ${f.question}\nA: ${f.answer}`);
      out.push("");
    }
  }

  return new Response(out.join("\n"), {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
