import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | ToolPilot",
  description: "ToolPilot's terms of service. Read the rules and guidelines for using our free online tools and services.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8 prose dark:prose-invert">
      <h1>Terms of Service</h1>
      <p><em>Last updated: January 2025</em></p>
      <h2>Acceptance of Terms</h2>
      <p>
        By accessing and using ToolPilot, you accept and agree to be bound by these Terms of Service.
      </p>
      <h2>Use of Tools</h2>
      <p>
        All tools on ToolPilot are provided free of charge for personal and commercial use. You may not
        use our tools for any illegal or unauthorized purpose.
      </p>
      <h2>Calculators and Estimates</h2>
      <p>
        Calculators on this website provide estimates for informational purposes only. Results should not
        be considered as professional financial, tax, legal, or medical advice. Always consult a qualified
        professional for important decisions.
      </p>
      <h2>AI-Generated Content</h2>
      <p>
        AI-powered tools generate content based on artificial intelligence models. Results may vary and
        should be reviewed before use. We are not responsible for AI-generated content.
      </p>
      <h2>Limitation of Liability</h2>
      <p>
        ToolPilot is provided &quot;as is&quot; without warranties. We shall not be liable for any damages
        arising from the use of our tools.
      </p>
    </div>
  );
}
