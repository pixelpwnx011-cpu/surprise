# A Little Birthday Surprise 🎂

A polished React + TypeScript + Vite birthday countdown site, configured for **4 November 2026 at 12:00 AM India Standard Time**. The frontend automatically unlocks using an absolute UTC timestamp. A separate Cloudflare Worker protects the Google Drive destination in a server-side secret and independently enforces the unlock time.

## Quick start

Requirements: Node.js 20+ and npm.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite (normally `http://localhost:5173`).

Create and verify a production build:

```bash
npm run build
npm run preview
```

## Customize the page

Edit only `src/config.ts` for everyday changes:

- `friendName`, `nickname`
- `headingBefore`, `headingAfter`, `subtitle`, `intro`
- `birthdayNote` (use blank lines for paragraphs; line breaks are preserved)
- `footerText`, `decorativeText`
- `theme` color values
- `redirectEndpoint` (the public Cloudflare Worker endpoint, not your Drive URL)

Use `{name}` and `{nickname}` placeholders in messages. The current sample is written for Mayank / Manku; replace it as needed.

The unlock instant is stored as `2026-11-03T18:30:00.000Z`, which is exactly **2026-11-04 00:00:00 Asia/Kolkata (UTC+05:30)**. Do not replace it with a browser-local date string. The app compares epoch timestamps, so visitors in any timezone see the same unlock instant.

## Secure Google Drive redirect (recommended)

GitHub Pages is static hosting. It cannot keep a URL secret. Any destination needed by frontend JavaScript can be discovered in page source, bundled files, DevTools, or network requests. Base64, minification and obfuscation do not solve this.

This project includes `worker/`, a Cloudflare Worker backend:

1. Create a Cloudflare account and install Wrangler (`npm install -g wrangler`).
2. Open a terminal in `worker/` and run `wrangler login`.
3. Set the Drive destination as a Cloudflare secret:
   `wrangler secret put DRIVE_URL`
   Paste the Google Drive share URL when prompted.
4. Deploy with `wrangler deploy`.
5. Copy the Worker endpoint, usually `https://birthday-surprise-redirect.<your-subdomain>.workers.dev/open`.
6. Set `redirectEndpoint` in `src/config.ts` to that endpoint, then rebuild/deploy the frontend.

The Worker rejects requests before the unlock instant with HTTP 403 and redirects after it with HTTP 302. It accepts only HTTPS URLs hosted on `drive.google.com` or `docs.google.com`. See `worker/README.md`.

Important: the destination is not in the frontend source, but the visitor will see the Drive URL after the redirect. That is unavoidable for a normal browser redirect. The Worker protects it from casual source inspection and prevents pre-birthday access; it cannot conceal it from the person opening the surprise.

## GitHub Pages deployment

1. Extract this ZIP and create a new GitHub repository.
2. Upload the project contents (the files inside this folder, not the enclosing folder) and push them to the `main` branch.
3. In GitHub, open **Settings → Pages**.
4. Under **Build and deployment**, choose **GitHub Actions** as the source.
5. The included `.github/workflows/deploy.yml` builds and deploys on every push to `main`.
6. Wait for the workflow to finish. GitHub Pages will show the published URL in the Pages settings and workflow summary.

Vite automatically uses `/<repository-name>/` as its base path in the GitHub Actions build. For a user/organization site (`username.github.io`) or custom domain, set `VITE_BASE_PATH=/` in the workflow build environment or change the `base` logic in `vite.config.ts` accordingly.

## Countdown testing

The production date is fixed and must not be changed for normal use. The countdown uses `Date.now()` against the absolute UTC timestamp and refreshes four times per second, while displaying whole seconds. It clamps at zero, unlocks automatically without a refresh, and stays unlocked after reload because the state is derived from the real current time.

For a safe local UI test without changing the production date, use your browser DevTools console on the local development server:

```js
// Local-only simulation: set the browser clock to just after the real unlock instant,
// then refresh. Restore your system clock when finished.
```

There is intentionally no public query-string switch or editable test flag. A client-only test switch can be accidentally shipped and spoofed. To test the Worker before the real date, deploy a separate temporary Worker with a temporary `UNLOCK_AT` value and a non-sensitive test Drive URL; never alter the production Worker secret or production unlock date for testing.

## Project structure

```text
.
├── .github/workflows/deploy.yml
├── index.html
├── package.json
├── src/
│   ├── App.tsx
│   ├── config.ts
│   ├── confetti.ts
│   ├── main.tsx
│   └── styles.css
├── worker/
│   ├── README.md
│   ├── wrangler.toml
│   └── src/index.js
├── tsconfig*.json
└── vite.config.ts
```

## Accessibility and performance notes

- Semantic sections, descriptive countdown label, button disabled state and keyboard-operable anchor navigation.
- Respects `prefers-reduced-motion`.
- Lightweight CSS animations and a small canvas confetti effect; no image assets or animation framework required.
- Google Fonts are loaded remotely; system fallbacks remain available if offline.