/**
 * GAG CORE OS — SERVER ENTRY & ROUTER INDEX
 * Centralized export for all Express API routes, middlewares, and server extensions.
 */

import { Router } from "express";
import { n8nRouter } from "./routes/n8nRouter";
import { engineRouter } from "./routes/engineRouter";
import { registryRouter } from "./routes/registryRouter";

export const serverApiRouter = Router();

// Mount dedicated subsystem routers
serverApiRouter.use("/n8n", n8nRouter);
serverApiRouter.use("/engine", engineRouter);
serverApiRouter.use("/registry", registryRouter);

export { n8nRouter, engineRouter, registryRouter };
export default serverApiRouter;
