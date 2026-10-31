'use client';

import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";

const CORE_VERSION = "0.12.10";
const CORE_BASE = `https://unpkg.com/@ffmpeg/core@${CORE_VERSION}/dist/umd`;
// The core is ~31 MB, so the first load legitimately takes a while; it should
// never take this long, and when it does the promise can stay pending forever
// and leave the user staring at "Loading FFmpeg engine".
const LOAD_TIMEOUT_MS = 60_000;
const LOAD_ATTEMPTS = 2;
const LOAD_FAILED =
  "The video engine could not start. Check your connection and try again.";

let ffmpegInstance: FFmpeg | null = null;
let pendingLoad: Promise<FFmpeg> | null = null;

export type ProgressCallback = (percent: number) => void;

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(LOAD_FAILED)), ms);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error) => {
        clearTimeout(timer);
        reject(error);
      }
    );
  });
}

async function loadOnce(): Promise<FFmpeg> {
  const ffmpeg = new FFmpeg();
  // Both the CDN downloads and the wasm start-up are inside the timeout: a
  // stalled download is just as capable of hanging the tool as a stalled load.
  await withTimeout(
    (async () => {
      const coreURL = await toBlobURL(`${CORE_BASE}/ffmpeg-core.js`, "text/javascript");
      const wasmURL = await toBlobURL(`${CORE_BASE}/ffmpeg-core.wasm`, "application/wasm");
      await ffmpeg.load({ coreURL, wasmURL });
    })(),
    LOAD_TIMEOUT_MS
  );
  return ffmpeg;
}

async function loadFfmpeg(): Promise<FFmpeg> {
  let lastError: unknown = null;
  for (let attempt = 1; attempt <= LOAD_ATTEMPTS; attempt++) {
    try {
      return await loadOnce();
    } catch (error) {
      lastError = error;
      // A half-initialised instance cannot be reused, so the next attempt
      // starts from a clean FFmpeg object.
    }
  }
  throw new Error(
    lastError instanceof Error && lastError.message ? lastError.message : LOAD_FAILED
  );
}

export async function getFfmpeg(): Promise<FFmpeg> {
  if (ffmpegInstance) return ffmpegInstance;
  if (!pendingLoad) {
    pendingLoad = loadFfmpeg().then(
      (ffmpeg) => {
        ffmpegInstance = ffmpeg;
        return ffmpeg;
      },
      (error) => {
        pendingLoad = null;
        throw error;
      }
    );
  }
  return pendingLoad;
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