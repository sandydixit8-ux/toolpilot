'use client';

import { useState, useCallback, useRef } from 'react';
import { Upload, FileText, Loader2, CheckCircle2, AlertTriangle, XCircle, Copy, RefreshCw, TrendingUp, Target, Lightbulb, Award, Eye } from 'lucide-react';
import { parseResumeFile, parseTextResume, ParsedResume } from '@/lib/resume-parser';
import { analyzeResume, AtsAnalysis } from '@/lib/resume-analyzer';
import { matchJobDescription, JdMatchResult } from '@/lib/jd-matcher';
import { generateRewriteSuggestions, RewriteSuggestion } from '@/lib/rewrite-suggestions';

type Tab = 'ats' | 'jd-match' | 'rewrites' | 'ats-view';

function ScoreGauge({ value, label }: { value: number; label: string }) {
  const color = value >= 70 ? 'bg-green-500' : value >= 40 ? 'bg-yellow-500' : 'bg-red-500';
  const textColor = value >= 70 ? 'text-green-600 dark:text-green-400' : value >= 40 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400';
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-600 dark:text-gray-400 font-medium">{label}</span>
        <span className={`font-bold ${textColor}`}>{value}</span>
      </div>
      <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
        <div className={`h-2 rounded-full ${color} transition-all duration-700`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

export function ResumeAnalyzerTool() {
  const [parsed, setParsed] = useState<ParsedResume | null>(null);
  const [analysis, setAnalysis] = useState<AtsAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [pasteText, setPasteText] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState<Tab>('ats');
  const [jdText, setJdText] = useState('');
  const [jdTitle, setJdTitle] = useState('');
  const [jdCompany, setJdCompany] = useState('');
  const [jdMatch, setJdMatch] = useState<JdMatchResult | null>(null);
  const [jdLoading, setJdLoading] = useState(false);
  const [rewrites, setRewrites] = useState<RewriteSuggestion[]>([]);
  const [rewritesLoading, setRewritesLoading] = useState(false);

  const processFile = useCallback(async (file: File) => {
    setLoading(true);
    setError('');
    try {
      const result = await parseResumeFile(file);
      setParsed(result);
      setAnalysis(analyzeResume(result));
      setActiveTab('ats');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to parse file');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length > 0) processFile(e.dataTransfer.files[0]);
  }, [processFile]);

  const handlePaste = () => {
    if (!pasteText.trim()) return;
    setLoading(true);
    setError('');
    try {
      const result = parseTextResume(pasteText);
      setParsed(result);
      setAnalysis(analyzeResume(result));
      setActiveTab('ats');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to parse');
    } finally {
      setLoading(false);
    }
  };

  const handleJDMatch = () => {
    if (!parsed || !jdText.trim()) return;
    setJdLoading(true);
    try {
      const result = matchJobDescription(parsed, jdText, jdTitle, jdCompany);
      setJdMatch(result);
      setActiveTab('jd-match');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to match');
    } finally {
      setJdLoading(false);
    }
  };

  const handleRewrite = () => {
    if (!parsed) return;
    setRewritesLoading(true);
    try {
      const result = generateRewriteSuggestions(parsed);
      setRewrites(result);
      setActiveTab('rewrites');
    } finally {
      setRewritesLoading(false);
    }
  };

  const copyText = (text: string) => { navigator.clipboard.writeText(text); };

  if (loading) {
    return (
      <div className="card">
        <div className="flex flex-col items-center gap-4 py-12">
          <div className="h-12 w-12 rounded-full border-4 border-blue-800 border-t-blue-500 animate-spin" />
          <p className="text-gray-600 dark:text-gray-400 font-medium">Analyzing your resume...</p>
        </div>
      </div>
    );
  }

  if (!parsed || !analysis) {
    return (
      <div className="card space-y-6">
        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-xl flex items-start gap-3">
            <XCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
            <span className="text-sm text-red-600 dark:text-red-400">{error}</span>
          </div>
        )}

        <div
          className={`rounded-xl border-2 border-dashed p-12 text-center cursor-pointer transition-all ${dragOver ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30' : 'border-gray-300 dark:border-gray-700 hover:border-blue-400'}`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileRef.current?.click()}
        >
          <input ref={fileRef} type="file" accept=".pdf,.docx,.doc,.txt" className="hidden" onChange={(e) => { if (e.target.files?.[0]) processFile(e.target.files[0]); }} />
          <Upload className="h-10 w-10 mx-auto text-gray-400 mb-3" />
          <p className="font-semibold text-gray-900 dark:text-white">Drop your resume here or click to browse</p>
          <p className="text-sm text-gray-500 mt-1">PDF, DOCX, or TXT — max 10 MB</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
          <span className="text-xs text-gray-500 font-medium">OR</span>
          <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
        </div>

        <div>
          <label className="label">Paste Resume Text</label>
          <textarea value={pasteText} onChange={(e) => setPasteText(e.target.value)} placeholder="Paste your full resume text here..." rows={8} className="input mt-1 resize-none" />
        </div>
        <button onClick={handlePaste} disabled={!pasteText.trim()} className="btn-primary w-full disabled:opacity-40">Analyze Resume</button>
      </div>
    );
  }

  const score = analysis.overallScore;
  const scoreColor = score >= 70 ? 'from-green-500 to-emerald-500' : score >= 40 ? 'from-yellow-400 to-orange-500' : 'from-red-500 to-rose-500';

  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
            <FileText className="h-4 w-4" />
            <span>{parsed.rawText.length} characters parsed</span>
            {parsed.issues.length > 0 && <span className="text-yellow-500">· {parsed.issues.length} issue(s) found</span>}
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">ATS Compatibility Score</h3>
          <div className="h-3 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden mb-6">
            <div className={`h-3 rounded-full bg-gradient-to-r ${scoreColor} transition-all duration-1000`} style={{ width: `${score}%` }} />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Object.entries(analysis.categoryScores).map(([key, val]) => (
              <ScoreGauge key={key} value={val} label={key} />
            ))}
          </div>
        </div>

        <div className="card flex flex-col items-center justify-center text-center">
          <div className={`w-32 h-32 rounded-full flex items-center justify-center bg-gradient-to-br ${scoreColor} shadow-lg mb-3`}>
            <span className="text-4xl font-extrabold text-white">{score}</span>
          </div>
          <div className={`text-lg font-bold ${score >= 70 ? 'text-green-600 dark:text-green-400' : score >= 40 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'}`}>
            Grade: {analysis.grade}
          </div>
          <p className="text-sm text-gray-500 mt-1">
            {score >= 80 ? 'Great!' : score >= 60 ? 'Needs Work' : 'Poor'}
          </p>
          {analysis.priorityFixes.length > 0 && (
            <p className="text-xs text-gray-500 mt-3">{analysis.priorityFixes.length} priority fix(es) recommended</p>
          )}
        </div>
      </div>

      <div className="card">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2"><Target className="h-4 w-4 text-blue-500" /> Job Description</h4>
        <p className="text-xs text-gray-500 mb-3">Paste a job description to match, rewrite, and get suggestions</p>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <input className="input" placeholder="Job Title (optional)" value={jdTitle} onChange={(e) => setJdTitle(e.target.value)} />
          <input className="input" placeholder="Company (optional)" value={jdCompany} onChange={(e) => setJdCompany(e.target.value)} />
        </div>
        <textarea value={jdText} onChange={(e) => setJdText(e.target.value)} placeholder="Paste the full job description here..." rows={4} className="input resize-none mb-3" />
        <div className="flex flex-wrap gap-2">
          <button onClick={handleJDMatch} disabled={!jdText.trim() || jdLoading} className="btn-primary disabled:opacity-40">
            {jdLoading ? <><Loader2 className="h-4 w-4 animate-spin mr-1" /> Matching...</> : <><Target className="h-4 w-4 mr-1" /> Match to JD</>}
          </button>
          <button onClick={handleRewrite} disabled={rewritesLoading} className="btn-secondary disabled:opacity-40">
            {rewritesLoading ? <><Loader2 className="h-4 w-4 animate-spin mr-1" /> Generating...</> : <><Lightbulb className="h-4 w-4 mr-1" /> Rewrite Suggestions</>}
          </button>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {(['ats', 'jd-match', 'rewrites', 'ats-view'] as Tab[]).map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-colors ${activeTab === tab ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'}`}>
            {tab === 'ats' && 'ATS Details'}
            {tab === 'jd-match' && `JD Match${jdMatch ? ` (${jdMatch.matchScore}%)` : ''}`}
            {tab === 'rewrites' && `Rewrites${rewrites.length ? ` (${rewrites.length})` : ''}`}
            {tab === 'ats-view' && 'ATS View'}
          </button>
        ))}
      </div>

      {activeTab === 'ats' && (
        <div className="space-y-4">
          <div className="card">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2"><Award className="h-4 w-4 text-blue-500" /> Category Breakdown</h4>
            <div className="space-y-3">
              {Object.entries(analysis.categoryFeedback).map(([key, feedback]) => (
                <div key={key} className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{key}</span>
                    <span className={`text-sm font-bold px-2 py-0.5 rounded-full ${analysis.categoryScores[key] >= 70 ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400' : analysis.categoryScores[key] >= 40 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400' : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400'}`}>{analysis.categoryScores[key]}/100</span>
                  </div>
                  <p className="text-xs text-gray-500">{feedback}</p>
                </div>
              ))}
            </div>
          </div>
          {analysis.suggestions.length > 0 && (
            <div className="card bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800">
              <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">Suggestions</h4>
              <ul className="space-y-1">
                {analysis.suggestions.map((s, i) => <li key={i} className="text-sm text-blue-800 dark:text-blue-400">• {s}</li>)}
              </ul>
            </div>
          )}
          {parsed.issues.length > 0 && (
            <div className="card bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-800">
              <h4 className="font-semibold text-yellow-900 dark:text-yellow-300 mb-2 flex items-center gap-2"><AlertTriangle className="h-4 w-4" /> Parsing Issues</h4>
              <ul className="space-y-1">
                {parsed.issues.map((issue, i) => <li key={i} className="text-sm text-yellow-800 dark:text-yellow-400">• [{issue.severity}] {issue.detail}</li>)}
              </ul>
            </div>
          )}
        </div>
      )}

      {activeTab === 'jd-match' && jdMatch && (
        <div className="space-y-4">
          <div className="card text-center">
            <p className="text-sm text-gray-500">Match Score</p>
            <p className={`text-5xl font-bold mt-1 ${jdMatch.matchScore >= 70 ? 'text-green-600 dark:text-green-400' : jdMatch.matchScore >= 40 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'}`}>{jdMatch.matchScore}%</p>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {jdMatch.matchedKeywords.length > 0 && (
              <div className="card bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800">
                <h4 className="font-semibold text-green-800 dark:text-green-300 mb-2 flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> Matched ({jdMatch.matchedKeywords.length})</h4>
                <div className="flex flex-wrap gap-1">{jdMatch.matchedKeywords.map((k, i) => <span key={i} className="px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 text-xs">{k.skill}</span>)}</div>
              </div>
            )}
            {jdMatch.missingHardRequirements.length > 0 && (
              <div className="card bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800">
                <h4 className="font-semibold text-red-800 dark:text-red-300 mb-2 flex items-center gap-2"><XCircle className="h-4 w-4" /> Missing ({jdMatch.missingHardRequirements.length})</h4>
                <div className="flex flex-wrap gap-1">{jdMatch.missingHardRequirements.map((k, i) => <span key={i} className="px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400 text-xs">{k.skill}</span>)}</div>
              </div>
            )}
          </div>
          {jdMatch.niceToHave.length > 0 && (
            <div className="card bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-800">
              <h4 className="font-semibold text-yellow-800 dark:text-yellow-300 mb-2">Nice-to-Have ({jdMatch.niceToHave.length})</h4>
              <div className="flex flex-wrap gap-1">{jdMatch.niceToHave.slice(0, 15).map((k, i) => <span key={i} className="px-2 py-0.5 rounded-full bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-400 text-xs">{k.skill}</span>)}</div>
            </div>
          )}
          {jdMatch.semanticGaps.length > 0 && (
            <div className="card">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2"><TrendingUp className="h-4 w-4 text-blue-500" /> Semantic Gaps</h4>
              <div className="space-y-2">{jdMatch.semanticGaps.map((gap, i) => (
                <div key={i} className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                  <p className="text-sm font-medium">JD mentions: <span className="text-blue-600 dark:text-blue-400">{gap.jdTerm}</span></p>
                  <p className="text-xs text-gray-500 mt-1">{gap.suggestion}</p>
                </div>
              ))}</div>
            </div>
          )}
          {jdMatch.overIndexed.length > 0 && (
            <div className="card">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-yellow-500" /> Over-Indexed Items</h4>
              <ul className="space-y-1">{jdMatch.overIndexed.map((item, i) => (
                <li key={i} className="text-sm p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50"><strong>{item.item}</strong> ({item.type}) — <span className="text-gray-500">{item.suggestion}</span></li>
              ))}</ul>
            </div>
          )}
          {jdMatch.strengths.length > 0 && (
            <div className="card bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800">
              <h4 className="font-semibold text-green-800 dark:text-green-300 mb-2">Strengths</h4>
              <ul className="space-y-1">{jdMatch.strengths.map((s, i) => <li key={i} className="text-sm text-green-700 dark:text-green-400">✓ {s}</li>)}</ul>
            </div>
          )}
          {jdMatch.improvements.length > 0 && (
            <div className="card bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-800">
              <h4 className="font-semibold text-yellow-800 dark:text-yellow-300 mb-2">Improvements</h4>
              <ul className="space-y-1">{jdMatch.improvements.map((s, i) => <li key={i} className="text-sm text-yellow-700 dark:text-yellow-400">• {s}</li>)}</ul>
            </div>
          )}
        </div>
      )}

      {activeTab === 'jd-match' && !jdMatch && (
        <div className="card text-center py-12">
          <Target className="h-10 w-10 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
          <p className="text-gray-500">Paste a job description above and click &ldquo;Match to JD&rdquo;</p>
        </div>
      )}

      {activeTab === 'rewrites' && (
        <div className="space-y-4">
          {rewrites.length > 0 ? rewrites.map((r, i) => (
            <div key={i} className="card relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-500 to-cyan-500" />
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-900 dark:text-white">{r.section}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${r.type === 'cliche' || r.type === 'weak' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400'}`}>{r.type}</span>
              </div>
              <div className="mb-2">
                <p className="text-xs text-gray-500 mb-1 font-medium">Original:</p>
                <div className="p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50 text-sm border border-gray-200 dark:border-gray-700">{r.original}</div>
              </div>
              <div className="mb-2">
                <p className="text-xs text-gray-500 mb-1 font-medium">Suggestion:</p>
                <div className="p-2 rounded-lg bg-green-50 dark:bg-green-950/30 text-sm border border-green-200 dark:border-green-800">{r.suggestion}</div>
              </div>
              <p className="text-xs text-gray-500">{r.explanation}</p>
            </div>
          )) : (
            <div className="card text-center py-12">
              <Lightbulb className="h-10 w-10 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
              <p className="text-gray-500">Click &ldquo;Rewrite Suggestions&rdquo; above to get improvements</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'ats-view' && (
        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2"><Eye className="h-4 w-4 text-blue-500" /> ATS View</h4>
            <button onClick={() => copyText(parsed.atsViewText)} className="btn-secondary text-xs"><Copy className="h-3 w-3 mr-1" /> Copy</button>
          </div>
          <p className="text-xs text-gray-500 mb-3">This is how an ATS parser sees your resume — raw text with no formatting</p>
          <pre className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 text-xs font-mono whitespace-pre-wrap max-h-[500px] overflow-y-auto leading-relaxed border border-gray-200 dark:border-gray-700">{parsed.atsViewText}</pre>
        </div>
      )}

      <button onClick={() => { setParsed(null); setAnalysis(null); setJdMatch(null); setRewrites([]); }} className="btn-secondary w-full">
        <RefreshCw className="h-4 w-4 mr-2" /> Analyze New Resume
      </button>
    </div>
  );
}
