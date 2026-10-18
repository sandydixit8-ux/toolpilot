import type { Metadata } from "next";
import { SITE_URL } from "@/lib/constants";
import { CATEGORIES } from "@/lib/constants";
import { allTools } from "@/config/tools";
import { AUTHOR } from "@/config/author";
import { AuthorBio } from "@/components/seo/author-bio";

export const metadata: Metadata = {
  title: "About ToolPilot – Our Mission, Values & Team",
  description: "Learn about ToolPilot's mission to make useful online tools accessible to everyone. Privacy-first, always free, simple and fast. Built by creators who believe in open access.",
  alternates: { canonical: `${SITE_URL}/about` },
};

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "AboutPage",
            name: "About ToolPilot",
            url: `${SITE_URL}/about`,
            mainEntity: {
              "@type": "Organization",
              name: "ToolPilot",
              url: SITE_URL,
              description: "A free online platform of privacy-friendly browser tools for work, money, career and everyday life.",
              founder: {
                "@type": "Person",
                name: AUTHOR.name,
                jobTitle: AUTHOR.role,
                url: AUTHOR.url,
              },
            },
          }).replace(/</g, "\\u003c").replace(/>/g, "\\u003e"),
        }}
      />
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8 prose dark:prose-invert">
        <h1>About ToolPilot</h1>
        <p className="lead">
          ToolPilot is a free online platform that provides simple, fast, and privacy-friendly tools
          for work, money, career, and everyday life.
        </p>
        <p>
          Our mission is to make useful tools accessible to everyone without the need for complicated
          software or expensive subscriptions. Every tool on our platform is designed to be intuitive,
          fast, and completely free.
        </p>

        <h2 id="sandy-dixit">About the Author</h2>
        <p>
          <strong>{AUTHOR.name}</strong> is the {AUTHOR.role.toLowerCase()} of ToolPilot. He builds and
          maintains the site&apos;s free browser-based tools and personally reviews every guide
          published on the blog.
        </p>
        <p>
          Sandy focuses on making technical and financial tasks understandable without jargon: how a
          PDF compressor works, how to structure a resume that passes ATS screening, how GST and
          income tax are actually calculated in India, and how to price a product correctly. Before a
          guide is published, its formulas, steps, and screenshots are checked against the tool they
          describe — and the guide is re-checked whenever the underlying rules change, such as tax
          slabs, GST rates, or platform character limits.
        </p>
        <p>
          You can read more about how content is produced and reviewed in our{" "}
          <a href="/editorial-policy">editorial and review policy</a>, or get in touch at{" "}
          <a href={`mailto:${AUTHOR.email}`}>{AUTHOR.email}</a>.
        </p>
        <AuthorBio />

        <h2>Our Story</h2>
        <p>
          ToolPilot was born out of frustration. We were tired of websites that promised free tools
          but buried them behind pop-up ads, forced sign-ups, and hidden paywalls. We wanted a place
          where you could merge a PDF, calculate your EMI, or check your resume for ATS compatibility
          — without creating an account or entering credit card details.
        </p>
        <p>
          So we built it. ToolPilot launched with a handful of tools and has grown to over{" "}
          {allTools.length} free online tools across {CATEGORIES.length} categories. Every tool runs
          directly in your browser whenever possible, meaning your files never leave your device.
        </p>

        <h2>Our Values</h2>
        <ul>
          <li><strong>Privacy First</strong> - Whenever possible, tools process data in your browser. Your files never leave your device. We don&apos;t track, store, or sell your data.</li>
          <li><strong>Always Free</strong> - No hidden charges, no premium plans, no &quot;free trial&quot; tricks. Every tool is free to use, today and forever.</li>
          <li><strong>Simple &amp; Fast</strong> - Clean interfaces with instant results. No unnecessary complexity, no bloated features you&apos;ll never use.</li>
          <li><strong>Accessible</strong> - Works on any device, any browser, any screen size. Designed for everyone, everywhere.</li>
          <li><strong>Open Source Spirit</strong> - We believe tools should serve people, not the other way around. No dark patterns, no manipulative design.</li>
        </ul>

        <h2>Our Tools</h2>
        <p>
          We offer {allTools.length}+ tools across {CATEGORIES.length} categories:
        </p>
        <ul>
          {CATEGORIES.map((cat) => (
            <li key={cat.slug}>
              <strong>{cat.name}</strong> — {cat.description}
            </li>
          ))}
        </ul>

        <h2>Who Uses ToolPilot?</h2>
        <ul>
          <li>Freelancers who need quick PDF and invoice tools</li>
          <li>Students calculating grades, GPAs, and salary expectations</li>
          <li>Small business owners managing invoices and GST compliance</li>
          <li>Job seekers optimizing resumes for ATS systems</li>
          <li>Developers needing quick format conversion and testing tools</li>
          <li>Anyone who needs a fast, free tool without the hassle</li>
        </ul>

        <h2>Our Team</h2>
        <p>
          ToolPilot is built and maintained by {AUTHOR.name} with a small group of contributors
          passionate about making the web a more useful place. We&apos;re developers, designers, and
          creators who believe that useful tools shouldn&apos;t cost money or compromise your privacy.
        </p>

        <h2>Get in Touch</h2>
        <p>
          Have a suggestion, found a bug, or just want to say hello? Visit our{" "}
          <a href="/contact">contact page</a> or reach out at{" "}
          <a href={`mailto:${AUTHOR.email}`}>{AUTHOR.email}</a>.
        </p>
      </div>
    </>
  );
}
