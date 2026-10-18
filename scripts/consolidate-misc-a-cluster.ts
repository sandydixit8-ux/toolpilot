import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const DEV_CAT = "cmucgwtel0009uf7099zm7yvf";
const GUIDE_CAT = "cmt2ndqx70040uffsia1zwfkd";
const CALC_CAT = "cmucgwrw70003uf70m8rulsu7";

const Q = "qr-code-generator-guide";
const E = "what-is-base64-encode-decode-free-tool";
const P = "password-generator-create-strong-passwords";
const W = "best-word-counter-for-essays";
const PC = "percentage-calculator-complete-guide";

const qContent = `A QR code is a square barcode a phone camera reads instantly. Restaurants use them for menus, shops for UPI payments, offices for Wi-Fi logins, and marketers for almost everything else. This guide shows what each type stores, how to create one free with the [QR Code Generator](/tools/qr-code-generator), and where to place it so people actually scan.

## What a QR Code Really Is

Underneath the pattern, a QR code is just short text. A URL code stores a web address; a Wi-Fi code stores the network name, password, and encryption type as one structured string; a contact code stores your name, number, and email. That is why one generator handles every type - you are only choosing what text to store. The pattern is simply a readable, error-corrected way of writing that text.

## The Main Types You Can Make

- **URL codes** - open a website, menu, or video in a tap.
- **Wi-Fi codes** - let guests join your network without typing a password.
- **Contact (vCard) codes** - save your phone number and email in one scan.
- **Plain text codes** - any short phrase, meeting ID, or room number.
- **Payment links** - point a scan at your UPI ID or payment link for quick collection.

If a phone can perform the action, a QR code can trigger it.

## How to Create a QR Code (Free, No Signup)

The [QR Code Generator](/tools/qr-code-generator) runs entirely in your browser:

1. Choose the code type (Link, Wi-Fi, Text, or Contact).
2. Paste your URL or network details.
3. Pick a size and colour.
4. Download the PNG and print or share it.

Because generation happens on your device, nothing about your link or Wi-Fi password is sent to a server. The codes are static - they store the data directly, so they never expire and keep working even if a third-party service shuts down.

## Where Businesses Put QR Codes

**Restaurants and cafes:**
- A table stand next to the menu
- On the menu card itself, "scan for the live menu"
- POS receipts and takeaway bags

**Shops and studios:**
- Flyers, pamphlets, and carrier bags
- Business cards, below your number
- A storefront window poster

**Services (consultants, salons, tutors):**
- A WhatsApp link for bookings, such as https://wa.me/91XXXXXXXXXX
- A Google review shortcut
- A profile link for offers

The trick is one QR per piece of marketing, pointing to one clear action. A code that could do five things usually makes people do none.

## Design Tips for High Scan Rates

- **Keep contrast strong.** Dark modules on a light background scan best; avoid light-on-light colours.
- **Keep the quiet zone.** The white margin around the square is required by the standard - do not crop it away.
- **Avoid tiny prints.** Below about 2.5 cm per side, codes become unreliable on thin paper and phone screens.
- **Add a label.** "Scan for the menu" beside a code noticeably increases scans versus a bare square.
- **Test before you print.** Scan your own code on both Android and iPhone before ordering 500 copies.

## Common Mistakes

- **Dark backgrounds** defeat many scanners.
- **Reusing someone else's screenshot.** A QR code is unique to its data - a copy of another brand's code stores their link, not yours.
- **Editing after printing.** Plan the destination first; a printed code cannot be changed.
- **Overloading with content.** Very long URLs create dense codes that scan slowly. Use a short link when you can.

## Frequently Asked Questions

- **Does a QR code expire?** No. A static QR stores the data itself and works forever unless the destination changes.
- **Can anyone scan it?** Any modern phone camera reads it instantly, no app needed.
- **Is it free?** Yes - unlimited generation, no watermark, no signup, and a print-ready PNG.
- **Which format should I download?** PNG at maximum resolution for printing.
- **Can I change the colours?** Yes, but keep strong contrast so it still scans reliably.

Put your link on any surface - create a scannable code with the free [QR Code Generator](/tools/qr-code-generator).`;

