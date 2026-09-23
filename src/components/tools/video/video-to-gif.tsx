'use client';

import { useState, useCallback } from "react";
import { UploadBox } from "@/components/tools/upload-box";
import { ProcessingOverlay } from "@/components/tools/processing-overlay";
import { Film, RefreshCw, CheckCircle } from "lucide-react";
import { formatBytes } from "@/lib/utils";
import { transcode, getFfmpeg, downloadBlob, sanitizeFileName } from "@/lib/ffmpeg-client";

type Phase = "idle" | "loading" | "processing" | "complete" | "error";

const FPS_OPTIONS = [
  { id: "10", label: "10 fps (small)" },
  { id: "15", label: "15 fps (smooth)" },
  { id: "24", label: "24 fps (original)" },
];

const WIDTH_OPTIONS = [
  { id: "source", label: "Same width" },
  { id: "480", label: "480 px" },
  { id: "360", label: "360 px" },
];

const DURATION_OPTIONS = [
  { id: "full", label: "Full video" },
  { id: "5", label: "First 5 seconds" },
  { id: "10", label: "First 10 seconds" },
];

export function VideoToGifTool() {
  const [file, setFile] = useState<File | null>(null);
  const [fpsId, setFpsId] = useState("10");
  const [widthId, setWidthId] = useState("source");
  const [durationId, setDurationId] = useState("full");
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
      const base = file.name.replace(/\.[^.]+$/, "") || "video";
      const outputName = `${base}.gif`;
      const fps = FPS_OPTIONS.find((f) => f.id === fpsId) ?? FPS_OPTIONS[0];
      const width = WIDTH_OPTIONS.find((w) => w.id === widthId) ?? WIDTH_OPTIONS[0];
      const duration = DURATION_OPTIONS.find((d) => d.id === durationId) ?? DURATION_OPTIONS[0];

      const filterParts = [`fps=${fps.id}`];
      if (width.id !== "source") filterParts.push(`scale=${width.id}:-1:flags=lanczos`);
      const args: string[] = ["-i", inputName];
      if (duration.id !== "full") args.push("-t", duration.id);
      args.push("-vf", filterParts.join(","), "-loop", "0", outputName);

      const blob = await transcode(args, { fileName: inputName, data: file }, outputName, setProgress);
      setResult({ blob, url: URL.createObjectURL(blob), fileName: outputName });
      setPhase("complete");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create GIF");
      setPhase("error");
    }
  };

  const handleReset = useCallback(() => {
    handleRemove();
    setFpsId("10");
    setWidthId("source");
    setDurationId("full");
  }, [handleRemove]);

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
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Frame rate</label>
              <div className="mt-2 space-y-2">
                {FPS_OPTIONS.map((f) => (
                  <label
                    key={f.id}
                    className={`flex cursor-pointer items-center justify-between rounded-lg border px-4 py-2 text-sm transition-colors ${
                      fpsId === f.id
                        ? "border-brand-500 bg-brand-50 dark:border-brand-500 dark:bg-brand-950/30"
                        : "border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600"
                    }`}
                  >
                    <span className="font-medium text-gray-900 dark:text-white">{f.label}</span>
                    <input type="radio" name="fps" value={f.id} checked={fpsId === f.id} onChange={() => setFpsId(f.id)} className="accent-brand-500" />
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="label">Width</label>
              <div className="mt-2 space-y-2">
                {WIDTH_OPTIONS.map((w) => (
                  <label
                    key={w.id}
                    className={`flex cursor-pointer items-center justify-between rounded-lg border px-4 py-2 text-sm transition-colors ${
                      widthId === w.id
                        ? "border-brand-500 bg-brand-50 dark:border-brand-500 dark:bg-brand-950/30"
                        : "border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600"
                    }`}
                  >
                    <span className="font-medium text-gray-900 dark:text-white">{w.label}</span>
                    <input type="radio" name="width" value={w.id} checked={widthId === w.id} onChange={() => setWidthId(w.id)} className="accent-brand-500" />
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="label">Clip length</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {DURATION_OPTIONS.map((d) => (
                <button
                  key={d.id}
                  onClick={() => setDurationId(d.id)}
                  className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                    durationId === d.id
                      ? "border-brand-500 bg-brand-50 text-brand-700 dark:border-brand-500 dark:bg-brand-950/30 dark:text-brand-300"
                      : "border-gray-200 text-gray-600 hover:border-gray-300 dark:border-gray-700 dark:text-gray-400 dark:hover:border-gray-600"
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          <button onClick={handleConvert} disabled={phase === "loading" || phase === "processing"} className="btn-primary flex items-center gap-2">
            <Film className="h-4 w-4" />
            {phase === "loading" || phase === "processing" ? "Creating..." : "Create GIF"}
          </button>
        </div>
      )}

      {(phase === "processing" || phase === "loading") && (
        <ProcessingOverlay
          status="processing"
          progress={phase === "loading" ? "Loading FFmpeg engine (first run only)... " : "Creating GIF... "}
          percentage={phase === "loading" ? undefined : progress}
        />
      )}

      {phase === "complete" && result && (
        <>
          <div className="flex items-center gap-2 rounded-lg bg-green-50 p-3 text-sm text-green-700 dark:bg-green-950/50 dark:text-green-300">
            <CheckCircle className="h-4 w-4" />
            GIF ready — {result.fileName}
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