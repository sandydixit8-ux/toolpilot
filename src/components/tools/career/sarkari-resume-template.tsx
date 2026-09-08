'use client';

import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';

interface EduRow {
  id: number;
  exam: string;
  board: string;
  year: string;
  percent: string;
}

interface ExpRow {
  id: number;
  org: string;
  role: string;
  period: string;
}

let nextId = 1;

export function SarkariResumeTemplateTool() {
  const [showPreview, setShowPreview] = useState(false);
  const [photoOptIn, setPhotoOptIn] = useState(true);

  const [name, setName] = useState('');
  const [father, setFather] = useState('');
  const [dob, setDob] = useState('');
  const [category, setCategory] = useState('General');
  const [marital, setMarital] = useState('Single');
  const [nationality] = useState('Indian');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  const [education, setEducation] = useState<EduRow[]>([
    { id: nextId++, exam: '10th (Matric)', board: '', year: '', percent: '' },
    { id: nextId++, exam: '12th (Senior Secondary)', board: '', year: '', percent: '' },
    { id: nextId++, exam: 'Graduation', board: '', year: '', percent: '' },
  ]);
  const [experience, setExperience] = useState<ExpRow[]>([]);
  const [skills, setSkills] = useState('');
  const [declaration, setDeclaration] = useState(
    'I hereby declare that all the information furnished above is true, complete and correct to the best of my knowledge and belief.'
  );
  const [place, setPlace] = useState('');
  const [signature, setSignature] = useState('');

  const addEdu = () => setEducation([...education, { id: nextId++, exam: '', board: '', year: '', percent: '' }]);
  const removeEdu = (id: number) => education.length > 1 && setEducation(education.filter((r) => r.id !== id));
  const updateEdu = (id: number, field: keyof EduRow, value: string) =>
    setEducation(education.map((r) => (r.id === id ? { ...r, [field]: value } : r)));

  const addExp = () => setExperience([...experience, { id: nextId++, org: '', role: '', period: '' }]);
  const removeExp = (id: number) => setExperience(experience.filter((r) => r.id !== id));
  const updateExp = (id: number, field: keyof ExpRow, value: string) =>
    setExperience(experience.map((r) => (r.id === id ? { ...r, [field]: value } : r)));

  const handlePrint = () => window.print();

  if (showPreview) {
    return (
      <div className="space-y-4">
        <div className="flex gap-3">
          <button onClick={() => setShowPreview(false)} className="btn-secondary">
            ← Edit
          </button>
          <button onClick={handlePrint} className="btn-primary">
            Print / Save as PDF
          </button>
        </div>

        <div id="sarkari-resume-preview" className="rounded-xl border border-gray-200 bg-white p-8 text-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100">
          <div className="flex items-start justify-between gap-6">
            <div className="space-y-1">
              <h1 className="text-2xl font-bold">{name || 'Applicant Name'}</h1>
              <p className="text-sm font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-400">
                Application / Bio-Data for Government Job
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {nationality || 'Indian'} National · {marital}
              </p>
            </div>
            {photoOptIn && (
              <div className="h-24 w-20 shrink-0 rounded border-2 border-dashed border-gray-400 p-1 text-center text-[10px] leading-tight text-gray-400">
                Paste
                <br />
                Passport
                <br />
                Photo
                <br />
                Here
              </div>
            )}
          </div>

          <hr className="my-6 border-gray-300 dark:border-gray-700" />

          <section>
            <h2 className="text-sm font-bold uppercase tracking-wide text-gray-900 dark:text-gray-100">1. Personal Details</h2>
            <table className="mt-3 w-full text-sm">
              <tbody>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <td className="py-1.5 pr-4 text-gray-500 dark:text-gray-400">Father&apos;s / Husband&apos;s Name</td>
                  <td className="py-1.5 font-medium">{father || '—'}</td>
                </tr>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <td className="py-1.5 pr-4 text-gray-500 dark:text-gray-400">Date of Birth</td>
                  <td className="py-1.5 font-medium">{dob || '—'}</td>
                </tr>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <td className="py-1.5 pr-4 text-gray-500 dark:text-gray-400">Category</td>
                  <td className="py-1.5 font-medium">{category}</td>
                </tr>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <td className="py-1.5 pr-4 text-gray-500 dark:text-gray-400">Contact</td>
                  <td className="py-1.5 font-medium">
                    {phone || '—'}
                    {email ? ` · ${email}` : ''}
                  </td>
                </tr>
                <tr>
                  <td className="py-1.5 pr-4 text-gray-500 dark:text-gray-400 align-top">Correspondence Address</td>
                  <td className="py-1.5 font-medium whitespace-pre-line">{address || '—'}</td>
                </tr>
              </tbody>
            </table>
          </section>

          <section className="mt-6">
            <h2 className="text-sm font-bold uppercase tracking-wide text-gray-900 dark:text-gray-100">2. Educational Qualifications</h2>
            <table className="mt-3 w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-300 text-left text-xs uppercase tracking-wide text-gray-500 dark:border-gray-600 dark:text-gray-400">
                  <th className="py-2 pr-4">Examination</th>
                  <th className="py-2 pr-4">Board / University</th>
                  <th className="py-2 pr-4">Year</th>
                  <th className="py-2">Marks (%)</th>
                </tr>
              </thead>
              <tbody>
                {education.map((row) => (
                  <tr key={row.id} className="border-b border-gray-200 dark:border-gray-700">
                    <td className="py-1.5 pr-4 font-medium">{row.exam || '—'}</td>
                    <td className="py-1.5 pr-4">{row.board || '—'}</td>
                    <td className="py-1.5 pr-4">{row.year || '—'}</td>
                    <td className="py-1.5">{row.percent ? `${row.percent}%` : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <section className="mt-6">
            <h2 className="text-sm font-bold uppercase tracking-wide text-gray-900 dark:text-gray-100">3. Work Experience</h2>
            {experience.length === 0 ? (
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Fresher / Not applicable</p>
            ) : (
              <table className="mt-3 w-full text-sm">
                <tbody>
                  {experience.map((row) => (
                    <tr key={row.id} className="border-b border-gray-200 dark:border-gray-700">
                      <td className="py-1.5 pr-4 font-medium">{row.role || 'Role'}</td>
                      <td className="py-1.5 pr-4">{row.org || '—'}</td>
                      <td className="py-1.5">{row.period || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>

          <section className="mt-6">
            <h2 className="text-sm font-bold uppercase tracking-wide text-gray-900 dark:text-gray-100">4. Skills / Additional Information</h2>
            <p className="mt-2 text-sm whitespace-pre-line">{skills || '—'}</p>
          </section>

          <section className="mt-6">
            <h2 className="text-sm font-bold uppercase tracking-wide text-gray-900 dark:text-gray-100">5. Declaration</h2>
            <p className="mt-2 text-sm whitespace-pre-line">{declaration}</p>
          </section>

          <div className="mt-10 flex items-end justify-between text-sm">
            <div>
              <p className="text-gray-500 dark:text-gray-400">Place: {place || '______'}</p>
              <p className="mt-6 text-gray-500 dark:text-gray-400">Signature: {signature || '_____________'}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="space-y-6">
        <div>
          <label className="label">Full Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Rahul Kumar Singh" className="input mt-1" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="label">Father&apos;s / Husband&apos;s Name</label>
            <input value={father} onChange={(e) => setFather(e.target.value)} className="input mt-1" />
          </div>
          <div>
            <label className="label">Date of Birth</label>
            <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} className="input mt-1" />
          </div>
          <div>
            <label className="label">Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="input mt-1">
              {['General', 'OBC', 'SC', 'ST', 'EWS'].map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Marital Status</label>
            <select value={marital} onChange={(e) => setMarital(e.target.value)} className="input mt-1">
              {['Single', 'Married'].map((m) => (
                <option key={m}>{m}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="label">Mobile Number</label>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="e.g. 98765 43210" className="input mt-1" />
          </div>
          <div>
            <label className="label">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input mt-1" />
          </div>
        </div>
        <div>
          <label className="label">Correspondence Address</label>
          <textarea value={address} onChange={(e) => setAddress(e.target.value)} rows={2} className="input mt-1" />
        </div>

        <div>
          <div className="flex items-center gap-3">
            <label className="label mb-0">Education</label>
            <button onClick={addEdu} className="btn-secondary px-3 py-1.5 text-xs">
              <Plus className="mr-1 inline h-3 w-3" /> Add Row
            </button>
          </div>
          <div className="mt-3 space-y-2">
            {education.map((row) => (
              <div key={row.id} className="flex flex-wrap gap-2 rounded-lg bg-gray-50 p-2 dark:bg-gray-800/50">
                <input value={row.exam} onChange={(e) => updateEdu(row.id, 'exam', e.target.value)} placeholder="Exam (e.g. 10th / Graduation)" className="input min-w-[160px] flex-1" />
                <input value={row.board} onChange={(e) => updateEdu(row.id, 'board', e.target.value)} placeholder="Board / University" className="input min-w-[140px] flex-1" />
                <input value={row.year} onChange={(e) => updateEdu(row.id, 'year', e.target.value)} placeholder="Year" className="input w-20" />
                <input value={row.percent} onChange={(e) => updateEdu(row.id, 'percent', e.target.value)} placeholder="%" className="input w-20" />
                <button onClick={() => removeEdu(row.id)} className="rounded-lg p-2 text-gray-400 hover:text-red-500" aria-label="Remove row">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-3">
            <label className="label mb-0">Work Experience</label>
            <button onClick={addExp} className="btn-secondary px-3 py-1.5 text-xs">
              <Plus className="mr-1 inline h-3 w-3" /> Add
            </button>
          </div>
          <div className="mt-3 space-y-2">
            {experience.length === 0 && <p className="text-sm text-gray-500 dark:text-gray-400">Fresher? Leave empty — it will show as &quot;Fresher&quot;.</p>}
            {experience.map((row) => (
              <div key={row.id} className="flex flex-wrap gap-2 rounded-lg bg-gray-50 p-2 dark:bg-gray-800/50">
                <input value={row.role} onChange={(e) => updateExp(row.id, 'role', e.target.value)} placeholder="Role / Post" className="input min-w-[160px] flex-1" />
                <input value={row.org} onChange={(e) => updateExp(row.id, 'org', e.target.value)} placeholder="Organization / Dept." className="input min-w-[140px] flex-1" />
                <input value={row.period} onChange={(e) => updateExp(row.id, 'period', e.target.value)} placeholder="Period (e.g. 2021-Present)" className="input min-w-[130px]" />
                <button onClick={() => removeExp(row.id)} className="rounded-lg p-2 text-gray-400 hover:text-red-500" aria-label="Remove row">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="label">Skills / Additional Information</label>
          <textarea value={skills} onChange={(e) => setSkills(e.target.value)} rows={2} placeholder="Computer skills, typing speed, certifications, achievements..." className="input mt-1" />
        </div>

        <div>
          <label className="label">Declaration</label>
          <textarea value={declaration} onChange={(e) => setDeclaration(e.target.value)} rows={2} className="input mt-1" />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className="label">Place</label>
            <input value={place} onChange={(e) => setPlace(e.target.value)} className="input mt-1" />
          </div>
          <div>
            <label className="label">Signature Name</label>
            <input value={signature} onChange={(e) => setSignature(e.target.value)} className="input mt-1" />
          </div>
          <div className="flex items-end pb-1">
            <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <input type="checkbox" checked={photoOptIn} onChange={(e) => setPhotoOptIn(e.target.checked)} /> Include photo box
            </label>
          </div>
        </div>

        <button onClick={() => setShowPreview(true)} className="btn-primary w-full sm:w-auto">
          Preview Resume
        </button>
      </div>
    </div>
  );
}