'use client';

import { useState } from 'react';

interface AtsResult {
  score: number;
  sections: { label: string; score: number; tip: string }[];
  suggestions: string[];
}

function analyzeAts(resumeText: string, jobDescription: string): AtsResult {
  const text = resumeText.toLowerCase();
  const jd = jobDescription.toLowerCase();

  const sections: AtsResult['sections'] = [];

  const hasContact = /\b[\w.-]+@[\w.-]+\.\w+\b/.test(resumeText);
  sections.push({
    label: 'Contact Information',
    score: hasContact ? 100 : 0,
    tip: hasContact ? 'Email found.' : 'Add a professional email address.',
  });

  const hasSummary = /(summary|objective|profile)/i.test(resumeText) && resumeText.split('\n').length > 3;
  sections.push({
    label: 'Professional Summary',
    score: hasSummary ? 100 : 30,
    tip: hasSummary ? 'Summary section detected.' : 'Add a brief professional summary at the top.',
  });

  const hasExperience = /(experience|employment|work history)/i.test(resumeText);
  sections.push({
    label: 'Work Experience',
    score: hasExperience ? 100 : 0,
    tip: hasExperience ? 'Experience section found.' : 'Include a work experience section with bullet points.',
  });

  const hasEducation = /(education|degree|university|college|bachelor|master|phd)/i.test(resumeText);
  sections.push({
    label: 'Education',
    score: hasEducation ? 100 : 20,
    tip: hasEducation ? 'Education section found.' : 'Add your educational background.',
  });

  const hasSkills = /(skills|technologies|tools|competencies)/i.test(resumeText);
  sections.push({
    label: 'Skills Section',
    score: hasSkills ? 100 : 10,
    tip: hasSkills ? 'Skills section detected.' : 'Add a dedicated skills section.',
  });

  let keywordScore = 0;
  let matchedKeywords: string[] = [];
  let missingKeywords: string[] = [];

  if (jd.length > 0) {
    const jdWords = jd.split(/\W+/).filter((w) => w.length > 3);
    const uniqueJdWords = [...new Set(jdWords)];
    matchedKeywords = uniqueJdWords.filter((w) => text.includes(w));
    missingKeywords = uniqueJdWords.filter((w) => !text.includes(w));
    keywordScore = uniqueJdWords.length > 0 ? Math.round((matchedKeywords.length / uniqueJdWords.length) * 100) : 100;
  }

  if (jobDescription) {
    sections.push({
      label: 'Keyword Match',
      score: keywordScore,
      tip: keywordScore >= 70
        ? `${matchedKeywords.length} keywords matched with the job description.`
        : `Only ${matchedKeywords.length} of ${matchedKeywords.length + missingKeywords.length} keywords found. Add more relevant terms.`,
    });
  }

  const lineCount = resumeText.split('\n').filter((l) => l.trim()).length;
  const hasBullets = /[•\-\*]/.test(resumeText);
  sections.push({
    label: 'Formatting',
    score: lineCount > 10 && hasBullets ? 100 : lineCount > 5 ? 60 : 20,
    tip: hasBullets ? 'Good use of bullet points.' : 'Use bullet points for better readability.',
  });

  const avgScore = Math.round(sections.reduce((a, s) => a + s.score, 0) / sections.length);

  const suggestions: string[] = [];
  if (!hasContact) suggestions.push('Add your email and phone number at the top.');
  if (!hasSummary) suggestions.push('Add a 2-3 line professional summary.');
  if (!hasExperience) suggestions.push('Include your work experience with achievements.');
  if (!hasEducation) suggestions.push('Add your education details.');
  if (!hasSkills) suggestions.push('Include a skills section with relevant keywords.');
  if (jobDescription && keywordScore < 50) suggestions.push('Tailor your resume by adding keywords from the job description.');
  if (!hasBullets) suggestions.push('Use bullet points (•) for listing achievements.');
  if (resumeText.length < 200) suggestions.push('Your resume seems too short. Add more details.');

  return { score: avgScore, sections, suggestions };
}

export function ResumeAtsCheckerTool() {
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [result, setResult] = useState<AtsResult | null>(null);

  const handleAnalyze = () => {
    if (!resumeText.trim()) return;
    setResult(analyzeAts(resumeText, jobDescription));
  };

  return (
    <div className="card">
      <div className="space-y-6">
        <div>
          <label className="label">Paste Your Resume</label>
          <textarea value={resumeText} onChange={(e) => setResumeText(e.target.value)} placeholder="Paste your resume text here..." rows={8} className="input mt-1 resize-none" />
        </div>
        <div>
          <label className="label">Job Description <span className="text-gray-400 dark:text-gray-500">(optional)</span></label>
          <textarea value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} placeholder="Paste the job description for keyword matching..." rows={4} className="input mt-1 resize-none" />
        </div>
        <button onClick={handleAnalyze} disabled={!resumeText.trim()} className="btn-primary w-full disabled:opacity-40">Analyze Resume</button>

        {result && (
          <div className="space-y-4">
            <div className="rounded-xl bg-gray-50 p-5 text-center dark:bg-gray-800/50">
              <p className="text-sm text-gray-600 dark:text-gray-400">ATS Score</p>
              <p className={`mt-1 text-4xl font-bold ${result.score >= 70 ? 'text-green-600 dark:text-green-400' : result.score >= 40 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'}`}>
                {result.score}%
              </p>
            </div>

            <div className="space-y-3">
              {result.sections.map((s) => (
                <div key={s.label} className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800/50">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{s.label}</span>
                    <span className={`text-sm font-semibold ${s.score >= 70 ? 'text-green-600 dark:text-green-400' : s.score >= 40 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'}`}>{s.score}%</span>
                  </div>
                  <div className="mt-1 h-1.5 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                    <div className={`h-1.5 rounded-full ${s.score >= 70 ? 'bg-green-500' : s.score >= 40 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${s.score}%` }} />
                  </div>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{s.tip}</p>
                </div>
              ))}
            </div>

            {result.suggestions.length > 0 && (
              <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-950/50">
                <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-300">Suggestions</h4>
                <ul className="mt-2 space-y-1">
                  {result.suggestions.map((s, i) => (
                    <li key={i} className="text-xs text-blue-800 dark:text-blue-400">• {s}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
