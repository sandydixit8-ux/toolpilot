import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const IMAGE_CAT = "cmv3lepo50001uf38ppdf8cwy";

const PILLAR_A_SLUG = "how-to-compress-image-without-losing-quality";
const PILLAR_B_SLUG = "how-to-resize-images-without-losing-quality";
const PILLAR_C_SLUG = "image-optimization-for-web-guide";

const pillarA = `Compressing an image without losing quality sounds impossible, because smaller files usually mean a blurrier picture. In practice you can cut an image file size by 70-90% and still see no visible difference, as long as you compress it the right way. This guide explains what quality loss actually is, the exact settings to use, and how to hit the target file size for websites, WhatsApp, email, and government or job portals.

## What "Without Losing Quality" Really Means

Every image stores colour and detail using a certain amount of data, and compression removes the data the human eye is least likely to notice. "Without losing quality" does not mean zero data removed. It means the difference is invisible at normal viewing sizes.

There are two kinds of compression:

- **Lossy** removes some data permanently (JPEG, lossy WebP). Best for photos, where you can shrink dramatically before anyone notices.
- **Lossless** reorganises data with nothing removed (PNG, lossless WebP). Best for logos, screenshots, and text where every pixel matters.

The most common mistake is choosing the wrong kind for the wrong image. Compress a screenshot as a JPEG and the text goes fuzzy. Compress a photo as PNG and the file stays huge.

## Lossy vs Lossless: Which Should You Use?

| Image type | Best compression | Why |
| --- | --- | --- |
| Phone photos, camera shots | Lossy (JPEG or WebP) | Smooth gradients hide tiny data loss |
| Logos, icons, flat graphics | Lossless (PNG or WebP) | Sharp edges and transparency stay clean |
| Screenshots with text | Lossless (PNG or WebP) | Text stays readable |
| Product photos for a store | Lossy WebP at 80% | Small files that still look premium |

## The Quality Sweet Spot

You do not have to guess a quality percentage. These targets work for almost every situation:

| Use case | Target file size | Approx. quality |
| --- | --- | --- |
| Blog or article image | 60-150 KB | 78-82% |
| Product photo | 100-300 KB | 82-85% |
| Full-width hero banner | 150-400 KB | 78-80% |
| Thumbnail | 20-50 KB | 65-70% |
| WhatsApp photo | 100-500 KB | 70-80% |
| Email attachment | Under 300 KB each | 75-80% |

Below roughly 60% quality you start to see blocky patches in smooth areas such as skies. Above 85% the file grows quickly for a difference nobody can see.

## How to Compress an Image in Three Steps

1. Open the free [Image Compressor](/tools/image-compressor). It runs entirely in your browser, so your photos never leave your device.
2. Upload one image, or drag in a whole batch.
3. Pick the quality level (Medium or Balanced is a good default), check the preview, and download.

If the result is still too large, the fastest fix is not more compression but resizing. Dropping a 4000-pixel-wide photo to 1600 pixels often removes more weight than any quality slider can.

## JPEG vs PNG vs WebP: Which Format Compresses Best?

| Format | Best for | Size | Transparency |
| --- | --- | --- | --- |
| JPEG | Photos | Small | No |
| PNG | Logos, text, screenshots | Large | Yes |
| WebP | Almost everything online | Smallest | Yes |
| AVIF | Next-gen photos | Even smaller | Yes |

WebP is typically 25-35% smaller than JPEG at the same visible quality, and it supports transparency like PNG. For any image going on a website, converting to WebP first and then compressing is the single best habit you can build. Convert with the [WebP Converter](/tools/webp-converter).

## Compressing for Every Situation

### For your website

Images are usually 50-70% of a page's weight, so they decide whether your site loads in one second or five. Compress every image to under 200 KB, convert photos to WebP, and always resize to the largest size the image is actually displayed at. A 4000px photo shown in an 800px column wastes more than 90% of its data. The full [Image Optimization guide](/blog/image-optimization-for-web-guide) covers the technical side.

### For WhatsApp

A modern phone camera produces 5-15 MB photos, which is why chats feel slow and storage fills up. WhatsApp also re-compresses anything large, so sending a bulky file hurts quality twice. Compress first to 100-500 KB and the photo arrives crisp and instantly.

| WhatsApp use | Recommended size |
| --- | --- |
| Chat photo | 100-300 KB |
| Profile picture | 50-100 KB |
| Document or form image | 200-500 KB |
| Group or status photo | 300-600 KB |

### For email attachments

Most mail providers cap attachments around 20-25 MB, and many company servers block anything over 5-10 MB. Keep every photo under 300 KB and any combined document under 5 MB.

### For government, exam, and job portals

Portals rarely use normal size limits. They demand exact ones, such as a photo under 50 KB or a signature under 20 KB. Two techniques handle these: compress to the lowest quality that is still readable, and resize the dimensions down, because a smaller canvas needs far fewer bytes. For multi-page documents, combine images into one PDF with [JPG to PDF](/tools/jpg-to-pdf) and trim it with the [PDF Compressor](/tools/pdf-compressor).

## Resize First, Then Compress

Resizing is the weight-loss tool nobody talks about. The number of pixels sets the floor for how small a file can get.

| Where it goes | Best width |
| --- | --- |
| Website content | 800-1200 px |
| WhatsApp or email | 1280 px |
| Social media | 1080-1200 px |
| Print | 2480 px at 300 DPI |

Use the [Image Resizer](/tools/image-resizer) to set the width, then compress the result. Doing both usually beats either one alone.

## Real Before-and-After Results

These are typical results from the free [Image Compressor](/tools/image-compressor):

| Original | After (Balanced) | Saving |
| --- | --- | --- |
| 5.0 MB photo | 480 KB | 90% |
| 3.2 MB screenshot | 310 KB | 90% |
| 8.4 MB banner | 690 KB | 92% |
| 1.9 MB PNG logo | 210 KB | 89% |

## Seven Common Compression Mistakes

1. Compressing the same JPEG again and again. Each save re-compresses and adds visible decay, so always re-export from the original.
2. Using JPEG for text, logos, or screenshots, which smears the sharp edges.
3. Using PNG for photographs, which keeps quality but leaves a huge file.
4. Ignoring dimensions. A 12MP photo is heavy no matter how you compress it.
5. Pushing quality below 60% on faces or smooth skies, where blocking becomes obvious.
6. Uploading a huge image "to be safe" and letting the browser scale it down, which still downloads every byte.
7. Compressing an already-compressed file, which gives small gains for a big quality cost.

## How to Check the Quality Yourself

- View the compressed image at 100% zoom, not shrunk in a preview.
- Look at smooth areas such as sky, skin, and backgrounds for blocky patches.
- Check text edges in screenshots.
- Compare file sizes. If a photo dropped by under 20%, you can usually lower the quality further.

## Batch Compressing Many Images

A gallery, an album, or a product catalogue is not a one-by-one job. Drag all the files into the [Image Compressor](/tools/image-compressor) at once, apply one setting, and download the whole set. Everything stays on your device, so there is no upload wait.

## Summary

To compress images without visible quality loss: use lossy compression for photos and lossless for logos and text, aim for 70-85% quality and the target sizes above, prefer WebP on the web, resize first because it is the biggest single win, and never re-compress a file that is already compressed. Start with the free [Image Compressor](/tools/image-compressor) and the [Image Resizer](/tools/image-resizer). No signup, no watermark, and your files never leave your browser.`;

