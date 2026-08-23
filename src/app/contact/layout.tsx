import type { Metadata } from "next";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Contact Us – ToolPilot",
  description: "Have a question or suggestion? Contact the ToolPilot team.",
  alternates: { canonical: `${SITE_URL}/contact` },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
