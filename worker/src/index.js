const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Cache-Control": "no-store, no-cache, must-revalidate",
  "X-Content-Type-Options": "nosniff"
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders });
    }
    if (request.method !== "GET" || (url.pathname !== "/open" && url.pathname !== "/")) {
      return new Response("Not found", { status: 404, headers: corsHeaders });
    }

    const unlockAt = Date.parse(env.UNLOCK_AT || "2026-11-03T18:30:00.000Z");
    if (!Number.isFinite(unlockAt)) {
      return new Response("Server configuration error", { status: 500, headers: corsHeaders });
    }
    if (Date.now() < unlockAt) {
      return new Response("The birthday surprise is still locked. Come back at midnight IST!", {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "text/plain; charset=utf-8" }
      });
    }

    const destination = env.DRIVE_URL;
    if (!destination) {
      return new Response("Surprise destination is not configured.", {
        status: 503,
        headers: { ...corsHeaders, "Content-Type": "text/plain; charset=utf-8" }
      });
    }
    let parsed;
    try { parsed = new URL(destination); } catch {
      return new Response("Invalid destination configuration.", { status: 500, headers: corsHeaders });
    }
    if (parsed.protocol !== "https:" || !["drive.google.com", "docs.google.com"].includes(parsed.hostname)) {
      return new Response("Destination must be a Google Drive HTTPS URL.", { status: 500, headers: corsHeaders });
    }

    return new Response(null, {
      status: 302,
      headers: { ...corsHeaders, "Location": parsed.toString() }
    });
  }
};