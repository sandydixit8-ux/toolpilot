import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// ---------------------------------------------------------------------------
// Part A: taxonomy backfill for previously uncategorized posts
// ---------------------------------------------------------------------------

const catNames: Record<string, string> = {
  guides: "Guides",
  calculators: "Calculators",
  developer: "Developer Tools",
  pdf: "PDF Tools",
  career: "Career Tools",
  image: "Image Tools",
  business: "Business Tools",
  ai: "AI Tools",
  translation: "Translation Tools",
  video: "Video Tools",
};

const backfill: Record<string, string> = {
  "age-calculator-find-exact-age": "calculators",
  "base64-encoder-decoder-guide": "developer",
  "best-free-online-tools-students-2026": "guides",
  "best-free-productivity-tools-freelancers": "guides",
  "bmi-calculator-body-mass-index": "calculators",
  "business-name-generator-startup": "business",
  "character-counter-social-media-seo": "guides",
  "check-monthly-budget-salary-calculator": "calculators",
  "color-picker-choose-right-colors-design": "image",
  "compound-interest-calculator-grow-wealth": "calculators",
  "compress-images-web-no-quality-loss": "image",
  "compress-images-website-cut-page-load-time": "image",
  "compress-pdf-under-5mb-email-free": "pdf",
  "convert-jpg-to-png-online-free": "image",
  "convert-pdf-to-excel-free-online": "pdf",
  "convert-pdf-to-word-edit-without-losing-formatting": "pdf",
  "cover-letter-generator-guide": "career",
  "create-gst-invoice-legally-compliant-india": "business",
  "date-calculator-days-between-dates": "calculators",
  "discount-calculator-never-overpay": "calculators",
  "emi-calculator-guide": "calculators",
  "free-pdf-compressor-no-watermark-online": "pdf",
  "gst-calculator-guide-india-2026": "calculators",
  "how-epf-interest-calculated-india": "calculators",
  "how-gst-works-india-guide": "calculators",
  "how-to-calculate-gratuity-resignation-india": "calculators",
  "how-to-calculate-percentage-increase": "calculators",
  "how-to-calculate-take-home-salary-from-ctc-india": "calculators",
  "how-to-check-resume-ats-screening-free-tool": "career",
  "how-to-compress-pdf-for-email": "pdf",
  "how-to-convert-jpg-to-pdf-online": "pdf",
  "how-to-convert-pdf-to-word": "pdf",
  "how-to-convert-word-to-pdf": "pdf",
  "how-to-create-invoices-online": "business",
  "how-to-create-professional-resume-10-minutes": "career",
  "how-to-extract-pages-from-pdf": "pdf",
  "how-to-merge-multiple-pdfs": "pdf",
  "how-to-resize-images-without-losing-quality": "image",
  "how-to-rotate-pdf-pages-online": "pdf",
  "how-to-split-pdf-files": "pdf",
  "html-preview-tool-test-debug": "developer",
  "image-compressor-reduce-file-size": "image",
  "image-optimization-for-web-guide": "image",
  "image-resizer-resize-images-different-platforms": "image",
  "income-tax-on-12-lakh-salary-zero-tax-new-regime": "calculators",
  "json-formatter-validate-json": "developer",
  "markdown-editor-why-developers-love": "developer",
  "merge-pdfs-college-assignments-projects": "pdf",
  "old-vs-new-tax-regime-2025-26-which-saves-more": "calculators",
  "online-image-compressor-whatsapp-send-photos": "image",
  "pass-ats-naukri-linkedin-indeed-platform-specific-tips": "career",
  "password-generator-create-strong-passwords": "developer",
  "percentage-calculator-complete-guide": "calculators",
  "qr-code-generator-create-free": "business",
  "reduce-pdf-size-government-portal-upload": "pdf",
  "resize-compress-images-email-attachments": "image",
  "resume-ats-checker-guide": "career",
  "resume-ats-score-what-is-good-how-to-improve": "career",
  "resume-builder-create-professional-resume": "career",
  "roi-calculator-measure-investment-returns": "business",
  "salary-calculator-take-home-pay-india": "calculators",
  "simple-interest-vs-compound-interest-calculator": "calculators",
  "sip-calculator-guide-india": "calculators",
  "sip-vs-lump-sum-investment-strategy-2026": "calculators",
  "unit-converter-quick-guide": "calculators",
  "uuid-generator-what-it-is-developers": "developer",
  "word-counter-why-word-count-matters": "guides",
};

