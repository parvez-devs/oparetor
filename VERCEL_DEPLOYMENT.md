# XEROTIC-UID deployment notes

- Original application source is preserved. This package adds only an Express serverless entrypoint and Vercel configuration.
- **This alone is NOT a complete full-feature deployment**: the original Flask server (`artifacts/api-server/fb_server.py`) and its SQLite authentication and UID storage require a persistent service and database. Vercel functions do not offer durable local SQLite.
- Express `/api/fb` and `/api/admin` require a working PostgreSQL `DATABASE_URL` for the admin tracking module.
- The original UI has a hard-coded admin key; do not expose admin routes publicly as-is. Put authentication enforcement in front or refactor the admin key before production.
- The original `/fb-api/*` Flask endpoints are not routed by this Vercel adapter. Connect them only after a persistent Flask backend is configured.
- Set `DATABASE_URL`, `ADMIN_KEY`, `PORT`, `BASE_PATH` via Vercel environment variables, not in Git.
- For production run `pnpm install --frozen-lockfile`, `pnpm --filter @workspace/uid-web build`, then test `/api/healthz`, `/api/fb/uid/fetch`, `/api/admin/track`, login and saved UIDs before claiming readiness.
- No original runtime SQLite database, migrated data, cookies, passwords, or `.env` is included.
