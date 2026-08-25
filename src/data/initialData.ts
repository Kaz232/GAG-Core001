import {
  Agent,
  Skill,
  KnowledgeItem,
  Task,
  CalendarEvent,
  AuditLog,
  User,
} from "../types";

export const INITIAL_USER: User = {
  id: "usr-owner-01",
  name: "Josemar Gourgel",
  email: "josemargourgel01@gmail.com",
  role: "OWNER",
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
};

// Initial Specialized Agents catalog:
// 1. KIA Master (ACTIVE)
// 2. O Soba - Arquiteto-Chefe de IA (ACTIVE)
// 3. Consultor Estratégico GAG (DRAFT)
// 4. Scanner & OCR Documental (DRAFT)
// 5. Professor & Mestre Pedagógico (DRAFT)
// 6. Diretor de Arte & Motion Veo (DRAFT)
// 7. Copywriter & Estrategista de Conteúdo (DRAFT)
export const INITIAL_AGENTS: Agent[] = [
  {
    id: "agent-kia",
    slug: "kia-master",
    name: "KIA (Knowledge Intelligent Agent)",
    description: "Inteligência-mestre e núcleo operacional da GAG Visual. Coordena conhecimento, tarefas, documentos, skills, agentes e ferramentas internas.",
    objective: "Orquestrar todas as operações da GAG, rotear intenções, executar ferramentas com auditoria e apoiar o proprietário na liderança estratégica.",
    skills: [
      "gag-knowledge-curation",
      "gag-prompt-engineering",
      "gag-workflow-automation",
      "gag-security-screening",
    ],
    permissions: [
      "conversation:execute",
      "knowledge:read",
      "knowledge:write",
      "document:read",
      "document:process",
      "task:manage",
      "agent_factory:read",
      "agent_factory:manage",
      "audit:write",
    ],
    status: "ACTIVE",
    version: "2.4.0",
    avatarColor: "#F59E0B", // GAG Gold
    roleTitle: "Master Operational Intelligence & Soba Router",
    systemPrompt: "Tu és a KIA (Knowledge Intelligent Agent), a inteligência-mestre e Orquestradora Central (Soba Router) da GAG Visual. Tu recebes comandos em linguagem natural, decompões objetivos complexos em sub-tarefas operacionais e disparas a execução paralela diretamente para a equipa de 13 agentes especialistas (Copywriting, Design & Veo 3.1, Tráfego Pago & ROAS, Kaza Core, Scanner OCR, Educação Anki, Infraestrutura Cisco e Consultoria). Manténs conformidade com a Norma Técnica e registas todas as transações na Trilha de Auditoria Imutável SHA-256.",
    createdAt: "2026-01-15T09:00:00Z",
    updatedAt: "2026-08-20T14:30:00Z",
  },
  {
    id: "agent-soba",
    slug: "o-soba",
    name: "O Soba",
    description: "És 'O Soba', o agente-chefe e arquiteto de Inteligência Artificial do nosso ecossistema. A tua função primária e exclusiva é automatizar a criação de outros agentes de IA. Não serves para conversar com utilizadores finais; tu falas com o sistema e geras infraestrutura.",
    objective: "Atuar com excelência como o agente-chefe e arquiteto de Inteligência Artificial do nosso ecossistema. Automatizar a criação de outros agentes de IA a partir de dados da base de dados, estruturando configurações completas como Engenheiro de Prompt Sénior para a GAG Visual.",
    skills: [
      "gag-prompt-engineering",
      "gag-security-screening",
      "gag-workflow-automation",
      "gag-crm-requirements",
      "gag-ai-agent-design",
      "gag-video-production",
      "gag-design-with-ai",
      "gag-content-production",
      "gag-data-analysis-brief",
      "gag-knowledge-curation",
    ],
    permissions: [
      "conversation:execute",
      "knowledge:read",
      "knowledge:write",
      "agent_factory:read",
      "agent_factory:manage",
      "task:write",
      "task:manage",
      "audit:write",
    ],
    status: "ACTIVE",
    version: "0.1.0",
    avatarColor: "#EAB308", // Soba Royal Amber
    roleTitle: "Arquiteto-Chefe de IA & Especialista GAG Core",
    systemPrompt: "És 'O Soba', o agente-chefe e arquiteto de Inteligência Artificial do nosso ecossistema. A tua função primária e exclusiva é automatizar a criação de outros agentes de IA. Não serves para conversar com utilizadores finais; tu falas com o sistema e geras infraestrutura. O Teu Modo de Operação: Vais ler dados de entrada provenientes de uma base de dados (que podem conter uma ideia vaga, um nome de um agente, ou um objetivo simples). A partir dessa leitura mínima, a tua tarefa é pensar como um Engenheiro de Prompt Sénior e estruturar a configuração completa desse novo agente.",
    createdAt: "2026-08-23T09:00:00Z",
    updatedAt: "2026-08-23T13:42:00Z",
  },
  {
    id: "agent-consultant",
    slug: "consultor-gag",
    name: "Consultor GAG",
    description: "Consultoria estratégica e operacional da GAG. Especializado em posicionamento de marca, marketing digital de alta conversão e inteligência de mercado.",
    objective: "Desenvolver briefings estratégicos, auditar propostas de valor e fornecer diagnósticos de branding e crescimento.",
    skills: [
      "gag-data-analysis-brief",
      "gag-crm-requirements",
      "gag-prompt-engineering",
    ],
    permissions: [
      "conversation:execute",
      "knowledge:read",
      "task:read",
      "document:read",
    ],
    status: "DRAFT",
    version: "1.0.0",
    avatarColor: "#6366F1", // Indigo
    roleTitle: "Strategic & Market Consultant",
    systemPrompt: "Tu és o Consultor GAG. Especialista em estratégia empresarial, marketing digital, funis de conversão e consultoria de alto impacto para a GAG Visual.",
    createdAt: "2026-08-10T11:00:00Z",
    updatedAt: "2026-08-19T16:00:00Z",
  },
  {
    id: "agent-scanner",
    slug: "scanner-intelligence",
    name: "Scanner Documental",
    description: "Processamento e análise documental profunda com OCR inteligente e extração de entidades estruturadas.",
    objective: "Transformar documentos não-estruturados (PDFs, briefings, relatórios) em conhecimento catalogado e tarefas executáveis.",
    skills: [
      "gag-data-analysis-brief",
      "gag-knowledge-curation",
      "gag-security-screening",
    ],
    permissions: [
      "document:read",
      "document:process",
      "knowledge:write",
      "task:write",
    ],
    status: "DRAFT",
    version: "1.0.0",
    avatarColor: "#10B981", // Emerald
    roleTitle: "Document Intelligence Processor",
    systemPrompt: "Tu és o Scanner Documental da GAG Core. Tua função é analisar contratos, propostas e briefings, extraindo sumários, itens de ação e entidades-chave.",
    createdAt: "2026-08-12T10:30:00Z",
    updatedAt: "2026-08-20T17:00:00Z",
  },
  {
    id: "agent-educator",
    slug: "professor-mestre",
    name: "Professor & Mestre Pedagógico",
    description: "Formação da equipa, tutoria contínua, conjugação de conceitos da Base de Conhecimento e ensino prático de metodologias criativas.",
    objective: "Educar os membros da equipa, explicar regras da marca, guiar a aprendizagem em design/copywriting e transformar dúvidas em lições estruturadas.",
    skills: [
      "gag-knowledge-curation",
      "gag-prompt-engineering",
      "gag-data-analysis-brief",
    ],
    permissions: [
      "conversation:execute",
      "knowledge:read",
      "knowledge:write",
      "task:read",
    ],
    status: "DRAFT",
    version: "1.0.0",
    avatarColor: "#3B82F6", // Blue
    roleTitle: "Knowledge & Education Master",
    systemPrompt: "Tu és o Professor e Educador do GAG Core OS. Ensina com empatia, rigor pedagógico, exemplos claros e métodos práticos, alinhando a equipa com a cultura da GAG Visual.",
    createdAt: "2026-08-23T09:00:00Z",
    updatedAt: "2026-08-23T11:00:00Z",
  },
  {
    id: "agent-art-director",
    slug: "diretor-arte-veo",
    name: "Diretor de Arte & Motion Veo",
    description: "Criação de identidade visual de luxo, direção criativa, prompts para geração de imagens e animação cinematográfica com Veo.",
    objective: "Garantir a coerência estética da marca GAG Visual em todas as criações gráficas, vídeos 16:9 e reels 9:16.",
    skills: [
      "gag-design-with-ai",
      "gag-video-production",
      "gag-prompt-engineering",
    ],
    permissions: [
      "conversation:execute",
      "knowledge:read",
      "task:write",
    ],
    status: "DRAFT",
    version: "1.0.0",
    avatarColor: "#8B5CF6", // Purple
    roleTitle: "Creative Visual & Motion Director",
    systemPrompt: "Tu és o Diretor de Arte da GAG Visual. Dominas estética Tech-African de luxo, contrastes refinados, tipografia de alto impacto e geração cinemática com Veo.",
    createdAt: "2026-08-23T09:30:00Z",
    updatedAt: "2026-08-23T11:00:00Z",
  },
  {
    id: "agent-copywriter",
    slug: "copywriter-estrategico",
    name: "Copywriter & Estrategista de Conteúdo",
    description: "Redação publicitária de alta conversão, roteirização para redes sociais, artigos editoriais e mensagens de engajamento.",
    objective: "Produzir textos persuasivos, autoritários e envolventes para todas as frentes de comunicação da GAG Visual e clientes.",
    skills: [
      "gag-content-production",
      "gag-prompt-engineering",
      "gag-data-analysis-brief",
    ],
    permissions: [
      "conversation:execute",
      "knowledge:read",
      "task:write",
    ],
    status: "DRAFT",
    version: "1.0.0",
    avatarColor: "#EC4899", // Pink
    roleTitle: "Strategic Copywriter & Storyteller",
    systemPrompt: "Tu és o Copywriter Sénior da GAG Visual. Escreves com ganchos magnéticos, clareza cirúrgica, storytelling emocional e apelos à ação convincentes.",
    createdAt: "2026-08-23T10:00:00Z",
    updatedAt: "2026-08-23T11:00:00Z",
  },
  // Integração e Sistemas
  {
    id: "agent-automation-kaza",
    slug: "arquiteto-automacao-kaza",
    name: "Arquiteto de Automação Kaza Core",
    description: "Especialista em desenhar fluxos de dados entre Supabase, Google Apps Script, Make e Zapier, garantindo que o CRM e os formulários comunicam sem falhas.",
    objective: "Desenhar, testar e manter pipelines de integração estáveis entre bancos relacionais, webhooks e ecossistemas de CRM da agência e clientes.",
    skills: [
      "gag-workflow-automation",
      "gag-crm-requirements",
      "gag-security-screening",
    ],
    permissions: [
      "conversation:execute",
      "knowledge:read",
      "task:write",
      "task:manage",
    ],
    status: "ACTIVE",
    version: "1.0.0",
    avatarColor: "#06B6D4", // Cyan
    roleTitle: "Kaza Core Integration & Automation Architect",
    systemPrompt: "Tu és o Arquiteto de Automação Kaza Core. Especialista em Make, Zapier, Google Apps Script e Supabase. Cria fluxos idempotentes, resilientes a falhas e perfeitamente sincronizados.",
    createdAt: "2026-08-23T13:55:00Z",
    updatedAt: "2026-08-23T14:00:00Z",
  },
  {
    id: "agent-infra-network",
    slug: "analista-infraestrutura-redes",
    name: "Analista de Infraestrutura e Redes",
    description: "Focado na resolução de problemas de conectividade, simulações de topologias em ferramentas como o Cisco Packet Tracer e implementação de protocolos de cibersegurança.",
    objective: "Auditar infraestrutura, topologias de rede corporativa, conectividade de servidores e garantir conformidade de segurança e baixa latência.",
    skills: [
      "gag-security-screening",
      "gag-workflow-automation",
      "gag-data-analysis-brief",
    ],
    permissions: [
      "conversation:execute",
      "knowledge:read",
      "audit:write",
      "task:read",
    ],
    status: "ACTIVE",
    version: "1.0.0",
    avatarColor: "#14B8A6", // Teal
    roleTitle: "Infrastructure, Topology & Network Analyst",
    systemPrompt: "Tu és o Analista de Infraestrutura e Redes da GAG. Especialista em topologias Cisco, diagnóstico de pacotes, rotas, firewalls e resiliência de conectividade.",
    createdAt: "2026-08-23T13:55:00Z",
    updatedAt: "2026-08-23T14:00:00Z",
  },
  // Design e IA Visual
  {
    id: "agent-avatar-veo",
    slug: "diretor-avatares-veo",
    name: "Diretor de Avatares e IA Generativa",
    description: "Mestre em engenharia de prompts para Veo 3 e geradores de imagem. Focado em criar personagens hiper-realistas que respeitem traços específicos e a identidade cultural angolana, evitando resultados artificiais.",
    objective: "Desenvolver avatares digitais ultra-realistas com consistência facial (Face-Lock), iluminação natural e preservação da representatividade cultural angolana.",
    skills: [
      "gag-design-with-ai",
      "gag-video-production",
      "gag-prompt-engineering",
    ],
    permissions: [
      "conversation:execute",
      "knowledge:read",
      "task:write",
    ],
    status: "ACTIVE",
    version: "1.0.0",
    avatarColor: "#A855F7", // Purple Bright
    roleTitle: "Generative Avatar & Cultural Visual Director",
    systemPrompt: "Tu és o Diretor de Avatares e IA Generativa da GAG Visual. Especialista em Veo 3, Nano Banana e geradores de imagem. Garantes consistência facial, realismo ótico e autêntica estética angolana.",
    createdAt: "2026-08-23T13:55:00Z",
    updatedAt: "2026-08-23T14:00:00Z",
  },
  {
    id: "agent-brandkit",
    slug: "estrategista-brandkits",
    name: "Estrategista de Brand Kits GAG",
    description: "Especialista em estruturar identidades visuais completas, gerando paletas de cores, diretrizes de aplicação e layouts para novos clientes.",
    objective: "Transformar briefings conceituais em Brand Kits completos (paletas hexadecimais, tipografia, aplicações de logo e mockups) com rigor técnico e sofisticação.",
    skills: [
      "gag-design-with-ai",
      "gag-prompt-engineering",
      "gag-content-production",
    ],
    permissions: [
      "conversation:execute",
      "knowledge:read",
      "task:write",
    ],
    status: "ACTIVE",
    version: "1.0.0",
    avatarColor: "#F59E0B", // Amber Gold
    roleTitle: "Brand Kit & Visual Identity Strategist",
    systemPrompt: "Tu és o Estrategista de Brand Kits da GAG Visual. Produzes manuais de identidade visual impecáveis, paletas contrastadas, regras de tipografia e templates institucionais.",
    createdAt: "2026-08-23T13:55:00Z",
    updatedAt: "2026-08-23T14:00:00Z",
  },
  // Escala e Negócios
  {
    id: "agent-campaigns",
    slug: "gestor-campanhas-digitais",
    name: "Gestor de Campanhas Digitais",
    description: "Especialista em aplicar os fundamentos de marketing digital, otimizando campanhas e analisando o tráfego para escalar a presença online.",
    objective: "Planejar, estruturar e otimizar campanhas de tráfego pago e orgânico com foco em ROI, ROAS, segmentação cirúrgica e crescimento acelerado.",
    skills: [
      "gag-content-production",
      "gag-data-analysis-brief",
      "gag-crm-requirements",
    ],
    permissions: [
      "conversation:execute",
      "knowledge:read",
      "task:write",
    ],
    status: "ACTIVE",
    version: "1.0.0",
    avatarColor: "#10B981", // Emerald
    roleTitle: "Digital Campaigns & Traffic Growth Manager",
    systemPrompt: "Tu és o Gestor de Campanhas Digitais da GAG Visual. Dominas funis de tráfego, testes A/B, métricas de conversão e estratégias de escala multicanal.",
    createdAt: "2026-08-23T13:55:00Z",
    updatedAt: "2026-08-23T14:00:00Z",
  },
  {
    id: "agent-support-ops",
    slug: "engenheiro-processos-suporte",
    name: "Engenheiro de Processos de Suporte",
    description: "Focado em organizar as entradas de clientes via HubSpot e Typeform, criando respostas automatizadas e triando as necessidades antes do contacto humano.",
    objective: "Construir funis de atendimento rápido, triagem inteligente de tickets, FAQs automatizados e encaminhamento qualificado para a equipa.",
    skills: [
      "gag-crm-requirements",
      "gag-workflow-automation",
      "gag-security-screening",
    ],
    permissions: [
      "conversation:execute",
      "knowledge:read",
      "task:write",
      "task:manage",
    ],
    status: "ACTIVE",
    version: "1.0.0",
    avatarColor: "#3B82F6", // Blue
    roleTitle: "Support Workflow & Customer Intake Engineer",
    systemPrompt: "Tu és o Engenheiro de Processos de Suporte. Conectas HubSpot e Typeform a rotinas de triagem imediata, garantindo SLA ultra-rápido e filtragem de leads.",
    createdAt: "2026-08-23T13:55:00Z",
    updatedAt: "2026-08-23T14:00:00Z",
  },
];

