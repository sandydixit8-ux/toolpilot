import { PrismaClient } from "@prisma/client";

/**
 * Depth pass 2: the remaining thin posts that already receive organic
 * traffic. Same rules as pass 1 - worked numbers, real limits, no filler,
 * FAQs moved out of the body into the FAQ table.
 */
const prisma = new PrismaClient();

const VIDEO_TO_GIF = `A GIF needs no player, no tap, and no sound. It loops the moment it loads, which is why reaction clips, quick demos and product highlights still travel as GIFs even though video files are smaller and sharper.

This guide covers the conversion, the file-size arithmetic that makes GIFs explode, and when a video or a still image is the better choice.

## How to Convert a Video to a GIF

1. Open the free [Video to GIF](/tools/video-to-gif) tool.
2. Upload your clip: MP4, MOV, WebM, AVI or MKV.
3. Pick a frame rate of 10, 15 or 24 fps.
4. Choose an output width, or keep the original size.
5. Select the clip length, either the whole video or the first 5 or 10 seconds.
6. Click Create GIF and download the result.

The conversion runs locally with FFmpeg, so the clip never leaves your device. There is no signup, no watermark and no export queue.

## Why GIF Files Get So Large

GIF stores every frame as a separate image and allows only 256 colours. There is no interframe compression, which is the trick MP4 uses to avoid storing the same background dozens of times.

Do the arithmetic on a short clip: a 480 x 270 frame is about 130,000 pixels. At one byte per pixel that is roughly 130 KB per frame. Five seconds at 15 fps is 75 frames, so the raw size lands near 9.7 MB before compression. A 20-second GIF at full width can pass 100 MB.

That is the entire reason GIF guides keep repeating the same three instructions: shorten, shrink, slow down.

## Choosing Settings That Look Good

| Setting | Effect on size | What to pick |
| --- | --- | --- |
| Frame rate | Halving fps roughly halves size | 10 fps for memes, 15 fps for demos, 24 fps only when motion is fast |
| Width | Size scales with area | 320 to 480 px for chat, 600 px for a blog post |
| Duration | Linear with length | 2 to 5 seconds is the sweet spot |
| Content | Busy scenes compress badly | Crop to the action, avoid panning shots |

Text and sharp edges survive GIF better than gradients do. A flat background with a subject in the middle produces a much smaller file than a detailed scene, because flat areas repeat and compress well.

## Trimming for a Clean Loop

A GIF looks like a stutter when the last frame jumps back to the first. To avoid it, end the clip on a frame that resembles the opening frame, or cut mid-motion so the loop reads as continuous.

The first-5-seconds option is usually the practical choice: it covers a reaction or a single gesture and keeps the file under a couple of megabytes.

## GIF vs MP4 vs WebP

| Format | Strengths | Weaknesses |
| --- | --- | --- |
| GIF | Plays anywhere, autoplays, universally supported | Huge files, 256 colours, no audio |
| MP4 | Small, sharp, audio included | Needs a player, may not autoplay |
| Animated WebP | Much smaller than GIF, better colours | Not supported by every older app |
| Still image | Tiny, sharp | No motion |

If you are embedding on a website you control, MP4 or WebP will beat GIF on size and quality. If you are pasting into a chat app, a comment thread or an email, GIF is the format that just works.

Stick to GIF and a party trick turns into a 30 MB email attachment. Use the [Video Compressor](/tools/video-compressor) when the clip should stay a video.

## Where GIFs Still Win

- Chat reactions and memes in WhatsApp, Slack and Telegram
- Short silent product demos inside documentation
- Bug reports that need a five-second screen recording
- Tutorials where a looping animation explains more than a paragraph
- Email campaigns, where video support is inconsistent but GIFs almost always play

## Common Mistakes

- Converting a whole minute of footage instead of the three seconds that matter.
- Using 24 fps for a slow pan, which triples the size for no visible benefit.
- Keeping 1080p width for something that renders at 400 px in the chat.
- Expecting audio. GIF has none; extract it with the [MP4 to MP3](/tools/mp4-to-mp3) tool if the sound matters.
- Uploading a proprietary or unusual format and wondering why it fails. Convert to MP4 first.

## When You Only Need the Audio

If what you actually want is the sound from the clip, a GIF is the wrong tool. Convert to MP3 with the [MP4 to MP3](/tools/mp4-to-mp3) tool instead, or compress the video and keep the audio with the [Video Compressor](/tools/video-compressor).

Turn any moment into a shareable loop with the free [Video to GIF](/tools/video-to-gif) tool.`;

