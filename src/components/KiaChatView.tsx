import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  Sparkles,
  Bot,
  User,
  Paperclip,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Shield,
  Layers,
  FileText,
  Clock,
  ExternalLink,
  ChevronRight,
  RefreshCw,
  Copy,
  Check,
  Radio,
  Sliders,
  Square,
  Zap,
  HelpCircle,
  X,
  CornerDownLeft,
  AudioWaveform as WaveformIcon,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { ChatMessage, ActionCard } from "../types";
import { speakNaturalText, stopTtsAudio, playSfx } from "../utils/audio";
import { interpretVoiceCommand } from "../utils/voiceCommands";
import { KiaCapabilitiesModal } from "./KiaCapabilitiesModal";
import { AgentAvatar } from "./AgentAvatar";

export const KiaChatView: React.FC = () => {
  const {
    chatMessages,
    sendKiaMessage,
    clearChat,
    isKiaThinking,
    activeRole,
    currentUser,
    setActiveTab,
    systemSettings,
    updateSettings,
    tasks,
    scannedDocs,
    agents,
    createTask,
    triggerAgentSynergyExecution,
    setShowSynergyTour,
  } = useApp();

  const [inputText, setInputText] = useState("");
  const [attachments, setAttachments] = useState<any[]>([]);
  const [isPlayingAudioId, setIsPlayingAudioId] = useState<string | null>(null);

  // Real-Time Voice Recording & Live Speech Recognition State
  const [isRecordingAudio, setIsRecordingAudio] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [audioLevels, setAudioLevels] = useState<number[]>(new Array(16).fill(15));
  const [liveTranscript, setLiveTranscript] = useState("");
  const [isTranscribingAi, setIsTranscribingAi] = useState(false);
  const [voiceStatusNotice, setVoiceStatusNotice] = useState<string | null>(null);

  const [isSpeakingLive, setIsSpeakingLive] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showVoiceSettings, setShowVoiceSettings] = useState(false);
  const [showCapabilitiesModal, setShowCapabilitiesModal] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState(systemSettings.voiceName || "Kore");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Microphone & Audio Processing Refs
  const audioStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const durationTimerRef = useRef<any>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recognitionRef = useRef<any>(null);
  const recordingMimeTypeRef = useRef<string>("audio/webm");

  // Dynamically compute contextual Smart Suggestions based on conversation history
  const getSmartSuggestions = (): { label: string; prompt: string; icon?: string }[] => {
    if (chatMessages.length === 0) {
      return [
        { label: "⚡ Disparar Sinergia", prompt: "Disparar sinergia operacional entre todos os 13 agentes e delegar tarefas no backlog" },
        { label: "🎬 Roteiro Veo 3.1", prompt: "Gerar roteiro cinemático 9:16 com o Diretor de Arte para vídeo de lançamento" },
        { label: "🔄 Automação Kaza Core", prompt: "Como estruturar uma integração robusta entre Supabase, Google Apps Script e Make?" },
        { label: "📈 Plano de Tráfego", prompt: "Criar estratégia de campanhas digitais e funil de vendas para Luanda" },
      ];
    }

    const lastMessages = chatMessages.slice(-3);
    const contextText = lastMessages.map((m) => m.content.toLowerCase()).join(" ");

    if (contextText.includes("sinergia") || contextText.includes("active") || contextText.includes("disparar") || contextText.includes("13 agentes")) {
      return [
        { label: "📋 Ver Tarefas no Kanban", prompt: "Listar todas as tarefas ativas geradas pela Sinergia no backlog" },
        { label: "👑 Novo Agente na Factory", prompt: "Quero desenhar o blueprint de um novo agente na Agent Factory" },
        { label: "🎬 Criar Vídeo no Estúdio", prompt: "Ir para o Estúdio Multimodal e gerar um vídeo com o Diretor de Arte" },
        { label: "🔍 Auditar Execução", prompt: "Verificar os logs de auditoria da última execução de sinergia" },
      ];
    }

    if (contextText.includes("veo") || contextText.includes("vídeo") || contextText.includes("avatar") || contextText.includes("motion") || contextText.includes("design")) {
      return [
        { label: "🎭 Avatar com Traços Angolanos", prompt: "Gerar prompt do Diretor de Avatares para personagem realista com estética angolana" },
        { label: "🎨 Brand Kit Completo", prompt: "Estruturar paleta de cores HEX e tipografia com o Estrategista de Brand Kits" },
        { label: "🎬 Roteiro 9:16 para Reels", prompt: "Escrever roteiro dinâmico de 30 segundos para vídeo vertical no Instagram" },
        { label: "✨ Parâmetros Veo 3.1", prompt: "Quais são as melhores configurações de iluminação e câmara para o modelo Veo 3.1?" },
      ];
    }

    if (contextText.includes("kaza") || contextText.includes("supabase") || contextText.includes("make") || contextText.includes("automação") || contextText.includes("cisco") || contextText.includes("rede")) {
      return [
        { label: "🔄 Pipeline Typeform ➔ CRM", prompt: "Mapear fluxo de entrada de formulários Typeform para o CRM no HubSpot" },
        { label: "🌐 Topologia Cisco Packet Tracer", prompt: "Como simular a topologia de rede corporativa segura com o Analista de Infraestrutura?" },
        { label: "🛡️ Auditoria de Segurança", prompt: "Fazer triagem de segurança e conformidade de dados nos nossos webhooks" },
        { label: "📊 Webhook no Google Apps Script", prompt: "Criar script de webhook no Apps Script para gerar faturas em PDF automaticamente" },
      ];
    }

    if (contextText.includes("tráfego") || contextText.includes("campanha") || contextText.includes("roas") || contextText.includes("vendas") || contextText.includes("conversão") || contextText.includes("marketing")) {
      return [
        { label: "📈 Otimizar ROAS de Anúncios", prompt: "Como o Gestor de Campanhas pode otimizar o custo por lead e o ROAS?" },
        { label: "✍️ Carrossel de 10 Lâminas", prompt: "Escrever carrossel educativo de alta conversão para o Instagram" },
        { label: "💼 Proposta Value-Based", prompt: "Estruturar proposta comercial de alto valor com o Consultor GAG" },
        { label: "🎧 Automação de Suporte", prompt: "Configurar triagem de leads rápida no WhatsApp e formulários de suporte" },
      ];
    }

    if (contextText.includes("documento") || contextText.includes("ocr") || contextText.includes("scanner") || contextText.includes("pdf") || contextText.includes("extrair")) {
      return [
        { label: "📋 Extrair Entidades para Tarefas", prompt: "Converter os dados extraídos do último documento em tarefas de equipa" },
        { label: "🔍 Escanear Novo Documento", prompt: "Abrir o Scanner Documental para fazer OCR e verificação de segurança" },
        { label: "📊 Resumo Executivo em Tabela", prompt: "Sintetizar as informações do documento numa tabela executiva com prazos" },
      ];
    }

    // Default dynamic options
    return [
      { label: "⚡ Disparar Sinergia Global", prompt: "Disparar sinergia operacional entre todos os 13 agentes" },
      { label: "📖 Consultar 150+ Prompts", prompt: "Mostrar categorias e prompts recomendados do acervo de 150+ prompts" },
      { label: "📋 Criar Tarefa no Kanban", prompt: "Criar uma nova tarefa de alta prioridade no backlog de projetos" },
      { label: "👑 Blueprints na Agent Factory", prompt: "Como o Soba arquiteta novos blueprints de IA na Agent Factory?" },
    ];
  };

  const handleSuggestionClick = (prompt: string) => {
    if (isKiaThinking) return;
    playSfx("action");
    sendKiaMessage(prompt);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, isKiaThinking, liveTranscript, isRecordingAudio]);

  // Clean up all audio nodes on unmount
  useEffect(() => {
    return () => {
      cleanupAudioRecording();
    };
  }, []);

  const cleanupAudioRecording = () => {
    if (durationTimerRef.current) {
      clearInterval(durationTimerRef.current);
      durationTimerRef.current = null;
    }
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // ignore
      }
      recognitionRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      try {
        mediaRecorderRef.current.stop();
      } catch (e) {
        // ignore
      }
    }
    if (audioStreamRef.current) {
      audioStreamRef.current.getTracks().forEach((track) => track.stop());
      audioStreamRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== "closed") {
      try {
        audioContextRef.current.close();
      } catch (e) {
        // ignore
      }
      audioContextRef.current = null;
    }
    analyserRef.current = null;
    setIsRecordingAudio(false);
  };

  // Start Real-Time Voice Recording with Microphone API + Live Equalizer + Web Speech
  const startVoiceRecording = async () => {
    // Stop any ongoing TTS audio
    stopTtsAudio();
    setIsSpeakingLive(false);
    setIsPlayingAudioId(null);
    setVoiceStatusNotice(null);
    setLiveTranscript("");
    setRecordingDuration(0);

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setVoiceStatusNotice("⚠️ O seu navegador não suporta acesso ao Microfone.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      audioStreamRef.current = stream;

      // 1. Initialize Web Audio API Analyser for Live Waveform Frequency Visualization
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtxClass) {
        const audioCtx = new AudioCtxClass();
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 64;
        analyser.smoothingTimeConstant = 0.8;
        const source = audioCtx.createMediaStreamSource(stream);
        source.connect(analyser);
        audioContextRef.current = audioCtx;
        analyserRef.current = analyser;

        // Throttled loop to sample 16 frequency bands without choking React state re-renders
        let lastSampleTime = 0;
        const updateAudioLevels = (now: number) => {
          if (!analyserRef.current) return;

          // Only update React state every 75ms to prioritize AI execution thread
          if (now - lastSampleTime > 75) {
            lastSampleTime = now;
            const bufferLength = analyserRef.current.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);
            analyserRef.current.getByteFrequencyData(dataArray);

            const barsCount = 16;
            const step = Math.max(1, Math.floor(bufferLength / barsCount));
            const newLevels: number[] = [];

            for (let i = 0; i < barsCount; i++) {
              const val = dataArray[i * step] || 0;
              const pct = Math.min(100, Math.max(12, Math.round((val / 255) * 100)));
              newLevels.push(pct);
            }

            setAudioLevels(newLevels);
          }

          animFrameRef.current = requestAnimationFrame(updateAudioLevels);
        };
        animFrameRef.current = requestAnimationFrame(updateAudioLevels);
      }

      // 2. Initialize MediaRecorder for complete audio blob capture
      const supportedMimes = [
        "audio/webm;codecs=opus",
        "audio/webm",
        "audio/mp4",
        "audio/ogg;codecs=opus",
        "",
      ];
      let chosenMime = "";
      if (typeof MediaRecorder !== "undefined") {
        for (const m of supportedMimes) {
          if (!m || MediaRecorder.isTypeSupported(m)) {
            chosenMime = m;
            break;
          }
        }
      }

      recordingMimeTypeRef.current = chosenMime || "audio/webm";
      audioChunksRef.current = [];

      if (typeof MediaRecorder !== "undefined") {
        const recorder = chosenMime
          ? new MediaRecorder(stream, { mimeType: chosenMime })
          : new MediaRecorder(stream);

        recorder.ondataavailable = (event) => {
          if (event.data && event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };
        recorder.start(100);
        mediaRecorderRef.current = recorder;
      }

      // 3. Initialize Live Web Speech Recognition for instant word streaming
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        try {
          const recognition = new SpeechRecognition();
          recognition.lang =
            systemSettings.voiceName === "Aoede" || systemSettings.voiceName === "Fenrir"
              ? "pt-PT"
              : "pt-BR";
          recognition.interimResults = true;
          recognition.continuous = true;
          recognition.maxAlternatives = 2;

          recognition.onresult = (event: any) => {
            let finalStr = "";
            let interimStr = "";
            for (let i = 0; i < event.results.length; ++i) {
              if (event.results[i].isFinal) {
                finalStr += event.results[i][0].transcript + " ";
              } else {
                interimStr += event.results[i][0].transcript;
              }
            }
            const combined = (finalStr + interimStr).trim();
            if (combined) {
              setLiveTranscript(combined);
            }
          };

          recognition.onerror = (err: any) => {
            console.warn("Live Web Speech notice:", err.error);
          };

          recognitionRef.current = recognition;
          recognition.start();
        } catch (speechErr) {
          console.warn("Speech recognition initialization note:", speechErr);
        }
      }

      // 4. Start recording timer
      setIsRecordingAudio(true);
      durationTimerRef.current = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);

      playSfx("notification", 0.2);
    } catch (err: any) {
      console.error("Microphone access error:", err);
      cleanupAudioRecording();
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        setVoiceStatusNotice("⚠️ Acesso ao microfone recusado. Permite o microfone nas definições do navegador.");
      } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
        setVoiceStatusNotice("⚠️ Nenhum microfone encontrado neste dispositivo.");
      } else {
        setVoiceStatusNotice(`⚠️ Erro no microfone: ${err.message || "Falha ao iniciar"}`);
      }
      setTimeout(() => setVoiceStatusNotice(null), 6000);
    }
  };

  // Helper to convert blob to base64
  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        const base64 = result.split(",")[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  // Finish Recording, Transcribe (with fallback to Gemini Multimodal Audio if needed) and Execute Command
  const stopVoiceRecordingAndSend = async () => {
    const currentLiveText = liveTranscript.trim();
    const mimeType = recordingMimeTypeRef.current;

    // Stop recording devices cleanly
    cleanupAudioRecording();
    playSfx("click", 0.2);

    // If we already have live text from Web Speech API with sufficient length, send immediately
    if (currentLiveText.length >= 2) {
      setVoiceStatusNotice(`Comando de voz: "${currentLiveText}"`);
      await handleVoiceCommandExecution(currentLiveText);
      setLiveTranscript("");
      return;
    }

    // Otherwise, convert recorded audio chunks and use Gemini Audio Transcription endpoint
    if (audioChunksRef.current.length > 0) {
      setIsTranscribingAi(true);
      setVoiceStatusNotice("A transcrever áudio com IA Multimodal...");
      try {
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
        const base64 = await blobToBase64(audioBlob);

        const res = await fetch("/api/audio/transcribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            base64Audio: base64,
            mimeType: mimeType || "audio/webm",
          }),
        });

        const data = await res.json();
        setIsTranscribingAi(false);

        if (data.success && data.text && data.text.trim()) {
          const transcribed = data.text.trim();
          setVoiceStatusNotice(`Voz reconhecida: "${transcribed}"`);
          await handleVoiceCommandExecution(transcribed);
          setLiveTranscript("");
        } else {
          setVoiceStatusNotice("Nenhum texto detetado na gravação de voz.");
          setTimeout(() => setVoiceStatusNotice(null), 4000);
        }
      } catch (err: any) {
        console.error("Transcription fallback error:", err);
        setIsTranscribingAi(false);
        setVoiceStatusNotice("Falha ao transcrever o áudio.");
        setTimeout(() => setVoiceStatusNotice(null), 4000);
      }
    } else {
      setVoiceStatusNotice("Gravação vazia.");
      setTimeout(() => setVoiceStatusNotice(null), 3000);
    }
  };

  // Stop recording and insert transcribed text into text input for user to edit before sending
  const stopVoiceRecordingAndInsert = async () => {
    const currentLiveText = liveTranscript.trim();
    const mimeType = recordingMimeTypeRef.current;

    cleanupAudioRecording();
    playSfx("click", 0.15);

    if (currentLiveText) {
      setInputText((prev) => (prev ? `${prev} ${currentLiveText}` : currentLiveText));
      setLiveTranscript("");
      setVoiceStatusNotice("Texto inserido no campo de escrita.");
      setTimeout(() => setVoiceStatusNotice(null), 3000);
      return;
    }

    if (audioChunksRef.current.length > 0) {
      setIsTranscribingAi(true);
      setVoiceStatusNotice("A transcrever áudio para texto...");
      try {
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
        const base64 = await blobToBase64(audioBlob);

        const res = await fetch("/api/audio/transcribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            base64Audio: base64,
            mimeType: mimeType || "audio/webm",
          }),
        });

        const data = await res.json();
        setIsTranscribingAi(false);

        if (data.success && data.text && data.text.trim()) {
          const transcribed = data.text.trim();
          setInputText((prev) => (prev ? `${prev} ${transcribed}` : transcribed));
          setVoiceStatusNotice("Texto transcrito com sucesso.");
          setLiveTranscript("");
        } else {
          setVoiceStatusNotice("Nenhum texto identificado no áudio.");
        }
        setTimeout(() => setVoiceStatusNotice(null), 3000);
      } catch (err) {
        setIsTranscribingAi(false);
        setVoiceStatusNotice("Erro na transcrição de áudio.");
        setTimeout(() => setVoiceStatusNotice(null), 3000);
      }
    }
  };

  // Cancel and discard voice recording
  const cancelVoiceRecording = () => {
    cleanupAudioRecording();
    setLiveTranscript("");
    setVoiceStatusNotice("Gravação cancelada.");
    playSfx("action", 0.15);
    setTimeout(() => setVoiceStatusNotice(null), 2500);
  };

  // Natural Speech Command Interpretation & Router
  const handleVoiceCommandExecution = async (spokenText: string) => {
    setVoiceStatusNotice("A interpretar comando de voz...");
    const parsed = interpretVoiceCommand(spokenText);

    // 1. Audio Control
    if (parsed.intent === "AUDIO_CONTROL") {
      if (parsed.audioAction === "STOP") {
        stopTtsAudio();
        setIsSpeakingLive(false);
        setIsPlayingAudioId(null);
        setVoiceStatusNotice("Áudio silenciado.");
        setTimeout(() => setVoiceStatusNotice(null), 2500);
        return;
      }
      if (parsed.audioAction === "ENABLE_VOICE") {
        updateSettings({ autoAudioTts: true });
        setVoiceStatusNotice(parsed.voiceFeedback || "Leitura ativada.");
        speakFeedback(parsed.voiceFeedback || "Leitura de voz ativada.");
        return;
      }
      if (parsed.audioAction === "DISABLE_VOICE") {
        updateSettings({ autoAudioTts: false });
        stopTtsAudio();
        setVoiceStatusNotice(parsed.voiceFeedback || "Leitura desativada.");
        return;
      }
    }

    // 2. Direct Navigation Command
    if (parsed.intent === "NAVIGATE" && parsed.targetTab) {
      setActiveTab(parsed.targetTab);
      setVoiceStatusNotice(parsed.voiceFeedback || "A navegar...");
      if (parsed.voiceFeedback) {
        speakFeedback(parsed.voiceFeedback);
      }
      return;
    }

    // 3. Direct Task Creation Command
    if (parsed.intent === "CREATE_TASK" && parsed.taskData) {
      createTask({
        title: parsed.taskData.title,
        description: `Criada via Comando de Voz: "${spokenText}"`,
        priority: parsed.taskData.priority,
        status: "TODO",
        dueDate: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
        assignedAgentId: "agent-kia",
        assignedUserId: currentUser.id,
        tags: ["Comando de Voz", "KIA"],
        category: parsed.taskData.category,
      });

      setVoiceStatusNotice(parsed.voiceFeedback || "Tarefa criada.");
      if (parsed.voiceFeedback) {
        speakFeedback(parsed.voiceFeedback);
      }
      return;
    }

    // 4. Clear Chat Command
    if (parsed.intent === "CLEAR_CHAT") {
      clearChat();
      setVoiceStatusNotice(parsed.voiceFeedback || "Histórico limpo.");
      if (parsed.voiceFeedback) {
        speakFeedback(parsed.voiceFeedback);
      }
      return;
    }

    // 5. System Status Briefing Command
    if (parsed.intent === "SYSTEM_STATUS") {
      const pendingTasks = tasks.filter((t) => t.status !== "DONE" && t.status !== "CANCELLED").length;
      const docsCount = scannedDocs.length;
      const agentsCount = agents.length;
      const briefing = `Relatório do GAG Core: Tens ${pendingTasks} tarefas ativas no backlog, ${docsCount} documentos indexados no scanner e ${agentsCount} agentes operacionais. O sistema está 100% calibrado.`;

      setVoiceStatusNotice("A gerar resumo de voz do sistema...");
      speakFeedback(briefing);
      return;
    }

    // 6. General Conversational Instruction -> Send to KIA AI
    setInputText("");
    await sendKiaMessage(spokenText, []);
    setVoiceStatusNotice(null);
  };

  // Helper for voice playback
  const speakFeedback = async (text: string, messageId?: string) => {
    if (messageId) {
      setIsPlayingAudioId(messageId);
    }
    setIsSpeakingLive(true);

    try {
      await speakNaturalText(text, {
        voiceName: systemSettings.voiceName || selectedVoice,
        onEnd: () => {
          setIsSpeakingLive(false);
          setIsPlayingAudioId(null);
        },
      });
    } catch {
      setIsSpeakingLive(false);
      setIsPlayingAudioId(null);
    }
  };

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    playSfx("click");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const content = event.target?.result as string;
      const newAttachment = {
        id: `att-${Date.now()}`,
        name: file.name,
        type: file.type,
        size: file.size,
        content: content.startsWith("data:") ? content.split(",")[1] : content,
        isBase64: content.startsWith("data:"),
      };

      setAttachments((prev) => [...prev, newAttachment]);
      playSfx("action");
    };

    if (file.type.startsWith("image/") || file.type === "application/pdf") {
      reader.readAsDataURL(file);
    } else {
      reader.readAsText(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((!inputText.trim() && attachments.length === 0) || isKiaThinking) return;

    playSfx("click");
    sendKiaMessage(inputText, attachments);
    setInputText("");
    setAttachments([]);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Quick Voice Prompts for direct click
  const quickVoicePrompts = [
    { label: "⚡ Sinergia dos 13 Agentes", cmd: "Disparar sinergia operacional completa entre todos os 13 agentes" },
    { label: "🎬 Roteiro Cinemático Veo", cmd: "Gerar roteiro de vídeo cinemático de 30 segundos no Veo 3.1" },
    { label: "🔄 Automação Kaza Core", cmd: "Estruturar fluxo de automação entre Supabase, Make e Apps Script" },
    { label: "📊 Relatório do Sistema", cmd: "Qual é o status geral do sistema GAG Core?" },
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)] max-w-6xl mx-auto p-4 animate-fadeIn">
      {/* Header & Mode Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 mb-3 border-b border-slate-800/80">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <AgentAvatar agentId="agent-kia" size="lg" />
            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-[#030712] animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-base sm:text-lg font-black text-white tracking-tight flex items-center gap-1.5">
                KIA Master OS
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Orquestradora
                </span>
              </h1>
            </div>
            <p className="text-xs text-slate-400">
              Comando multimodal por voz em tempo real (Microphone API) e texto da GAG Visual
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 self-end sm:self-auto">
          <button
            onClick={() => setShowCapabilitiesModal(true)}
            className="px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/40 text-slate-300 hover:text-amber-300 text-xs font-semibold flex items-center space-x-1.5 transition-all shadow-sm"
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
            <span>Capacidades</span>
          </button>

          <button
            onClick={() => setShowVoiceSettings(!showVoiceSettings)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center space-x-1.5 transition-all shadow-sm ${
              showVoiceSettings || systemSettings.autoAudioTts
                ? "bg-amber-500/20 border-amber-500/40 text-amber-300"
                : "bg-slate-900/90 border-slate-800 text-slate-400 hover:text-slate-200"
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Voz Neural</span>
          </button>

          <button
            onClick={() => {
              if (window.confirm("Limpar todo o histórico desta sessão com a KIA?")) {
                clearChat();
                playSfx("click");
              }
            }}
            className="p-2 text-slate-400 hover:text-red-400 rounded-xl hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-colors"
            title="Limpar Conversa"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Voice Configuration Drawer */}
      {showVoiceSettings && (
        <div className="p-3.5 rounded-2xl bg-[#0b0f19] border border-amber-500/30 mb-3 shadow-xl animate-fadeIn text-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <span className="text-slate-300 font-semibold">Leitura Automática por Voz (TTS):</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={systemSettings.autoAudioTts}
                  onChange={(e) => updateSettings({ autoAudioTts: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500"></div>
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-slate-400">Voz da KIA:</span>
              <select
                value={selectedVoice}
                onChange={(e) => {
                  setSelectedVoice(e.target.value);
                  updateSettings({ voiceName: e.target.value });
                }}
                className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-white text-xs focus:outline-none focus:border-amber-500"
              >
                <option value="Kore">Kore (Executiva & Polida)</option>
                <option value="Aoede">Aoede (Expressiva & Melódica)</option>
                <option value="Puck">Puck (Dinâmico & Rápido)</option>
                <option value="Fenrir">Fenrir (Firme & Autoridade)</option>
                <option value="Charon">Charon (Calmo & Profundo)</option>
              </select>

              <button
                type="button"
                onClick={() =>
                  speakFeedback(`Olá, sou a KIA. A voz neural ${selectedVoice} está ativa no GAG Core.`)
                }
                className="px-2.5 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-lg hover:bg-amber-500/30 text-[11px] font-medium transition-colors"
              >
                Ouvir Demonstração
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Real-time Voice Audio Recorder & Equalizer Console (Microphone API) */}
      {(isRecordingAudio || isTranscribingAi) && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-950 via-[#0e1322] to-slate-950 border-2 border-amber-500/60 mb-3 shadow-2xl animate-fadeIn relative overflow-hidden">
          {/* Subtle Ambient Glow */}
          <div className="absolute -top-12 -left-12 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-red-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
            {/* Recording status + timer */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 px-3 py-1 bg-red-500/20 border border-red-500/50 rounded-full">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                <span className="text-xs font-bold text-red-300 uppercase tracking-wider">
                  {isTranscribingAi ? "Processando IA" : "Microfone Ativo"}
                </span>
              </div>
              <div className="flex items-center space-x-1.5 text-xs font-mono font-bold text-white bg-slate-900/90 px-2.5 py-1 rounded-lg border border-slate-800">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>{formatTime(recordingDuration)}</span>
              </div>
            </div>

            {/* Live 16-Bar Frequency Equalizer */}
            <div className="flex items-center space-x-1 h-8 px-3 py-1 bg-black/40 rounded-xl border border-slate-800/80">
              {audioLevels.map((lvl, idx) => (
                <div
                  key={idx}
                  className="w-1.5 rounded-full bg-gradient-to-t from-amber-500 to-yellow-300 transition-all duration-75"
                  style={{
                    height: `${lvl}%`,
                    opacity: isTranscribingAi ? 0.3 : 0.4 + (lvl / 100) * 0.6,
                  }}
                />
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2 self-end sm:self-auto">
              <button
                type="button"
                onClick={stopVoiceRecordingAndSend}
                disabled={isTranscribingAi}
                className="px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black font-bold text-xs rounded-xl shadow-lg flex items-center space-x-1.5 transition-all active:scale-95 disabled:opacity-50"
                title="Concluir e enviar comando imediatamente sem confirmação"
              >
                {isTranscribingAi ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>A transcrever...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Concluir & Enviar Imediatamente</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={cancelVoiceRecording}
                className="px-2.5 py-2 text-slate-400 hover:text-red-400 rounded-xl hover:bg-slate-900 transition-colors text-xs flex items-center space-x-1"
                title="Descartar Gravação"
              >
                <X className="w-4 h-4" />
                <span className="hidden sm:inline">Descartar</span>
              </button>
            </div>
          </div>

          {/* Live Transcript Stream Output */}
          <div className="p-3 rounded-xl bg-black/60 border border-slate-800/90 min-h-[44px] flex items-center">
            {liveTranscript ? (
              <p className="text-xs sm:text-sm text-amber-200 font-medium leading-relaxed">
                <span className="text-slate-400 font-normal">Transcrevendo: </span>
                "{liveTranscript}"
                <span className="inline-block w-1.5 h-4 bg-amber-400 ml-1 animate-pulse align-middle" />
              </p>
            ) : isTranscribingAi ? (
              <div className="flex items-center space-x-2 text-xs text-amber-300">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-400" />
                <span>A transcrever o sinal de áudio do microfone através do modelo multimodal...</span>
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic flex items-center space-x-2">
                <Mic className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                <span>Fala claramente perto do microfone. As tuas palavras aparecem aqui em tempo real...</span>
              </p>
            )}
          </div>
        </div>
      )}

      {/* Voice Status Notice (Feedback toast) */}
      {voiceStatusNotice && !isRecordingAudio && (
        <div className="flex items-center justify-between px-4 py-2 bg-gradient-to-r from-amber-950/40 via-[#0b0f19] to-slate-950 border border-amber-500/30 rounded-2xl mb-3 shadow-md animate-fadeIn text-xs">
          <div className="flex items-center space-x-2 text-amber-300 font-medium truncate">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="truncate">{voiceStatusNotice}</span>
          </div>
          {isSpeakingLive && (
            <button
              onClick={() => {
                stopTtsAudio();
                setIsSpeakingLive(false);
                setIsPlayingAudioId(null);
              }}
              className="px-2.5 py-0.5 bg-amber-500/20 text-amber-300 rounded-lg font-semibold hover:bg-amber-500/30 transition-colors flex items-center space-x-1"
            >
              <VolumeX className="w-3 h-3" />
              <span>Parar Áudio</span>
            </button>
          )}
        </div>
      )}

      {/* Messages List Area */}
      <div className="flex-1 overflow-y-auto space-y-4 p-4 rounded-2xl bg-[#07090e]/60 border border-slate-800/80 mb-3 shadow-inner">
        {chatMessages.map((msg, idx) => {
          const isAssistant = msg.role === "assistant";
          const isPlayingThis = isPlayingAudioId === msg.id;

          return (
            <div
              key={`${msg.id}-${idx}`}
              className={`flex items-start space-x-3 ${
                isAssistant ? "justify-start" : "justify-end"
              }`}
            >
              {isAssistant && (
                <AgentAvatar agentId="agent-kia" size="sm" className="mt-1" />
              )}

              <div
                className={`max-w-2xl rounded-2xl p-4 shadow-md ${
                  isAssistant
                    ? "bg-[#0b0f19] border border-slate-800/90 text-slate-200"
                    : "bg-gradient-to-br from-amber-500 to-yellow-600 text-black font-medium"
                }`}
              >
                {/* Message Header */}
                <div className="flex items-center justify-between text-[10px] pb-1.5 mb-1.5 border-b border-black/10 dark:border-slate-800/60">
                  <div className="flex items-center space-x-1.5">
                    <span className="font-bold">
                      {isAssistant ? "KIA Master AI" : currentUser.name}
                    </span>
                    {isAssistant && msg.capability && (
                      <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-mono text-[9px] border border-amber-500/30">
                        {msg.capability}
                      </span>
                    )}
                  </div>
                  <span className="opacity-60">{new Date(msg.timestamp).toLocaleTimeString()}</span>
                </div>

                {/* Message Body */}
                <div className="text-xs sm:text-sm whitespace-pre-wrap leading-relaxed">
                  {msg.content}
                </div>

                {/* Action Card if present */}
                {msg.actionCard && (
                  <div className="mt-3 p-3 rounded-xl bg-slate-900/90 border border-amber-500/30 text-xs">
                    <div className="flex items-center space-x-2 text-amber-400 font-bold mb-1">
                      <Zap className="w-3.5 h-3.5" />
                      <span>{msg.actionCard.title}</span>
                    </div>
                    <p className="text-slate-300 text-[11px] mb-2">{msg.actionCard.description}</p>
                    {msg.actionCard.actionLabel && (
                      <button
                        onClick={() => {
                          if (msg.actionCard?.type === "task_created") {
                            setActiveTab("tasks");
                          } else if (msg.actionCard?.type === "knowledge_added") {
                            setActiveTab("knowledge");
                          } else if (msg.actionCard?.type === "agent_drafted") {
                            setActiveTab("agent-factory");
                          } else {
                            setActiveTab("dashboard");
                          }
                        }}
                        className="px-2.5 py-1 rounded-lg bg-amber-500 text-black font-bold text-[11px] hover:bg-amber-400 transition-colors flex items-center space-x-1"
                      >
                        <span>{msg.actionCard.actionLabel}</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                )}

                {/* Footer Controls for Assistant Messages */}
                {isAssistant && (
                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-800/60 text-[11px]">
                    <div className="flex items-center space-x-2 text-slate-400">
                      {msg.toolsUsed && msg.toolsUsed.length > 0 && (
                        <span className="text-[10px] text-slate-500">
                          Ferramentas: {msg.toolsUsed.join(", ")}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleCopyText(msg.id, msg.content)}
                        className="p-1 hover:text-white text-slate-400 transition-colors"
                        title="Copiar texto"
                      >
                        {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>

                      <button
                        onClick={() => {
                          if (isPlayingThis) {
                            stopTtsAudio();
                            setIsPlayingAudioId(null);
                            setIsSpeakingLive(false);
                          } else {
                            speakFeedback(msg.content, msg.id);
                          }
                        }}
                        className={`p-1 transition-colors ${
                          isPlayingThis ? "text-amber-400 animate-pulse" : "text-slate-400 hover:text-amber-300"
                        }`}
                        title={isPlayingThis ? "Parar leitura" : "Ouvir resposta por voz"}
                      >
                        {isPlayingThis ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {!isAssistant && (
                <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-300 font-bold shrink-0 mt-1">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {isKiaThinking && (
          <div className="flex items-start space-x-3 justify-start animate-pulse">
            <AgentAvatar agentId="agent-kia" size="sm" />
            <div className="p-4 rounded-2xl bg-[#0b0f19] border border-amber-500/30 text-xs text-amber-300 flex items-center space-x-2.5">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-400" />
              <span>A KIA está a interpretar instrução, consultar base de conhecimento e executar...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Voice Command Chips */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
        <div className="flex items-center space-x-1 text-[10px] text-slate-400 font-semibold uppercase tracking-wider shrink-0">
          <Mic className="w-3 h-3 text-amber-400" />
          <span>Comandos Rápidos:</span>
        </div>
        {quickVoicePrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleVoiceCommandExecution(p.cmd)}
            className="px-2.5 py-1 rounded-xl bg-[#0b0f19] border border-slate-800 hover:border-amber-500/40 text-slate-300 hover:text-amber-300 text-[11px] font-medium whitespace-nowrap transition-all shadow-sm flex items-center space-x-1"
          >
            <span>{p.label}</span>
          </button>
        ))}
      </div>

      {/* Attachments Preview before send */}
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2 px-3 py-2 bg-slate-900/90 border border-slate-800 rounded-xl mb-2">
          {attachments.map((att, i) => (
            <div
              key={att.id}
              className="flex items-center space-x-2 text-xs bg-slate-800 px-2.5 py-1 rounded-lg text-slate-200"
            >
              <FileText className="w-3.5 h-3.5 text-amber-400" />
              <span className="truncate max-w-[140px] font-mono">{att.name}</span>
              <button
                onClick={() => setAttachments((prev) => prev.filter((_, idx) => idx !== i))}
                className="text-slate-400 hover:text-red-400 font-bold ml-1"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Chat & Voice Input Form */}
      <form
        onSubmit={handleSubmit}
        className="relative flex items-center bg-slate-900/90 border border-slate-800 focus-within:border-amber-500/50 rounded-2xl p-2 shadow-2xl transition-colors"
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          className="hidden"
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="p-2 text-slate-400 hover:text-amber-400 rounded-xl hover:bg-slate-800 transition-colors"
          title="Anexar documento ou texto para análise"
        >
          <Paperclip className="w-4 h-4" />
        </button>

        {/* Real-time Voice Recording Button (Microphone API) */}
        <button
          type="button"
          onClick={isRecordingAudio ? stopVoiceRecordingAndSend : startVoiceRecording}
          className={`p-2.5 rounded-xl transition-all flex items-center justify-center ${
            isRecordingAudio
              ? "bg-red-500 text-white shadow-lg shadow-red-500/40 animate-pulse scale-105"
              : "text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30"
          }`}
          title={
            isRecordingAudio
              ? "Gravação ativa... Clica para enviar o áudio"
              : "Gravar comando por voz em tempo real (Microphone API)"
          }
        >
          {isRecordingAudio ? <Square className="w-4 h-4 fill-current text-white" /> : <Mic className="w-4 h-4 text-amber-400" />}
        </button>

        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={
            isRecordingAudio
              ? "A escutar e transcrever a tua voz em tempo real..."
              : "Dá uma instrução operacional ou comando por voz (ex: 'Vai para o scanner', 'Cria uma tarefa para...', 'Pesquisa branding')..."
          }
          className="flex-1 bg-transparent border-none px-3 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none"
        />

        <button
          type="submit"
          disabled={(!inputText.trim() && attachments.length === 0) || isKiaThinking}
          className="px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 disabled:opacity-40 disabled:cursor-not-allowed text-black font-bold text-xs rounded-xl flex items-center space-x-1.5 shadow-md transition-all active:scale-95"
        >
          <span>Enviar</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>

      {/* Dynamic Smart Suggestions Chip List */}
      <div className="pt-2 flex items-center space-x-1.5 overflow-x-auto pb-1 text-xs scrollbar-thin">
        <div className="flex items-center space-x-1 text-[11px] text-amber-400 font-bold whitespace-nowrap pl-1 pr-1.5 opacity-90">
          <Sparkles className="w-3 h-3 text-amber-400 fill-amber-400/30 animate-pulse" />
          <span>Sugestões:</span>
        </div>
        {getSmartSuggestions().map((sug, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSuggestionClick(sug.prompt)}
            disabled={isKiaThinking}
            className="flex-shrink-0 flex items-center space-x-1 px-3 py-1.5 rounded-full bg-slate-900/90 hover:bg-amber-500/20 text-slate-300 hover:text-amber-200 border border-slate-800 hover:border-amber-500/40 text-[11px] font-medium transition-all shadow-sm active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            title={`Ação rápida: "${sug.prompt}"`}
          >
            <span>{sug.label}</span>
          </button>
        ))}
      </div>

      {/* Capabilities Checklist Modal */}
      <KiaCapabilitiesModal
        isOpen={showCapabilitiesModal}
        onClose={() => setShowCapabilitiesModal(false)}
      />
    </div>
  );
};