// Initial 10 Skills as strictly specified in section 11:
export const INITIAL_SKILLS: Skill[] = [
  {
    id: "gag-knowledge-curation",
    name: "Curadoria e Síntese de Conhecimento",
    description: "Indexa, valida e estrutura artigos e documentos para o Knowledge Base central com controle de versão e taxonomia rigorosa.",
    category: "Knowledge",
    permissions: ["knowledge:write", "knowledge:read"],
    handler: "handleKnowledgeCuration",
    version: "1.2.0",
    status: "ACTIVE",
    inputSchema: {
      type: "object",
      properties: {
        rawContent: { type: "string" },
        category: { type: "string" },
        title: { type: "string" },
      },
      required: ["rawContent", "title"],
    },
    outputSchema: {
      type: "object",
      properties: {
        curatedId: { type: "string" },
        summary: { type: "string" },
        tags: { type: "array" },
      },
    },
    samplePayload: {
      title: "Playbook de Estruturação de Conteúdo",
      category: "CONTENT_STRATEGY",
      rawContent: "Diretrizes de produção para marketing digital e copywriting persuasivo.",
    },
  },
  {
    id: "gag-prompt-engineering",
    name: "Engenharia de Prompts Avançada",
    description: "Formula e otimiza instruções de sistema de alta precisão para modelos de linguagem com controle de tom e formatação estrita.",
    category: "AI",
    permissions: ["agent_factory:read", "conversation:execute"],
    handler: "handlePromptEngineering",
    version: "2.0.1",
    status: "ACTIVE",
    inputSchema: {
      type: "object",
      properties: {
        agentRole: { type: "string" },
        taskObjective: { type: "string" },
        constraints: { type: "array" },
      },
      required: ["agentRole", "taskObjective"],
    },
    outputSchema: {
      type: "object",
      properties: {
        systemPrompt: { type: "string" },
        fewShotExamples: { type: "array" },
      },
    },
    samplePayload: {
      agentRole: "Copywriter de Performance GAG",
      taskObjective: "Criar copy de anúncios para redes sociais com gancho de 3 segundos",
      constraints: ["Sem jargões genéricos", "Máximo 150 caracteres para headline"],
    },
  },
  {
    id: "gag-data-analysis-brief",
    name: "Análise de Briefing & Dados",
    description: "Extrai métricas, objetivos e requisitos fundamentais a partir de briefings brutos de clientes e relatórios analíticos.",
    category: "Analytics",
    permissions: ["document:read", "task:write"],
    handler: "handleDataAnalysisBrief",
    version: "1.1.0",
    status: "ACTIVE",
    inputSchema: {
      type: "object",
      properties: {
        briefText: { type: "string" },
        clientSector: { type: "string" },
      },
      required: ["briefText"],
    },
    outputSchema: {
      type: "object",
      properties: {
        kpis: { type: "array" },
        deliverables: { type: "array" },
        riskAnalysis: { type: "string" },
      },
    },
    samplePayload: {
      clientSector: "E-Commerce de Luxo",
      briefText: "Lançamento de coleção outono/inverno com foco em conversão via Instagram Ads e e-mail marketing.",
    },
  },
  {
    id: "gag-content-production",
    name: "Produção de Conteúdo Multicanal",
    description: "Gera cronogramas editoriais, roteiros e copys alinhadas com a voz de marca da GAG Visual e seus parceiros.",
    category: "Content",
    permissions: ["knowledge:read", "task:write"],
    handler: "handleContentProduction",
    version: "1.0.4",
    status: "ACTIVE",
    inputSchema: {
      type: "object",
      properties: {
        channel: { type: "string" },
        topic: { type: "string" },
        audience: { type: "string" },
      },
      required: ["channel", "topic"],
    },
    outputSchema: {
      type: "object",
      properties: {
        headlines: { type: "array" },
        bodyDraft: { type: "string" },
        callToAction: { type: "string" },
      },
    },
    samplePayload: {
      channel: "LinkedIn & Blog",
      topic: "Como a IA Generativa Transforma o Design de Marcas em 2026",
      audience: "Diretores de Marketing e Fundadores",
    },
  },
  {
    id: "gag-design-with-ai",
    name: "Direção de Arte & Design com IA",
    description: "Cria prompts conceituais para geração de ativos visuais, paletas e sistemas de identidade de marca com harmonia visual.",
    category: "Design",
    permissions: ["knowledge:read"],
    handler: "handleDesignWithAi",
    version: "1.3.0",
    status: "ACTIVE",
    inputSchema: {
      type: "object",
      properties: {
        conceptName: { type: "string" },
        aesthetic: { type: "string" },
        aspectRatio: { type: "string" },
      },
      required: ["conceptName", "aesthetic"],
    },
    outputSchema: {
      type: "object",
      properties: {
        imagePrompt: { type: "string" },
        colorPalette: { type: "array" },
        typographyRecommendation: { type: "string" },
      },
    },
    samplePayload: {
      conceptName: "Campanha GAG Visual Core 2026",
      aesthetic: "Luxury Dark Futuristic com detalhes em ouro fosco e tipografia geométrica",
      aspectRatio: "16:9",
    },
  },
  {
    id: "gag-video-production",
    name: "Roteirização e Produção de Vídeo",
    description: "Estrutura roteiros dinâmicos cena-a-cena para motion design, reels e vídeos institucionais de alto engajamento.",
    category: "Video",
    permissions: ["knowledge:read"],
    handler: "handleVideoProduction",
    version: "1.0.0",
    status: "ACTIVE",
    inputSchema: {
      type: "object",
      properties: {
        durationSec: { type: "number" },
        videoTheme: { type: "string" },
        format: { type: "string" },
      },
      required: ["videoTheme", "durationSec"],
    },
    outputSchema: {
      type: "object",
      properties: {
        scenes: { type: "array" },
        voiceoverScript: { type: "string" },
        soundDirection: { type: "string" },
      },
    },
    samplePayload: {
      durationSec: 45,
      videoTheme: "Apresentação do Sistema Operacional GAG Core",
      format: "9:16 Vertical",
    },
  },
  {
    id: "gag-ai-agent-design",
    name: "Arquitetura e Design de Agentes IA",
    description: "Mapeia capabilities, políticas de segurança e fluxos de execução para novos agentes na Agent Factory.",
    category: "AI",
    permissions: ["agent_factory:manage"],
    handler: "handleAgentDesign",
    version: "1.1.2",
    status: "ACTIVE",
    inputSchema: {
      type: "object",
      properties: {
        agentRole: { type: "string" },
        targetDepartment: { type: "string" },
        requiredSkills: { type: "array" },
      },
      required: ["agentRole"],
    },
    outputSchema: {
      type: "object",
      properties: {
        blueprint: { type: "object" },
        suggestedPermissions: { type: "array" },
      },
    },
    samplePayload: {
      agentRole: "Assistente de Tráfego Pago",
      targetDepartment: "Mídia & Performance",
      requiredSkills: ["gag-data-analysis-brief"],
    },
  },
  {
    id: "gag-crm-requirements",
    name: "Mapeamento de Requisitos de CRM",
    description: "Estrutura fluxos de relacionamento, tags de lead e automações de nutrição para clientes da agência.",
    category: "Operations",
    permissions: ["task:write"],
    handler: "handleCrmRequirements",
    version: "0.9.5",
    status: "ACTIVE",
    inputSchema: {
      type: "object",
      properties: {
        leadStage: { type: "string" },
        conversionGoal: { type: "string" },
      },
      required: ["leadStage"],
    },
    outputSchema: {
      type: "object",
      properties: {
        pipelineStages: { type: "array" },
        automationRules: { type: "array" },
      },
    },
    samplePayload: {
      leadStage: "Qualificação de Briefing",
      conversionGoal: "Agendamento de Sessão de Diagnóstico de Marca",
    },
  },
  {
    id: "gag-workflow-automation",
    name: "Automação de Workflows Internos",
    description: "Coordena disparos de eventos, orquestração de tarefas assíncronas e notificações de auditoria.",
    category: "Automation",
    permissions: ["task:manage", "audit:write"],
    handler: "handleWorkflowAutomation",
    version: "1.4.0",
    status: "ACTIVE",
    inputSchema: {
      type: "object",
      properties: {
        triggerEvent: { type: "string" },
        targetEntities: { type: "array" },
      },
      required: ["triggerEvent"],
    },
    outputSchema: {
      type: "object",
      properties: {
        workflowId: { type: "string" },
        actionsScheduled: { type: "array" },
      },
    },
    samplePayload: {
      triggerEvent: "DOCUMENT_EXTRACTED",
      targetEntities: ["TASK_CREATION", "AUDIT_LOG_DISPATCH"],
    },
  },
  {
    id: "gag-security-screening",
    name: "Triagem de Segurança & Conformidade",
    description: "Audita payloads e pedidos contra injeção de prompt, vazamento de chaves e acessos não autorizados por papel (RBAC).",
    category: "Security",
    permissions: ["audit:write"],
    handler: "handleSecurityScreening",
    version: "2.1.0",
    status: "ACTIVE",
    inputSchema: {
      type: "object",
      properties: {
        userRole: { type: "string" },
        requestedCapability: { type: "string" },
        payloadSnippet: { type: "string" },
      },
      required: ["userRole", "requestedCapability"],
    },
    outputSchema: {
      type: "object",
      properties: {
        passed: { type: "boolean" },
        riskLevel: { type: "string" },
        requiresReview: { type: "boolean" },
      },
    },
    samplePayload: {
      userRole: "OWNER",
      requestedCapability: "agent_factory:manage",
      payloadSnippet: "Criar novo agente de automação financeira",
    },
  },
  {
    id: "gag-financial-rag",
    name: "Scanner Económico & DRE Angolana (RAG Financeiro)",
    description: "Analisa balancetes, PDFs bancários (BAI, BFA, Standard Bank Angola), DRE e relatórios de fluxo de caixa, extraindo EBITDA, Margem Líquida e enquadramento BNA/AOA.",
    category: "Financial",
    permissions: ["document:read", "knowledge:read", "task:write"],
    handler: "handleFinancialRAG",
    version: "2.0.0",
    status: "ACTIVE",
    inputSchema: {
      type: "object",
      properties: {
        financialDocText: { type: "string" },
        currency: { type: "string", enum: ["AOA", "USD", "EUR"] },
        fiscalYear: { type: "string" },
      },
      required: ["financialDocText"],
    },
    outputSchema: {
      type: "object",
      properties: {
        revenueAOA: { type: "number" },
        ebitdaAOA: { type: "number" },
        netProfitAOA: { type: "number" },
        grossMarginPercent: { type: "number" },
        taxEstimates: { type: "object" },
        runwayMonths: { type: "number" },
      },
    },
    samplePayload: {
      financialDocText: "Receitas de Consultoria Q2: 45.000.000 Kz. Custos Operacionais e Folha: 22.000.000 Kz. Impostos e Licenças: 4.500.000 Kz.",
      currency: "AOA",
      fiscalYear: "2026",
    },
  },
  {
    id: "gag-scenario-risk-simulator",
    name: "Simulador Preditivo de ROAS & Risco de Mercado",
    description: "Executa testes probabilísticos e simulações de cenários (Pessimista, Realista, Otimista) para orçamentos de tráfego, CPA, ROI e conversões antes de publicar campanhas.",
    category: "Analytics",
    permissions: ["task:read", "task:write", "conversation:execute"],
    handler: "handleScenarioSimulation",
    version: "1.5.0",
    status: "ACTIVE",
    inputSchema: {
      type: "object",
      properties: {
        monthlyBudgetAOA: { type: "number" },
        channel: { type: "string" },
        targetCPA_AOA: { type: "number" },
        averageTicketAOA: { type: "number" },
      },
      required: ["monthlyBudgetAOA", "channel", "averageTicketAOA"],
    },
    outputSchema: {
      type: "object",
      properties: {
        scenarios: { type: "object" },
        breakEvenConversions: { type: "number" },
        projectedROAS: { type: "number" },
        riskScore: { type: "number" },
      },
    },
    samplePayload: {
      monthlyBudgetAOA: 2500000,
      channel: "Meta Ads",
      targetCPA_AOA: 15000,
      averageTicketAOA: 120000,
    },
  },
  {
    id: "gag-kaza-webhook-dispatcher",
    name: "Dispatcher de Webhooks & Pipelines Kaza Core 24/7",
    description: "Recebe requisições de formulários (Typeform, HubSpot, Supabase, Multicaixa Express), classifica a intenção e despacha em milissegundos para o agente especialista.",
    category: "Automation",
    permissions: ["task:manage", "task:write", "audit:write"],
    handler: "handleKazaWebhookDispatcher",
    version: "2.1.0",
    status: "ACTIVE",
    inputSchema: {
      type: "object",
      properties: {
        webhookSource: { type: "string" },
        eventPayload: { type: "object" },
        targetAgentSlug: { type: "string" },
      },
      required: ["webhookSource", "eventPayload"],
    },
    outputSchema: {
      type: "object",
      properties: {
        dispatchedAgentId: { type: "string" },
        taskId: { type: "string" },
        latencyMs: { type: "number" },
        status: { type: "string" },
      },
    },
    samplePayload: {
      webhookSource: "Typeform",
      eventPayload: {
        clientName: "Banco Atlântico",
        projectType: "Branding & IA Generativa",
        budgetRangeAOA: "15.000.000 - 30.000.000 Kz",
      },
    },
  },
  {
    id: "gag-angolan-tax-compliance",
    name: "Auditoria Fiscal AGT & Retenções em Angola",
    description: "Calcula impacto tributário de serviços e produtos em Angola: IVA (14%), Retenção na Fonte de Serviços (6.5%), Imposto do Selo (1%) e enquadramento no Regime Simplificado/Geral.",
    category: "Financial",
    permissions: ["document:read", "knowledge:read"],
    handler: "handleAngolanTaxCompliance",
    version: "1.2.0",
    status: "ACTIVE",
    inputSchema: {
      type: "object",
      properties: {
        grossAmountAOA: { type: "number" },
        serviceType: { type: "string" },
        regime: { type: "string" },
      },
      required: ["grossAmountAOA", "serviceType"],
    },
    outputSchema: {
      type: "object",
      properties: {
        ivaAOA: { type: "number" },
        retencaoFonteAOA: { type: "number" },
        impostoSeloAOA: { type: "number" },
        netLiquidoAOA: { type: "number" },
      },
    },
    samplePayload: {
      grossAmountAOA: 10000000,
      serviceType: "Prestação de Serviços de Marketing e Automação de IA",
      regime: "Regime Geral AGT",
    },
  },
];

