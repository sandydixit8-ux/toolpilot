import { allTools } from "../../src/config/tools";
import type { ToolConfig } from "../../src/types/tool";

const SITE = "https://www.toolpilotpro.in";
const EPOCH_MS = new Date("2026-01-01T00:00:00+05:30").getTime();

export interface ShortSlides {
  header: string;
  title: string;
  steps: string[];
  cta: string;
}

export interface ShortPlan {
  tool: ToolConfig;
  title: string;
  description: string;
  tags: string[];
  narration: string;
  slides: ShortSlides;
}

function clean(s: string): string {
  return s.replace(/\s+/g, " ").trim();
}

function clip(s: string, max = 120): string {
  return s.length > max ? s.slice(0, max - 3).trimEnd() + "..." : s;
}

function dayIndex(offset: number): number {
  const start = Math.floor(EPOCH_MS / 86400000);
  const now = Math.floor(Date.now() / 86400000);
  return now - start + offset;
}

export function pickTool(offset = 0): ToolConfig {
  const day = dayIndex(offset);
  const n = allTools.length;
  return allTools[((day % n) + n) % n];
}

export function planShort(tool: ToolConfig): ShortPlan {
  const steps = (tool.instructions || [])
    .map(clean)
    .filter(Boolean)
    .slice(0, 3)
    .map((s) => clip(s, 110));

  const hook = `Need a free ${tool.name}?`;
  const body = steps.length
    ? `Here is how it works in ${steps.length} quick steps. ` +
      steps.map((s, i) => `Step ${i + 1}. ${s}`).join(" ")
    : clean(tool.description);
  const cta = "Try it free at ToolPilotPro dot in. No sign up needed.";
  const narration = clean([hook, body, cta].join(" "));

  const description = [
    clean(tool.description),
    "",
    `Free online ${tool.name} - no signup, runs in your browser.`,
    `${SITE}/tools/${tool.slug}`,
    "",
    "#Shorts #FreeTools #ToolPilot",
  ].join("\n");

  const title = clip(`${tool.name} - Free Online Tool (No Signup) #Shorts`, 100);

  const tags = Array.from(
    new Set([
      tool.name.toLowerCase(),
      "free tools",
      "online tools",
      "no signup",
      ...tool.keywords.map((k) => k.toLowerCase()),
      "toolpilot",
    ])
  ).slice(0, 15);

  return {
    tool,
    title,
    description,
    tags,
    narration,
    slides: {
      header: "ToolPilotPro.in",
      title: tool.name,
      steps: steps.map((s, i) => `${i + 1}. ${s}`),
      cta: "100% Free - No Signup",
    },
  };
}
