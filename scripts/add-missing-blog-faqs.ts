/**
 * Add FAQ schema (3 per post) to the 26 published blog posts that had none.
 *
 * Why: FAQPage markup is what answer engines (Google AI Overviews, ChatGPT,
 * Perplexity, Bing Copilot) quote directly, and it is the main AEO gap left in
 * the blog. Every other post already carries FAQs.
 *
 * Content rules: ASCII only in the FAQ text (no rupee sign, em-dash, degrees).
 * Idempotent: only inserts when the post currently has zero FAQs.
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type Pair = { q: string; a: string };

const FAQS: Record<string, Pair[]> = {
  "how-to-test-regex-online": [
    {
      q: "How do I test a regular expression without installing anything?",
      a: "Paste your pattern and test string into a browser-based regex tester. It runs JavaScript's RegExp engine locally, so matches and groups highlight instantly with no software to install and nothing sent to a server.",
    },
    {
      q: "What do the flags g, i and m mean in a regex?",
      a: "g finds all matches instead of stopping at the first, i makes matching case-insensitive, and m makes ^ and $ match the start and end of each line rather than the whole string.",
    },
    {
      q: "Why does my regex match part of a word when I expected a whole word?",
      a: "Most patterns match anywhere in the string. Wrap the pattern in word boundaries, for example \\bword\\b, or anchor it with ^ and $ so the whole string must match.",
    },
  ],
  "unix-timestamp-converter-guide": [
    {
      q: "What is a Unix timestamp?",
      a: "A Unix timestamp is the number of seconds that have passed since 1 January 1970 at 00:00 UTC, not counting leap seconds. It is timezone-independent, which is why databases and APIs store it.",
    },
    {
      q: "How do I convert a Unix timestamp to a readable date?",
      a: "Multiply or read the value as seconds since the epoch and format it in the target timezone. A timestamp of 0 is 1 January 1970, and current values are ten digits because they are in seconds, not milliseconds.",
    },
    {
      q: "Why does my timestamp show a date in 1970 or a year far in the future?",
      a: "The value is usually in the wrong unit. Seconds are ten digits and milliseconds are thirteen, so passing milliseconds to a seconds-based converter gives a date thousands of years ahead.",
    },
  ],
  "how-to-convert-png-to-jpg": [
    {
      q: "Does converting PNG to JPG lose quality?",
      a: "JPG is lossy, so some detail is discarded. At a quality setting of 85 to 90 percent the difference is hard to see, and the file is typically far smaller than the original PNG.",
    },
    {
      q: "Why does my PNG turn black or have a solid background as a JPG?",
      a: "JPG has no transparency channel. Transparent areas must be filled with a color, so a transparent PNG converted to JPG gets a white or black background unless you pick one.",
    },
    {
      q: "When should I keep PNG instead of JPG?",
      a: "Keep PNG for logos, screenshots, icons and anything with sharp text or transparency. Use JPG for photographs, where the smaller file matters more than pixel-perfect edges.",
    },
  ],
  "how-to-convert-video-to-gif": [
    {
      q: "How long should a GIF be?",
      a: "Keep GIFs to about five seconds. GIF has no interframe compression, so a long clip becomes enormous quickly; most chat apps cap uploads well below the size a 20-second GIF would reach.",
    },
    {
      q: "Why is my GIF so large compared with the video?",
      a: "Each GIF frame is stored almost independently and the format supports only 256 colors. Lowering the frame rate, shrinking the dimensions and shortening the clip are the three biggest size reductions.",
    },
    {
      q: "Can I convert a video to GIF on a phone?",
      a: "Yes. A browser-based converter works on current iOS and Android browsers, so you can upload the clip, trim it and download the GIF without installing an app.",
    },
  ],
  "uuid-generator-what-it-is-developers": [
    {
      q: "What is a UUID?",
      a: "A UUID is a 128-bit identifier written as 32 hexadecimal digits in five groups, such as 8-4-4-4-12. Version 4 UUIDs are random, giving roughly 122 random bits, so collisions are practically impossible.",
    },
    {
      q: "Are UUIDs safe to use as database primary keys?",
      a: "They are safe for uniqueness but random UUIDs hurt index locality. For high-write tables, consider UUID version 7, which is time-ordered, or generate the value in the application and store it in a native UUID column.",
    },
    {
      q: "Is an online UUID generator private?",
      a: "A browser-based generator creates the value locally with the Web Crypto API, so nothing is transmitted. Check that the tool states it runs locally before using it for production secrets.",
    },
  ],
  "how-to-prepare-interview-ai-generator": [
    {
      q: "How should I use AI-generated interview questions?",
      a: "Use them as practice prompts, not scripts. Answer out loud, then compare against the role description and tighten any answer that rambles or lacks a concrete result.",
    },
    {
      q: "What is the STAR method for interview answers?",
      a: "STAR means Situation, Task, Action and Result. Describe the context briefly, state what you had to do, explain the specific action you took and finish with a measurable result.",
    },
    {
      q: "Should I tell an interviewer I used AI to prepare?",
      a: "You do not need to disclose practice tools, but never read AI answers during the interview. Interviewers quickly notice scripted replies, and genuine examples are what get you hired.",
    },
  ],
  "bmi-calculator-body-mass-index": [
    {
      q: "What is a healthy BMI range?",
      a: "For adults, a BMI of 18.5 to 24.9 is classified as healthy weight, 25 to 29.9 as overweight and 30 or above as obese. BMI is a screening measure, not a diagnosis.",
    },
    {
      q: "Is BMI accurate for athletes and muscular people?",
      a: "No. BMI only compares weight with height, so it cannot tell muscle from fat. Muscular people often score as overweight while carrying low body fat.",
    },
    {
      q: "Should children use the adult BMI scale?",
      a: "No. Children and teenagers are assessed with age and sex specific BMI percentile charts, because normal body composition changes during growth.",
    },
  ],
  "how-to-estimate-construction-project-cost": [
    {
      q: "What is a Bill of Quantities (BOQ)?",
      a: "A BOQ lists every material and work item in a project with measured quantities. Multiplying each quantity by its rate gives the direct cost, which is then loaded with overheads and profit.",
    },
    {
      q: "How much contingency should I add to a construction estimate?",
      a: "Add 5 to 10 percent for well-defined work and 15 to 20 percent for renovation or early-stage projects, where unknown site conditions are more likely to change the scope.",
    },
    {
      q: "What is usually left out of a construction estimate?",
      a: "Common omissions are permits, design and engineering fees, temporary utilities, site clearance, waste removal and taxes. Add these as separate line items to avoid budget surprises.",
    },
  ],
  "notice-period-calculator-last-working-day": [
    {
      q: "How do I calculate my last working day?",
      a: "Count forward from the day you resign by your contractual notice period. If notice is 30 days, the last working day is 30 calendar days later, adjusting for weekends and public holidays if your contract says working days.",
    },
    {
      q: "Does the resignation day count in the notice period?",
      a: "Usually not. Most contracts start the notice period the day after you submit your resignation, so confirm the wording before you calculate the end date.",
    },
    {
      q: "Can an employer shorten or extend a notice period?",
      a: "Notice terms are set by the contract and local employment law. An employer may pay you in lieu of notice, but both sides need to agree to any change to the stated period.",
    },
  ],
  "how-to-write-professional-email-ai": [
    {
      q: "What structure should a professional email follow?",
      a: "Open with the reason for writing in one sentence, add the necessary context in two or three sentences, then close with a specific request and a clear deadline.",
    },
    {
      q: "How long should a business email be?",
      a: "Keep the body under about 150 words. Short emails get faster replies, and anything longer usually belongs in a document or a meeting.",
    },
    {
      q: "Is it safe to paste work details into an AI email writer?",
      a: "Only if the tool processes text locally or your company permits it. Never paste customer data, credentials or confidential plans into a third-party AI service without approval.",
    },
  ],
  "what-is-lorem-ipsum-placeholder-text": [
    {
      q: "Why do designers use Lorem Ipsum instead of real text?",
      a: "Readers stop evaluating layout and start reading when the text is meaningful. Lorem Ipsum looks like language but carries no message, so reviewers focus on spacing, hierarchy and balance.",
    },
    {
      q: "Where does Lorem Ipsum come from?",
      a: "It is derived from a Latin text by Cicero, De finibus bonorum et malorum, written in 45 BC. The opening words are altered, so it is not a genuine quotation.",
    },
    {
      q: "Should Lorem Ipsum stay in the final design?",
      a: "No. Replace it with real content before launch, because real text has different lengths and line breaks, which often expose layout problems placeholder text hides.",
    },
  ],
  "business-name-generator-startup": [
    {
      q: "What makes a good business name?",
      a: "It should be easy to say after hearing it once, short enough to fit a logo, memorable, and available as a matching domain and social handle.",
    },
    {
      q: "Should I choose a descriptive or an abstract name?",
      a: "Descriptive names explain the product but are crowded and hard to trademark. Abstract or invented names are easier to protect and can grow beyond the original product line.",
    },
    {
      q: "How do I check a business name is available?",
      a: "Check the domain, the company register in your country, social handles and a trademark database. Availability in one place does not guarantee it is free everywhere.",
    },
  ],
  "markdown-editor-why-developers-love": [
    {
      q: "Why do developers prefer Markdown?",
      a: "Markdown is plain text with simple syntax, so it stays readable without rendering, works in any editor, and lives in version control alongside code.",
    },
    {
      q: "What is the difference between Markdown and HTML?",
      a: "Markdown is a lightweight shorthand that converts to HTML. It is faster to type and easier to read, while HTML gives precise control over structure and styling.",
    },
    {
      q: "Does Markdown support tables and code blocks?",
      a: "CommonMark covers the basics, and GitHub Flavored Markdown extends it with tables, task lists, strikethrough and fenced code blocks with syntax highlighting.",
    },
  ],
  "convert-pdf-to-jpg-high-quality": [
    {
      q: "At what resolution should I convert a PDF page to JPG?",
      a: "Use 150 DPI for screen viewing, 300 DPI for printing and 72 DPI for quick previews. Higher DPI means sharper output but a much larger file.",
    },
    {
      q: "Why did my PDF convert to a blurry JPG?",
      a: "The export resolution was too low or the JPG quality setting was too aggressive. Re-export at 300 DPI with quality around 90 percent for print-ready results.",
    },
    {
      q: "Can I convert only one page of a PDF to JPG?",
      a: "Yes. Choose the specific page or page range before converting, which keeps the output small and avoids exporting pages you do not need.",
    },
  ],
  "age-calculator-find-exact-age": [
    {
      q: "How is exact age calculated?",
      a: "Age is the difference between the birth date and today measured in completed years, then months, then days. Leap years are counted exactly, so the total is accurate to the day.",
    },
    {
      q: "Why does my age differ by one year in some calculators?",
      a: "The difference is usually timezone handling or counting the birth day as day one. Exact age counts completed years, so it increases on your birthday, not the day before.",
    },
    {
      q: "Can I calculate the age of something other than a person?",
      a: "Yes. The same date difference works for a pet, a company, a document or an event; enter the start date in place of the birth date.",
    },
  ],
  "date-calculator-days-between-dates": [
    {
      q: "How do I count the days between two dates?",
      a: "Subtract the earlier date from the later one and state whether both ends are included. The difference is exclusive of the start date, while inclusive counting adds one day.",
    },
    {
      q: "Are the start and end dates included in the count?",
      a: "That depends on purpose. For a hotel stay, count nights, which excludes the checkout day; for a project deadline, count inclusive working days.",
    },
    {
      q: "Does the calculator handle leap years automatically?",
      a: "Yes. It uses the real calendar, so 29 February is counted on leap years and the result stays correct across year boundaries.",
    },
  ],
  "convert-jpg-to-png-online-free": [
    {
      q: "Does converting JPG to PNG improve quality?",
      a: "No. The detail already lost when the photo was saved as JPG cannot be restored. Conversion to PNG only prevents further loss from repeated saves.",
    },
    {
      q: "Why is the PNG version much larger than the JPG?",
      a: "PNG is lossless, so it stores every pixel exactly. For photographs the result is often five to ten times larger than the original JPG.",
    },
    {
      q: "When is JPG to PNG conversion actually useful?",
      a: "When you need to edit and re-save repeatedly, need transparency, or a platform only accepts PNG. For plain photo storage, keep the JPG.",
    },
  ],
  "how-to-extract-text-from-image-ocr": [
    {
      q: "What is OCR and how accurate is it?",
      a: "OCR is optical character recognition, which turns pixels into editable text. Accuracy is above 99 percent on clean, straight scans and drops for blurry, angled or handwritten content.",
    },
    {
      q: "Why does OCR produce garbled characters?",
      a: "Low resolution, skewed pages, unusual fonts and complex backgrounds confuse character recognition. Straighten and upscale the image, then try again.",
    },
    {
      q: "Is it safe to OCR a passport or bank statement online?",
      a: "Only with a tool that processes the image in the browser so the file never leaves your device. Sensitive documents should not be uploaded to a server you do not control.",
    },
  ],
  "hindi-transliteration-roman-to-devanagari": [
    {
      q: "What is the difference between transliteration and translation?",
      a: "Transliteration changes the script while keeping the sound and words, so Hindi written in Roman letters becomes Devanagari. Translation changes the language itself.",
    },
    {
      q: "Why is Roman Hindi spelling inconsistent?",
      a: "There is no standard Roman spelling for Hindi, so the same word appears as namaste, namastay or namastey. Transliteration tools map sounds rather than fixed spellings.",
    },
    {
      q: "Can transliteration handle English words inside Hindi text?",
      a: "Yes, most tools keep common English words readable and transliterate the Hindi portions, which matches how people actually write mixed sentences.",
    },
  ],
  "how-to-compress-video-for-whatsapp-email": [
    {
      q: "What is the WhatsApp video size limit?",
      a: "WhatsApp caps a single video at 64 MB for most chats, and the limit varies by platform and version. Compressing to 720p usually lands a short clip well under the cap.",
    },
    {
      q: "What is the best way to shrink a video without ruining it?",
      a: "Lower the resolution to 720p or 480p first, then reduce the bitrate. Cutting the resolution is far more effective than cutting quality at full size.",
    },
    {
      q: "Why does email reject my video even after compressing?",
      a: "Most providers cap attachments at 20 to 25 MB. For anything larger, upload to cloud storage and send a link instead of an attachment.",
    },
  ],
  "how-to-create-professional-logo-free": [
    {
      q: "What makes a logo look professional?",
      a: "Simplicity, correct spacing and a version that works at small sizes. A logo that stays readable at 32 pixels wide and in one color is doing its job.",
    },
    {
      q: "What file format should a logo be?",
      a: "Keep a vector master such as SVG for print and scaling, plus PNG exports with transparency for web and social use. Avoid JPG for logos because it has no transparency.",
    },
    {
      q: "How many colors should a logo use?",
      a: "One or two colors is usually enough. Limit the palette, then test the logo in pure black and pure white to be sure it still works in every context.",
    },
  ],
  "json-formatter-validate-json": [
    {
      q: "What does a JSON formatter do?",
      a: "It parses JSON and reprints it with consistent indentation, so nested objects and arrays become readable. It also reports the exact position of syntax errors.",
    },
    {
      q: "Why is my JSON invalid?",
      a: "The most common causes are trailing commas, single quotes, unquoted keys and comments. JSON allows none of these, unlike JavaScript object literals.",
    },
    {
      q: "Is it safe to paste API responses into an online formatter?",
      a: "Only if the tool runs entirely in the browser. Responses often contain tokens or personal data, so avoid server-side formatters for anything sensitive.",
    },
  ],
  "color-picker-choose-right-colors-design": [
    {
      q: "What is the difference between HEX, RGB and HSL?",
      a: "They describe the same colors in different ways. HEX is compact for code, RGB matches screen output and HSL is easiest for building tints and shades by adjusting lightness.",
    },
    {
      q: "What contrast ratio should text have?",
      a: "WCAG AA requires 4.5 to 1 for normal text and 3 to 1 for large text. AAA raises this to 7 to 1. Low contrast is the most common accessibility failure on websites.",
    },
    {
      q: "Why does a color look different on my phone and monitor?",
      a: "Displays differ in calibration, brightness and color space. Check important colors on more than one screen, and design with contrast rather than exact hue in mind.",
    },
  ],
  "html-preview-tool-test-debug": [
    {
      q: "What is an HTML preview tool?",
      a: "It renders HTML, CSS and JavaScript in a live pane as you type, so you can check layout and behavior without saving a file or refreshing a browser tab.",
    },
    {
      q: "Does an HTML preview run JavaScript?",
      a: "Most do, inside a sandboxed frame. Sandboxing keeps the preview isolated from your browser session, though it can block some features such as popups.",
    },
    {
      q: "Why does my page look different in the preview than in production?",
      a: "The preview usually lacks your site stylesheet, fonts and scripts. Paste the full document, including the head, to reproduce production rendering.",
    },
  ],
  "hindi-to-english-translation-free-online": [
    {
      q: "How accurate is free Hindi to English translation?",
      a: "Machine translation handles everyday sentences well but struggles with idioms, honorifics and legal wording. Always review important documents by hand.",
    },
    {
      q: "Why does the translation sometimes miss the meaning?",
      a: "Hindi word order and English word order differ, and many Hindi words have several meanings. Short sentences with clear context translate far more reliably.",
    },
    {
      q: "Is it safe to translate confidential text online?",
      a: "Not with a server-side translator. For contracts or personal documents, use an offline tool or a service your organization has approved.",
    },
  ],
  "how-to-create-quotation-for-clients": [
    {
      q: "What should a quotation include?",
      a: "A quotation needs your business details, the client details, an itemized list with quantities and rates, taxes, the total, the validity period and clear payment terms.",
    },
    {
      q: "What is the difference between a quotation and an invoice?",
      a: "A quotation is an offer of price before work begins. An invoice is a request for payment after goods or services are delivered.",
    },
    {
      q: "How long should a quotation stay valid?",
      a: "Typically 14 to 30 days. A stated validity period protects you from material or currency changes and creates a natural reason for the client to respond.",
    },
  ],
};

async function main() {
  let updated = 0;
  let skipped = 0;
  let missing = 0;

  for (const [slug, pairs] of Object.entries(FAQS)) {
    const post = await prisma.blogPost.findUnique({
      where: { slug },
      select: { id: true, faqs: { select: { id: true } } },
    });
    if (!post) {
      console.log(`MISSING POST: ${slug}`);
      missing++;
      continue;
    }
    if (post.faqs.length > 0) {
      skipped++;
      continue;
    }
    await prisma.fAQ.createMany({
      data: pairs.map((p, i) => ({
        question: p.q,
        answer: p.a,
        order: i,
        blogPostId: post.id,
      })),
    });
    console.log(`ADDED ${pairs.length} FAQs: ${slug}`);
    updated++;
  }

  console.log(`\nupdated: ${updated} | skipped (already had FAQs): ${skipped} | missing post: ${missing}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