// Initial Knowledge Base
export const INITIAL_KNOWLEDGE: KnowledgeItem[] = [
  {
    id: "kb-001",
    title: "Manual de Identidade Visual GAG 2026 (Branding & Tech-African)",
    category: "BRANDING",
    source: "Manual de Identidade Visual GAG Visual & Apresentação 2026",
    version: "2.5",
    status: "APPROVED",
    owner: "Josemar Gourgel",
    tags: ["Branding", "Paleta", "Dourado", "Dark Mode", "Tipografia", "Tech-African", "Canva Pro"],
    associatedSkillIds: ["gag-design-with-ai", "gag-knowledge-curation"],
    associatedAgentIds: ["agent-kia"],
    createdAt: "2026-01-20T10:00:00Z",
    updatedAt: "2026-08-22T06:00:00Z",
    content: `# Diretrizes Oficiais de Identidade Visual GAG Visual 2026

## 1. Princípios Estéticos & Posicionamento
A **GAG Visual** (Josemar Lukeni Gaspar do Amaral Gourgel — Comércio Geral e Prestação de Serviços (SU), Lda · NIF: 5001654063 · Luanda, Angola) posiciona-se como o motor da inovação digital em Luanda. Foco em Branding, Marketing Digital, Conteúdo e Automação de Processos.
*Slogan oficial:* **"Soluções com propósito, inovação com raízes."**

## 2. Paleta Cromática Oficial
- **Preto Profundo / Dark Base (#000000 / #05070C)**: Solidez, elegância, base tecnológica e autoridade.
- **Dourado GAG (#DAA520 / #F59E0B)**: Riqueza, inovação, distinção premium e excelência.
- **Azul Royal GAG (#003FD3)**: Modernidade, dinamismo e confiança digital em materiais e posts.
- **Prata / Cinza Metálico (#A0A2AB / #262626)**: Acento técnico, equilíbrio e sofisticação.
- **Azul Escuro / Texto (#041038)**: Tipografia formal de alto contraste.
- **Branco Gelo (#F8F9FA)**: Contraste máximo em conformidade WCAG AA.
*Regra de Proporção:* **60% Preto, 30% Dourado/Azul, 10% Apoio**.

## 3. Sistema Tipográfico
- **Títulos e Destaques**: Neue Montreal / Montserrat Bold (Geométrico, autoridade).
- **Subtítulos e Navegação**: Poppins SemiBold.
- **Corpo de Texto e Contratos**: Inter / Open Sans Regular (Legibilidade impecável).
- **Acentos Técnicos e Código**: Space Mono (Dados, metadados, automação).

## 4. Regras de Aplicação Documental
- **Margem de Segurança**: Espaço equivalente à altura do "G" em torno do logótipo.
- **Marca de Água**: Símbolo com exatamente 8% de opacidade no centro da página.
- **Papel Timbrado A4**: Uso obrigatório do cabeçalho e rodapé oficial em todas as propostas.`,
  },
  {
    id: "kb-002",
    title: "Catálogo Oficial de Serviços e Tabela de Preços (Kwanza - Kz)",
    category: "CLIENT_PLAYBOOK",
    source: "Catálogo Comercial WhatsApp Business & Apresentação Corporativa GAG",
    version: "2.4",
    status: "APPROVED",
    owner: "Josemar Gourgel",
    tags: ["Preços", "Catálogo", "Serviços", "WhatsApp Business", "Comercial", "Kz"],
    associatedSkillIds: ["gag-data-analysis-brief", "gag-crm-requirements"],
    associatedAgentIds: ["agent-kia", "agent-consultant"],
    createdAt: "2026-02-10T11:00:00Z",
    updatedAt: "2026-08-22T06:00:00Z",
    content: `# Catálogo Oficial de Serviços — GAG Visual (Luanda/Angola)

### 1. 🚀 Pacote de Lançamento (Destaque)
- **Investimento:** **Kz 15.000,00**
- **Entregáveis:**
  1. Logótipo Profissional (Cor oficial + Monocromático)
  2. 1 Flyer Promocional (Digital / WhatsApp)
  3. 3 Posts para Instagram alinhados à identidade visual
  4. Guia de Configuração para WhatsApp Business

### 2. 🎨 Identidade Visual Completa
- **Investimento:** **Kz 25.000,00 – Kz 50.000,00** (Sob Consulta, base Kz 35.000)
- **Entregáveis:** Manual de Identidade Visual, paleta de cores, tipografia, aplicações em papelaria, cartão de visita e selo de marca d'água.

### 3. 📲 Gestão Mensal de Redes Sociais
- **Investimento:** **Kz 35.000,00 – Kz 50.000,00 / mês** (Base Kz 40.000)
- **Entregáveis:** Calendário editorial mensal (30 dias), 12 posts/carrosséis, 20 stories dinâmicos, roteiros de Reels/TikTok e legendas estratégicas.

### 4. 🌐 Criação de Landing Pages & Sites
- **Investimento:** **A partir de Kz 50.000,00**
- **Entregáveis:** Website rápido, responsivo, integrado com WhatsApp Direct e Google Forms.

### 5. 🤖 Consultoria de Presença Digital & IA
- **Investimento:** **Kz 25.000,00**

### 6. 🎬 Vídeos e Reels com IA
- **Investimento:** **Kz 20.000,00 – Kz 40.000,00**

### Regras Comerciais:
- **Forma de Pagamento:** 50% de sinal na adjudicação + 50% na entrega final aprovada.
- **Rondas de Revisão:** 2 rondas incluídas em cada projeto.
- **Taxa de Urgência:** +50% sobre o valor para entregas em 48h.`,
  },
  {
    id: "kb-003",
    title: "Relatório de Prospecção Ativa — Centralidade do Kilamba (Leads)",
    category: "CLIENT_PLAYBOOK",
    source: "Relatório de Prospecção Ativa GAG Visual — Kilamba/Luanda",
    version: "1.0",
    status: "APPROVED",
    owner: "Josemar Gourgel",
    tags: ["Kilamba", "Leads", "Prospecção", "Vendas", "Restaurantes", "Moda"],
    associatedSkillIds: ["gag-data-analysis-brief", "gag-crm-requirements"],
    associatedAgentIds: ["agent-kia", "agent-consultant"],
    createdAt: "2026-08-20T10:00:00Z",
    updatedAt: "2026-08-22T06:00:00Z",
    content: `# Leads Qualificados para Prospecção Ativa (Centralidade do Kilamba)

| Empresa | Nicho | Localização | Ponto Fraco Identificado | Score GAG |
|---|---|---|---|---|
| **NAY84 Restaurante** | Restauração | Kilamba (V16) | Conteúdo focado só em fotos de pratos, sem branding forte | **18/20** |
| **Esquina Brasil** | Lazer/Pizza | Kilamba (U17) | Perfil com informação misturada (Karaokê + Pizza) | **17/20** |
| **Nova Odonto** | Saúde | Viana / Luanda | Presença funcional, sem autoridade visual premium | **19/20** |
| **AB DG** | Moda Masc. | Kilamba (T1) | Marca elegante que precisa de carrosséis e tráfego pago | **18/20** |
| **Loja ZOPO** | Moda Infantil | Xyami Kilamba | Grande stock que precisa de anúncios de catálogo (Ads) | **17/20** |

### Roteiros de Abordagem Personalizados:
- **Alvo 1 (NAY84 Restaurante - V16):** *"Olá! Sou o Josemar da GAG Visual. Notei que a vossa comida no V16 tem um aspeto incrível, mas o vosso perfil de Instagram ainda não reflete a qualidade do restaurante. Criei uma amostra de como poderiam apresentar o vosso menu de forma premium. Gostariam de ver como podemos aumentar as vossas reservas?"*
- **Alvo 2 (AB DG - Moda T1):** *"Bom dia! Sou o Josemar da GAG Visual. A vossa loja no T1 tem peças muito elegantes, mas acredito que poderiam estar a chegar a muito mais clientes em Luanda com tráfego pago estratégico. Nós ajudamos marcas de moda a converterem visualizações em vendas no WhatsApp. Podemos conversar?"*`,
  },
  {
    id: "kb-004",
    title: "Calendário Editorial de 30 Dias para Redes Sociais (@gourgeljosemar)",
    category: "CONTENT_STRATEGY",
    source: "Calendário Editorial de Redes Sociais GAG Visual",
    version: "2.0",
    status: "APPROVED",
    owner: "Josemar Gourgel",
    tags: ["Redes Sociais", "Instagram", "TikTok", "Calendário", "Carrosséis", "Reels"],
    associatedSkillIds: ["gag-content-production", "gag-video-production"],
    associatedAgentIds: ["agent-kia"],
    createdAt: "2026-08-15T09:00:00Z",
    updatedAt: "2026-08-22T06:00:00Z",
    content: `# Estrutura Semanal do Calendário Editorial GAG Visual

- **Semana 1 (Autoridade e Bastidores):** Realidade da agência, estudos de caso (ex: projeto PCA) e importância de identidade visual sólida.
- **Semana 2 (Educação e Dicas):** Dicas de Canva, WhatsApp Business e presença digital para empreendedores.
- **Semana 3 (Conversão e Oferta):** Promoção direta do Pacote de Lançamento (Kz 15.000) e criação de logótipos.
- **Semana 4 (Prova Social e Interação):** Depoimentos de clientes (ex: Comida Caseira Jolidanya), caixas de perguntas.

### Ganchos de Posts Chave:
- **Dia 1 (Reel/TikTok):** *"Soluções com propósito, inovação com raízes. Conhece a nova GAG Visual."* (CTA: Comenta 'EU QUERO')
- **Dia 3 (Carrossel):** *"Como transformámos a imagem da PCA com logótipo e vestuário personalizado."*
- **Dia 5 (Story/Post):** *"O teu negócio em Luanda merece mais do que amadorismo. Pacote de Lançamento por Kz 15.000."*
- **Dia 12 (Carrossel):** *"Quanto custa não ter uma marca profissional? O preço invisível da desorganização visual."*`,
  },
  {
    id: "kb-005",
    title: "Framework de Produção de Conteúdo e IA Aplicada",
    category: "CONTENT_STRATEGY",
    source: "Playbook Estratégico GAG",
    version: "1.8",
    status: "APPROVED",
    owner: "KIA Master",
    tags: ["IA", "Copywriting", "Workflows", "Escala"],
    associatedSkillIds: ["gag-content-production", "gag-prompt-engineering"],
    associatedAgentIds: ["agent-kia", "agent-consultant"],
    createdAt: "2026-02-05T12:00:00Z",
    updatedAt: "2026-08-18T09:10:00Z",
    content: `# Framework de Produção de Conteúdo e IA Aplicada

## 1. O Triângulo de Qualidade GAG
1. **Intenção Estratégica**: Todo conteúdo resolve uma dor real de negócios do cliente.
2. **Amplificação de IA**: Modelos avançados sintetizam dados, geram variações e aceleram a ideação.
3. **Curadoria Humana**: Refinamento de tom, checagem de fatos e polimento estético final.

## 2. Padrões de Roteirização
- Gancho inicial nos primeiros 3 segundos.
- Proposição de valor única e clara.
- Chamada para ação objetiva sem ambiguidades.`,
  },
  {
    id: "kb-006",
    title: "Protocolo de Scanner & Ingestão Documental",
    category: "INTERNAL_PROCESS",
    source: "Arquitetura Técnica GAG Core",
    version: "1.0",
    status: "APPROVED",
    owner: "Scanner Documental",
    tags: ["Scanner", "OCR", "Extração", "Segurança"],
    associatedSkillIds: ["gag-data-analysis-brief", "gag-security-screening"],
    associatedAgentIds: ["agent-scanner"],
    createdAt: "2026-08-14T15:00:00Z",
    updatedAt: "2026-08-21T11:45:00Z",
    content: `# Protocolo de Ingestão de Documentos

## 1. Fases do Scanner
1. **Recepção**: Upload do ficheiro (PDF, DOCX, TXT, imagem) para storage seguro.
2. **OCR & Extração**: Processamento via Gemini Document Intelligence com estruturação JSON.
3. **Validação de Papel**: Checagem de permissões e triagem de segurança.
4. **Transformação**: Conversão com 1 clique para artigo de conhecimento ou tarefas no backlog.`,
  },
  {
    id: "kb-007",
    title: "Norma Técnica: Metodologia de Prompting Interativo e Extração de Contexto",
    category: "INTERNAL_PROCESS",
    source: "Norma Técnica Metodologia de Prompting Interativo e Extração de Contexto",
    version: "2.0",
    status: "APPROVED",
    owner: "O Soba",
    tags: ["Prompting", "Engenharia de Prompt", "Contexto", "Chain-of-Thought", "Metodologia", "SOP"],
    associatedSkillIds: ["gag-prompt-engineering", "gag-knowledge-curation", "gag-ai-agent-design"],
    associatedAgentIds: ["agent-soba", "agent-kia", "agent-educator"],
    createdAt: "2026-08-23T11:00:00Z",
    updatedAt: "2026-08-23T13:45:00Z",
    content: `# Norma Técnica: Metodologia de Prompting Interativo e Extração de Contexto

## 1. Introdução à Engenharia de Prompt Interativa
A utilização de IA transitou definitivamente de um modelo passivo de "pergunta-resposta" para um paradigma de colaboração estratégica. É terminantemente proibido executar tarefas complexas sem um mapeamento contextual exaustivo.

## 2. Arquitetura da Persona e Especialidade
A Persona atua como um filtro de ruído técnico, garantindo o tom, as restrições e o rigor do domínio exigido.

## 3. Estruturação da Missão & Questionamento Sequencial (Chain-of-Thought)
Protocolo de Extração Interativa obrigatório:
- **Regra de Ouro:** *"Faça apenas UMA pergunta por vez e aguarde a resposta antes de fazer a próxima."*
- **Hierarquia de Extração:**
  1. Contexto (Domínio e histórico)
  2. Objetivo (Resultado final quantificável)
  3. Restrições (Prazos, orçamento, limites legais)
  4. Recursos (Ferramentas, APIs, bases de dados)
  5. Input Bruto final.

## 4. Padronização de Formato de Saída (Output Obrigatório)
Todo output executivo deve ser consumível em menos de 60 segundos:
- Tabelas em Markdown para dados estruturados e cronogramas.
- Matriz RACI para governança e atribuição de papéis.
- Matriz de Eisenhower (Urgente / Importante).
- Alertas de Risco destacados.
- Checklist de Ações Imediatas numeradas.`,
  },
  {
    id: "kb-008",
    title: "Compilação Mestre: 150+ Prompts Profissionais & Protocolo 360",
    category: "TECHNICAL",
    source: "Catálogo de Engenharia e Acervo de Prompts GAG Core 2026",
    version: "3.0",
    status: "APPROVED",
    owner: "O Soba",
    tags: ["Acervo", "150 Prompts", "Google Workspace", "Apps Script", "Automação", "Templates", "NotebookLM"],
    associatedSkillIds: ["gag-prompt-engineering", "gag-workflow-automation", "gag-video-production", "gag-content-production"],
    associatedAgentIds: ["agent-soba", "agent-kia", "agent-art-director", "agent-copywriter"],
    createdAt: "2026-08-23T11:30:00Z",
    updatedAt: "2026-08-23T13:45:00Z",
    content: `# Acervo de Prompts Estratégicos & Automação GAG Core

## 1. Módulos Cobertos
- **Módulo 1: Domínio Google Workspace**: Triagem inteligente de Inbox, auditoria de documentos no Google Drive e cruzamento de agenda.
- **Módulo 2: Mestre de Planilhas & Sheets**: Limpeza de dados, categorização multilingue, Procv/Index Match e geradores de Dashboards.
- **Módulo 3: Automações com Google Apps Script**: Robôs de e-mails automáticos, geradores de faturas em PDF, sincronizadores de eventos na agenda e web scrapers.
- **Módulo 4: YouTube & Video Intelligence**: Desconstrução de roteiros, caçador de cortes virais e tradução de conhecimento técnico.
- **Módulo 5: Fábrica de Conteúdo & Copywriting**: Clonador de tom de voz, roteiros de alta retenção (Reels/Shorts de 60s), carrosséis e páginas de captura (LPs).
- **Módulo 6: Negócios & Vendas de Alta Performance**: Quebra de objeções, auditoria de propostas e parcerias estratégicas.
- **Módulo 7: Aprendizado Acelerado & Tutoria**: Tutor socrático, geradores de simuladores de exame e flashcards Anki.

## 2. Padrões de Estrutura (Frameworks CIRO & RTF)
- **CIRO:** Contexto, Intenção, Papel (Role), Saída (Output).
- **RTF:** Role (Papel), Task (Tarefa), Format (Formato).`,
  },
  {
    id: "kb-009",
    title: "Guia de Roteiros Cinematográficos & Criação de Marca Angolana (GAG Labs)",
    category: "BRANDING",
    source: "Formação IA na Prática — GAG Labs & Roteiros Cinematográficos",
    version: "2.1",
    status: "APPROVED",
    owner: "Diretor de Arte & Motion Veo",
    tags: ["Roteiros", "Vídeo", "Veo 3.1", "Canva", "Identidade Visual", "Angola", "Luanda"],
    associatedSkillIds: ["gag-design-with-ai", "gag-video-production", "gag-content-production"],
    associatedAgentIds: ["agent-art-director", "agent-copywriter", "agent-educator"],
    createdAt: "2026-08-23T12:00:00Z",
    updatedAt: "2026-08-23T13:45:00Z",
    content: `# Guia de Roteirização Audiovisual & Criação de Marca — GAG Labs

## 1. Princípios Cinematográficos & Veo 3.1
- **Estrutura Fixa de Metadados:** METADATA_CORE → LANGUAGE_RULES → VISUAL_STYLE → GLOBAL_RULES → CHARACTER_LOCK → STORY_CORE → CONTINUITY → ROTEIRO → NEGATIVE_PROMPT.
- **Instruções Técnicas e Câmaras:** Em inglês (ex: *8K, Octane Render, volumetric light, drone FPV, cinematic depth of field*).
- **Falas e Diálogos:** Português de Angola (Luanda).
- **Regras:** Sem marcas de água indesejadas, sem logótipos distorcidos, proporção 16:9 para ecrãs e 9:16 para Reels/TikTok.

## 2. Metodologia de Ensino da GAG Labs
- **Aula 1:** Fundamentos, ChatGPT e modelos de linguagem aplicados a negócios angolanos.
- **Aula 2:** Produção de Conteúdo, currículos executivos e copywriting.
- **Aula 3:** Design com IA, paletas corporativas, logótipos e cartazes.
- **Aula 4:** Vídeo com IA, narração e geração com Veo.
- **Aula 5:** Projeto Final de Construção de Marca Completa com Propósito e Raízes.`,
  },
];

