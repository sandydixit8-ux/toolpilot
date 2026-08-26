'use client';

import { useState } from 'react';
import { Copy, Check, Sparkles } from 'lucide-react';

interface SummaryForm {
  name: string;
  role: string;
  yearsOfExperience: string;
  skills: string;
}

function generateSummary(form: SummaryForm): string {
  const { name, role, yearsOfExperience, skills } = form;
  const years = parseInt(yearsOfExperience) || 0;
  const skillList = skills.split(',').map((s) => s.trim()).filter(Boolean);
  const yearText = years > 0 ? `${years}+ year${years !== 1 ? 's' : ''}` : 'several years';

  const paragraphs: string[] = [];

  if (name && role) {
    paragraphs.push(`${name} is a dedicated ${role} with ${yearText} of professional experience.`);
  } else if (role) {
    paragraphs.push(`Results-driven ${role} with ${yearText} of hands-on industry experience.`);
  } else {
    paragraphs.push(`Accomplished professional with ${yearText} of diverse experience.`);
  }

  if (skillList.length > 0) {
    const mainSkills = skillList.slice(0, 4);
    const remaining = skillList.length - 4;
    paragraphs.push(
      `Proficient in ${mainSkills.join(', ')}${remaining > 0 ? `, and ${remaining} other key areas` : ''}.`
    );
  }

  paragraphs.push('Known for delivering high-quality work, collaborating effectively with cross-functional teams, and driving continuous improvement in processes and outcomes.');
  paragraphs.push('Passionate about leveraging technology and domain expertise to solve complex challenges and create meaningful impact.');

  return paragraphs.join(' ');
}

export function AiResumeSummaryGeneratorTool() {
  const [form, setForm] = useState<SummaryForm>({ name: '', role: '', yearsOfExperience: '', skills: '' });
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  const update = (field: keyof SummaryForm, value: string) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleGenerate = () => {
    if (!form.role.trim()) return;
    setOutput(generateSummary(form));
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isValid = form.role.trim();

  return (
    <div className="card">
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="label">Your Name</label>
            <input type="text" className="input mt-1" placeholder="Jane Doe" value={form.name} onChange={(e) => update('name', e.target.value)} />
          </div>
          <div>
            <label className="label">Current / Target Role</label>
            <input type="text" className="input mt-1" placeholder="Product Manager" value={form.role} onChange={(e) => update('role', e.target.value)} />
          </div>
        </div>

        <div>
          <label className="label">Years of Experience</label>
          <input type="number" className="input mt-1" placeholder="5" min="0" value={form.yearsOfExperience} onChange={(e) => update('yearsOfExperience', e.target.value)} />
        </div>

        <div>
          <label className="label">Key Skills</label>
          <textarea
            className="input mt-1 min-h-[80px] resize-y"
            placeholder="Project management, Agile, Data analysis, Stakeholder communication..."
            value={form.skills}
            onChange={(e) => update('skills', e.target.value)}
          />
        </div>

        <button onClick={handleGenerate} disabled={!isValid} className="btn-primary inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium disabled:opacity-50">
          <Sparkles className="h-4 w-4" />
          Generate Summary
        </button>

        {output && (
          <div>
            <div className="flex items-center justify-between">
              <label className="label">Professional Summary</label>
              <button onClick={handleCopy} className="btn-secondary inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium">
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <textarea
              className="input mt-1 min-h-[140px] resize-y"
              readOnly
              value={output}
            />
          </div>
        )}
      </div>
    </div>
  );
}
