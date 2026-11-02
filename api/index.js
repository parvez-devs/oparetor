// Deployment-only entrypoint. Existing Express routes remain unchanged.
import app from '../artifacts/api-server/src/app.ts';
export default app;