// ---------------------------------------------------------------------------
// Part B: sprint 3 posts for thin categories (ai, translation, video, business)
// ---------------------------------------------------------------------------

const posts = [
  {
    title: "MP4 to MP3: How to Extract Audio from a Video (Free)",
    slug: "convert-mp4-to-mp3-extract-audio",
    excerpt:
      "Need just the sound from a video? Learn how to extract audio from an MP4 into MP3 for free, and when you should keep the video instead.",
    categorySlug: "video",
    categoryName: "Video Tools",
    content: `## Why Convert MP4 to MP3

An MP4 file carries both picture and sound. Often you only want the sound: the song from a concert clip, the audio of a recorded lecture, a podcast that was uploaded as video, or a voice note you need to play on an MP3 player.

Converting **MP4 to MP3** strips out the video and keeps the audio. The MP3 file is far smaller and plays anywhere — phones, cars, and old MP3 players included.

## How to Extract Audio from a Video

1. Open the free [MP4 to MP3](/tools/mp4-to-mp3) tool.
2. Upload or drop your MP4 file.
3. Wait while the audio is extracted.
4. Download the resulting MP3.

No app install and no signup are required.

## When to Keep the Video Instead

If you still need the picture, do not convert to MP3. Instead:

| Goal | Tool |
| --- | --- |
| Shrink a large video for sharing | [Video Compressor](/tools/video-compressor) |
| Turn a clip into a looping animation | [Video to GIF](/tools/video-to-gif) |
| Keep only the audio | [MP4 to MP3](/tools/mp4-to-mp3) |

## Tips for Better Audio Quality

- **Start with a good source.** MP3 cannot add detail the original audio lacked.
- **Trim before converting** if you only need a segment — a shorter file converts faster.
- **Accept some loss.** MP3 is a compressed format, so a small amount of quality loss is normal and usually inaudible for speech.

## Common Uses for Extracted Audio

- Listening to a video lesson like a podcast
- Saving background music from a clip
- Sending a voice memo that is easy to play
- Feeding audio into a transcript or summary workflow

## FAQ

### Is the MP4 to MP3 tool free?
Yes. It is free and needs no account.

### Will converting harm the audio?
MP3 is a lossy format, so there is minor compression. For speech and most music it is not noticeable.

### Can I convert other video formats?
MP4 is the most common. The same idea applies to other container formats that hold an audio track.

### Do I lose the video file?
No. Converting creates a new MP3 and leaves your original video untouched.

Pull the audio out of any clip in seconds with the free [MP4 to MP3](/tools/mp4-to-mp3) tool.`,
    seoTitle: "MP4 to MP3: Extract Audio from Video Free Online",
    seoDescription:
      "Convert MP4 to MP3 and extract audio from any video for free, no signup. Learn when to keep the video and tips for better audio quality.",
    status: "PUBLISHED" as const,
  },
  {
    title: "AI Paraphrasing: How to Rewrite Text Without Plagiarism",
    slug: "ai-paraphrase-rewrite-text-free",
    excerpt:
      "Paraphrasing tools can help you restate ideas in your own words. Learn how AI paraphrasing works, when to use it, and how to avoid plagiarism.",
    categorySlug: "ai",
    categoryName: "AI Tools",
    content: `## What Paraphrasing Really Means

To **paraphrase** is to express the same idea in different words. Done well, it keeps the meaning while changing the wording and structure. It is a normal part of writing a summary, explaining a source, or simplifying a dense paragraph.

An **AI paraphraser** automates that rewriting step. You paste text, it returns a restated version.

## How AI Paraphrasers Work

Modern tools read your sentence, understand the meaning, and generate a new sentence that carries the same idea. Most let you control the tone — simpler, more formal, or shorter.

They are useful for:

- Rewriting a clumsy sentence you wrote yourself
- Simplifying jargon for a general reader
- Creating alternate phrasings of a headline
- Shortening a long paragraph

## How to Paraphrase Text

1. Open the free [AI Paraphraser](/tools/ai-paraphraser).
2. Paste the text you want to rewrite.
3. Choose a mode (simple, formal, or concise).
4. Copy the result and edit it to fit your voice.

## Paraphrasing Is Not a Plagiarism Shortcut

This is the important part. Paraphrasing changes the words, **not the ownership of the idea**. If the idea came from a source, you still need to cite it. Running a sentence through a tool and removing the citation is still plagiarism.

Safe to paraphrase freely:

- Your own drafts
- Common knowledge
- A summary where you credit the source

Not safe:

- Reusing someone else's unique idea without credit
- Passing off a rewritten article as your own research

## Make Rewritten Text Sound Human

Tool output can read stiff. If a paragraph feels robotic, run it through the [AI Text Humanizer](/tools/ai-text-humanizer) to vary sentence length and smooth the flow.

## Summarize Instead of Rewriting Everything

If your goal is to shorten a long document rather than reword every line, a summary is the better tool. The [AI Text Summarizer](/tools/ai-text-summarizer) condenses an article into its key points.

## FAQ

### Is paraphrasing cheating?
No, when used on your own writing or with proper credit to sources. It becomes a problem only when it hides the true source.

### Is the AI paraphraser free?
Yes. The [AI Paraphraser](/tools/ai-paraphraser) is free and needs no signup.

### Can it detect plagiarism?
No. It rewrites text. Always run your final work through a dedicated plagiarism checker and cite your sources.

### Should I edit the output?
Always. Treat the result as a first draft and adjust it so it matches your voice and is factually correct.

Use the free [AI Paraphraser](/tools/ai-paraphraser) to restate text in seconds — then edit and cite responsibly.`,
    seoTitle: "AI Paraphrasing: Rewrite Text Free Without Plagiarism",
    seoDescription:
      "Learn how AI paraphrasing works, how to rewrite text in your own words for free, and how to paraphrase without plagiarising a source.",
    status: "PUBLISHED" as const,
  },
  {
    title: "Hindi to English Translation: Free Tools and Tips for Accuracy",
    slug: "hindi-to-english-translation-free-online",
    excerpt:
      "Translate Hindi to English (and back) for free. Learn how machine translation works, how to get accurate results, and translation vs transliteration.",
    categorySlug: "translation",
    categoryName: "Translation Tools",
    content: `## Hindi to English Translation Made Simple

Whether you are reading a Hindi news article, writing an email to an English-speaking client, or preparing study notes, a **Hindi to English translation** tool turns one language into another in seconds.

The free [Text Translator](/tools/text-translator) handles Hindi to English and back, and supports many other language pairs.

## How to Translate Hindi to English

1. Open the [Text Translator](/tools/text-translator).
2. Set the source language to **Hindi** and the target to **English** (or leave it on auto-detect).
3. Paste or type your Hindi text.
4. Copy the English output.

## Tips for Accurate Translations

Machine translation is fast but literal. You get the best results when you help it:

- **Write complete sentences.** Fragments translate poorly.
- **Avoid heavy slang and idioms.** They rarely survive translation.
- **Break very long sentences** into shorter ones first.
- **Feed clean text.** Copy text with the [Image to Text](/tools/image-to-text) OCR tool rather than retyping from a photo.
- **Proofread the output.** Machine translation misses nuance; a quick human pass fixes it.

## Translation vs Transliteration

These two are often confused:

| Need | Correct tool |
| --- | --- |
| Change the language (Hindi meaning into English) | [Text Translator](/tools/text-translator) |
| Change the script (Devanagari letters into Roman letters, same language) | [Transliteration](/tools/transliteration) |

If you want "नमस्ते" to become "Namaste" (same word, Roman letters), that is transliteration. If you want it to become "Hello", that is translation.

## Common Mistakes to Avoid

- Trusting an idiom-heavy phrase word-for-word
- Translating a name and losing it
- Skipping the proofread on important documents
- Confusing transliteration with translation

## FAQ

### Is Hindi to English translation free?
Yes. The [Text Translator](/tools/text-translator) is free and needs no signup.

### Can I translate English to Hindi too?
Yes. The tool works in both directions and with many other languages.

### Is machine translation accurate?
It is good for everyday text. For legal, medical, or formal documents, always have a native speaker review the result.

### What is the difference between translation and transliteration?
Translation changes the language and meaning; transliteration only changes the script used to write the same language.

Translate Hindi and English text instantly with the free [Text Translator](/tools/text-translator).`,
    seoTitle: "Hindi to English Translation: Free Online Tool & Tips",
    seoDescription:
      "Translate Hindi to English (and back) for free online. Learn how to get accurate translations and the difference from transliteration.",
    status: "PUBLISHED" as const,
  },
  {
    title: "How to Create a Quotation for Clients (Free Quotation Generator)",
    slug: "how-to-create-quotation-for-clients",
    excerpt:
      "A clear quotation wins more work. Learn what to include, how it differs from an invoice, and how to create a professional quotation for free.",
    categorySlug: "business",
    categoryName: "Business Tools",
    content: `## What Is a Quotation?

A **quotation** is a document you send a client *before* work begins. It states what you will deliver and how much it will cost. Accepting it turns into a job — and later an invoice.

Getting quotations right matters because they are often the first impression a client has of your business.

## Quotation vs Invoice

They look similar but do different jobs:

| Document | When it is sent | Purpose |
| --- | --- | --- |
| Quotation | Before the work | Propose price and scope |
| Invoice | After delivery | Request payment |

## What to Include in a Quotation

A professional quotation typically contains:

- Your business name, address, and contact details
- Client name and details
- A unique quotation number and date
- A validity period (how long the price stands)
- Line items: description, quantity, unit price, total
- Subtotals, taxes, and the grand total
- Payment terms and delivery timeline
- Space for the client to accept

## How to Create a Quotation

1. Open the free [Quotation Generator](/tools/quotation-generator).
2. Enter your business and client details.
3. Add line items with quantities and prices.
4. Apply tax if needed.
5. Download the finished quotation and send it.

## Add Taxes Without Errors

If you operate in India and need to show GST, generate a compliant document with the [GST Invoice Generator](/tools/gst-invoice-generator). For a standard bill after the job is done, use the [Invoice Generator](/tools/invoice-generator).

## Tips That Win Work

- **Be specific.** Vague line items invite haggling.
- **Show validity.** "Valid for 15 days" creates a gentle deadline.
- **Keep it tidy.** A clean, branded quotation looks more trustworthy.
- **Follow up.** A short reminder often closes the deal.

## FAQ

### Is the quotation generator free?
Yes. The [Quotation Generator](/tools/quotation-generator) is free and needs no signup.

### Is a quotation a legal contract?
A quotation is an offer. Once the client accepts it, it can form the basis of a contract, but it is not binding on its own.

### Can I add GST to a quotation?
Yes. Add tax lines, or use the [GST Invoice Generator](/tools/gst-invoice-generator) when a fully compliant tax document is required.

### What is a good validity period?
Seven to 30 days is common. Longer periods lock in your prices for too long.

Create a polished, professional quotation in minutes with the free [Quotation Generator](/tools/quotation-generator).`,
    seoTitle: "How to Create a Quotation for Clients (Free Generator)",
    seoDescription:
      "Learn what a quotation should include, how it differs from an invoice, and how to create a professional client quotation for free.",
    status: "PUBLISHED" as const,
  },
  {
    title: "Break-Even Analysis: How to Calculate Your Break-Even Point",
    slug: "break-even-analysis-calculate-guide",
    excerpt:
      "Break-even analysis shows how many units you must sell to cover your costs. Learn the formula, work an example, and use a free calculator.",
    categorySlug: "business",
    categoryName: "Business Tools",
    content: `## What Is Break-Even Analysis?

**Break-even analysis** tells you the point at which your revenue exactly covers your costs — no profit, no loss. Below it you are losing money; above it every extra sale adds profit.

It is one of the simplest ways to sanity-check a price, a product idea, or a business plan.

## The Break-Even Formula

For a single product:

**Break-even units = Fixed Costs ÷ (Price − Variable Cost per Unit)**

- **Fixed costs** stay the same no matter how much you sell (rent, salaries, software).
- **Variable costs** rise with each unit (materials, packaging, payment fees).
- **Price − Variable Cost** is your contribution margin per unit.

## A Worked Example

Say your fixed costs are ₹50,000 a month. You sell a product for ₹500, and each unit costs ₹300 in materials and fees.

- Contribution margin = ₹500 − ₹300 = ₹200
- Break-even units = ₹50,000 ÷ ₹200 = **250 units**

You must sell 250 units a month to break even. Unit 251 starts earning profit.

## How to Calculate It

1. Open the free [Break-Even Calculator](/tools/break-even-calculator).
2. Enter your fixed costs, price per unit, and variable cost per unit.
3. Read the break-even units and revenue.

## Why It Matters

Break-even analysis answers practical questions:

- Is this price high enough to ever be profitable?
- How many sales do I need to cover rent this month?
- Is it worth cutting the price to win volume?

## Related Metrics to Check

Break-even is one lens. Combine it with:

- [Profit Margin Calculator](/tools/profit-margin-calculator) — how much of each sale is profit
- [ROI Calculator](/tools/roi-calculator) — return on what you invested

## FAQ

### What is a break-even point?
The sales level where total revenue equals total costs, so profit is zero.

### How do I reduce my break-even point?
Lower fixed costs, raise the price, or cut variable costs. Any of these reduces the units needed.

### What if my break-even is too high?
Revisit your price, find cheaper variable costs, or reduce fixed overhead before committing.

### Can I calculate it for a service business?
Yes. Treat each billable hour or project as a "unit" with its own price and variable cost.

Find your break-even point in seconds with the free [Break-Even Calculator](/tools/break-even-calculator).`,
    seoTitle: "Break-Even Analysis: Formula, Example & Free Calculator",
    seoDescription:
      "Learn how to calculate your break-even point with a simple formula and example, then check it instantly with a free break-even calculator.",
    status: "PUBLISHED" as const,
  },
];

