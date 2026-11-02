// Deployment-only entrypoint. Existing Express routes remain unchanged.
import app from '../artifacts/api-server/dist/app.mjs';
export default app;
