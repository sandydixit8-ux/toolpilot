import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const GUIDE_CAT = "cmt2ndqx70040uffsia1zwfkd";
const CAREER_CAT = "cmucgwsne0006uf70upmnzoaz";
const CALC_CAT = "cmucgwrw70003uf70m8rulsu7";

const T = "best-free-productivity-tools-small-business";
const C = "cover-letter-generator-guide";
const G = "how-to-calculate-gratuity-resignation-india";

const tContent = `Students, freelancers, and small businesses all fight the same daily battles: oversized PDFs, image-heavy websites, word limits, invoices, and grade math. The good news is that you do not need a paid subscription for any of it. This guide picks the free, browser-based tools that actually save time, grouped by task, and shows what each one is for.

## The Short Version

You do not need a hundred sites. Documents, images, money, and career - four groups cover almost every deadline:

- [PDF tools](/tools/pdf) for submissions, contracts, and proposals
- [Image tools](/tools/image) for presentations, portfolios, and websites
- [Calculators](/tools/calculators) for grades, money, and conversions
- [Career tools](/tools/career) for resumes and applications

Every tool below runs free in the browser, needs no signup, and works on a phone.

## Document Tools (PDF and Word)

| Task | Tool |
| --- | --- |
| Turn photos of notes into one PDF | [JPG to PDF](/tools/jpg-to-pdf) |
| Shrink a file to pass an email or portal limit | [PDF Compressor](/tools/pdf-compressor) |
| Edit a locked or scanned contract | [PDF to Word](/tools/pdf-to-word) |
| Send a final draft that cannot be edited | [Word to PDF](/tools/word-to-pdf) |
| Combine contracts or assignments into one file | [PDF Merger](/tools/pdf-merger) |
| Hit an exact page limit | [PDF Page Counter](/tools/pdf-page-counter) |

Email systems and university portals routinely reject files over 5 or 10MB. The compressor cuts size while keeping text sharp, so a submission never bounces at the last minute. For assignments, [JPG to PDF](/tools/jpg-to-pdf) merges ten separate photos into one ordered file - handy for scanned notes, lab records, and handwritten certificates.

## Image Tools

- [Image Compressor](/tools/image-compressor) - shrink photos by 60 to 80 percent without visible quality loss, which speeds up a portfolio or shop website.
- [Image Resizer](/tools/image-resizer) - make exact-size images for a college site, journal, or social profile.

Faster pages also keep readers and customers from bouncing, so this is one of the quickest wins available for free.

## Money and Grade Calculators

| Task | Tool |
| --- | --- |
| Marks to percentage | [Percentage Calculator](/tools/percentage-calculator) |
| CGPA to percentage for Indian boards | [CGPA to Percentage](/tools/cgpa-to-percentage) |
| 4-point GPA to percentage | [GPA to Percentage](/tools/gpa-to-percentage) |
| Check attendance before a cutoff | [Attendance Calculator](/tools/attendance-calculator) |
| Measure length, weight, temperature | [Unit Converter](/tools/unit-converter) |
| Work out GST on invoices | [GST Calculator](/tools/gst-calculator) |
| Estimate monthly cash flow | [Invoice Generator](/tools/invoice-generator) |

Grade calculators matter more than they look: many admissions and government jobs need 60 percent or 75 percent minimums, and a attendance shortfall can block an exam. Run the numbers early rather than guessing.

## Career Tools

- [Resume Builder](/tools/resume-builder) - a clean, professional resume in minutes, with no design skills needed.
- [Resume ATS Checker](/tools/resume-ats-checker) - scores how well tracking systems can parse your resume before you apply.
- [Resume JD Matcher](/tools/resume-jd-matcher) - compares your resume against a specific job description.
- [Cover Letter Generator](/tools/cover-letter-generator) - drafts a short, tailored letter to go with the resume.

The ATS checker is the sleeper tool here. Many applications are rejected by software before a human ever sees them, and formatting the resume wrong is the usual cause.

## Writing and Study Helpers

- [Word Counter](/tools/word-counter) and [Character Counter](/tools/character-counter) keep essays and captions inside their limits.
- [AI Text Summarizer](/tools/ai-text-summarizer) condenses long chapters into revision notes.
- [AI Paraphraser](/tools/ai-paraphraser) rewords a draft - remember to keep your own voice and cite sources.
- [JSON Formatter](/tools/json-formatter) and [Base64 Encoder](/tools/base64-encoder) handle the developer tasks that appear in freelance work more often than people expect.
- [Password Generator](/tools/password-generator) makes a strong, unique password for every account - use one per site.
- [QR Code Generator](/tools/qr-code-generator) puts a menu, Wi-Fi password, or payment link on any printed surface.

## What This Replaces

A rough sense of what free tools can save per month, versus common paid equivalents:

| Paid habit | Typical monthly cost | Free alternative |
| --- | --- | --- |
| PDF editing suite | Rs 1,500 | [PDF to Word](/tools/pdf-to-word) |
| Design subscription for images | Rs 500 | Image tools |
| Writing assistant for counts and edits | Rs 1,000 | Word and character counters |
| Invoicing software | Rs 800 | [Invoice Generator](/tools/invoice-generator) |

Individual figures vary, but the pattern holds: most one-off document and math tasks do not need a subscription.

## Frequently Asked Questions

- **Are these tools actually free?** Yes - free, no signup, no watermarks, and no trial timers.
- **Do I need an account?** No. Every tool works instantly without registration.
- **Will my files be uploaded to a server?** Browser-based tools such as image and PDF compression process everything locally on your device.
- **Can I use them on my phone?** Yes - all tools are responsive and work on phones, tablets, and desktops.
- **Are the grade calculators accurate?** They apply the standard formulas to the numbers you enter, so results are exact for those inputs. Always confirm board-specific CGPA multipliers against your own board's table.

Bookmark this page and keep the four category links handy - [PDF](/tools/pdf), [Image](/tools/image), [Calculators](/tools/calculators), and [Career](/tools/career) - and you will rarely need another site.`;

