export interface AffiliateProduct {
  name: string;
  description: string;
  url: string;
  ctaText?: string;
  rating?: number;
  badge?: string;
  categorySlugs?: string[];
}

export const AFFILIATE_PRODUCTS: AffiliateProduct[] = [
  {
    name: "Canva Pro",
    description: "Design stunning graphics, presentations, and social media posts with premium templates.",
    url: "https://www.canva.com/?aff=toolpilot",
    ctaText: "Design",
    rating: 5,
    badge: "Top Pick",
    categorySlugs: ["image"],
  },
  {
    name: "Notion",
    description: "All-in-one workspace for notes, tasks, wikis, and databases.",
    url: "https://www.notion.so/?ref=toolpilot",
    ctaText: "Try Free",
    rating: 5,
    badge: "Popular",
    categorySlugs: ["career", "business"],
  },
  {
    name: "Grammarly",
    description: "AI writing assistant for grammar, clarity, and tone.",
    url: "https://www.grammarly.com/?aff=toolpilot",
    ctaText: "Write Better",
    rating: 5,
    categorySlugs: ["career"],
  },
  {
    name: "ChatGPT Plus",
    description: "Advanced AI assistant for writing, coding, analysis, and creative work.",
    url: "https://chat.openai.com/?ref=toolpilot",
    ctaText: "Try AI",
    rating: 5,
    badge: "AI",
    categorySlugs: ["ai"],
  },
  {
    name: "Adobe Acrobat Pro",
    description: "Professional PDF editing, e-signatures, and document management.",
    url: "https://www.adobe.com/acrobat.html?ref=toolpilot",
    ctaText: "Edit PDFs",
    rating: 4,
    categorySlugs: ["pdf"],
  },
  {
    name: "QuickBooks",
    description: "Accounting software for invoicing, expenses, and tax prep.",
    url: "https://quickbooks.intuit.com/?ref=toolpilot",
    ctaText: "Manage",
    rating: 4,
    categorySlugs: ["business"],
  },
  {
    name: "VS Code",
    description: "Free code editor with IntelliSense, debugging, and built-in Git.",
    url: "https://code.visualstudio.com/?ref=toolpilot",
    ctaText: "Download",
    rating: 5,
    badge: "Free",
    categorySlugs: ["developer"],
  },
  {
    name: "Figma",
    description: "Collaborative interface design tool for teams.",
    url: "https://www.figma.com/?ref=toolpilot",
    ctaText: "Design",
    rating: 5,
    categorySlugs: ["image", "developer"],
  },
  {
    name: "Hostinger",
    description: "Fast, affordable web hosting with free domain and SSL.",
    url: "https://www.hostinger.com/?aff=toolpilot",
    ctaText: "Host Site",
    rating: 4,
    badge: "Deal",
    categorySlugs: ["developer", "business"],
  },
  {
    name: "ConvertKit",
    description: "Email marketing for creators — grow your audience and monetize.",
    url: "https://convertkit.com/?ref=toolpilot",
    ctaText: "Start Free",
    rating: 4,
    categorySlugs: ["business"],
  },
  {
    name: "Surfshark VPN",
    description: "Fast, secure VPN for privacy and unrestricted browsing.",
    url: "https://surfshark.com/?ref=toolpilot",
    ctaText: "Protect",
    rating: 5,
    badge: "Privacy",
  },
  {
    name: "1Password",
    description: "Secure password manager for teams and individuals.",
    url: "https://1password.com/?ref=toolpilot",
    ctaText: "Secure",
    rating: 5,
  },
];

export function getAffiliatesForCategory(categorySlug: string): AffiliateProduct[] {
  return AFFILIATE_PRODUCTS.filter(
    (p) => !p.categorySlugs || p.categorySlugs.includes(categorySlug)
  ).slice(0, 4);
}

export function getGeneralAffiliates(): AffiliateProduct[] {
  return AFFILIATE_PRODUCTS.filter((p) => !p.categorySlugs).slice(0, 4);
}
