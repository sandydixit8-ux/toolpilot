import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy | ToolPilot",
  description: "Learn about how ToolPilot uses cookies to improve your browsing experience and provide essential functionality.",
  alternates: { canonical: "/cookie-policy" },
};

export default function CookiePolicyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8 prose dark:prose-invert">
      <h1>Cookie Policy</h1>
      <p><em>Last updated: January 2025</em></p>
      <h2>What Are Cookies</h2>
      <p>Cookies are small text files stored on your device when you visit a website.</p>
      <h2>How We Use Cookies</h2>
      <ul>
        <li><strong>Essential cookies</strong> - Required for the website to function (e.g., theme preference).</li>
        <li><strong>Analytics cookies</strong> - Help us understand how visitors use our site (only with consent).</li>
        <li><strong>Advertising cookies</strong> - Used to serve relevant ads (only with consent).</li>
      </ul>
      <h2>Managing Cookies</h2>
      <p>You can control and manage cookies through your browser settings. Disabling essential cookies may affect website functionality.</p>
    </div>
  );
}