const eContent = `Encoding sounds technical, but it solves a simple problem: many systems only carry plain text safely, while images, files, spaces, and special characters are not plain text. Base64 and URL encoding (also called percent-encoding) are the two you will meet most often, and they are not the same thing. This guide explains both, when to reach for each, and how to encode or decode instantly with free tools.

## What Base64 Is

Base64 converts binary data - images, files, PDFs - into plain text made of letters, digits, plus (+), and slash (/). The name comes from the 64 characters in its alphabet. Every 3 bytes of binary become 4 Base64 characters, with a padding "=" added when the data does not divide evenly by three. That is why Base64 makes data roughly 33 percent larger.

It exists because email, JSON, and URLs carry text reliably but break on raw binary. When you see a long jumbled string inside a data URL, a JWT token, or an API response, you are almost certainly looking at Base64.

## Why Developers Use Base64

- **Email attachments** - old mail servers carried only 7-bit text, so attachments were Base64-encoded (this is what MIME does).
- **Embedding images in HTML or CSS** - a small image can be inlined as a data URI instead of a separate file: data:image/png;base64,iVBORw0KGgo...
- **JSON payloads** - binary data inside JSON must be text, so files are encoded before being sent.
- **JWT tokens** - the header and payload of a JSON Web Token are Base64-encoded JSON.

## What URL Encoding Is

A URL can only contain a limited set of safe characters. A space, an ampersand, a question mark, or a non-English character can break a link or make a parameter read wrong. URL encoding fixes this by replacing each unsafe character with a percent sign and a two-digit code:

| Character | Encoded |
| --- | --- |
| space | %20 |
| & | %26 |
| / | %2F |
| ? | %3F |
| = | %3D |

So a search for "sales & marketing" becomes sales%20%26%20marketing.

## When to Use Each

Use **Base64** when:
- You are embedding an image or file in JSON, HTML, or an email.
- You are working with JWT tokens or API payloads that carry binary data.

Use **URL encoding** when:
- You are building a link or passing user input into a query string.
- You are embedding one URL inside another.
- You are handling spaces or non-English characters in a link.

You do it both ways with free tools: encode or decode Base64 with the [Base64 Encoder/Decoder](/tools/base64-encoder-decoder) (or the single-purpose [Base64 Encoder](/tools/base64-encoder) and [Base64 Decoder](/tools/base64-decoder)), and make text link-safe with the [URL Encoder](/tools/url-encoder) and [URL Decoder](/tools/url-decoder).

## Neither One Is Encryption

This trips people up. Base64 and percent-encoding are formatting, not security. Anyone can reverse either in a second. Never hide passwords, keys, or secrets in an encoded string expecting them to stay secret. Use HTTPS and proper authentication for that.

## Frequently Asked Questions

- **Is Base64 encryption?** No. It is encoding, not encryption. Anyone can decode it.
- **Does Base64 make data smaller?** No - it makes data about 33 percent larger.
- **Why does a Base64 string end with "="?** The "=" is padding, added when the length is not a multiple of 3. Not every string has it.
- **Is URL encoding the same as Base64?** No. URL encoding is percent-encoding for link safety; Base64 encodes binary data into text.
- **Will a space always become %20?** In a query string it is sometimes shown as "+", which is the form-encoding equivalent.
- **Are the tools free?** Yes - all the encoders and decoders run in your browser, with nothing uploaded.

Encode, decode, and compare both formats with the free [Base64 Encoder/Decoder](/tools/base64-encoder-decoder) and [URL Encoder](/tools/url-encoder).`;

