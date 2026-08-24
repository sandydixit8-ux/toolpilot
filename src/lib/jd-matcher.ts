import { ParsedResume } from "./resume-parser";

export interface JdMatchResult {
  matchScore: number;
  matchedKeywords: { skill: string; category: string }[];
  missingHardRequirements: { skill: string; reason: string }[];
  niceToHave: { skill: string }[];
  semanticGaps: { jdTerm: string; suggestion: string }[];
  overIndexed: { item: string; type: string; suggestion: string }[];
  strengths: string[];
  improvements: string[];
}

const HARD_KEYWORDS = [
  "python", "javascript", "typescript", "react", "angular", "vue", "node.js", "nodejs",
  "java", "c++", "c#", "go", "rust", "php", "ruby", "swift", "kotlin",
  "sql", "mysql", "postgresql", "mongodb", "redis", "elasticsearch",
  "aws", "azure", "gcp", "docker", "kubernetes", "terraform", "jenkins", "ci/cd",
  "machine learning", "deep learning", "nlp", "data science", "tensorflow", "pytorch",
  "html", "css", "sass", "tailwind", "bootstrap",
  "git", "agile", "scrum", "jira", "confluence",
  "rest api", "graphql", "grpc", "microservices",
  "linux", "bash", "powershell",
  "excel", "power bi", "tableau", "sql server",
  "project management", "stakeholder management", "budget management",
  "leadership", "team management", "mentoring",
];

const SEMANTIC_MAP: Record<string, string[]> = {
  "leadership": ["lead", "manage", "mentor", "guide", "direct", "supervise"],
  "communication": ["present", "write", "report", "collaborate", "negotiate"],
  "problem-solving": ["troubleshoot", "debug", "resolve", "analyze", "investigate"],
  "teamwork": ["collaborate", "cross-functional", "stakeholder", "partner"],
  "agile": ["scrum", "sprint", "kanban", "standup", "retrospective"],
  "cloud": ["aws", "azure", "gcp", "cloud", "saas", "iaas", "paas"],
  "database": ["sql", "mysql", "postgresql", "mongodb", "redis", "oracle"],
  "frontend": ["react", "angular", "vue", "html", "css", "javascript", "typescript"],
  "backend": ["node", "python", "java", "go", "api", "rest", "graphql"],
  "devops": ["ci/cd", "docker", "kubernetes", "terraform", "jenkins", "gitops"],
  "testing": ["test", "qa", "automation", "selenium", "jest", "cypress"],
  "data": ["analytics", "etl", "pipeline", "warehouse", "visualization"],
  "security": ["auth", "encryption", "compliance", "audit", "vulnerability"],
  "mobile": ["ios", "android", "react native", "flutter", "swift", "kotlin"],
  "management": ["plan", "budget", "schedule", "resource", "risk", "scope"],
};

function extractKeywords(text: string): string[] {
  const lower = text.toLowerCase();
  const words = lower.split(/\W+/).filter(w => w.length > 3);
  const unique = [...new Set(words)];

  const found: string[] = [];
  for (const kw of HARD_KEYWORDS) {
    if (lower.includes(kw)) found.push(kw);
  }
  for (const word of unique) {
    if (!found.includes(word) && word.length > 4) found.push(word);
  }
  return found;
}

function findSemanticGaps(jdText: string, resumeText: string): { jdTerm: string; suggestion: string }[] {
  const gaps: { jdTerm: string; suggestion: string }[] = [];
  const jdLower = jdText.toLowerCase();
  const resumeLower = resumeText.toLowerCase();

  for (const [concept, synonyms] of Object.entries(SEMANTIC_MAP)) {
    const jdMentions = synonyms.some(s => jdLower.includes(s));
    const resumeMentions = synonyms.some(s => resumeLower.includes(s));
    if (jdMentions && !resumeMentions) {
      gaps.push({
        jdTerm: concept,
        suggestion: `JD mentions "${concept}" concepts. Consider adding: ${synonyms.filter(s => jdLower.includes(s)).join(", ")}`,
      });
    }
  }
  return gaps;
}

