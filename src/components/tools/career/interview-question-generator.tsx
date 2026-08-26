'use client';

import { useState } from 'react';

const questionBank: Record<string, Record<string, string[]>> = {
  'Software Engineer': {
    behavioral: [
      'Tell me about a time you had to debug a difficult issue. How did you approach it?',
      'Describe a project where you had to learn a new technology quickly.',
      'How do you handle disagreements with team members about technical decisions?',
      'Tell me about a time you had to prioritize between multiple tasks.',
      'Describe a situation where you had to simplify complex technical concepts for non-technical stakeholders.',
    ],
    technical: [
      'Explain the difference between REST and GraphQL. When would you use each?',
      'How does garbage collection work in your preferred language?',
      'Explain the concept of SOLID principles with examples.',
      'What is the difference between a process and a thread?',
      'How would you design a URL shortening service like bit.ly?',
    ],
    general: [
      'Why are you interested in this role?',
      'Where do you see yourself in 5 years?',
      'What is your greatest strength as a developer?',
      'How do you stay updated with new technologies?',
      'Describe your ideal work environment.',
    ],
  },
  'Product Manager': {
    behavioral: [
      'Tell me about a product you launched from idea to completion.',
      'Describe a time you had to say no to a stakeholder. How did you handle it?',
      'How do you prioritize features when you have limited resources?',
      'Tell me about a product decision that didn\'t go as planned.',
      'Describe a time you used data to drive a product decision.',
    ],
    technical: [
      'How do you define and track product metrics (KPIs)?',
      'Explain your process for writing product requirements documents.',
      'How do you balance user needs with business goals?',
      'What frameworks do you use for product prioritization?',
      'How do you conduct competitive analysis?',
    ],
    general: [
      'Why do you want to be a product manager?',
      'How do you handle ambiguity in requirements?',
      'What products do you admire and why?',
      'How do you work with engineering teams?',
      'What\'s your approach to user research?',
    ],
  },
  'Data Scientist': {
    behavioral: [
      'Tell me about a project where you had messy data. How did you handle it?',
      'Describe a time your model didn\'t perform as expected. What did you do?',
      'How do you communicate technical findings to non-technical audiences?',
      'Tell me about a time you had to make a decision with incomplete data.',
      'Describe a situation where you had to challenge a stakeholder\'s assumptions.',
    ],
    technical: [
      'Explain the bias-variance tradeoff.',
      'How do you handle imbalanced datasets?',
      'What is the difference between L1 and L2 regularization?',
      'Explain how a random forest algorithm works.',
      'How would you approach a time-series forecasting problem?',
    ],
    general: [
      'Why do you want to work in data science?',
      'How do you stay current with ML research?',
      'Describe your data science workflow.',
      'What tools and languages do you prefer?',
      'How do you ensure your analysis is reproducible?',
    ],
  },
  'Marketing Manager': {
    behavioral: [
      'Tell me about a campaign that exceeded your expectations.',
      'Describe a time you had to pivot a marketing strategy quickly.',
      'How do you handle tight deadlines and competing priorities?',
      'Tell me about a time you had to convince leadership to try a new approach.',
      'Describe a campaign that didn\'t perform well. What did you learn?',
    ],
    technical: [
      'How do you measure ROI on marketing campaigns?',
      'Explain your approach to A/B testing.',
      'What marketing tools and platforms are you most experienced with?',
      'How do you segment audiences for targeted campaigns?',
      'Describe your approach to content marketing strategy.',
    ],
    general: [
      'Why are you interested in this marketing role?',
      'What marketing trends are you most excited about?',
      'How do you balance creativity with data-driven decisions?',
      'Describe a brand you admire and why.',
      'How do you collaborate with sales teams?',
    ],
  },
  'Default': {
    behavioral: [
      'Tell me about yourself and your professional background.',
      'Describe a challenging situation at work and how you handled it.',
      'How do you handle pressure and tight deadlines?',
      'Tell me about a time you showed leadership.',
      'Describe a mistake you made and what you learned from it.',
    ],
    technical: [
      'What are your key technical skills?',
      'How do you approach problem-solving?',
      'Describe a complex project you worked on.',
      'How do you ensure quality in your work?',
      'What tools and technologies are you proficient in?',
    ],
    general: [
      'Why are you interested in this position?',
      'Where do you see yourself in 5 years?',
      'What is your greatest strength?',
      'What is your biggest weakness?',
      'Why should we hire you?',
    ],
  },
};

const roles = Object.keys(questionBank).filter((r) => r !== 'Default');
const experienceLevels = ['Junior (0-2 years)', 'Mid-Level (3-5 years)', 'Senior (6-10 years)', 'Lead/Principal (10+ years)'];
const categories = ['behavioral', 'technical', 'general'] as const;

export function InterviewQuestionGeneratorTool() {
  const [role, setRole] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('');
  const [generated, setGenerated] = useState<Record<string, string[]> | null>(null);

  const handleGenerate = () => {
    const bank = questionBank[role] || questionBank['Default'];
    if (experienceLevel) {
      const levelPrefix = experienceLevel.split(' ')[0].toLowerCase();
      const levelHint = levelPrefix === 'junior' ? 'Focus on foundational concepts and learning agility.'
        : levelPrefix === 'mid-level' ? 'Focus on ownership, collaboration, and system design.'
        : levelPrefix === 'senior' ? 'Focus on architecture decisions, mentoring, and trade-offs.'
        : 'Focus on strategy, cross-team leadership, and organizational impact.';
      const annotated: Record<string, string[]> = {};
      for (const [cat, questions] of Object.entries(bank)) {
        annotated[cat] = [...questions, `[${experienceLevel} Tip: ${levelHint}]`];
      }
      setGenerated(annotated);
    } else {
      setGenerated(bank);
    }
  };

  return (
    <div className="card">
      <div className="space-y-6">
        <div>
          <label className="label">Job Role</label>
          <select value={role} onChange={(e) => setRole(e.target.value)} className="input mt-1">
            <option value="">Select a role...</option>
            {roles.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
            <option value="Other">Other (General Questions)</option>
          </select>
        </div>
        <div>
          <label className="label">Experience Level</label>
          <select value={experienceLevel} onChange={(e) => setExperienceLevel(e.target.value)} className="input mt-1">
            <option value="">Select level...</option>
            {experienceLevels.map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
        </div>

        <button onClick={handleGenerate} disabled={!role} className="btn-primary w-full disabled:opacity-40">Generate Questions</button>

        {generated && (
          <div className="space-y-5">
            {categories.map((cat) => (
              <div key={cat} className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                <h3 className="text-sm font-semibold text-gray-900 capitalize dark:text-white">{cat} Questions</h3>
                <ul className="mt-3 space-y-3">
                  {generated[cat].map((q, i) => (
                    <li key={i} className="flex gap-2 text-sm text-gray-700 dark:text-gray-300">
                      <span className="mt-0.5 flex-shrink-0 text-brand-600 dark:text-brand-400">Q{i + 1}.</span>
                      <span>{q}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div className="rounded-lg bg-blue-50 p-4 text-xs text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">
              These are common interview questions for the selected role. Prepare specific examples from your experience to answer each one using the STAR method (Situation, Task, Action, Result).
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