const pContent = `Around 81 percent of data breaches trace back to weak or reused passwords. The problem is not that "Password@123" is hard for a person to guess - it is that attackers run billions of guesses per second against leaked password lists. This guide explains what actually makes a password strong and how to generate one you can still live with, using the free [Password Generator](/tools/password-generator).

## Why Passwords Keep Getting Hacked

Because people reuse them. One leaked password from any site unlocks the same email and password on dozens of others - a technique attackers call credential stuffing. The fix is simple and mechanical: a long, unique, random password for every account, generated by chance rather than by your memory.

## What Makes a Password Actually Strong

| Factor | Weak | Strong |
| --- | --- | --- |
| Length | 8 chars | 16+ chars |
| Character pool | letters only | letters + numbers + symbols |
| Randomness | your birth date | fully random sequence |
| Uniqueness | reused everywhere | one per site |

**Length beats complexity.** A 16-character random password is exponentially harder to crack than "P@ssw0rd!", and it is easier to type than a short symbol salad. The [Password Generator](/tools/password-generator) lets you pick exactly how long and which character sets to include.

## How Long Is Long Enough?

| Length | Time to crack (strong mix) |
| --- | --- |
| 8 chars | hours |
| 12 chars | weeks to months |
| 16 chars | centuries |
| 20 chars | effectively forever |

Adding even a few extra characters multiplies the difficulty massively. When a site does not enforce a minimum, use 16 as your default. For anything critical - email and banking - go to 20.

## Step by Step: Generate and Use a Strong Password

1. Open the [Password Generator](/tools/password-generator).
2. Set the length (16 characters is a solid default).
3. Tick the character sets you need - uppercase, lowercase, numbers, symbols.
4. Generate - the result is truly random, made in your browser.
5. Save it in a password manager, and use a different password per site.

Because it runs on your device, the generated password is never sent anywhere. Generate a fresh one on every click and keep clicking until you are happy.

## The One Password People Can Remember

A passphrase is the memorable-but-strong compromise:

> Correct-Horse-Battery-Staple

Four random words joined by hyphens is easy to type, easy to remember, and hard to crack. Use it as your master password for a password manager, and let the generator fill in the hard, random passwords for individual sites.

## Never Do These

- **Reuse the same password** across accounts - one leak exposes everything.
- **Use personal facts** - birth dates, names, and phone numbers are among the first guesses.
- **Share passwords** in chat, email, or on paper notes.
- **Skip two-factor authentication** - turn on 2FA wherever it is offered, especially on email and banking.
- **Ignore leak alerts** - change the password immediately when a service warns you.

## Let a Password Manager Do the Work

A password manager stores every generated password behind one strong master password. With that one passphrase memorised, every site gets a unique random password and you never need to recall any of them. This turns the "use a different password everywhere" advice from impossible into automatic.

## Frequently Asked Questions

- **Is the generator truly random?** Yes - it uses a cryptographically secure random source, entirely in your browser.
- **Is the password stored anywhere?** No. Your browser is the only place it exists.
- **Should I change passwords often?** Not for long, unique ones that have not leaked - but change immediately after any exposure alert.
- **What if I cannot remember generated passwords?** Use a password manager, or build a passphrase pattern and let the generator fill the hard part.
- **Is it free?** Yes, the [Password Generator](/tools/password-generator) is free and needs no signup.

Stop reusing the same password - generate strong, unique ones with the free [Password Generator](/tools/password-generator).`;

