'use client';

import { useState } from 'react';

interface JdAnalysis {
  skills: string[];
  experienceLevel: string;
  education: string[];
  salaryRange: string;
  responsibilities: string[];
  keywords: string[];
  summary: string;
}

const skillPatterns = [
  'JavaScript', 'TypeScript', 'Python', 'Java', 'C\\+\\+', 'Go', 'Rust', 'Ruby',
  'React', 'Angular', 'Vue', 'Next\\.?js', 'Node\\.?js', 'Express', 'Django', 'Flask', 'Spring',
  'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Terraform', 'CI/CD',
  'SQL', 'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Elasticsearch',
  'Machine Learning', 'Deep Learning', 'NLP', 'TensorFlow', 'PyTorch',
  'Agile', 'Scrum', 'JIRA', 'Git', 'REST API', 'GraphQL',
  'Communication', 'Leadership', 'Problem.?solving', 'Team.?work', 'Analytical',
  'HTML', 'CSS', 'SASS', 'Tailwind', 'Bootstrap',
  'Figma', 'Sketch', 'Adobe XD', 'Photoshop',
];

const experiencePattern = /(\d+)\+?\s*(?:years?|yrs?)\s*(?:of)?\s*(?:experience)?/gi;
const educationPattern = /(Bachelor'?s?|Master'?s?|Ph\.?D?|B\.?S\.?|M\.?S\.?|B\.?Tech|M\.?Tech|MBA|degree)\s*(?:of|in)?\s*([\w\s&]+(?:Science|Engineering|Technology|Business|Computer|Information|Mathematics|Data|Marketing|Design))?/gi;
const salaryPattern = /(?:salary|compensation|pay|CTC|package)[:\s]*([\$₹]?\s*[\d,.]+\s*(?:[-–to]+\s*[\$₹]?\s*[\d,.]+)?\s*(?:per annum|p\.?a\.?|LPA|lakhs?|K|k)?)/gi;
const responsibilityPattern = /(?:responsible for|responsibilities include|you will|you'll|duties|role involves)[:\s]*([^.!?\n]+[.!?])?/gi;

function analyzeJd(text: string): JdAnalysis {
  const lower = text.toLowerCase();

  const foundSkills: string[] = [];
  for (const pattern of skillPatterns) {
    const regex = new RegExp(pattern, 'gi');
    if (regex.test(text)) {
      const clean = pattern.replace(/\\\+/g, '+').replace(/\\\./g, '.').replace(/\?/g, '');
      foundSkills.push(clean);
    }
  }

  const expMatches = [...text.matchAll(experiencePattern)];
  const experienceLevel = expMatches.length > 0
    ? [...new Set(expMatches.map((m) => m[0].trim()))].join(', ')
    : 'Not specified';

  const eduMatches = [...text.matchAll(educationPattern)];
  const education = eduMatches.length > 0
    ? [...new Set(eduMatches.map((m) => m[0].trim()))]
    : ['Not specified'];

  const salaryMatches = [...text.matchAll(salaryPattern)];
  const salaryRange = salaryMatches.length > 0
    ? [...new Set(salaryMatches.map((m) => m[0].trim()))].join(' | ')
    : 'Not mentioned';

  const respMatches = [...text.matchAll(responsibilityPattern)];
  const responsibilities = respMatches.length > 0
    ? respMatches.map((m) => m[0].trim()).slice(0, 8)
    : [];

  const importantWords = lower.split(/\W+/).filter((w) => w.length > 4);
  const wordFreq: Record<string, number> = {};
  for (const w of importantWords) {
    wordFreq[w] = (wordFreq[w] || 0) + 1;
  }
  const keywords = Object.entries(wordFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12)
    .map(([w]) => w);

  const sentences = text.split(/[.!\n]+/).filter((s) => s.trim().length > 20);
  const summary = sentences.slice(0, 2).join('. ').trim() + '.';

  return { skills: foundSkills, experienceLevel, education, salaryRange, responsibilities, keywords, summary };
}

export function JobDescriptionAnalyzerTool() {
  const [jdText, setJdText] = useState('');
  const [result, setResult] = useState<JdAnalysis | null>(null);

  const handleAnalyze = () => {
    if (!jdText.trim()) return;
    setResult(analyzeJd(jdText));
  };

  return (
    <div className="card">
      <div className="space-y-6">
        <div>
          <label className="label">Paste Job Description</label>
          <textarea value={jdText} onChange={(e) => setJdText(e.target.value)} placeholder="Paste the full job description here..." rows={10} className="input mt-1 resize-none" />
        </div>
        <button onClick={handleAnalyze} disabled={!jdText.trim()} className="btn-primary w-full disabled:opacity-40">Analyze Job Description</button>

        {result && (
          <div className="space-y-5">
            <div className="rounded-xl bg-gray-50 p-5 dark:bg-gray-800/50">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Summary</h3>
              <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">{result.summary}</p>
            </div>

            <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Skills Found ({result.skills.length})</h3>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {result.skills.length > 0 ? result.skills.map((skill) => (
                  <span key={skill} className="rounded-full bg-brand-100 px-2.5 py-1 text-xs font-medium text-brand-700 dark:bg-brand-900/50 dark:text-brand-300">{skill}</span>
                )) : <p className="text-sm text-gray-500 dark:text-gray-400">No specific skills detected.</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Experience Required</h3>
                <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">{result.experienceLevel}</p>
              </div>
              <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Education</h3>
                <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">{result.education.join(', ')}</p>
              </div>
              <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Salary Range</h3>
                <p className="mt-2 text-sm text-green-600 dark:text-green-400">{result.salaryRange}</p>
              </div>
              <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Key Keywords</h3>
                <div className="mt-2 flex flex-wrap gap-1">
                  {result.keywords.map((kw) => (
                    <span key={kw} className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-700 dark:bg-gray-800 dark:text-gray-300">{kw}</span>
                  ))}
                </div>
              </div>
            </div>

            {result.responsibilities.length > 0 && (
              <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Key Responsibilities</h3>
                <ul className="mt-2 space-y-2">
                  {result.responsibilities.map((r, i) => (
                    <li key={i} className="flex gap-2 text-sm text-gray-700 dark:text-gray-300">
                      <span className="text-brand-600 dark:text-brand-400">•</span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="rounded-lg bg-blue-50 p-4 text-xs text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">
              This analysis is based on pattern matching. For the most accurate results, review the original job description alongside this analysis.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
