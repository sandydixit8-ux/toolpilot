import { PrismaClient } from "@prisma/client";

/**
 * Depth pass 3: near-threshold and developer/consumer guides that were
 * excluded from the index only because they were too short to be useful.
 */
const prisma = new PrismaClient();

const WORD_TO_PDF = `PDFs keep your layout, fonts and margins intact on every device. A Word document can shift on someone else's laptop, but a PDF always looks the same, which is why resumes, official letters and applications are almost always submitted as PDF. The [Word to PDF](/tools/word-to-pdf) converter does the job in seconds, right in your browser, with no signup and no watermark.

## Why Convert Word to PDF

- **Consistency.** The file looks identical on Windows, Mac, a phone or a printer.
- **No accidental edits.** Recipients cannot easily change a PDF.
- **Reliable printing.** Page breaks and margins print as designed.
- **Acceptance.** Portals, recruiters and colleges expect PDF.
- **Searchable text.** A PDF made from Word keeps a real text layer, so recipients can search it, copy from it and run it through screening software.

That last point is worth stating plainly, because it is often misunderstood: converting a Word file produces a PDF with selectable text, not an image of a page. Scanned PDFs behave differently and cannot be searched without OCR.

## When You Should Convert to PDF

- **Job applications.** Resumes and cover letters as PDF every time, since recruiters and applicant tracking systems handle them consistently.
- **Official letters and applications.** Colleges and government offices usually ask for PDF.
- **Contracts and quotes.** Lock the formatting before sending.
- **Client deliverables.** Prevent accidental edits to a final version.
- **Printing.** PDF gives the most predictable output.

## How to Convert Word to PDF Online

1. Open the [Word to PDF converter](/tools/word-to-pdf).
2. Upload your .docx file.
3. Click convert.
4. Download the PDF. Fonts, tables and images stay in place.

Everything runs locally in your browser, so the document never leaves your device.

## Word to PDF vs PDF to Word

They are opposite directions of the same workflow.

| Your task | Use | Why |
| --- | --- | --- |
| Share a finished file | [Word to PDF](/tools/word-to-pdf) | Formatting is locked and it opens anywhere |
| Send a professional resume | [Word to PDF](/tools/word-to-pdf) | Recruiters and ATS prefer PDFs |
| Edit a received PDF | [PDF to Word](/tools/pdf-to-word) | You get an editable document back |
| Pull tables out of a PDF | [PDF to Excel](/tools/pdf-to-excel) | Spreadsheet data comes back as cells |
| Shrink the final file | [PDF Compressor](/tools/pdf-compressor) | Reduce size without losing quality |

Pick the direction by asking one question: does this file need to look final, or does it need to be editable? Many people lock a resume as PDF and later wish they could edit it, so keep the original Word copy.

## What Usually Breaks in Conversion

Most conversions are clean. When something shifts, it is almost always one of these:

- **Fonts that are not installed** get substituted, which changes line breaks. Arial, Calibri, Times New Roman and Georgia are safe nearly everywhere.
- **Text boxes and floating images** anchor inconsistently, so captions drift.
- **Tables with merged cells or fixed row heights** can overflow onto a new page.
- **Headers and footers with fields**, such as page numbers or dates, sometimes render differently.
- **Tracked changes and comments** may or may not appear depending on the export settings, so accept or reject them first.
- **Linked images** rather than embedded ones fail if the source file is missing.

Fixing the layout in Word first is always faster than repairing the PDF afterwards.

## Keep Formatting Perfect: Quick Checks

- **Use PDF-friendly fonts** and avoid decorative ones for body text.
- **Check margins and pagination** in Word before converting, since the PDF preserves them exactly.
- **Re-check page breaks** after any edit; a single added line can push a resume onto a second page.
- **Embed fonts** if an identical look matters on a machine without your fonts installed.
- **Name the file well.** Use Full-Name-Resume.pdf rather than Document1.pdf.
- **Open the PDF once before sending** and scroll to the end. It takes ten seconds and catches most surprises.

## File Size and Print Settings

A text-only document converts to a small PDF, usually under 200 KB. Photos and charts add megabytes quickly, so compress images in Word before exporting if the file must fit an upload limit.

For printing, leave at least half an inch of margin on every side. Most printers cannot print to the edge, and a document designed right up to the paper edge will be cropped or scaled down.

## Convert Word to PDF on Mobile

This works in Chrome, Safari or Edge on both Android and iPhone:

1. Open the [Word to PDF converter](/tools/word-to-pdf) in your phone browser.
2. Tap to upload your .doc or .docx file from Files or Drive.
3. Wait a few seconds for the conversion.
4. Download the PDF and share or upload it.

iPhone users with Apple Pages files should first tap Share, then Export, then Word to create a .docx, then convert. No app download and no account are required.

## Converting Scans and Photos Instead

If your document is actually camera photos or scans rather than a Word file, turn them into one clean PDF with the [JPG to PDF](/tools/jpg-to-pdf) tool. Upload the images in order and download a single combined PDF.

## Common Mistakes

- Converting a .doc file that Word still has open, which can produce an incomplete export.
- Forgetting that a PDF is not editable, then losing the original.
- Sending a PDF with a blank final page caused by an extra paragraph mark.
- Using screen-resolution images, which look soft when printed.
- Uploading a confidential contract to a server-side converter instead of a browser-based one.

## Summary

Converting Word to PDF locks your layout so it looks identical everywhere and cannot be edited by accident. Upload the .docx, convert, download, then do a quick check of the page count and tables before sending. Convert your files free with the [Word to PDF](/tools/word-to-pdf) converter.`;