const cContent = `Recruiters spend seconds, not minutes, on cover letters, and a generic one gets ignored. A short, specific letter that names the company, connects one skill to their problem, and closes with confidence is what moves you up the pile. This guide gives you a four-paragraph formula you can reuse, the mistakes that get letters skipped, and a free generator that drafts the skeleton in under a minute.

## The Four-Paragraph Formula

| Paragraph | What it does | Length |
| --- | --- | --- |
| 1. Hook | The job, the company, and one line on why you fit | 2 to 3 lines |
| 2. Match | Your top skill plus a specific result relevant to the role | 3 to 4 lines |
| 3. Proof | A concrete achievement or number that backs paragraph 2 | 2 to 3 lines |
| 4. Close | Confidence and a call to action, such as "I would love to discuss how..." | 2 lines |

The whole letter should fit on **one page**, ideally under 300 words. Two to three paragraphs is fine when the hook and proof carry the weight.

## How to Use the Cover Letter Generator

1. Open the [Cover Letter Generator](/tools/cover-letter-generator).
2. Enter your name, role, and two or three key achievements.
3. Choose a tone - professional, warm, or enthusiastic.
4. Generate and copy the letter.
5. Edit it: swap in the actual company name and their real needs.

The generator produces several options you can edit, so treat the output as a strong first draft rather than a finished letter.

## Specific Beats Generic, Every Time

Compare these two sentences:

> "At my last role I cut invoice processing time by 40 percent using Tally automation."

vs.

> "I am a hardworking and dedicated team player."

Every line of a good letter names **the company**, **the job**, or **a number**. That is the whole test. Vague claims about personality are what recruiters skim past.

## What Gets a Letter Skipped

- Long paragraphs about your childhood interest in the field
- "As you can see from my attached resume..."
- Repeating your resume bullet points line by line
- Spelling the **company name wrong** - an instant reject
- "To Whom It May Concern" when the recruiter's name is ten seconds away on LinkedIn

## Customise Before You Send

- Replace the company name with the actual hiring company.
- Mention one specific achievement from this company's industry.
- Delete any sentence that does not add value - shorter is stronger.
- Run the final letter through the [Resume ATS Checker](/tools/resume-ats-checker) if the employer's system scans attachments.

## Cover Letter vs Resume: Do Not Repeat

A **resume** lists what you have done. A **cover letter** explains why it matters for this role. Never paste resume bullets into the letter; tell the story behind one or two of them instead.

| | Resume summary | Cover letter |
| --- | --- | --- |
| Where | Top of the resume | Separate email or document |
| Purpose | Hook the scanner | Make the case in prose |
| Format | 2 to 3 lines | 3 to 4 paragraphs |
| Best tool | [Resume Builder](/tools/resume-builder) | [Cover Letter Generator](/tools/cover-letter-generator) |

## Frequently Asked Questions

- **Is a cover letter always required?** Many portals do not require one, but a short tailored letter still helps for marketing, design, consulting, and campus placements. Skip it only if the job posting says not to send one.
- **How long should a cover letter be?** Under 300 words, one page maximum, three to four paragraphs.
- **Can I reuse one cover letter?** As a base, yes - but change the company name, the role, and one proof point per application.
- **Is the generator free?** Yes. The [Cover Letter Generator](/tools/cover-letter-generator) is free, needs no signup, and runs in your browser.

Draft a letter that earns an interview - use the free [Cover Letter Generator](/tools/cover-letter-generator).`;

