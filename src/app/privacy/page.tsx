import type { Metadata } from "next";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "ToolPilot's privacy policy. Learn how we handle your data, files, and personal information — including browser-based and server-based processing.",
  alternates: { canonical: `${SITE_URL}/privacy` },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8 prose dark:prose-invert">
      <h1>Privacy Policy</h1>
      <p><em>Last updated: September 21, 2026</em></p>
      <p>
        ToolPilot (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) operates the ToolPilot website (www.toolpilotpro.in).
        This page explains what information we collect, how we use it, and the choices you have. By using our
        services you agree to the practices described here.
      </p>

      <h2>Information We Collect</h2>
      <p>
        We do not require an account and we do not collect personal information unless you voluntarily provide it.
        We collect only:
      </p>
      <ul>
        <li><strong>Contact form submissions</strong> — the name, email address and message you submit when you contact us, so we can respond.</li>
        <li><strong>Newsletter subscriptions</strong> — the email address you choose to subscribe with.</li>
        <li><strong>Anonymized analytics</strong> — if analytics is enabled, aggregate usage data that does not identify you as an individual.</li>
      </ul>

      <h2>File and Text Processing</h2>
      <p>
        <strong>Browser-based tools.</strong> Most of our tools (PDF merging, compressing, image tools, calculators,
        JSON formatting, Base64, QR codes, resume analysis, and more) run entirely in your browser using technologies
        such as WebAssembly and the Canvas API. Your files and text never leave your device for these tools.
      </p>
      <p>
        <strong>Server-based tools.</strong> A small number of tools process your input on our servers:
      </p>
      <ul>
        <li><strong>PDF ↔ Word conversion and PDF → JPG</strong> — your file is transmitted over an encrypted connection to our conversion service, processed, and the temporary upload is not stored or retained beyond processing the request.</li>
        <li><strong>Text translation</strong> — the text you submit is sent to a third-party translation provider (MyMemory) to produce the translation.</li>
        <li><strong>Hindi transliteration</strong> — the text you submit is sent to Google&apos;s transliteration service to produce the Devanagari output.</li>
      </ul>
      <p>
        For these tools your file or text is used solely to produce the result you request. We do not store the
        contents, use them for training, or share them beyond the providers named above.
      </p>

      <h2>Cookies</h2>
      <p>
        We use an essential cookie to remember your theme preference (such as dark mode). We do not place tracking
        cookies without your consent. Our cookie banner asks for your choice, and you can change it any time. See
        our <a href="/cookies">Cookie Policy</a> for details.
      </p>

      <h2>Analytics</h2>
      <p>
        If we enable web analytics (such as Google Analytics), we collect anonymized, aggregate statistics —
        pages visited, approximate country, device type, and referral source — to understand how the site is used
        and to improve it. This data does not identify individual users.
      </p>

      <h2>Advertising</h2>
      <p>
        We may display advertising through third-party advertising networks, including Google AdSense. These
        networks may use cookies and similar technologies to serve ads that are relevant to you and to measure
        ad performance. Google, as a third-party vendor, may use cookies (including the DoubleClick cookie) to serve
        ads based on your visits to this and other websites. You can opt out of personalized advertising through
        <a href="https://www.google.com/settings/ads" rel="noopener noreferrer" target="_blank"> Google Ads Settings</a>,
        or through <a href="https://www.aboutads.info/choices/" rel="noopener noreferrer" target="_blank">www.aboutads.info</a>.
        Where required by law (including the EEA, UK and Switzerland), personalized advertising is only shown with your consent.
      </p>

      <h2>Affiliate Links</h2>
      <p>
        Some pages mention products we recommend through affiliate programs. If you purchase via these links we may
        earn a small commission at no extra cost to you. Affiliate networks may use cookies to attribute the referral,
        and do not see the contents of your files.
      </p>

      <h2>Third-Party Services</h2>
      <p>
        We use limited third-party providers to deliver our features: document conversion, translation and
        transliteration services (described above), and advertising networks (if enabled). Each provider processes
        data under its own privacy policy for the sole purpose of providing the service.
      </p>

      <h2>Data Retention</h2>
      <p>
        Contact messages and newsletter emails are retained only as long as needed to respond to you or as long as
        your subscription is active, after which they are deleted. Uploaded files for server-processed tools are not
        retained beyond the processing of your request.
      </p>

      <h2>Security</h2>
      <p>
        Data in transit is protected with HTTPS encryption. We follow reasonable security practices to protect any
        information you voluntarily share with us.
      </p>

      <h2>Children&apos;s Privacy</h2>
      <p>
        Our services are not directed to children under 13, and we do not knowingly collect personal information from them.
      </p>

      <h2>Your Rights</h2>
      <p>
        You may request access, correction, or deletion of the personal information you have provided to us, and you
        can object to our processing. To exercise any of these rights, contact us through our{" "}
        <a href="/contact">contact page</a>.
      </p>

      <h2>Changes to This Policy</h2>
      <p>
        We may update this policy from time to time. When we do, we will revise the &quot;Last updated&quot; date at
        the top of this page. Please review it periodically.
      </p>

      <h2>Contact</h2>
      <p>
        If you have questions about this Privacy Policy, please contact us via our{" "}
        <a href="/contact">contact page</a> or email{" "}
        <a href="mailto:support@toolpilotpro.in">support@toolpilotpro.in</a>.
      </p>
    </div>
  );
}