const JSON_FORMATTER = `JSON is the format nearly every API returns and nearly every config file uses, and it usually arrives as one unreadable line. Formatting adds indentation so you can actually see the structure, and validation tells you why a payload is being rejected before you spend an hour guessing.

The [JSON formatter](/tools/json-formatter) on ToolPilot pretty-prints and validates in one step, in your browser.

## What a JSON Formatter Does

- **Pretty-prints:** adds indentation and line breaks to minified JSON.
- **Validates:** reports whether the JSON parses, and where it fails.
- **Minifies:** strips whitespace back out for a smaller payload.
- **Highlights:** colour-codes keys, strings, numbers and booleans for scanning.

Formatting does not change the data. Whitespace between tokens is insignificant in JSON, so a pretty-printed object and its minified twin are identical once parsed.

## How to Use the JSON Formatter

1. Paste your JSON into the [JSON formatter](/tools/json-formatter).
2. Click Format. The tool validates and pretty-prints immediately.
3. If there is an error, the message points to the approximate position of the problem.
4. Copy the formatted output, or switch to the minified version.

Nothing is uploaded. API responses often contain tokens, user records or internal hostnames, so a browser-side formatter is the safer default.

## JSON Rules People Trip Over

JSON looks like JavaScript object syntax but is stricter. The rules that cause most errors:

| Mistake | Why it fails | Fix |
| --- | --- | --- |
| Trailing comma | JSON forbids a comma after the last item | Remove it |
| Single quotes | Strings require double quotes | Replace with double quotes |
| Unquoted keys | Every key must be a string | Wrap keys in double quotes |
| Comments | JSON has no comment syntax | Remove them, or use JSON5 or JSONC where supported |
| NaN or Infinity | Not valid JSON numbers | Use null or a string |
| Leading zeros or a plus sign | Numbers follow stricter rules | Write 0.5, not .5 or +0.5 |
| Undefined | A JavaScript value, not JSON | Use null |

A useful mental model: if JavaScript's JSON.parse rejects it, it is not JSON regardless of whether the file has a .json name.

## Reading Error Messages

Most parsers report a position and a short reason. A few patterns cover the majority of failures:

- "Unexpected token" near a line end almost always means a trailing comma or a missing bracket closed earlier.
- "Unexpected end of input" means a bracket, brace or quote was never closed, often because a string contains an unescaped double quote.
- "Bad control character" means a literal newline or tab inside a string, which must be escaped as a backslash sequence.
- "Expected property name" means a key was written without quotes.

When the file is large, format first and the error line becomes obvious.

## Escaping and Unicode

Inside a JSON string, a double quote must be escaped, as must a backslash. Newlines and tabs are written as escape sequences rather than real line breaks. Unicode characters can appear directly in UTF-8, or as a backslash-u sequence.

That matters when you copy text from a document: smart quotes and en dashes are technically valid inside strings, but they are not the straight quotes the parser needs around keys and delimiters.

## Numbers and Precision

JSON has no integer limit, but JavaScript does. Numbers above 2^53 minus 1 lose precision when parsed in a browser, which is a real problem for large database IDs and payment amounts.

If an ID is 19 digits long, treat it as a string in the API contract. Formatting will not corrupt it, but parsing it into a JavaScript number will.

## Format vs Validate vs Minify

Three related jobs, three tools:

- **Format** for reading and debugging: [JSON formatter](/tools/json-formatter)
- **Validate** for a clean pass or fail before deploying: [JSON validator](/tools/json-validator)
- **Minify** to shrink a payload: [JSON minifier](/tools/json-minifier)

Minification typically saves 10 to 30 percent on indented JSON, which matters for large config payloads but rarely for an API response.

## A Practical Debugging Workflow

1. Paste the raw response into the formatter.
2. If validation fails, fix the syntax error it reports and re-validate.
3. Once it parses, look for the field that is missing or has the wrong type.
4. Check for a nested object where you expected an array, or the reverse.
5. Confirm null handling: a field set to null is not the same as a missing key.
6. Minify only when you are shipping, not while debugging.

## Related Developer Tools

- [Base64 encoder](/tools/base64-encoder) for tokens and payloads
- [URL encoder](/tools/url-encoder) for query strings
- [Regex tester](/tools/regex-tester) for extracting values from a response
- [HTML preview](/tools/html-preview) for rendering markup while you build
- [Unix timestamp converter](/tools/timestamp-converter) for the epoch fields every API returns

Turn minified JSON into readable, validated data with the free [JSON formatter](/tools/json-formatter).`;

