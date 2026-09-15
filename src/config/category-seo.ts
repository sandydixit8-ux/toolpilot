export interface CategorySEOContent {
  introTitle: string;
  intro: string[];
  faqs: { question: string; answer: string }[];
}

export const CATEGORY_SEO: Record<string, CategorySEOContent> = {
  pdf: {
    introTitle: "Why Use Our Free PDF Tools",
    intro: [
      "PDF is the most reliable format for sharing documents — it keeps your layout identical on every device, printer, and email client. But working with PDFs usually means buying expensive desktop software or uploading private files to random websites. Our free PDF tools cover the everyday tasks you actually need: converting Word and JPG files to PDF, turning PDFs back into editable Word and Excel files, merging and splitting pages, compressing oversized files for email or government portals, rotating misaligned pages, and counting pages.",
      "Every PDF tool here is completely free — no watermarks, no signups, no trial timers. Browser-based tools like the PDF compressor, merger, and splitter process your file directly on your device, so your document never leaves your computer. Server-based converters like Word-to-PDF and PDF-to-Word delete your file automatically right after processing. If you regularly send PDFs in email, upload documents to portals, or prepare assignments, these tools do in seconds what desktop apps take minutes to do.",
    ],
    faqs: [
      { question: "How do I convert PDF to Word without losing formatting?", answer: "Upload your PDF and the server reconstructs the text, tables, and layout into an editable DOCX. Complex designs with many images may shift slightly, so review the result before sharing it." },
      { question: "Are these PDF tools really free?", answer: "Yes. Every PDF tool on ToolPilot is free to use with no watermark, no registration, and no file limits. We earn nothing from your usage — no charges, no premium tier hiding the good features." },
      { question: "Is it safe to upload my PDF files?", answer: "Browser-based tools like the compressor, merger, and splitter process your file locally — it never touches our servers. Server-based converters process your file for a few seconds and then delete it automatically. We never store, scan, or share your documents." },
      { question: "Can I compress a PDF without losing quality?", answer: "Yes. The PDF compressor removes redundant data and downsamples heavy images, which usually cuts file size by a large margin while keeping text crisp and readable. Start with the default preset and pick a stronger preset only if you still need a smaller file." },
      { question: "Do I need to install any software?", answer: "No. All our PDF tools run entirely in your web browser. Open the tool, drop in your file, and get your result — nothing to install, nothing to update." },
    ],
  },
  image: {
    introTitle: "Why Use Our Free Image Tools",
    intro: [
      "Images are the heaviest thing on most websites, email attachments, and WhatsApp messages — a single 5MB photo can make an email bounce or a webpage crawl. Our free image tools solve the practical problems: compressing photos to WhatsApp and email-friendly sizes, resizing for specific platforms, cropping and rotating, and converting between JPG, PNG, and WebP formats. WebP especially gives you dramatically smaller files at the same visual quality, which is why it is now the standard format for modern websites.",
      "Unlike photo-editing apps that push you toward subscriptions, every tool here is free and works instantly in your browser. Because browser-based image tools process everything locally, your photos never leave your device — ideal when you are working with personal or business images. Whether you run a website that needs faster page loads, sell products online, or simply want to send clear photos without the \"file too large\" error, these tools cover the entire workflow in seconds.",
    ],
    faqs: [
      { question: "How do I compress an image without losing quality?", answer: "Use the image compressor with the default preset, which balances size and quality. Photos compress far better than text or graphics; if the file is still large, reduce the dimensions with the resizer before compressing again." },
      { question: "JPG, PNG, or WebP — which should I use?", answer: "Use JPG for photos, PNG for images with text or transparency, and WebP when you need the smallest size on a website. The WebP converter gives you the last one with excellent quality and a fraction of the bytes." },
      { question: "How do I convert JPG to PNG or PNG to JPG?", answer: "Open the image converter, pick the target format, and drop in your file — the result downloads instantly. Conversion happens in your browser, so no upload is involved." },
      { question: "Is my image uploaded to a server?", answer: "No. All image tools on ToolPilot process files locally in your browser. Your photos never leave your device, which keeps them private and makes everything fast." },
      { question: "Why is my image still large after compressing?", answer: "Compression can only do so much with very high-resolution photos. Resize the image to the dimensions you actually need first — a 4000px camera photo compresses far better once it is 1200px, which is enough for most uses." },
    ],
  },
  calculators: {
    introTitle: "Indian Calculators That Actually Help You Plan Money",
    intro: [
      "Money decisions get easier when you can see the numbers before you commit. Our calculators cover the questions Indians actually ask: the income tax calculator compares the old and new regimes side by side for FY 2025-26, the EMI calculator shows your monthly payment and total interest for home, car, and personal loans, the GST calculator splits CGST, SGST, and IGST correctly, and the SIP calculator projects how systematic investing compounds over time. Alongside these are gratuity, EPF interest, percentage, discount, compound and simple interest, and ROI tools.",
      "Every calculator is tailored to Indian rules — tax slabs, GST rates, EPF formulas, and the 50:50 CGST/SGST split for intrastate sales. Results are estimates to help you plan, not financial advice, so use them to compare options before applying for a loan, filing taxes, or starting SIPs. Best of all, they are free, instant, and work perfectly on mobile — pull them out while talking to a bank or CA.",
    ],
    faqs: [
      { question: "How is income tax calculated in India?", answer: "The income tax calculator applies your income and deductions to the old and new regime slabs for FY 2025-26 and shows your estimated tax under both, so you can pick the regime that saves more. For a final figure, confirm with your employer or CA." },
      { question: "What is EMI and how does the calculator work?", answer: "EMI is your Equated Monthly Installment — what you pay every month on a loan. The calculator divides your principal by its discounted value across the loan tenure at your rate, showing the monthly amount plus the total interest you will pay." },
      { question: "How does the GST calculator split CGST, SGST and IGST?", answer: "For intrastate (within-state) sales, GST is split equally into CGST and SGST at half the applicable rate each. For interstate sales, the full rate goes to IGST. The calculator applies the correct split automatically for any GST rate you enter." },
      { question: "How much should I invest through a SIP?", answer: "Enter your monthly amount, expected annual return, and tenure in the SIP calculator. It projects the total invested and the estimated corpus at maturity — a handy reality check before you decide on a monthly commitment." },
      { question: "Are these calculators accurate?", answer: "They implement the standard government formulas for income tax slabs, GST, EPF, gratuity, and loan EMIs. Figures are educational estimates and may differ from final assessments that include specific exemptions and surcharges." },
    ],
  },
  career: {
    introTitle: "Career Tools That Get You Hired Faster",
    intro: [
      "Recruiters spend only seconds on each resume, and most are filtered by Applicant Tracking Systems (ATS) before a human ever sees them. Our career tools help you fight that battle properly: the ATS checker scores your resume against how tracking systems parse it, the resume builder creates a clean, ATS-friendly layout in minutes, and the cover letter generator gives you a strong introductory letter. Companchairing calculators — salary, gratuity, notice period, and experience — help you understand what a job actually pays and when you can move.",
      "The tools are built for Indian job seekers: salary calculations use CTC, EPF, and professional tax conventions, and the resume guidance reflects how Indian recruiters screen candidates. Everything is free, works in your browser, and gives you immediate, actionable output. Whether you are a fresher building a first resume, a professional checking ATS compatibility before applying, or negotiating a hike, these tools save you hours of guesswork.",
    ],
    faqs: [
      { question: "What is an ATS and why does my resume need to pass it?", answer: "An Applicant Tracking System parses resumes into a database before recruiters review them. If your resume uses complex tables or images, the ATS may read it incorrectly. The ATS checker scores your resume and highlights exactly what to fix." },
      { question: "What ATS score should I aim for?", answer: "A score in the 80s or above means your resume is structured so the ATS can read it cleanly. Beyond the number, make sure your job titles, dates, and skills use the same keywords as the job description." },
      { question: "How do I build a resume from scratch?", answer: "Use the resume builder: enter your details section by section and download an ATS-friendly PDF. Keep it to one to two pages, use a standard layout, and quantify your achievements with numbers wherever possible." },
      { question: "How is take-home salary different from CTC?", answer: "CTC includes your basic pay plus allowances, EPF, gratuity, insurance, and other components. Your take-home is what actually reaches your bank after deductions. The salary calculator shows you both, so you know what an offer really means." },
      { question: "How is my notice period calculated?", answer: "Enter your joining and last working days into the notice period calculator, and it gives you the exact number of days plus your countable experience, which helps when you negotiate relief letters and salary settlements." },
    ],
  },
  business: {
    introTitle: "Business & Invoice Tools for Indian Small Business",
    intro: [
      "Invoicing is the most repetitive part of running a small business — and the easiest to get wrong. Our invoice generator creates clean, professional quotes and bills with your brand name, GSTIN, and tax calculations, and the GST invoice generator structures everything to stay compliant with Indian GST rules, including CGST, SGST, and IGST splits. Add the GST calculator to verify any tax amount, and the business name generator helps you brainstorm names for a new venture or side hustle.",
      "These tools are aimed squarely at freelancers, consultants, shop owners, and side-business founders who do not want to pay for an accounting suite just to send an invoice. Everything is free, browser-based, and quick: generate, print or download, and send. While a full accounting package tracks receivables over time, these tools get you an accurate, professional invoice in under a minute whenever you need one.",
    ],
    faqs: [
      { question: "How do I create an invoice for free?", answer: "Open the invoice generator, add your business details, client details, line items, and taxes, then print or download the result as a PDF. No account needed — you can create and send as many invoices as you like." },
      { question: "What makes a GST invoice valid?", answer: "A valid GST invoice needs your name, GSTIN, the buyer's name and GSTIN (for B2B), HSN codes, item details, tax rates, and the correct CGST/SGST or IGST split. The GST invoice generator fills this structure for you automatically." },
      { question: "How do I split CGST, SGST and IGST on an invoice?", answer: "For sales within the same state, charge CGST and SGST at half the applicable rate each. For interstate sales, charge the full rate as IGST. Select the type and rate in the generator and the split is computed for you." },
      { question: "Are invoice and GST tools on the site really free?", answer: "Yes — unlimited invoices, no watermarks, no signup. There is no trial and no cap on how many invoices you generate." },
      { question: "Where should I come up with a business name?", answer: "The business name generator combines industry keywords with strong suffixes to produce name ideas with available-looking domains. Shortlist a few, check the trademark database, register the domain, and keep it easy to spell." },
    ],
  },
  developer: {
    introTitle: "Developer Utilities That Work Offline in Your Browser",
    intro: [
      "Every developer keeps a handful of utility sites bookmarked — JSON formatters, encoders, generators, and validators. Our developer tools cover the essentials: the JSON formatter pretty-prints and validates JSON, the Base64 encoder/decoder works for text and files, the UUID generator produces v4 UUIDs in bulk, and the QR code generator turns any URL or text into a scannable code. Rounding out the collection are a markdown preview, HTML preview, color picker, password generator, word and character counters, unit converter, and Unix timestamp converter.",
      "The important detail is that these tools run entirely in your browser — paste API response, and your JSON never leaves your machine. That matters when you debug internal payloads or tokens. They are free, instant, and respect your privacy: nothing is uploaded, nothing is tracked. Next time you reach for a random online formatter, you know there is a dependable, private option right here.",
    ],
    faqs: [
      { question: "How do I format and validate JSON?", answer: "Paste or upload your JSON into the JSON formatter. If it is valid, you get a nicely indented, readable version; if not, the tool points to the exact position of the syntax error." },
      { question: "What is Base64 used for?", answer: "Base64 encodes binary data as a text-safe string, which is how images, files, and credentials travel inside JSON, URLs, or emails. The encoder/decoder handles both text and file conversion instantly." },
      { question: "Do these tools upload my data?", answer: "No. All developer tools process data locally in your browser. Not a single byte is sent to a server, so you can safely use them with API responses and config snippets." },
      { question: "How do I generate a UUID?", answer: "Open the UUID generator, choose how many you need, and copy them in one click — perfect for seeding databases, creating API identifiers, or generating test data." },
      { question: "How do QR codes work for URLs?", answer: "Paste a URL (or any text) into the QR code generator and download the code as an image. Anyone who scans it with a phone camera opens the link instantly — handy for Wi-Fi, payments, or print materials." },
    ],
  },
  ai: {
    introTitle: "AI Writing Tools Without the Guesswork",
    intro: [
      "AI-generated text is fast, but it rarely sounds like you. Our AI tools clean up the tell-tale signs: the text humanizer rewrites robotic AI output into natural, varied prose that passes as yours, the summarizer condenses long articles and documents into sharp key points, and the paraphraser rewords paragraphs while keeping the meaning. If you are applying for jobs, the AI cover letter generator drafts a tailored letter, and the AI resume summary generator writes a crisp professional profile. The AI email generator helps you phrase work emails quickly and politely.",
      "These tools are designed for students polishing assignments, writers editing drafts, and professionals handling email — anyone who uses AI heavily but wants output that reads naturally. Results are free and instant. Remember that humanizers and paraphrasers are for improving clarity and fit, not for misleading others about the origin of work — always apply your judgment, and follow your institution's or workplace's rules on AI use.",
    ],
    faqs: [
      { question: "What does an AI text humanizer do?", answer: "It rewrites monotonous, machine-typical phrasing into varied, natural language — shorter sentences, more rhythm, fewer clichés — so the final text reads the way a person writes." },
      { question: "Is my text saved anywhere?", answer: "No. Your input is processed and returned in the moment, then discarded. Nothing is stored or used to train models, and no account is required." },
      { question: "How long can the summarizer handle?", answer: "The summarizer condenses long articles and documents into their key points in seconds. For a multi-chapter report, summarize section by section for the best result." },
      { question: "Is it ethical to use an AI writing tool?", answer: "Yes, when used honestly — AI is a writing aid, like a thesaurus or an editor. Check the rules of your university, employer, or publication about AI disclosure, and always review the output before it represents you." },
      { question: "Are these AI tools free?", answer: "Yes. Every AI tool on ToolPilot is completely free with no signup and no usage caps. There is nothing to subscribe to and no premium tier." },
    ],
  },
  translation: {
    introTitle: "Free Translation & Hindi Typing Tools",
    intro: [
      "Language should never be the barrier to getting work done. The text translator converts text between dozens of languages in seconds — ideal for translating emails, product descriptions, or study notes. The transliteration tool solves the other common problem for Hindi speakers: typing Hindi on an English keyboard. As you type Roman characters, it converts them into Devanagari, so you can write Hindi for WhatsApp, documents, or captions without installing a keyboard or learning an IME.",
      "Both tools are free, run in your browser, and need no account. Translators are excellent for understanding and rough translation; for official documents, always have a human translator review the result. Transliteration gives you the Devanagari script instantly and accurately for everyday Hindi — no plugins, no setup, just type and go.",
    ],
    faqs: [
      { question: "How do I translate text to another language?", answer: "Open the text translator, type or paste your text, choose the target language, and copy the result. It supports dozens of languages and works instantly in your browser." },
      { question: "How do I type in Hindi without a Hindi keyboard?", answer: "Use the transliteration tool: type Hindi words in Roman letters (for example, 'namaste') and they are converted to Devanagari (नमस्ते) instantly. Copy the result anywhere you need it." },
      { question: "Is machine translation accurate enough?", answer: "Machine translation is great for everyday conversation, product descriptions, and quick understanding. For legal, medical, or official documents, get a professional translator to review it." },
      { question: "Does the translator store my text?", answer: "No. Your text is processed in the moment and not saved. The tools need no account and nothing is tracked." },
      { question: "What is transliteration and how is it different from translation?", answer: "Translation changes the language; transliteration changes the script. It spells the same language (like Hindi) in a different script (Devanagari instead of Roman), which is exactly what you need when you want to write Hindi but only have an English keyboard." },
    ],
  },
};