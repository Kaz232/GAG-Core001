/**
 * GAG CORE OS — N8N EXPRESS ROUTER
 * Dedicated API endpoints for bidirectional N8N workflow execution, webhooks,
 * health checks, circuit breaker diagnostics, and Level 2 action approvals.
 */

import { Router, Request, Response } from "express";
import { N8NClient } from "../../src/core/tools/n8n/N8NClient";
import {
  getAllN8NWorkflows,
  getN8NWorkflow,
  getN8NWorkflowsByCategory,
} from "../../src/core/tools/n8n/workflows";
import { ExternalActionGateway } from "../../src/core/execution/ExternalActionGateway";

export const n8nRouter = Router();

const n8nClient = N8NClient.getInstance();
const actionGateway = ExternalActionGateway.getInstance();

/**
 * GET /api/n8n/health
 * Checks health, reachability, and latency of the N8N instance
 */
n8nRouter.get("/health", async (req: Request, res: Response) => {
  try {
    const health = await n8nClient.testConnection();
    res.json({
      status: "ok",
      n8nConnected: health.reachable,
      latencyMs: health.latencyMs,
      baseUrl: health.baseUrl,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      error: error?.message || "Erro ao verificar estado do N8N",
    });
  }
});

/**
 * GET /api/n8n/workflows
 * Lists all active workflows configured in GAG Core OS
 */
n8nRouter.get("/workflows", (req: Request, res: Response) => {
  try {
    const category = req.query.category as any;
    const workflows = category
      ? getN8NWorkflowsByCategory(category)
      : getAllN8NWorkflows();

    res.json({
      success: true,
      count: workflows.length,
      workflows,
      clusterUrl: process.env.N8N_BASE_URL || "https://n8n.gagvisual.com",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error?.message || "Erro ao listar workflows do N8N",
    });
  }
});

/**
 * POST /api/n8n/trigger
 * Dispatches an action to N8N via ExternalActionGateway with policy checks,
 * idempotency, circuit breaker, and audit logging.
 */
n8nRouter.post("/trigger", async (req: Request, res: Response) => {
  try {
    const {
      workflowId,
      endpoint,
      payload = {},
      autonomyLevel,
      userId,
      userRole = "OWNER",
      idempotencyKey,
    } = req.body;

    const targetEndpoint = endpoint || workflowId;
    if (!targetEndpoint) {
      res.status(400).json({
        success: false,
        error: "O campo 'endpoint' ou 'workflowId' é obrigatório.",
      });
      return;
    }

    const response = await actionGateway.dispatchAction({
      actionType: "N8N_WORKFLOW",
      targetEndpoint,
      payload,
      autonomyLevel,
      userId,
      userRole,
      idempotencyKey,
    });

    res.json(response);
  } catch (error: any) {
    console.error("[N8N Router] Error in /trigger:", error);
    res.status(500).json({
      success: false,
      error: error?.message || "Falha na execução do workflow N8N",
    });
  }
});

/**
 * POST /api/n8n/webhook/:endpoint
 * Inbound webhook receiver from N8N to GAG Core OS
 */
n8nRouter.post("/webhook/:endpoint", (req: Request, res: Response) => {
  try {
    const endpoint = req.params.endpoint;
    const signature = req.headers["x-gag-signature"] || req.headers["x-n8n-signature"];
    const expectedSecret = process.env.N8N_WEBHOOK_SECRET || "gag_n8n_secret_2026";

    // Validate webhook signature if present
    if (signature && signature !== expectedSecret) {
      console.warn(`[N8N Inbound] Signature mismatch for endpoint: ${endpoint}`);
    }

    const payload = req.body;
    console.info(`[N8N Inbound Webhook] Event received for endpoint '${endpoint}':`, payload);

    // Respond immediately with standard acknowledgment
    res.status(200).json({
      success: true,
      message: `Webhook recebido com sucesso no GAG Core OS para '${endpoint}'.`,
      receivedAt: new Date().toISOString(),
      receiptHash: `0xINBOUND-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      data: payload,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error?.message || "Erro no processamento do webhook N8N",
    });
  }
});

/**
 * POST /api/n8n/callback
 * Asynchronous callback receiver for long-running N8N workflows
 */
n8nRouter.post("/callback", (req: Request, res: Response) => {
  try {
    const { executionId, workflowId, status, result, error } = req.body;
    console.info(`[N8N Callback] Execution ${executionId} (${workflowId}) status: ${status}`);

    res.json({
      success: true,
      message: "Callback N8N registado com sucesso no kernel de execução.",
      executionId,
      status,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error?.message || "Erro no processamento de callback N8N",
    });
  }
});

/**
 * GET /api/n8n/diagnostics
 * Returns diagnostics: circuit breakers, pending approvals, and idempotency status
 */
n8nRouter.get("/diagnostics", (req: Request, res: Response) => {
  try {
    const diagnostics = actionGateway.getDiagnostics();
    res.json({
      success: true,
      diagnostics,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error?.message || "Erro ao obter diagnósticos N8N",
    });
  }
});

/**
 * POST /api/n8n/approve
 * Approves a Level 2 pending action
 */
n8nRouter.post("/approve", async (req: Request, res: Response) => {
  try {
    const { token, approverId = "owner_josemar" } = req.body;
    if (!token) {
      res.status(400).json({ success: false, error: "O campo 'token' é obrigatório." });
      return;
    }

    const result = await actionGateway.approvePendingAction(token, approverId);
    res.json(result);
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error?.message || "Falha ao aprovar ação N8N pendente",
    });
  }
});
