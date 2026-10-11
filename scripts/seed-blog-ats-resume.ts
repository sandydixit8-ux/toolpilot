import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const posts = [
  {
    title: "What Is an ATS Resume? How to Get a 90%+ ATS Score in 2026",
    slug: "ats-resume-guide-2026",
    excerpt:
      "An ATS screens your resume before a recruiter ever sees it. Learn how the scan works, why resumes fail, and how to score 90%+ for free.",
    categorySlug: "career",
    categoryName: "Career Tools",
    content: `## What Is an ATS Resume and Why Recruiters Use It

An **ATS (Applicant Tracking System)** is the software companies use to screen resumes before a human even looks at them. It scans your resume for keywords, sections, and formatting, and it ranks candidates. In 2026, most mid-to-large companies in India and abroad rely on ATS — which means if your resume is not ATS-friendly, it may never reach a recruiter.

The good news? You can check your resume right now for free with the [Resume ATS Checker](/tools/resume-ats-checker) and see exactly where you stand before applying anywhere.

## How the ATS Scan Works

An ATS reads a resume like a robot, not like a person. It looks for three things:

- **Keywords** — the exact terms in the job description, like skills, tools, and certifications
- **Structure** — clear headings such as Experience, Education, and Skills
- **Clean formatting** — no tables, images, columns, or unusual fonts that break machine reading

Most candidates fail the ATS scan not because their experience is weak, but because their resume format is unreadable to the machine.

## 5 Reasons Your Resume Fails the ATS Scan

1. **No keywords from the job description** — the ATS could not match your resume to the role.
2. **Graphics and images** — logos, photo, or icons confuse the parser.
3. **Multi-column layouts** — the ATS reads top to bottom, left to right; columns scramble the order.
4. **Missing standard headings** — if the ATS cannot find "Work Experience," it may skip the entire section.
5. **Special characters and weird fonts** — bullets, boxes, and decorative fonts turn into gibberish.

## How to Improve Your ATS Score (Step by Step)

### Step 1: Check your current score

Paste your resume into the [Resume ATS Checker](/tools/resume-ats-checker). It scores sections like contact info, summary, experience, education, skills, and keyword match — usually in under a minute.

### Step 2: Add a professional summary

Recruiters and ATS both expect a 2-3 line summary at the top with your role and top skills. The [Resume Analyzer](/tools/resume-analyzer) will tell you if this section is missing.

### Step 3: Mirror the job description's keywords

Copy the job posting and run the [Resume JD Matcher](/tools/resume-jd-matcher). It shows exactly which keywords from the job are missing from your resume.

### Step 4: Use plain, clean formatting

Single column, standard headings, and simple fonts. No tables, no icons, no photos, no text boxes. If you are starting fresh, build a clean template and keep the sections standard.

## ATS Resume Checklist

| Section | What the ATS expects | Common mistake |
| --- | --- | --- |
| Contact info | Email, phone, LinkedIn at the top | Burying it in a sidebar |
| Summary | 2-3 lines with role + top skills | Skipping it entirely |
| Work experience | Job title, company, dates, bullets | Paragraphs instead of bullets |
| Education | Degree, institute, year | Using cramped tables |
| Skills | Same words as the job description | Creative synonyms |

## FAQ

### Does a photo hurt my ATS score?
Yes, in most cases. ATS parsers can struggle to read resumes that contain photos, icons, and graphics. Keep it text-only.

### What is a good ATS score?
Aim for 80% or higher. Scores of 70–79% mean your resume is readable but missing keywords. Below 40% usually means a formatting problem that needs fixing first.

### Is it better to apply via LinkedIn or the company portal?
Always apply on the company portal — that is where the ATS runs. You can still keep your LinkedIn profile updated, but the ATS scan happens on the ATS resume you submit.

## Try It Yourself

Your resume is your first interview. Before your next application, spend five minutes and check it:

- [Resume ATS Checker](/tools/resume-ats-checker) — get your ATS score instantly
- [Resume Analyzer](/tools/resume-analyzer) — deep score by section with priority fixes
- [Resume JD Matcher](/tools/resume-jd-matcher) — match your resume to a specific job description
- [Cover Letter Generator](/tools/cover-letter-generator) — pair a strong resume with a strong cover letter

All tools are free, private, and work right in your browser.`,
    seoTitle: "What Is an ATS Resume? How to Get a 90%+ ATS Score in 2026",
    seoDescription:
      "Learn what an ATS resume is, why recruiters use ATS software, and how to get a 90%+ ATS score with a free resume ATS checker.",
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
  console.log(`Total blog posts: ${total}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());