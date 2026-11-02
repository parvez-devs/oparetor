// Vercel CommonJS bridge; the existing Express application remains unchanged.
// Load the .mjs bundle via native dynamic import, not require().
module.exports = async function handler(req, res) {
  if (!process.env.DATABASE_URL) {
    res.statusCode = 503;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.setHeader("Cache-Control", "no-store");
    return res.end(JSON.stringify({ status: "degraded", error: "Database not configured" }));
  }
  try {
    const { default: app } = await import("../artifacts/api-server/dist/app.mjs");
    return app(req, res);
  } catch (err) {
    console.error("Express initialization failed:", err?.name || "unknown");
    res.statusCode = 503;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.setHeader("Cache-Control", "no-store");
    return res.end(JSON.stringify({ status: "degraded", error: "API initialization failed" }));
  }
};
