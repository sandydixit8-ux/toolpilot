'use client';

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, File } from 'lucide-react';
import { formatBytes } from '@/lib/utils';

interface UploadBoxProps {
  onFiles: (files: File[]) => void;
  accept?: Record<string, string[]>;
  multiple?: boolean;
  maxSize?: number;
  files?: File[];
  onRemove?: (index: number) => void;
}

export function UploadBox({
  onFiles,
  accept,
  multiple = true,
  maxSize = 50 * 1024 * 1024,
  files = [],
  onRemove,
}: UploadBoxProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      onFiles(acceptedFiles);
    },
    [onFiles]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    multiple,
    maxSize,
  });

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-8 text-center transition-colors dark:border-gray-700 dark:bg-gray-800/50 ${isDragActive ? 'border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-950/30' : 'hover:border-gray-400 dark:hover:border-gray-600'}`}
      >
        <input {...getInputProps()} />
        <Upload className="h-10 w-10 text-gray-400 dark:text-gray-500" />
        <p className="mt-3 text-sm font-medium text-gray-700 dark:text-gray-300">
          {isDragActive ? 'Drop your files here' : 'Drag & drop your files here'}
        </p>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          or click to browse
        </p>
        <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">
          Max size: {formatBytes(maxSize)}
        </p>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file, index) => (
            <div
              key={`${file.name}-${index}`}
              className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-800 dark:bg-gray-800/50"
            >
              <File className="h-5 w-5 shrink-0 text-gray-400" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-gray-900 dark:text-white">{file.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{formatBytes(file.size)}</p>
              </div>
              {onRemove && (
                <button
                  onClick={() => onRemove(index)}
                  className="rounded p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