const gContent = `Leaving a job raises two money questions at once: how much gratuity you are owed, and how much provident fund you have accumulated. Both are formula-driven, both are often miscalculated by employees, and both belong in the same conversation because they arrive together in your full and final settlement. This guide covers both, with the exact formulas and worked examples, using the free [Gratuity Calculator](/tools/gratuity-calculator) and [EPF Interest Calculator](/tools/epf-interest-calculator).

## Gratuity: What You Are Owed for Long Service

Gratuity is a lump-sum payment your employer gives you for long service, governed in India by the Payment of Gratuity Act, 1972. It applies to employees who complete at least **5 continuous years** with an organisation.

### The Gratuity Formula

> Gratuity = (Last drawn basic + DA) x 15 x Years of service / 26

The **15** represents 15 days of salary per completed year, and **26** is the number of working days used in the calculation - not 30.

### A Worked Example

If your last drawn basic plus DA is Rs 30,000 and you served 12 years:

> 30,000 x 15 x 12 / 26 = **Rs 2,07,692**

### When Is Gratuity Paid?

- **Retirement** - on completing your service with the employer.
- **Resignation** - after 5 or more continuous years.
- **Termination** - payable for years served, subject to the 5-year rule.
- **Death or disability** - payable immediately, even before 5 years.

The 5-year condition is waived for death or disability, so families receive the amount regardless of service length. Some companies also pay gratuity before 5 years as a policy benefit - check your appointment letter and handbook.

### Tax and Salary Breakup

Up to **Rs 20 lakh** of gratuity is tax-exempt under Section 10(10). Also check whether gratuity appears in your salary breakup: if your CTC includes it, it is usually about **4.81 percent** of basic per year.

Run your numbers through the [Gratuity Calculator](/tools/gratuity-calculator) with your last basic plus DA and completed years of service.

## EPF: How Your Provident Fund Actually Grows

Your Employee Provident Fund earns interest on both your contribution and the interest already credited, so the balance compounds rather than just the monthly deposit. The rate is announced yearly by the EPFO - around 8.25 percent for FY 2025-26 - and credited towards the end of the financial year.

### The Contribution Split

| Component | Contribution |
| --- | --- |
| Employee (your salary) | 12 percent of basic + DA |
| Employer - EPF | 3.67 percent of basic + DA |
| Employer - EPS | 8.33 percent of basic + DA (capped) |

The 8.33 percent EPS portion goes to a separate pension scheme; only the EPF portion earns provident fund interest.

### How the Interest Maths Works

- Interest is calculated **monthly** on the running balance, though it is only **credited yearly**.
- The year's interest is added to your accumulated balance when the EPFO publishes final figures.
- Because the principal grows year after year, your interest itself earns interest - the compounding that makes EPF powerful over a career.

### Projecting Your Balance

Use the [EPF Interest Calculator](/tools/epf-interest-calculator) with your current age, retirement age, current EPF balance, basic plus DA, and an estimated rate of 8 to 8.25 percent. It returns your expected maturity amount, your contribution, the employer's contribution, and total interest earned.

EPF is strong because the compounding is effortless, the returns are fixed by the government rather than the market, and interest on employee contributions up to Rs 2.5 lakh a year is tax-free.

## Putting the Settlement Together

Your full and final settlement is gratuity plus EPF plus any pending leave encashment, minus advances. To keep the timeline honest while you plan:

- Check your exact service period with the [Experience Calculator](/tools/experience-calculator).
- Confirm your notice period and last working day with the [Notice Period Calculator](/tools/notice-period-calculator).
- Compare the exit package against your current pay with the [Salary Calculator](/tools/salary-calculator).

## Frequently Asked Questions

- **Is gratuity taxable?** Up to Rs 20 lakh is tax-exempt under Section 10(10). The calculator shows the gross amount.
- **What if I resign before 5 years?** Gratuity is generally not payable on normal resignation under 5 years, except for death or disability. Some company policies are more generous - check your appointment letter.
- **When is EPF interest credited?** Roughly mid-way through the next financial year, though it accrues monthly on the balance.
- **Can I withdraw EPF early?** Partial withdrawals are allowed for housing, marriage, medical, and education under EPFO rules.
- **Are these calculators free?** Yes - both the gratuity and EPF calculators are free, need no signup, and run in your browser.

Know exactly what you are owed - calculate it with the free [Gratuity Calculator](/tools/gratuity-calculator) and [EPF Interest Calculator](/tools/epf-interest-calculator).`;

