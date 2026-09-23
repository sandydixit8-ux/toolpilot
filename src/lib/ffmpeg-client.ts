'use client';

import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";

const CORE_VERSION = "0.12.10";
const CORE_BASE = `https://unpkg.com/@ffmpeg/core@${CORE_VERSION}/dist/umd`;

let ffmpegInstance: FFmpeg | null = null;

export type ProgressCallback = (percent: number) => void;

export async function getFfmpeg(): Promise<FFmpeg> {
  if (ffmpegInstance) return ffmpegInstance;
  const ffmpeg = new FFmpeg();
  await ffmpeg.load({
    coreURL: await toBlobURL(`${CORE_BASE}/ffmpeg-core.js`, "text/javascript"),
    wasmURL: await toBlobURL(`${CORE_BASE}/ffmpeg-core.wasm`, "application/wasm"),
  });
  ffmpegInstance = ffmpeg;
  return ffmpeg;
}

export async function transcode(
  args: string[],
  input: { fileName: string; data: File | Blob },
  outputName: string,
  onProgress?: ProgressCallback
): Promise<Blob> {
  const ffmpeg = await getFfmpeg();

  const progressHandler = onProgress
    ? (data: { progress: number }) => onProgress(Math.round(data.progress * 100))
    : undefined;
  if (progressHandler) ffmpeg.on("progress", progressHandler);

  try {
    await ffmpeg.deleteFile(input.fileName).catch(() => {});
    await ffmpeg.writeFile(input.fileName, await fetchFile(input.data));
    await ffmpeg.exec(args);
    const data = (await ffmpeg.readFile(outputName)) as Uint8Array;
    return new Blob([data.buffer as ArrayBuffer], { type: "application/octet-stream" });
  } finally {
    await ffmpeg.deleteFile(input.fileName).catch(() => {});
    await ffmpeg.deleteFile(outputName).catch(() => {});
    if (progressHandler) ffmpeg.off("progress", progressHandler);
  }
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

export function sanitizeFileName(name: string): string {
  return name.replace(/[^\w.-]+/g, "_");
}