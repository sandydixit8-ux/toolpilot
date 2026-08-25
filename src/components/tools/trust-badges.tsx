'use client';

import { Shield, Lock, Trash2, Zap } from 'lucide-react';

const badges = [
  {
    icon: Shield,
    label: '100% Secure',
    description: 'All processing happens in your browser',
    color: 'text-green-600 dark:text-green-400',
    bg: 'bg-green-50 dark:bg-green-950/20',
  },
  {
    icon: Lock,
    label: 'SSL Encrypted',
    description: 'Your connection is encrypted',
    color: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-50 dark:bg-blue-950/20',
  },
  {
    icon: Trash2,
    label: 'No Files Stored',
    description: 'Files are deleted after processing',
    color: 'text-orange-600 dark:text-orange-400',
    bg: 'bg-orange-50 dark:bg-orange-950/20',
  },
  {
    icon: Zap,
    label: 'Lightning Fast',
    description: 'Process files in seconds',
    color: 'text-yellow-600 dark:text-yellow-400',
    bg: 'bg-yellow-50 dark:bg-yellow-950/20',
  },
];

export function TrustBadges() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {badges.map((badge) => (
        <div
          key={badge.label}
          className={`flex flex-col items-center gap-2 rounded-xl ${badge.bg} px-3 py-4 text-center`}
        >
          <badge.icon className={`h-6 w-6 ${badge.color}`} />
          <div>
            <p className="text-xs font-semibold text-gray-900 dark:text-white">{badge.label}</p>
            <p className="text-[10px] text-gray-500 dark:text-gray-400">{badge.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
