import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const CAREER_CAT = "cmucgwsne0006uf70upmnzoaz";

const R1 = "ats-resume-guide-2026";
const R2 = "resume-builder-create-professional-resume";

const r1Content = `If you have applied for jobs online and heard nothing back, an Applicant Tracking System is the most likely reason. Most mid-size and large companies run every application through software that reads, scores, and ranks resumes before a recruiter ever opens one. This guide explains exactly how that screening works and the rules that get your resume in front of a human. You can check where you stand right now with the free [Resume ATS Checker](/tools/resume-ats-checker).

## What Is an ATS and Why It Matters

An Applicant Tracking System (ATS) is the software companies use to collect and filter applications. Common systems include Taleo, Workday, Greenhouse, Lever, and iCIMS. When you submit a resume, the ATS parses it into structured fields, compares them against the job description, and ranks you against the other applicants.

The important part: a human usually sees only the resumes that survive that ranking. If your resume is unreadable to the software, or missing the words the job asks for, it can be filtered out even when you are the perfect fit. In 2026, the majority of Indian MNCs, IT firms, banks, and staffing agencies rely on an ATS for high-volume roles.

## What an ATS Actually Does

An ATS is not judging your talent. It is doing two mechanical jobs:

- **Parsing.** It reads your file and tries to identify your name, contact details, job titles, employers, dates, education, and skills.
- **Matching.** It compares those fields with what the job description asks for, usually by keyword and section.

Two qualities decide the outcome: **parsability** (can the software read your resume correctly) and **relevance** (does your resume contain the skills and phrases the role requires).

## Why Resumes Get Rejected

Most rejections come from formatting, not from experience. The usual culprits:

| Problem | What happens |
| --- | --- |
| Multi-column layouts and tables | Text gets scrambled or dropped |
| Photographs, logos, icons | The parser reads them as noise |
| Creative section names like "My Journey" | The ATS cannot find the Experience section |
| Content in headers and footers | Often ignored entirely |
| Missing keywords from the job description | Low relevance score |
| Resume saved as an image or from design software | Text is not extractable |

## The Seven Rules of an ATS-Friendly Resume

1. **Use one single-column layout.** No tables, columns, or text boxes.
2. **Choose a standard font.** Arial, Calibri, or Times New Roman, 10-12 point.
3. **Use standard section headings.** Work Experience, Education, Skills, Certifications, Summary.
4. **Match keywords from the job description.** If the ad says React and SQL, use those exact words.
5. **Keep dates simple and consistent.** For example May 2022 - Jun 2024, the same format everywhere.
6. **Avoid graphics and photos.** They carry no machine-readable information.
7. **Save as a text-based PDF**, not a scanned image. Use .docx when a portal asks for Word.

## Keywords Are the Real Scoreboard

An ATS rewards the words from the job description. To score well:

- **Copy the job title exactly** as written, not a fancier version of it.
- **Mirror the skills verbatim.** If the ad says "GST filing and Tally", those exact words must appear, not "tax software experience".
- **Repeat naturally.** Include each key skill in your summary, your skills list, and at least one experience bullet.
- **Spell the full form and the acronym once.** Write "Search Engine Optimization (SEO)" so both forms match.

## What a Good ATS Score Looks Like

A checker converts all of this into a percentage. As a rule of thumb:

| Score | Meaning |
| --- | --- |
| 90-100% | Excellent. Very likely to pass screening |
| 75-89% | Good. Fix minor keyword gaps |
| 50-74% | Average. Several issues to address |
| Below 50% | Poor. Usually a formatting problem, fix it first |

Aim for **80% or higher** before you apply.

## The Sections an ATS Reads, In Order

| Section | What the ATS expects | Common mistake |
| --- | --- | --- |
| Contact info | Email, phone, LinkedIn at the very top | Burying it in a sidebar |
| Summary | 2-3 lines with your role and top skills | Skipping it |
| Work experience | Job title, company, dates, bullet points | Long paragraphs instead of bullets |
| Education | Degree, institute, year | Cramped tables |
| Skills | The same words as the job description | Creative synonyms |

## How to Check Your Resume Before Applying

1. Open the free [Resume ATS Checker](/tools/resume-ats-checker).
2. Upload your resume, or paste the text.
3. Optionally paste the job description for a tailored score.
4. Read the score and the specific fixes it lists.
5. Fix and re-check until you are above 80%, then apply.

For a deeper breakdown by section, the [Resume Analyzer](/tools/resume-analyzer) shows priority fixes, and the [Resume JD Matcher](/tools/resume-jd-matcher) lists exactly which keywords from a posting are missing from your resume.

## Platform-Specific Tips: Naukri, LinkedIn, and Indeed

Each portal uses its own parser, so a resume that scores well on one can stumble on another. The core rules are the same everywhere; these are the extras.

### Naukri

- Fill every profile section and keep your profile "complete" badge green.
- Repeat your key skills in both the Skills section and inside job descriptions. Naukri counts both.
- Keep the file under two pages; the parser handles shorter files better.

### LinkedIn

- Put your core job-title keywords in your headline and About section.
- Use standard date formats such as Jun 2022 - May 2024.
- Use your real city and job titles so LinkedIn matches you to local openings.

### Indeed

- Mirror the exact wording of the top keywords in the description, such as "customer service" or "inventory management".
- Add a summary at the top with your skills and years of experience.
- Avoid tables and columns, because Indeed's parser is more sensitive to them than most.

## An ATS-Friendly Resume Template

> [Full Name]
> [Email] | [Phone] | [LinkedIn] | [City]
>
> PROFESSIONAL SUMMARY
> [2-3 lines with your role, top skills, and one achievement]
>
> WORK EXPERIENCE
> [Job Title] | [Company] | [Dates]
> - Achievement with a measurable result
> - Achievement with a measurable result
>
> EDUCATION
> [Degree] | [University] | [Year]
>
> SKILLS
> [Skill 1], [Skill 2], [Skill 3], [Skill 4]

## What an ATS Score Does Not Mean

A high score does not guarantee an interview. It only gets your resume into the human review pile. Equally, a low score on one posting can be high on another, because scoring is relative to that specific job description. Treat the score as a diagnostic, fix the gaps it names, and move on.

## Summary

The ATS rewards clarity and precise wording. Keep a single-column layout, use standard headings, mirror the job description's keywords, and verify everything with a checker before you apply. Small formatting changes routinely turn a silent rejection into a callback. Start with the free [Resume ATS Checker](/tools/resume-ats-checker), and build a clean file with the [Resume Builder](/tools/resume-builder).`;

