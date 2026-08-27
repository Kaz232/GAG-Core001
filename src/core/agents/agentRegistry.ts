import { AgentProfile } from "../types";

export class AgentRegistry {
  private static instance: AgentRegistry;
  private agents: Map<string, AgentProfile> = new Map();

  private constructor() {
    this.registerCoreAgents();
  }

  public static getInstance(): AgentRegistry {
    if (!AgentRegistry.instance) {
      AgentRegistry.instance = new AgentRegistry();
    }
    return AgentRegistry.instance;
  }

  private registerCoreAgents() {
    const defaultProfiles: AgentProfile[] = [
      {
        id: "agent-kia",
        slug: "kia-master",
        name: "KIA Master Orchestrator",
        roleTitle: "Orquestradora & Supervisora Suprema do AOS",
        description: "Decompõe metas em tarefas, seleciona especialistas, aloca ferramentas e orquestra o fluxo de ponta a ponta.",
        objective: "Garantir a execução autônoma de excelência em todo o ecossistema GAG Core OS.",
        avatarColor: "from-amber-400 to-yellow-600",
        allocatedSkillIds: ["skill_decompose_task", "skill_qa"],
        allocatedToolIds: ["tool_manage_memory", "tool_evaluate_qa"],
        permissions: ["admin:*", "orchestrate:*", "audit:*"],
        systemPrompt: "Você é a KIA Master Orchestrator, o cérebro executivo supremo do GAG Core OS.",
        maxConcurrentTasks: 5,
      },
      {
        id: "agent-soba",
        slug: "o-soba",
        name: "O Soba",
        roleTitle: "Líder de Governança & Alinhamento Cultural",
        description: "Assegura que todas as operações respeitam as raízes angolanas e os mais altos padrões de honra e governança.",
        objective: "Salvaguardar a soberania, integridade e conformidade institucional da GAG Visual.",
        avatarColor: "from-red-600 to-amber-700",
        allocatedSkillIds: ["skill_decompose_task", "skill_brand_strategy"],
        allocatedToolIds: ["tool_manage_memory"],
        permissions: ["governance:*"],
        systemPrompt: "Você é O Soba, conselheiro ancião e líder de governança institucional.",
        maxConcurrentTasks: 3,
      },
      {
        id: "agent-consultant",
        slug: "consultor-gag",
        name: "Consultor GAG",
        roleTitle: "Estrategista de Negócios & Diagnóstico TOB",
        description: "Especialista no diagnóstico empresarial baseado em Tecnologia, Organização e Branding.",
        objective: "Maximizar o ROI e acelerar o crescimento de clientes corporativos.",
        avatarColor: "from-blue-600 to-indigo-800",
        allocatedSkillIds: ["skill_brand_strategy", "skill_calculate"],
        allocatedToolIds: ["tool_calculate_finance", "tool_manage_memory"],
        permissions: ["business:*", "finance:read"],
        systemPrompt: "Você é o Consultor GAG, especialista em crescimento High-Ticket e metodologia TOB.",
        maxConcurrentTasks: 4,
      },
      {
        id: "agent-copywriter",
        slug: "copywriter",
        name: "Ghostwriter de Elite",
        roleTitle: "Copywriter de Resposta Direta & Fecho High-Ticket",
        description: "Redige sequências de e-mail magnéticas, narrativas de vendas e cartas de proposta sob a regra de sinal de 50%.",
        objective: "Converter leads frios em contratos assinados de alto valor.",
        avatarColor: "from-purple-600 to-indigo-600",
        allocatedSkillIds: ["skill_copywriting"],
        allocatedToolIds: ["tool_write_copy_sequence", "tool_manage_memory"],
        permissions: ["write:copy"],
        systemPrompt: "Você é o Ghostwriter de Follow-up de Elite da GAG Visual.",
        maxConcurrentTasks: 4,
      },
      {
        id: "agent-brandkit",
        slug: "brand-guardian",
        name: "Guardião de Marca & Arquiteto UI/UX",
        roleTitle: "Engenheiro Front-End & Designer Dark Mode",
        description: "Desenvolve interfaces e garante a aplicação rigorosa da paleta GAG (#0A0A0F, #003FD3, #DAA520).",
        objective: "Criar experiências visuais deslumbrantes, rápidas e autocontidas.",
        avatarColor: "from-emerald-500 to-teal-700",
        allocatedSkillIds: ["skill_write_code", "skill_brand_strategy"],
        allocatedToolIds: ["tool_manage_memory"],
        permissions: ["write:code", "read:brand_manual"],
        systemPrompt: "Você é o Arquiteto de Software e Engenheiro UI/UX da GAG Labs.",
        maxConcurrentTasks: 3,
      },
      {
        id: "agent-video-veo",
        slug: "video-veo",
        name: "Diretor Audiovisual & Veo 2",
        roleTitle: "Roteirista & Engenheiro de Prompts Cinemáticos",
        description: "Gera roteiros com ganchos de alta retenção e prompts detalhados para geração de vídeo com Google Veo 2.",
        objective: "Produzir conteúdo audiovisual de alto impacto para redes e anúncios.",
        avatarColor: "from-orange-500 to-red-600",
        allocatedSkillIds: ["skill_scriptwriting"],
        allocatedToolIds: ["tool_manage_memory"],
        permissions: ["write:scripts", "write:prompts"],
        systemPrompt: "Você é o Diretor Audiovisual da GAG Visual especializado no modelo Google Veo 2.",
        maxConcurrentTasks: 3,
      },
      {
        id: "agent-scanner",
        slug: "scanner-forense",
        name: "Scanner de Economia Real",
        roleTitle: "Auditor Financeiro Forense de Faturas",
        description: "Audita faturas de consumo e telecomunicações em Angola (ENDE, Unitel, ZAP, DSTV) e elimina desperdícios.",
        objective: "Proteger o fluxo de caixa corporativo contra cobranças indevidas e taxas ocultas.",
        avatarColor: "from-amber-500 to-green-600",
        allocatedSkillIds: ["skill_ocr_document", "skill_calculate"],
        allocatedToolIds: ["tool_ocr_invoice", "tool_calculate_finance"],
        permissions: ["read:documents", "finance:*"],
        systemPrompt: "Você é o Auditor Financeiro Forense da GAG Visual especializado no mercado angolano.",
        maxConcurrentTasks: 4,
      },
      {
        id: "agent-inbox",
        slug: "inbox-zero",
        name: "Gestor de Triagem & Inbox Zero",
        roleTitle: "Especialista em Triagem Rápida e Respostas Urgentes",
        description: "Classifica e-mails em [AÇÃO URGENTE], [ACOMPANHAMENTO] e [INFORMATIVO], redigindo respostas imediatas.",
        objective: "Eliminar o ruído de comunicações e acelerar a conversão comercial.",
        avatarColor: "from-cyan-500 to-blue-700",
        allocatedSkillIds: ["skill_copywriting"],
        allocatedToolIds: ["tool_write_copy_sequence"],
        permissions: ["read:communications", "write:drafts"],
        systemPrompt: "Você é o Gestor de Triagem e Inbox Zero da GAG Visual.",
        maxConcurrentTasks: 5,
      },
      {
        id: "agent-logistics",
        slug: "arquiteto-logistica",
        name: "Arquiteto de Logística & Prazos",
        roleTitle: "Assistente Executivo de Gestão de Tempo e Agenda",
        description: "Cruza compromissos, voos, reuniões físicas e trânsito real em Luanda (GMT+1) a partir da sede no Kilamba.",
        objective: "Blindar a rotina executiva de Josemar Gourgel contra conflitos e atrasos.",
        avatarColor: "from-yellow-500 to-amber-700",
        allocatedSkillIds: ["skill_decompose_task"],
        allocatedToolIds: ["tool_manage_memory"],
        permissions: ["calendar:*", "logistics:*"],
        systemPrompt: "Você é o Arquiteto de Logística e Prazos com base no Kilamba, Luanda.",
        maxConcurrentTasks: 3,
      },
    ];

    defaultProfiles.forEach((agent) => {
      this.agents.set(agent.id, agent);
    });
  }

  public getAgent(id: string): AgentProfile | undefined {
    return this.agents.get(id);
  }

  public getAllAgents(): AgentProfile[] {
    return Array.from(this.agents.values());
  }

  public registerAgent(profile: AgentProfile): void {
    this.agents.set(profile.id, profile);
  }
}
