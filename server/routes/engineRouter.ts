/**
 * GAG CORE OS — PHASE 1: ENGINE ROUTER
 * Express API routes for Execution Engine, Task Orchestrator,
 * Agent Supervisor, QA Engine, Retry Controller, Handoff Manager, and Audit Trail.
 */

import { Router, Request, Response } from "express";
import { executionEngine } from "../engine/executionEngine";
import { taskOrchestrator } from "../engine/taskOrchestrator";
import { agentSupervisor } from "../engine/agentSupervisor";
import { qaEngine } from "../engine/qaEngine";
import { retryController } from "../engine/retryController";
import { handoffManager } from "../engine/handoffManager";
import { auditEventManager } from "../engine/auditEventManager";
import { Phase1TestRunner } from "../engine/testRunner";

export const engineRouter = Router();

/**
 * Health check for Engine Subsystem
 */
engineRouter.get("/health", (req: Request, res: Response) => {
  res.json({
    status: "ok",
    subsystem: "GAG Core OS — Phase 1 Engine",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
    components: {
      executionEngine: "ONLINE",
      taskOrchestrator: "ONLINE",
      agentSupervisor: "ONLINE",
      qaEngine: "ONLINE",
      retryController: "ONLINE",
      handoffManager: "ONLINE",
      auditEventManager: "ONLINE",
    },
  });
});

/**
 * Main Pipeline Execution Endpoint
 */
engineRouter.post("/execute", async (req: Request, res: Response) => {
  try {
    const { goal, taskId, userId, userName, userRole, preferredAgentId, inputs, autonomyOverride, maxRetries, skipQa } = req.body;

    if (!goal || typeof goal !== "string") {
      return res.status(400).json({ error: "Campo 'goal' é obrigatório." });
    }

    const result = await executionEngine.executePipeline({
      goal,
      taskId,
      userId,
      userName,
      userRole,
      preferredAgentId,
      inputs,
      autonomyOverride,
      maxRetries,
      skipQa,
    });

    res.json(result);
  } catch (error: any) {
    console.error("Error executing engine pipeline:", error);
    res.status(500).json({ error: error?.message || "Falha na execução do pipeline" });
  }
});

/**
 * Task DAG Decomposition Endpoint
 */
engineRouter.post("/orchestrate", (req: Request, res: Response) => {
  try {
    const { goal, primaryAgentId } = req.body;
    if (!goal) {
      return res.status(400).json({ error: "Campo 'goal' é obrigatório." });
    }

    const steps = taskOrchestrator.decomposeGoal(goal, primaryAgentId || "kia");
    res.json({ goal, primaryAgentId: primaryAgentId || "kia", stepsCount: steps.length, steps });
  } catch (error: any) {
    res.status(500).json({ error: error?.message || "Falha na orquestração de tarefas" });
  }
});

/**
 * Supervisor Pre-flight Policy & RBAC Check Endpoint
 */
engineRouter.post("/supervise", (req: Request, res: Response) => {
  try {
    const verdict = agentSupervisor.evaluate(req.body);
    res.json(verdict);
  } catch (error: any) {
    res.status(500).json({ error: error?.message || "Falha na supervisão de políticas" });
  }
});

/**
 * QA Engine Assessment Endpoint
 */
engineRouter.post("/qa-evaluate", (req: Request, res: Response) => {
  try {
    const report = qaEngine.evaluate(req.body);
    res.json(report);
  } catch (error: any) {
    res.status(500).json({ error: error?.message || "Falha na avaliação do QA Engine" });
  }
});

/**
 * Retry Strategy Calculation Endpoint
 */
engineRouter.post("/retry-strategy", (req: Request, res: Response) => {
  try {
    const plan = retryController.evaluateRetry(req.body);
    res.json(plan);
  } catch (error: any) {
    res.status(500).json({ error: error?.message || "Falha no cálculo da estratégia de retry" });
  }
});

/**
 * Handoff Dispatch Endpoint
 */
engineRouter.post("/handoff", (req: Request, res: Response) => {
  try {
    const handoff = handoffManager.dispatchHandoff(req.body);
    res.json(handoff);
  } catch (error: any) {
    res.status(500).json({ error: error?.message || "Falha no despacho de handoff" });
  }
});

/**
 * Audit Trail & Verification Endpoint
 */
engineRouter.get("/audit-trail", (req: Request, res: Response) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 50;
    const chain = auditEventManager.getGlobalChain(limit);
    const integrity = auditEventManager.verifyIntegrity();
    res.json({ integrity, chainLength: chain.length, chain });
  } catch (error: any) {
    res.status(500).json({ error: error?.message || "Falha ao recuperar trilha de auditoria" });
  }
});

/**
 * Execution Audit Trail by ID
 */
engineRouter.get("/audit-trail/:id", (req: Request, res: Response) => {
  try {
    const trail = auditEventManager.getTrailForExecution(req.params.id);
    res.json({ executionId: req.params.id, eventCount: trail.length, events: trail });
  } catch (error: any) {
    res.status(500).json({ error: error?.message || "Falha ao recuperar trilha da execução" });
  }
});

/**
 * Phase 1 Automated Test Suite Runner Endpoint
 */
engineRouter.post("/test-suite", async (req: Request, res: Response) => {
  try {
    const report = await Phase1TestRunner.runAllTests();
    res.json(report);
  } catch (error: any) {
    res.status(500).json({ error: error?.message || "Falha ao executar suite de testes" });
  }
});

export default engineRouter;
