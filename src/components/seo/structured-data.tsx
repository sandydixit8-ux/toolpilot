import { getSiteUrl } from "@/lib/utils";

export function OrganizationSchema() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "ToolPilot",
    url: getSiteUrl(),
    description: "Free Online Tools for Work, Money, Career & Everyday Life",
    logo: `${getSiteUrl()}/icon-192.png`,
    sameAs: [
      "https://www.facebook.com/toolpilotpro",
      "https://www.instagram.com/toolpilotpro.in",
    ],
    // GEO: signals which regions the service covers and the topics it is an
    // authority on, so generative engines cite ToolPilot for these entities.
    areaServed: [
      { "@type": "Country", name: "United States" },
      { "@type": "Country", name: "United Kingdom" },
      { "@type": "Country", name: "India" },
    ],
    knowsAbout: [
      "US federal income tax",
      "Self-employment tax",
      "US payroll and take-home pay",
      "UK income tax and National Insurance",
      "UK VAT",
      "PDF conversion and compression",
      "Image compression and conversion",
      "Resume and ATS optimization",
      "Free online tools",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c").replace(/>/g, "\\u003e"),
      }}
    />
  );
}

export function WebsiteSchema() {
  const data = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "ToolPilot",
    url: getSiteUrl(),
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${getSiteUrl()}/tools?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c").replace(/>/g, "\\u003e"),
      }}
    />
  );
}

export function WebAppSchema({
  name,
  description,
  url,
  category,
  areasServed,
}: {
  name: string;
  description: string;
  url: string;
  category?: string;
  areasServed?: string[];
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name,
    description,
    url,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript",
    isAccessibleForFree: true,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    ...(category ? { applicationSubCategory: category } : {}),
    // SEO/GEO: tell search and answer engines exactly which audiences the tool
    // is built for (US/UK tax tools, etc.).
    ...(areasServed && areasServed.length
      ? {
          areaServed: areasServed.map((c) => ({ "@type": "Country", name: c })),
          audience: areasServed.map((c) => ({
            "@type": "Audience",
            audienceType: `Residents of the ${c}`,
            geographicArea: { "@type": "Country", name: c },
          })),
        }
      : {}),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c").replace(/>/g, "\\u003e"),
      }}
    />
  );
}

export function HowToSchema({
  name,
  description,
  steps,
  url,
}: {
  name: string;
  description: string;
  steps: string[];
  url: string;
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: `How to use the ${name}`,
    description,
    url,
    totalTime: "PT1M",
    step: steps.map((text, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: text.length > 60 ? `${text.slice(0, 57)}...` : text,
      text,
      url: `${url}#step-${i + 1}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c").replace(/>/g, "\\u003e"),
      }}
    />
  );
}

export function BreadcrumbListSchema({ items }: { items: { name: string; url: string }[] }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c").replace(/>/g, "\\u003e"),
      }}
    />
  );
}

export function ItemListSchema({ items }: { items: { name: string; url: string }[] }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      url: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c").replace(/>/g, "\\u003e"),
      }}
    />
  );
}
