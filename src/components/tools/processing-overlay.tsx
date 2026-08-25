'use client';

import { Loader2, CheckCircle, AlertCircle, Download } from 'lucide-react';

interface ProcessingOverlayProps {
  status: 'idle' | 'processing' | 'complete' | 'error';
  progress?: string;
  percentage?: number;
  onDownload?: () => void;
  error?: string;
}

export function ProcessingOverlay({
  status,
  progress = 'Processing...',
  percentage,
  onDownload,
  error,
}: ProcessingOverlayProps) {
  if (status === 'idle') return null;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
      <div className="flex flex-col items-center gap-4 text-center">
        {status === 'processing' && (
          <>
            <div className="relative">
              <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />
              {percentage !== undefined && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                    {Math.round(percentage)}%
                  </span>
                </div>
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{progress}</p>
              {percentage !== undefined && (
                <div className="mt-2 h-2 w-48 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                  <div
                    className="h-full rounded-full bg-blue-500 transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              )}
            </div>
          </>
        )}

        {status === 'complete' && (
          <>
            <div className="rounded-full bg-green-100 p-3 dark:bg-green-900/30">
              <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-green-700 dark:text-green-400">
                Processing Complete!
              </p>
            </div>
            {onDownload && (
              <button
                onClick={onDownload}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
              >
                <Download className="h-4 w-4" />
                Download
              </button>
            )}
          </>
        )}

        {status === 'error' && (
          <>
            <div className="rounded-full bg-red-100 p-3 dark:bg-red-900/30">
              <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-red-700 dark:text-red-400">
                {error || 'Something went wrong'}
              </p>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Please try again or use a different file
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
