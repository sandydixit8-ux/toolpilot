'use client';

import { useState } from 'react';

interface CoverLetterForm {
  name: string;
  company: string;
  position: string;
  skills: string;
}

function generateCoverLetter(data: CoverLetterForm): string {
  const skillsList = data.skills.split(',').map((s) => s.trim()).filter(Boolean);
  const skillsText = skillsList.length > 2
    ? `${skillsList.slice(0, -1).join(', ')} and ${skillsList[skillsList.length - 1]}`
    : skillsList.join(' and ');

  return `Dear Hiring Manager,

I am writing to express my strong interest in the ${data.position || '[Position]'} role at ${data.company || '[Company]'}. With my background in ${skillsText || 'relevant technologies and skills'}, I am confident I can make a meaningful contribution to your team.

Throughout my career, I have developed deep expertise in ${skillsText || 'various technical and professional areas'}. I am passionate about delivering high-quality work and thrive in collaborative environments where I can both learn from and contribute to a talented team.

What excites me about ${data.company || '[Company]'} is the opportunity to work on impactful projects alongside a team that values innovation and excellence. I am eager to bring my skills in ${skillsText || 'your required areas'} to help drive your team's success.

I would welcome the opportunity to discuss how my experience and skills align with your needs. Thank you for considering my application. I look forward to hearing from you.

Best regards,
${data.name || '[Your Name]'}`;
}

export function CoverLetterGeneratorTool() {
  const [form, setForm] = useState<CoverLetterForm>({ name: '', company: '', position: '', skills: '' });
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  const update = (field: keyof CoverLetterForm, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleGenerate = () => {
    setOutput(generateCoverLetter(form));
    setCopied(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
        <div>
          <label className="label">Position</label>
          <input type="text" value={form.position} onChange={(e) => update('position', e.target.value)} placeholder="Software Engineer" className="input mt-1" />
        </div>
        <div>
          <label className="label">Key Skills</label>
          <input type="text" value={form.skills} onChange={(e) => update('skills', e.target.value)} placeholder="React, Node.js, Python, Team Leadership" className="input mt-1" />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Comma-separated list of your top skills for this role.</p>
        </div>

        <button onClick={handleGenerate} disabled={!form.position && !form.company} className="btn-primary w-full disabled:opacity-40">Generate Cover Letter</button>

        {output && (
          <div className="space-y-3">
            <div className="relative">
              <textarea readOnly value={output} rows={14} className="input resize-none bg-gray-50 dark:bg-gray-800/50" />
            </div>
            <button onClick={handleCopy} className="btn-secondary w-full">
              {copied ? 'Copied!' : 'Copy to Clipboard'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
