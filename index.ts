// supabase/functions/github-proxy/index.ts
//
// Proxies read-only GitHub API requests (releases, rate_limit) using a
// server-side Personal Access Token, so the token never reaches the browser
// and the site benefits from the 5000/hour authenticated rate limit
// instead of the 60/hour unauthenticated one.
//
// Deploy with:
//   supabase functions deploy github-proxy
//
// Set the secret with:
//   supabase secrets set GITHUB_PAT=your_token_here

import { serve } from "https://deno.land/std@0.203.0/http/server.ts";

const GITHUB_REPO = "Systems-Download/Systems-Download.github.io";
const GITHUB_PAT = Deno.env.get("GITHUB_PAT");

// Only these paths are allowed to be proxied — keeps this function
// strictly read-only and scoped to what the site actually needs.
const ALLOWED_PATHS = new Set(["releases", "rate_limit"]);

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS_HEADERS });
  }

  if (req.method !== "GET") {
    return new Response(JSON.stringify({ error: "Only GET is allowed" }), {
      status: 405,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }

  if (!GITHUB_PAT) {
    return new Response(
      JSON.stringify({ error: "GITHUB_PAT secret is not configured" }),
      { status: 500, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } },
    );
  }

  try {
    const url = new URL(req.url);
    // ?path=releases  or  ?path=rate_limit
    const path = url.searchParams.get("path") || "releases";
    const perPage = url.searchParams.get("per_page") || "50";

    if (!ALLOWED_PATHS.has(path)) {
      return new Response(JSON.stringify({ error: "Path not allowed" }), {
        status: 400,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      });
    }

    const githubUrl =
      path === "rate_limit"
        ? "https://api.github.com/rate_limit"
        : `https://api.github.com/repos/${GITHUB_REPO}/releases?per_page=${perPage}`;

    const ghRes = await fetch(githubUrl, {
      headers: {
        Authorization: `token ${GITHUB_PAT}`,
        Accept: "application/vnd.github+json",
        "User-Agent": "conch-cmdr-proxy",
      },
    });

    const body = await ghRes.text();

    return new Response(body, {
      status: ghRes.status,
      headers: {
        ...CORS_HEADERS,
        "Content-Type": "application/json",
        // Small cache window — cuts down on repeated calls when many
        // visitors load the page around the same time, without ever
        // showing stale data for more than a minute.
        "Cache-Control": "public, max-age=30",
      },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }
});
