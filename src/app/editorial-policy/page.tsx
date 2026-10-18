import type { Metadata } from "next";
import { AUTHOR } from "@/config/author";

export const metadata: Metadata = {
  title: "Editorial & Review Policy",
  description: "How ToolPilot creates, reviews, and updates its free online tools and blog content. Our standards for accuracy, privacy, and ongoing maintenance.",
  alternates: { canonical: "/editorial-policy" },
};

export default function EditorialPolicyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8 prose dark:prose-invert">
      <h1>Editorial &amp; Review Policy</h1>
      <p><em>Last updated: September 2026</em></p>

      <h2>Who Is Responsible</h2>
      <p>
        Every guide and tool page on ToolPilot is produced under the direction of{" "}
        <strong>{AUTHOR.name}</strong>, {AUTHOR.role.toLowerCase()}. Guides carry a named author and
        a review date on the page itself, and you can read more about{" "}
        <a href={AUTHOR.path}>the author here</a>. We do not publish anonymous or unattributed
        content.
      </p>

      <h2>What Our Tools Are</h2>
      <p>
        Every page on ToolPilot exists to solve a specific problem: merge a PDF, verify a resume
        against ATS rules, calculate a salary or an EMI, encode a string, or generate a compliant
        invoice. Each tool has its own purpose, workflow, and privacy behaviour — we do not mass-produce
        generic pages or duplicate the same content across tools.
      </p>

      <h2>How Tools Are Created and Tested</h2>
      <p>
        Each tool goes through a consistent process before and after launch:
      </p>
      <ul>
        <li><strong>Purpose check</strong> — the tool must do one job clearly and usefully; it is only published if it genuinely helps users.</li>
        <li><strong>Functional testing</strong> — every tool is tested on desktop and mobile browsers, including file upload, conversion, and download steps.</li>
        <li><strong>Privacy review</strong> — browser-based tools are confirmed to process files locally; server-based converters are confirmed to delete files automatically after processing.</li>
        <li><strong>Ongoing review</strong> — tools and their instructions are re-checked on a rolling basis and updated whenever a bug, browser change, or user report appears.</li>
      </ul>

      <h2>How We Handle Errors and Feedback</h2>
      <p>
        If a tool returns a wrong result, users can report it through the{" "}
        <a href="/contact">contact page</a>. Reported issues are reproduced, fixed, and re-tested
        before deployment. We add fixes to the relevant tool and review related tools for the same
        class of error.
      </p>

      <h2>Blog and Guide Content</h2>
      <p>
        Our guides are written to explain the task a tool solves — how to compress a PDF, make an
        ATS-friendly resume, or calculate a SIP — with step-by-step instructions, examples, and FAQ
        sections. Guides are reviewed for accuracy and refreshed when rules change (for example,
        income-tax slabs or GST rates).
      </p>
      <p>
        Each guide covers one topic thoroughly rather than spreading the same explanation across
        several thin pages. When older articles overlap, we merge them into a single, better guide
        and redirect the old addresses, so you land on complete information instead of a partial
        answer. Every guide states what it covers, shows the working with real numbers, and links to
        the tool that performs the calculation or conversion.
      </p>

      <h2>Corrections</h2>
      <p>
        If you find an error — a wrong formula, an out-of-date rate, or a step that no longer works —
        tell us through the <a href="/contact">contact page</a> or at{" "}
        <a href={`mailto:${AUTHOR.email}`}>{AUTHOR.email}</a>. Confirmed errors are corrected and the
        page&apos;s review date is updated. Where a correction changes a published figure or
        recommendation, the change is made promptly rather than at the next scheduled review.
      </p>

      <h2>Review Cadence</h2>
      <p>
        Guides are re-checked on a rolling basis, and content tied to a changing rule — tax rates,
        GST thresholds, platform limits, exam eligibility — is prioritised. The review date shown on
        each guide reflects when that specific page was last checked.
      </p>

      <h2>Transparency</h2>
      <p>
        ToolPilot is funded by advertising and, where relevant, by links to third-party products.
        Affiliate or sponsored links are clearly labelled. Advertising never changes a tool&apos;s
        behaviour, ranking, or the privacy of your files.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about this policy can be sent to{" "}
        <a href="mailto:support@toolpilotpro.in">support@toolpilotpro.in</a> or via the{" "}
        <a href="/contact">contact page</a>.
      </p>
    </div>
  );
}