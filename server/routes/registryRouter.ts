/**
 * GAG CORE OS — FASE 2: REGISTRY REST API ROUTER
 * Exposes endpoints for Skills, Tools, Capabilities, Resolution and Execution.
 */

import { Router, Request, Response } from "express";
import { skillRegistry } from "../../src/registry/skillRegistry";
import { toolRegistry } from "../../src/registry/toolRegistry";
import { capabilityRegistry } from "../../src/registry/capabilityRegistry";
import { capabilityResolver } from "../../src/registry/capabilityResolver";
import { skillSelector } from "../../src/registry/skillSelector";
import { agentSupervisor } from "../../src/engine/agentSupervisor";

export const registryRouter = Router();

// GET /api/registry/skills
registryRouter.get("/skills", (req: Request, res: Response) => {
  const category = req.query.category as string;
  const capability = req.query.capability as string;

  let list = skillRegistry.getAll();
  if (category) {
    list = skillRegistry.findByCategory(category);
  } else if (capability) {
    list = skillRegistry.findByCapability(capability);
  }

  const sanitized = list.map((s) => ({
    id: s.id,
    name: s.name,
    description: s.description,
    category: s.category,
    version: s.version,
    status: s.status,
    requiredCapabilities: s.requiredCapabilities,
    requiredTools: s.requiredTools,
    riskLevel: s.riskLevel,
    enabled: s.enabled,
    inputSchema: s.inputSchema,
    outputSchema: s.outputSchema,
  }));

  res.json({ success: true, count: sanitized.length, skills: sanitized });
});

// GET /api/registry/skills/:id
registryRouter.get("/skills/:id", (req: Request, res: Response) => {
  const skill = skillRegistry.get(req.params.id);
  if (!skill) {
    return res.status(404).json({ success: false, error: `Skill '${req.params.id}' não encontrada.` });
  }

  const { handler, ...sanitized } = skill;
  res.json({ success: true, skill: sanitized });
});

// GET /api/registry/tools
registryRouter.get("/tools", (_req: Request, res: Response) => {
  const list = toolRegistry.getAll();
  const sanitized = list.map((t) => ({
    id: t.id,
    name: t.name,
    description: t.description,
    category: t.category,
    version: t.version,
    status: t.status,
    riskLevel: t.riskLevel,
    requiresApproval: t.requiresApproval,
    inputSchema: t.inputSchema,
    outputSchema: t.outputSchema,
  }));

  res.json({ success: true, count: sanitized.length, tools: sanitized });
});

// GET /api/registry/tools/:id
registryRouter.get("/tools/:id", (req: Request, res: Response) => {
  const tool = toolRegistry.get(req.params.id);
  if (!tool) {
    return res.status(404).json({ success: false, error: `Tool '${req.params.id}' não encontrada.` });
  }

  const { handler, ...sanitized } = tool;
  res.json({ success: true, tool: sanitized });
});

// GET /api/registry/capabilities
registryRouter.get("/capabilities", (_req: Request, res: Response) => {
  const list = capabilityRegistry.getAll();
  res.json({ success: true, count: list.length, capabilities: list });
});

// GET /api/registry/capabilities/:id
registryRouter.get("/capabilities/:id", (req: Request, res: Response) => {
  const cap = capabilityRegistry.get(req.params.id);
  if (!cap) {
    return res.status(404).json({ success: false, error: `Capacidade '${req.params.id}' não encontrada.` });
  }
  res.json({ success: true, capability: cap });
});

// POST /api/registry/resolve
registryRouter.post("/resolve", (req: Request, res: Response) => {
  const { goal } = req.body;
  if (!goal || typeof goal !== "string") {
    return res.status(400).json({ success: false, error: "Parâmetro 'goal' (string) é obrigatório." });
  }

  const resolution = capabilityResolver.resolve(goal);
  const selection = skillSelector.selectSkills(goal, resolution.recommendedAgent);

  res.json({
    success: true,
    resolution,
    selection: {
      selectedSkillIds: selection.selectedSkillIds,
      requiredTools: selection.requiredTools,
    },
  });
});

// POST /api/registry/skills/execute
registryRouter.post("/skills/execute", async (req: Request, res: Response) => {
  const { skillId, input, agentId, userRole } = req.body;
  if (!skillId) {
    return res.status(400).json({ success: false, error: "Parâmetro 'skillId' é obrigatório." });
  }

  const targetAgent = agentId || "agent-kia";
  const role = userRole || "ADMIN";

  // Validate via Supervisor
  const supervisorCheck = agentSupervisor.checkAssignment(targetAgent, input?.goal || `Execução da skill ${skillId}`, role);
  if (!supervisorCheck.allowed) {
    return res.status(403).json({
      success: false,
      error: supervisorCheck.reason || "Execução rejeitada pelo Agent Supervisor.",
      requiresOwnerApproval: supervisorCheck.requiresOwnerApproval,
    });
  }

  const result = await skillRegistry.execute(
    skillId,
    input || {},
    {
      skillId,
      agentId: targetAgent,
      userRole: role,
      timestamp: new Date().toISOString(),
    }
  );

  res.json(result);
});

export default registryRouter;
