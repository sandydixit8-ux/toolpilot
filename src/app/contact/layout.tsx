import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | ToolPilot",
  description: "Get in touch with the ToolPilot team. Have questions, suggestions, or feedback? We'd love to hear from you.",
  alternates: { canonical: "/contact" },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
