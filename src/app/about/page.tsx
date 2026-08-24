import type { Metadata } from "next";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "About ToolPilot – Our Mission, Values & Team",
  description: "Learn about ToolPilot's mission to make useful online tools accessible to everyone. Privacy-first, always free, simple and fast. Built by creators who believe in open access.",
  alternates: { canonical: `${SITE_URL}/about` },
};

export default function AboutPage() {
  return (
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

      <h2>Our Story</h2>
      <p>
        ToolPilot was born out of frustration. We were tired of websites that promised free tools
        but buried them behind pop-up ads, forced sign-ups, and hidden paywalls. We wanted a place
        where you could merge a PDF, calculate your EMI, or check your resume for ATS compatibility
        — without creating an account or entering credit card details.
      </p>
      <p>
        So we built it. ToolPilot launched with a handful of tools and has grown to over 68 free
        online tools across 7 categories. Every tool runs directly in your browser whenever possible,
        meaning your files never leave your device.
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
        We offer 68+ tools across 7 categories:
      </p>
      <ul>
        <li><strong>PDF Tools</strong> — Merge, split, compress, convert, and edit PDFs</li>
        <li><strong>Image Tools</strong> — Compress, resize, convert, and enhance images</li>
        <li><strong>Calculators</strong> — EMI, salary, income tax, percentage, and more</li>
        <li><strong>Career Tools</strong> — Resume builder, cover letter, ATS checker, LinkedIn tools</li>
        <li><strong>Business Tools</strong> — Invoice generator, GST calculator, business name ideas</li>
        <li><strong>Developer Tools</strong> — JSON formatter, Base64 encoder, HTML preview, API tester</li>
        <li><strong>AI Tools</strong> — AI-powered productivity tools for writing, analysis, and more</li>
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

      <h2>What People Say</h2>
      <blockquote>
        <p>&quot;I use ToolPilot&apos;s PDF merger every week for client reports. It&apos;s fast, free, and doesn&apos;t watermark my files. Best tool I&apos;ve found.&quot;</p>
        <footer>— A Freelance Consultant</footer>
      </blockquote>
      <blockquote>
        <p>&quot;The GST invoice generator saved me hours of work. I don&apos;t need expensive accounting software for my small shop anymore.&quot;</p>
        <footer>— A Small Business Owner</footer>
      </blockquote>
      <blockquote>
        <p>&quot;I got my resume past 3 ATS systems after using the ATS checker. Landed my dream job!&quot;</p>
        <footer>— A Job Seeker</footer>
      </blockquote>

      <h2>Our Team</h2>
      <p>
        ToolPilot is built and maintained by a small, dedicated team passionate about making the web
        a more useful place. We&apos;re developers, designers, and creators who believe that useful tools
        shouldn&apos;t cost money or compromise your privacy.
      </p>

      <h2>Get in Touch</h2>
      <p>
        Have a suggestion, found a bug, or just want to say hello? Visit our{" "}
        <a href="/contact">contact page</a> or reach out at{" "}
        <a href="mailto:support@toolpilotpro.in">support@toolpilotpro.in</a>.
      </p>
    </div>
  );
}