const pillarB = `Resizing an image the wrong way turns a sharp photo into a stretched, blurry mess. Done correctly, resizing is completely invisible, and it is often the single biggest way to shrink a file or fit an image into a slot. This guide covers the golden rules, the exact pixel sizes every platform expects in 2026, and how to resize quickly and free.

## Resize vs Crop vs Scale

People use these words interchangeably, but they do different things:

| Action | What it does | When to use it |
| --- | --- | --- |
| Resize | Changes width and height, usually keeping the ratio | Fit an image to a slot or platform |
| Crop | Removes part of the image and keeps the rest | Change the composition or framing |
| Scale | Resizes while keeping the aspect ratio locked | Safe resizing of photos |

Rule of thumb: resize to the right size, then crop only if the framing needs to change.

## The Golden Rule: Downscale, Never Upscale

Downscaling, or making an image smaller, throws pixels away and almost always looks sharp. Upscaling, or making it larger, invents pixels that were never there and always looks soft. No tool can create real detail from nothing. If you must enlarge a small image, expect softness. Never upscale a logo or icon. Use a vector format such as SVG instead, which stays crisp at any size.

## Exact Image Sizes for Every Platform (2026)

| Where | Image type | Size (px) |
| --- | --- | --- |
| Website | Blog featured image | 1200 x 630 |
| Website | Full-width hero | 1920 x 1080 |
| Website | Content image | 800-1200 wide |
| Facebook | Post | 1200 x 630 |
| Facebook | Profile | 320 x 320 |
| Instagram | Square post | 1080 x 1080 |
| Instagram | Story or Reel cover | 1080 x 1920 |
| X (Twitter) | Post | 1600 x 900 |
| LinkedIn | Post | 1200 x 627 |
| LinkedIn | Banner | 1584 x 396 |
| YouTube | Thumbnail | 1280 x 720 |
| Pinterest | Pin | 1000 x 1500 |
| WhatsApp | Chat photo | 1280 wide |
| Passport photo | Many portals | 200 x 230 |

Platforms tweak these numbers from time to time, but these are dependable defaults for 2026.

## How to Resize an Image

1. Open the free [Image Resizer](/tools/image-resizer). It works in the browser with no upload server.
2. Upload the image, or several at once.
3. Enter the new width and height, or lock the aspect ratio and change just one side.
4. Choose the output format. WebP for web, JPEG for photos, PNG for graphics.
5. Download and check at 100% zoom.

Keeping the aspect ratio locked prevents the stretched look that comes from forcing a photo into the wrong shape.

## Aspect Ratio Explained Simply

Aspect ratio is the relationship between width and height, such as 16:9, 4:3, 1:1, or 9:16. Squashing a 4:3 photo into a 1:1 square stretches it. The fix is to crop instead.

- Widescreen (16:9) for banners, YouTube thumbnails, and hero images.
- Square (1:1) for Instagram and Facebook grid posts.
- Portrait (9:16) for Stories, Reels, and phone wallpapers.
- Classic photo (4:3) for phone cameras and older prints.

## Keeping Text and Logos Sharp

When you shrink a screenshot, chart, or logo, the fine lines can blur because ordinary resizing smooths every pixel. For flat graphics with hard edges, a nearest-neighbour or hard-edges resize keeps them crisp. For best results, keep logos and icons as PNG rather than JPEG, resize graphics to an exact multiple of their original size where possible, and use SVG for anything that must stay sharp at any size.

## DPI: Web vs Print

DPI, or dots per inch, only matters when something is printed. On screen, only the pixel dimensions count.

| Purpose | Target |
| --- | --- |
| Web, social, email | 72 PPI. Pixels are all that matter |
| Standard print | 300 DPI |
| Large poster | 150 DPI is often enough |

A high-DPI label does not make a small image printable. A 500px image cannot become a sharp A4 print no matter what DPI number is stored in the file.

## Resize for Email and WhatsApp

Attachments and chats do not need camera-resolution files. Resize before sending:

| Where it goes | Best width |
| --- | --- |
| Email attachment | 1280 px |
| WhatsApp | 1280-1600 px |
| Website | 800-1200 px |
| Social media | 1080-1200 px |

On a phone, resizing from 4000px to 1280px can drop an image from 6 MB to well under 1 MB with no visible change on any screen.

## Six Common Resizing Mistakes

1. Upscaling small images and expecting them to get sharper.
2. Ignoring the aspect ratio and stretching the picture.
3. Resizing the same file repeatedly instead of starting from the original.
4. Using JPEG for logos with sharp edges or transparency.
5. Sending 12MP photos over email or chat.
6. Forgetting to compress after resizing.

## Resize, Then Compress

Resizing sets the pixel count and compressing shrinks the remaining weight. Together they give the smallest, sharpest result. After you resize, run the image through the free [Image Compressor](/tools/image-compressor) to cut the file size further with no visible loss. For the compression side in depth, read [How to Compress Images Without Losing Quality](/blog/how-to-compress-image-without-losing-quality).

## Summary

Downscale freely and avoid upscaling. Lock the aspect ratio to prevent stretching. Use the platform sizes above. Keep logos as PNG or SVG and photos as WebP or JPEG. Resize to the display size, then compress. Use the free [Image Resizer](/tools/image-resizer) to hit the exact size and the [Image Compressor](/tools/image-compressor) to finish the job. Both run in your browser with no signup.`;

