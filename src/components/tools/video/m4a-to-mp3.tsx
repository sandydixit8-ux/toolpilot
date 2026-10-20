'use client';

import { AudioToMp3Tool } from "./audio-to-mp3";

export function M4aToMp3Tool() {
  return (
    <AudioToMp3Tool
      sourceLabel="M4A"
      accept={{ "audio/*": [".m4a", ".mp4", ".aac", ".mov", ".m4b"], "video/*": [".mp4", ".mov", ".m4v"] }}
      errorMessage="Failed to convert M4A to MP3"
    />
  );
}
