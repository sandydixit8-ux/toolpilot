'use client';

import { useState } from 'react';
import { Download, Plus, Trash2, Copy, FileText } from 'lucide-react';

interface WorkEntry {
  title: string;
  company: string;
  dates: string;
  bullets: string;
}

interface EducationEntry {
  institution: string;
  degree: string;
  dates: string;
  details: string;
}

interface ResumeData {
  name: string;
  email: string;
  phone: string;
  linkedin: string;
  github: string;
  location: string;
  summary: string;
  experience: WorkEntry[];
  education: EducationEntry[];
  skills: string;
  certifications: string;
}

type Template = 'professional' | 'modern' | 'minimal';

const steps = ['Personal', 'Experience', 'Education', 'Skills', 'Template', 'Preview'];

const emptyWork: WorkEntry = { title: '', company: '', dates: '', bullets: '' };
const emptyEdu: EducationEntry = { institution: '', degree: '', dates: '', details: '' };

function ProfessionalTemplate({ data }: { data: ResumeData }) {
  return (
    <div className="p-8 bg-white text-black font-serif text-sm leading-relaxed" id="resume-preview">
      <div className="text-center border-b-2 border-gray-900 pb-4 mb-4">
        <h1 className="text-2xl font-bold tracking-wide">{data.name || 'Your Name'}</h1>
        <p className="text-sm mt-1">{[data.email, data.phone, data.location].filter(Boolean).join(' | ')}</p>
        {[data.linkedin, data.github].filter(Boolean).map((link, i) => (
          <p key={i} className="text-xs text-blue-600">{link}</p>
        ))}
      </div>
      {data.summary && (
        <div className="mb-4">
          <h2 className="text-sm font-bold uppercase tracking-wider border-b border-gray-300 pb-1 mb-2">Professional Summary</h2>
          <p className="whitespace-pre-line">{data.summary}</p>
        </div>
      )}
      {data.experience.some(e => e.title) && (
        <div className="mb-4">
          <h2 className="text-sm font-bold uppercase tracking-wider border-b border-gray-300 pb-1 mb-2">Work Experience</h2>
          {data.experience.filter(e => e.title).map((exp, i) => (
            <div key={i} className="mb-3">
              <div className="flex justify-between items-baseline">
                <span className="font-bold">{exp.title}</span>
                <span className="text-xs text-gray-600">{exp.dates}</span>
              </div>
              <p className="italic text-gray-700">{exp.company}</p>
              {exp.bullets && (
                <ul className="mt-1 ml-4 list-disc space-y-0.5">
                  {exp.bullets.split('\n').filter(b => b.trim()).map((b, j) => <li key={j}>{b.replace(/^[\u2022\-*0-9)\s.]+/, '')}</li>)}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}
      {data.education.some(e => e.institution) && (
        <div className="mb-4">
          <h2 className="text-sm font-bold uppercase tracking-wider border-b border-gray-300 pb-1 mb-2">Education</h2>
          {data.education.filter(e => e.institution).map((edu, i) => (
            <div key={i} className="mb-2">
              <div className="flex justify-between items-baseline">
                <span className="font-bold">{edu.institution}</span>
                <span className="text-xs text-gray-600">{edu.dates}</span>
              </div>
              {edu.degree && <p className="italic">{edu.degree}</p>}
              {edu.details && <p className="text-xs mt-0.5">{edu.details}</p>}
            </div>
          ))}
        </div>
      )}
      {data.skills && (
        <div className="mb-4">
          <h2 className="text-sm font-bold uppercase tracking-wider border-b border-gray-300 pb-1 mb-2">Skills</h2>
          <p>{data.skills}</p>
        </div>
      )}
      {data.certifications && (
        <div className="mb-4">
          <h2 className="text-sm font-bold uppercase tracking-wider border-b border-gray-300 pb-1 mb-2">Certifications</h2>
          <p className="whitespace-pre-line">{data.certifications}</p>
        </div>
      )}
    </div>
  );
}

function ModernTemplate({ data }: { data: ResumeData }) {
  return (
    <div className="p-8 bg-white text-gray-900 font-sans text-sm leading-relaxed" id="resume-preview">
      <div className="bg-gray-900 text-white p-6 -m-8 mb-6">
        <h1 className="text-2xl font-extrabold">{data.name || 'Your Name'}</h1>
        <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-300">
          {data.email && <span>{data.email}</span>}
          {data.phone && <span>{data.phone}</span>}
          {data.location && <span>{data.location}</span>}
          {data.linkedin && <span className="text-blue-300">{data.linkedin}</span>}
          {data.github && <span className="text-blue-300">{data.github}</span>}
        </div>
      </div>
      {data.summary && (
        <div className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-2">Summary</h2>
          <p className="whitespace-pre-line text-gray-700">{data.summary}</p>
        </div>
      )}
      {data.experience.some(e => e.title) && (
        <div className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-2">Experience</h2>
          {data.experience.filter(e => e.title).map((exp, i) => (
            <div key={i} className="mb-3 pl-3 border-l-2 border-blue-200">
              <div className="flex justify-between items-baseline">
                <span className="font-bold">{exp.title}</span>
                <span className="text-xs text-gray-500">{exp.dates}</span>
              </div>
              <p className="text-blue-600 text-xs font-medium">{exp.company}</p>
              {exp.bullets && (
                <ul className="mt-1 ml-4 list-disc space-y-0.5 text-gray-700">
                  {exp.bullets.split('\n').filter(b => b.trim()).map((b, j) => <li key={j}>{b.replace(/^[\u2022\-*0-9)\s.]+/, '')}</li>)}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}
      {data.education.some(e => e.institution) && (
        <div className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-2">Education</h2>
          {data.education.filter(e => e.institution).map((edu, i) => (
            <div key={i} className="mb-2 pl-3 border-l-2 border-blue-200">
              <div className="flex justify-between items-baseline">
                <span className="font-bold">{edu.institution}</span>
                <span className="text-xs text-gray-500">{edu.dates}</span>
              </div>
              {edu.degree && <p className="text-blue-600 text-xs font-medium">{edu.degree}</p>}
              {edu.details && <p className="text-xs text-gray-600 mt-0.5">{edu.details}</p>}
            </div>
          ))}
        </div>
      )}
      {data.skills && (
        <div className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-2">Skills</h2>
          <div className="flex flex-wrap gap-1.5">
            {data.skills.split(',').map((s, i) => <span key={i} className="px-2 py-0.5 bg-gray-100 rounded text-xs font-medium">{s.trim()}</span>)}
          </div>
        </div>
      )}
      {data.certifications && (
        <div className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-2">Certifications</h2>
          <p className="whitespace-pre-line text-gray-700">{data.certifications}</p>
        </div>
      )}
    </div>
  );
}

function MinimalTemplate({ data }: { data: ResumeData }) {
  return (
    <div className="p-8 bg-white text-gray-900 font-sans text-sm leading-relaxed" id="resume-preview">
      <div className="mb-6">
        <h1 className="text-xl font-light tracking-widest uppercase">{data.name || 'Your Name'}</h1>
        <div className="flex flex-wrap gap-2 mt-1 text-xs text-gray-500">
          {[data.email, data.phone, data.location, data.linkedin, data.github].filter(Boolean).map((item, i) => <span key={i}>{item}</span>)}
        </div>
      </div>
      {data.summary && (
        <div className="mb-5">
          <h2 className="text-xs font-medium uppercase tracking-widest text-gray-400 mb-1">About</h2>
          <p className="whitespace-pre-line">{data.summary}</p>
        </div>
      )}
      {data.experience.some(e => e.title) && (
        <div className="mb-5">
          <h2 className="text-xs font-medium uppercase tracking-widest text-gray-400 mb-2">Experience</h2>
          {data.experience.filter(e => e.title).map((exp, i) => (
            <div key={i} className="mb-3">
              <div className="flex justify-between items-baseline">
                <span className="font-medium">{exp.title}</span>
                <span className="text-xs text-gray-400">{exp.dates}</span>
              </div>
              <p className="text-xs text-gray-500">{exp.company}</p>
              {exp.bullets && (
                <ul className="mt-1 ml-4 list-disc space-y-0.5 text-gray-700">
                  {exp.bullets.split('\n').filter(b => b.trim()).map((b, j) => <li key={j}>{b.replace(/^[\u2022\-*0-9)\s.]+/, '')}</li>)}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}
      {data.education.some(e => e.institution) && (
        <div className="mb-5">
          <h2 className="text-xs font-medium uppercase tracking-widest text-gray-400 mb-2">Education</h2>
          {data.education.filter(e => e.institution).map((edu, i) => (
            <div key={i} className="mb-2">
              <div className="flex justify-between items-baseline">
                <span className="font-medium">{edu.institution}</span>
                <span className="text-xs text-gray-400">{edu.dates}</span>
              </div>
              {edu.degree && <p className="text-xs text-gray-500">{edu.degree}</p>}
              {edu.details && <p className="text-xs text-gray-500">{edu.details}</p>}
            </div>
          ))}
        </div>
      )}
      {data.skills && (
        <div className="mb-5">
          <h2 className="text-xs font-medium uppercase tracking-widest text-gray-400 mb-1">Skills</h2>
          <p className="text-gray-700">{data.skills}</p>
        </div>
      )}
      {data.certifications && (
        <div className="mb-5">
          <h2 className="text-xs font-medium uppercase tracking-widest text-gray-400 mb-1">Certifications</h2>
          <p className="whitespace-pre-line text-gray-700">{data.certifications}</p>
        </div>
      )}
    </div>
  );
}

export function ResumeBuilderTool() {
  const [step, setStep] = useState(0);
  const [template, setTemplate] = useState<Template>('professional');
  const [resume, setResume] = useState<ResumeData>({
    name: '', email: '', phone: '', linkedin: '', github: '', location: '',
    summary: '',
    experience: [{ ...emptyWork }],
    education: [{ ...emptyEdu }],
    skills: '', certifications: '',
  });
  const [exporting, setExporting] = useState(false);

  const update = (field: keyof ResumeData, value: string) =>
    setResume(prev => ({ ...prev, [field]: value }));

  const updateWork = (index: number, field: keyof WorkEntry, value: string) => {
    const copy = [...resume.experience];
    copy[index] = { ...copy[index], [field]: value };
    setResume(prev => ({ ...prev, experience: copy }));
  };

  const addWork = () => setResume(prev => ({ ...prev, experience: [...prev.experience, { ...emptyWork }] }));
  const removeWork = (i: number) => setResume(prev => ({ ...prev, experience: prev.experience.filter((_, idx) => idx !== i) }));

  const updateEdu = (index: number, field: keyof EducationEntry, value: string) => {
    const copy = [...resume.education];
    copy[index] = { ...copy[index], [field]: value };
    setResume(prev => ({ ...prev, education: copy }));
  };

  const addEdu = () => setResume(prev => ({ ...prev, education: [...prev.education, { ...emptyEdu }] }));
  const removeEdu = (i: number) => setResume(prev => ({ ...prev, education: prev.education.filter((_, idx) => idx !== i) }));

  const handleExportPDF = async () => {
    setExporting(true);
    try {
      const html2pdf = (await import('html2pdf.js')).default;
      const el = document.getElementById('resume-preview');
      if (!el) return;
      await html2pdf().set({ margin: 0, filename: `${resume.name || 'resume'}_ToolPilot.pdf`, html2canvas: { scale: 2 }, jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' } }).from(el).save();
    } finally {
      setExporting(false);
    }
  };

  const inputClass = 'input mt-1';

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><label className="label">Full Name</label><input type="text" value={resume.name} onChange={(e) => update('name', e.target.value)} placeholder="John Doe" className={inputClass} /></div>
              <div><label className="label">Email</label><input type="email" value={resume.email} onChange={(e) => update('email', e.target.value)} placeholder="john@example.com" className={inputClass} /></div>
              <div><label className="label">Phone</label><input type="tel" value={resume.phone} onChange={(e) => update('phone', e.target.value)} placeholder="+1 234 567 890" className={inputClass} /></div>
              <div><label className="label">Location</label><input type="text" value={resume.location} onChange={(e) => update('location', e.target.value)} placeholder="City, State" className={inputClass} /></div>
              <div><label className="label">LinkedIn</label><input type="text" value={resume.linkedin} onChange={(e) => update('linkedin', e.target.value)} placeholder="linkedin.com/in/yourname" className={inputClass} /></div>
              <div><label className="label">GitHub</label><input type="text" value={resume.github} onChange={(e) => update('github', e.target.value)} placeholder="github.com/yourname" className={inputClass} /></div>
            </div>
            <div><label className="label">Professional Summary</label><textarea value={resume.summary} onChange={(e) => update('summary', e.target.value)} placeholder="Experienced software engineer with 5+ years..." rows={4} className={inputClass + ' resize-none'} /></div>
          </div>
        );
      case 1:
        return (
          <div className="space-y-4">
            {resume.experience.map((exp, i) => (
              <div key={i} className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Role {i + 1}</span>
                  {resume.experience.length > 1 && <button onClick={() => removeWork(i)} className="text-red-500 hover:text-red-700"><Trash2 className="h-4 w-4" /></button>}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div><label className="label text-xs">Job Title</label><input type="text" value={exp.title} onChange={(e) => updateWork(i, 'title', e.target.value)} placeholder="Software Engineer" className={inputClass} /></div>
                  <div><label className="label text-xs">Company</label><input type="text" value={exp.company} onChange={(e) => updateWork(i, 'company', e.target.value)} placeholder="Google" className={inputClass} /></div>
                  <div><label className="label text-xs">Dates</label><input type="text" value={exp.dates} onChange={(e) => updateWork(i, 'dates', e.target.value)} placeholder="Jan 2020 - Present" className={inputClass} /></div>
                </div>
                <div><label className="label text-xs">Bullet Points (one per line)</label><textarea value={exp.bullets} onChange={(e) => updateWork(i, 'bullets', e.target.value)} placeholder={"- Led team of 5 engineers\n- Improved performance by 40%\n- Reduced costs by ₹10L annually"} rows={4} className={inputClass + ' resize-none'} /></div>
              </div>
            ))}
            <button onClick={addWork} className="btn-secondary w-full flex items-center justify-center gap-2"><Plus className="h-4 w-4" /> Add Another Role</button>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            {resume.education.map((edu, i) => (
              <div key={i} className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Education {i + 1}</span>
                  {resume.education.length > 1 && <button onClick={() => removeEdu(i)} className="text-red-500 hover:text-red-700"><Trash2 className="h-4 w-4" /></button>}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div><label className="label text-xs">Institution</label><input type="text" value={edu.institution} onChange={(e) => updateEdu(i, 'institution', e.target.value)} placeholder="MIT" className={inputClass} /></div>
                  <div><label className="label text-xs">Degree</label><input type="text" value={edu.degree} onChange={(e) => updateEdu(i, 'degree', e.target.value)} placeholder="B.S. Computer Science" className={inputClass} /></div>
                  <div><label className="label text-xs">Dates</label><input type="text" value={edu.dates} onChange={(e) => updateEdu(i, 'dates', e.target.value)} placeholder="2014 - 2018" className={inputClass} /></div>
                </div>
                <div><label className="label text-xs">Details (GPA, honors, etc.)</label><input type="text" value={edu.details} onChange={(e) => updateEdu(i, 'details', e.target.value)} placeholder="GPA: 3.8/4.0, Dean's List" className={inputClass} /></div>
              </div>
            ))}
            <button onClick={addEdu} className="btn-secondary w-full flex items-center justify-center gap-2"><Plus className="h-4 w-4" /> Add Another Education</button>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <div><label className="label">Skills</label><p className="text-xs text-gray-500 mb-1">Comma-separated list of your key skills.</p><textarea value={resume.skills} onChange={(e) => update('skills', e.target.value)} placeholder="JavaScript, React, Node.js, Python, SQL, AWS, Docker, Git" rows={3} className={inputClass + ' resize-none'} /></div>
            <div><label className="label">Certifications</label><p className="text-xs text-gray-500 mb-1">One per line.</p><textarea value={resume.certifications} onChange={(e) => update('certifications', e.target.value)} placeholder={"AWS Solutions Architect\nPMP Certification\nGoogle Analytics Certified"} rows={3} className={inputClass + ' resize-none'} /></div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">Choose a template style:</p>
            <div className="grid grid-cols-3 gap-3">
              {(['professional', 'modern', 'minimal'] as Template[]).map(t => (
                <button key={t} onClick={() => setTemplate(t)} className={`p-4 rounded-lg border-2 text-center transition-all ${template === t ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'}`}>
                  <FileText className={`h-8 w-8 mx-auto mb-2 ${template === t ? 'text-blue-500' : 'text-gray-400'}`} />
                  <span className="text-sm font-medium capitalize">{t}</span>
                </button>
              ))}
            </div>
          </div>
        );
      case 5:
        const TemplateComponent = template === 'modern' ? ModernTemplate : template === 'minimal' ? MinimalTemplate : ProfessionalTemplate;
        return (
          <div>
            <div className="flex gap-2 mb-4">
              <button onClick={handleExportPDF} disabled={exporting} className="btn-primary flex items-center gap-2">
                {exporting ? <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Download className="h-4 w-4" />}
                Download PDF
              </button>
              <button onClick={() => navigator.clipboard.writeText(JSON.stringify(resume, null, 2))} className="btn-secondary flex items-center gap-2"><Copy className="h-4 w-4" /> Copy JSON</button>
            </div>
            <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-lg">
              <TemplateComponent data={resume} />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="card">
      <div className="space-y-6">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {steps.map((s, i) => (
            <button key={s} onClick={() => setStep(i)} className={`whitespace-nowrap rounded-lg px-3 py-2 text-xs font-medium transition-colors ${step === i ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'}`}>
              {i + 1}. {s}
            </button>
          ))}
        </div>
        {renderStep()}
        <div className="flex items-center justify-between pt-2">
          <button disabled={step === 0} onClick={() => setStep(s => s - 1)} className="btn-secondary disabled:opacity-40">Back</button>
          {step < steps.length - 1 && <button onClick={() => setStep(s => s + 1)} className="btn-primary">Next</button>}
        </div>
      </div>
    </div>
  );
}