function findOverIndexed(parsed: ParsedResume, jdText: string): { item: string; type: string; suggestion: string }[] {
  const over: { item: string; type: string; suggestion: string }[] = [];
  const jdLower = jdText.toLowerCase();

  for (const skill of parsed.parsedJson.skills) {
    if (!jdLower.includes(skill.toLowerCase())) {
      over.push({ item: skill, type: "skill", suggestion: "Not mentioned in JD — consider removing or de-emphasizing" });
    }
  }

  for (const cert of parsed.parsedJson.certifications) {
    if (!jdLower.includes(cert.toLowerCase())) {
      over.push({ item: cert, type: "certification", suggestion: "Not required by JD — still valuable but not prioritized" });
    }
  }

  for (const proj of parsed.parsedJson.projects) {
    const projText = `${proj.title} ${proj.bullets.join(" ")}`.toLowerCase();
    const jdWords = jdLower.split(/\W+/);
    const overlap = jdWords.filter(w => w.length > 3 && projText.includes(w)).length;
    if (overlap < 2) {
      over.push({ item: proj.title, type: "project", suggestion: "Low relevance to this JD" });
    }
  }

  return over.slice(0, 10);
}

export function matchJobDescription(parsed: ParsedResume, jdText: string, jdTitle?: string, company?: string): JdMatchResult {
  const resumeText = `${parsed.rawText} ${parsed.parsedJson.skills.join(" ")}`.toLowerCase();
  const jdLower = jdText.toLowerCase();

  const jdKeywords = extractKeywords(jdText);
  const matchedKeywords: { skill: string; category: string }[] = [];
  const missingHard: { skill: string; reason: string }[] = [];
  const niceToHave: { skill: string }[] = [];

  for (const kw of jdKeywords) {
    if (resumeText.includes(kw)) {
      const isHard = HARD_KEYWORDS.includes(kw);
      matchedKeywords.push({ skill: kw, category: isHard ? "hard" : "soft" });
    } else {
      const isHard = HARD_KEYWORDS.includes(kw);
      if (isHard) {
        missingHard.push({ skill: kw, reason: "Required skill not found on resume" });
      } else {
        niceToHave.push({ skill: kw });
      }
    }
  }

  const matchScore = jdKeywords.length > 0 ? Math.round((matchedKeywords.length / jdKeywords.length) * 100) : 0;
  const semanticGaps = findSemanticGaps(jdText, parsed.rawText);
  const overIndexed = findOverIndexed(parsed, jdText);

  const strengths: string[] = [];
  if (matchedKeywords.length >= 5) strengths.push(`${matchedKeywords.length} keywords matched with the job description`);
  if (/(leadership|team|manage|lead)/i.test(parsed.rawText) && /leadership|team/i.test(jdText)) strengths.push("Leadership experience aligns with JD requirements");
  if (/\d+/.test(parsed.rawText)) strengths.push("Quantified achievements detected");
  if (parsed.parsedJson.experience.length >= 3) strengths.push(`${parsed.parsedJson.experience.length} roles — strong experience depth`);
  if (parsed.parsedJson.skills.length >= 10) strengths.push(`${parsed.parsedJson.skills.length} skills listed — good keyword coverage`);

  const improvements: string[] = [];
  if (missingHard.length > 0) improvements.push(`Add missing required skills: ${missingHard.slice(0, 5).map(k => k.skill).join(", ")}`);
  if (matchScore < 50) improvements.push("Low keyword alignment — tailor your resume to this specific role");
  if (semanticGaps.length > 0) improvements.push(`Address semantic gaps: ${semanticGaps.slice(0, 3).map(g => g.jdTerm).join(", ")}`);
  if (overIndexed.length > 3) improvements.push("Several items on your resume aren't relevant to this JD — consider removing them");
  if (parsed.rawText.split("\n").length < 15) improvements.push("Resume seems short — add more detail about relevant experience");

  return { matchScore, matchedKeywords, missingHardRequirements: missingHard, niceToHave: niceToHave.slice(0, 20), semanticGaps, overIndexed, strengths, improvements };
}