const pillarC = `Images are the heaviest part of almost every web page, often 50% or more of the total bytes a visitor downloads. Get them right and your site feels instant. Get them wrong and even a beautiful page feels slow, which costs you rankings and visitors. This guide is the complete, practical playbook for optimizing images on any website in 2026.

## Why Image Optimization Matters

- **Core Web Vitals and SEO.** Google uses real loading speed, especially Largest Contentful Paint (LCP), as a ranking signal, and the LCP element is usually an image.
- **Conversions.** Users consistently abandon pages that take more than about three seconds to load.
- **Mobile users.** Most traffic is mobile, often on slower connections where every kilobyte counts.
- **Bandwidth and cost.** Smaller images mean less data transferred and lower hosting bills.

## The Five Pillars of Image Optimization

Everything below falls into five techniques. Do them in this order.

### 1. Compress to remove invisible data

Compression is the fastest win. A well-compressed photo is 70-90% smaller with no visible difference. Use the free [Image Compressor](/tools/image-compressor) and aim for the sizes in the table below.

| Use case | Target size |
| --- | --- |
| Content image | 60-150 KB |
| Hero image | 150-400 KB |
| Thumbnail | 20-50 KB |

### 2. Resize to the size actually displayed

This is the step most sites skip. If your content column is 800px wide, serving a 4000px image wastes more than 90% of its data. Use the [Image Resizer](/tools/image-resizer) to match the real display size before uploading.

### 3. Choose the right format

| Format | Best for | Notes |
| --- | --- | --- |
| JPEG | Photos | Universally supported |
| PNG | Logos, transparency | Lossless but large |
| WebP | Almost everything | 25-35% smaller than JPEG |
| AVIF | Next-gen photos | Even smaller, newer support |
| SVG | Icons, logos | Scalable and tiny |

The modern approach is to serve WebP with a JPEG fallback, and to use SVG for icons and logos. Convert with the [WebP Converter](/tools/webp-converter).

### 4. Lazy-load images below the fold

Lazy loading delays images until the visitor scrolls near them, so the first screen loads faster. You enable it with one attribute, loading set to lazy. Never lazy-load the main hero image, because that is usually your LCP element and should load immediately.

### 5. Serve responsive images

One image size cannot fit every screen, and a phone should not download a desktop-sized file. Responsive images solve this with srcset and sizes, which let the browser choose the right file:

- srcset lists several versions of the image at different widths.
- sizes tells the browser how wide the image will actually display.
- The browser then downloads only the version it needs.

## Always Add Width and Height

Set explicit width and height attributes on every image. This reserves the space before the image loads and stops the page from jumping around. That jump is measured as Cumulative Layout Shift, and a poor score also hurts rankings.

## The Complete Optimization Checklist

- [ ] Compress every image before uploading
- [ ] Resize images to their real display size
- [ ] Convert photos to WebP with a fallback
- [ ] Keep logos and icons as SVG
- [ ] Add descriptive alt text for accessibility and SEO
- [ ] Add width and height on every image
- [ ] Lazy-load everything below the fold
- [ ] Preload the hero or LCP image
- [ ] Serve responsive versions with srcset
- [ ] Deliver images through a CDN

## How to Measure the Result

- **PageSpeed Insights.** Run a URL and read the LCP value and the "properly size images" audit.
- **Chrome DevTools, Network tab.** Sort by size to see the heaviest files on your page.
- **A simple weight budget.** Aim for a total page weight under about 1 MB and any single image under 200 KB.

## Free Tools for the Job

| Tool | Purpose |
| --- | --- |
| [Image Compressor](/tools/image-compressor) | Reduce file size |
| [Image Resizer](/tools/image-resizer) | Match display dimensions |
| [WebP Converter](/tools/webp-converter) | Convert to WebP |
| [Image Cropper](/tools/image-cropper) | Crop to the right framing |
| [Image Quality Optimizer](/tools/image-quality-optimizer) | Balance quality and size |
| [PNG to JPG](/tools/png-to-jpg) | Convert screenshots to smaller files |

## Summary

Optimize in this order: compress, resize, convert to a modern format, add explicit dimensions, then lazy-load and serve responsive versions. Start with the biggest images on your site, because fixing them alone often cuts load time in half. Browse all [image tools](/tools/image) to do it for free, right in your browser.`;

