'use client';

import { useCallback, useState } from 'react';
import { Copy, Check, Download } from 'lucide-react';

type Tone = 'professional' | 'friendly' | 'confident';
type ExperienceLevel = 'junior' | 'mid' | 'senior';

interface CoverLetterForm {
  name: string;
  company: string;
  position: string;
  skills: string;
  yearsOfExperience: string;
  achievements: string;
  tone: Tone;
}

interface LetterContext {
  position: string;
  company: string;
  skillsText: string;
  coreSkills: string;
  achievementLine: string;
  level: ExperienceLevel;
  yearsLabel: string;
  levelStatement: string;
  levelGrowth: string;
  interest: string;
  thanks: string;
}

type ParagraphTemplate = (ctx: LetterContext) => string;

interface VariantPicks {
  opening: number;
  middle: number;
  closing: number;
}

const GREETINGS: Record<Tone, string> = {
  professional: 'Dear Hiring Manager,',
  friendly: 'Dear Hiring Team,',
  confident: 'Dear Hiring Manager,',
};

const SIGN_OFFS: Record<Tone, string> = {
  professional: 'Sincerely,',
  friendly: 'Best regards,',
  confident: 'Best,',
};

const INTEREST_OPENERS: Record<Tone, string> = {
  professional: 'I am writing to express my strong interest in the',
  friendly: 'I was genuinely excited to come across the posting for the',
  confident: 'I am writing to apply for the',
};

const THANK_YOUS: Record<Tone, string> = {
  professional: 'Thank you for your time and consideration.',
  friendly: 'Thanks so much for taking the time to read this!',
  confident: 'I appreciate your consideration and look forward to the conversation.',
};

const LEVEL_LABELS: Record<ExperienceLevel, string> = {
  junior: 'Junior',
  mid: 'Mid-level',
  senior: 'Senior',
};

const LEVEL_STATEMENTS: Record<ExperienceLevel, (yearsLabel: string) => string> = {
  junior: () =>
    'As someone early in my career, I bring fresh energy, up-to-date training, and a genuine eagerness to learn',
  mid: (yearsLabel) =>
    yearsLabel
      ? `With ${yearsLabel} of hands-on experience, I have built a solid track record of delivering dependable results`
      : 'Over the course of my career, I have built a solid track record of delivering dependable results',
  senior: (yearsLabel) =>
    yearsLabel
      ? `With ${yearsLabel} in the field, I have led projects end to end and developed deep expertise`
      : 'I bring extensive experience leading projects end to end, along with deep domain expertise',
};

const LEVEL_GROWTH: Record<ExperienceLevel, string> = {
  junior: 'learn quickly, act on feedback, and grow into bigger responsibilities',
  mid: 'take ownership of meaningful problems and hold myself to a high bar',
  senior: 'set direction, mentor teammates, and drive strategic outcomes',
};

const OPENING_TEMPLATES: ParagraphTemplate[] = [
  (ctx) =>
    `${ctx.interest} ${ctx.position} role at ${ctx.company}. With a background in ${ctx.skillsText}, I am confident I can make a meaningful contribution to your team.`,
  (ctx) =>
    `The ${ctx.position} opening at ${ctx.company} caught my attention right away, because it calls for exactly the blend of ${ctx.coreSkills} that I have spent my career building.`,
  (ctx) =>
    `I am reaching out to apply for the ${ctx.position} role at ${ctx.company}. What draws me is the chance to work on challenging problems with a team that values craftsmanship, and I believe my experience with ${ctx.skillsText} positions me to contribute from day one.`,
  (ctx) =>
    `${ctx.company} needs a ${ctx.position} who can deliver, and that is precisely what I do. My strengths center on ${ctx.coreSkills}, and I have the results to back them up.`,
];