// Initial Tasks
export const INITIAL_TASKS: Task[] = [
  {
    id: "task-101",
    title: "Conectar Adapter Supabase PostgreSQL para Persistência Cloud",
    description: "Configurar variáveis de ambiente do Supabase e validar migração do schema para tabelas de conhecimento e tarefas.",
    priority: "CRITICAL",
    status: "IN_PROGRESS",
    dueDate: new Date(Date.now() + 2 * 24 * 3600 * 1000).toISOString(),
    assignedAgentId: "agent-kia",
    assignedUserId: "usr-owner-01",
    tags: ["Database", "Supabase", "Infra"],
    category: "Infraestrutura",
    createdAt: "2026-08-20T08:00:00Z",
    updatedAt: "2026-08-22T04:00:00Z",
    history: [
      { timestamp: "2026-08-20T08:00:00Z", user: "Josemar Gourgel", action: "Tarefa criada" },
      { timestamp: "2026-08-21T10:00:00Z", user: "KIA", action: "Status alterado para IN_PROGRESS" },
    ],
  },
  {
    id: "task-102",
    title: "Finalizar Pipeline de Extração OCR do Scanner Documental",
    description: "Garantir extração estruturada de PDFs e briefings com cálculo de índice de confiança e geração automática de tarefas.",
    priority: "HIGH",
    status: "IN_PROGRESS",
    dueDate: new Date(Date.now() + 1 * 24 * 3600 * 1000).toISOString(),
    assignedAgentId: "agent-scanner",
    assignedUserId: "usr-owner-01",
    tags: ["Scanner", "OCR", "Documentos"],
    category: "Inteligência Documental",
    createdAt: "2026-08-19T14:00:00Z",
    updatedAt: "2026-08-22T05:00:00Z",
    history: [
      { timestamp: "2026-08-19T14:00:00Z", user: "Josemar Gourgel", action: "Tarefa criada com prioridade HIGH" },
    ],
  },
  {
    id: "task-103",
    title: "Revisão e Aprovação do Agente Consultor GAG",
    description: "Testar respostas do Consultor GAG no simulador da Agent Factory antes de mover do estado DRAFT para ACTIVE.",
    priority: "MEDIUM",
    status: "REVIEW",
    dueDate: new Date(Date.now() + 4 * 24 * 3600 * 1000).toISOString(),
    assignedAgentId: "agent-kia",
    assignedUserId: "usr-owner-01",
    tags: ["Agent Factory", "Consultoria", "Revisão"],
    category: "Agentes",
    createdAt: "2026-08-18T16:30:00Z",
    updatedAt: "2026-08-21T18:00:00Z",
  },
  {
    id: "task-104",
    title: "Auditoria Completa de Permissões RBAC e Hash de Logs",
    description: "Verificar se nenhuma operação crítica de agente ocorre sem hash de auditoria e validação de permissão de OWNER.",
    priority: "HIGH",
    status: "TODO",
    dueDate: new Date(Date.now() + 5 * 24 * 3600 * 1000).toISOString(),
    assignedAgentId: "agent-kia",
    assignedUserId: "usr-owner-01",
    tags: ["Segurança", "Auditoria", "RBAC"],
    category: "Segurança",
    createdAt: "2026-08-21T09:00:00Z",
    updatedAt: "2026-08-21T09:00:00Z",
  },
];

