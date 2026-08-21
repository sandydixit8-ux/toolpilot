import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About ToolPilot – Our Mission & Values",
  description: "Learn about ToolPilot's mission to make useful online tools accessible to everyone. Privacy-first, always free, simple and fast.",
  alternates: { canonical: "/about" },
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
      <h2>Our Values</h2>
      <ul>
        <li><strong>Privacy First</strong> - Whenever possible, tools process data in your browser. Your files never leave your device.</li>
        <li><strong>Always Free</strong> - No hidden charges, no premium plans. Every tool is free to use.</li>
        <li><strong>Simple & Fast</strong> - Clean interfaces with instant results. No unnecessary complexity.</li>
        <li><strong>Accessible</strong> - Works on any device, any browser, any screen size.</li>
      </ul>
      <h2>Our Tools</h2>
      <p>
        We offer 68+ tools across 7 categories including PDF tools, image tools, calculators,
        career tools, business tools, developer tools, and AI-powered tools.
      </p>
    </div>
  );
}