const OCR = `OCR stands for Optical Character Recognition. It looks at an image, a screenshot, a photo of a page or a scanned bill, and reads the letters inside it, turning pixels into editable text you can copy, search and paste.

If the text exists only as a picture, OCR is the only way to get it back without retyping. This guide covers how it works, what makes it accurate, and where it fails.

## How OCR Works

The engine converts the image to grayscale, binarizes it so text becomes dark shapes on a light background, then segments the page into lines, words and characters. A recognition model matches those shapes against learned character patterns and assembles them into words, using a dictionary to fix obvious mistakes.

That pipeline explains both the strengths and the failures:

- Clean printed text on a plain background is close to perfect.
- Blurry, angled or low-resolution images confuse segmentation before recognition even starts.
- Handwriting, unusual fonts and text over busy photos break the character model.
- Tables and multi-column layouts lose their structure, because OCR reads in lines, not cells.

## How to Copy Text from an Image

1. Open the free [Image to Text](/tools/image-to-text) tool.
2. Upload the image: PNG, JPG, WebP, BMP or GIF.
3. Click Extract Text and wait for the engine to finish.
4. Copy the result, or download it as a .txt file.

Everything runs in your browser, so the image is not uploaded to a server. That matters for bank statements, ID documents and anything with personal data.

## What Makes OCR Accurate

| Problem | Fix before scanning |
| --- | --- |
| Blurry photo | Retake in good light, hold steady, avoid digital zoom |
| Skewed page | Straighten or crop first with the [Image Cropper](/tools/image-cropper) |
| Tiny text | Zoom in and re-capture, or scan at higher resolution |
| Low contrast | Increase contrast or brightness |
| Grey background | Raise contrast so text separates from the page |
| Handwriting | OCR works best on printed text; expect errors |

For scanned documents, 300 dpi is the usual sweet spot. Below 200 dpi, small fonts turn into smudges; above 600 dpi you mostly add file size.

## Getting the Best From a Screenshot

Screenshots are the easiest case: pixel-perfect text, no skew, no lighting. Just make sure you capture the text at full size rather than a zoomed-out thumbnail, and crop away sidebars and navigation so the engine does not try to read menu labels.

## Cleaning Up the Result

Even a good extraction needs a minute of tidying:

- Fix broken words at line ends, where a hyphen was read as a space.
- Remove repeated headers and footers if you scanned multiple pages.
- Rebuild paragraphs, since OCR often inserts a line break at every visual line.
- Check numbers carefully. Digits 0 and O, 1 and l, and 5 and S are the classic confusions.

Paste the text into the [Word Counter](/tools/word-counter) to see how much you recovered, or into the [AI Summarizer](/tools/ai-text-summarizer) if you only need the gist of a long captured article.

## OCR vs PDF Text Extraction

These are different problems and people often confuse them.

- A PDF exported from Word already contains real text. Copy and paste works without OCR.
- A scanned PDF is a stack of images with no text layer. Copying gives you nothing until OCR runs.
- A photo of a page is always an image, so OCR is required.

If a PDF refuses to let you select text, it is a scan. Convert the pages to images, run OCR, or use a dedicated PDF tool.

## Privacy: Where the Image Goes

Browser-based OCR never sends the file anywhere. Server-based OCR uploads it. For a recipe screenshot this hardly matters; for a passport, a payslip or a medical letter it matters a great deal.

The [Image to Text](/tools/image-to-text) tool processes locally, so documents stay on your device. That is the main reason to prefer a browser tool over a free upload service for anything sensitive.

## What OCR Cannot Do

- Read handwriting reliably, especially cursive
- Preserve table structure, columns or merged cells
- Understand embedded maths or chemical formulas
- Recover text from very low resolution or heavily compressed images
- Translate: extraction and translation are separate steps

For multilingual text, accuracy depends on the recognition language. English text recognises best; Hindi and other scripts work when the image is sharp and the font is common.

## What You Can Do With Extracted Text

- Edit a scanned contract in a document instead of retyping it
- Search and count words with the [Word Counter](/tools/word-counter)
- Translate a foreign receipt with the [Text Translator](/tools/text-translator)
- Summarize a captured article with the [AI Summarizer](/tools/ai-text-summarizer)
- Turn a photographed quote into a shareable post

Stop retyping what you can already see. Use the [Image to Text](/tools/image-to-text) tool to pull text from any screenshot or photo for free.`;