type Pillar = {
  slug: string;
  title: string;
  seoTitle: string;
  seoDescription: string;
  excerpt: string;
  content: string;
  faqs: { question: string; answer: string }[];
};

const pillars: Pillar[] = [
  {
    slug: PILLAR_A_SLUG,
    title: "How to Compress Images Without Losing Quality (2026 Guide)",
    seoTitle: "How to Compress Images Without Losing Quality (2026 Guide) | ToolPilot",
    seoDescription:
      "Learn how to compress JPG, PNG, and WebP images by up to 90% without visible quality loss. Step-by-step guide with target sizes for web, WhatsApp, email, and job portals. Free, no signup.",
    excerpt:
      "Cut image file sizes by 70-90% with no visible quality loss. Target sizes, formats, and settings for web, WhatsApp, email, and government portals, explained step by step.",
    content: pillarA,
    faqs: [
      {
        question: "Does compressing an image reduce its quality?",
        answer:
          "Only slightly, and usually invisibly. At 70-85% quality the file shrinks dramatically while the image still looks identical at normal viewing sizes. Quality only becomes noticeable when you push below about 60%.",
      },
      {
        question: "What is the best file size for an image on a website?",
        answer:
          "Aim for 60-150 KB for content images, 150-400 KB for full-width hero images, and 20-50 KB for thumbnails. Staying under 200 KB per image keeps pages fast.",
      },
      {
        question: "Which format compresses best, JPEG, PNG, or WebP?",
        answer:
          "WebP usually gives the smallest files at the same visible quality, about 25-35% smaller than JPEG, and it supports transparency like PNG. Use WebP for the web, JPEG for maximum compatibility, and PNG for sharp graphics.",
      },
      {
        question: "Will compressing my photos help on WhatsApp?",
        answer:
          "Yes. WhatsApp re-compresses large photos, which can make them look blurry. Compressing to 100-500 KB before sending keeps your photo sharp and sends faster.",
      },
      {
        question: "Can I compress several images at once?",
        answer:
          "Yes. The free Image Compressor accepts a whole batch at once, so you can optimize an entire album or product catalogue in one go.",
      },
      {
        question: "Is the Image Compressor free and private?",
        answer:
          "Yes. It is completely free with no signup or watermark, and it runs in your browser, so your images are never uploaded to a server.",
      },
    ],
  },
  {
    slug: PILLAR_B_SLUG,
    title: "How to Resize Images Without Losing Quality (2026 Guide)",
    seoTitle: "How to Resize Images Without Losing Quality (2026 Guide) | ToolPilot",
    seoDescription:
      "Resize JPG, PNG, and WebP images for web, social media, email, and print without blur or stretching. Exact 2026 image sizes for every platform plus free browser tools.",
    excerpt:
      "Resize images for web, social media, email, and print without blur or stretching. Includes exact 2026 pixel sizes for every major platform and free browser tools.",
    content: pillarB,
    faqs: [
      {
        question: "Does resizing an image reduce its quality?",
        answer:
          "Making an image smaller (downscaling) has no visible quality loss at normal sizes. Making it larger (upscaling) always softens it, because no tool can create detail that was not in the original.",
      },
      {
        question: "Should I resize or compress first?",
        answer:
          "Resize first, then compress. Resizing reduces the number of pixels and drops the file size a lot, and compressing afterwards shrinks the remaining weight without visible loss.",
      },
      {
        question: "What size should I resize an image to for Instagram?",
        answer:
          "Use 1080 x 1080 px for square posts, 1080 x 1350 px for portrait posts, and 1080 x 1920 px for Stories and Reels.",
      },
      {
        question: "How do I resize an image without stretching it?",
        answer:
          "Lock the aspect ratio while resizing so the width and height change together. If the frame must change shape, crop the image instead of stretching it.",
      },
      {
        question: "What is the difference between resize, crop, and scale?",
        answer:
          "Resize changes the width and height, crop removes part of the image, and scale resizes while keeping the aspect ratio locked. Resize to the right size, then crop if the framing needs to change.",
      },
      {
        question: "Is the Image Resizer free to use?",
        answer:
          "Yes. It is free, needs no signup, adds no watermark, and runs entirely in your browser so your images are never uploaded.",
      },
    ],
  },
  {
    slug: PILLAR_C_SLUG,
    title: "Image Optimization for Web: The Complete 2026 Guide",
    seoTitle: "Image Optimization for Web: The Complete 2026 Guide | ToolPilot",
    seoDescription:
      "The complete guide to image optimization for faster websites: compression, modern formats like WebP and AVIF, responsive images, lazy loading, and Core Web Vitals, with free tools.",
    excerpt:
      "The complete guide to image optimization for faster websites: compression, modern formats (WebP and AVIF), responsive images, lazy loading, and Core Web Vitals.",
    content: pillarC,
    faqs: [
      {
        question: "Why is image optimization important for SEO?",
        answer:
          "Google uses loading speed, especially Largest Contentful Paint (LCP), as a ranking signal, and images are usually the LCP element. Optimized images improve Core Web Vitals, which can help your rankings and your conversions.",
      },
      {
        question: "What is the best image format for the web?",
        answer:
          "WebP is the best default for most images, at 25-35% smaller than JPEG with support for transparency. AVIF can be even smaller, and SVG is ideal for icons and logos.",
      },
      {
        question: "Do I need to both compress and resize images?",
        answer:
          "Yes. Resizing reduces the number of pixels, which sets how small a file can get, and compressing reduces the remaining weight. Together they give the smallest, fastest result.",
      },
      {
        question: "What is lazy loading?",
        answer:
          "Lazy loading delays images until the visitor scrolls near them, so the first screen loads faster. Add it with the loading attribute set to lazy, but never lazy-load the main hero image.",
      },
      {
        question: "How much should a web image weigh?",
        answer:
          "Aim for under 200 KB per image, with content images at 60-150 KB and hero images at 150-400 KB. A good target for total page weight is under about 1 MB.",
      },
      {
        question: "Are the image tools free?",
        answer:
          "Yes. The Image Compressor, Image Resizer, WebP Converter, and other tools on ToolPilot are free, require no signup, and run in your browser.",
      },
    ],
  },
];

