import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Bot,
  Video,
  Mic,
  MicOff,
  Send,
  X,
  Play,
  Copy,
  Check,
  Search,
  RefreshCw,
  AlertCircle,
  Film,
  Download
} from 'lucide-react';
import { Song } from '../types/music';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface AiStudioHubProps {
  isOpen: boolean;
  onClose: () => void;
  songs: Song[];
  onPlaySong: (song: Song) => void;
  onSearchQuery: (query: string) => void;
  initialTab?: 'chat' | 'video' | 'transcribe';
}

export const AiStudioHub: React.FC<AiStudioHubProps> = ({
  isOpen,
  onClose,
  songs,
  onPlaySong,
  onSearchQuery,
  initialTab = 'chat',
}) => {
  const [activeTab, setActiveTab] = useState<'chat' | 'video' | 'transcribe'>(initialTab);

  // ----------------------------------------------------
  // 1. GEMINI CHATBOT STATE
  // ----------------------------------------------------
  const [chatModel, setChatModel] = useState<'gemini-3.5-flash' | 'gemini-3.1-flash-lite' | 'gemini-3.1-pro-preview'>('gemini-3.5-flash');
  const [chatMessages, setChatMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Halo! Saya **Cosmo**, Galaxy Music AI assistant untuk HMAN. Saya bisa merekomendasikan lagu pop Indonesia atau hits internasional, membedah makna lirik lagu, hingga membahas teori musik. Apa yang ingin kamu dengarkan atau bahas hari ini?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);
  const chatBottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (activeTab === 'chat') {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, activeTab]);

  const handleSendChat = async (overrideText?: string) => {
    const textToSend = overrideText || chatInput;
    if (!textToSend.trim() || isChatLoading) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput('');
    setIsChatLoading(true);
    setChatError(null);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...chatMessages, userMsg].map((m) => ({
            role: m.role,
            content: m.content,
          })),
          model: chatModel,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to get AI response');
      }

      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: data.reply || 'No response returned.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setChatMessages((prev) => [...prev, botMsg]);
    } catch (err: unknown) {
      const error = err as Error;
      setChatError(error.message);
    } finally {
      setIsChatLoading(false);
    }
  };

  // ----------------------------------------------------
  // 2. VEO 3 VIDEO GENERATION STATE
  // ----------------------------------------------------
  const [videoPrompt, setVideoPrompt] = useState('');
  const [videoAspectRatio, setVideoAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [isVideoLoading, setIsVideoLoading] = useState(false);
  const [videoStatusMsg, setVideoStatusMsg] = useState('');
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoError, setVideoError] = useState<string | null>(null);

  const handleGenerateVideo = async () => {
    if (!videoPrompt.trim() || isVideoLoading) return;

    setIsVideoLoading(true);
    setVideoError(null);
    setVideoUrl(null);
    setVideoStatusMsg('Submitting prompt to Veo 3 (veo-3.1-fast-generate-preview)...');

    try {
      // Step 1: Start video operation
      const startRes = await fetch('/api/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: videoPrompt.trim(),
          aspectRatio: videoAspectRatio,
        }),
      });

      const startData = await startRes.json();
      if (!startRes.ok) {
        throw new Error(startData.error || 'Failed to start video generation');
      }

      const operationName = startData.operationName;
      setVideoStatusMsg('Dreaming cosmic frames and lighting...');

      // Step 2: Poll operation
      let isDone = false;
      let attempts = 0;
      const maxAttempts = 60; // Up to 5 minutes with 5s interval

      while (!isDone && attempts < maxAttempts) {
        attempts++;
        await new Promise((r) => setTimeout(r, 5000));

        if (attempts === 2) setVideoStatusMsg('Synthesizing temporal visual coherence...');
        if (attempts === 5) setVideoStatusMsg('Rendering high-fidelity motion and color gradients...');
        if (attempts === 8) setVideoStatusMsg('Finalizing stellar video stream...');

        const statusRes = await fetch('/api/video-status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ operationName }),
        });

        const statusData = await statusRes.json();
        if (!statusRes.ok) {
          throw new Error(statusData.error || 'Status check failed');
        }

        if (statusData.error) {
          throw new Error(statusData.error);
        }

        if (statusData.done) {
          isDone = true;
          break;
        }
      }

      if (!isDone) {
        throw new Error('Video generation timed out. Please try again with a shorter prompt.');
      }

      // Step 3: Download video blob
      setVideoStatusMsg('Downloading completed video stream...');
      const downloadRes = await fetch('/api/video-download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ operationName }),
      });

      if (!downloadRes.ok) {
        const errorData = await downloadRes.json();
        throw new Error(errorData.error || 'Failed to retrieve video stream');
      }

      const videoBlob = await downloadRes.blob();
      const localUrl = URL.createObjectURL(videoBlob);
      setVideoUrl(localUrl);
      setVideoStatusMsg('');
    } catch (err: unknown) {
      const error = err as Error;
      setVideoError(error.message);
      setVideoStatusMsg('');
    } finally {
      setIsVideoLoading(false);
    }
  };

  // ----------------------------------------------------
  // 3. AUDIO TRANSCRIBE STATE (gemini-3.5-transcribe)
  // ----------------------------------------------------
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcribedText, setTranscribedText] = useState<string | null>(null);
  const [transcribeError, setTranscribeError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startRecording = async () => {
    setTranscribeError(null);
    setTranscribedText(null);
    audioChunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        // Stop all mic tracks
        stream.getTracks().forEach((track) => track.stop());

        // Convert to base64
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
          const base64Data = (reader.result as string).split(',')[1];
          await sendAudioForTranscription(base64Data, audioBlob.type);
        };
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingSeconds(0);

      timerRef.current = window.setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } catch {
      setTranscribeError('Microphone permission denied or device not supported.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const sendAudioForTranscription = async (audioBase64: string, mimeType: string) => {
    setIsTranscribing(true);
    setTranscribeError(null);

    try {
      const res = await fetch('/api/transcribe-audio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          audioBase64,
          mimeType,
          prompt: 'Transcribe this voice audio accurately in Indonesian or English. Output only the plain transcribed text.',
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to transcribe audio');
      }

      setTranscribedText(data.transcription || 'No audible speech detected.');
    } catch (err: unknown) {
      const error = err as Error;
      setTranscribeError(error.message);
    } finally {
      setIsTranscribing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl h-[90vh] bg-[#0b0b1f] border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-white/10 bg-white/5 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-pink-500 flex items-center justify-center shadow-[0_0_15px_rgba(139,92,246,0.5)]">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                Cosmo AI Studio
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 uppercase">
                  Gemini & Veo 3
                </span>
              </h2>
              <p className="text-xs text-slate-400">Intelligent music assistant, video visualizer, & voice transcribe</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Feature Tabs (Zero-pill segmented buttons) */}
        <div className="flex items-center gap-1.5 p-2 bg-black/40 border-b border-white/10 shrink-0 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition ${
              activeTab === 'chat'
                ? 'bg-purple-600 text-white shadow-sm shadow-purple-600/30'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Bot className="w-4 h-4" />
            <span>Chatbot (Cosmo AI)</span>
          </button>

          <button
            onClick={() => setActiveTab('video')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition ${
              activeTab === 'video'
                ? 'bg-purple-600 text-white shadow-sm shadow-purple-600/30'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Video className="w-4 h-4" />
            <span>Veo 3 Video Generator</span>
          </button>

          <button
            onClick={() => setActiveTab('transcribe')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition ${
              activeTab === 'transcribe'
                ? 'bg-purple-600 text-white shadow-sm shadow-purple-600/30'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Mic className="w-4 h-4" />
            <span>Voice Transcribe</span>
          </button>
        </div>

        {/* Tab 1: GEMINI CHATBOT */}
        {activeTab === 'chat' && (
          <div className="flex-1 flex flex-col h-full overflow-hidden">
            {/* Model Selector Bar */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-2.5 bg-white/5 border-b border-white/5 text-xs text-slate-300 shrink-0">
              <span className="text-slate-400 font-medium">Model Engine:</span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setChatModel('gemini-3.5-flash')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition ${
                    chatModel === 'gemini-3.5-flash'
                      ? 'bg-purple-600 text-white'
                      : 'text-slate-400 hover:text-white bg-white/5'
                  }`}
                  title="General tasks - balanced intelligence & speed"
                >
                  gemini-3.5-flash (General)
                </button>
                <button
                  onClick={() => setChatModel('gemini-3.1-flash-lite')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition ${
                    chatModel === 'gemini-3.1-flash-lite'
                      ? 'bg-purple-600 text-white'
                      : 'text-slate-400 hover:text-white bg-white/5'
                  }`}
                  title="Fast tasks - ultra low latency"
                >
                  gemini-3.1-flash-lite (Fast)
                </button>
                <button
                  onClick={() => setChatModel('gemini-3.1-pro-preview')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition ${
                    chatModel === 'gemini-3.1-pro-preview'
                      ? 'bg-purple-600 text-white'
                      : 'text-slate-400 hover:text-white bg-white/5'
                  }`}
                  title="Complex tasks - deep music reasoning & analysis"
                >
                  gemini-3.1-pro-preview (Complex)
                </button>
              </div>
            </div>

            {/* Conversation Thread */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 no-scrollbar">
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-center gap-2 mb-1 px-1 text-[11px] text-slate-400">
                    <span>{msg.role === 'user' ? 'You' : 'Cosmo AI'}</span>
                    <span>·</span>
                    <span className="font-mono">{msg.timestamp}</span>
                  </div>

                  <div
                    className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-sm leading-relaxed whitespace-pre-wrap ${
                      msg.role === 'user'
                        ? 'bg-purple-600 text-white shadow-md'
                        : 'bg-white/10 text-slate-100 border border-white/10'
                    }`}
                  >
                    {msg.content}

                    {/* If bot mentions songs in catalog, show quick play pill */}
                    {msg.role === 'assistant' && (
                      <div className="mt-3 pt-2.5 border-t border-white/10 flex flex-wrap gap-2">
                        {songs.slice(0, 10).map((s) => {
                          if (msg.content.toLowerCase().includes(s.title.toLowerCase())) {
                            return (
                              <button
                                key={s.id}
                                onClick={() => onPlaySong(s)}
                                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs text-purple-200 transition"
                              >
                                <Play className="w-3 h-3 fill-current" />
                                <span>Play &ldquo;{s.title}&rdquo;</span>
                              </button>
                            );
                          }
                          return null;
                        })}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isChatLoading && (
                <div className="flex items-center gap-2 text-xs text-purple-400 p-2">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Cosmo is thinking with {chatModel}...</span>
                </div>
              )}

              {chatError && (
                <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{chatError}</span>
                </div>
              )}

              <div ref={chatBottomRef} />
            </div>

            {/* Quick Suggestions Chips */}
            <div className="px-4 sm:px-6 py-2 border-t border-white/5 flex gap-2 overflow-x-auto no-scrollbar">
              <button
                onClick={() => handleSendChat('Rekomendasikan lagu pop Indonesia galau paling emosional')}
                className="whitespace-nowrap px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 text-xs text-slate-300 transition"
              >
                💔 Rekomendasi Pop Indo Galau
              </button>
              <button
                onClick={() => handleSendChat('Jelaskan makna lirik lagu Bernadya - Satu Bulan')}
                className="whitespace-nowrap px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 text-xs text-slate-300 transition"
              >
                📖 Bedah Lirik Satu Bulan
              </button>
              <button
                onClick={() => handleSendChat('Apa yang membuat lagu Bohemian Rhapsody karya Queen begitu revolusioner?')}
                className="whitespace-nowrap px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 text-xs text-slate-300 transition"
              >
                🎸 Analisis Bohemian Rhapsody
              </button>
            </div>

            {/* Input Bar */}
            <div className="p-4 sm:p-6 bg-black/40 border-t border-white/10 flex items-center gap-2.5">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendChat()}
                placeholder="Tanyakan rekomendasi musik, lirik, atau fakta musisi..."
                className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-purple-500 focus:bg-white/10 transition"
              />

              <button
                onClick={() => handleSendChat()}
                disabled={!chatInput.trim() || isChatLoading}
                className="w-11 h-11 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-40 disabled:pointer-events-none text-white flex items-center justify-center transition active:scale-95 shadow-md shadow-purple-600/30"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: VEO 3 VIDEO GENERATOR */}
        {activeTab === 'video' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6 no-scrollbar">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-400 mb-1">
                <Film className="w-4 h-4" />
                <span>Veo 3 AI Music Video Visualizer</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-display">
                Generate Visual Atmosphere with Veo 3
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Using model <span className="text-purple-300 font-mono">veo-3.1-fast-generate-preview</span>. Craft mesmerizing ambient video clips to accompany your music listening.
              </p>
            </div>

            {/* Aspect Ratio Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Aspect Ratio *
              </label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setVideoAspectRatio('16:9')}
                  className={`flex-1 p-3 rounded-2xl border text-center transition ${
                    videoAspectRatio === '16:9'
                      ? 'bg-purple-600/20 border-purple-500 text-white shadow-sm'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <span className="block text-sm font-bold">16:9 (Landscape)</span>
                  <span className="block text-[11px] text-slate-400 mt-0.5">Desktop & Cinematic Display</span>
                </button>

                <button
                  type="button"
                  onClick={() => setVideoAspectRatio('9:16')}
                  className={`flex-1 p-3 rounded-2xl border text-center transition ${
                    videoAspectRatio === '9:16'
                      ? 'bg-purple-600/20 border-purple-500 text-white shadow-sm'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <span className="block text-sm font-bold">9:16 (Portrait)</span>
                  <span className="block text-[11px] text-slate-400 mt-0.5">Mobile Stories & Vertical Reels</span>
                </button>
              </div>
            </div>

            {/* Prompt Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Visual Description Prompt *
              </label>
              <textarea
                rows={3}
                value={videoPrompt}
                onChange={(e) => setVideoPrompt(e.target.value)}
                placeholder="e.g. Floating neon synthwave vehicle gliding through deep violet cosmic nebula with pulsating audio-reactive stellar stardust particles, smooth camera pan, 4k cinematic lighting"
                className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-purple-500 focus:bg-white/10 transition resize-none"
              />

              {/* Sample Presets */}
              <div className="mt-2 flex flex-wrap gap-2">
                <span className="text-[11px] text-slate-500 self-center">Try prompt:</span>
                <button
                  type="button"
                  onClick={() => setVideoPrompt('Dreamy twilight Jakarta city street in gentle rain with moody warm lantern light reflections and bokeh lights')}
                  className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] text-slate-400 hover:text-white transition"
                >
                  🌧️ Senja Rainy Jakarta
                </button>
                <button
                  type="button"
                  onClick={() => setVideoPrompt('Surreal cosmic nebula with floating vintage vinyl record player emitting glowing purple soundwaves in outer space')}
                  className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] text-slate-400 hover:text-white transition"
                >
                  🪐 Cosmic Vinyl Nebula
                </button>
                <button
                  type="button"
                  onClick={() => setVideoPrompt('Epic stadium rock concert stage under shooting stars with electric purple lightning riffs and smoking smoke machines')}
                  className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] text-slate-400 hover:text-white transition"
                >
                  ⚡ Stardust Rock Stage
                </button>
              </div>
            </div>

            {/* Generate Action */}
            <div className="flex items-center justify-between pt-2">
              <div className="text-xs text-slate-400">
                <span>Model: </span>
                <span className="font-mono text-purple-300">veo-3.1-fast-generate-preview</span>
              </div>

              <button
                type="button"
                onClick={handleGenerateVideo}
                disabled={!videoPrompt.trim() || isVideoLoading}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:opacity-90 active:scale-95 disabled:opacity-40 disabled:pointer-events-none text-white text-xs font-bold transition shadow-lg shadow-purple-600/30"
              >
                {isVideoLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Generating Video...</span>
                  </>
                ) : (
                  <>
                    <Video className="w-4 h-4" />
                    <span>Generate Video with Veo 3</span>
                  </>
                )}
              </button>
            </div>

            {/* Status / Loading Notification */}
            {isVideoLoading && (
              <div className="p-5 rounded-2xl bg-purple-600/10 border border-purple-500/20 flex flex-col items-center text-center space-y-3 animate-pulse">
                <RefreshCw className="w-8 h-8 text-purple-400 animate-spin" />
                <div>
                  <p className="text-sm font-bold text-white">{videoStatusMsg}</p>
                  <p className="text-xs text-slate-400 mt-1">
                    Veo 3 video generation takes ~1-2 minutes. Feel free to continue playing music in the background!
                  </p>
                </div>
              </div>
            )}

            {/* Error Message */}
            {videoError && (
              <div className="p-4 rounded-2xl bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{videoError}</span>
              </div>
            )}

            {/* Completed Video Player */}
            {videoUrl && (
              <div className="p-4 rounded-3xl bg-black/60 border border-purple-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
                    <Check className="w-4 h-4" />
                    <span>Video Generated Successfully</span>
                  </div>

                  <a
                    href={videoUrl}
                    download="veo3_music_visualizer.mp4"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs text-white transition"
                  >
                    <Download className="w-3.5 h-3.5" /> Download MP4
                  </a>
                </div>

                <div className={`rounded-2xl overflow-hidden bg-black flex items-center justify-center ${videoAspectRatio === '9:16' ? 'max-w-xs mx-auto aspect-[9/16]' : 'aspect-video'}`}>
                  <video
                    src={videoUrl}
                    controls
                    autoPlay
                    loop
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: VOICE TRANSCRIBE */}
        {activeTab === 'transcribe' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6 no-scrollbar">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-400 mb-1">
                <Mic className="w-4 h-4" />
                <span>Microphone Audio Transcription</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-display">
                Transcribe Audio with Gemini
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Powered by model <span className="text-purple-300 font-mono">gemini-3.5-transcribe</span>. Speak, sing lyrics, or ask questions to instantly convert speech into text.
              </p>
            </div>

            {/* Mic Centerpiece */}
            <div className="p-8 rounded-3xl bg-gradient-to-b from-white/5 to-white/[0.02] border border-white/10 flex flex-col items-center justify-center text-center space-y-4">
              <button
                type="button"
                onClick={isRecording ? stopRecording : startRecording}
                disabled={isTranscribing}
                className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl active:scale-95 ${
                  isRecording
                    ? 'bg-rose-500 text-white animate-pulse shadow-[0_0_40px_rgba(244,63,94,0.6)] scale-110'
                    : 'bg-purple-600 hover:bg-purple-500 text-white shadow-[0_0_30px_rgba(139,92,246,0.4)]'
                }`}
                title={isRecording ? 'Click to stop recording' : 'Click to start recording'}
              >
                {isRecording ? (
                  <MicOff className="w-10 h-10" />
                ) : (
                  <Mic className="w-10 h-10" />
                )}
              </button>

              <div>
                <p className="text-base font-bold text-white">
                  {isRecording
                    ? `Recording... ${recordingSeconds}s`
                    : isTranscribing
                    ? 'Transcribing audio with gemini-3.5-transcribe...'
                    : 'Tap microphone to speak'}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {isRecording
                    ? 'Tap again when finished speaking'
                    : 'Supports Indonesian, English, song lyrics, and commands'}
                </p>
              </div>
            </div>

            {/* Error Alert */}
            {transcribeError && (
              <div className="p-4 rounded-2xl bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{transcribeError}</span>
              </div>
            )}

            {/* Transcribed Result Card */}
            {transcribedText && (
              <div className="p-6 rounded-3xl bg-purple-600/10 border border-purple-500/30 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-purple-300">
                    Transcription Output
                  </span>

                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(transcribedText);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs text-slate-200 transition"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy Text'}</span>
                  </button>
                </div>

                <p className="text-base sm:text-lg font-medium text-white italic leading-relaxed">
                  &ldquo;{transcribedText}&rdquo;
                </p>

                {/* Actionable buttons */}
                <div className="pt-2 flex flex-wrap gap-2.5">
                  <button
                    onClick={() => {
                      onSearchQuery(transcribedText);
                      onClose();
                    }}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold transition active:scale-95"
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span>Search Catalog for This</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('chat');
                      handleSendChat(transcribedText);
                    }}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition active:scale-95"
                  >
                    <Bot className="w-3.5 h-3.5" />
                    <span>Ask Cosmo AI Chat</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
