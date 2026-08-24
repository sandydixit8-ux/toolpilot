export interface ParsedResume {
  rawText: string;
  atsViewText: string;
  parsedJson: {
    contactInfo: { name: string; email: string; phone: string; linkedin: string; location: string };
    summary: string;
    skills: string[];
    experience: { title: string; company: string; dates: string; bullets: string[] }[];
    education: { institution: string; degree: string; dates: string; details: string[] }[];
    certifications: string[];
    projects: { title: string; company: string; dates: string; bullets: string[] }[];
  };
  issues: { type: string; detail: string; severity: string }[];
}

const SECTION_KEYWORDS: Record<string, RegExp> = {
  contact: /^(?:contact|personal\s*info|contact\s*information)/i,
  summary: /^(?:summary|professional\s*summary|profile|objective|about\s*me)/i,
  skills: /^(?:skills|technical\s*skills|core\s*competencies|expertise|technologies|tech\s*stack)/i,
  experience: /^(?:experience|work\s*experience|employment|professional\s*experience|career\s*history)/i,
  education: /^(?:education|academic|qualifications?|degrees?)/i,
  certifications: /^(?:certifications?|certificates?|licenses?|accreditations?)/i,
  projects: /^(?:projects?|personal\s*projects?|key\s*projects?|portfolio)/i,
};

function extractContactInfo(text: string) {
  const email = text.match(/[\w.+-]+@[\w-]+\.[\w.-]+/)?.[0] || "";
  const phone = text.match(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/)?.[0] || "";
  const linkedin = text.match(/linkedin\.com\/in\/[\w-]+/i)?.[0] || "";
  const location = text.match(/([A-Za-z\s]+,\s*[A-Z]{2})/)?.[0]?.trim() || "";
  const lines = text.split("\n").map(l => l.trim()).filter(Boolean);
  const name = lines[0] && lines[0].length < 60 && !lines[0].includes("@") ? lines[0] : "";
  return { name, email, phone, linkedin, location };
}

function parseExperienceBlock(text: string) {
  if (!text.trim()) return [];
  const entries: { title: string; company: string; dates: string; bullets: string[] }[] = [];
  const blocks = text.split(/\n\s*\n/);
  for (const block of blocks) {
    const lines = block.split("\n").map(l => l.trim()).filter(Boolean);
    if (!lines.length) continue;
    const entry = { title: lines[0], company: "", dates: "", bullets: [] as string[] };
    for (const line of lines.slice(1)) {
      if (/[A-Za-z]{3,9}\s*\d{4}\s*[-–to]+\s*([A-Za-z]{3,9}\s*\d{4}|Present|Current|Now)/i.test(line)) {
        entry.dates = line;
      } else if (!entry.company && line.length < 60) {
        entry.company = line;
      } else {
        entry.bullets.push(line.replace(/^[\u2022\-*0-9)\s.]+/, ""));
      }
    }
    entries.push(entry);
  }
  return entries;
}

function parseEducationBlock(text: string) {
  if (!text.trim()) return [];
  const entries: { institution: string; degree: string; dates: string; details: string[] }[] = [];
  const blocks = text.split(/\n\s*\n/);
  for (const block of blocks) {
    const lines = block.split("\n").map(l => l.trim()).filter(Boolean);
    if (!lines.length) continue;
    const entry = { institution: lines[0], degree: "", dates: "", details: [] as string[] };
    for (const line of lines.slice(1)) {
      if (/[A-Za-z]{3,9}\s*\d{4}\s*[-–to]+\s*([A-Za-z]{3,9}\s*\d{4}|Present|Expected)/i.test(line)) {
        entry.dates = line;
      } else if (!entry.degree && /bachelor|master|phd|b\.s|m\.s|b\.a|m\.a|associate|diploma|ph\.d|b\.tech|m\.tech/i.test(line)) {
        entry.degree = line;
      } else {
        entry.details.push(line);
      }
    }
    entries.push(entry);
  }
  return entries;
}