const TRANSLITERATION = `Typing Hindi on an English keyboard is slow if you hunt for a Devanagari layout you have never learned. Transliteration solves that: you type the word the way it sounds in Roman letters, and the tool writes it in Devanagari script.

This guide explains what transliteration actually does, how it differs from translation, and how to get clean output instead of mangled spelling.

## What Transliteration Is

Transliteration converts text from one writing system to another by sound. You type "namaste" and get नमस्ते. The language does not change; only the script does.

Compare that with translation, which changes the language itself. "dhanyavaad" transliterated is धन्यवाद, still Hindi. Translated, it is "thank you", which is English.

| You type | Transliteration gives | Translation gives |
| --- | --- | --- |
| namaste | नमस्ते | hello / greetings |
| dhanyavaad | धन्यवाद | thank you |
| aap kaise hain | आप कैसे हैं | how are you? |
| bharat | भारत | India |

If you need the meaning in English, use the [Text Translator](/tools/text-translator). If you need the same words written in Devanagari, transliterate.

## How Devanagari Actually Works

Devanagari is not a letter-for-letter alphabet, which is why transliteration is harder than it looks.

- Consonants carry an inherent "a" sound. क is "ka", not "k".
- Independent vowels exist, but after a consonant a vowel becomes a matra, a small mark attached to the letter.
- Aspirated consonants are separate letters: क (ka) and ख (kha) are different sounds, not the same sound with an h.
- Retroflex and dental consonants differ, so त (ta) and ट (ta) are not interchangeable.
- Half forms join consonants into clusters, which is how "st" in namaste becomes स्त.

When output looks wrong, it is usually one of these rules tripping over an ambiguous spelling rather than the tool failing.

## How to Convert Roman Hindi to Devanagari

1. Open the free [Transliteration](/tools/transliteration) tool.
2. Type or paste your Roman Hindi, for example "aap kaise hain".
3. Click Convert.
4. Copy the Devanagari output: आप कैसे हैं.

It runs in your browser, so nothing you type is sent anywhere. That is useful for personal documents.

## Spelling Conventions That Convert Cleanly

Hindi has no standard Roman spelling, so the same word appears as namaste, namastay and namastey. Transliteration tools map sounds, so pick the version that matches pronunciation most literally.

- Use "aa" for a long आ sound: "aap", "baat", "raat".
- Use "ee" or "i" for the short इ sound and "ee" for long ई.
- Use "kh", "gh", "chh", "jh", "th", "dh", "ph", "bh" for aspirated consonants.
- Use "sh" for श and "sh" or "s" for ष depending on the word.
- Write "m" before a labial consonant rather than "n": "sambandh", not "sanbandh".

Typing the sound accurately matters more than typing English spelling. Transliteration reads phonetics, not dictionary spellings.

## Common Situations

- **Government and bank forms** that reject Roman Hindi and expect Devanagari.
- **WhatsApp and social posts** where Devanagari looks more natural to the reader.
- **Wedding cards, invitations and notices** that need Hindi script but are typed by someone on an English keyboard.
- **Learning to read** Devanagari by seeing familiar words appear in script.
- **Names** transliterated for documents, though official spellings are often fixed and should be checked separately.

## Reverse Direction and Mixed Text

The same tool converts Devanagari back into readable Roman text, which helps when you can read the script but not confidently type it, or when you need to send Hindi content to someone without a Devanagari font.

Mixed sentences work too, because most people write "meeting 4 baje hai" rather than pure Hindi. Common English words usually stay readable while the Hindi portions convert.

## Common Mistakes

- Expecting a translation. Transliteration keeps Hindi words; it does not produce English meaning.
- Typing English spellings rather than sounds, then wondering why the output is off.
- Assuming names convert correctly. Proper nouns have no standard pronunciation rules, so check and fix them manually.
- Forgetting the inherent "a". A word ending in a bare consonant needs a virama, and omitting it changes the pronunciation.

## Related Tools

- [Text Translator](/tools/text-translator) for meaning across languages
- [Word Counter](/tools/word-counter) to count characters for forms with limits
- [AI Paraphraser](/tools/ai-paraphraser) to rewrite text after transliteration

Type Hinglish, get Devanagari, free with the [Transliteration](/tools/transliteration) tool.`;

