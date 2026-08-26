'use client';

import { useState } from 'react';
import { Copy, Check, Sparkles } from 'lucide-react';

type ParaphraseStyle = 'formal' | 'casual' | 'creative';

const SYNONYM_MAP: Record<string, Record<ParaphraseStyle, string[]>> = {
  good: { formal: ['excellent', 'superior'], casual: ['solid', 'great'], creative: ['splendid', 'remarkable'] },
  bad: { formal: ['subpar', 'inadequate'], casual: ['lousy', 'rough'], creative: ['dismal', 'lackluster'] },
  big: { formal: ['substantial', 'considerable'], casual: ['huge', 'massive'], creative: ['enormous', 'colossal'] },
  small: { formal: ['minimal', 'modest'], casual: ['tiny', 'little'], creative: ['petite', 'compact'] },
  important: { formal: ['crucial', 'essential'], casual: ['key', 'vital'], creative: ['paramount', 'indispensable'] },
  show: { formal: ['demonstrate', 'illustrate'], casual: ['show', 'reveal'], creative: ['unveil', 'exhibit'] },
  help: { formal: ['assist', 'facilitate'], casual: ['aid', 'support'], creative: ['lend a hand', 'bolster'] },
  use: { formal: ['utilize', 'employ'], casual: ['use', 'make use of'], creative: ['leverage', 'harness'] },
  make: { formal: ['produce', 'construct'], casual: ['build', 'create'], creative: ['craft', 'forge'] },
  get: { formal: ['obtain', 'acquire'], casual: ['grab', 'pick up'], creative: ['procure', 'secure'] },
  think: { formal: ['consider', 'contemplate'], casual: ['figure', 'reckon'], creative: ['ponder', 'muse'] },
  say: { formal: ['state', 'indicate'], casual: ['mention', 'note'], creative: ['express', 'declare'] },
  give: { formal: ['provide', 'supply'], casual: ['hand over', 'offer'], creative: ['bestow', 'impart'] },
  try: { formal: ['attempt', 'endeavor'], casual: ['give it a shot', 'go for'], creative: ['strive', 'venture'] },
  need: { formal: ['require', 'necessitate'], casual: ['need', 'want'], creative: ['demand', 'call for'] },
  begin: { formal: ['commence', 'initiate'], casual: ['start', 'kick off'], creative: ['launch', 'embark'] },
  end: { formal: ['conclude', 'terminate'], casual: ['wrap up', 'finish'], creative: ['finalize', 'culminate'] },
  change: { formal: ['modify', 'alter'], casual: ['tweak', 'switch up'], creative: ['transform', 'revamp'] },
  keep: { formal: ['maintain', 'preserve'], casual: ['hold onto', 'stick with'], creative: ['sustain', 'uphold'] },
  understand: { formal: ['comprehend', 'grasp'], casual: ['get', 'see'], creative: ['fathom', 'discern'] },
  lead: { formal: ['direct', 'guide'], casual: ['head', 'steer'], creative: ['pilot', 'navigate'] },
  stop: { formal: ['cease', 'discontinue'], casual: ['quit', 'drop'], creative: ['halt', 'desist'] },
  grow: { formal: ['expand', 'develop'], casual: ['build up', 'scale'], creative: ['flourish', 'thrive'] },
  write: { formal: ['compose', 'draft'], casual: ['put together', 'jot down'], creative: ['pen', 'author'] },
  include: { formal: ['incorporate', 'encompass'], casual: ['add in', 'cover'], creative: ['embrace', 'integrate'] },
  set: { formal: ['establish', 'configure'], casual: ['put', 'set up'], creative: ['arrange', 'organize'] },
  learn: { formal: ['study', 'acquire knowledge of'], casual: ['pick up', 'figure out'], creative: ['master', 'absorb'] },
  believe: { formal: ['accept', 'trust'], casual: ['buy into', 'think'], creative: ['have faith in', 'embrace'] },
  find: { formal: ['discover', 'locate'], casual: ['come across', 'track down'], creative: ['uncover', 'unearth'] },
  tell: { formal: ['inform', 'notify'], casual: ['let know', 'fill in'], creative: ['apprise', 'enlighten'] },
  ask: { formal: ['inquire', 'request'], casual: ['ask', 'query'], creative: ['pose', 'entreat'] },
  seem: { formal: ['appear', 'evidently'], casual: ['look like', 'feel like'], creative: ['suggest', 'portray'] },
  feel: { formal: ['sense', 'perceive'], casual: ['feel', 'get the sense'], creative: ['intuit', 'experience'] },
  live: { formal: ['reside', 'dwell'], casual: ['live', 'stay'], creative: ['inhabit', 'abide'] },
  run: { formal: ['operate', 'manage'], casual: ['handle', 'run'], creative: ['orchestrate', 'commandeer'] },
  move: { formal: ['relocate', 'transfer'], casual: ['shift', 'head'], creative: ['journey', 'traverse'] },
  bring: { formal: ['transport', 'convey'], casual: ['carry', 'bring'], creative: ['deliver', 'bear'] },
  happen: { formal: ['occur', 'transpire'], casual: ['come up', 'go down'], creative: ['unfold', 'emerge'] },
  sit: { formal: ['be seated', 'settle'], casual: ['sit', 'park'], creative: ['rest', 'recline'] },
  stand: { formal: ['endure', 'withstand'], casual: ['put up with', 'handle'], creative: ['brave', 'weather'] },
  lose: { formal: ['forfeit', 'surrender'], casual: ['drop', 'misplace'], creative: ['sacrifice', 'forfeit'] },
  pay: { formal: ['compensate', 'remit'], casual: ['cover', 'settle up'], creative: ['remunerate', 'reimburse'] },
  meet: { formal: ['encounter', 'convene'], casual: ['run into', 'see'], creative: ['cross paths with'] },
  read: { formal: ['peruse', 'examine'], casual: ['read', 'scan'], creative: ['devour', 'digest'] },
  spend: { formal: ['expend', 'allocate'], casual: ['drop', 'blow'], creative: ['invest', 'devote'] },
  watch: { formal: ['observe', 'monitor'], casual: ['check out', 'look at'], creative: ['survey', 'contemplate'] },
  follow: { formal: ['comply with', 'adhere to'], casual: ['go along with', 'stick to'], creative: ['abide by', 'heed'] },
  speak: { formal: ['articulate', 'communicate'], casual: ['talk', 'chat'], creative: ['voice', 'proclaim'] },
  open: { formal: ['unlock', 'unseal'], casual: ['open up', 'crack open'], creative: ['reveal', 'expose'] },
  win: { formal: ['triumph', 'prevail'], casual: ['come out on top', 'nail it'], creative: ['conquer', 'prevail'] },
  offer: { formal: ['propose', 'present'], casual: ['throw in', 'give'], creative: ['tender', 'proffer'] },
  remember: { formal: ['recall', 'recollect'], casual: ['keep in mind', 'bear in mind'], creative: ['hark back to', 'reminisce'] },
  love: { formal: ['adore', 'cherish'], casual: ['love', 'dig'], creative: ['adore', 'revere'] },
  consider: { formal: ['contemplate', 'weigh'], casual: ['think about', 'mull over'], creative: ['ponder', 'reflect on'] },
  appear: { formal: ['materialize', 'manifest'], casual: ['show up', 'pop up'], creative: ['emerge', 'surface'] },
  buy: { formal: ['purchase', 'acquire'], casual: ['pick up', 'get'], creative: ['procure', 'secure'] },
  serve: { formal: ['cater to', 'attend to'], casual: ['help out', 'serve'], creative: ['minister to', 'aid'] },
  die: { formal: ['perish', 'expire'], casual: ['pass away', 'croak'], creative: ['depart', 'succumb'] },
  send: { formal: ['transmit', 'dispatch'], casual: ['shoot over', 'fire off'], creative: ['forward', 'convey'] },
  build: { formal: ['construct', 'erect'], casual: ['put together', 'throw up'], creative: ['craft', 'forge'] },
  stay: { formal: ['remain', 'linger'], casual: ['stick around', 'hang out'], creative: ['tarry', 'linger'] },
  fall: { formal: ['descend', 'plummet'], casual: ['drop', 'tumble'], creative: ['plunge', 'cascade'] },
  cut: { formal: ['sever', 'trim'], casual: ['chop', 'snip'], creative: ['slice', 'cleave'] },
  reach: { formal: ['attain', 'achieve'], casual: ['get to', 'hit'], creative: ['attain', 'accomplish'] },
  kill: { formal: ['eliminate', 'neutralize'], casual: ['take out', 'off'], creative: ['slay', 'dispatch'] },
  remain: { formal: ['persist', 'endure'], casual: ['stay', 'stick around'], creative: ['linger', 'abide'] },
  suggest: { formal: ['recommend', 'advise'], casual: ['propose', 'throw out'], creative: ['put forward', 'counsel'] },
  raise: { formal: ['elevate', 'increase'], casual: ['bump up', 'jack up'], creative: ['lift', 'boost'] },
  pass: { formal: ['proceed', 'advance'], casual: ['get by', 'go through'], creative: ['navigate', 'traverse'] },
  sell: { formal: ['market', 'vend'], casual: ['move', 'push'], creative: ['peddle', 'retail'] },
  require: { formal: ['necessitate', 'demand'], casual: ['need', 'call for'], creative: ['entail', 'dictate'] },
  report: { formal: ['document', 'state'], casual: ['tell', 'fill in'], creative: ['account for', 'relay'] },
  decide: { formal: ['determine', 'resolve'], casual: ['make up mind', 'go with'], creative: ['determine', 'conclude'] },
  pull: { formal: ['extract', 'draw'], casual: ['yank', 'tug'], creative: ['haul', 'wrench'] },
};

