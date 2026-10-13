import { readFile } from "node:fs/promises";
import type { ShortPlan } from "./content";

const TOKEN_URL = "https://oauth2.googleapis.com/token";
const UPLOAD_URL =
  "https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status";
const CATEGORY_ID = "28";

export function hasCredentials(): boolean {
  return Boolean(
    process.env.YT_CLIENT_ID && process.env.YT_CLIENT_SECRET && process.env.YT_REFRESH_TOKEN
  );
}

async function accessToken(): Promise<string> {
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.YT_CLIENT_ID as string,
      client_secret: process.env.YT_CLIENT_SECRET as string,
      refresh_token: process.env.YT_REFRESH_TOKEN as string,
      grant_type: "refresh_token",
    }),
    signal: AbortSignal.timeout(20000),
  });
  const json = (await res.json().catch(() => ({}))) as Record<string, string>;
  if (!res.ok || !json.access_token) {
    throw new Error(
      `token ${res.status}: ${json.error_description || json.error || "no access_token"}`
    );
  }
  return json.access_token;
}

export async function uploadShort(
  file: string,
  plan: ShortPlan,
  privacy: string
): Promise<string> {
  const token = await accessToken();
  const bytes = await readFile(file);

  const init = await fetch(UPLOAD_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "X-Upload-Content-Type": "video/mp4",
      "X-Upload-Content-Length": String(bytes.length),
    },
    body: JSON.stringify({
      snippet: {
        title: plan.title,
        description: plan.description,
        tags: plan.tags,
        categoryId: CATEGORY_ID,
      },
      status: {
        privacyStatus: privacy,
        selfDeclaredMadeForKids: false,
      },
    }),
    signal: AbortSignal.timeout(30000),
  });
  if (!init.ok) {
    throw new Error(`upload-init ${init.status}: ${(await init.text()).slice(0, 300)}`);
  }
  const location = init.headers.get("location");
  if (!location) throw new Error("upload-init: missing resumable Location header");

  const put = await fetch(location, {
    method: "PUT",
    headers: { "Content-Type": "video/mp4", "Content-Length": String(bytes.length) },
    body: bytes,
    signal: AbortSignal.timeout(180000),
  });
  const out = (await put.json().catch(() => ({}))) as Record<string, unknown>;
  if (!put.ok) {
    throw new Error(`upload ${put.status}: ${JSON.stringify(out).slice(0, 400)}`);
  }
  const id = out.id as string;
  if (!id) throw new Error(`upload: no video id in response ${JSON.stringify(out).slice(0, 300)}`);
  return id;
}