function parseSections(text: string) {
  const lines = text.split("\n");
  const sections: Record<string, string[]> = {};
  let currentSection = "header";
  let currentContent: string[] = [];

  for (const line of lines) {
    const stripped = line.trim();
    if (!stripped) {
      currentContent.push("");
      continue;
    }
    let matched = false;
    for (const [name, pattern] of Object.entries(SECTION_KEYWORDS)) {
      if (pattern.test(stripped) && stripped.length < 60) {
        if (currentContent.length) sections[currentSection] = currentContent;
        currentSection = name;
        currentContent = [];
        matched = true;
        break;
      }
    }
    if (!matched) currentContent.push(stripped);
  }
  if (currentContent.length) sections[currentSection] = currentContent;

  const rawText = Object.values(sections).flat().join("\n");
  const contactInfo = extractContactInfo(sections.header?.join("\n") || "");
  const summary = sections.summary?.join("\n") || "";

  const skillsText = sections.skills?.join("\n") || "";
  const skills = skillsText ? skillsText.split(/[,|\u2022\n]/).map(s => s.trim()).filter(Boolean) : [];

  const experience = parseExperienceBlock(sections.experience?.join("\n") || "");
  const education = parseEducationBlock(sections.education?.join("\n") || "");
  const certifications = sections.certifications?.filter(Boolean) || [];
  const projects = parseExperienceBlock(sections.projects?.join("\n") || "");

  return { contactInfo, summary, skills, experience, education, certifications, projects };
}

function detectIssues(text: string, pages?: { text: string; tables: number; images: number }[]) {
  const issues: { type: string; detail: string; severity: string }[] = [];

  if (pages) {
    for (let i = 0; i < pages.length; i++) {
      const page = pages[i];
      if (page.tables > 0) issues.push({ type: "table", detail: `Table detected on page ${i + 1}`, severity: "high" });
      if (page.images > 0) issues.push({ type: "image", detail: `${page.images} image(s) on page ${i + 1}`, severity: "medium" });
    }
  }

  const parsed = parseSections(text);
  const sectionCount = [parsed.summary, parsed.skills.length, parsed.experience.length, parsed.education.length].filter(Boolean).length;
  if (sectionCount < 2) issues.push({ type: "insufficient_content", detail: "Very little structured content found", severity: "high" });
  if (!parsed.contactInfo.email) issues.push({ type: "missing_contact", detail: "No email address found", severity: "medium" });
  if (!parsed.skills.length) issues.push({ type: "missing_skills", detail: "No skills section found", severity: "medium" });
  if (!parsed.experience.length) issues.push({ type: "missing_experience", detail: "No work experience found", severity: "medium" });
  if (text.length < 200) issues.push({ type: "too_short", detail: `Only ${text.length} characters — resume is too brief`, severity: "high" });

  const bullets = (text.match(/[\u2022\-*]/g) || []).length;
  if (bullets < 3 && parsed.experience.length > 0) issues.push({ type: "few_bullets", detail: "Use bullet points for achievements", severity: "medium" });

  if (/\b(table|column|text\s*box|header|footer)\b/i.test(text)) {
    issues.push({ type: "formatting", detail: "Possible complex formatting detected — may confuse ATS", severity: "medium" });
  }

  return issues;
}

export function parseTextResume(text: string): ParsedResume {
  const parsed = parseSections(text);
  const issues = detectIssues(text);
  const atsView = text.split("\n").map(l => l.trim()).filter(Boolean).join("\n");
  return { rawText: text, atsViewText: atsView, parsedJson: parsed, issues };
}

export async function parsePDFResume(arrayBuffer: ArrayBuffer): Promise<ParsedResume> {
  const pdfjsLib = await import("pdfjs-dist");
  pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const pages: { text: string; tables: number; images: number }[] = [];
  let fullText = "";

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items.map((item) => ("str" in item ? item.str : "")).join(" ");
    fullText += pageText + "\n";

    const ops = await page.getOperatorList();
    const imageCount = ops.fnArray.filter((fn: number) => fn === 82).length;
    pages.push({ text: pageText, tables: 0, images: imageCount });
  }

  const parsed = parseSections(fullText);
  const issues = detectIssues(fullText, pages);
  const atsView = fullText.split("\n").map(l => l.trim()).filter(Boolean).join("\n");
  return { rawText: fullText, atsViewText: atsView, parsedJson: parsed, issues };
}

export async function parseDOCXResume(arrayBuffer: ArrayBuffer): Promise<ParsedResume> {
  const mammoth = await import("mammoth");
  const result = await mammoth.extractRawText({ arrayBuffer });
  const text = result.value;
  const parsed = parseSections(text);
  const issues = detectIssues(text);
  const atsView = text.split("\n").map(l => l.trim()).filter(Boolean).join("\n");
  return { rawText: text, atsViewText: atsView, parsedJson: parsed, issues };
}

export async function parseResumeFile(file: File): Promise<ParsedResume> {
  const ext = file.name.split(".").pop()?.toLowerCase();
  const buffer = await file.arrayBuffer();

  if (ext === "pdf") return parsePDFResume(buffer);
  if (ext === "docx" || ext === "doc") return parseDOCXResume(buffer);
  if (ext === "txt") {
    const text = new TextDecoder().decode(buffer);
    return parseTextResume(text);
  }
  throw new Error(`Unsupported file type: ${ext}`);
}
