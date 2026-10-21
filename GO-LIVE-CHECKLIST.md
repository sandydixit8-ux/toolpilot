# Go-Live Checklist

Everything in the code is deployed and verified. The items below need your
own browser logins (Vercel, Google, Microsoft, AdSense) — they cannot be done
from a terminal. Work top to bottom.

---

## 1. Microsoft Clarity (session recordings + heatmaps)

The code is already written and gated behind cookie consent. It activates as
soon as a project ID exists.

1. Go to https://clarity.microsoft.com and sign in (Microsoft or Google).
2. Click **New project**.
3. Name: `ToolPilotPro`. Site URL: `https://www.toolpilotpro.in`. Category: pick any.
4. After it is created, open the project and copy the **project ID** from the
   setup page (the value after `clarity.ms/tag/` in the snippet, 10 chars).
5. Vercel -> your project -> **Settings -> Environment Variables** -> Add:
   - Key: `NEXT_PUBLIC_CLARITY_ID`
   - Value: the ID you copied
   - Environments: Production, Preview, Development
6. **Redeploy** (Deployments -> latest -> ... -> Redeploy) so the new env var is picked up.
7. Test: open the site, click **Accept** on the cookie banner, browse a few pages.
   Then in Clarity -> **Recordings** you should see your session within a minute or two.

Verify from a terminal (should print the ID, not empty):

```powershell
gh api repos/sandydixit8-ux/toolpilot/contents/.env.example --jq '.content' | Out-Null
# check what the live tag loads (should return the clarity project id once deployed)
(Invoke-WebRequest https://www.toolpilotpro.in/ -UseBasicParsing).Content -match 'clarity'
```

---

## 2. GA4 Realtime

GA4 is live but now loads **only after consent** (GDPR/UK compliant).

1. Open https://www.toolpilotpro.in in a fresh private window.
2. Click **Accept** on the cookie banner.
3. Click around 2-3 pages.
4. In Google Analytics -> **Reports -> Realtime**, you should see yourself (1 active user).

If nothing shows: open browser DevTools -> Network, filter `gtag`, and confirm it
fires only after clicking Accept. Before Accept it must NOT fire (that is correct).

---

## 3. Google Trends keywords (US + UK)

Google Trends blocks datacenter IPs, so run this from your home/office network.

1. Open PowerShell in the repo folder.
2. Run:

   ```powershell
   npm run trends
   ```

3. It prints rising + top queries for the US and UK tax keywords.
4. Copy the best rising queries into the tax tool keywords in
   `src/config/tools-tax.ts` and to your blog outline.

If it still fails with 429, log into trends.google.com manually in the browser,
search the terms, and export the CSV.

---

## 4. Google Search Console

1. Go to https://search.google.com/search-console.
2. Confirm your property (`toolpilotpro.in`) is verified.
3. **Sitemaps** -> add `sitemap.xml` (it is live, 210 URLs).
4. **URL Inspection** -> paste each of these, click **Request Indexing**:
   - https://www.toolpilotpro.in/tools/us-tax-calculators
   - https://www.toolpilotpro.in/tools/uk-tax-calculators
   - https://www.toolpilotpro.in/blog/us-income-tax-calculator-guide-2025
   - https://www.toolpilotpro.in/blog/uk-income-tax-calculator-guide-2025-26
   - https://www.toolpilotpro.in/blog/self-employment-tax-calculator-guide-2025
5. After a week, check **Pages -> Not indexed** for problems.

---

## 5. PageSpeed Insights (save both reports)

1. Go to https://pagespeed.web.dev.
2. Test `https://www.toolpilotpro.in` on **Mobile**, then **Desktop**.
3. Save both PDFs. Target: LCP under 2.5s, CLS under 0.1, INP under 200ms.
4. If mobile LCP is poor, note the biggest opportunity and send it to me.

---

## 6. Google AdSense review

Do NOT click "I confirm I have fixed the issues" yet.

1. Wait until the new URLs are indexed (roughly 1-2 weeks after Search Console request).
2. Then in AdSense -> Sites, request a review.
3. After approval, the ad slot IDs in `src/config/ads.ts` need replacing — send them to me.

---

## 7. Vercel cleanup

You have two Vercel projects that both rebuild on every push
(`toolpilot` and `toolpilot-yoc8`). Delete the unused one to halve build minutes.

1. Vercel -> select the project that is NOT serving `toolpilotpro.in`.
2. Settings -> scroll to bottom -> **Delete Project**.

---

## 8. Uptime pinger (Render cold starts)

The blog DB and converter can cold-start. Set up a free external pinger:

1. Go to https://cron-job.org and sign up.
2. New cron job: URL `https://toolpilot-5b6c.onrender.com/health`.
3. Schedule: every 5 minutes.
4. Save. This keeps the service warm.

---

## Done when

- [ ] Clarity shows a test recording
- [ ] GA4 Realtime shows your test visit (after Accept)
- [ ] Trends keywords exported
- [ ] Search Console sitemap submitted + 5 URLs requested
- [ ] PageSpeed mobile + desktop saved
- [ ] AdSense review requested (after indexing)
- [ ] Unused Vercel project deleted
- [ ] cron-job.org pinger live
