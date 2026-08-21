import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | ToolPilot",
  description: "ToolPilot's privacy policy. Learn how we handle your data, files, and personal information. Browser-based processing keeps your data safe.",
  alternates: { canonical: "/privacy-policy" },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8 prose dark:prose-invert">
      <h1>Privacy Policy</h1>
      <p><em>Last updated: January 2025</em></p>
      <p>
        ToolPilot (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) operates the ToolPilot website. This page informs you of our policies
        regarding the collection, use, and disclosure of personal information when you use our service.
      </p>
      <h2>Information Collection and Use</h2>
      <p>
        We do not collect personal information unless you voluntarily provide it. Our browser-based tools
        process data entirely on your device — your files and data never leave your browser.
      </p>
      <h2>File Processing</h2>
      <p>
        For tools that process files in the browser, all processing happens locally using technologies
        like WebAssembly and Canvas API. Your files are never uploaded to our servers.
      </p>
      <h2>Cookies</h2>
      <p>
        We use essential cookies to maintain your preferences (such as dark mode). We do not use
        tracking cookies without your consent.
      </p>
      <h2>Third-Party Services</h2>
      <p>
        We may use Google Analytics to understand how our website is used. This data is anonymized
        and does not identify individual users.
      </p>
      <h2>Contact</h2>
      <p>If you have questions about this Privacy Policy, please contact us at our contact page.</p>
    </div>
  );
}
