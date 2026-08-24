import { ParsedResume } from "./resume-parser";

export interface RewriteSuggestion {
  section: string;
  type: "cliche" | "weak" | "missing" | "improve";
  original: string;
  suggestion: string;
  explanation: string;
}

const CLICHE_PHRASES: Record<string, string> = {
  "team player": "Collaborated with cross-functional teams to deliver",
  "hard worker": "Consistently exceeded targets by",
  "go-getter": "Proactively initiated",
  "detail-oriented": "Maintained 99% accuracy in",
  "results-driven": "Achieved measurable results including",
  "self-starter": "Independently launched",
  "excellent communication": "Presented findings to",
  "think outside the box": "Developed innovative approach that",
  "passionate about": "Dedicated to",
  "dynamic": "Adaptable professional who",
  "synergy": "Combined efforts across",
  "leverage": "Utilized",
  "hit the ground running": "Immediately contributed to",
  "wore many hats": "Managed multiple responsibilities including",
};

const WEAK_VERBS: Record<string, string> = {
  "responsible for": "Led",
  "helped with": "Contributed to",
  "assisted in": "Supported",
  "worked on": "Developed",
  "was involved in": "Participated in",
  "did": "Executed",
  "made": "Created",
  "used": "Implemented",
  "handled": "Managed",
  "dealt with": "Resolved",
  "took care of": "Oversaw",
};

const ACTION_VERBS = [
  "Led", "Managed", "Developed", "Created", "Implemented", "Built", "Designed",
  "Improved", "Increased", "Reduced", "Optimized", "Streamlined", "Launched",
  "Delivered", "Achieved", "Generated", "Saved", "Automated", "Scaled",
  "Negotiated", "Mentored", "Pioneered", "Spearheaded", "Orchestrated",
];

function checkCliches(bullets: string[]): { original: string; suggestion: string; explanation: string }[] {
  const results: { original: string; suggestion: string; explanation: string }[] = [];
  for (const bullet of bullets) {
    const lower = bullet.toLowerCase();
    for (const [cliche, replacement] of Object.entries(CLICHE_PHRASES)) {
      if (lower.includes(cliche)) {
        const replaced = bullet.replace(new RegExp(cliche, "i"), replacement);
        results.push({ original: bullet, suggestion: replaced, explanation: `"${cliche}" is overused. Use specific, quantified language instead.` });
      }
    }
  }
  return results;
}

function checkWeakVerbs(bullets: string[]): { original: string; suggestion: string; explanation: string }[] {
  const results: { original: string; suggestion: string; explanation: string }[] = [];
  for (const bullet of bullets) {
    const lower = bullet.toLowerCase();
    for (const [weak, strong] of Object.entries(WEAK_VERBS)) {
      if (lower.startsWith(weak)) {
        const replaced = bullet.replace(new RegExp(`^${weak}`, "i"), strong);
        results.push({ original: bullet, suggestion: replaced, explanation: `"${weak}" is passive. Use a stronger action verb like "${strong}".` });
      }
    }
  }
  return results;
}

function checkNumbers(bullets: string[]): { original: string; suggestion: string; explanation: string }[] {
  const results: { original: string; suggestion: string; explanation: string }[] = [];
  for (const bullet of bullets) {
    if (!/\d+/.test(bullet) && bullet.length > 20) {
      const verb = ACTION_VERBS[Math.floor(Math.random() * ACTION_VERBS.length)];
      results.push({
        original: bullet,
        suggestion: `${verb} [specific metric] — ${bullet.replace(/^[a-z]+/i, "").trim()}`,
        explanation: "Add numbers to quantify your achievement (e.g., percentage, dollar amount, team size).",
      });
    }
  }
  return results;
}

function checkBulletLength(bullets: string[]): { original: string; suggestion: string; explanation: string }[] {
  const results: { original: string; suggestion: string; explanation: string }[] = [];
  for (const bullet of bullets) {
    if (bullet.length > 150) {
      const truncated = bullet.substring(0, 120).replace(/,\s*[^,]*$/, "") + "...";
      results.push({ original: bullet, suggestion: truncated, explanation: "Bullet point is too long. Keep it under 100-120 characters for readability." });
    }
  }
  return results;
}

export function generateRewriteSuggestions(parsed: ParsedResume): RewriteSuggestion[] {
  const suggestions: RewriteSuggestion[] = [];
  const allBullets = parsed.parsedJson.experience.flatMap(e => e.bullets);

  for (const cliche of checkCliches(allBullets)) {
    suggestions.push({ section: "Experience", type: "cliche", ...cliche });
  }

  for (const weak of checkWeakVerbs(allBullets)) {
    suggestions.push({ section: "Experience", type: "weak", ...weak });
  }

  for (const num of checkNumbers(allBullets)) {
    suggestions.push({ section: "Experience", type: "improve", ...num });
  }

  for (const long of checkBulletLength(allBullets)) {
    suggestions.push({ section: "Experience", type: "improve", ...long });
  }

  if (!parsed.parsedJson.summary) {
    const topSkills = parsed.parsedJson.skills.slice(0, 3).join(", ") || "relevant technologies";
    suggestions.push({
      section: "Summary",
      type: "missing",
      original: "(no summary)",
      suggestion: `Experienced professional with expertise in ${topSkills}. Proven track record of delivering results.`,
      explanation: "A professional summary at the top of your resume helps ATS and recruiters quickly understand your value.",
    });
  }

  if (parsed.parsedJson.experience.length > 0 && parsed.parsedJson.experience.every(e => e.bullets.length < 3)) {
    suggestions.push({
      section: "Experience",
      type: "missing",
      original: "Current bullet count is low",
      suggestion: "Add 3-5 bullet points per role, each starting with an action verb and including a quantified result.",
      explanation: "Strong resumes have 3-5 bullet points per role with measurable achievements.",
    });
  }

  return suggestions.slice(0, 15);
}
