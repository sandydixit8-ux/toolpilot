'use client';

import { useState, useCallback } from "react";
import { UploadBox } from "@/components/tools/upload-box";
import { ProcessingOverlay } from "@/components/tools/processing-overlay";
import { Sparkles, RefreshCw, CheckCircle } from "lucide-react";
import { formatBytes } from "@/lib/utils";
import { transcode, getFfmpeg, downloadBlob, sanitizeFileName } from "@/lib/ffmpeg-client";

type Phase = "idle" | "loading" | "processing" | "complete" | "error";

const PRESETS = [
  { id: "balanced", label: "Balanced (recommended)", crf: 28 },
  { id: "small", label: "Smaller file", crf: 33 },
  { id: "quality", label: "Higher quality", crf: 23 },
];

const RESOLUTIONS = [
  { id: "source", label: "Same as source", vf: "" },
  { id: "720p", label: "720p (1280 wide)", vf: "scale=1280:-2" },
  { id: "480p", label: "480p (854 wide)", vf: "scale=854:-2" },
];

interface Result {
  blob: Blob;
  url: string;
  originalSize: number;
  outputSize: number;
  fileName: string;
}

export function VideoCompressorTool() {
  const [file, setFile] = useState<File | null>(null);
  const [presetId, setPresetId] = useState("balanced");
  const [resolutionId, setResolutionId] = useState("source");
  const [phase, setPhase] = useState<Phase>("idle");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [result, setResult] = useState<Result | null>(null);

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

  const handleCompress = async () => {
    if (!file) return;
    setResult(null);
    setError("");
    setPhase("loading");
    setProgress(0);
    try {
      await getFfmpeg();
      setPhase("processing");
      const inputName = sanitizeFileName(file.name);
      const base = file.name.replace(/\.[^.]+$/, "") || "video";
      const outputName = `compressed-${base}.mp4`;
      const preset = PRESETS.find((p) => p.id === presetId) ?? PRESETS[0];
      const resolution = RESOLUTIONS.find((r) => r.id === resolutionId) ?? RESOLUTIONS[0];
      const args = [
        "-i", inputName,
        "-c:v", "libx264",
        "-preset", "veryfast",
        "-crf", String(preset.crf),
        "-c:a", "aac",
        "-b:a", "96k",
      ];
      if (resolution.vf) args.push("-vf", resolution.vf);
      args.push("-movflags", "+faststart", outputName);
      const blob = await transcode(args, { fileName: inputName, data: file }, outputName, setProgress);
      setResult({
        blob,
        url: URL.createObjectURL(blob),
        originalSize: file.size,
        outputSize: blob.size,
        fileName: outputName,
      });
      setPhase("complete");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to compress video");
      setPhase("error");
    }
  };

  const handleReset = useCallback(() => {
    handleRemove();
    setPresetId("balanced");
    setResolutionId("source");
  }, [handleRemove]);

  const savings =
    result && result.originalSize > 0
      ? ((1 - result.outputSize / result.originalSize) * 100).toFixed(1)
      : "0";

  return (
    <div className="card space-y-6">
      <UploadBox
        onFiles={handleFiles}
        onRemove={file ? undefined : undefined}
        files={file ? [file] : []}
        accept={{ "video/*": [".mp4", ".mov", ".webm", ".avi", ".mkv", ".m4v"] }}
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
            <label className="label">Compression level</label>
            <div className="mt-2 space-y-2">
              {PRESETS.map((p) => (
                <label
                  key={p.id}
                  className={`flex cursor-pointer items-center justify-between rounded-lg border px-4 py-2.5 text-sm transition-colors ${
                    presetId === p.id
                      ? "border-brand-500 bg-brand-50 dark:border-brand-500 dark:bg-brand-950/30"
                      : "border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600"
                  }`}
                >
                  <span className="font-medium text-gray-900 dark:text-white">{p.label}</span>
                  <input
                    type="radio"
                    name="preset"
                    value={p.id}
                    checked={presetId === p.id}
                    onChange={() => setPresetId(p.id)}
                    className="accent-brand-500"
                  />
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="label">Output resolution</label>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {RESOLUTIONS.map((r) => (
                <button
                  key={r.id}
                  onClick={() => setResolutionId(r.id)}
                  className={`rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors ${
                    resolutionId === r.id
                      ? "border-brand-500 bg-brand-50 text-brand-700 dark:border-brand-500 dark:bg-brand-950/30 dark:text-brand-300"
                      : "border-gray-200 text-gray-600 hover:border-gray-300 dark:border-gray-700 dark:text-gray-400 dark:hover:border-gray-600"
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          <button onClick={handleCompress} disabled={phase === "loading" || phase === "processing"} className="btn-primary flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            {phase === "loading" || phase === "processing" ? "Compressing..." : "Compress Video"}
          </button>
        </div>
      )}

      {(phase === "processing" || phase === "loading") && (
        <ProcessingOverlay
          status="processing"
          progress={phase === "loading" ? "Loading FFmpeg engine (first run only)... " : "Compressing video... "}
          percentage={phase === "loading" ? undefined : progress}
        />
      )}

      {phase === "complete" && result && (
        <>
          <div className="flex items-center gap-2 rounded-lg bg-green-50 p-3 text-sm text-green-700 dark:bg-green-950/50 dark:text-green-300">
            <CheckCircle className="h-4 w-4" />
            Compressed from {formatBytes(result.originalSize)} to {formatBytes(result.outputSize)} — saved {savings}%
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