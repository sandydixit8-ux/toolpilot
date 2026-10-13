import http from "node:http";
import { URL } from "node:url";

const CLIENT_ID = process.env.YT_CLIENT_ID;
const CLIENT_SECRET = process.env.YT_CLIENT_SECRET;
const PORT = Number(process.env.YT_PORT || 4519);
const REDIRECT = `http://localhost:${PORT}/oauth2callback`;
const SCOPE = "https://www.googleapis.com/auth/youtube.upload";

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error("Pehle set karo:  $env:YT_CLIENT_ID='...'; $env:YT_CLIENT_SECRET='...'");
  process.exit(1);
}

const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
authUrl.searchParams.set("client_id", CLIENT_ID);
authUrl.searchParams.set("redirect_uri", REDIRECT);
authUrl.searchParams.set("response_type", "code");
authUrl.searchParams.set("scope", SCOPE);
authUrl.searchParams.set("access_type", "offline");
authUrl.searchParams.set("prompt", "consent");

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, REDIRECT);
  if (url.pathname !== "/oauth2callback") {
    res.writeHead(404);
    res.end();
    return;
  }
  const code = url.searchParams.get("code");
  if (!code) {
    res.writeHead(400, { "Content-Type": "text/html" });
    res.end("<h2>Code missing.</h2>");
    return;
  }
  res.writeHead(200, { "Content-Type": "text/html" });
  res.end("<h2>Ho gaya. Ye tab band karke terminal par wapas jao.</h2>");

  try {
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        redirect_uri: REDIRECT,
        grant_type: "authorization_code",
      }),
    });
    const tok = await tokenRes.json();
    if (!tokenRes.ok || !tok.refresh_token) {
      console.error("Token exchange failed:", tok);
      process.exit(1);
    }
    console.log("\n=== SUCCESS ===");
    console.log("YT_CLIENT_ID     = " + CLIENT_ID);
    console.log("YT_CLIENT_SECRET = " + CLIENT_SECRET);
    console.log("YT_REFRESH_TOKEN = " + tok.refresh_token);
    console.log("\nYe teen GitHub repo secrets me add karo (Settings > Secrets and variables > Actions).");
  } finally {
    server.close();
  }
});

server.listen(PORT, () => {
  console.log("Steps:");
  console.log("1. Google Cloud Console me project banao, 'YouTube Data API v3' enable karo.");
  console.log("2. OAuth consent screen > External, apne Google account ko 'Test users' me add karo.");
  console.log("3. Credentials > Create credentials > OAuth client ID > Application type: Desktop app.");
  console.log("4. Neeche wala URL browser me kholo aur usi Google account se login karo:\n");
  console.log(authUrl.toString());
  console.log(`\nWaiting for redirect on ${REDIRECT} ...`);
});
