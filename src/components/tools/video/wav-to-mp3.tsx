'use client';

import { AudioToMp3Tool } from "./audio-to-mp3";

export function WavToMp3Tool() {
  return (
    <AudioToMp3Tool
      sourceLabel="WAV"
      accept={{ "audio/*": [".wav", ".flac", ".aiff", ".aif", ".ogg", ".m4a", ".aac"] }}
      errorMessage="Failed to convert WAV to MP3"
    />
  );
}
