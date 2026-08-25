export type UserRole = "OWNER" | "ADMIN" | "AGENT" | "VIEWER";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
}

export type IntentCategory =
  | "conversation"
  | "knowledge"
  | "document"
  | "task"
  | "agent_factory"
  | "internal_tool"
  | "system_implementation"
  | "external_action";

export type ExecutionStatus =
  | "SUCCESS"
  | "REVIEW_REQUIRED"
  | "NOT_IMPLEMENTED"
  | "PERMISSION_DENIED"
  | "ERROR";

export interface ActionCard {
  type: "task_created" | "knowledge_added" | "document_processed" | "agent_drafted" | "review_needed" | "skill_executed" | "audit_notice";
  title: string;
  description: string;
  meta?: Record<string, any>;
  actionUrl?: string;
  actionLabel?: string;
}

export interface ExecutionResult {
  status: ExecutionStatus;
  capability: string;
  message: string;
  data?: any;
  actionCard?: ActionCard;
  auditRef: string;
  executionTimeMs: number;
  requiresConfirmation?: boolean;
}

export interface ChatAttachment {
  id: string;
  name: string;
  size: number;
  type: string;
  contentSnippet?: string;
  base64Data?: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
  intent?: IntentCategory;
  executionResult?: ExecutionResult;
  attachments?: ChatAttachment[];
  toolsUsed?: string[];
  suggestedPrompts?: string[];
  modelName?: string;
}

export type KnowledgeStatus = "DRAFT" | "REVIEW_REQUIRED" | "APPROVED" | "ARCHIVED";

export type KnowledgeCategory =
  | "BRANDING"
  | "DESIGN_AI"
  | "CONTENT_STRATEGY"
  | "AUTOMATION"
  | "INTERNAL_PROCESS"
  | "CLIENT_PLAYBOOK"
  | "TECHNICAL";

