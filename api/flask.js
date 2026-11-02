// Same-origin, deployment-only bridge to the persistent Flask API.
module.exports = async function handler(req, res) {
  const backend = process.env.FLASK_BACKEND_URL;
  if (!backend) return res.status(503).json({ error: "Flask backend not configured" });
  const path = typeof req.query?.path === "string" ? req.query.path : "";
  let decoded;
  try { decoded = decodeURIComponent(path); } catch { return res.status(400).end(); }
  if (!decoded || decoded.includes("..") || decoded.startsWith("/") || decoded.includes("\\")) return res.status(400).end();
  const url = new URL(`/fb-api/${path}`, backend);
  for (const [key, value] of Object.entries(req.query ?? {})) {
    if (key !== "path" && typeof value === "string") url.searchParams.set(key, value);
  }
  const headers = {};
  for (const key of ["authorization", "content-type", "accept"]) {
    const value = req.headers[key];
    if (typeof value === "string") headers[key] = value;
  }
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 25000);
    try {
      const upstream = await fetch(url, {
        method: req.method,
        headers,
        body: ["GET", "HEAD"].includes(req.method || "GET") ? undefined : JSON.stringify(req.body || {}),
        signal: controller.signal,
        redirect: "manual",
      });
      res.status(upstream.status);
      const contentType = upstream.headers.get("content-type");
      if (contentType) res.setHeader("Content-Type", contentType);
      res.setHeader("Cache-Control", "no-store");
      return res.send(Buffer.from(await upstream.arrayBuffer()));
    } finally { clearTimeout(timeout); }
  } catch { return res.status(502).json({ error: "Flask backend unreachable" }); }
}