type Pillar = {
  slug: string;
  title: string;
  seoTitle: string;
  seoDescription: string;
  excerpt: string;
  content: string;
  categoryId: string;
  faqs: { question: string; answer: string }[];
};

const pillars: Pillar[] = [
  {
    slug: T,
    title: "Free Online Tools for Students, Freelancers and Small Business (2026)",
    seoTitle: "Free Online Tools for Students, Freelancers & Small Business",
    seoDescription:
      "The best free online tools for students, freelancers and small businesses: PDF, image, career, calculator and developer tools that replace paid software - no signup.",
    excerpt:
      "A curated set of free, browser-based tools for students, freelancers and small businesses - PDF, images, careers, money and developer tasks - grouped by what you actually need to do.",
    content: tContent,
    categoryId: GUIDE_CAT,
    faqs: [
      {
        question: "Are these tools actually free?",
        answer:
          "Yes - every tool listed is free, with no signup, no watermarks, and no trial timers.",
      },
      {
        question: "Do I need to create an account?",
        answer:
          "No. Every tool works instantly without registration, and the browser-based ones process your data locally on your device.",
      },
      {
        question: "Can I use these tools on my phone?",
        answer:
          "Yes - all tools are responsive and work on phones, tablets, and desktops.",
      },
      {
        question: "Which tools help most with assignments?",
        answer:
          "JPG to PDF for submitting scanned notes, PDF Compressor to pass email and portal size limits, and the word and character counters to hit exact limits.",
      },
      {
        question: "Which tools help a small business most?",
        answer:
          "The Invoice Generator and GST Calculator for billing, the Image Compressor for a faster website, the PDF tools for contracts, and the QR Code Generator for menus and payment links.",
      },
      {
        question: "Are the grade calculators accurate?",
        answer:
          "They apply the standard formulas to the numbers you enter, so results are exact for those inputs. Confirm board-specific CGPA multipliers against your own board's table.",
      },
    ],
  },
  {
    slug: C,
    title: "Cover Letter Generator: Write a Winning Cover Letter in Minutes",
    seoTitle: "Cover Letter Generator: Write a Winning Cover Letter in Minutes",
    seoDescription:
      "Learn the four-paragraph cover letter formula recruiters read, the mistakes that get letters skipped, and how to draft a tailored letter in minutes with a free generator.",
    excerpt:
      "The four-paragraph cover letter formula that gets read, what recruiters skip, specific vs generic wording, and a free generator that drafts a tailored letter in minutes.",
    content: cContent,
    categoryId: CAREER_CAT,
    faqs: [
      {
        question: "Is a cover letter always required?",
        answer:
          "Many portals do not require one, but a short tailored letter helps for marketing, design, consulting, and campus placements. Skip it only if the posting says not to send one.",
      },
      {
        question: "How long should a cover letter be?",
        answer:
          "Under 300 words, one page maximum, three to four paragraphs.",
      },
      {
        question: "Can I reuse one cover letter for every job?",
        answer:
          "As a base, yes - but change the company name, the role, and one proof point per application. A letter that reads as generic is the main reason they get ignored.",
      },
      {
        question: "Should I include my full resume in the letter?",
        answer:
          "No. The resume lists what you have done; the letter explains why it matters for this specific role. Do not repeat the resume bullet points.",
      },
      {
        question: "Is the cover letter generator free?",
        answer:
          "Yes. It is free, needs no signup, and runs in your browser, producing several options you can edit.",
      },
      {
        question: "What is the fastest way to personalise a generated letter?",
        answer:
          "Replace the company name, add one specific achievement from their industry, and cut any sentence that adds no value. Shorter and specific beats longer and vague.",
      },
    ],
  },
  {
    slug: G,
    title: "Gratuity and PF: How to Calculate Your Full and Final Settlement",
    seoTitle: "Gratuity and PF Calculation: Full and Final Settlement on Resignation",
    seoDescription:
      "Calculate your gratuity with the 15/26 formula, understand the 5-year rule and tax exemption, and see how EPF compounds - plus free calculators for both.",
    excerpt:
      "How gratuity and EPF are calculated on resignation or retirement: the exact formulas, worked examples, the 5-year rule, tax exemption, and free calculators for both.",
    content: gContent,
    categoryId: CALC_CAT,
    faqs: [
      {
        question: "How is gratuity calculated?",
        answer:
          "Gratuity = (Last drawn basic + DA) x 15 x Years of service / 26. The 15 represents 15 days of salary per completed year, and 26 is the working-day divisor.",
      },
      {
        question: "Is gratuity taxable?",
        answer:
          "Up to Rs 20 lakh is tax-exempt under Section 10(10) of the Income Tax Act. The calculator shows the gross amount.",
      },
      {
        question: "Do I get gratuity if I resign before 5 years?",
        answer:
          "Generally no, under the normal 5-year rule - except in cases of death or disability, where it is payable regardless of service length. Some company policies are more generous.",
      },
      {
        question: "How is EPF interest calculated?",
        answer:
          "Interest accrues monthly on your running balance and is credited yearly by the EPFO at the announced rate, around 8.25 percent for FY 2025-26. Because the balance grows, the interest itself earns interest.",
      },
      {
        question: "What does my employer contribute to EPF?",
        answer:
          "About 12 percent of basic plus DA in total: 3.67 percent to EPF and 8.33 percent to the separate EPS pension scheme. Only the EPF portion earns provident fund interest.",
      },
      {
        question: "What else belongs in my full and final settlement?",
        answer:
          "Gratuity plus EPF plus any pending leave encashment, minus any advances. Check your service period and notice period with the experience and notice period calculators.",
      },
    ],
  },
];

const ARCHIVE: { slug: string; to: string }[] = [
  { slug: "best-free-online-tools-for-students", to: T },
  { slug: "best-free-productivity-tools-freelancers", to: T },
  { slug: "how-to-write-cover-letter-with-ai", to: C },
  { slug: "how-epf-interest-calculated-india", to: G },
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
        categoryId: p.categoryId,
        publishedAt: existing.publishedAt ?? new Date("2026-09-21T09:53:54.585Z"),
      },
    });
    await prisma.fAQ.deleteMany({ where: { blogPostId: existing.id } });
    await prisma.fAQ.createMany({
      data: p.faqs.map((f, i) => ({ question: f.question, answer: f.answer, blogPostId: existing.id, order: i })),
    });
    console.log("UPDATED pillar:", p.slug, "| words:", p.content.split(/\s+/).length, "| faqs:", p.faqs.length);
  }

  for (const a of ARCHIVE) {
    const r = await prisma.blogPost.updateMany({ where: { slug: a.slug }, data: { status: "ARCHIVED" } });
    console.log("ARCHIVED:", a.slug, "->", a.to, "| rows:", r.count);
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