const ARCHIVE: { slug: string; to: string }[] = [
  { slug: "compress-images-web-no-quality-loss", to: PILLAR_A_SLUG },
  { slug: "compress-images-website-cut-page-load-time", to: PILLAR_A_SLUG },
  { slug: "how-to-compress-images-for-web", to: PILLAR_A_SLUG },
  { slug: "how-to-compress-images-for-whatsapp-email", to: PILLAR_A_SLUG },
  { slug: "image-compressor-reduce-file-size", to: PILLAR_A_SLUG },
  { slug: "online-image-compressor-whatsapp-send-photos", to: PILLAR_A_SLUG },
  { slug: "resize-compress-images-email-attachments", to: PILLAR_A_SLUG },
  { slug: "image-resizer-resize-images-different-platforms", to: PILLAR_B_SLUG },
];

async function run() {
  for (const p of pillars) {
    const existing = await prisma.blogPost.findUnique({ where: { slug: p.slug } });
    if (!existing) {
      console.log("MISSING pillar, skipping:", p.slug);
      continue;
    }
    await prisma.blogPost.update({
      where: { slug: p.slug },
      data: {
        title: p.title,
        seoTitle: p.seoTitle,
        seoDescription: p.seoDescription,
        excerpt: p.excerpt,
        content: p.content,
        status: "PUBLISHED",
        categoryId: IMAGE_CAT,
        publishedAt: existing.publishedAt ?? new Date("2026-08-23T08:35:44.172Z"),
      },
    });
    await prisma.fAQ.deleteMany({ where: { blogPostId: existing.id } });
    await prisma.fAQ.createMany({
      data: p.faqs.map((f, i) => ({
        question: f.question,
        answer: f.answer,
        blogPostId: existing.id,
        order: i,
      })),
    });
    const words = p.content.split(/\s+/).length;
    console.log("UPDATED pillar:", p.slug, "| words:", words, "| faqs:", p.faqs.length);
  }

  for (const a of ARCHIVE) {
    const r = await prisma.blogPost.updateMany({
      where: { slug: a.slug },
      data: { status: "ARCHIVED" },
    });
    console.log("ARCHIVED:", a.slug, "-> /blog/" + a.to, "| rows:", r.count);
  }

  const published = await prisma.blogPost.count({ where: { status: "PUBLISHED" } });
  const archived = await prisma.blogPost.count({ where: { status: "ARCHIVED" } });
  console.log("PUBLISHED now:", published, "| ARCHIVED now:", archived);
}

async function main() {
  for (let i = 0; i < 4; i++) {
    try {
      await run();
      break;
    } catch (e: any) {
      console.log("retry", i, e?.message?.slice(0, 90));
      await new Promise((r) => setTimeout(r, 3000));
    }
  }
}

main().finally(() => prisma.$disconnect());
