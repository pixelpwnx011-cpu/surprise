# Cloudflare Worker redirect

This Worker keeps the Google Drive destination out of the public GitHub Pages source. The destination is stored as a Cloudflare secret and only emitted as a redirect after the server-side birthday check.

## Deploy

1. Install Wrangler: `npm install -g wrangler`
2. From this folder, authenticate: `wrangler login`
3. Set the private destination (paste the full Google Drive share URL):
   `wrangler secret put DRIVE_URL`
4. Deploy: `wrangler deploy`
5. Copy the deployed Worker URL, for example `https://birthday-surprise-redirect.yourname.workers.dev/open`.
6. Paste that endpoint into `redirectEndpoint` in `../src/config.ts`, commit and push the frontend.

The unlock instant is configured in `wrangler.toml` as `UNLOCK_AT`. It is checked using the Worker server clock, not the visitor's clock.

## Verify

Before the unlock instant, `GET /open` should return HTTP 403. After it, the Worker should return HTTP 302 with a `Location` header pointing to your Drive URL. Do not test by setting the production unlock time to the past on a public Worker; use a separate temporary Worker/environment if you need an early redirect test.

The browser necessarily knows the Worker endpoint. It does not contain the Drive destination in its HTML, JS, CSS, or public configuration. Once the visitor follows the redirect, the destination will of course be visible to that visitor in their browser address bar/network tools. A redirect service cannot hide a destination from the person who receives it.