const DATE_CALCULATOR = `A date calculator tells you exactly how many days fall between two dates, with no manual counting and no calendar mistakes. It sounds trivial until a deadline, a notice period or a loan statement forces you to count by hand across a month boundary.

The [date calculator](/tools/date-calculator) gives the exact count in seconds, including leap years and month lengths.

## When You Need an Exact Day Count

- **Notice periods** where the last working day depends on whether weekends count.
- **Loan and EMI tenures**, since interest is charged on actual days, not on whole months.
- **Project deadlines** when a client says "deliver in 45 days" and you need the date.
- **Court and government forms** that ask for days elapsed since an event.
- **Travel and hotel bookings**, where the count is nights, not days.
- **Subscription and warranty periods**, which rarely line up with calendar months.
- **Age and service calculations**, where a few days decide eligibility.

## How to Use It

1. Pick the start date.
2. Pick the end date.
3. Read the total number of days between them.

Nothing is uploaded, there is no signup, and the arithmetic runs in your browser.

## Inclusive vs Exclusive Counting

This single distinction causes most disputes about dates.

- **Exclusive** counting subtracts the start date. From 1 March to 31 March is 30 days.
- **Inclusive** counting includes both ends. The same range is 31 days.

Both are correct for different purposes. Hotel stays count nights, which is exclusive of the checkout morning. Project deadlines usually count inclusive working days. Notice periods depend entirely on the contract wording.

## Worked Examples

A 60-day notice period starting on 2 March 2026 ends on 1 May 2026 if the count begins the following day. Count carefully and you will find 30 days of March left after the 2nd, then 30 more in April, which is why the answer lands at the start of May and not the end.

A deposit on 15 January and a withdrawal on 15 February is 31 days, not one month. Banks that charge daily interest bill for 31 days, so the statement will be slightly higher than a monthly estimate suggests.

A warranty that starts on 29 February in a leap year runs to 28 February in a non-leap year for the same nominal term, because the anniversary date does not exist in the following year.

## Working Days vs Calendar Days

Calendar days include weekends and holidays. Working days exclude both, and the difference is large: a 60 calendar day period spans roughly 42 working days, while 60 working days spans about 12 weeks.

For anything contractual, check which one applies before you promise a date. Public holidays vary by country, and a count that ignores them can be off by a week around Easter, Christmas or a national holiday.

## Leap Years and Month Lengths

The rules that make date arithmetic reliable:

- A year is a leap year when it divides by 4, except centuries, which must divide by 400.
- 2000 was a leap year. 1900 was not. 2024 and 2028 are.
- Months have 28, 29, 30 or 31 days, and no fixed rule links them to week boundaries.
- The number of days in a year is 365 or 366, never 360, despite some finance conventions using 360-day years.

Because of this, dividing a day count by 30 to get months is always approximate. If a contract says "three months", the correct interpretation is a calendar month, not 90 days.

## Date Arithmetic and Time Zones

Date-only arithmetic should ignore time zones entirely. A day is a calendar day, not 24 hours.

Problems appear when a timestamp is converted to a local date near midnight. A record created at 23:30 UTC on 5 May is already 6 May in India, so a strict date comparison can place the same event on different days depending on who runs the report.

If you need precision to the hour, convert timestamps with the [Unix timestamp converter](/tools/timestamp-converter) and keep the time zone explicit.

## Related Calculators

- [Time calculator](/tools/time-calculator) for adding and subtracting hours and minutes
- [Age calculator](/tools/age-calculator) for exact age in years, months and days
- [Notice period calculator](/tools/notice-period-calculator) for last working days
- [Experience calculator](/tools/experience-calculator) for total tenure across jobs
- [Percentage calculator](/tools/percentage-calculator) for elapsed-time and completion figures

## Common Mistakes

- Assuming every month is 30 days.
- Forgetting that February has 29 days in a leap year.
- Counting the start date twice.
- Mixing working days and calendar days in the same calculation.
- Treating 90 days as exactly three months.

Dates decide deadlines, payments and eligibility. Get an exact count with the [free date calculator](/tools/date-calculator).`;

