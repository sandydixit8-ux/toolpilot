'use client';

import { useState } from 'react';
import { Copy, Check, RefreshCw } from 'lucide-react';

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const m = hex.replace('#', '');
  if (!/^[0-9a-fA-F]{6}$/.test(m)) return null;
  const n = parseInt(m, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('');
}

function rgbToHsl(r: number, g: number, b: number): string {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rn:
        h = (gn - bn) / d + (gn < bn ? 6 : 0);
        break;
      case gn:
        h = (bn - rn) / d + 2;
        break;
      default:
        h = (rn - gn) / d + 4;
    }
    h /= 6;
  }
  return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
}

function randomHex(): string {
  const chars = '0123456789abcdef';
  let out = '#';
  for (let i = 0; i < 6; i++) out += chars[Math.floor(Math.random() * 16)];
  return out;
}

export function ColorPickerTool() {
  const [color, setColor] = useState('#2563eb');
  const [copied, setCopied] = useState('');

  const rgb = hexToRgb(color);
  const hsl = rgb ? rgbToHsl(rgb.r, rgb.g, rgb.b) : '';

  const shades = (() => {
    if (!rgb) return [];
    const steps = [-0.5, -0.3, -0.15, 0, 0.15, 0.3, 0.5];
    return steps.map((f) => {
      const t = f >= 0 ? 255 : 0;
      const r = Math.round(rgb.r + (t - rgb.r) * f);
      const g = Math.round(rgb.g + (t - rgb.g) * f);
      const b = Math.round(rgb.b + (t - rgb.b) * f);
      return { hex: rgbToHex(r, g, b), label: f === 0 ? 'Base' : f > 0 ? `+${Math.round(f * 100)}%` : `${Math.round(f * 100)}%` };
    });
  })();

  const copyValue = async (label: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(label);
      setTimeout(() => setCopied(''), 1200);
    } catch {
      setCopied('');
    }
  };

  const formats = [
    { label: 'HEX', value: color },
    { label: 'RGB', value: rgb ? `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` : '' },
    { label: 'HSL', value: hsl },
  ];

  return (
    <div className="card">
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex items-center gap-4">
            <div
              className="h-24 w-24 shrink-0 rounded-xl border border-gray-200 shadow-inner dark:border-gray-700"
              style={{ backgroundColor: color }}
            />
            <div className="space-y-3">
              <div>
                <label className="label">Pick a color</label>
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="mt-1 h-10 w-full cursor-pointer rounded-lg border border-gray-300 bg-white dark:border-gray-700"
                />
              </div>
              <button
                onClick={() => setColor(randomHex())}
                className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Random
              </button>
            </div>
          </div>
          <div className="space-y-2">
            {formats.map((f) => (
              <button
                key={f.label}
                onClick={() => f.value && copyValue(f.label, f.value)}
                className="flex w-full items-center justify-between rounded-lg border border-gray-200 px-3 py-2 text-left hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
                title={`Copy ${f.label}`}
              >
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{f.label}</span>
                <span className="font-mono text-sm text-gray-800 dark:text-gray-200">{f.value || '—'}</span>
                {copied === f.label ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4 text-gray-400" />}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="label mb-2">Shades & Tints</p>
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
            {shades.map((s) => (
              <button
                key={s.hex}
                onClick={() => copyValue(s.hex, s.hex)}
                className="group overflow-hidden rounded-lg border border-gray-200 text-left dark:border-gray-700"
                title={`${s.hex} (${s.label})`}
              >
                <div className="h-12 w-full" style={{ backgroundColor: s.hex }} />
                <div className="px-1 py-0.5">
                  <p className="truncate font-mono text-[9px] text-gray-600 dark:text-gray-300">{s.hex}</p>
                  <p className="text-[9px] text-gray-400">{s.label}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}