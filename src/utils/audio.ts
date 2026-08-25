// Audio helper utility for GAG Core UI feedback & Gemini TTS Playback

let audioCtx: AudioContext | null = null;
let currentTtsSource: AudioBufferSourceNode | null = null;
let isCurrentlySpeaking = false;

export function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playSfx(
  type: "success" | "action" | "click" | "notification" | "warning" | "execute",
  volume = 0.3
) {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    if (type === "click") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.04);
      gain.gain.setValueAtTime(volume * 0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.04);
    } else if (type === "success" || type === "execute") {
      // Elegant gold chime chord
      const freqs = [587.33, 739.99, 880.0, 1174.66]; // D5, F#5, A5, D6
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + idx * 0.05);
        gain.gain.setValueAtTime(0.001, now + idx * 0.05);
        gain.gain.linearRampToValueAtTime(volume * 0.2, now + idx * 0.05 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.05 + 0.5);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.05);
        osc.stop(now + idx * 0.05 + 0.5);
      });
    } else if (type === "notification" || type === "action") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(523.25, now);
      osc.frequency.setValueAtTime(659.25, now + 0.08);
      gain.gain.setValueAtTime(volume * 0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.25);
    } else if (type === "warning") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.setValueAtTime(260, now + 0.1);
      gain.gain.setValueAtTime(volume * 0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.3);
    }
  } catch (e) {
    console.debug("Audio play skipped:", e);
  }
}

export function stopTtsAudio() {
  isCurrentlySpeaking = false;
  if (currentTtsSource) {
    try {
      currentTtsSource.stop();
      currentTtsSource.disconnect();
    } catch {}
    currentTtsSource = null;
  }
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    try {
      window.speechSynthesis.cancel();
    } catch {}
  }
}

export function getIsSpeaking(): boolean {
  return isCurrentlySpeaking;
}

// Convert base64 PCM 24kHz audio from Gemini TTS into playable AudioBuffer
export async function playPcmAudio(base64Data: string, sampleRate = 24000): Promise<void> {
  stopTtsAudio();
  const ctx = getAudioContext();

  const binaryString = atob(base64Data);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  // 16-bit signed PCM
  const int16Array = new Int16Array(bytes.buffer);
  const float32Array = new Float32Array(int16Array.length);
  for (let i = 0; i < int16Array.length; i++) {
    float32Array[i] = int16Array[i] / 32768;
  }

  const audioBuffer = ctx.createBuffer(1, float32Array.length, sampleRate);
  audioBuffer.copyToChannel(float32Array, 0);

  const source = ctx.createBufferSource();
  source.buffer = audioBuffer;
  source.connect(ctx.destination);
  currentTtsSource = source;
  isCurrentlySpeaking = true;

  return new Promise((resolve) => {
    source.onended = () => {
      if (currentTtsSource === source) {
        currentTtsSource = null;
        isCurrentlySpeaking = false;
      }
      resolve();
    };
    source.start(0);
  });
}

// Clean markdown text for fluid spoken audio output
export function sanitizeForVoice(text: string): string {
  return text
    .replace(/```[\s\S]*?```/g, "bloco de código omitido.")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1")
    .replace(/[*#_~>]/g, "")
    .replace(/\n+/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim();
}

// Natural voice output with dual-engine fallback (Gemini 3.1 TTS + Web Speech API)
export async function speakNaturalText(
  text: string,
  options: {
    voiceName?: string;
    onStart?: () => void;
    onEnd?: () => void;
    onError?: (err: any) => void;
  } = {}
): Promise<void> {
  const { voiceName = "Kore", onStart, onEnd, onError } = options;
  const clean = sanitizeForVoice(text);
  if (!clean) {
    onEnd?.();
    return;
  }

  stopTtsAudio();
  isCurrentlySpeaking = true;
  onStart?.();

  // Extract a readable portion (up to 400 chars) for responsive conversational feel
  const voiceSnippet = clean.length > 500 ? clean.slice(0, 480) + "..." : clean;

  try {
    // 1. Try Gemini Neural TTS endpoint
    const res = await fetch("/api/tts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: voiceSnippet,
        voiceName,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.audioBase64) {
        await playPcmAudio(data.audioBase64, data.sampleRate || 24000);
        isCurrentlySpeaking = false;
        onEnd?.();
        return;
      }
    }
  } catch (err) {
    console.warn("Primary TTS unavailable, switching to browser synthesis:", err);
  }

  // 2. Fallback to Browser SpeechSynthesis (offline, instantaneous)
  try {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(voiceSnippet);
      utterance.lang = "pt-PT";
      utterance.rate = 1.05;
      utterance.pitch = 1.0;

      // Select Portuguese voice if available
      const voices = window.speechSynthesis.getVoices();
      const ptVoice = voices.find(
        (v) => v.lang.startsWith("pt") || v.name.toLowerCase().includes("portuguese") || v.name.toLowerCase().includes("maria") || v.name.toLowerCase().includes("joana")
      );
      if (ptVoice) {
        utterance.voice = ptVoice;
      }

      utterance.onend = () => {
        isCurrentlySpeaking = false;
        onEnd?.();
      };
      utterance.onerror = (e) => {
        isCurrentlySpeaking = false;
        onError?.(e);
        onEnd?.();
      };

      window.speechSynthesis.speak(utterance);
      return;
    }
  } catch (err) {
    console.error("SpeechSynthesis error:", err);
    onError?.(err);
  }

  isCurrentlySpeaking = false;
  onEnd?.();
}

