import { ParsedResume } from "./resume-parser";

export interface AtsAnalysis {
  overallScore: number;
  grade: string;
  categoryScores: Record<string, number>;
  categoryFeedback: Record<string, string>;
  priorityFixes: string[];
  suggestions: string[];
}

function scoreContact(contact: ParsedResume["parsedJson"]["contactInfo"]): { score: number; feedback: string } {
  let score = 0;
  const parts: string[] = [];
  if (contact.name) { score += 25; parts.push("name"); }
  if (contact.email) { score += 25; parts.push("email"); }
  if (contact.phone) { score += 25; parts.push("phone"); }
  if (contact.linkedin) { score += 15; parts.push("LinkedIn"); }
  if (contact.location) { score += 10; parts.push("location"); }
  const feedback = score === 100
    ? "Complete contact information detected."
    : `Found ${parts.join(", ") || "none"}. Missing: ${["name", "email", "phone", "LinkedIn", "location"].filter(p => !parts.includes(p)).join(", ")}.`;
  return { score, feedback };
}

function scoreSummary(summary: string, rawText: string): { score: number; feedback: string } {
  if (!summary) return { score: 0, feedback: "No professional summary found. Add a 2-3 line summary at the top." };
  const words = summary.split(/\s+/).length;
  let score = 60;
  if (words >= 20 && words <= 60) score += 30;
  else if (words > 60) score += 15;
  else score += 10;
  if (/\d+/.test(summary)) score += 10;
  score = Math.min(score, 100);
  const feedback = score >= 80
    ? `Strong summary (${words} words)${/ \d+/.test(summary) ? " with quantified results" : ""}.`
    : words < 20 ? "Summary is too short. Aim for 20-60 words with key achievements." : "Summary could be more impactful — add numbers and results.";
  return { score, feedback };
}

function scoreExperience(experience: ParsedResume["parsedJson"]["experience"]): { score: number; feedback: string } {
  if (!experience.length) return { score: 0, feedback: "No work experience found. Add your work history with bullet points." };
  let score = 30;
  if (experience.length >= 2) score += 20;
  else score += 10;
  const totalBullets = experience.reduce((sum, e) => sum + e.bullets.length, 0);
  if (totalBullets >= 6) score += 20;
  else if (totalBullets >= 3) score += 10;
  const withNumbers = experience.flatMap(e => e.bullets).filter(b => /\d+/.test(b)).length;
  if (withNumbers >= 3) score += 20;
  else if (withNumbers >= 1) score += 10;
  const withVerbs = experience.flatMap(e => e.bullets).filter(b => /^(led|managed|developed|created|improved|reduced|increased|built|designed|implemented|launched|delivered|achieved|generated|optimized|streamlined)/i.test(b)).length;
  if (withVerbs >= 3) score += 10;
  score = Math.min(score, 100);
  const feedback = score >= 70
    ? `${experience.length} roles with ${totalBullets} bullet points. ${withNumbers} contain quantified results.`
    : `Only ${experience.length} role(s) with ${totalBullets} bullets. Add more detail, use action verbs, and include numbers.`;
  return { score, feedback };
}

function scoreEducation(education: ParsedResume["parsedJson"]["education"]): { score: number; feedback: string } {
  if (!education.length) return { score: 0, feedback: "No education found. Add your educational background." };
  let score = 50;
  if (education.length >= 2) score += 20;
  else score += 10;
  const hasDegree = education.some(e => e.degree);
  if (hasDegree) score += 20;
  const hasDetails = education.some(e => e.details.length > 0 || e.dates);
  if (hasDetails) score += 10;
  score = Math.min(score, 100);
  const feedback = hasDegree
    ? `${education.length} education entry/entries with degree details.`
    : "Add degree names and dates to strengthen this section.";
  return { score, feedback };
}