const r2Content = `A resume is read in seconds and decides whether you get the interview. This guide shows how to build a professional, ATS-friendly resume from scratch: the right structure, a summary that works, experience bullets with real numbers, and specific help for freshers. You can produce the whole thing in about ten minutes with the free [Resume Builder](/tools/resume-builder).

## What a Good Resume Needs

Every strong resume has the same core sections:

- **Header** with your name, phone, email, LinkedIn, and city, one clean line each.
- **Professional summary** of two to three lines naming your role and best achievement.
- **Work experience** in reverse chronological order, as bullet points with numbers.
- **Skills** mixing technical and soft skills, matching the job description.
- **Education** with degree, institute, year, and CGPA or percentage.
- **An ATS-friendly layout** with standard headings and no tables or graphics.

## Choose the Right Format

For almost everyone, the reverse-chronological format is best. List your most recent role first. The order is Contact Information, Professional Summary, Work Experience, Education, Skills.

Skip the old "objective" statement, which only says what you want. A summary says what you offer, which is far more persuasive.

## How to Build It in Ten Minutes

**1. Contact info.** Use a professional email such as firstname.lastname@gmail.com, a custom LinkedIn URL, and city plus state only.

**2. The summary.** Follow the formula in the next section.

**3. Work experience.** For each role, write three to five bullets as Action verb plus task plus measurable result.

**4. Education.** Degree, university, year, and CGPA or percentage if it is strong. Freshers put education before experience; everyone else puts it after.

**5. Skills.** Two rows, technical and soft. List only skills you can discuss in an interview.

**6. Check ATS compatibility.** Single column, standard headings, no tables or text boxes, keywords from the target job, saved as PDF.

**7. Check your score.** Run the finished file through the [Resume ATS Checker](/tools/resume-ats-checker) and fix anything it flags.

## Writing a Summary That Works

Your summary is the first two or three lines a recruiter reads, so it has to answer three questions fast: who you are, what you do well, and what value you bring.

The formula is:

> [Role] + [years or level] + [top skill] + [one proof point].

Examples that work:

> "Accounts Executive with 4 years in GST and Tally, who cut monthly reconciliation time by 30% at a mid-size trading firm."

> "B.Tech 2026 graduate with strong Java and SQL fundamentals, seeking a Software Developer trainee role."

Examples that fail, because they say nothing specific:

> "Hardworking and dedicated team player seeking an opportunity to grow."

If writing a summary feels hard, the [AI Resume Summary Generator](/tools/ai-resume-summary-generator) drafts several options from your title and skills, which you then edit.

| Experience level | What the summary should do | Example |
| --- | --- | --- |
| Fresher | Degree + key skill + target role | "B.Com 2026 graduate with strong Excel and GST knowledge, seeking an Accounts Executive role." |
| 2-5 years | Role + years + specialist skill + result | "Digital Marketer with 3 years scaling organic traffic 2x at a D2C brand." |
| 6+ years | Role + scope + headline achievement | "Operations Head leading a team of 12, cutting costs 40% across two warehouses." |

## Numbers Beat Adjectives

Replace vague duties with measurable results. Recruiters remember numbers.

| Instead of | Write |
| --- | --- |
| Managed social media | Grew Instagram from 5K to 50K followers in 12 months |
| Handled customer support | Resolved 95% of tickets within 24 hours, lifting CSAT 15% |
| Responsible for sales | Generated INR 50L in new business in FY2025 |

Every bullet with a number is stronger than one without.

## Resume for Freshers: No Experience, Still Strong

Recruiters do not expect experience from a fresher. They look for potential, skills, projects, and attitude. Use these sections in order:

| Section | What to include |
| --- | --- |
| Header | Name, phone, email, city, LinkedIn |
| Summary | Two lines: who you are plus the role you want |
| Education | Degree, college, year, percentage or CGPA |
| Skills | Five to eight relevant skills, grouped |
| Projects | Two or three projects and what you did |
| Internships and achievements | Certificates, internships, hackathons |
| Extra-curricular | Only if relevant or impressive |

Your projects are your experience. For each one, say what you built, what tools you used, and what the result was. Keep the whole thing to one page, because there is not yet enough content to justify two.

## Common Resume Mistakes

- Typos and inconsistent formatting, which signal carelessness.
- Filler words such as hardworking, dedicated, team player.
- Going over two pages when a recruiter reads for seconds.
- Using a photo or a fancy multi-column template that fails an ATS scan.
- Listing skills you cannot actually discuss in an interview.

## Tailor Every Application

- Read the job description and mirror its keywords. That is what the ATS scores.
- Keep it to one or two pages no matter how much experience you have.
- Use the reverse-chronological format recruiters expect.
- Swap your summary's proof point to match the role, a revenue metric for sales, a throughput metric for operations.

## After You Build: Check and Apply

- Verify your score with the [Resume ATS Checker](/tools/resume-ats-checker).
- See the rules ATS screening rewards in the [ATS Resume Guide 2026](/blog/ats-resume-guide-2026).
- Match your resume to a specific posting with the [Resume JD Matcher](/tools/resume-jd-matcher).
- Pair it with a matching [Cover Letter Generator](/tools/cover-letter-generator).
- Applying for a government job? Use the [Sarkari Resume Template](/tools/sarkari-resume-template).

## Summary

A professional resume is a single-column, keyword-rich, numbers-driven one or two pages. Write a sharp two-line summary, put measurable results in every bullet, keep the layout ATS-safe, and check your score before you send it. Build yours free with the [Resume Builder](/tools/resume-builder).`;

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
    slug: R1,
    title: "ATS Resume Guide 2026: How to Pass Applicant Tracking Systems",
    seoTitle: "ATS Resume Guide 2026: How to Pass Applicant Tracking Systems | ToolPilot",
    seoDescription:
      "What an ATS is, how resume filtering works, and the exact rules to score 80%+ and reach a human recruiter. Includes Naukri, LinkedIn, and Indeed tips plus a free ATS checker.",
    excerpt:
      "How applicant tracking systems read, score, and rank your resume, the seven rules to pass them, platform tips for Naukri, LinkedIn, and Indeed, and a free ATS checker.",
    content: r1Content,
    faqs: [
      {
        question: "What is a good ATS score?",
        answer:
          "Aim for 80% or higher. Scores of 75-89% are good with minor gaps to fix, 50-74% need work, and anything below 50% usually points to a formatting problem that must be fixed first.",
      },
      {
        question: "Does a photo hurt my ATS score?",
        answer:
          "Yes, in most cases. Photos, icons, and graphics confuse resume parsers. Keep your resume text-only, especially for corporate applications.",
      },
      {
        question: "Is PDF or Word better for an ATS?",
        answer:
          "Both work if the text is selectable. Use a text-based PDF for most corporate applications, and a .docx only when a portal specifically asks for Word. Never send a scanned image.",
      },
      {
        question: "Do Indian companies really use ATS software?",
        answer:
          "Yes. MNCs, IT firms, banks, and staffing agencies run applicant tracking systems on high-volume roles, so an ATS-friendly resume matters for most online applications.",
      },
      {
        question: "How many pages should an ATS resume be?",
        answer:
          "One page for freshers and up to five years of experience, and two pages for senior roles. Shorter files parse more reliably.",
      },
      {
        question: "Is the ATS Resume Checker free?",
        answer:
          "Yes. The Resume ATS Checker is free, needs no signup, and runs in your browser so your resume is never uploaded to a server.",
      },
    ],
  },
  {
    slug: R2,
    title: "How to Build a Professional Resume: Complete Guide (2026)",
    seoTitle: "How to Build a Professional Resume (2026 Guide) | Free Resume Builder",
    seoDescription:
      "Build a professional, ATS-friendly resume step by step: structure, a summary that works, numbers-driven experience bullets, fresher tips, and a free builder and checker.",
    excerpt:
      "Build a professional, ATS-friendly resume in about ten minutes: the right structure, a summary formula, experience bullets with numbers, and specific fresher guidance.",
    content: r2Content,
    faqs: [
      {
        question: "How long should a resume be?",
        answer:
          "One page for freshers and up to five years of experience, and a maximum of two pages for senior roles. Recruiters scan for seconds, so concision helps.",
      },
      {
        question: "What is the best resume format?",
        answer:
          "Reverse chronological, with your most recent role first and the sections Contact, Summary, Experience, Education, and Skills in that order. It is the format recruiters and ATS parsers expect.",
      },
      {
        question: "Should I include a photo on my resume?",
        answer:
          "For most corporate roles, no. Photos are not expected, they can hurt ATS parsing, and they take up space that a stronger bullet point could use.",
      },
      {
        question: "How do I write a resume with no experience?",
        answer:
          "Lead with education and projects. Show skills the job asks for, describe what you built and the tools you used, and keep it to one page. Projects count as your experience.",
      },
      {
        question: "How long should a resume summary be?",
        answer:
          "Two to three lines, roughly 30-50 words. It should name your role, your top skills, and one achievement or target role, nothing more.",
      },
      {
        question: "Is the resume builder really free?",
        answer:
          "Yes. It is free with no account and no watermark, and it produces an ATS-friendly single-column layout you can download as a PDF instantly.",
      },
    ],
  },
];

const ARCHIVE: { slug: string; to: string }[] = [
  { slug: "ats-resume-checker-guide", to: R1 },
  { slug: "resume-ats-checker-guide", to: R1 },
  { slug: "how-to-check-resume-ats-screening-free-tool", to: R1 },
  { slug: "resume-ats-score-what-is-good-how-to-improve", to: R1 },
  { slug: "how-to-make-ats-friendly-resume", to: R1 },
  { slug: "build-ats-friendly-resume", to: R1 },
  { slug: "pass-ats-naukri-linkedin-indeed-platform-specific-tips", to: R1 },
  { slug: "resume-for-freshers-first-job", to: R2 },
  { slug: "how-to-create-professional-resume-10-minutes", to: R2 },
  { slug: "ai-resume-summary-generator-guide", to: R2 },
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
        categoryId: CAREER_CAT,
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
