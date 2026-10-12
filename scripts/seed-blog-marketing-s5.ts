import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const posts = [
  {
    title: "How to Convert PNG to JPG (Free Online, No Quality Loss)",
    slug: "how-to-convert-png-to-jpg",
    excerpt:
      "PNG files are sharp but heavy. Learn when to convert PNG to JPG, how to keep quality, and how to do it free without uploading to a sketchy site.",
    categorySlug: "image",
    categoryName: "Image Tools",
    content: `## PNG vs JPG: What Is the Difference?

**PNG** is a lossless format. It keeps every pixel exact and supports transparency, which makes it perfect for logos, screenshots, and graphics with text. The trade-off is size — PNG files are large.

**JPG** is a lossy format. It compresses smartly by discarding detail the eye rarely notices, producing much smaller files. It is ideal for photographs and any image where transparency is not needed.

## When to Convert PNG to JPG

Convert when:

- You have a **photo** saved as PNG and want a smaller file
- A website or form **rejects PNG** and asks for JPG
- You are **emailing** an image and need it under a size limit
- You want faster page loads and smaller uploads

Keep PNG when the image has **transparency** (a logo on no background) or fine **text and line art** you cannot afford to blur.

## How to Convert PNG to JPG

1. Open the free [PNG to JPG](/tools/png-to-jpg) tool.
2. Upload your PNG file.
3. Convert and download the JPG.

Need the reverse? Use [JPG to PNG](/tools/jpg-to-png). Working with modern formats? Try the [WebP Converter](/tools/webp-converter).

## Keep the Quality High

JPG compression is adjustable. A few rules of thumb:

- **Start from a clean source.** Converting a blurry PNG will not sharpen it.
- **Avoid re-saving repeatedly.** Each JPG save loses a little more detail.
- **Use a high quality setting** when the image matters, and a lower one when it only needs to look good on screen.
- **Resize before compressing** so you are not shrinking quality and pixels at once.

## Shrink the File Further

Once it is a JPG, the [Image Compressor](/tools/image-compressor) reduces the size more — ideal before email attachments or website uploads.

## FAQ

### Is converting PNG to JPG free?
Yes. The [PNG to JPG](/tools/png-to-jpg) tool is free and needs no signup.

### Will I lose quality?
JPG is a lossy format, so there is minor quality loss. For photos it is rarely visible; for text and sharp edges you may notice it.

### Can I convert JPG back to PNG?
Yes. Use [JPG to PNG](/tools/jpg-to-png). Note that converting back does not restore detail already lost.

### What about transparency?
JPG does not support transparency. A transparent area becomes a solid colour, usually white. Keep PNG if you need transparency.

Turn heavy PNGs into lightweight JPGs with the free [PNG to JPG](/tools/png-to-jpg) tool.`,
    seoTitle: "How to Convert PNG to JPG Free Online (No Quality Loss)",
    seoDescription:
      "Convert PNG to JPG free online without visible quality loss. Learn when to use JPG vs PNG, how to keep quality, and how to compress further.",
    status: "PUBLISHED" as const,
  },
  {
    title: "How to Prepare for an Interview with AI (Free Question Generator)",
    slug: "how-to-prepare-interview-ai-generator",
    excerpt:
      "Walk into your interview ready. Learn how an AI interview question generator helps you predict questions from a job description and practise answers.",
    categorySlug: "career",
    categoryName: "Career Tools",
    content: `## Why Preparation Decides the Interview

Most candidates do not fail from lack of skill — they fail from lack of preparation. Walking in without knowing what will be asked puts you on the back foot. The fix is simple: study the job description, predict the questions, and rehearse your answers.

An **AI interview question generator** speeds this up by reading a job description and producing likely questions for that exact role.

## Start from the Job Description

Everything begins with the JD. Paste it into the [Job Description Analyzer](/tools/job-description-analyzer) to pull out the key skills, responsibilities, and keywords the employer cares about. Those become the spine of your preparation.

## Generate Likely Questions

1. Open the free [Interview Question Generator](/tools/interview-question-generator).
2. Paste the job description or role title.
3. Get a list of probable interview questions.
4. Prepare a short, specific answer for each.

## How to Answer with the STAR Method

For behavioural questions, structure answers as:

| Part | What to say |
| --- | --- |
| **Situation** | Set the scene briefly |
| **Task** | What you were responsible for |
| **Action** | What you actually did |
| **Result** | The outcome, with numbers if possible |

Keep each answer to about 90 seconds. Specific beats general every time.

## Tighten Your Resume and Cover Letter

Your interview builds on your application. Make sure both are sharp:

- Check your resume against the role with the [Resume ATS Checker](/tools/resume-ats-checker)
- Generate a tailored summary with the [AI Resume Summary Generator](/tools/ai-resume-summary-generator)
- Draft a matching cover letter with the [Cover Letter Generator](/tools/cover-letter-generator)

## A Simple Prep Routine

1. Analyse the job description.
2. Generate the likely questions.
3. Write short STAR answers for the top ten.
4. Rehearse out loud.
5. Prepare three questions to ask the interviewer.

## FAQ

### Are interview questions generated by AI accurate?
They are a strong starting point based on the role and description. Treat them as likely, not guaranteed.

### Is the tool free?
Yes. The [Interview Question Generator](/tools/interview-question-generator) is free and needs no signup.

### How many questions should I prepare?
Aim for the top ten likely questions, plus answers to "tell me about yourself" and "why this role".

### Should I memorise answers?
Do not recite them word for word. Know your key points and speak naturally.

Walk in prepared, not surprised. Use the free [Interview Question Generator](/tools/interview-question-generator) to rehearse the questions that matter.`,
    seoTitle: "How to Prepare for an Interview with AI (Free Generator)",
    seoDescription:
      "Prepare for interviews with a free AI question generator. Analyse the job description, predict likely questions, and answer with the STAR method.",
    status: "PUBLISHED" as const,
  },
  {
    title: "How to Estimate Construction & Project Cost (Free Calculators)",
    slug: "how-to-estimate-construction-project-cost",
    excerpt:
      "Cost overruns sink projects. Learn how to estimate construction and project costs with a BOQ, contingency, and free online calculators.",
    categorySlug: "business",
    categoryName: "Business Tools",
    content: `## Why Cost Estimation Matters

A project without a realistic cost estimate is a gamble. Underestimate and you run out of money halfway; overestimate and you lose the bid. Good estimation keeps a project funded and your profit intact.

Estimation is not a single number — it is a structured breakdown of everything the work will cost.

## The Building Blocks of a Cost Estimate

A solid estimate covers:

- **Materials** — bricks, cement, steel, fittings, and quantities
- **Labour** — daily wages or contractor rates multiplied by time
- **Equipment** — hire or depreciation of machines
- **Overheads** — site supervision, permits, transport
- **Contingency** — a buffer, typically 5–15%, for the unexpected
- **Margin** — your profit

## What Is a BOQ?

A **Bill of Quantities (BOQ)** lists every item of work with its quantity and rate, then totals them. It is the backbone of construction estimating because it makes costs transparent and comparable between bids.

Build one quickly with the [BOQ Calculator](/tools/boq-calculator).

## How to Estimate a Project Cost

1. Break the project into line items (a BOQ).
2. Enter quantities and unit rates with the [BOQ Calculator](/tools/boq-calculator).
3. Add labour, equipment, and overheads.
4. Estimate the full build cost with the [Construction Cost Calculator](/tools/construction-cost-calculator).
5. Total it up in the [Project Cost Calculator](/tools/project-cost-calculator).
6. Add contingency, then margin.

## A Quick Example

| Item | Amount |
| --- | --- |
| Materials | ₹4,00,000 |
| Labour | ₹1,50,000 |
| Equipment | ₹50,000 |
| Overheads | ₹40,000 |
| Subtotal | ₹6,40,000 |
| Contingency (10%) | ₹64,000 |
| **Total** | **₹7,04,000** |

## Do Not Forget Contingency and Margin

- **Contingency** absorbs surprises: price rises, weather delays, scope changes.
- **Margin** is what makes the job worth doing. Without it, a busy project can still lose money.

Check the profitability of your final figure with the [ROI Calculator](/tools/roi-calculator).

## FAQ

### What percentage should contingency be?
5–15% is typical. Use more for complex, uncertain, or long projects.

### What is a BOQ?
A Bill of Quantities — an itemised list of work, quantities, and rates that totals the cost.

### How accurate are online cost calculators?
They give a reliable ballpark from your inputs. Always adjust rates to your local market.

### Should I include contingency in my quote?
Include a buffer, but present your customer-facing price separately so the contingency is not the headline.

Estimate with confidence and protect your margin using the free [Project Cost Calculator](/tools/project-cost-calculator) and [BOQ Calculator](/tools/boq-calculator).`,
    seoTitle: "How to Estimate Construction & Project Cost (Free Tools)",
    seoDescription:
      "Learn how to estimate construction and project costs with a BOQ, contingency, and margin, using free online calculators. Includes a worked example.",
    status: "PUBLISHED" as const,
  },
  {
    title: "Notice Period Calculator: How to Find Your Last Working Day",
    slug: "notice-period-calculator-last-working-day",
    excerpt:
      "Resigning? Learn how your notice period is counted, how to find your exact last working day, and how to calculate your experience and final pay.",
    categorySlug: "career",
    categoryName: "Career Tools",
    content: `## Why Your Notice Period Matters

When you resign, your **notice period** decides your last working day, your handover window, and often your final settlement. Getting the dates wrong can delay your next job or your full-and-final pay.

Notice periods are usually written into your contract — commonly 30, 60, or 90 days.

## How Notice Period Is Counted

The usual rule: your notice starts the day **after** you submit your resignation, and it runs for the number of days stated in your contract. Some employers count **calendar days**, others count only **working days** and skip weekends and holidays.

Always confirm which method your employer uses.

## How to Calculate Your Last Working Day

1. Open the free [Notice Period Calculator](/tools/notice-period-calculator).
2. Enter your resignation date and notice period.
3. Choose calendar or working days.
4. Read your exact last working day.

For a plain date difference, the [Date Calculator](/tools/date-calculator) works too.

## Negotiate or Buy Out Notice

Options to shorten your notice:

- **Buy-out** — pay the employer the salary for the unserved days, if your contract allows it
- **Negotiation** — agree an earlier release, common when a handover is complete
- **Leave adjustment** — offset unused leave against the notice period

## Calculate Your Total Experience

When switching jobs, recruiters ask for your total experience. Add up your tenure across roles with the [Experience Calculator](/tools/experience-calculator).

## A Small Example

Resign on 1 March with a 60-day calendar notice: the last working day falls at the end of April, allowing for the start day. The calculator handles the exact date, including whether the count begins on the resignation day or the next.

## What About Your Final Pay?

Your full-and-final settlement usually includes:

- Salary for days worked
- Pay for unserved notice (if required)
- Encashment of unused leave
- Any bonus or dues

Estimate the salary side with the [Salary Calculator](/tools/salary-calculator-career) so you know what to expect.

## FAQ

### Does notice period include weekends?
It depends on your employer. Many count calendar days; some count only working days. The calculator lets you choose.

### Does notice start on the resignation day?
Usually the next day. Some companies count from the same day, so check your contract.

### Can I leave without serving notice?
Only if your contract allows a buy-out or your employer agrees to waive it. Otherwise, an unserved notice may be deducted from your settlement.

### How do I calculate my last working day?
Use the [Notice Period Calculator](/tools/notice-period-calculator) — enter the dates and it does the maths.

Know your dates before you resign. Find your exact last working day with the free [Notice Period Calculator](/tools/notice-period-calculator).`,
    seoTitle: "Notice Period Calculator: Find Your Last Working Day Free",
    seoDescription:
      "Calculate your notice period and last working day for free. Learn how notice is counted, how to negotiate or buy out, and how to total your experience.",
    status: "PUBLISHED" as const,
  },
  {
    title: "URL Encoder vs URL Decoder: How to Handle Special Characters",
    slug: "url-encoder-vs-url-decoder",
    excerpt:
      "Spaces, ampersands, and slashes break URLs. Learn the difference between URL encoding and decoding and how to fix broken links for free.",
    categorySlug: "developer",
    categoryName: "Developer Tools",
    content: `## Why URLs Break

A URL can only contain a limited set of safe characters. When you put a space, an ampersand, a question mark, or a non-English character into a URL, it can break — the browser may cut the link short or misread a parameter.

**URL encoding** (also called percent-encoding) solves this by replacing unsafe characters with a percent sign and a two-digit code.

## What URL Encoding Does

Encoding converts each unsafe character into a safe equivalent:

| Character | Encoded |
| --- | --- |
| space | %20 |
| & | %26 |
| / | %2F |
| ? | %3F |
| = | %3D |

So a search for "sales & marketing" becomes \`sales%20%26%20marketing\`.

## URL Encoder vs URL Decoder

They are opposites:

- **Encoder** — takes readable text and makes it URL-safe. Use it when building a link or sending data in a query string.
- **Decoder** — takes an encoded URL and turns it back into readable text. Use it when a link looks like %20%26%20 and you want to see what it says.

Do it either way with the [URL Encoder](/tools/url-encoder) and [URL Decoder](/tools/url-decoder).

## When You Need Each

Encode when:

- Passing a search term or user input into a query string
- Embedding a URL inside another URL
- Handling spaces or non-English characters in a link

Decode when:

- Debugging a link full of % codes
- Reading the true value of a parameter
- Checking what a redirect actually points to

## Encoding Is Not Encryption

This trips people up. Percent-encoding is **formatting**, not security. Anyone can decode it instantly. Never hide secrets in a URL expecting them to stay secret.

That is also why you should not confuse it with **Base64**, which is a different encoding for data, not URLs. Try the [Base64 Encoder](/tools/base64-encoder) and [Base64 Decoder](/tools/base64-decoder) to compare.

## FAQ

### What is the difference between URL encoding and decoding?
Encoding makes text URL-safe by replacing special characters; decoding reverses it back to readable text.

### Is URL encoding the same as Base64?
No. URL encoding is percent-encoding for link safety. Base64 encodes binary data into text.

### Does encoding secure my data?
No. It is reversible by anyone. Use HTTPS and proper auth for real security.

### Will spaces always become %20?
Yes, and a space in a query string is sometimes shown as +, which is the form-encoding equivalent.

Fix broken links and read encoded URLs instantly with the free [URL Encoder](/tools/url-encoder) and [URL Decoder](/tools/url-decoder).`,
    seoTitle: "URL Encoder vs URL Decoder: Handle Special Characters Free",
    seoDescription:
      "Learn the difference between URL encoding and decoding, when to use each, and how to fix links with special characters using free online tools.",
    status: "PUBLISHED" as const,
  },
];

async function main() {
  for (const post of posts) {
    let category = await prisma.blogCategory.findUnique({ where: { slug: post.categorySlug } });
    if (!category) {
      category = await prisma.blogCategory.create({ data: { name: post.categoryName, slug: post.categorySlug } });
    }

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
        categoryId: category.id,
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
        categoryId: category.id,
      },
    });
    console.log(`Upserted: ${post.title}`);
  }

  const total = await prisma.blogPost.count();
  const pub = await prisma.blogPost.count({ where: { status: "PUBLISHED" } });
  console.log(`Total blog posts: ${total} | published: ${pub}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