const MIDDLE_TEMPLATES: ParagraphTemplate[] = [
  (ctx) =>
    `${ctx.levelStatement}. Day to day, I work primarily with ${ctx.skillsText}, and some recent highlights include ${ctx.achievementLine}. I hold myself to a high standard of quality, and it shows in everything I ship.`,
  (ctx) =>
    `Just as important as what I know is how I work. In this role, I would aim to ${ctx.levelGrowth}, and my colleagues know me for clear communication, reliability, and genuine curiosity about the product side of the business.`,
  (ctx) =>
    `Fit matters just as much as qualifications. I do my best work on teams that reward ownership and honest feedback, and everything I have learned about ${ctx.company} suggests that is exactly the culture you have built. Whether the work calls for deep focus on ${ctx.coreSkills} or close collaboration across teams, I adapt quickly and stay dependable.`,
  (ctx) =>
    `A few accomplishments speak louder than any summary could: ${ctx.achievementLine}. Behind each one is the same method — understand the problem completely, move decisively on what I control, and keep stakeholders informed throughout. It is an approach I would gladly bring to your team's roadmap.`,
];

const CLOSING_TEMPLATES: ParagraphTemplate[] = [
  (ctx) =>
    `${ctx.thanks} I would welcome the chance to discuss how my background lines up with your needs for the ${ctx.position} role, and I am happy to go into more detail at your convenience.`,
  (ctx) =>
    `I would love to walk you through specific examples of my work and talk through how I could help ${ctx.company} hit its goals. ${ctx.thanks}`,
  (ctx) =>
    `${ctx.thanks} Given my experience with ${ctx.coreSkills}, I am confident I could start contributing quickly, and I would welcome the chance to prove that in an interview.`,
  () =>
    'Either way, thank you for reviewing my application, and I wish you and the team every success going forward.',
];