function paraphraseText(text: string, style: ParaphraseStyle): string {
  const words = text.split(/(\s+)/);

  return words
    .map((segment) => {
      if (/^\s+$/.test(segment)) return segment;

      const lower = segment.toLowerCase().replace(/[^a-z]/g, '');
      const punct = segment.match(/[^a-zA-Z]*$/)?.[0] ?? '';
      const cleaned = segment.replace(/[^a-zA-Z]/g, '');

      if (SYNONYM_MAP[lower] && Math.random() > 0.4) {
        const synonyms = SYNONYM_MAP[lower][style];
        const replacement = synonyms[Math.floor(Math.random() * synonyms.length)];
        // Preserve original capitalization
        if (cleaned[0] === cleaned[0]?.toUpperCase()) {
          return replacement.charAt(0).toUpperCase() + replacement.slice(1) + punct;
        }
        return replacement + punct;
      }

      return segment;
    })
    .join('');
}

export function AiParaphraserTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [style, setStyle] = useState<ParaphraseStyle>('formal');
  const [copied, setCopied] = useState(false);

  const handleParaphrase = () => {
    if (!input.trim()) return;
    setOutput(paraphraseText(input, style));
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="card">
      <div className="space-y-6">
        <div>
          <label className="label">Text to Paraphrase</label>
          <textarea
              className="input mt-1 min-h-[160px] resize-y"
            placeholder="Paste the text you want to paraphrase..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>

        <div>
          <label className="label">Writing Style</label>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {(['formal', 'casual', 'creative'] as ParaphraseStyle[]).map((s) => (
              <button
                key={s}
                onClick={() => setStyle(s)}
                className={`rounded-lg px-4 py-2.5 text-sm font-medium capitalize transition-colors ${
                  style === s
                    ? 'bg-brand-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <button onClick={handleParaphrase} disabled={!input.trim()} className="btn-primary inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium disabled:opacity-50">
          <Sparkles className="h-4 w-4" />
          Paraphrase
        </button>

        {output && (
          <div>
            <div className="flex items-center justify-between">
              <label className="label">Paraphrased Text</label>
              <button onClick={handleCopy} className="btn-secondary inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium">
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <textarea
            className="input mt-1 min-h-[160px] resize-y"
              readOnly
              value={output}
            />
          </div>
        )}
      </div>
    </div>
  );
}
