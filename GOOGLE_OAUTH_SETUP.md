# Google OAuth Setup Guide for ToolPilot

## Step 1: Go to Google Cloud Console

Open your browser and go to:
```
https://console.cloud.google.com
```

Sign in with your Google account.

---

## Step 2: Create a New Project

1. At the top-left, click the **project dropdown** (next to "Google Cloud")
2. Click **New Project**
3. Name it: `ToolPilot`
4. Click **Create**
5. Wait 30 seconds, then select the new project from the dropdown

---

## Step 3: Enable the People API

1. In the left sidebar, go to **APIs & Services** → **Library**
2. Search for `People API`
3. Click on it, then click **Enable**

---

## Step 4: Configure OAuth Consent Screen

1. Go to **APIs & Services** → **OAuth consent screen**
2. Select **External**, click **Create**
3. Fill in:
   - **App name**: `ToolPilot`
   - **User support email**: your email
   - **Developer contact email**: your email
4. Click **Save and Continue**
5. On **Scopes** page, click **Add or Remove Scopes**
6. Select these scopes:
   - `email`
   - `profile`
   - `openid`
7. Click **Update**, then **Save and Continue**
8. On **Test users** page, click **Add Users**
9. Enter your Google email address (the one you'll login with)
10. Click **Add**, then **Save and Continue**
11. Click **Back to Dashboard**

---

## Step 5: Create OAuth Credentials

1. Go to **APIs & Services** → **Credentials**
2. Click **+ Create Credentials** → **OAuth client ID**
3. Application type: **Web application**
4. Name: `ToolPilot`
5. Under **Authorized redirect URIs**, click **+ Add URI** and enter:
   ```
   https://toolpilot-yoc8.vercel.app/api/auth/callback/google
   ```
6. Click **Create**
7. A popup shows your **Client ID** and **Client Secret**
8. **Copy both values** and save them somewhere safe

Example format:
```
Client ID:     123456789-abcdefg.apps.googleusercontent.com
Client Secret: GOCSPX-abcdefghijklmnop
```

---

## Step 6: Add to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Select your `toolpilot-in` project
3. Go to **Settings** → **Environment Variables**
4. Add two new variables:

| Name | Value |
|------|-------|
| `GOOGLE_CLIENT_ID` | Your Client ID from Step 5 |
| `GOOGLE_CLIENT_SECRET` | Your Client Secret from Step 5 |

5. For each, make sure **Production**, **Preview**, and **Development** are all checked
6. Click **Save**
7. Go to **Deployments** tab
8. Click the **three dots** on the latest deployment → **Redeploy**

---

## Step 7: Add to Local .env

Open `.env` in your project folder and add these two lines at the end:

```
GOOGLE_CLIENT_ID=123456789-abcdefg.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-abcdefghijklmnop
```

Replace with your actual values from Step 5.

---

## Step 8: Test Locally

1. Run the dev server:
   ```
   npm run dev
   ```
2. Open `http://localhost:3000/auth/login`
3. You should see a **"Sign in with Google"** button
4. Click it — you'll be redirected to Google
5. Sign in with the Google account you added as a test user
6. You should be redirected back to `/admin`

---

## Step 9: Test on Production

After Vercel finishes redeploying:

1. Go to `https://toolpilot-yoc8.vercel.app/auth/login`
2. You should see the **"Sign in with Google"** button
3. Click it and sign in
4. You'll be logged in as a regular USER

---

## Step 10: Make Yourself an Admin

After your first Google login, you need admin access. Run this in your terminal:

```bash
npx prisma studio
```

This opens a database browser. Find the **User** table, find your Google email, and change the `role` field from `USER` to `SUPER_ADMIN`.

Or run this SQL directly in Neon console:

```sql
UPDATE "User" SET role = 'SUPER_ADMIN' WHERE email = 'your-google-email@gmail.com';
```

---

## Troubleshooting

### "Redirect URI mismatch" error
- The redirect URI in Google Cloud Console must exactly match:
  - `https://toolpilot-yoc8.vercel.app/api/auth/callback/google`
- No trailing slash, no extra characters

### "Access blocked" error
- Your Google account must be added as a test user in Step 4
- While the app is in "Testing" mode, only test users can login

### Button doesn't appear
- Check that `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are set in Vercel
- Redeploy after adding env vars

### Login works but can't access admin
- Your role is `USER` by default
- Follow Step 10 to make yourself `SUPER_ADMIN`
