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
  {
    name: "NordVPN",
    description: "Top-rated VPN with threat protection and high-speed servers.",
    url: "https://nordvpn.com/?ref=toolpilot",
    ctaText: "Protect",
    rating: 5,
    badge: "Privacy",
  },
  {
    name: "Skillshare",
    description: "Thousands of online classes for creative and business skills.",
    url: "https://www.skillshare.com/?ref=toolpilot",
    ctaText: "Learn",
    rating: 4,
  },
  {
    name: "Zerodha",
    description: "Zero-brokerage stock trading and investing platform for India.",
    url: "https://zerodha.com/?ref=toolpilot",
    ctaText: "Invest",
    rating: 5,
    badge: "India",
    categorySlugs: ["calculators", "business"],
  },
  {
    name: "ClearTax",
    description: "File your ITR in minutes with expert help and max refunds.",
    url: "https://cleartax.in/?ref=toolpilot",
    ctaText: "File ITR",
    rating: 4,
    categorySlugs: ["calculators", "business"],
  },
  {
    name: "DeepL Pro",
    description: "AI-powered translation engine with natural, accurate results.",
    url: "https://www.deepl.com/pro?ref=toolpilot",
    ctaText: "Translate",
    rating: 5,
    categorySlugs: ["translation"],
  },
  {
    name: "Reverso",
    description: "Context-aware translation and language learning companion.",
    url: "https://www.reverso.net/?ref=toolpilot",
    ctaText: "Translate",
    rating: 4,
    categorySlugs: ["translation"],
  },
  {
    name: "WPS Office",
    description: "All-in-one office suite with a powerful built-in PDF editor.",
    url: "https://www.wps.com/?ref=toolpilot",
    ctaText: "Edit PDFs",
    rating: 4,
    categorySlugs: ["pdf", "business"],
  },
  {
    name: "PDFelement",
    description: "Easy PDF editing, conversion, and e-signature for everyone.",
    url: "https://pdf.wondershare.com/?ref=toolpilot",
    ctaText: "Edit PDFs",
    rating: 4,
    categorySlugs: ["pdf"],
  },
  {
    name: "Pixlr",
    description: "Powerful online photo editor with AI magic and free presets.",
    url: "https://pixlr.com/?ref=toolpilot",
    ctaText: "Edit",
    rating: 4,
    categorySlugs: ["image"],
  },
  {
    name: "Remove.bg",
    description: "Remove image backgrounds instantly with one click, free.",
    url: "https://www.remove.bg/?ref=toolpilot",
    ctaText: "Remove BG",
    rating: 5,
    badge: "Free",
    categorySlugs: ["image"],
  },
  {
    name: "Jasper AI",
    description: "AI copywriter for blogs, ads, and social media content.",
    url: "https://www.jasper.ai/?ref=toolpilot",
    ctaText: "Write AI",
    rating: 4,
    categorySlugs: ["ai", "business"],
  },
  {
    name: "Midjourney",
    description: "Generate stunning AI art and images from text prompts.",
    url: "https://www.midjourney.com/?ref=toolpilot",
    ctaText: "Create",
    rating: 5,
    badge: "AI",
    categorySlugs: ["ai", "image"],
  },
  {
    name: "Udemy",
    description: "Affordable online courses to learn job-ready technical skills.",
    url: "https://www.udemy.com/?ref=toolpilot",
    ctaText: "Learn",
    rating: 4,
    badge: "Deal",
    categorySlugs: ["career", "developer"],
  },
  {
    name: "LinkedIn Premium",
    description: "Job insights, AI tools, and learning to stand out to recruiters.",
    url: "https://www.linkedin.com/premium/?ref=toolpilot",
    ctaText: "Upgrade",
    rating: 4,
    categorySlugs: ["career"],
  },
  {
    name: "Bluehost",
    description: "Reliable hosting with free domain, SSL, and 24/7 support.",
    url: "https://www.bluehost.com/?ref=toolpilot",
    ctaText: "Host",
    rating: 4,
    categorySlugs: ["developer", "business"],
  },
  {
    name: "Namecheap",
    description: "Cheap domains, SSL certificates, and hosting with great support.",
    url: "https://www.namecheap.com/?ref=toolpilot",
    ctaText: "Domains",
    rating: 4,
    categorySlugs: ["developer", "business"],
  },
  {
    name: "Zapier",
    description: "Connect your apps and automate repetitive workflows without code.",
    url: "https://zapier.com/?ref=toolpilot",
    ctaText: "Automate",
    rating: 5,
    categorySlugs: ["business", "developer"],
  },
  {
    name: "Mailchimp",
    description: "Email marketing and automation to grow your audience.",
    url: "https://mailchimp.com/?ref=toolpilot",
    ctaText: "Start Free",
    rating: 4,
    categorySlugs: ["business"],
  },
  {
    name: "Zoho Books",
    description: "India-friendly accounting software for taxes, invoices, and GST.",
    url: "https://www.zoho.com/in/books/?ref=toolpilot",
    ctaText: "Account",
    rating: 4,
    badge: "India",
    categorySlugs: ["business", "calculators"],
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

export function getAffiliateBySlug(slug: string): AffiliateProduct | undefined {
  return AFFILIATE_PRODUCTS.find((p) => p.name.toLowerCase().replace(/\s+/g, "-") === slug);
}