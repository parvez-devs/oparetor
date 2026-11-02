# XEROTIC-UID full deployment

Original UI, Flask UID/auth endpoints, and Express Facebook fetch API are preserved. Only deployment bridge, credential handling, and sensitive event sanitization were changed.

1. Use a **new Git branch** `deploy/xerotic-uid` in `parvez-devs/oparetor`. Existing Render `uidzone` service auto-deploys `main` from the SAME repo; **do not push to main** without reconfiguring it. Existing `uidzone-bulk-staging` uses a different feature branch; keep both untouched.
2. Create Postgres using a persistent plan. A free Render Postgres instance expires and is not suitable for durable production data. Apply `postgres-init.sql` to it. The Flask models create their own tables on boot.
3. Launch a **new** Render Python service from branch `deploy/xerotic-uid`, build `pip install -r requirements.txt`, start `gunicorn --chdir artifacts/api-server --bind 0.0.0.0:$PORT --workers 2 --threads 8 --timeout 120 fb_server:app`. Configure `FLASK_DATABASE_URL` and a long random `JWT_SECRET` as protected env vars; `SITE_ORIGIN=https://oparetor.xerotic.top`. Do not put database credentials in Git.
4. Vercel production branch should be `deploy/xerotic-uid`; set `BASE_PATH=/`, `PORT=3000`, `DATABASE_URL` (Postgres external SSL), `ADMIN_KEY` (strong random, >=24 chars), `FLASK_BACKEND_URL=https://<persistent-service>.onrender.com`. Configure frontend as Vite, build `pnpm --filter @workspace/uid-web build`, output `artifacts/uid-web/dist/public`.
5. Verify `/api/healthz`, admin 401 without header and 200 with correct key, `GET /fb-api/`, authentication, saving UID data after restart, PostgreSQL track events, and actual public UID fetch (success depends on upstream service). Ensure HTTPS certificate and no browser console error.
6. ZIP source must exclude SQLite DB, `.env`, cookies, backups, tokens, session dumps; never upload those to public GitHub. Old runtime data not migrated without a separate authorized migration.

No claim of production readiness should be made without a READY deploy and live tests.
