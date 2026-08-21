'use client';

import { useState } from 'react';

interface MatchResult {
  matchPercentage: number;
  matchingKeywords: string[];
  missingKeywords: string[];
  strengths: string[];
  improvements: string[];
}

function analyzeMatch(resumeText: string, jobDescription: string): MatchResult {
  const resumeLower = resumeText.toLowerCase();
  const jdLower = jobDescription.toLowerCase();

  const jdWords = [...new Set(jdLower.split(/\W+/).filter((w) => w.length > 3))];
  const matchingKeywords = jdWords.filter((w) => resumeLower.includes(w));
  const missingKeywords = jdWords.filter((w) => !resumeLower.includes(w));

  const matchPercentage = jdWords.length > 0 ? Math.round((matchingKeywords.length / jdWords.length) * 100) : 0;

  const strengths: string[] = [];
  const improvements: string[] = [];

  if (matchingKeywords.length > 0) strengths.push(`${matchingKeywords.length} keywords matched with the job description.`);
  if (/(experience|worked|led|managed|developed)/i.test(resumeText)) strengths.push('Resume includes action verbs and experience language.');
  if (/\d+/.test(resumeText)) strengths.push('Resume contains quantified achievements (numbers detected).');

  if (missingKeywords.length > 0) improvements.push(`Add these missing keywords: ${missingKeywords.slice(0, 10).join(', ')}${missingKeywords.length > 10 ? '...' : ''}.`);
  if (matchPercentage < 50) improvements.push('Your resume has low keyword alignment. Consider tailoring it to this role.');
  if (!/(leadership|team|collaborate)/i.test(resumeText) && /leadership|team/i.test(jobDescription)) improvements.push('The job description mentions leadership — consider highlighting relevant experience.');
  if (resumeText.split('\n').length < 10) improvements.push('Your resume seems short. Add more detail about your experience.');

  return { matchPercentage, matchingKeywords, missingKeywords, strengths, improvements };
}

export function ResumeJdMatcherTool() {
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [result, setResult] = useState<MatchResult | null>(null);

  const handleMatch = () => {
    if (!resumeText.trim() || !jobDescription.trim()) return;
    setResult(analyzeMatch(resumeText, jobDescription));
  };

  return (
    <div className="card">
      <div className="space-y-6">
        <div>
          <label className="label">Your Resume</label>
          <textarea value={resumeText} onChange={(e) => setResumeText(e.target.value)} placeholder="Paste your resume text here..." rows={8} className="input mt-1 resize-none" />
        </div>
        <div>
          <label className="label">Job Description</label>
          <textarea value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} placeholder="Paste the job description here..." rows={8} className="input mt-1 resize-none" />
        </div>
        <button onClick={handleMatch} disabled={!resumeText.trim() || !jobDescription.trim()} className="btn-primary w-full disabled:opacity-40">Check Match</button>

        {result && (
          <div className="space-y-5">
            <div className="rounded-xl bg-gray-50 p-6 text-center dark:bg-gray-800/50">
              <p className="text-sm text-gray-600 dark:text-gray-400">Match Score</p>
              <p className={`mt-1 text-5xl font-bold ${result.matchPercentage >= 70 ? 'text-green-600 dark:text-green-400' : result.matchPercentage >= 40 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'}`}>
                {result.matchPercentage}%
              </p>
              <div className="mx-auto mt-3 h-2 w-3/4 rounded-full bg-gray-200 dark:bg-gray-700">
                <div className={`h-2 rounded-full ${result.matchPercentage >= 70 ? 'bg-green-500' : result.matchPercentage >= 40 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${result.matchPercentage}%` }} />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-lg bg-green-50 p-4 dark:bg-green-950/30">
                <h4 className="text-sm font-semibold text-green-800 dark:text-green-300">Matching Keywords ({result.matchingKeywords.length})</h4>
                <div className="mt-2 flex flex-wrap gap-1">
                  {result.matchingKeywords.length > 0 ? result.matchingKeywords.map((kw) => (
                    <span key={kw} className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700 dark:bg-green-900 dark:text-green-300">{kw}</span>
                  )) : <p className="text-xs text-green-700 dark:text-green-400">No matching keywords found.</p>}
                </div>
              </div>
              <div className="rounded-lg bg-red-50 p-4 dark:bg-red-950/30">
                <h4 className="text-sm font-semibold text-red-800 dark:text-red-300">Missing Keywords ({result.missingKeywords.length})</h4>
                <div className="mt-2 flex flex-wrap gap-1">
                  {result.missingKeywords.slice(0, 20).map((kw) => (
                    <span key={kw} className="rounded-full bg-red-100 px-2 py-0.5 text-xs text-red-700 dark:bg-red-900 dark:text-red-300">{kw}</span>
                  ))}
                </div>
              </div>
            </div>

            {result.strengths.length > 0 && (
              <div className="rounded-lg bg-green-50 p-4 dark:bg-green-950/30">
                <h4 className="text-sm font-semibold text-green-800 dark:text-green-300">Strengths</h4>
                <ul className="mt-2 space-y-1">
                  {result.strengths.map((s, i) => (
                    <li key={i} className="text-xs text-green-800 dark:text-green-400">✓ {s}</li>
                  ))}
                </ul>
              </div>
            )}

            {result.improvements.length > 0 && (
              <div className="rounded-lg bg-yellow-50 p-4 dark:bg-yellow-950/30">
                <h4 className="text-sm font-semibold text-yellow-800 dark:text-yellow-300">Improvements</h4>
                <ul className="mt-2 space-y-1">
                  {result.improvements.map((s, i) => (
                    <li key={i} className="text-xs text-yellow-800 dark:text-yellow-400">• {s}</li>
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
