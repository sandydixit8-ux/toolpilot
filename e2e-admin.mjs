import { readFileSync } from "fs";
import { chromium } from "playwright";

const BASE = "https://www.toolpilotpro.in";

// Load admin creds from local .env WITHOUT printing them
const env = readFileSync(".env", "utf8");
function getEnv(key) {
  const m = env.match(new RegExp(`^${key}="?(.*?)"?$`, "m"));
  return m ? m[1] : "";
}
const ADMIN_EMAIL = getEnv("ADMIN_EMAIL") || "admin@toolpilot.in";
const testEmails = [ADMIN_EMAIL, "admin@toolpilot.in"];
const ADMIN_PASSWORD = getEnv("ADMIN_PASSWORD");

const report = { checks: [], errors: [] };
function check(name, pass, detail = "") {
  report.checks.push({ name, pass, detail });
  console.log(`${pass ? "PASS" : "FAIL"} ${name}${detail ? ` :: ${detail}` : ""}`);
}

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({
  userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36",
  viewport: { width: 1366, height: 900 },
});

// ---- Authenticated admin flow ----
const page = await ctx.newPage();
const consoleErrors = [];
const pageErrors = [];
page.on("console", (m) => { if (m.type() === "error") consoleErrors.push(m.text().slice(0, 300)); });
page.on("pageerror", (e) => pageErrors.push(e.message.slice(0, 300)));

let analyticsJson = null;
page.on("response", async (res) => {
  if (res.url().includes("/api/admin/analytics")) {
    try { analyticsJson = await res.json(); } catch { /* ignore */ }
  }
});

try {
  await page.goto(`${BASE}/auth/login`, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForTimeout(1500);
  check("login page renders", (await page.title()).includes("Login"), await page.title());

  let loginOk = false;
  for (const email of testEmails) {
    await page.fill("#email", email);
    await page.fill("#password", ADMIN_PASSWORD);
    await page.locator("form:has(input#email)").locator('button[type="submit"]').click();
    try {
      await page.waitForURL("**/admin", { timeout: 25000 });
      loginOk = true;
      break;
    } catch {
      // try next candidate
    }
  }
  check("admin login succeeds", loginOk, loginOk ? page.url() : "none of the candidate emails worked");

  await page.waitForTimeout(2000);

  // 1) /admin dashboard
  const adminText = (await page.locator("body").innerText()).slice(0, 1500);
  check("/admin renders", /admin/i.test(adminText) || /tool/i.test(adminText), adminText.slice(0, 120).replace(/\n/g, " "));
  check("/admin no page errors", pageErrors.length === 0, pageErrors.join(" | "));

  // 2) /admin/analytics + API
  await page.goto(`${BASE}/admin/analytics`, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForTimeout(5000);
  const anText = (await page.locator("body").innerText()).slice(0, 1500);
  check("analytics page renders", anText.includes("Analytics Dashboard"), anText.slice(0, 140).replace(/\n/g, " "));

  let analyticsShape = "no response captured";
  if (analyticsJson) {
    const has = ["tools", "blog", "contacts", "subscribers", "leads", "overview", "daily", "topTools", "events", "countries"]
      .every((k) => k in analyticsJson);
    const todayNum = typeof analyticsJson.overview?.today === "number";
    analyticsShape = `tools.total=${analyticsJson.tools?.total}, published=${analyticsJson.tools?.published}, blog=${analyticsJson.blog?.published}, subs=${analyticsJson.subscribers?.total}, today=${analyticsJson.overview?.today}, topTools=${analyticsJson.topTools?.length}`;
    check("analytics API shape", has && todayNum, analyticsShape);
  } else {
    check("analytics API shape", false, analyticsShape);
  }

  // 3) Other admin pages
  for (const p of ["/admin/revenue", "/admin/blog", "/admin/contacts", "/admin/subscribers", "/admin/newsletter"]) {
    try {
      const r = await page.goto(BASE + p, { waitUntil: "domcontentloaded", timeout: 60000 });
      await page.waitForTimeout(1500);
      const body = await page.locator("body").innerText();
      const hadError = body.includes("Application error") || body.includes("This page could not be found") || body.includes("Internal Server Error");
      check(`${p} renders (${r.status()})`, r.status() === 200 && !hadError, body.slice(0, 90).replace(/\n/g, " "));
    } catch (e) {
      check(`${p} renders`, false, `exception: ${e.message.slice(0, 120)}`);
    }
  }

  // 4) affiliate-clicks API
  try {
    const r = await ctx.request.get(`${BASE}/api/admin/affiliate-clicks`);
    let body = "no body";
    try { body = JSON.stringify(await r.json()).slice(0, 200); } catch { body = await r.text(); }
    check("affiliate-clicks API", r.status() === 200, `${r.status()} ${body}`);
  } catch (e) {
    check("affiliate-clicks API", false, e.message.slice(0, 120));
  }
} catch (e) {
  check("admin flow", false, `exception: ${e.message.slice(0, 200)}`);
}

// ---- Unauthenticated /admin/analytics behavior ----
const ctx2 = await browser.newContext({
  userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36",
});
const p2 = await ctx2.newPage();
const uaErrors = [];
p2.on("pageerror", (e) => uaErrors.push(e.message.slice(0, 200)));
try {
  const r = await p2.goto(`${BASE}/admin/analytics`, { waitUntil: "domcontentloaded", timeout: 60000 });
  await p2.waitForTimeout(4000);
  const body = (await p2.locator("body").innerText()).slice(0, 400);
  const failedMsg = body.includes("Failed to load analytics");
  const emptyMain = body.includes("Analytics Dashboard") ? body.slice(body.indexOf("Analytics Dashboard"), body.indexOf("Analytics Dashboard") + 120) : "";
  check("unauth /admin/analytics graceful", r.status() < 400 && uaErrors.length === 0, `status=${r.status()} pageerrors=${uaErrors.length} failedMsg=${failedMsg} :: ${emptyMain.replace(/\n/g, " ")}`);
} catch (e) {
  check("unauth /admin/analytics graceful", false, e.message.slice(0, 120));
}
await ctx2.close();

console.log("\nConsole errors (authed run):");
consoleErrors.slice(0, 10).forEach((c) => console.log("  ", c));
console.log("Page errors (authed run):");
pageErrors.forEach((e) => console.log("  ", e));

await browser.close();

console.log(`\nTOTAL: ${report.checks.filter((c) => c.pass).length}/${report.checks.length} PASS`);