const wContent = `Word and character counts decide whether an assignment passes, a college essay fits the limit, a tweet reads fully, or a blog post ranks on Google. Missing a limit by two words is enough to get a submission sent back. This guide explains what is counted, how to hit an exact limit, and how to measure both words and characters with the free [Word Counter](/tools/word-counter) and [Character Counter](/tools/character-counter).

## Why the Counts Matter

- **College essays and assignments** - most have strict lower and upper word limits.
- **Blogging and SEO** - search engines and readers both prefer posts that fully answer a query.
- **Freelance writing** - payment is often calculated per word.
- **Book manuscripts** - publishers quote by word count.
- **Social media and meta tags** - platforms and Google limit you by characters.

The count you see in Word or Google Docs can also differ from your professor's checker, depending on how headings, footnotes, and reference lists are counted. That is why a clean, unambiguous count is worth having.

## Count Words in Three Steps

1. Copy your full text.
2. Paste it into the [Word Counter](/tools/word-counter).
3. Read the word, character, sentence, and paragraph totals.

It works completely in your browser, so your essay never leaves your device, and formatting such as bold or line spacing does not inflate the number.

## What Counts as a Word?

The general academic rule of thumb:

- **Numbers count as words** - "2024" is one word.
- **Hyphenated compounds** usually count as one word - "well-known".
- **References and bibliographies** usually do not count.
- **In-text citations** often do not count, but check your department's guide.
- **Headings and captions** may or may not count - follow the brief.

If the brief does not say, ask once and you are covered for the term.

## How Many Words Is an Essay?

A common assumption is roughly 180 to 220 words per page in 12pt, double-spaced:

| Target | Approx. pages (double-spaced) |
| --- | --- |
| 250 words | ~1.5 pages |
| 500 words | ~2.5 pages |
| 1,000 words | ~4 to 5 pages |
| 2,000 words | ~8 to 10 pages |

Word count is also a rough time proxy - budget about 10 minutes of solid writing per 100 words, then trim.

## Words vs Characters: Know the Difference

| Metric | What it counts | Used for |
| --- | --- | --- |
| Words | Space-separated groups | Essays, invoices, manuscripts |
| Characters | Every letter and symbol | Twitter/X captions, SMS |
| Characters, no spaces | Text without spaces | Some SEO tools and limits |

Character limits are everywhere. Use the [Character Counter](/tools/character-counter) when a platform, not a page, is the constraint:

| Platform | Limit |
| --- | --- |
| Twitter/X post | 280 chars |
| Instagram caption | 2,200 chars |
| Google meta description | ~155 chars |
| SMS (single) | 160 chars |

## SEO and Word Count: What Is Real

There is no magic number - a tight 500-word answer beats a padded 2,000-word post. What matters is that the post fully answers the query. As a rule of thumb, short and sharp (300 to 500 words) suits simple how-to queries, 500 to 900 words suits most guides, and 1,000-plus words suits complete topic guides. For meta descriptions, keep the snippet near 155 characters with the keyword early, and count it with the [Character Counter](/tools/character-counter) before publishing.

## Tips to Hit an Exact Limit

- **Write first, trim later.** Draft freely, then cut filler to reach the limit.
- **Re-check after every edit.** One rewritten sentence can move the count 20 words.
- **Trim connectors.** "in order to" -> "to" saves words with no loss of meaning.
- **Watch characters for social posts.** Captions and bios limit characters, not words.

## Frequently Asked Questions

- **Do headings and citations count?** Usually citations and the reference list do not count, but heading rules vary - check the brief.
- **Can I count without uploading my file?** Yes - both tools analyse pasted text in your browser; nothing is uploaded.
- **Does it count Hindi text?** Yes - it counts any script by spaces and characters.
- **Do emojis count as characters?** Yes, modern emoji are counted as characters like any other text.
- **Are the tools free?** Yes, the [Word Counter](/tools/word-counter) and [Character Counter](/tools/character-counter) are free and unlimited.

Hit every word and character limit perfectly - use the free [Word Counter](/tools/word-counter) and [Character Counter](/tools/character-counter).`;