function scoreSkills(skills: string[]): { score: number; feedback: string } {
  if (!skills.length) return { score: 0, feedback: "No skills section found. Add relevant technical and soft skills." };
  let score = 30;
  if (skills.length >= 5) score += 20;
  else if (skills.length >= 3) score += 10;
  if (skills.length >= 10) score += 20;
  if (skills.length >= 15) score += 10;
  const avgLength = skills.reduce((sum, s) => sum + s.length, 0) / skills.length;
  if (avgLength > 4) score += 10;
  if (avgLength > 8) score += 10;
  score = Math.min(score, 100);
  const feedback = score >= 70
    ? `${skills.length} skills detected — good coverage.`
    : `Only ${skills.length} skill(s) found. Add 10-20 relevant skills for better ATS matching.`;
  return { score, feedback };
}

function scoreFormatting(rawText: string): { score: number; feedback: string } {
  const lines = rawText.split("\n").filter(l => l.trim()).length;
  const hasBullets = /[\u2022\-*]/.test(rawText);
  const hasNumbers = /\d{4}/.test(rawText);
  let score = 20;
  if (lines > 10) score += 20;
  else if (lines > 5) score += 10;
  if (hasBullets) score += 25;
  if (hasNumbers) score += 15;
  if (rawText.length > 500) score += 10;
  if (rawText.length > 1500) score += 10;
  score = Math.min(score, 100);
  const feedback = score >= 70
    ? "Good formatting with bullet points, dates, and sufficient content."
    : !hasBullets ? "Add bullet points for readability." : "Resume seems brief — add more detail and quantified achievements.";
  return { score, feedback };
}

export function analyzeResume(parsed: ParsedResume): AtsAnalysis {
  const { contactInfo, summary, experience, education, skills } = parsed.parsedJson;

  const contact = scoreContact(contactInfo);
  const summaryScore = scoreSummary(summary, parsed.rawText);
  const experienceScore = scoreExperience(experience);
  const educationScore = scoreEducation(education);
  const skillsScore = scoreSkills(skills);
  const formatScore = scoreFormatting(parsed.rawText);

  const categoryScores: Record<string, number> = {
    Contact: contact.score,
    Summary: summaryScore.score,
    Experience: experienceScore.score,
    Education: educationScore.score,
    Skills: skillsScore.score,
    Formatting: formatScore.score,
  };

  const categoryFeedback: Record<string, string> = {
    Contact: contact.feedback,
    Summary: summaryScore.feedback,
    Experience: experienceScore.feedback,
    Education: educationScore.feedback,
    Skills: skillsScore.feedback,
    Formatting: formatScore.feedback,
  };

  const overallScore = Math.round(Object.values(categoryScores).reduce((a, b) => a + b, 0) / Object.keys(categoryScores).length);
  const grade = overallScore >= 80 ? "A" : overallScore >= 60 ? "B" : overallScore >= 40 ? "C" : "D";

  const priorityFixes: string[] = [];
  if (contact.score < 50) priorityFixes.push("Add complete contact information (email, phone, LinkedIn)");
  if (summaryScore.score < 30) priorityFixes.push("Write a professional summary (20-60 words)");
  if (experienceScore.score < 40) priorityFixes.push("Add work experience with bullet points and achievements");
  if (skillsScore.score < 40) priorityFixes.push("Add 10-20 relevant skills");
  if (formatScore.score < 50) priorityFixes.push("Improve formatting — use bullet points and add more detail");

  const suggestions: string[] = [];
  if (summary && !/\d+/.test(summary)) suggestions.push("Add numbers to your summary (e.g., '10+ years', '500+ users')");
  const allBullets = experience.flatMap(e => e.bullets);
  if (allBullets.length > 0 && allBullets.filter(b => /\d+/.test(b)).length < allBullets.length * 0.5) {
    suggestions.push("Add quantified achievements to bullet points (e.g., 'Increased by 40%')");
  }
  if (skills.length > 0 && skills.length < 10) suggestions.push("Add more skills — aim for 10-20 keywords");
  if (parsed.rawText.length < 800) suggestions.push("Resume is brief — add more detail to each section");
  if (!parsed.parsedJson.contactInfo.linkedin) suggestions.push("Add your LinkedIn profile URL");

  return { overallScore, grade, categoryScores, categoryFeedback, priorityFixes, suggestions };
}
