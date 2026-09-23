// NOT a secret anymore (see ai-assist-config.example.js for why) — still committed as its
// own file (rather than hardcoded in each HTML page) so deploying a new Worker only needs
// one line changed here. Placeholder below means "Worker not deployed yet" — every AI
// button falls back to a clear "AI backend ยังไม่พร้อมใช้งาน" message until this is set.
window.LSH_AI_PROXY_URL = "https://lsh-ai-proxy.YOUR_SUBDOMAIN.workers.dev";
