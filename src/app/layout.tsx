import type { Metadata } from "next";
import Script from "next/script";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CookieConsent } from "@/components/ui/cookie-consent";
import { Providers } from "@/components/providers";
import { OrganizationSchema, WebsiteSchema } from "@/components/seo/structured-data";
import { SITE_NAME, SITE_TAGLINE, SITE_URL } from "@/lib/constants";
import "./globals.css";

const ADSENSE_ID = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID;
const ADS_ENABLED = process.env.NEXT_PUBLIC_ADS_ENABLED === "true";

export const metadata: Metadata = {
  title: {
    default: `${SITE_NAME} – ${SITE_TAGLINE}`,
    template: `%s | ${SITE_NAME}`,
  },
  description: "Fast, simple and privacy-friendly tools — no complicated software required.",
  metadataBase: new URL(SITE_URL),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: SITE_NAME,
    images: ["/og.png"],
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
  icons: {
    icon: "/favicon.svg",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {ADS_ENABLED && ADSENSE_ID && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_ID}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  var root = document.documentElement;
                  root.classList.add('light');
                  if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    root.classList.remove('light');
                    root.classList.add('dark');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
        <OrganizationSchema />
        <WebsiteSchema />
      </head>
      <body className="min-h-screen bg-background antialiased">
        <Providers>
          <Header />
          <main id="main-content" className="flex-1">{children}</main>
          <Footer />
          <CookieConsent />
        </Providers>
      </body>
    </html>
  );
}
