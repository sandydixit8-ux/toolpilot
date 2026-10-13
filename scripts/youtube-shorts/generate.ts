import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import { copyFile, mkdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { EdgeTTS } from "node-edge-tts";
import type { ShortPlan } from "./content";

const require = createRequire(import.meta.url);
const FFMPEG = (process.env.SHORTS_FFMPEG || require("ffmpeg-static")) as string;
const FFPROBE = (require("ffprobe-static") as { path: string }).path;

const W = 1080;
const H = 1920;
const VOICE = process.env.SHORTS_VOICE || "en-US-AriaNeural";

const DEFAULT_FONTS = [
  process.env.SHORTS_FONT,
  "C:/Windows/Fonts/arialbd.ttf",
  "C:/Windows/Fonts/segoeuib.ttf",
  "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
  "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf",
].filter(Boolean) as string[];

export const WORK_DIR = path.resolve(process.env.SHORTS_WORK_DIR || "out/youtube-shorts");

function resolveFont(): string {
  for (const f of DEFAULT_FONTS) {
    if (existsSync(f)) return f;
  }
  throw new Error(
    "No font found. Set SHORTS_FONT to a .ttf/.otf path (e.g. DejaVuSans-Bold.ttf)."
  );
}

function run(cmd: string, args: string[], cwd?: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { cwd, windowsHide: true });
    let out = "";
    let err = "";
    child.stdout.on("data", (d) => (out += d.toString()));
    child.stderr.on("data", (d) => (err += d.toString()));
    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) resolve(out.trim());
      else reject(new Error(`${path.basename(cmd)} exited ${code}\n${err.slice(-1500)}`));
    });
  });
}

function wrap(text: string, max: number): string {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let cur = "";
  for (const w of words) {
    if (cur && (cur + " " + w).length > max) {
      lines.push(cur);
      cur = w;
    } else {
      cur = cur ? `${cur} ${w}` : w;
    }
  }
  if (cur) lines.push(cur);
  return lines.join("\n");
}

async function audioDuration(file: string): Promise<number> {
  const out = await run(FFPROBE, [
    "-v",
    "error",
    "-show_entries",
    "format=duration",
    "-of",
    "default=nw=1:nk=1",
    file,
  ]);
  const d = Number.parseFloat(out);
  if (!Number.isFinite(d) || d <= 0) throw new Error(`could not read audio duration from ${file}`);
  return d;
}

interface SlideTexts {
  header: string;
  title: string;
  steps: string[];
  cta: string;
}

async function writeTexts(dir: string, t: SlideTexts): Promise<void> {
  await Promise.all([
    writeFile(path.join(dir, "header.txt"), `${t.header}\n`),
    writeFile(path.join(dir, "title.txt"), `${wrap(t.title, 18)}\n`),
    ...t.steps.map((s, i) => writeFile(path.join(dir, `step${i + 1}.txt`), `${wrap(s, 26)}\n`)),
    writeFile(path.join(dir, "cta.txt"), `${wrap(t.cta, 22)}\n`),
  ]);
}

function buildFilter(steps: number, duration: number): string {
  const f: string[] = [];
  f.push(
    `drawtext=fontfile=font.ttf:textfile=header.txt:fontcolor=0xB4BCCB:fontsize=42:x=(w-text_w)/2:y=140`
  );
  f.push(
    `drawtext=fontfile=font.ttf:textfile=title.txt:fontcolor=0xFFFFFF:fontsize=78:line_spacing=18:x=(w-text_w)/2:y=430`
  );
  const first = 0.28;
  const span = 0.22;
  const yPos = [830, 1140, 1450];
  for (let i = 0; i < steps; i++) {
    const start = Math.min(duration - 1, duration * (first + i * span));
    f.push(
      `drawtext=fontfile=font.ttf:textfile=step${i + 1}.txt:fontcolor=0xF4F2FF:fontsize=58:line_spacing=16:x=(w-text_w)/2:y=${yPos[i]}:enable='between(t,${start.toFixed(2)},${duration.toFixed(2)})'`
    );
  }
  f.push(
    `drawtext=fontfile=font.ttf:textfile=cta.txt:fontcolor=0x22D3EE:fontsize=52:x=(w-text_w)/2:y=1760`
  );
  return f.join(",");
}

async function synthVoice(narration: string, audioPath: string, durationHint: number): Promise<number> {
  if (process.env.SHORTS_SILENT === "1") {
    await run(FFMPEG, [
      "-y",
      "-f",
      "lavfi",
      "-i",
      `anullsrc=r=24000:cl=mono:d=${durationHint}`,
      "-c:a",
      "libmp3lame",
      "-b:a",
      "96k",
      audioPath,
    ]);
    return durationHint;
  }
  try {
    const tts = new EdgeTTS({
      voice: VOICE,
      lang: "en-US",
      outputFormat: "audio-24khz-96kbitrate-mono-mp3",
      rate: "+8%",
    });
    await tts.ttsPromise(narration, audioPath);
    return await audioDuration(audioPath);
  } catch (e) {
    console.warn(`[shorts] TTS failed (${(e as Error).message}); falling back to silence`);
    return synthVoice(narration, audioPath, durationHint);
  }
}

export interface GeneratedShort {
  video: string;
  audio: string;
  duration: number;
}

export async function generateShort(plan: ShortPlan, durationHint = 30): Promise<GeneratedShort> {
  const dir = WORK_DIR;
  await mkdir(dir, { recursive: true });

  const font = resolveFont();
  await copyFile(font, path.join(dir, "font.ttf"));

  await writeTexts(dir, plan.slides);

  const audioPath = path.join(dir, "voice.mp3");
  const duration = await synthVoice(plan.narration, audioPath, durationHint);

  const videoPath = path.join(dir, "short.mp4");
  const filter = buildFilter(plan.slides.steps.length, duration);

  await run(
    FFMPEG,
    [
      "-y",
      "-f",
      "lavfi",
      "-i",
      `gradients=size=${W}x${H}:rate=30:c0=0x0B1220:c1=0x4C1D95:x0=0:y0=0:x1=${W}:y1=${H}`,
      "-i",
      "voice.mp3",
      "-filter_complex",
      `[0:v]${filter}[v]`,
      "-map",
      "[v]",
      "-map",
      "1:a",
      "-shortest",
      "-c:v",
      "libx264",
      "-preset",
      "veryfast",
      "-crf",
      "20",
      "-pix_fmt",
      "yuv420p",
      "-c:a",
      "aac",
      "-b:a",
      "128k",
      "-movflags",
      "+faststart",
      path.basename(videoPath),
    ],
    dir
  );

  return { video: videoPath, audio: audioPath, duration };
}