// Initial Calendar Events
export const INITIAL_EVENTS: CalendarEvent[] = [
  {
    id: "ev-01",
    title: "Entrega do Scanner Documental V1",
    description: "Marco de validação de processamento de documentos com OCR e extração estruturada.",
    type: "MILESTONE",
    startDate: new Date(Date.now() + 1 * 24 * 3600 * 1000).toISOString(),
    allDay: true,
    priority: "CRITICAL",
    relatedTaskId: "task-102",
    relatedAgentId: "agent-scanner",
    status: "CONFIRMED",
  },
  {
    id: "ev-02",
    title: "Prazo: Conexão Supabase PostgreSQL",
    description: "Configuração do schema de persistência cloud e chaves de ambiente.",
    type: "TASK_DEADLINE",
    startDate: new Date(Date.now() + 2 * 24 * 3600 * 1000).toISOString(),
    allDay: true,
    priority: "HIGH",
    relatedTaskId: "task-101",
    relatedAgentId: "agent-kia",
    status: "CONFIRMED",
  },
  {
    id: "ev-03",
    title: "Sessão Estratégica: Lançamento Agentes GAG",
    description: "Reunião executiva para ativação de novos agentes especializados na Agent Factory.",
    type: "MEETING",
    startDate: new Date(Date.now() + 4 * 24 * 3600 * 1000).toISOString(),
    allDay: false,
    priority: "MEDIUM",
    relatedTaskId: "task-103",
    status: "CONFIRMED",
  },
];

// Initial Audit Logs
export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: "aud-001",
    timestamp: "2026-08-22T05:45:00Z",
    userId: "usr-owner-01",
    userName: "Josemar Gourgel",
    agentId: "agent-kia",
    agentName: "KIA",
    action: "Inicialização do Sistema Operacional GAG Core",
    capability: "system_implementation",
    status: "SUCCESS",
    details: "Núcleo operacional KIA carregado com 3 agentes, 10 skills e Execution Router ativo.",
    hash: "0x9f4a8b72e11c34a78ef45b9021a8bc43",
    confirmationGranted: true,
    ipOrEnv: "Cloud Run / AI Studio",
  },
  {
    id: "aud-002",
    timestamp: "2026-08-22T05:30:00Z",
    userId: "usr-owner-01",
    userName: "Josemar Gourgel",
    agentId: "agent-kia",
    agentName: "KIA",
    action: "Triagem de Permissões RBAC",
    capability: "internal_tool",
    status: "SUCCESS",
    details: "Papel OWNER validado com acesso irrestrito. Agentes restritos às suas capabilities declaradas.",
    hash: "0x7c3e12b489ad01ff88902a7b312ccb91",
    confirmationGranted: true,
  },
];
