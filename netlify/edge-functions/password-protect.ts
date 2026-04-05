import type { Context, Config } from "@netlify/edge-functions";

const COOKIE_NAME = "site_access_token";
const COOKIE_MAX_AGE = 60 * 60 * 24; // 24 hours

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function verifyToken(token: string, password: string): Promise<boolean> {
  const expectedHash = await hashPassword(password);
  const expectedToken = await hashPassword(expectedHash + password);
  return token === expectedToken;
}

async function createToken(password: string): Promise<string> {
  const passwordHash = await hashPassword(password);
  return await hashPassword(passwordHash + password);
}

function renderPage(bodyContent: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Password Required</title>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Inter', sans-serif;
      background: hsl(240 10% 6%);
      color: hsl(40 20% 95%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem;
      -webkit-font-smoothing: antialiased;
    }
    .card {
      background: linear-gradient(145deg, hsl(240 10% 11%) 0%, hsl(240 10% 8%) 100%);
      border: 1px solid hsl(240 8% 18%);
      border-radius: 0.75rem;
      padding: 2.5rem;
      max-width: 420px;
      width: 100%;
      box-shadow: 0 20px 50px -20px hsl(0 0% 0% / 0.5);
    }
    h1 {
      font-family: 'Playfair Display', serif;
      font-size: 1.75rem;
      font-weight: 600;
      margin-bottom: 0.5rem;
    }
    .accent { color: hsl(15 85% 65%); }
    .subtitle {
      color: hsl(240 8% 55%);
      font-size: 0.9rem;
      margin-bottom: 1.75rem;
      line-height: 1.5;
    }
    label {
      display: block;
      font-size: 0.85rem;
      font-weight: 500;
      margin-bottom: 0.5rem;
      color: hsl(40 20% 85%);
    }
    input[type="password"] {
      width: 100%;
      padding: 0.7rem 1rem;
      background: hsl(240 10% 6%);
      border: 1px solid hsl(240 8% 18%);
      border-radius: 0.5rem;
      color: hsl(40 20% 95%);
      font-family: 'Inter', sans-serif;
      font-size: 0.95rem;
      outline: none;
      transition: border-color 0.3s ease;
    }
    input[type="password"]:focus {
      border-color: hsl(15 85% 65%);
    }
    button {
      width: 100%;
      margin-top: 1.25rem;
      padding: 0.75rem 1rem;
      background: linear-gradient(135deg, hsl(15 85% 65%) 0%, hsl(25 90% 55%) 100%);
      color: hsl(240 10% 6%);
      font-family: 'Inter', sans-serif;
      font-size: 0.95rem;
      font-weight: 600;
      border: none;
      border-radius: 0.5rem;
      cursor: pointer;
      transition: opacity 0.3s ease, transform 0.2s ease;
    }
    button:hover { opacity: 0.9; transform: translateY(-1px); }
    button:active { transform: translateY(0); }
    .error {
      background: hsl(0 84% 60% / 0.12);
      border: 1px solid hsl(0 84% 60% / 0.3);
      color: hsl(0 84% 72%);
      padding: 0.65rem 1rem;
      border-radius: 0.5rem;
      font-size: 0.85rem;
      margin-bottom: 1.25rem;
    }
    .icon {
      width: 48px;
      height: 48px;
      background: hsl(15 85% 65% / 0.12);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 1.25rem;
    }
    .icon svg { width: 24px; height: 24px; stroke: hsl(15 85% 65%); fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
  </style>
</head>
<body>
  ${bodyContent}
</body>
</html>`;
}

function renderPasswordForm(error?: string): string {
  const errorHtml = error
    ? `<div class="error">${error}</div>`
    : "";

  return renderPage(`
  <div class="card">
    <div class="icon">
      <svg viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
    </div>
    <h1>Password <span class="accent">Required</span></h1>
    <p class="subtitle">This page is password-protected. Enter the password to continue.</p>
    ${errorHtml}
    <form method="POST">
      <label for="password">Password</label>
      <input type="password" id="password" name="password" placeholder="Enter password" required autofocus />
      <button type="submit">Unlock Page</button>
    </form>
  </div>`);
}

function renderNotConfigured(): string {
  return renderPage(`
  <div class="card">
    <div class="icon">
      <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
    </div>
    <h1>Not <span class="accent">Configured</span></h1>
    <p class="subtitle">This page is not yet configured. The site owner needs to set the PROTECTED_PAGE_PASSWORD environment variable.</p>
  </div>`);
}

export default async (req: Request, context: Context) => {
  const url = new URL(req.url);

  // Handle logout
  if (url.pathname === "/__logout") {
    context.cookies.delete({ name: COOKIE_NAME, path: "/" });
    return new Response(null, {
      status: 302,
      headers: { Location: "/" },
    });
  }

  const password = Netlify.env.get("PROTECTED_PAGE_PASSWORD");

  // Fail closed: if no password is configured, block access entirely
  if (!password) {
    return new Response(renderNotConfigured(), {
      status: 503,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }

  // Check for valid session cookie
  const token = context.cookies.get(COOKIE_NAME);
  if (token) {
    const valid = await verifyToken(token, password);
    if (valid) {
      // Authenticated — let the request through
      return;
    }
    // Invalid token — clear it
    context.cookies.delete({ name: COOKIE_NAME, path: "/" });
  }

  // Handle password submission
  if (req.method === "POST") {
    try {
      const formData = await req.formData();
      const submittedPassword = formData.get("password")?.toString() || "";

      const submittedHash = await hashPassword(submittedPassword);
      const expectedHash = await hashPassword(password);

      if (submittedHash === expectedHash) {
        const sessionToken = await createToken(password);
        context.cookies.set({
          name: COOKIE_NAME,
          value: sessionToken,
          path: "/",
          httpOnly: true,
          secure: true,
          sameSite: "Strict",
          expires: new Date(Date.now() + COOKIE_MAX_AGE * 1000),
        });
        return new Response(null, {
          status: 302,
          headers: { Location: url.pathname },
        });
      }

      return new Response(renderPasswordForm("Incorrect password. Please try again."), {
        status: 401,
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });
    } catch {
      return new Response(renderPasswordForm("Something went wrong. Please try again."), {
        status: 400,
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });
    }
  }

  // Show password form for GET requests
  return new Response(renderPasswordForm(), {
    status: 401,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
};

export const config: Config = {
  path: "/*",
  excludedPath: ["/__logout"],
};