const pcContent = `Percentages show up everywhere - discounts, salary hikes, marks, GST, and loan rates. A percentage calculator handles every everyday percentage task: finding X percent of a number, working out an increase or decrease, and converting between marks, CGPA, and percentages. This guide covers the formulas and real examples, all built around the free [Percentage Calculator](/tools/percentage-calculator).

## The Three Most Common Percentage Calculations

### 1. Percentage of a Number

> 18 percent of Rs 45,000 = Rs 8,100

Used for GST, tips, discounts, and commission.

### 2. Percentage Increase or Decrease

> A price rises from Rs 800 to Rs 1,000 -> an increase of 25 percent

Used for salary hikes, price changes, and rent revisions.

### 3. What Percent Is A of B?

> 30 out of 120 = 25 percent

Used for marks, target achievement, and progress tracking.

## The Percentage Increase Formula

> Percentage Increase = (New Value - Old Value) / Old Value x 100

Step by step:

1. **Subtract** the old value from the new value to get the growth amount.
2. **Divide** the growth amount by the old value.
3. **Multiply** by 100.

Example: your rent rises from Rs 15,000 to Rs 17,000. Rs 17,000 - Rs 15,000 = Rs 2,000, then 2,000 / 15,000 = 0.133, so the increase is **13.3 percent**.

## Percentage vs Percentage Point

A rise in an interest rate from 8 percent to 10 percent is a change of **2 percentage points** but a **25 percent increase**. Businesses and the media mix these up constantly, so knowing the difference helps you read a headline correctly. Increase compares growth to the starting value; percentage point is the plain difference between two rates.

## How to Calculate Marks Percentage

> Percentage = (Marks obtained / Total marks) x 100

Example: you scored **432 out of 500** -> (432 / 500) x 100 = **86.4 percent**.

Enter your marks and total into the [Percentage Calculator](/tools/percentage-calculator) to get the result instantly. It works for a single exam, the total across subjects, or a sum of semesters.

## CGPA to Percentage (India)

Different boards use different multipliers - and this is where most students get it wrong:

| Scale | Rule | Example |
| --- | --- | --- |
| CBSE (10-point) | CGPA x 9.5 | 8.4 CGPA -> 79.8 percent |
| Common formula | (CGPA - 0.75) x 10 | 8.4 -> 76.5 percent |
| Many universities | x 9.5 for 10-point, x 25 for 4-point | varies |

Use the [CGPA to Percentage](/tools/cgpa-to-percentage) tool for the conversion, but verify against your board's official table, since some institutes publish their own multipliers. For 4-point scales and foreign universities, use the [GPA to Percentage](/tools/gpa-to-percentage) tool.

## What Do Percentages Mean for Exams?

| Percentage | Typical grade band |
| --- | --- |
| 90 percent and above | Outstanding / Distinction |
| 75 to 89 percent | First class |
| 60 to 74 percent | Second class |
| Below 60 percent | Pass / needs improvement |

Many admissions and government jobs require specific minimums such as 60 percent, 75 percent, or CGPA 7.5 - always check the exact eligibility before aiming.

## Real-Life Percentage Uses in India

- **Shopping** - a Rs 4,999 gadget at 18 percent off is about Rs 4,099.
- **Salary** - in-hand pay is often 72 to 80 percent of CTC; check it with a [salary calculator](/tools/salary-calculator).
- **Loan interest** - see how a rate affects your monthly outgo with an [EMI calculator](/tools/emi-calculator).
- **Billing** - apply percentage-based tax and discounts with the [GST calculator](/tools/gst-calculator) and [discount calculator](/tools/discount-calculator).
- **Profit** - turn cost and selling price into a margin with the [profit margin calculator](/tools/profit-margin-calculator).

## Frequently Asked Questions

- **How do I convert CGPA to percentage?** CBSE uses CGPA x 9.5; other boards vary. Use the [CGPA converter](/tools/cgpa-to-percentage) and confirm against your board's table.
- **Can I calculate profit percentage?** Yes - enter cost and selling price in increase mode, or use the [profit margin calculator](/tools/profit-margin-calculator).
- **Does it compute a percentage of marks?** Yes, use the "what percent is A of B" mode.
- **Is 60 percent good in a board exam?** For most fields yes, but eligibility thresholds differ - check what your target college or exam requires.
- **Is it free?** Yes - the [Percentage Calculator](/tools/percentage-calculator) is free, unlimited, and needs no signup.

Skip the mental math and get exact answers - use the free [Percentage Calculator](/tools/percentage-calculator).`;

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
    slug: Q,
    title: "QR Code Generator: Free QR Codes for Links, Wi-Fi, Menus & UPI",
    seoTitle: "QR Code Generator: Create Free QR Codes for Links, Wi-Fi & UPI",
    seoDescription:
      "Create free QR codes for links, Wi-Fi, menus, contact cards and payments. See what each type stores, where to place them, and the design rules for reliable scans.",
    excerpt:
      "How QR codes work, the main types (URL, Wi-Fi, contact, payment), how to create one free with no signup, where businesses should place them, and the design rules that keep them scannable.",
    content: qContent,
    categoryId: DEV_CAT,
    faqs: [
      {
        question: "Does a QR code expire?",
        answer:
          "No. A static QR stores the data itself, so it never expires and keeps working even if a third-party service shuts down, unless the destination itself changes.",
      },
      {
        question: "Can I create a QR code without signing up?",
        answer:
          "Yes. The QR Code Generator runs in your browser, needs no account, and produces a print-ready PNG with no watermark.",
      },
      {
        question: "Can I change the colours of a QR code?",
        answer:
          "Yes, but keep strong contrast - dark modules on a light background. Light-on-light or busy backgrounds make codes hard to scan.",
      },
      {
        question: "Is my data safe when I generate a QR code?",
        answer:
          "Yes. Generation happens on your device, so your URL or Wi-Fi password is never sent to a server.",
      },
      {
        question: "What size should a printed QR code be?",
        answer:
          "Aim for at least 2.5 cm per side, larger for posters. Codes that are too small scan unreliably, especially on thin paper or from a distance.",
      },
      {
        question: "Is the QR Code Generator free?",
        answer:
          "Yes. It is free, unlimited, needs no signup, and gives you a high-resolution PNG ready for print or screens.",
      },
    ],
  },
  {
    slug: E,
    title: "Base64 and URL Encoding Explained: When to Use Each (Free Tools)",
    seoTitle: "Base64 vs URL Encoding: What They Are and When to Use Each",
    seoDescription:
      "Base64 and URL encoding solve different problems. Learn what each does, where each is used, why neither is encryption, and encode or decode for free in your browser.",
    excerpt:
      "Base64 turns binary data into text for email, JSON and JWT; URL encoding makes text safe inside links. Learn the difference, when to use each, and encode or decode for free.",
    content: eContent,
    categoryId: DEV_CAT,
    faqs: [
      {
        question: "Is Base64 encryption?",
        answer:
          "No. Base64 is encoding, not encryption. Anyone can decode it, so never use it to hide secrets.",
      },
      {
        question: "What is the difference between Base64 and URL encoding?",
        answer:
          "Base64 converts binary data such as images and files into text. URL encoding (percent-encoding) replaces unsafe characters in a URL, such as spaces becoming %20.",
      },
      {
        question: "Does Base64 make data smaller?",
        answer:
          "No - it makes data about 33 percent larger, because every 3 bytes become 4 characters.",
      },
      {
        question: "Why does a Base64 string sometimes end with an equals sign?",
        answer:
          "The equals sign is padding, added when the data length is not a multiple of 3. Not every Base64 string has it.",
      },
      {
        question: "Will a space always become %20?",
        answer:
          "In a URL path, yes. In a query string a space is sometimes shown as a plus sign, which is the form-encoding equivalent.",
      },
      {
        question: "Are these tools free and private?",
        answer:
          "Yes. The Base64 and URL encoders/decoders are free and run entirely in your browser, so nothing is uploaded.",
      },
    ],
  },
  {
    slug: P,
    title: "Password Generator: How to Create Strong, Random Passwords Online",
    seoTitle: "Password Generator: Create Strong Random Passwords Online (Free)",
    seoDescription:
      "Learn what makes a password strong, how length beats complexity, and how to generate secure random passwords in your browser - plus how to remember them safely.",
    excerpt:
      "Why weak passwords cause most breaches, what makes a password strong, how length beats complexity, and how to generate and remember secure random passwords with a free tool.",
    content: pContent,
    categoryId: DEV_CAT,
    faqs: [
      {
        question: "How long should my password be?",
        answer:
          "16 characters is a solid baseline for everyday accounts. For critical accounts such as email and banking, use 20 or more.",
      },
      {
        question: "Is the password generator truly random?",
        answer:
          "Yes. It uses a cryptographically secure random source, entirely in your browser, so the output is not predictable.",
      },
      {
        question: "Is my generated password stored anywhere?",
        answer:
          "No. The password is created on your device and never sent to a server.",
      },
      {
        question: "Should I change my passwords often?",
        answer:
          "Not for long, unique passwords that have not leaked. Change immediately after any breach or leak alert.",
      },
      {
        question: "What if I cannot remember a generated password?",
        answer:
          "Use a password manager, or build a memorable passphrase such as four random words joined by hyphens and let the generator fill the hard, random parts.",
      },
      {
        question: "Is the Password Generator free?",
        answer:
          "Yes. It is free, needs no signup, and lets you choose the length and the character sets to include.",
      },
    ],
  },
  {
    slug: W,
    title: "Word Counter and Character Counter: Count Words, Characters & Limits",
    seoTitle: "Word Counter & Character Counter: Count Words and Characters Free",
    seoDescription:
      "Count words, characters, sentences and paragraphs instantly for essays, SEO and social media. Learn what counts as a word and which character limits apply where.",
    excerpt:
      "How to count words and characters for essays, SEO and social media, what counts as a word, platform character limits, and how to hit an exact limit with free tools.",
    content: wContent,
    categoryId: GUIDE_CAT,
    faqs: [
      {
        question: "Do headings and citations count in a word count?",
        answer:
          "Usually citations and the reference list do not count, but heading rules vary, so check the assignment brief.",
      },
      {
        question: "Can I count words without uploading my document?",
        answer:
          "Yes. The Word Counter analyses text pasted into your browser, so your document is never uploaded.",
      },
      {
        question: "Do numbers count as words?",
        answer:
          "Yes. A number such as 2024 counts as one word in most academic and editorial checks.",
      },
      {
        question: "What is the difference between words and characters?",
        answer:
          "Words are space-separated groups; characters count every letter and symbol including spaces. Character limits matter for social media, bios and meta tags.",
      },
      {
        question: "Does the counter work for Hindi or other scripts?",
        answer:
          "Yes. It counts any text by spaces and characters, so Hindi and other scripts are measured accurately.",
      },
      {
        question: "Are the Word Counter and Character Counter free?",
        answer:
          "Yes. Both are free, unlimited, need no signup, and run in your browser.",
      },
    ],
  },
  {
    slug: PC,
    title: "Percentage Calculator: Percentage Of, Increase, Marks & CGPA",
    seoTitle: "Percentage Calculator: Percentage Of, Increase, Marks & CGPA",
    seoDescription:
      "Calculate a percentage of a number, percentage increase or decrease, marks percentage and CGPA conversion. See the formulas, examples and a free percentage calculator.",
    excerpt:
      "Master every percentage calculation: percentage of a number, increase and decrease, marks percentage, and CGPA to percentage conversion, with formulas, examples and a free tool.",
    content: pcContent,
    categoryId: CALC_CAT,
    faqs: [
      {
        question: "How do I calculate a percentage increase?",
        answer:
          "Percentage Increase = (New Value - Old Value) / Old Value x 100. For example, Rs 15,000 rising to Rs 17,000 is about 13.3 percent.",
      },
      {
        question: "How do I convert marks to percentage?",
        answer:
          "Percentage = (Marks obtained / Total marks) x 100. Scoring 432 out of 500 gives 86.4 percent.",
      },
      {
        question: "How do I convert CGPA to percentage?",
        answer:
          "CBSE uses CGPA x 9.5; other boards and universities vary. Use the CGPA to Percentage tool and confirm against your board's official table.",
      },
      {
        question: "What is the difference between percentage and percentage point?",
        answer:
          "A rise from 8 percent to 10 percent is 2 percentage points but a 25 percent increase. Percentage point is the plain difference between two rates.",
      },
      {
        question: "Can I calculate profit percentage here?",
        answer:
          "Yes. Enter cost and selling price in increase mode, or use the profit margin calculator for a clear margin figure.",
      },
      {
        question: "Is the Percentage Calculator free?",
        answer:
          "Yes. It is free, unlimited, needs no signup, and runs in your browser for any percentage problem.",
      },
    ],
  },
];

const ARCHIVE: { slug: string; to: string }[] = [
  { slug: "qr-code-generator-create-free", to: Q },
  { slug: "how-to-create-qr-code-business-menu", to: Q },
  { slug: "base64-encoder-decoder-guide", to: E },
  { slug: "url-encoder-vs-url-decoder", to: E },
  { slug: "how-to-generate-strong-passwords", to: P },
  { slug: "word-counter-why-word-count-matters", to: W },
  { slug: "character-counter-social-media-seo", to: W },
  { slug: "how-to-calculate-marks-percentage", to: PC },
  { slug: "how-to-calculate-percentage-increase", to: PC },
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
