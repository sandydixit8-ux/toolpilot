'use client';

import { useState, useCallback } from "react";
import { UploadBox } from "@/components/tools/upload-box";
import { ProcessingOverlay } from "@/components/tools/processing-overlay";
import { Music, RefreshCw, CheckCircle } from "lucide-react";
import { formatBytes } from "@/lib/utils";
import { transcode, getFfmpeg, downloadBlob, sanitizeFileName } from "@/lib/ffmpeg-client";

type Phase = "idle" | "loading" | "processing" | "complete" | "error";

const QUALITIES = [
  { id: "128", label: "128 kbps (small)", bitrate: "128k" },
  { id: "192", label: "192 kbps (good)", bitrate: "192k" },
  { id: "320", label: "320 kbps (best)", bitrate: "320k" },
];

export interface AudioToMp3ToolProps {
  /** Human-readable source format, e.g. "M4A" or "WAV". */
  sourceLabel: string;
  /** Accepted input formats for the upload box. */
  accept: Record<string, string[]>;
  /** Error message shown when conversion fails. */
  errorMessage?: string;
}

/**
 * Shared audio -> MP3 converter. Mirrors the MP4 to MP3 tool but lets each
 * wrappable tool (M4A to MP3, WAV to MP3) declare its own accepted input.
 */
export function AudioToMp3Tool({ sourceLabel, accept, errorMessage = "Failed to convert audio" }: AudioToMp3ToolProps) {
  const [file, setFile] = useState<File | null>(null);
  const [qualityId, setQualityId] = useState("192");
  const [phase, setPhase] = useState<Phase>("idle");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [result, setResult] = useState<{ blob: Blob; url: string; fileName: string } | null>(null);

  const handleFiles = useCallback((files: File[]) => {
    setFile(files[0] ?? null);
    setResult(null);
    setPhase("idle");
    setError("");
  }, []);

  const handleRemove = useCallback(() => {
    setFile(null);
    setResult(null);
    setPhase("idle");
    setError("");
  }, []);

  const handleConvert = async () => {
    if (!file) return;
    setResult(null);
    setError("");
    setPhase("loading");
    setProgress(0);
    try {
      await getFfmpeg();
      setPhase("processing");
      const inputName = sanitizeFileName(file.name);
      const base = file.name.replace(/\.[^.]+$/, "") || "audio";
      const outputName = `${base}.mp3`;
      const quality = QUALITIES.find((q) => q.id === qualityId) ?? QUALITIES[1];
      const blob = await transcode(
        ["-i", inputName, "-vn", "-c:a", "libmp3lame", "-b:a", quality.bitrate, "-map_metadata", "0", outputName],
        { fileName: inputName, data: file },
        outputName,
        setProgress
      );
      setResult({ blob, url: URL.createObjectURL(blob), fileName: outputName });
      setPhase("complete");
    } catch (err) {
      setError(err instanceof Error ? err.message : errorMessage);
      setPhase("error");
    }
  };

  const handleReset = useCallback(() => {
    handleRemove();
    setQualityId("192");
  }, [handleRemove]);

  return (
    <div className="card space-y-6">
      <UploadBox
        onFiles={handleFiles}
        onRemove={file ? undefined : undefined}
        files={file ? [file] : []}
        accept={accept}
        multiple={false}
        maxSize={200 * 1024 * 1024}
        showSizeInfo
      />

      {file && (
        <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-800 dark:bg-gray-800/50">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-gray-900 dark:text-white">{file.name}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{formatBytes(file.size)}</p>
          </div>
          <button
            onClick={handleRemove}
            className="rounded p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
            aria-label="Remove file"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      )}

      {file && (
        <div className="space-y-4">
          <div>
            <label className="label">Audio quality</label>
            <div className="mt-2 space-y-2">
              {QUALITIES.map((q) => (
                <label
                  key={q.id}
                  className={`flex cursor-pointer items-center justify-between rounded-lg border px-4 py-2.5 text-sm transition-colors ${
                    qualityId === q.id
                      ? "border-brand-500 bg-brand-50 dark:border-brand-500 dark:bg-brand-950/30"
                      : "border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600"
                  }`}
                >
                  <span className="font-medium text-gray-900 dark:text-white">{q.label}</span>
                  <input
                    type="radio"
                    name="quality"
                    value={q.id}
                    checked={qualityId === q.id}
                    onChange={() => setQualityId(q.id)}
                    className="accent-brand-500"
                  />
                </label>
              ))}
            </div>
          </div>

          <button onClick={handleConvert} disabled={phase === "loading" || phase === "processing"} className="btn-primary flex items-center gap-2">
            <Music className="h-4 w-4" />
            {phase === "loading" || phase === "processing" ? "Converting..." : `Convert ${sourceLabel} to MP3`}
          </button>
        </div>
      )}

      {(phase === "processing" || phase === "loading") && (
        <ProcessingOverlay
          status="processing"
          progress={phase === "loading" ? "Loading audio engine (first run only)... " : "Converting to MP3... "}
          percentage={phase === "loading" ? undefined : progress}
        />
      )}

      {phase === "complete" && result && (
        <>
          <div className="flex items-center gap-2 rounded-lg bg-green-50 p-3 text-sm text-green-700 dark:bg-green-950/50 dark:text-green-300">
            <CheckCircle className="h-4 w-4" />
            MP3 ready — {result.fileName}
          </div>
          <ProcessingOverlay status="complete" onDownload={() => downloadBlob(result.blob, result.fileName)} />
        </>
      )}

      {phase === "error" && <ProcessingOverlay status="error" error={error} />}

      {file && (
        <button
          onClick={handleReset}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
        >
          <RefreshCw className="h-4 w-4" />
          Start over
        </button>
      )}
    </div>
  );
}