async function ensureCategory(slug: string, name: string) {
  let category = await prisma.blogCategory.findUnique({ where: { slug } });
  if (!category) {
    category = await prisma.blogCategory.create({ data: { name, slug } });
    console.log(`Created category: ${slug}`);
  }
  return category;
}

async function main() {
  // 1. Ensure every category referenced by the backfill and new posts exists.
  const needed = new Set<string>();
  for (const cat of Object.values(backfill)) needed.add(cat);
  for (const post of posts) needed.add(post.categorySlug);

  const idBySlug = new Map<string, string>();
  for (const slug of needed) {
    const name = catNames[slug] ?? slug;
    const category = await ensureCategory(slug, name);
    idBySlug.set(slug, category.id);
  }

  // 2. Backfill categories only where none is set (idempotent, non-destructive).
  let backfilled = 0;
  for (const [postSlug, catSlug] of Object.entries(backfill)) {
    const categoryId = idBySlug.get(catSlug)!;
    const res = await prisma.blogPost.updateMany({
      where: { slug: postSlug, categoryId: null },
      data: { categoryId },
    });
    backfilled += res.count;
  }
  console.log(`Backfilled ${backfilled} posts with a category`);

  // 3. Upsert sprint 3 posts.
  for (const post of posts) {
    const categoryId = idBySlug.get(post.categorySlug)!;
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: {
        title: post.title,
        content: post.content,
        excerpt: post.excerpt,
        seoTitle: post.seoTitle,
        seoDescription: post.seoDescription,
        status: "PUBLISHED",
        publishedAt: new Date(),
        author: "ToolPilot Team",
        categoryId,
      },
      create: {
        title: post.title,
        slug: post.slug,
        content: post.content,
        excerpt: post.excerpt,
        seoTitle: post.seoTitle,
        seoDescription: post.seoDescription,
        status: "PUBLISHED",
        publishedAt: new Date(),
        author: "ToolPilot Team",
        categoryId,
      },
    });
    console.log(`Upserted: ${post.title}`);
  }

  // 4. Summary.
  const total = await prisma.blogPost.count();
  const uncat = await prisma.blogPost.count({ where: { categoryId: null } });
  console.log(`Total blog posts: ${total} | uncategorized: ${uncat}`);
  const cats = await prisma.blogCategory.findMany({
    include: { _count: { select: { posts: true } } },
    orderBy: { posts: { _count: "desc" } },
  });
  for (const c of cats) console.log(`  ${c.slug}\t${c._count.posts}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
