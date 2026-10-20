import { getSiteUrl } from "@/lib/utils";

/**
 * Answer-Engine Optimization (AEO) block.
 *
 * AI answer engines (Google AI Overviews, ChatGPT, Perplexity, Bing Copilot)
 * extract a short, self-contained, declarative answer near the top of a page.
 * This renders a concise question + 40-60 word answer, backed by `Speakable`
 * and `Question`/`Answer` structured data so the passage is machine-readable.
 *
 * Keep answers factual and standalone: no pronouns referring to the page, no
 * "click below", just the answer a reader could quote on its own.
 */
export function QuickAnswer({
  question,
  answer,
  lastReviewed,
}: {
  question: string;
  answer: string;
  lastReviewed?: string;
}) {
  const url = `${getSiteUrl()}#quick-answer`;

  return (
    <div className="rounded-xl border border-blue-200 bg-blue-50/60 p-5 dark:border-blue-900/50 dark:bg-blue-950/20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Question",
            name: question,
            acceptedAnswer: { "@type": "Answer", text: answer },
            ...(lastReviewed ? { dateModified: lastReviewed } : {}),
          })
            .replace(/</g, "\\u003c")
            .replace(/>/g, "\\u003e"),
        }}
      />
      <p className="text-xs font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-400">
        Quick answer
      </p>
      <p className="mt-1 font-semibold text-gray-900 dark:text-gray-100">{question}</p>
      <p
        id="quick-answer"
        className="mt-2 text-sm leading-relaxed text-gray-700 dark:text-gray-300"
        itemProp="text"
      >
        {answer}
      </p>
      {/* Speakable tells voice assistants which passage to read aloud. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            url,
            speakable: {
              "@type": "SpeakableSpecification",
              cssSelector: ["#quick-answer"],
            },
          })
            .replace(/</g, "\\u003c")
            .replace(/>/g, "\\u003e"),
        }}
      />
    </div>
  );
}
