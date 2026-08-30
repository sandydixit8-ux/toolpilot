import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const SITE = "https://www.toolpilotpro.in";

interface PostSeed {
  title: string;
  slug: string;
  categoryName: string;
  categorySlug: string;
  excerpt: string;
  seoTitle: string;
  seoDescription: string;
  content: string;
}

const posts: PostSeed[] = [
  {
    title: "Income Tax Calculator FY 2025-26: Old vs New Regime – Which One Saves You More?",
    slug: "income-tax-calculator-fy-2025-26-old-vs-new-regime",
    categoryName: "Money & Finance",
    categorySlug: "money",
    excerpt:
      "Every salaried employee asks the same question at the start of the year – old regime or new regime? Here is how to compare them and the fastest way to find your tax.",
    seoTitle: "Income Tax Calculator FY 2025-26: Old vs New Regime Guide",
    seoDescription:
      "Old or new tax regime for FY 2025-26? Learn how tax slabs, standard deduction, and rebates differ, and use our free income tax calculator to compare.",
    content: `Choosing between the old and new income tax regime is one of the most common money decisions for Indian salaried employees. The right choice can save you thousands of rupees every year.

## How the two regimes differ

The **new regime**, which is now the default, offers lower slab rates and a higher standard deduction, but removes most deductions like Section 80C, 80D, and HRA. The **old regime** keeps those deductions but taxes you at higher slab rates above the first ₹5,00,000.

For FY 2025-26 the new regime tax slabs start at 0% up to ₹4,00,000 and rise to 30% above ₹24,00,000. There is also a rebate under Section 87A that makes tax nil for taxable income up to ₹12,00,000 in the new regime.

## Why guessing is expensive

Most people choose a regime based on their friends or their HR team. But the correct answer depends on your own income, rent, home loan interest, insurance premium, and investments. Because deductions only work in the old regime, employees with large Section 80C and HRA claims often save more there — while everyone else usually wins with the new regime.

## Use a calculator, not a guess

The fastest way to compare is to run your numbers through both regimes.

> Enter your income once and our free [Income Tax Calculator (FY 2025-26)](/tools/income-tax-calculator) shows your tax under both regimes and tells you which one saves more.

If you also want your exact monthly take-home after PF, professional tax, and income tax, pair it with the [Salary Calculator](/tools/salary-calculator) to see the full breakdown of your CTC.

## A quick rule of thumb

- If you claim 80C, 80D, or HRA deductions, always check the old regime.
- If you have few deductions, the new regime is usually cheaper.
- Recheck every year — your income and loans change.

Knowing your tax before the year starts means you can plan investments early instead of selling investments at the last minute. Start with the calculator, then confirm with a tax professional if your situation is complex.`,
  },
  {
    title: "How to Calculate Your Home Loan EMI Before You Apply",
    slug: "how-to-calculate-home-loan-emi",
    categoryName: "Money & Finance",
    categorySlug: "money",
    excerpt:
      "Your EMI decides your monthly budget for the next 10–25 years. Here is how EMI works, why amortization matters, and how to compare lenders in minutes.",
    seoTitle: "Home Loan EMI Calculator: How EMI and Amortization Work",
    seoDescription:
      "Learn how home loan EMI is calculated, what an amortization schedule shows, and how to compare lenders and tenures with a free EMI calculator.",
    content: `A home loan is likely the biggest monthly commitment you will ever make. Before you sign anything, you should know your exact EMI and how much of it goes toward interest.

## What is EMI?

EMI stands for **Equated Monthly Installment** — a fixed amount you pay every month until the loan is repaid. Every EMI has two parts: a portion of the **principal** (the amount you borrowed) and the **interest** charged on the remaining balance.

## The formula behind it

EMI is calculated from three inputs: the loan amount, the interest rate, and the tenure.

> EMI = P x r x (1 + r)^n divided by ((1 + r)^n – 1)

where P is the principal, r is the monthly interest rate, and n is the tenure in months. You do not need to remember this — a free tool does it in a second.

## Why the amortization schedule matters

Early EMIs are mostly interest; later EMIs are mostly principal. An amortization schedule shows this month by month, so you can see exactly how much you will pay in total interest over the whole loan. This is the number most people never check before buying a house.

## Compare before you decide

A difference of just 0.25% on a 20-year loan can change your total interest by lakhs of rupees. That is why you should compare the same loan amount and tenure across banks and housing finance companies.

> Use the free [EMI Calculator](/tools/emi-calculator) to check your monthly installment and full amortization table instantly.

If your salary situation changes and you want to find your current in-hand income after tax, the [Salary Calculator](/tools/salary-calculator) gives you a clear monthly breakdown.

## A few practical tips

- Keep total EMIs under about 40% of your monthly income.
- A longer tenure lowers the EMI but increases total interest.
- A shorter tenure increases the EMI but saves interest.
- Part-prepayment anywhere you can, it reduces the principal faster.

Calculate before you negotiate, not after. A few minutes with a calculator can save you years of unnecessary interest.`,
  },
  {
    title: "GST Calculator India: How CGST, SGST, and IGST Work",
    slug: "gst-calculator-india-cgst-sgst-igst",
    categoryName: "Money & Finance",
    categorySlug: "money",
    excerpt:
      "GST is split into CGST, SGST, or IGST depending on whether a sale happens within a state or between states. Here is how to get the math right.",
    seoTitle: "GST Calculator: Understanding CGST, SGST, and IGST in India",
    seoDescription:
      "What is GST and how do CGST, SGST, and IGST work? Learn the GST rates in India and use our free GST calculator for forward and reverse calculation.",
    content: `Goods and Services Tax (GST) replaced a web of older indirect taxes in India. For shopkeepers, freelancers, and small businesses, getting the GST amount right on every invoice is essential.

## The three parts of GST

GST is split depending on where the transaction happens:

- **CGST** — Central GST, goes to the central government.
- **SGST** — State GST, goes to the state government.
- **IGST** — Integrated GST, applies to inter-state sales and imports.

An intra-state sale of ₹10,000 at 18% GST splits into 9% CGST + 9% SGST. The same sale between two states attracts 18% IGST instead.

## The GST rates in India

Most goods and services fall into one of four slabs: **5%, 12%, 18%, or 28%**. Some essentials are fully exempt at 0%. Knowing which rate applies matters because it changes what you charge your customer.

## Forward and reverse calculation

Two calculations are used every day:

1. **Forward** – adding GST to a base price to find the invoice total.
2. **Reverse** – removing the GST already included in a bill to find the actual price before tax.

Both are common when negotiating prices or auditing old invoices.

> Our free [GST Calculator](/tools/gst-calculator) does forward and reverse GST instantly, auto-splits CGST + SGST, and supports all Indian rates.

## Where this shows up daily

Freelancers add GST on invoices for Indian clients, shopkeepers verify prices after a rate change, and students solve GST problems for exams. In every case, small math mistakes cost money.

Get the calculation right with a tool, keep your records clean, and you will never overcharge your customers or under-report your tax again.`,
  },
  {
    title: "How to Pass ATS Screening: 7 Resume Tips That Actually Work",
    slug: "how-to-pass-ats-screening-resume-tips",
    categoryName: "Career",
    categorySlug: "career",
    excerpt:
      "Most resumes are rejected by software, not by people. Here are the exact changes that help your resume get past ATS filters and into human hands.",
    seoTitle: "ATS Resume Checker: How to Pass ATS Screening in 2026",
    seoDescription:
      "Applicant Tracking Systems filter out most resumes before a human sees them. Learn how to structure an ATS-friendly resume and check your score for free.",
    content: `When you apply for a job online, your resume is often read by an **Applicant Tracking System (ATS)** before any human sees it. The ATS scans for relevant keywords, clean formatting, and standard sections. If it cannot read your resume, it rejects it automatically.

## Why most resumes fail ATS

The biggest reasons are:

- **Fancy formatting** – tables, text boxes, and graphics that the parser cannot read.
- **Missing keywords** – your resume does not include the exact skills and titles in the job description.
- **Unusual section names** – the ATS cannot find "Work History" because it was renamed.
- **Scanning issues** – photos and decorative headers break text extraction.

## Seven fixes that help

- 1. Use a standard, single-column layout.
- 2. Save your final file as a clean, machine-readable PDF.
- 3. Put the job title, skills, and key terms from the job description in your resume.
- 4. Name sections clearly: Summary, Skills, Experience, Education.
- 5. Use standard job titles instead of creative ones.
- 6. Skip graphics, tables, and columns.
- 7. Quantify achievements with numbers wherever you can.

## Check your score before you apply

Uploading your resume into a free checker is the fastest way to catch these problems.

> Our free [Resume ATS Checker](/tools/resume-ats-checker) scores your resume against the job description and points out what to fix. Pair it with the [Resume Builder](/tools/resume-builder) to rebuild your resume with an ATS-friendly structure in minutes.

## One more thing

ATS scores are a screen, not the final word. A resume that scores well still needs real achievements and clear, specific results. Fix the technical issues first, then invest time in making each bullet point stronger.

Apply smart, apply fast, and let a checked resume do the talking.`,
  },
  {
    title: "Notice Period and Experience: How to Calculate Both Correctly",
    slug: "how-to-calculate-notice-period-and-experience",
    categoryName: "Career",
    categorySlug: "career",
    excerpt:
      "Getting your notice period and total experience wrong can cost you interviews. Here is the simple, correct way to calculate both.",
    seoTitle: "Notice Period & Experience Calculator: The Complete Guide",
    seoDescription:
      "How notice period affects your next job, and how to calculate total work experience correctly for resumes and interviews. Use our free calculators.",
    content: `When you resign from a job, two numbers decide a lot: your **notice period** and your **total experience**. Getting either wrong in an interview can filter you out.

## What is a notice period?

The notice period is the time you must work after resigning before your current employer releases you. In India this is usually **30, 45, 60, or 90 days**, depending on your company and role.

Your joining date at the next job depends on the notice period, buyout options, and how fast the current employer relieves you.

## How to calculate it

- Note the date you submitted your resignation.
- Add the notice period in days to find your earliest release date.
- Factor in weekends, holidays, and any pending leaves the company wants you to clear.

> Use the [Notice Period Calculator](/tools/notice-period-calculator) to get your possible release and joining dates without manually counting days.

## Total experience: the number recruiters check

Recruiters compare the number on your resume to what they verify through your offers and relieving letters. Small rounding differences are common, but a resume that says **6 years** and a background check that shows **5 years 8 months** raises questions.

## Calculate it the right way

- 1. Count from your first day of employment to the current date.
- 2. Use exact dates, not months of the year.
- 3. Combine all tenures if you switched jobs.
- 4. Express it as years and months (for example, 5 years 8 months).

> Our [Experience Calculator](/tools/experience-calculator) does the exact math for any date range in seconds.

## Why it matters for your next offer

Your experience level determines the roles you can apply for, the salary band conversation, and sometimes even the interview stages you skip. Keep the number accurate, keep it easy to verify, and you remove one more reason for a recruiter to move on.

Start with a fact-check of your own resume today, using the two tools above, before your next application.`,
  },
  {
    title: "Compress and Resize Images for WhatsApp in Seconds",
    slug: "compress-resize-images-for-whatsapp",
    categoryName: "Productivity",
    categorySlug: "productivity",
    excerpt:
      "Sending heavy images, especially videos and photos from phone cameras, is painful. Here is how to compress and resize pictures quickly without installing an app.",
    seoTitle: "How to Compress and Resize Images for WhatsApp",
    seoDescription:
      "Send photos on WhatsApp without quality loss. Learn how to compress and resize images in your browser with free tools, including passport-size cropping tips.",
    content: `A single photo from a modern phone camera can be 5 MB or more. Forward a few of those on WhatsApp and the app slows down, the recipient runs out of storage, and the file sometimes refuses to send.

## Why file size matters

- **Storage** – photos eat up phone and cloud storage quickly.
- **Sharing** – large files are slower to upload and download.
- **Websites** – heavy images slow down page loading and affect SEO.

## The right tool for the job

Two quick fixes solve most image problems:

1. **Compress** to reduce file size while keeping visible quality.
2. **Resize** to change width and height, for example to a WhatsApp-friendly 1280px width.

> Our [Image Compressor](/tools/image-compressor) shrinks JPG, PNG, and WebP images in your browser with a live before-and-after preview. Use the [Image Resizer](/tools/image-resizer) when you need exact dimensions.

## Compress or resize first?

- If you only need a smaller file, **compress**.
- If the image will go on a website or needs specific dimensions, **resize**.
- For profile pictures and passport photos, **crop** to a square or the exact required ratio.

## Keeping quality while shrinking

The biggest mistake people make is dropping quality too low. A good balance for WhatsApp photos is quality around **70–80%** — small file, still sharp on a phone screen. You should never notice the difference when you look at the photo normally.

## For passport photos and documents

Government forms and visa applications often need specific pixel sizes. Cropping to the exact ratio first, then resizing, keeps the photo readable inside the form.

Fix your workflow today: compress once, share everywhere, and stop fighting with "file too large" errors.

Try the [Image Quality Optimizer](/tools/image-quality-optimizer) when you need to balance size and clarity.`,
  },
];

async function main() {
  const catMap = new Map<string, string>();
  for (const post of posts) {
    let category = await prisma.blogCategory.findUnique({ where: { slug: post.categorySlug } });
    if (!category) {
      category = await prisma.blogCategory.create({ data: { name: post.categoryName, slug: post.categorySlug } });
    }
    catMap.set(post.slug, category.id);

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
    console.log(`OK  ${post.slug}`);
  }
  console.log(`Done. ${posts.length} posts seeded under ${SITE}/blog`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });