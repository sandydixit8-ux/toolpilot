'use client';

import { useState } from 'react';
import { Copy, Check, RefreshCw, Sparkles } from 'lucide-react';

const DATA: Record<string, { prefixes: string[]; suffixes: string[]; keywords: string[] }> = {
  Technology: {
    prefixes: ['Code', 'Alpha', 'Next', 'Nimbus', 'Vertex', 'Byte', 'Cloud', 'Logic', 'Pixel', 'Zen'],
    suffixes: ['Labs', 'Tech', 'Systems', 'Soft', 'Works', 'Hub', 'IO', 'Dynamics', 'Digital', 'Solutions'],
    keywords: ['tech', 'software', 'digital', 'cloud', 'data'],
  },
  'Food & Beverages': {
    prefixes: ['Spice', 'Fresh', 'Bite', 'Yum', 'Zest', 'Crunch', 'Momo', 'Chai', 'Taste', 'Golden'],
    suffixes: ['Kitchen', 'Eats', 'Bites', 'House', 'Fusion', 'Corner', 'Express', 'Cafe', 'Co.', 'Hub'],
    keywords: ['food', 'restaurant', 'cafe', 'taste', 'flavor'],
  },
  Fashion: {
    prefixes: ['Urban', 'Style', 'Trend', 'Moda', 'Vogue', 'Thread', 'Wear', 'Glitz', 'Nova', 'Luxe'],
    suffixes: ['Wear', 'Style', 'Threads', 'Co.', 'Studio', 'Apparel', 'Loft', 'Line', 'Brand', 'Outlet'],
    keywords: ['fashion', 'clothing', 'style', 'wear', 'apparel'],
  },
  'Real Estate': {
    prefixes: ['Star', 'Green', 'City', 'Prime', 'Sky', 'Royal', 'Metro', 'Sunrise', 'Land', 'Palm'],
    suffixes: ['Estates', 'Homes', 'Properties', 'Realtors', 'Ventures', 'Builders', 'Realty', 'Infra', 'Lands', 'Development'],
    keywords: ['real', 'estate', 'property', 'homes', 'estate'],
  },
  Finance: {
    prefixes: ['Money', 'Fin', 'Profit', 'Cap', 'Secure', 'Wealth', 'Value', 'First', 'Trust', 'Blue'],
    suffixes: ['Capital', 'Financial', 'Advisors', 'Wealth', 'Money', 'Invest', 'Solutions', 'Partners', 'Group', 'Advisory'],
    keywords: ['finance', 'money', 'invest', 'wealth', 'capital'],
  },
  'Health & Fitness': {
    prefixes: ['Fit', 'Vital', 'Active', 'Hydra', 'Healthy', 'Flex', 'Pulse', 'Reign', 'Pure', 'Root'],
    suffixes: ['Fit', 'Care', 'Fitness', 'Zone', 'Hub', 'Life', 'Gym', 'Wellness', 'Strength', 'Clinic'],
    keywords: ['health', 'fitness', 'gym', 'wellness', 'care'],
  },
  Travel: {
    prefixes: ['Sky', 'Wander', 'Go', 'Plaza', 'Bright', 'Holiday', 'Travel', 'Nomad', 'Coast', 'City'],
    suffixes: ['Travels', 'Routes', 'Tours', 'Holidays', 'Go', 'Trips', 'World', 'Wheels', 'Express', 'Lodge'],
    keywords: ['travel', 'tours', 'holiday', 'trip', 'adventure'],
  },
  General: {
    prefixes: ['Apex', 'Summit', 'Global', 'Orbit', 'Beacon', 'Crest', 'Vertex', 'Nova', 'Prime', 'Magnum'],
    suffixes: ['Group', 'Enterprises', 'Co.', 'Works', 'Associates', 'Links', 'Nation', 'Corp', 'Ventures', 'Hub'],
    keywords: ['business', 'enterprise', 'global', 'services'],
  },
};

interface Generated {
  name: string;
  domain: string;
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateNames(industry: string, keyword: string, count: number): Generated[] {
  const d = DATA[industry] ?? DATA.General;
  const word = keyword.trim();
  const names: Generated[] = [];
  for (let i = 0; i < count; i++) {
    if (word && (i === 0 || Math.random() < 0.2)) {
      const w = word;
      const suffix = pick(d.suffixes);
      const name = `${w[0].toUpperCase()}${w.slice(1)} ${suffix}`;
      names.push({ name, domain: `${w.toLowerCase().replace(/[^a-z0-9]/g, '')}.com` });
      continue;
    }
    const style = Math.random();
    let name: string;
    if (style < 0.4) {
      name = `${pick(d.prefixes)}${pick(d.suffixes)}`;
    } else {
      name = `${pick(d.prefixes)} ${pick(d.suffixes)}`;
    }
    names.push({ name, domain: name.toLowerCase().replace(/[^a-z0-9]/g, '') });
  }
  return names;
}

export function BusinessNameGeneratorTool() {
  const [industry, setIndustry] = useState('Technology');
  const [keyword, setKeyword] = useState('');
  const [names, setNames] = useState<Generated[]>(() => generateNames('Technology', '', 6));
  const [copied, setCopied] = useState<string>('');

  const copyName = async (n: Generated) => {
    try {
      await navigator.clipboard.writeText(n.name);
      setCopied(n.name);
      setTimeout(() => setCopied(''), 1200);
    } catch {
      setCopied('');
    }
  };

  return (
    <div className="card">
      <div className="space-y-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="label">Industry</label>
            <select
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="input mt-1"
            >
              {Object.keys(DATA).map((k) => (
                <option key={k} value={k}>
                  {k}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Keyword (optional)</label>
            <input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="input mt-1"
              placeholder="e.g. your name or niche"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setNames(generateNames(industry, keyword, 6))}
            className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-brand-700"
          >
            <Sparkles className="h-4 w-4" />
            Generate Names
          </button>
          <button
            onClick={() => setNames(generateNames(industry, keyword, 6))}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            <RefreshCw className="h-4 w-4" />
            More
          </button>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {names.map((n, i) => (
            <div
              key={`${n.name}-${i}`}
              className="flex items-center justify-between gap-3 rounded-lg border border-gray-200 p-3 dark:border-gray-700"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-gray-900 dark:text-gray-100">{n.name}</p>
                <p className="truncate font-mono text-xs text-gray-500 dark:text-gray-400">{n.domain}.com</p>
              </div>
              <button
                onClick={() => copyName(n)}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                title="Copy name"
              >
                {copied === n.name ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
                {copied === n.name ? 'Copied' : 'Copy'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}