function toList(value: string): string[] {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function joinList(items: string[]): string {
  if (items.length <= 1) return items.join('');
  return `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`;
}

function parseYears(raw: string): number | null {
  const years = parseInt(raw, 10);
  return Number.isFinite(years) && years >= 0 ? years : null;
}

function getLevel(years: number | null): ExperienceLevel {
  if (years === null) return 'mid';
  if (years < 2) return 'junior';
  if (years <= 5) return 'mid';
  return 'senior';
}

function pickVariantIndex(length: number, previous: number): number {
  if (length <= 1) return 0;
  let next = Math.floor(Math.random() * length);
  if (next === previous) {
    next = (next + 1 + Math.floor(Math.random() * (length - 1))) % length;
  }
  return next;
}

function buildContext(form: CoverLetterForm): LetterContext {
  const skills = toList(form.skills);
  const achievements = toList(form.achievements);
  const years = parseYears(form.yearsOfExperience);
  const level = getLevel(years);
  const yearsLabel = years && years > 0 ? `${years} year${years === 1 ? '' : 's'}` : '';

  return {
    position: form.position.trim() || '[Position]',
    company: form.company.trim() || '[Company]',
    skillsText: skills.length ? joinList(skills) : 'relevant technologies and tools',
    coreSkills: skills.length ? joinList(skills.slice(0, 2)) : "the role's core requirements",
    achievementLine: achievements.length
      ? joinList(achievements)
      : 'streamlining messy processes, mentoring peers, and shipping consistently reliable work',
    level,
    yearsLabel,
    levelStatement: LEVEL_STATEMENTS[level](yearsLabel),
    levelGrowth: LEVEL_GROWTH[level],
    interest: INTEREST_OPENERS[form.tone],
    thanks: THANK_YOUS[form.tone],
  };
}

export function CoverLetterGeneratorTool() {
  const [form, setForm] = useState<CoverLetterForm>({
    name: '',
    company: '',
    position: '',
    skills: '',
    yearsOfExperience: '',
    achievements: '',
    tone: 'professional',
  });
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);
  const [lastPicks, setLastPicks] = useState<VariantPicks>({ opening: -1, middle: -1, closing: -1 });

  const update = useCallback((field: keyof CoverLetterForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleGenerate = useCallback(() => {
    const opening = pickVariantIndex(OPENING_TEMPLATES.length, lastPicks.opening);
    const middle = pickVariantIndex(MIDDLE_TEMPLATES.length, lastPicks.middle);
    const closing = pickVariantIndex(CLOSING_TEMPLATES.length, lastPicks.closing);
    const ctx = buildContext(form);
    const letter = `${GREETINGS[form.tone]}\n\n${[
      OPENING_TEMPLATES[opening](ctx),
      MIDDLE_TEMPLATES[middle](ctx),
      CLOSING_TEMPLATES[closing](ctx),
    ].join('\n\n')}\n\n${SIGN_OFFS[form.tone]}\n${form.name.trim() || '[Your Name]'}`;

    setOutput(letter);
    setLastPicks({ opening, middle, closing });
    setCopied(false);
  }, [form, lastPicks]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [output]);

  const handleDownload = useCallback(() => {
    const slug =
      form.company
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') || 'draft';
    const blob = new Blob([output], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `cover-letter-${slug}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [output, form.company]);

  const canGenerate = Boolean(form.position.trim()) || Boolean(form.company.trim());
  const years = parseYears(form.yearsOfExperience);
  const level = getLevel(years);

  return (
    <div className="card">
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="label">Your Name</label>
            <input type="text" value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="John Doe" className="input mt-1" />
          </div>
          <div>
            <label className="label">Company</label>
            <input type="text" value={form.company} onChange={(e) => update('company', e.target.value)} placeholder="Google, Microsoft, etc." className="input mt-1" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="label">Position</label>
            <input type="text" value={form.position} onChange={(e) => update('position', e.target.value)} placeholder="Software Engineer" className="input mt-1" />
          </div>
          <div>
            <label className="label">
              Years of Experience
              {years !== null && form.yearsOfExperience !== '' && (
                <span className="ml-2 inline-flex items-center rounded-full bg-brand-50 px-2 py-0.5 text-[11px] font-medium text-brand-600 dark:bg-brand-950 dark:text-brand-400">
                  {LEVEL_LABELS[level]}
                </span>
              )}
            </label>
            <input type="number" min="0" max="60" value={form.yearsOfExperience} onChange={(e) => update('yearsOfExperience', e.target.value)} placeholder="e.g. 4" className="input mt-1" />
          </div>
        </div>

        <div>
          <label className="label">Key Skills</label>
          <input type="text" value={form.skills} onChange={(e) => update('skills', e.target.value)} placeholder="React, Node.js, Python, Team Leadership" className="input mt-1" />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Comma-separated list of your top skills for this role.</p>
        </div>

        <div>
          <label className="label">Key Achievements</label>
          <textarea
            value={form.achievements}
            onChange={(e) => update('achievements', e.target.value)}
            placeholder="Reduced page load time by 40%, Led migration to microservices, Mentored three junior developers"
            className="input mt-1 min-h-[90px]"
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Comma-separated. Concrete wins make the letter stronger.</p>
        </div>

        <div className="w-full sm:w-1/2">
          <label className="label">Tone</label>
          <select value={form.tone} onChange={(e) => update('tone', e.target.value as Tone)} className="input mt-1">
            <option value="professional">Professional</option>
            <option value="friendly">Friendly</option>
            <option value="confident">Confident</option>
          </select>
        </div>

        <div>
          <button onClick={handleGenerate} disabled={!canGenerate} className="btn-primary w-full disabled:opacity-40">
            Generate Cover Letter
          </button>
          <p className="mt-2 text-center text-xs text-gray-500 dark:text-gray-400">Each click mixes different paragraph templates, so you get a fresh variation every time.</p>
        </div>

        {output && (
          <div className="space-y-4">
            <div>
              <label className="label">Preview</label>
              <div className="mt-2 rounded-xl border border-gray-200 bg-white px-6 py-8 shadow-sm dark:border-gray-700 dark:bg-gray-900 sm:px-10">
                <pre className="whitespace-pre-wrap font-serif text-[15px] leading-relaxed text-gray-800 dark:text-gray-100">{output}</pre>
              </div>
              <p className="mt-3 text-xs italic text-gray-500 dark:text-gray-400">This is a template. Customize it with your specific achievements.</p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <button onClick={handleCopy} className="btn-secondary flex flex-1 items-center justify-center gap-2">
                {copied ? <Check size={16} /> : <Copy size={16} />}
                {copied ? 'Copied!' : 'Copy to Clipboard'}
              </button>
              <button onClick={handleDownload} className="btn-primary flex flex-1 items-center justify-center gap-2">
                <Download size={16} />
                Download as Text
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
