import { SITE_URL } from "@/lib/constants";

export const AUTHOR = {
  name: "Sandy Dixit",
  role: "Founder & Editor",
  initials: "SD",
  path: "/about#sandy-dixit",
  url: `${SITE_URL}/about#sandy-dixit`,
  bio: "Sandy Dixit is the founder and editor of ToolPilot. He builds and maintains the site's free browser-based tools and personally reviews every guide published here.",
  shortBio:
    "Founder and editor of ToolPilot. Builds the tools, reviews every guide, and updates them whenever the underlying rules change.",
  email: "support@toolpilotpro.in",
  expertise: [
    "Web tools and utilities",
    "PDF and document workflows",
    "Indian finance calculators (GST, salary, income tax)",
    "Resume and ATS optimisation",
  ],
} as const;