const VIDEO_COMPRESS = `Phone footage is enormous. A minute of 4K video can pass 350 MB, and even ordinary 1080p clips run past 100 MB, which breaks WhatsApp sends, email attachments and upload forms with modest limits.

Compressing first fixes all of it. This guide shows the real limits, the arithmetic behind a target size, and the settings that keep a video watchable.

## How to Compress a Video

1. Open the free [Video Compressor](/tools/video-compressor).
2. Upload your MP4, MOV, WebM, AVI, MKV or M4V file.
3. Choose a compression level: Balanced, Smaller file or Higher quality.
4. Optionally downscale the output to 720p or 480p.
5. Click Compress Video and download the MP4.

Processing happens on your device with FFmpeg, so the video is never uploaded. The first conversion takes longer because the engine loads into the browser; later runs start instantly.

## Actual Size Limits

| Destination | Limit | Practical target |
| --- | --- | --- |
| WhatsApp video message | Around 64 MB on most versions | Under 60 MB |
| WhatsApp document | Much larger than the video limit | Under 100 MB |
| Gmail attachment | 25 MB | Under 20 MB |
| Outlook attachment | 20 MB for most accounts | Under 18 MB |
| Website embed | No hard limit, but every MB costs load time | Under 5 MB |
| Discord free upload | 10 MB | Under 10 MB |
| Telegram | 2 GB per file | Rarely needs compression |

Limits change without notice and vary by app version and account type, so treat the table as a starting point rather than a contract.

## The Arithmetic Behind a Target Size

File size is bitrate multiplied by duration. That single formula lets you plan an output instead of guessing.

Size in megabytes = bitrate in megabits per second x duration in seconds / 8.

Want a 60-second clip under 16 MB? Work backwards: 16 MB is 128 megabits, divided by 60 seconds gives about 2.1 Mbps total, split between video and audio. Set video near 1.9 Mbps and audio at 128 kbps and the file lands close to target.

Phone footage is often recorded at 20 to 40 Mbps, so the same clip can shrink by more than 90% and still look fine on a phone screen.

## What Actually Shrinks a Video

Four levers, in order of impact:

- **Resolution.** 4K to 1080p cuts the pixel count by 75%. 1080p to 720p halves it again, and on a phone the difference is hard to see.
- **Bitrate.** Lowering the encoder's quality setting discards detail the eye rarely notices, especially in motion.
- **Codec.** H.264 is the compatibility king. H.265 or AV1 compress better but not every player opens them.
- **Duration.** Cutting a dead intro is free savings with no quality loss at all.

Cropping or trimming first often removes the need for aggressive compression.

## Choosing a Compression Level

- **Balanced** is right for most cases: roughly half the size or better with no obvious change on a phone.
- **Smaller file** pushes further, useful when you must fit a hard limit.
- **Higher quality** keeps more detail for a clip that will be watched on a large screen.

Downscaling to 720p is the single most reliable way to hit a size limit without visible damage, because it reduces the amount of detail the encoder has to store at every frame.

## When a Video Still Will Not Fit

- Split it into parts and send them separately.
- Upload to cloud storage and send a link instead of a file.
- Extract just the audio with [MP4 to MP3](/tools/mp4-to-mp3) if the sound is what matters.
- Turn a short silent moment into a GIF with [Video to GIF](/tools/video-to-gif).
- Resize a thumbnail frame with the [Image Compressor](/tools/image-compressor) instead of sending the whole clip.

## Quality: What You Should Expect

Compression is lossy, so some detail disappears. The visible signs are blocky patches in fast motion, smeared gradients and ringing around sharp edges.

At Balanced settings on a phone screen, most people cannot tell the difference. The problems appear when a heavily compressed clip is played on a large display, so keep the original file if the footage matters.

Compressing an already compressed file compounds the damage. Always start from the original.

## Common Mistakes

- Compressing a clip that is mostly dead time instead of trimming it first.
- Keeping 4K for a WhatsApp video that renders at phone width.
- Compressing the same file repeatedly and degrading it each time.
- Assuming email will accept a file that is "only slightly" over the limit.
- Forgetting that the recipient may open the video on a desktop, where compression artefacts show.

Stop hitting send limits. Use the free [Video Compressor](/tools/video-compressor) to make your videos small enough to share anywhere.`;

