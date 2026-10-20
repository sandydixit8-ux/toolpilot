import { PrismaClient } from "@prisma/client";

/**
 * Expand MP4 to MP3 / audio-extraction coverage for organic traffic:
 *  - rewrites the "convert-mp4-to-mp3-extract-audio" pillar with competitor-gap
 *    keywords (video to mp3, extract audio from video, video to audio, etc.)
 *  - replaces its inline FAQ section with proper FAQ rows (schema-eligible)
 *
 * Tool-side keyword/metadata expansion lives in src/config/tools-video.ts.
 */
const prisma = new PrismaClient();

const SLUG = "convert-mp4-to-mp3-extract-audio";

const CONTENT = `## Why Convert MP4 to MP3

An MP4 file carries both picture and sound. Often you only want the sound: the song from a concert clip, the audio of a recorded lecture, a podcast that was uploaded as video, or a voice note you need to play on an MP3 player.

Converting **MP4 to MP3** strips out the video and keeps the audio. The MP3 file is far smaller and plays nearly everywhere, phones, cars, and old MP3 players included. This is the same idea people search for as "video to MP3", "extract audio from video", or "get audio from video" - they all mean pulling the sound track out of a video and saving it as an audio file.

## How to Extract Audio from a Video

1. Open the free [MP4 to MP3](/tools/mp4-to-mp3) tool.
2. Upload or drop your video file (MP4, MOV, MKV, WebM, AVI, M4A, and more).
3. Pick an output quality: 128, 192, or 320 kbps.
4. Wait while the audio is extracted in your browser.
5. Download the resulting MP3.

No app install, no signup, and no upload to a server. The conversion runs locally with FFmpeg, so your file never leaves your device.

## Video to Audio: Which Bitrate Should You Choose

Bitrate sets the trade-off between file size and audio fidelity. You do not always need the biggest number.

| Use case | Recommended bitrate | Why |
| --- | --- | --- |
| Speech, lectures, interviews | 128 kbps | Speech needs less detail, and the file stays small |
| General music listening | 192 kbps | The best balance of quality and size |
| Music you care about, archiving | 320 kbps | Highest quality the MP3 format allows |

One honest note: the audio inside a video has usually been compressed once already, often to around 96 to 192 kbps AAC. Extracting it at 320 kbps MP3 does not recover detail the first pass discarded - it just stores the same audio in a larger file. For speech recordings, 128 kbps is almost always enough.

## MP4 to MP3 vs Other Conversions

MP4 is the most common container, but the same "extract the audio" idea applies to almost any video or audio file:

- **MOV to MP3** and **MKV to MP3** - common on phones and downloaded clips.
- **M4A to MP3** and **AAC to MP3** - converting between audio formats.
- **MP4 to WAV** - when you need an uncompressed, edit-ready track for a video editor instead of a small MP3.

The MP4 to MP3 tool accepts these as input automatically, so you rarely need to think about the container format.

## When to Keep the Video Instead

If you still need the picture, do not convert to MP3. Instead:

| Goal | Tool |
| --- | --- |
| Shrink a large video for sharing | [Video Compressor](/tools/video-compressor) |
| Turn a clip into a looping animation | [Video to GIF](/tools/video-to-gif) |
| Keep only the audio | [MP4 to MP3](/tools/mp4-to-mp3) |

## Tips for Better Audio Quality

- **Start with a good source.** MP3 cannot add detail the original audio lacked.
- **Trim before converting** if you only need a segment - a shorter file converts faster.
- **Accept some loss.** MP3 is a compressed format, so a small amount of quality loss is normal and usually inaudible for speech.
- **Do not over-set the bitrate.** Matching the source bitrate avoids needlessly large files.

## Common Uses for Extracted Audio

- Listening to a video lesson like a podcast
- Saving background music from a clip
- Sending a voice memo that is easy to play
- Feeding audio into a transcript or summary workflow
- Turning a webinar or meeting recording into an audio-only file

## Is This a YouTube Downloader?

No. This tool converts files that are already on your device. It does not download from YouTube or any streaming site. Only convert videos you own or have the rights to use.

Pull the audio out of any clip in seconds with the free [MP4 to MP3](/tools/mp4-to-mp3) tool.`;

const FAQS = [
  {
    question: "How do I convert MP4 to MP3 online for free?",
    answer: "Open the MP4 to MP3 tool, upload your video file, choose a bitrate such as 192 kbps, and click Convert. The MP3 downloads to your device in seconds. It is free with no signup and no watermark.",
  },
  {
    question: "Can I extract audio from a video without uploading it?",
    answer: "Yes. The conversion runs entirely in your browser using the FFmpeg engine, so your video is processed on your own device and never sent to a server. That keeps private recordings private.",
  },
  {
    question: "Which bitrate should I choose for the MP3?",
    answer: "192 kbps is a great balance for most audio. Use 320 kbps for music you care about, and 128 kbps when file size matters more, such as for voice recordings and lectures.",
  },
  {
    question: "Can I convert MOV, MKV, WebM or M4A to MP3?",
    answer: "Yes. The tool reads MP4, MOV, MKV, WebM, AVI, M4A, and most other common formats as input and always outputs a widely compatible MP3 file.",
  },
  {
    question: "Does converting to MP3 reduce audio quality?",
    answer: "MP3 is a lossy format, so there is minor compression. For speech and most music it is not noticeable, and choosing a higher bitrate such as 320 kbps keeps the loss minimal.",
  },
  {
    question: "Is this a YouTube or video downloader?",
    answer: "No. It converts files that are already on your device and does not download from streaming sites. Only convert videos you own or have permission to use, and respect copyright.",
  },
];

async function main() {
  const post = await prisma.blogPost.findUnique({ where: { slug: SLUG } });
  if (!post) throw new Error(`post not found: ${SLUG}`);

  const words = CONTENT.split(/\s+/).filter(Boolean).length;

  await prisma.blogPost.update({
    where: { slug: SLUG },
    data: {
      title: "MP4 to MP3: Extract Audio from Video Free (Video to Audio Guide)",
      seoTitle: "MP4 to MP3 Converter: Extract Audio from Video Free",
      seoDescription:
        "Convert MP4 to MP3 free and extract audio from any video in your browser. Video to audio, MOV to MP3, bitrate tips and no-signup conversion explained.",
      content: CONTENT,
      faqs: {
        deleteMany: {},
        create: FAQS.map((f, i) => ({ ...f, order: i })),
      },
    },
  });

  console.log(`updated ${post.slug}`);
  console.log(`  content words: ${words}`);
  console.log(`  faqs: ${FAQS.length}`);
  console.log(`  status: ${post.status}`);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
