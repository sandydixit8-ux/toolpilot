/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, File, CloudUpload, HardDrive, Loader2 } from 'lucide-react';
import { formatBytes } from '@/lib/utils';

interface UploadBoxProps {
  onFiles: (files: File[]) => void;
  accept?: Record<string, string[]>;
  multiple?: boolean;
  maxSize?: number;
  files?: File[];
  onRemove?: (index: number) => void;
  showSizeInfo?: boolean;
  cloudUpload?: boolean;
}

export function UploadBox({
  onFiles,
  accept,
  multiple = true,
  maxSize = 50 * 1024 * 1024,
  files = [],
  onRemove,
  showSizeInfo = true,
  cloudUpload = false,
}: UploadBoxProps) {
  const [uploadProgress, setUploadProgress] = useState<Record<number, number>>({});
  const [cloudLoading, setCloudLoading] = useState<'google' | 'dropbox' | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      acceptedFiles.forEach((file) => {
        let progress = 0;
        const interval = setInterval(() => {
          progress += Math.random() * 30 + 10;
          if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
          }
          setUploadProgress((prev) => ({ ...prev, [file.name]: progress }));
        }, 100);
      });
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

  const totalSize = files.reduce((sum, f) => sum + f.size, 0);

  // Google Drive Picker
  const openGoogleDrive = useCallback(() => {
    setCloudLoading('google');
    const script = document.createElement('script');
    script.src = 'https://apis.google.com/js/api.js';
    script.onload = () => {
      const w = window as any;
      w.gapi.load('picker', () => {
        const picker = new w.google.picker.PickerBuilder()
          .addView(new w.google.picker.DocsView())
          .setCallback((data: any) => {
            if (data.docs && data.docs.length > 0) {
              data.docs.forEach((doc: any) => {
                fetch(doc.url)
                  .then((res) => res.blob())
                  .then((blob) => {
                    const fileName: string = doc.name || 'file';
                    const opts = { type: blob.type || 'application/octet-stream' };
                    const fileObj = new (File as any)([blob], fileName, opts);
                    onFiles([fileObj]);
                  });
              });
            }
            setCloudLoading(null);
          })
          .build();
        picker.setVisible(true);
      });
    };
    document.body.appendChild(script);
  }, [onFiles]);

  // Dropbox Chooser
  const openDropbox = useCallback(() => {
    setCloudLoading('dropbox');
    const script = document.createElement('script');
    script.src = 'https://www.dropbox.com/static/api/2/dropins.js';
    script.id = 'dropboxjs';
    script.setAttribute('data-app-key', 'your-dropbox-app-key');
    script.onload = () => {
      const w = window as any;
      if (w.Dropbox) {
        w.Dropbox.choose({
          success: (files: any[]) => {
            files.forEach((file: any) => {
              fetch(file.link)
                .then((res) => res.blob())
                .then((blob) => {
                  const fileName: string = file.name || 'file';
                  const opts = { type: blob.type || 'application/octet-stream' };
                  const fileObj = new (File as any)([blob], fileName, opts);
                  onFiles([fileObj]);
                });
            });
            setCloudLoading(null);
          },
          cancel: () => setCloudLoading(null),
          linkType: 'direct',
          multiselect: true,
        });
      }
    };
    document.body.appendChild(script);
  }, [onFiles]);

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 text-center transition-all ${
          isDragActive
            ? 'border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-950/30 scale-[1.02]'
            : 'border-gray-300 bg-gray-50 hover:border-gray-400 dark:border-gray-700 dark:bg-gray-800/50 dark:hover:border-gray-600'
        }`}
      >
        <input {...getInputProps()} />
        <div className={`rounded-full p-3 ${isDragActive ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-gray-100 dark:bg-gray-800'}`}>
          <Upload className={`h-8 w-8 ${isDragActive ? 'text-blue-500' : 'text-gray-400 dark:text-gray-500'}`} />
        </div>
        <p className="mt-3 text-sm font-medium text-gray-700 dark:text-gray-300">
          {isDragActive ? 'Drop your files here' : 'Drag & drop your files here'}
        </p>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          or click to browse
        </p>

        {showSizeInfo && (
          <div className="mt-3 flex items-center gap-4 text-xs text-gray-400 dark:text-gray-500">
            <span className="flex items-center gap-1">
              <HardDrive className="h-3 w-3" />
              Max: {formatBytes(maxSize)}
            </span>
            {files.length > 0 && (
              <span className="text-green-600 dark:text-green-400">
                {files.length} file{files.length > 1 ? 's' : ''} ({formatBytes(totalSize)})
              </span>
            )}
          </div>
        )}

        {isDragActive && (
          <div className="absolute inset-0 rounded-xl bg-blue-500/5 dark:bg-blue-400/5" />
        )}
      </div>

      {cloudUpload && (
        <div className="flex gap-3">
          <button
            onClick={openGoogleDrive}
            disabled={cloudLoading !== null}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            {cloudLoading === 'google' ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <CloudUpload className="h-4 w-4" />
            )}
            Google Drive
          </button>
          <button
            onClick={openDropbox}
            disabled={cloudLoading !== null}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            {cloudLoading === 'dropbox' ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <CloudUpload className="h-4 w-4" />
            )}
            Dropbox
          </button>
        </div>
      )}

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file, index) => {
            const progress = uploadProgress[index] ?? 100;
            return (
              <div
                key={`${file.name}-${index}`}
                className="relative overflow-hidden rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-800 dark:bg-gray-800/50"
              >
                {progress < 100 && (
                  <div
                    className="absolute inset-y-0 left-0 bg-blue-100 transition-all duration-300 dark:bg-blue-900/30"
                    style={{ width: `${progress}%` }}
                  />
                )}
                <div className="relative flex items-center gap-3">
                  <File className="h-5 w-5 shrink-0 text-gray-400" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                      {file.name}
                    </p>
                    <div className="flex items-center gap-2">
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {formatBytes(file.size)}
                      </p>
                      {progress < 100 && (
                        <p className="text-xs text-blue-500">{Math.round(progress)}%</p>
                      )}
                    </div>
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
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