export interface KnowledgeItem {
  id: string;
  title: string;
  content: string;
  category: KnowledgeCategory;
  source: string;
  version: string;
  status: KnowledgeStatus;
  owner: string;
  associatedDocIds?: string[];
  associatedSkillIds?: string[];
  associatedAgentIds?: string[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export type DocumentStatus =
  | "UPLOADED"
  | "PROCESSING"
  | "EXTRACTED"
  | "REVIEW_REQUIRED"
  | "APPROVED"
  | "PROCESSED_TO_KNOWLEDGE"
  | "PROCESSED_TO_TASK";

export interface TaxComplianceInfo {
  ivaRatePercent: number;
  ivaEstimatedAOA: number;
  retencaoFonteRatePercent: number;
  retencaoFonteAOA: number;
  irtEstimatedAOA: number;
  impostoSeloAOA: number;
  fiscalRegime: string;
  notes: string;
}

export interface MacroEconomicsInfo {
  usdRateAOA: number;
  inflationRatePercent: number;
  bnaInterestRatePercent: number;
  bnaPolicyOutlook: string;
}

export interface FinancialAnalysis {
  companyName: string;
  period: string;
  currency: "AOA" | "USD" | "EUR";
  revenueAOA: number;
  cogsAOA: number;
  grossProfitAOA: number;
  grossMarginPercent: number;
  opexAOA: number;
  ebitdaAOA: number;
  ebitdaMarginPercent: number;
  netProfitAOA: number;
  netMarginPercent: number;
  cashRunwayMonths: number;
  taxCompliance: TaxComplianceInfo;
  macroContext: MacroEconomicsInfo;
  roiProjection: {
    expectedPaybackMonths: number;
    projected12MonthROI: number;
    riskScore: number; // 0 to 100
    riskLevel: "BAIXO" | "MODERADO" | "ELEVADO" | "CRÍTICO";
  };
  keyInsights: string[];
  recommendations: string[];
}

export interface ScenarioSimulation {
  id: string;
  campaignName: string;
  monthlyBudgetAOA: number;
  targetCPA_AOA: number;
  averageTicketAOA: number;
  trafficChannel: "Meta Ads" | "Google Search" | "TikTok Ads" | "B2B Outbound" | "Omnichannel";
  conversionRatePercent: number;
  scenarios: {
    pessimistic: {
      conversions: number;
      revenueAOA: number;
      roas: number;
      netProfitAOA: number;
    };
    realistic: {
      conversions: number;
      revenueAOA: number;
      roas: number;
      netProfitAOA: number;
    };
    optimistic: {
      conversions: number;
      revenueAOA: number;
      roas: number;
      netProfitAOA: number;
    };
  };
  breakEvenConversions: number;
  riskScore: number;
  recommendations: string[];
  createdAt: string;
}

export interface KazaWebhookEvent {
  id: string;
  source: "Typeform" | "HubSpot" | "Supabase" | "Multicaixa Express" | "Custom CRM" | "Make/Zapier";
  endpoint: string;
  timestamp: string;
  status: "DELIVERED" | "DISPATCHED_TO_AGENT" | "PROCESSING" | "COMPLETED" | "FAILED";
  routedAgentId: string;
  routedAgentName: string;
  latencyMs: number;
  payloadSummary: string;
  data: Record<string, any>;
  autoCreatedTaskId?: string;
}

export interface SynergyRun {
  id: string;
  goal: string;
  startedAt: string;
  completedAt?: string;
  status: "STARTING" | "DISPATCHING" | "RUNNING" | "COMPLETED" | "FAILED";
  progressPercent: number;
  totalAgentsInvolved: number;
  createdTaskIds: string[];
  agentExecutions: {
    agentId: string;
    agentName: string;
    role: string;
    taskTitle: string;
    status: "DISPATCHED" | "IN_PROGRESS" | "COMPLETED";
    outputSnippet: string;
  }[];
}

export interface StructuredDocData {
  summary: string;
  executiveBrief: string;
  keyEntities: string[];
  extractedActionItems: string[];
  suggestedCategory: KnowledgeCategory;
  suggestedDepartment: string;
  confidenceScore: number;
  risksOrNotes?: string;
}

export interface ScannedDocument {
  id: string;
  filename: string;
  fileSize: number;
  fileType: string;
  uploadDate: string;
  status: DocumentStatus;
  ocrText?: string;
  structuredData?: StructuredDocData;
  financialData?: FinancialAnalysis;
  originalUrl?: string;
  convertedKnowledgeId?: string;
  convertedTaskIds?: string[];
  reviewedBy?: string;
  reviewDate?: string;
}

export type TaskStatus =
  | "TODO"
  | "IN_PROGRESS"
  | "BLOCKED"
  | "REVIEW"
  | "DONE"
  | "CANCELLED";

export type TaskPriority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export interface TaskHistoryEntry {
  timestamp: string;
  user: string;
  action: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate?: string;
  assignedAgentId?: string;
  assignedUserId?: string;
  tags: string[];
  category: string;
  createdAt: string;
  updatedAt: string;
  history?: TaskHistoryEntry[];
  executionOutput?: string;
  executionArtifacts?: { title: string; type: string; content: string }[];
  executedAt?: string;
  executedByAgentId?: string;
}

export type EventType =
  | "TASK_DEADLINE"
  | "MILESTONE"
  | "MEETING"
  | "REMINDER"
  | "RELEASE";

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  type: EventType;
  startDate: string; // ISO string
  endDate?: string;
  allDay: boolean;
  priority: TaskPriority;
  relatedTaskId?: string;
  relatedAgentId?: string;
  status: "CONFIRMED" | "TENTATIVE" | "COMPLETED";
}

export type AgentStatus =
  | "DRAFT"
  | "REVIEW_REQUIRED"
  | "APPROVED"
  | "ACTIVE"
  | "REJECTED"
  | "ARCHIVED";

export interface Agent {
  id: string;
  slug: string;
  name: string;
  description: string;
  objective: string;
  skills: string[]; // skill IDs
  permissions: string[];
  status: AgentStatus;
  version: string;
  avatarColor: string;
  roleTitle: string;
  systemPrompt?: string;
  createdAt: string;
  updatedAt: string;
}

export type SkillStatus = "ACTIVE" | "BETA" | "EXPERIMENTAL" | "MAINTENANCE";

export interface Skill {
  id: string;
  name: string;
  description: string;
  inputSchema: Record<string, any>;
  outputSchema: Record<string, any>;
  permissions: string[];
  handler: string;
  version: string;
  status: SkillStatus;
  category: string;
  samplePayload?: Record<string, any>;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  agentId?: string;
  agentName?: string;
  action: string;
  capability: IntentCategory | string;
  status: "SUCCESS" | "REVIEW_REQUIRED" | "REJECTED" | "FAILED" | "DENIED";
  details: string;
  hash: string;
  previousHash?: string;
  confirmationGranted?: boolean;
  ipOrEnv?: string;
}

export interface SystemSettings {
  aiProvider: string;
  aiModel: string;
  supabaseConfigured: boolean;
  supabaseUrl: string;
  supabaseAnonKey?: string;
  activeRole: UserRole;
  brandName: string;
  autoAudioTts: boolean;
  voiceName?: "Kore" | "Aoede" | "Fenrir" | "Puck" | "Zephyr" | string;
  voiceContinuous?: boolean;
}

export interface AuthSession {
  user: User;
  token?: string;
  expiresAt?: number;
  provider: "supabase" | "local_os";
}

export type NavigationTab =
  | "dashboard"
  | "kia"
  | "knowledge"
  | "scanner"
  | "tasks"
  | "calendar"
  | "studio"
  | "agents"
  | "skills"
  | "agent_factory"
  | "audit"
  | "settings";