const UPDATES = [
  {
    slug: "how-to-convert-video-to-gif",
    content: VIDEO_TO_GIF,
    title: "How to Convert a Video to GIF (Free, No Watermark)",
    seoTitle: "Video to GIF: Convert Video to GIF Free (No Watermark)",
    seoDescription:
      "Convert a video clip to a looping GIF for free, with no watermark. See why GIFs get so large, which frame rate and width to pick, and how to keep the file small.",
    excerpt:
      "A GIF loops anywhere without a play button. Learn how to convert a clip for free, why the file size explodes, and the settings that keep it shareable.",
    faqs: [
      {
        question: "How long should a GIF be?",
        answer:
          "Keep GIFs to about five seconds. GIF has no interframe compression, so a long clip becomes enormous quickly and most chat apps cap uploads well below the size a 20-second GIF would reach.",
      },
      {
        question: "Why is my GIF so large compared with the video?",
        answer:
          "Each GIF frame is stored almost independently and the format supports only 256 colours. Lowering the frame rate, shrinking the dimensions and shortening the clip are the three biggest size reductions.",
      },
      {
        question: "Can I convert a video to GIF on a phone?",
        answer:
          "Yes. A browser-based converter works on current iOS and Android browsers, so you can upload the clip, choose the length and download the GIF without installing an app.",
      },
      {
        question: "What frame rate should I choose for a GIF?",
        answer:
          "10 fps suits memes and slow movement, 15 fps is a good default for demos, and 24 fps is only worth the extra size when the motion is fast and the clip is very short.",
      },
      {
        question: "Do GIFs have sound?",
        answer:
          "No. The GIF format has no audio track. If you need the sound from a video, extract it as an MP3 instead.",
      },
      {
        question: "Is a GIF or an MP4 better for a website?",
        answer:
          "An MP4 is far smaller and sharper for the same content. A GIF is worth it when you need autoplay with no controls, or when you are pasting into a chat or email where video may not play.",
      },
    ],
  },
  {
    slug: "how-to-extract-text-from-image-ocr",
    content: OCR,
    title: "How to Extract Text from an Image (Free OCR Tool, No Sign-Up)",
    seoTitle: "How to Extract Text from an Image: Free OCR Tool",
    seoDescription:
      "Extract text from images, screenshots and scanned pages for free with a browser OCR tool. How OCR works, what makes it accurate, and what it cannot read.",
    excerpt:
      "Turn screenshots, photos and scanned pages into editable text for free. Learn how OCR works, the settings that improve accuracy, and where it fails.",
    faqs: [
      {
        question: "What is OCR and how accurate is it?",
        answer:
          "OCR is optical character recognition, which turns pixels into editable text. Accuracy is above 99 percent on clean, straight scans and drops for blurry, angled or handwritten content.",
      },
      {
        question: "Why does OCR produce garbled characters?",
        answer:
          "Low resolution, skewed pages, unusual fonts and complex backgrounds confuse character recognition. Straighten and upscale the image, raise contrast, then try again.",
      },
      {
        question: "Is it safe to OCR a passport or bank statement online?",
        answer:
          "Only with a tool that processes the image in the browser so the file never leaves your device. Sensitive documents should not be uploaded to a server you do not control.",
      },
      {
        question: "What image resolution gives the best OCR result?",
        answer:
          "Around 300 dpi for scanned documents. Below 200 dpi small text turns into smudges, and above 600 dpi you mostly add file size without improving recognition.",
      },
      {
        question: "Can OCR read a scanned PDF?",
        answer:
          "A PDF with a text layer copies normally and needs no OCR. A scanned PDF is a stack of images, so its pages must be converted to images and run through OCR before the text can be selected.",
      },
      {
        question: "Does OCR keep tables and columns?",
        answer:
          "No. OCR reads in lines, so table structure and multi-column layouts usually come out as one continuous block that needs manual tidying.",
      },
    ],
  },
  {
    slug: "hindi-transliteration-roman-to-devanagari",
    content: TRANSLITERATION,
    title: "Hindi Transliteration: Convert Roman Hindi to Devanagari Online",
    seoTitle: "Hindi Transliteration: Convert Roman Hindi to Devanagari",
    seoDescription:
      "Convert Roman Hindi (Hinglish) to Devanagari script online for free. How Devanagari works, spelling tips that convert cleanly, and transliteration vs translation.",
    excerpt:
      "Typing Hindi on an English keyboard is slow. Learn how transliteration turns Roman Hindi (Hinglish) into Devanagari, and how to spell words so they convert cleanly.",
    faqs: [
      {
        question: "What is the difference between transliteration and translation?",
        answer:
          "Transliteration changes the script while keeping the sound and the words, so Hindi written in Roman letters becomes Devanagari. Translation changes the language itself, for example Hindi to English meaning.",
      },
      {
        question: "Why is Roman Hindi spelling inconsistent?",
        answer:
          "There is no standard Roman spelling for Hindi, so the same word appears as namaste, namastay or namastey. Transliteration tools map sounds rather than fixed spellings.",
      },
      {
        question: "Can transliteration handle English words inside Hindi text?",
        answer:
          "Yes. Most tools keep common English words readable and transliterate the Hindi portions, which matches how people actually write mixed sentences.",
      },
      {
        question: "Do I need a Hindi keyboard installed?",
        answer:
          "No. That is the point of transliteration: you type in English letters and the tool produces Devanagari, so no Indic keyboard or input method is required.",
      },
      {
        question: "Can I convert Devanagari back to Roman letters?",
        answer:
          "Yes. The same tool converts Devanagari into readable Roman text, which helps when you can read the script but not type it confidently.",
      },
    ],
  },
  {
    slug: "how-to-compress-video-for-whatsapp-email",
    content: VIDEO_COMPRESS,
    title: "How to Compress a Video for WhatsApp, Email & Upload (Free Tool)",
    seoTitle: "How to Compress a Video for WhatsApp, Email & Upload",
    seoDescription:
      "Compress MP4 videos for WhatsApp, email and uploads for free. Real size limits, the bitrate arithmetic behind a target size, and settings that keep quality.",
    excerpt:
      "Large videos fail to send or upload. Learn the real size limits, how to work out the bitrate for a target file size, and how to compress without ruining quality.",
    faqs: [
      {
        question: "What is the WhatsApp video size limit?",
        answer:
          "WhatsApp caps video messages at roughly 64 MB on most versions, while documents can be much larger. The limit varies by platform and app version, so aim comfortably under it.",
      },
      {
        question: "What is the best way to shrink a video without ruining it?",
        answer:
          "Lower the resolution to 720p or 480p first, then reduce the bitrate. Cutting resolution is far more effective than aggressive compression at full size.",
      },
      {
        question: "Why does email reject my video even after compressing?",
        answer:
          "Most providers cap attachments at 20 to 25 MB. For anything larger, upload to cloud storage and send a link instead of an attachment.",
      },
      {
        question: "How do I work out the bitrate for a target file size?",
        answer:
          "Multiply the target size in megabytes by 8 to get megabits, then divide by the duration in seconds. A 60-second clip that must fit in 16 MB needs about 2.1 Mbps in total.",
      },
      {
        question: "Does compressing a video twice make it worse?",
        answer:
          "Yes. Every pass is lossy, so compressing an already compressed file compounds the artefacts. Always start again from the original recording.",
      },
      {
        question: "Is the video uploaded to a server?",
        answer:
          "Not with a browser-based compressor. Compression runs on your device with FFmpeg, so the file never leaves your computer or phone.",
      },
    ],
  },
] as const;

async function main() {
  for (const update of UPDATES) {
    const post = await prisma.blogPost.findUnique({ where: { slug: update.slug } });
    if (!post) {
      console.warn(`skip (missing): ${update.slug}`);
      continue;
    }
    const words = update.content.split(/\s+/).filter(Boolean).length;
    await prisma.blogPost.update({
      where: { slug: update.slug },
      data: {
        title: update.title,
        seoTitle: update.seoTitle,
        seoDescription: update.seoDescription,
        excerpt: update.excerpt,
        content: update.content,
        faqs: {
          deleteMany: {},
          create: update.faqs.map((f, i) => ({ ...f, order: i })),
        },
      },
    });
    console.log(`updated ${update.slug} (${words} words, ${update.faqs.length} faqs)`);
  }
  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
