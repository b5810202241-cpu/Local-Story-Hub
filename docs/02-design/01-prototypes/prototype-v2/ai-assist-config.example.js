// Template — copy this file to "ai-assist-config.js" (same folder) and set the real
// Cloudflare Worker URL after you deploy it (see ../../../../cf-worker/README.md).
//
// Since the Part 3 AI-proxy migration (2026-09-23) this file no longer holds a secret —
// the OpenRouter API key lives only as a Cloudflare Worker secret now, never in the
// browser. This URL is safe to commit/deploy; it's just the proxy's public address,
// protected by Firebase ID token verification inside the Worker itself.
window.LSH_AI_PROXY_URL = "https://lsh-ai-proxy.YOUR_SUBDOMAIN.workers.dev";