const BMI = `Body Mass Index estimates whether your weight is in a healthy range for your height. It needs only two numbers, weight and height, which is why it remains the first screening measure used by doctors, insurers and health apps.

Carry a tape measure and a scale, or use the [BMI calculator](/tools/bmi-calculator) to get the number instantly.

## The Formula

Metric: BMI = weight in kilograms divided by height in metres squared.

Imperial: BMI = 703 multiplied by weight in pounds, divided by height in inches squared.

A person weighing 70 kg at 1.75 m: 70 divided by 3.0625 equals 22.9, in the healthy band.

## Adult BMI Ranges

| BMI | Category |
| --- | --- |
| Below 18.5 | Underweight |
| 18.5 to 24.9 | Healthy weight |
| 25.0 to 29.9 | Overweight |
| 30.0 and above | Obese |

The same thresholds are used by the NHS in the UK and by the CDC in the United States. Some organisations subdivide obesity further: 30 to 34.9 is class I, 35 to 39.9 is class II, and 40 and above is class III.

## BMI Ranges for South Asian Adults

Several Indian and South Asian guidelines use lower cut-offs, because body fat tends to be higher at the same BMI. A commonly used version treats 23 as the start of overweight and 25 as the start of obesity.

That does not mean the standard chart is wrong; it means risk thresholds are population-specific. If you are of South Asian descent, a BMI of 24 deserves as much attention as a BMI of 26 in someone else.

## What Each Band Means

- **Underweight.** May reflect recent illness, poor intake, an eating disorder or an untreated condition. Persistent low weight is worth a medical conversation rather than a diet change.
- **Healthy weight.** Associated with the lowest risk of weight-related disease at a population level.
- **Overweight.** Risk of type 2 diabetes, high blood pressure and joint strain begins to rise, especially with fat carried around the waist.
- **Obese.** Substantially higher risk of heart disease, diabetes, sleep apnoea and some cancers.

None of these labels is a diagnosis. They describe a statistical band, not a person.

## How to Measure Correctly

- **Weight:** in the morning, after using the bathroom, before breakfast, in light clothing.
- **Height:** without shoes, heels together, standing straight against a wall.
- **Average it:** weigh on three separate mornings and use the middle value.
- **Track the trend:** weekly averages show real change; daily swings are mostly water and food.

## Where BMI Falls Short

- **Muscular people.** Muscle is denser than fat, so athletes often score as overweight while carrying low body fat. A rugby player and a sedentary person can share a BMI of 28.
- **Older adults.** Muscle loss with age means BMI can understate body fat.
- **Pregnancy.** BMI is not meaningful during pregnancy.
- **Children and teenagers.** Use age and sex specific percentile charts, not adult bands, because body composition changes through growth.
- **Very tall or very short people.** The squared height term does not scale perfectly at the extremes.
- **Body fat distribution.** BMI says nothing about where fat sits, and visceral fat around the organs is the more dangerous kind.

## Better Measures to Pair With BMI

| Measure | How to take it | What it adds |
| --- | --- | --- |
| Waist circumference | Around the navel, relaxed exhale | Central fat, the riskiest kind |
| Waist-to-height ratio | Waist divided by height | A value under 0.5 is a common target |
| Waist-to-hip ratio | Waist divided by hip measurement | Fat distribution pattern |
| Body fat estimate | Scales or calipers, both approximate | Muscle versus fat split |

Waist-to-height ratio is the simplest addition, because it needs no chart and works across heights. The NHS and NICE guidance both recommend combining BMI with waist measurement rather than relying on BMI alone.

## What Changes BMI Safely

BMI moves when weight changes, and weight changes follow energy balance over weeks rather than days.

- A rough rule of thumb is that a 3,500 calorie deficit corresponds to about one pound of fat, though real bodies adapt.
- Losing 5 to 10 percent of body weight measurably improves blood pressure and blood sugar for many people.
- Strength training changes composition even when the scale barely moves, which is why the mirror and waistline matter alongside BMI.
- Sleep and stress affect appetite hormones; short sleep reliably increases intake.
- Sugary drinks are the single easiest category to cut, because liquid calories do not satisfy hunger.

## Should You Check BMI at All?

Yes, as a cheap first filter, and no as a verdict. BMI is useful for spotting a trend, flagging risk in a routine check-up, and giving a starting point for a conversation with a clinician.

It is a poor target on its own. Two people with the same BMI can have very different health outcomes depending on muscle mass, waist size, blood pressure, blood sugar and fitness.

Check where you stand with the [free BMI calculator](/tools/bmi-calculator), then add a waist measurement for context.`;

