'use client';

import { useState } from 'react';
import { Copy, Check, Sparkles } from 'lucide-react';

interface CoverLetterForm {
  yourName: string;
  companyName: string;
  position: string;
  skills: string;
}

function generateCoverLetter(form: CoverLetterForm): string {
  const { yourName, companyName, position, skills } = form;
  const skillList = skills.split(',').map((s) => s.trim()).filter(Boolean);

  return `Dear Hiring Manager,

I am writing to express my strong interest in the ${position} position at ${companyName}. With my background and expertise, I am confident I would be a valuable addition to your team.

${skillList.length > 0 ? `My key qualifications include ${skillList.slice(0, 3).join(', ')}${skillList.length > 3 ? ', and more' : ''}. These skills have been honed through hands-on experience and a genuine passion for excellence.` : 'My diverse skill set and experience make me well-suited for this role.'}

I am particularly drawn to ${companyName} because of your commitment to innovation and quality. I am excited about the opportunity to contribute to your mission and grow alongside your talented team.

I would welcome the opportunity to discuss how my experience and enthusiasm align with the goals of your team. Thank you for considering my application.

Sincerely,
${yourName || '[Your Name]'}`;
}

export function AiCoverLetterGeneratorTool() {
  const [form, setForm] = useState<CoverLetterForm>({ yourName: '', companyName: '', position: '', skills: '' });
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  const update = (field: keyof CoverLetterForm, value: string) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleGenerate = () => {
    if (!form.companyName.trim() || !form.position.trim()) return;
    setOutput(generateCoverLetter(form));
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isValid = form.companyName.trim() && form.position.trim();

  return (
    <div className="card">
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="label">Your Name</label>
            <input type="text" className="input mt-1 w-full rounded-lg border border-gray-300 bg-white p-2.5 text-sm dark:border-gray-600 dark:bg-gray-800" placeholder="Jane Doe" value={form.yourName} onChange={(e) => update('yourName', e.target.value)} />
          </div>
          <div>
            <label className="label">Company Name</label>
            <input type="text" className="input mt-1 w-full rounded-lg border border-gray-300 bg-white p-2.5 text-sm dark:border-gray-600 dark:bg-gray-800" placeholder="Acme Inc." value={form.companyName} onChange={(e) => update('companyName', e.target.value)} />
          </div>
        </div>

        <div>
          <label className="label">Position</label>
          <input type="text" className="input mt-1 w-full rounded-lg border border-gray-300 bg-white p-2.5 text-sm dark:border-gray-600 dark:bg-gray-800" placeholder="Senior Software Engineer" value={form.position} onChange={(e) => update('position', e.target.value)} />
        </div>

        <div>
          <label className="label">Key Skills / Experience</label>
          <textarea
            className="input mt-1 min-h-[80px] w-full resize-y rounded-lg border border-gray-300 bg-white p-3 text-sm dark:border-gray-600 dark:bg-gray-800"
            placeholder="React, TypeScript, 5 years of experience in full-stack development..."
            value={form.skills}
            onChange={(e) => update('skills', e.target.value)}
          />
        </div>

        <button onClick={handleGenerate} disabled={!isValid} className="btn-primary inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium disabled:opacity-50">
          <Sparkles className="h-4 w-4" />
          Generate Cover Letter
        </button>

        {output && (
          <div>
            <div className="flex items-center justify-between">
              <label className="label">Generated Cover Letter</label>
              <button onClick={handleCopy} className="btn-secondary inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium">
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <textarea
              className="input mt-1 min-h-[280px] w-full resize-y rounded-lg border border-gray-300 bg-white p-3 text-sm dark:border-gray-600 dark:bg-gray-800"
              readOnly
              value={output}
            />
          </div>
        )}
      </div>
    </div>
  );
}
