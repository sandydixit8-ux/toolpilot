import fs from 'fs/promises';
import path from 'path';
import os from 'os';

export function createJobDir(): string {
  const jobId = `job_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  return path.join(os.tmpdir(), 'toolpilotpro', 'jobs', jobId);
}

export async function cleanupDir(dirPath: string, delayMs: number = 30_000): Promise<void> {
  setTimeout(async () => {
    try {
      await fs.rm(dirPath, { recursive: true, force: true });
    } catch {
      // Best effort cleanup
    }
  }, delayMs);
}

export async function cleanupNow(dirPath: string): Promise<void> {
  try {
    await fs.rm(dirPath, { recursive: true, force: true });
  } catch {
    // Best effort
  }
}