const UPDATES = [
  {
    slug: "how-to-convert-word-to-pdf",
    content: WORD_TO_PDF,
    title: "How to Convert Word to PDF Without Losing Formatting (Free)",
    seoTitle: "How to Convert Word to PDF Without Losing Formatting | Free",
    seoDescription:
      "Convert a Word document to PDF while keeping fonts, tables and margins intact. What usually breaks in conversion, formatting checks, mobile steps, all free.",
    excerpt:
      "Convert Word documents to PDF without losing formatting. What breaks in conversion, how to check the result, and how to do it on a phone, free in your browser.",
    faqs: [
      {
        question: "Is Word to PDF conversion accurate?",
        answer:
          "Yes. Tables, images, headings and page breaks carry over cleanly, so the PDF looks the same as your Word document. Unusual fonts that are not installed on the converting device are the main exception.",
      },
      {
        question: "Does it accept older .doc files?",
        answer:
          "Upload .docx for the best results. For older .doc files, open them in Word or Google Docs, save as .docx, then convert.",
      },
      {
        question: "Will my resume formatting stay the same?",
        answer:
          "Yes. Fonts, tables and spacing are preserved, so the PDF looks the same as the original. Check the page count afterwards to make sure nothing spilled onto an extra page.",
      },
      {
        question: "Can I convert Word to PDF on my phone?",
        answer:
          "Yes. Open the Word to PDF converter in Chrome, Safari or Edge on Android or iPhone, upload the file, and download the PDF. No app is needed.",
      },
      {
        question: "Is the PDF text searchable?",
        answer:
          "Yes. A PDF created from a Word file keeps a real text layer, so recipients can search, select and copy the text. That is different from a scanned PDF, which is an image and needs OCR.",
      },
      {
        question: "What is the difference between Word to PDF and PDF to Word?",
        answer:
          "Word to PDF locks a finished document for sharing or printing. PDF to Word unlocks a received PDF so you can edit its text and layout.",
      },
    ],
  },
  {
    slug: "json-formatter-validate-json",
    content: JSON_FORMATTER,
    title: "JSON Formatter: Pretty Print and Validate JSON Data",
    seoTitle: "JSON Formatter: Pretty Print & Validate JSON | ToolPilot",
    seoDescription:
      "Format, validate and beautify JSON instantly in your browser. The JSON rules that cause most errors, how to read parser messages, and number precision limits.",
    excerpt:
      "Format, validate and minify JSON in seconds. The rules that cause most JSON errors, how to read parser messages, and the number precision trap.",
    faqs: [
      {
        question: "What does a JSON formatter do?",
        answer:
          "It parses JSON and reprints it with consistent indentation, so nested objects and arrays become readable. It also reports the position of syntax errors.",
      },
      {
        question: "Why is my JSON invalid?",
        answer:
          "The most common causes are trailing commas, single quotes, unquoted keys and comments. JSON allows none of these, unlike JavaScript object literals.",
      },
      {
        question: "Is it safe to paste API responses into an online formatter?",
        answer:
          "Only if the tool runs entirely in the browser. Responses often contain tokens or personal data, so avoid server-side formatters for anything sensitive.",
      },
      {
        question: "Does formatting change the data?",
        answer:
          "No. Whitespace between tokens is insignificant in JSON, so pretty-printed and minified versions parse to exactly the same values.",
      },
      {
        question: "Why did my large number change when I formatted it?",
        answer:
          "JavaScript numbers lose precision above 2^53 minus 1, which is about 9 quadrillion. Large IDs should be treated as strings in the API contract rather than as numbers.",
      },
      {
        question: "Can JSON contain comments?",
        answer:
          "No. Standard JSON has no comment syntax. Some tools support JSON5 or JSONC, which allow comments, but a strict parser will reject them.",
      },
    ],
  },
  {
    slug: "date-calculator-days-between-dates",
    content: DATE_CALCULATOR,
    title: "Date Calculator: Calculate Days Between Any Two Dates",
    seoTitle: "Date Calculator: Days Between Dates Online | ToolPilot",
    seoDescription:
      "Calculate days between any two dates instantly. Inclusive vs exclusive counting, worked examples, leap years, working days and time zone pitfalls.",
    excerpt:
      "Count the exact days between two dates, with worked examples. Inclusive vs exclusive counting, leap years, working days and the time zone traps to avoid.",
    faqs: [
      {
        question: "How do I count the days between two dates?",
        answer:
          "Subtract the earlier date from the later one and state whether both ends are included. Exclusive counting gives the difference in days; inclusive counting adds one.",
      },
      {
        question: "Are the start and end dates included in the count?",
        answer:
          "That depends on purpose. A hotel stay counts nights, which excludes checkout day, while a project deadline usually counts inclusive days.",
      },
      {
        question: "Does the calculator handle leap years automatically?",
        answer:
          "Yes. It uses the real calendar, so 29 February is counted in leap years and the result stays correct across year boundaries.",
      },
      {
        question: "Is 90 days the same as three months?",
        answer:
          "No. Months have 28 to 31 days, so three calendar months can be 89 to 92 days. Contract language about months should be read as calendar months, not as a fixed number of days.",
      },
      {
        question: "How many working days are in 60 calendar days?",
        answer:
          "Roughly 42, depending on which day of the week the period starts and which public holidays fall inside it. The exact number requires excluding weekends and holidays.",
      },
    ],
  },
  {
    slug: "bmi-calculator-body-mass-index",
    content: BMI,
    title: "BMI Calculator: How to Calculate Your Body Mass Index",
    seoTitle: "BMI Calculator: Calculate Body Mass Index Free | ToolPilot",
    seoDescription:
      "Calculate your BMI instantly with a free online calculator. The formula, adult BMI ranges, lower South Asian cut-offs, and the measures that beat BMI alone.",
    excerpt:
      "Calculate your BMI instantly, then read it properly: adult ranges, lower South Asian cut-offs, where BMI fails, and the waist measures that add context.",
    faqs: [
      {
        question: "What is a healthy BMI range?",
        answer:
          "For adults, a BMI of 18.5 to 24.9 is classified as healthy weight, 25 to 29.9 as overweight and 30 or above as obese. BMI is a screening measure, not a diagnosis.",
      },
      {
        question: "Is BMI accurate for athletes and muscular people?",
        answer:
          "No. BMI only compares weight with height, so it cannot tell muscle from fat. Muscular people often score as overweight while carrying low body fat.",
      },
      {
        question: "Should children use the adult BMI scale?",
        answer:
          "No. Children and teenagers are assessed with age and sex specific BMI percentile charts, because normal body composition changes during growth.",
      },
      {
        question: "Is the BMI scale different for Indians?",
        answer:
          "Many Indian and South Asian guidelines use lower cut-offs, with 23 as the start of overweight and 25 as the start of obesity, because body fat tends to be higher at the same BMI.",
      },
      {
        question: "What is a better measure than BMI?",
        answer:
          "Waist-to-height ratio is the simplest addition. A value under 0.5 is a common target, and it captures central fat that BMI ignores.",
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
