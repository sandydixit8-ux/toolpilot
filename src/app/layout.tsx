import type { Metadata } from "next";
import Script from "next/script";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CookieConsent } from "@/components/ui/cookie-consent";
import { Providers } from "@/components/providers";
import { I18nProvider } from "@/components/i18n";
import { TipJar } from "@/components/revenue/tip-jar";
import { AnchorAd } from "@/components/ads/ad-banner";
import { OrganizationSchema, WebsiteSchema } from "@/components/seo/structured-data";
import { SITE_NAME, SITE_TAGLINE, SITE_URL } from "@/lib/constants";
import { ADS, ADS_ENABLED, ADSENSE_PUBLISHER_ID } from "@/config/ads";
import "./globals.css";

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
        {ADS_ENABLED && ADSENSE_PUBLISHER_ID && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_PUBLISHER_ID}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
        {GA_ID && (
          <>
            <Script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script
              id="google-analytics"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${GA_ID}', {
                    page_title: document.title,
                    page_location: window.location.href,
                  });
                `,
              }}
            />
          </>
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
        <Script
          id="impact-affiliate"
          type="text/javascript"
          dangerouslySetInnerHTML={{
            __html: `(function(i,m,p,a,c,t){c.ire_o=p;c[p]=c[p]||function(){(c[p].a=c[p].a||[]).push(arguments)};t=a.createElement(m);var z=a.getElementsByTagName(m)[0];t.async=1;t.src=i;z.parentNode.insertBefore(t,z)})('https://utt.impactcdn.com/P-A7667765-027d-4552-80f9-8cd99ed154141.js','script','impactStat',document,window);impactStat('transformLinks');impactStat('trackImpression');`,
          }}
        />
      </head>
      <body className="min-h-screen bg-background antialiased">
        <Providers>
          <I18nProvider>
            <Header />
            <main id="main-content" className="flex-1">{children}</main>
            <Footer />
            <CookieConsent />
            <TipJar />
            {ADS_ENABLED && ADS.anchor && <AnchorAd slotId={ADS.anchor} />}
          </I18nProvider>
        </Providers>
      </body>
    </html>
  );
}
