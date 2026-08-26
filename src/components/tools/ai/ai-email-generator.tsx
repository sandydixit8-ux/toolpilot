'use client';

import { useState } from 'react';
import { Copy, Check, Sparkles } from 'lucide-react';

type EmailTone = 'formal' | 'casual';

interface EmailForm {
  recipient: string;
  subject: string;
  purpose: string;
  tone: EmailTone;
}

function generateEmail(form: EmailForm): string {
  const { recipient, subject, purpose, tone } = form;
  const recipientLine = recipient || 'there';

  if (tone === 'formal') {
    return `Subject: ${subject || 'Regarding Your Inquiry'}

Dear ${recipientLine},

I hope this message finds you well. I am writing to you regarding ${purpose || 'the matter at hand'}.

I would appreciate the opportunity to discuss this further at your earliest convenience. Please do not hesitate to reach out if you require any additional information or clarification.

Thank you for your time and consideration. I look forward to hearing from you.

Best regards,
[Your Name]`;
  }

  return `Subject: ${subject || 'Quick Note'}

Hey ${recipientLine},

Hope you're doing well! I wanted to reach out about ${purpose || 'something'}.

Let me know if you have any questions or want to chat about this further. Happy to help however I can!

Talk soon,
[Your Name]`;
}

export function AiEmailGeneratorTool() {
  const [form, setForm] = useState<EmailForm>({ recipient: '', subject: '', purpose: '', tone: 'formal' });
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  const update = (field: keyof EmailForm, value: string) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleGenerate = () => {
    if (!form.purpose.trim() && !form.subject.trim()) return;
    setOutput(generateEmail(form));
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isValid = form.purpose.trim() || form.subject.trim();

  return (
    <div className="card">
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="label">Recipient Name</label>
            <input type="text" className="input mt-1" placeholder="John Smith" value={form.recipient} onChange={(e) => update('recipient', e.target.value)} />
          </div>
          <div>
            <label className="label">Subject</label>
            <input type="text" className="input mt-1" placeholder="Follow-up on Proposal" value={form.subject} onChange={(e) => update('subject', e.target.value)} />
          </div>
        </div>

        <div>
          <label className="label">Purpose / Context</label>
          <textarea
            className="input mt-1 min-h-[80px] resize-y"
            placeholder="Describe what this email is about..."
            value={form.purpose}
            onChange={(e) => update('purpose', e.target.value)}
          />
        </div>

        <div>
          <label className="label">Tone</label>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {(['formal', 'casual'] as EmailTone[]).map((t) => (
              <button
                key={t}
                onClick={() => update('tone', t)}
                className={`rounded-lg px-4 py-2.5 text-sm font-medium capitalize transition-colors ${
                  form.tone === t
                    ? 'bg-brand-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <button onClick={handleGenerate} disabled={!isValid} className="btn-primary inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium disabled:opacity-50">
          <Sparkles className="h-4 w-4" />
          Generate Email
        </button>

        {output && (
          <div>
            <div className="flex items-center justify-between">
              <label className="label">Generated Email</label>
              <button onClick={handleCopy} className="btn-secondary inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium">
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <textarea
              className="input mt-1 min-h-[260px] resize-y"
              readOnly
              value={output}
            />
          </div>
        )}
      </div>
    </div>
  );
}
