'use client';

import { useState } from 'react';

interface ResumeData {
  name: string;
  email: string;
  phone: string;
  summary: string;
  experience: string;
  education: string;
  skills: string;
}

const steps = ['Personal', 'Experience', 'Education', 'Skills', 'Preview'];

export function ResumeBuilderTool() {
  const [step, setStep] = useState(0);
  const [resume, setResume] = useState<ResumeData>({
    name: '',
    email: '',
    phone: '',
    summary: '',
    experience: '',
    education: '',
    skills: '',
  });

  const update = (field: keyof ResumeData, value: string) =>
    setResume((prev) => ({ ...prev, [field]: value }));

  const inputClass = 'input mt-1';

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="space-y-4">
            <div>
              <label className="label">Full Name</label>
              <input type="text" value={resume.name} onChange={(e) => update('name', e.target.value)} placeholder="John Doe" className={inputClass} />
            </div>
            <div>
              <label className="label">Email</label>
              <input type="email" value={resume.email} onChange={(e) => update('email', e.target.value)} placeholder="john@example.com" className={inputClass} />
            </div>
            <div>
              <label className="label">Phone</label>
              <input type="tel" value={resume.phone} onChange={(e) => update('phone', e.target.value)} placeholder="+1 234 567 890" className={inputClass} />
            </div>
            <div>
              <label className="label">Professional Summary</label>
              <textarea value={resume.summary} onChange={(e) => update('summary', e.target.value)} placeholder="Brief professional summary..." rows={4} className={inputClass + ' resize-none'} />
            </div>
          </div>
        );
      case 1:
        return (
          <div>
            <label className="label">Work Experience</label>
            <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">List each role with company, title, dates, and key achievements.</p>
            <textarea value={resume.experience} onChange={(e) => update('experience', e.target.value)} placeholder={"Senior Developer | ABC Corp | Jan 2020 - Present\n- Led team of 5 engineers\n- Improved performance by 40%"} rows={8} className={inputClass + ' resize-none'} />
          </div>
        );
      case 2:
        return (
          <div>
            <label className="label">Education</label>
            <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">List your degrees with institution, degree, and graduation year.</p>
            <textarea value={resume.education} onChange={(e) => update('education', e.target.value)} placeholder={"B.S. Computer Science | MIT | 2018\nGPA: 3.8/4.0"} rows={5} className={inputClass + ' resize-none'} />
          </div>
        );
      case 3:
        return (
          <div>
            <label className="label">Skills</label>
            <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">Comma-separated list of your key skills.</p>
            <textarea value={resume.skills} onChange={(e) => update('skills', e.target.value)} placeholder="JavaScript, React, Node.js, Python, SQL, AWS" rows={4} className={inputClass + ' resize-none'} />
          </div>
        );
      case 4:
        return (
          <div className="rounded-xl bg-gray-50 p-6 dark:bg-gray-800/50">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">{resume.name || 'Your Name'}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{resume.email}{resume.phone && ` | ${resume.phone}`}</p>
            {resume.summary && (
              <div className="mt-4">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-1">Summary</h4>
                <p className="mt-1 text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">{resume.summary}</p>
              </div>
            )}
            {resume.experience && (
              <div className="mt-4">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-1">Experience</h4>
                <p className="mt-1 text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">{resume.experience}</p>
              </div>
            )}
            {resume.education && (
              <div className="mt-4">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-1">Education</h4>
                <p className="mt-1 text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">{resume.education}</p>
              </div>
            )}
            {resume.skills && (
              <div className="mt-4">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-1">Skills</h4>
                <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">{resume.skills}</p>
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div className="card">
      <div className="space-y-6">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {steps.map((s, i) => (
            <button key={s} onClick={() => setStep(i)} className={`whitespace-nowrap rounded-lg px-3 py-2 text-xs font-medium transition-colors ${step === i ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'}`}>
              {i + 1}. {s}
            </button>
          ))}
        </div>

        {renderStep()}

        <div className="flex items-center justify-between pt-2">
          <button disabled={step === 0} onClick={() => setStep((s) => s - 1)} className="btn-secondary disabled:opacity-40">Back</button>
          {step < steps.length - 1 ? (
            <button onClick={() => setStep((s) => s + 1)} className="btn-primary">Next</button>
          ) : (
            <button onClick={() => { navigator.clipboard.writeText(JSON.stringify(resume, null, 2)); }} className="btn-primary">Copy JSON</button>
          )}
        </div>
      </div>
    </div>
  );
}
