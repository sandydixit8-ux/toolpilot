import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CookieConsent } from "@/components/ui/cookie-consent";
import { ConverterWarmer } from "@/components/converter-warmer";
import { PageViewTracker } from "@/components/analytics/page-view-tracker";
import { Analytics } from "@/components/analytics/analytics";
import { Providers } from "@/components/providers";
import { I18nProvider } from "@/components/i18n";
import { TipJar } from "@/components/revenue/tip-jar";
import { AnchorAd } from "@/components/ads/ad-banner";
import { OrganizationSchema, WebsiteSchema } from "@/components/seo/structured-data";
import { SITE_NAME, SITE_TAGLINE, SITE_URL } from "@/lib/constants";
import { ADS, ADS_ENABLED, ADSENSE_PUBLISHER_ID } from "@/config/ads";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

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
  verification: {
    google: "Iuf4EIea_e6ZG2VDtkP2tS05up77lUBGPZysNY40p38",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* RSS autodiscovery. Declared here rather than in metadata because
            every page overrides `alternates` with its own canonical, which
            would drop the feed link. */}
        <link
          rel="alternate"
          type="application/rss+xml"
          title={`${SITE_NAME} Blog`}
          href={`${SITE_URL}/feed.xml`}
        />
        {ADS_ENABLED && ADSENSE_PUBLISHER_ID && (
          <>
            <meta name="google-adsense-account" content={ADSENSE_PUBLISHER_ID} />
            <link rel="preconnect" href="https://pagead2.googlesyndication.com" crossOrigin="anonymous" />
            <link rel="preconnect" href="https://adservice.google.com" crossOrigin="anonymous" />
            <Script
              async
              src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_PUBLISHER_ID}`}
              crossOrigin="anonymous"
              strategy="afterInteractive"
            />
          </>
        )}
        {GA_ID && (
          <>
            <link rel="preconnect" href="https://www.googletagmanager.com" crossOrigin="anonymous" />
            <link rel="preconnect" href="https://www.google-analytics.com" crossOrigin="anonymous" />
          </>
        )}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var stored = localStorage.getItem('theme');
                  var root = document.documentElement;
                  root.classList.remove('light', 'dark');
                  if (stored === 'system') {
                    root.classList.add(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
                  } else if (stored === 'light') {
                    root.classList.add('light');
                  } else {
                    root.classList.add('dark');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
        <OrganizationSchema />
        <WebsiteSchema />
        <link rel="preconnect" href="https://utt.impactcdn.com" crossOrigin="anonymous" />
      </head>
      <body className={`${inter.variable} min-h-screen bg-background text-foreground antialiased`}>
        <Providers>
          <I18nProvider>
            <Header />
            <main id="main-content" className="flex-1">{children}</main>
            <Footer />
            <ConverterWarmer />
            <PageViewTracker />
            <Analytics />
            <CookieConsent />
            <TipJar />
            {ADS_ENABLED && ADS.anchor && <AnchorAd slotId={ADS.anchor} />}
          </I18nProvider>
        </Providers>
      </body>
    </html>
  );
}
