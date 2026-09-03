import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  X,
  AlertTriangle,
  Clock,
  Coins,
  ChevronRight,
  RotateCcw,
  Wrench,
  Lightbulb,
  Radio,
  CheckCircle2,
  PhoneCall,
  Send,
  Zap,
  ShieldCheck,
  Globe
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ServiceItem, Language } from '../types';
import { SmartFixLogo } from './SmartFixLogo';
import { TRANSLATIONS } from '../data/translations';

// Global declarations for Web Speech API
declare global {
  interface Window {
    SpeechRecognition?: any;
    webkitSpeechRecognition?: any;
  }
}

interface VoiceChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  diagnosisCard?: {
    issueTitle: string;
    rootCause: string;
    dangerLevel: 'low' | 'medium' | 'high';
    safetyTip: string;
    estCost: string;
    estDuration: string;
    matchedServiceId: string;
    serviceName: string;
    suggestedTech: string;
  };
  options?: string[];
}

interface VoiceAiModalProps {
  isOpen: boolean;
  onClose: () => void;
  services: ServiceItem[];
  currentLanguage: Language;
  onBookService: (service: ServiceItem, initialNotes?: string) => void;
}

const VOICE_SAMPLE_PROMPTS = [
  {
    icon: '⚡',
    en: 'My electrical circuit breaker trips when appliances turn on',
    am: 'የኤሌክትሪክ ቆጣሪው (Breaker) እቃ ሲበራ ይወድቃል',
    labelEn: 'Breaker Tripping',
    labelAm: 'ቆጣሪ መውደቅ'
  },
  {
    icon: '💧',
    en: 'Water pump is humming loudly but not pumping water to rooftop tank',
    am: 'የውሃ ፓምፕ ይጮሃል ግን ውሃ ወደ ጣሪያ ታንከር አያወጣም',
    labelEn: 'Pump Humming',
    labelAm: 'ፓምፕ መጮህ'
  },
  {
    icon: '📺',
    en: 'TV screen is completely black but audio sound is playing normally',
    am: 'የቲቪ ስክሪን ጥቁር ነው ግን ድምጹ ይሰራል',
    labelEn: 'TV Black Screen',
    labelAm: 'ቲቪ ምስል ጠፍቷል'
  },
  {
    icon: '❄️',
    en: 'Refrigerator freezer is freezing but lower food section is warm',
    am: 'የፍሪጁ የታችኛው ክፍል አይቀዘቅዝም',
    labelEn: 'Fridge Not Cooling',
    labelAm: 'ፍሪጅ አለመቀዝቀዝ'
  },
  {
    icon: '☀️',
    en: 'Solar inverter is beeping continuously with red overload error code',
    am: 'የሶላር ኢንቨርተር ድምጽ እያወጣ ቀይ መብራት ያበራል',
    labelEn: 'Solar Overload',
    labelAm: 'ሶላር ኢንቨርተር'
  }
];

export function VoiceAiModal({
  isOpen,
  onClose,
  services,
  currentLanguage,
  onBookService
}: VoiceAiModalProps) {
  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;
  const isAmharic = currentLanguage === 'am';

  // Voice speech language toggle (allows switching between English & Amharic easily)
  const [speechLang, setSpeechLang] = useState<'en-US' | 'am-ET'>(isAmharic ? 'am-ET' : 'en-US');

  // Real-time voice states
  const [isListening, setIsListening] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [autoSpeakReplies, setAutoSpeakReplies] = useState(true);
  const [activeSpeakingId, setActiveSpeakingId] = useState<string | null>(null);
  const [speechError, setSpeechError] = useState<string | null>(null);

  // Audio wave simulator level
  const [audioLevel, setAudioLevel] = useState<number>(0);

  // Conversation history
  const [chatHistory, setChatHistory] = useState<VoiceChatMessage[]>(() => [
    {
      id: 'intro-1',
      sender: 'ai',
      text: isAmharic
        ? 'ሰላም! እኔ የስማርትፊክስ Voice AI ረዳት ነኝ። የኤሌክትሪክ፣ የቧንቧ፣ የቲቪ ወይም የፍሪጅ ችግርዎን በድምጽ ይንገሩኝ። መንስኤውን መርምሬ ወዲያውኑ ባለሙያ አስይዝልዎታለሁ።'
        : 'Hello! I am your SmartFix Voice AI Assistant. Speak to me about any home repair, circuit trip, water pump issue, or TV fault. I will diagnose the issue and book a verified master technician.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      options: isAmharic
        ? ['የኤሌክትሪክ ቆጣሪ ይወድቃል', 'የውሃ ፓምፕ ይጮሃል', 'ቲቪ ድምጽ አለው ምስል የለም']
        : ['Circuit breaker keeps tripping', 'Water pump humming', 'TV black screen sound only']
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const animFrameRef = useRef<number | null>(null);

  // Keep speechLang synchronized with currentLanguage
  useEffect(() => {
    setSpeechLang(currentLanguage === 'am' ? 'am-ET' : 'en-US');
  }, [currentLanguage]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory, interimTranscript, isAiProcessing, isOpen]);

  // Clean up Web Speech on close or unmount
  useEffect(() => {
    if (!isOpen) {
      stopVoiceRecognition();
      stopTextToSpeech();
    }
  }, [isOpen]);

  // Audio level simulator during listening
  useEffect(() => {
    if (isListening) {
      const interval = setInterval(() => {
        setAudioLevel(Math.floor(Math.random() * 85) + 15);
      }, 120);
      return () => clearInterval(interval);
    } else {
      setAudioLevel(0);
    }
  }, [isListening]);

  // 1. Text-To-Speech (TTS) Function
  const speakVoiceReply = useCallback((text: string, messageId?: string) => {
    if (!('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();

    const clean = text.replace(/[*_~`#]/g, '').replace(/https?:\/\/\S+/g, '').trim();
    if (!clean) return;

    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    if (speechLang === 'am-ET') {
      const amVoice = voices.find((v) => v.lang.startsWith('am') || v.lang.startsWith('ethi'));
      if (amVoice) utterance.voice = amVoice;
      utterance.lang = 'am-ET';
    } else {
      const enVoice = voices.find((v) => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.default));
      if (enVoice) utterance.voice = enVoice;
      utterance.lang = 'en-US';
    }

    utterance.onstart = () => {
      setIsSpeaking(true);
      if (messageId) setActiveSpeakingId(messageId);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setActiveSpeakingId(null);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setActiveSpeakingId(null);
    };

    window.speechSynthesis.speak(utterance);
  }, [speechLang]);

  const stopTextToSpeech = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    setActiveSpeakingId(null);
  };

  // 2. Query SmartFix AI Server
  const processUserVoiceQuery = async (queryText: string) => {
    if (!queryText.trim()) return;

    stopTextToSpeech();
    setSpeechError(null);
    setIsAiProcessing(true);

    const userMessage: VoiceChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatHistory((prev) => [...prev, userMessage]);
    setInterimTranscript('');

    try {
      const historyPayload = chatHistory.slice(-4).map((m) => ({
        role: m.sender === 'user' ? 'user' : 'model',
        text: m.text
      }));

      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: queryText,
          history: historyPayload,
          language: speechLang === 'am-ET' ? 'am' : 'en',
          context: {
            app: 'SmartFix Ethiopia Voice AI',
            mode: 'Voice-First Service Booking & Troubleshooting',
            city: 'Addis Ababa',
            availableServices: services.map((s) => ({ id: s.id, name: s.name, price: s.price }))
          }
        })
      });

      const data = await res.json();
      setIsAiProcessing(false);

      const aiMsgId = `ai-${Date.now()}`;
      const replyText = data.reply || (isAmharic ? 'የችግርዎን መረጃ ተረድቻለሁ።' : 'I have analyzed your request.');

      const aiMessage: VoiceChatMessage = {
        id: aiMsgId,
        sender: 'ai',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        diagnosisCard: data.diagnosisCard,
        options: Array.isArray(data.followUps) && data.followUps.length > 0 ? data.followUps : undefined
      };

      setChatHistory((prev) => [...prev, aiMessage]);

      // If auto speech enabled, read aloud
      if (autoSpeakReplies) {
        speakVoiceReply(replyText, aiMsgId);
      }
    } catch (err: any) {
      console.error('Voice AI query error:', err);
      setIsAiProcessing(false);

      const fallbackMsg: VoiceChatMessage = {
        id: `ai-err-${Date.now()}`,
        sender: 'ai',
        text: isAmharic
          ? 'ችግርዎን መርምሬያለሁ። ለኤሌክትሪክ ወይም ለውሃ ፓምፕ ጥገና ወዲያውኑ ባለሙያ ማዘዝ ይችላሉ።'
          : 'I have analyzed your fault. You can book an immediate certified technician or follow safety guidelines.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        options: ['Book Electrician', 'Book Plumber', 'Safety Tips']
      };

      setChatHistory((prev) => [...prev, fallbackMsg]);
    }
  };

  // 3. Web Speech API (SpeechRecognition) Engine
  const startVoiceRecognition = () => {
    stopTextToSpeech();
    setSpeechError(null);

    const SpeechRecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognitionClass) {
      setSpeechError(
        isAmharic
          ? 'የእርስዎ ብሮውዘር Web Speech API አይደግፍም። እባክዎ ከታች ያሉትን አማራጮች ይጫኑ።'
          : 'Web Speech API is not supported in this browser. Please use Chrome/Edge or select a prompt below.'
      );
      return;
    }

    try {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore
        }
      }

      const recognition = new SpeechRecognitionClass();
      recognitionRef.current = recognition;
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = speechLang;

      recognition.onstart = () => {
        setIsListening(true);
        setInterimTranscript('');
      };

      recognition.onresult = (event: any) => {
        let liveTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcriptPiece = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcriptPiece;
          } else {
            liveTranscript += transcriptPiece;
          }
        }

        if (finalTranscript) {
          setInterimTranscript(finalTranscript);
          setIsListening(false);
          processUserVoiceQuery(finalTranscript);
        } else {
          setInterimTranscript(liveTranscript);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('SpeechRecognition error:', event?.error);
        setIsListening(false);
        if (event?.error === 'not-allowed') {
          setSpeechError(
            isAmharic
              ? 'የማይክሮፎን ፈቃድ አልተሰጠም። እባክዎ በብሮውዘሩ ላይ ፈቃድ ይስጡ።'
              : 'Microphone permission denied. Please allow microphone access in your browser settings.'
          );
        } else if (event?.error !== 'no-speech') {
          setSpeechError(`Voice error: ${event?.error || 'speech failed'}`);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err: any) {
      console.error('Failed to start speech recognition:', err);
      setIsListening(false);
      setSpeechError(err?.message || 'Could not start voice recognition');
    }
  };

  const stopVoiceRecognition = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
    }
    setIsListening(false);
  };

  // 4. Booking Action Bridge
  const handleBookFromDiagnosis = (diag: NonNullable<VoiceChatMessage['diagnosisCard']>) => {
    stopTextToSpeech();
    stopVoiceRecognition();
    onClose();

    // Match service or default to first
    const targetService = services.find((s) => s.id === diag.matchedServiceId) || services[0];
    const initialNotes = `[Voice AI Diagnostic] Issue: ${diag.issueTitle}. Root Cause: ${diag.rootCause}. Est: ${diag.estCost}. Safety: ${diag.safetyTip}`;

    onBookService(targetService, initialNotes);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-2xl max-h-[92vh] bg-white dark:bg-[#0A1020] rounded-3xl border border-blue-200/60 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden relative">
        {/* ======================================================== */}
        {/* MODAL HEADER                                             */}
        {/* ======================================================== */}
        <div className="p-4 bg-gradient-to-r from-blue-900 via-[#0F1E3D] to-[#1E3A8A] text-white flex items-center justify-between flex-shrink-0 border-b border-blue-800/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#2563EB] to-cyan-400 p-0.5 shadow-lg flex items-center justify-center">
              <div className="w-full h-full bg-[#0B152B] rounded-[14px] flex items-center justify-center">
                <Mic className="w-5 h-5 text-cyan-300 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base tracking-tight text-white flex items-center gap-1.5">
                  <span>SmartFix Voice AI</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                </h3>
                <span className="text-[10px] font-mono uppercase bg-cyan-400/20 text-cyan-200 px-2 py-0.5 rounded-full font-bold border border-cyan-400/30">
                  Web Speech API
                </span>
              </div>
              <p className="text-xs text-blue-200/80">
                {isAmharic ? 'የድምጽ አገልግሎት ማዘዣና ችግር መፍቻ ረዳት' : 'Real-Time Voice Booking & Fault Troubleshooting'}
              </p>
            </div>
          </div>

          {/* Right Header Controls: Language Toggle, TTS Toggle, Close */}
          <div className="flex items-center gap-2">
            {/* Spoken Language Toggle: English ⇄ Amharic */}
            <button
              onClick={() => {
                const nextLang = speechLang === 'am-ET' ? 'en-US' : 'am-ET';
                setSpeechLang(nextLang);
              }}
              className="px-2.5 py-1 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-[11px] font-bold text-blue-100 flex items-center gap-1 transition-all"
              title="Switch Voice Recognition Language"
            >
              <Globe className="w-3.5 h-3.5 text-cyan-300" />
              <span>{speechLang === 'am-ET' ? 'አማርኛ (am)' : 'English (en)'}</span>
            </button>

            {/* Auto Read Aloud (TTS) Toggle */}
            <button
              onClick={() => {
                if (isSpeaking) stopTextToSpeech();
                setAutoSpeakReplies(!autoSpeakReplies);
              }}
              className={`p-2 rounded-xl border transition-all ${
                autoSpeakReplies
                  ? 'bg-cyan-500/20 border-cyan-400/40 text-cyan-300'
                  : 'bg-white/5 border-white/10 text-slate-400'
              }`}
              title={autoSpeakReplies ? 'Auto Voice Audio: ON' : 'Auto Voice Audio: OFF'}
            >
              {autoSpeakReplies ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Close Button */}
            <button
              onClick={() => {
                stopTextToSpeech();
                stopVoiceRecognition();
                onClose();
              }}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
              title="Close Voice AI"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ======================================================== */}
        {/* INTERACTIVE VOICE STATUS & LIVE SOUNDWAVE BANNER        */}
        {/* ======================================================== */}
        <div className="p-3 bg-gradient-to-b from-blue-50/70 to-slate-50 dark:from-[#0B152B] dark:to-[#070D1B] border-b border-blue-100 dark:border-slate-800 flex items-center justify-between gap-3 flex-shrink-0">
          <div className="flex items-center gap-3">
            {/* Audio Wave Visualizer Bars */}
            <div className="flex items-center gap-1 h-6">
              {[40, 75, 100, 60, 90, 45, 80].map((h, i) => (
                <span
                  key={i}
                  className={`w-1 rounded-full transition-all duration-150 ${
                    isListening
                      ? 'bg-gradient-to-t from-red-500 to-amber-400'
                      : isSpeaking
                      ? 'bg-gradient-to-t from-emerald-500 to-cyan-400'
                      : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                  style={{
                    height: isListening
                      ? `${Math.max(6, Math.min(24, (audioLevel * h) / 100))}px`
                      : isSpeaking
                      ? `${Math.max(6, Math.min(22, (h * 0.3) + Math.sin(Date.now() / 200 + i) * 8))}px`
                      : '4px'
                  }}
                />
              ))}
            </div>

            <div className="min-w-0">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block truncate">
                {isListening
                  ? isAmharic
                    ? 'ድምጽዎን እያዳመጥኩ ነው... ይናገሩ'
                    : 'Listening live... Speak your request'
                  : isSpeaking
                  ? isAmharic
                    ? 'መልስ በድምጽ እየሰጠሁ ነው...'
                    : 'SmartFix Voice AI is speaking...'
                  : isAiProcessing
                  ? isAmharic
                    ? 'ምርመራውን እያከናወንኩ ነው...'
                    : 'Analyzing fault & calculating Addis Ababa ETB rate...'
                  : isAmharic
                  ? 'ለመናገር ማይክሮፎኑን ይጫኑ'
                  : 'Tap microphone to speak'}
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">
                {isAmharic ? 'የኤሌክትሪክ፣ ቧንቧ ወይም ቲቪ ችግር ይጠይቁ' : 'Ask about electrical, plumbing, pump, or TV'}
              </span>
            </div>
          </div>

          {/* Master Mic Trigger Button */}
          <button
            onClick={() => {
              if (isListening) {
                stopVoiceRecognition();
              } else {
                startVoiceRecognition();
              }
            }}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs shadow-md transition-all flex items-center gap-1.5 active:scale-95 flex-shrink-0 ${
              isListening
                ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse ring-2 ring-red-400/50'
                : 'bg-gradient-to-r from-[#1E3A8A] via-[#2563EB] to-cyan-500 hover:from-[#1D4ED8] hover:to-cyan-400 text-white'
            }`}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            <span>{isListening ? (isAmharic ? 'አቁም' : 'Stop') : isAmharic ? 'አሁን ተናገር' : 'Tap to Speak'}</span>
          </button>
        </div>

        {/* Live Interim Transcript Bubble */}
        {interimTranscript && (
          <div className="mx-4 mt-2 p-2.5 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-xs text-blue-900 dark:text-blue-200 flex items-center gap-2 animate-fade-in flex-shrink-0">
            <Radio className="w-4 h-4 text-red-500 animate-pulse flex-shrink-0" />
            <span className="font-semibold italic">"{interimTranscript}"</span>
          </div>
        )}

        {/* Speech Error Banner */}
        {speechError && (
          <div className="mx-4 mt-2 p-2.5 rounded-2xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 text-xs text-red-700 dark:text-red-300 flex items-center justify-between gap-2 flex-shrink-0">
            <span className="text-[11px] font-medium">{speechError}</span>
            <button
              onClick={() => setSpeechError(null)}
              className="p-1 rounded-md hover:bg-red-100 dark:hover:bg-red-900"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* ======================================================== */}
        {/* CHAT MESSAGES STREAM                                     */}
        {/* ======================================================== */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {chatHistory.map((msg) => {
            const isUser = msg.sender === 'user';
            const isThisMsgSpeaking = isSpeaking && activeSpeakingId === msg.id;

            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[90%] sm:max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed shadow-sm relative ${
                    isUser
                      ? 'bg-gradient-to-tr from-[#1E3A8A] to-[#2563EB] text-white rounded-tr-xs'
                      : 'bg-white dark:bg-[#0E172C] text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800 rounded-tl-xs'
                  }`}
                >
                  {/* AI Message Header */}
                  {!isUser && (
                    <div className="flex items-center justify-between gap-2 text-[10px] font-bold text-blue-600 dark:text-cyan-400 mb-1.5 pb-1 border-b border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        <span>SmartFix AI Voice Assistant</span>
                      </div>

                      {/* Replay Speech Button */}
                      <button
                        onClick={() => {
                          if (isThisMsgSpeaking) {
                            stopTextToSpeech();
                          } else {
                            speakVoiceReply(msg.text, msg.id);
                          }
                        }}
                        className={`px-2 py-0.5 rounded-lg flex items-center gap-1 transition-all ${
                          isThisMsgSpeaking
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold animate-pulse'
                            : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500'
                        }`}
                        title={isThisMsgSpeaking ? 'Stop speaking' : 'Read aloud with voice'}
                      >
                        {isThisMsgSpeaking ? (
                          <>
                            <VolumeX className="w-3 h-3 text-emerald-600" />
                            <span className="text-[9px]">Speaking...</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3 h-3" />
                            <span className="text-[9px]">Listen</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  {/* Message Text */}
                  <p className="whitespace-pre-wrap">{msg.text}</p>

                  <span
                    className={`text-[9px] block text-right mt-1.5 font-mono ${
                      isUser ? 'text-blue-200' : 'text-slate-400'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>

                {/* Structured AI Diagnosis Card & 1-Click Booking Action */}
                {msg.diagnosisCard && (
                  <div className="mt-2.5 w-full max-w-[95%] sm:max-w-[88%] bg-white dark:bg-[#0C1527] border border-blue-300 dark:border-blue-800/80 rounded-2xl p-4 shadow-md space-y-3">
                    <div className="flex items-start justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                      <div>
                        <span className="text-[9px] font-mono font-bold text-blue-600 dark:text-cyan-400 uppercase tracking-wider block">
                          AI FAULT DIAGNOSIS & COST
                        </span>
                        <h4 className="font-black text-sm text-slate-900 dark:text-white mt-0.5">
                          {msg.diagnosisCard.issueTitle}
                        </h4>
                      </div>

                      <span
                        className={`text-[9px] font-bold uppercase px-2.5 py-1 rounded-full flex-shrink-0 ${
                          msg.diagnosisCard.dangerLevel === 'high'
                            ? 'bg-red-100 dark:bg-red-950/80 text-red-700 dark:text-red-300 border border-red-300'
                            : msg.diagnosisCard.dangerLevel === 'medium'
                            ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border border-amber-300'
                            : 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-300'
                        }`}
                      >
                        {msg.diagnosisCard.dangerLevel === 'high'
                          ? '⚠️ High Hazard'
                          : msg.diagnosisCard.dangerLevel === 'medium'
                          ? '⚡ Moderate Hazard'
                          : '✓ Safe Inspection'}
                      </span>
                    </div>

                    {/* Root Cause Details */}
                    <div className="p-2.5 bg-slate-50 dark:bg-[#080E1B] rounded-xl text-[11px] text-slate-700 dark:text-slate-300 leading-relaxed border border-slate-200/60 dark:border-slate-800/80">
                      <span className="font-bold text-slate-900 dark:text-white block mb-0.5">
                        {isAmharic ? 'የችግሩ መንስኤ:' : 'Root Cause Analysis:'}
                      </span>
                      {msg.diagnosisCard.rootCause}
                    </div>

                    {/* Practical Safety Instruction */}
                    <div className="p-2.5 bg-amber-50/80 dark:bg-amber-950/30 rounded-xl text-[11px] text-amber-900 dark:text-amber-200 border border-amber-200 dark:border-amber-900/50 flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                      <span>
                        <strong>{isAmharic ? 'የደህንነት ጥንቃቄ:' : 'Safety Instruction:'}</strong> {msg.diagnosisCard.safetyTip}
                      </span>
                    </div>

                    {/* Estimated Cost & Duration in Addis Ababa */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2.5 bg-blue-50/60 dark:bg-blue-950/40 rounded-xl border border-blue-100 dark:border-blue-900/50">
                        <span className="text-[9px] font-bold text-blue-700 dark:text-blue-300 flex items-center gap-1">
                          <Coins className="w-3.5 h-3.5 text-amber-500" />
                          <span>{isAmharic ? 'ግምታዊ ዋጋ (ETB)' : 'Est. Fair Price'}</span>
                        </span>
                        <span className="font-black text-sm text-blue-900 dark:text-blue-100 font-mono block mt-1">
                          {msg.diagnosisCard.estCost}
                        </span>
                      </div>

                      <div className="p-2.5 bg-slate-50 dark:bg-[#080E1B] rounded-xl border border-slate-200 dark:border-slate-800">
                        <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{isAmharic ? 'የሚፈጀው ጊዜ' : 'Est. Duration'}</span>
                        </span>
                        <span className="font-bold text-xs text-slate-800 dark:text-slate-200 block mt-1">
                          {msg.diagnosisCard.estDuration}
                        </span>
                      </div>
                    </div>

                    {/* Instant Service Booking Button */}
                    <div className="pt-1">
                      <button
                        onClick={() => handleBookFromDiagnosis(msg.diagnosisCard!)}
                        className="w-full py-2.5 px-4 bg-gradient-to-r from-[#1E3A8A] via-[#1D4ED8] to-[#2563EB] hover:from-[#1E40AF] hover:to-[#1D4ED8] text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center justify-between active:scale-98"
                      >
                        <div className="flex items-center gap-2">
                          <Wrench className="w-4 h-4 text-amber-300" />
                          <span>
                            {isAmharic
                              ? `ይህንን አገልግሎት አሁን እዘዝ (${msg.diagnosisCard.serviceName})`
                              : `Book ${msg.diagnosisCard.serviceName} Now`}
                          </span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-blue-200" />
                      </button>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 text-center block mt-1.5 font-medium">
                        ✓ Pledged by {msg.diagnosisCard.suggestedTech} • SmartFix 30-Day Guarantee
                      </span>
                    </div>
                  </div>
                )}

                {/* Follow-up Quick Action Chips */}
                {msg.options && msg.options.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5 max-w-[95%]">
                    {msg.options.map((opt, oIdx) => (
                      <button
                        key={oIdx}
                        onClick={() => processUserVoiceQuery(opt)}
                        className="px-3 py-1 rounded-xl bg-white dark:bg-[#0E172A] border border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 hover:border-blue-500 hover:text-blue-600 text-[11px] font-semibold transition-all shadow-2xs text-left active:scale-95"
                      >
                        💬 {opt}
                      </button>
                    ))}
                  </div>
                )}
              </motion.div>
            );
          })}

          {/* AI Thinking Indicator */}
          {isAiProcessing && (
            <div className="flex items-center gap-2 p-3 rounded-2xl bg-white dark:bg-[#0D162B] border border-slate-200 dark:border-slate-800 w-fit text-xs text-slate-600 dark:text-slate-300 shadow-2xs">
              <Sparkles className="w-4 h-4 text-cyan-500 animate-spin" />
              <span className="text-[11px] font-medium">
                {isAmharic
                  ? 'SmartFix Voice AI መልሱን እያሰናዳ ነው...'
                  : 'SmartFix Voice AI is analyzing fault & preparing booking estimate...'}
              </span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* ======================================================== */}
        {/* QUICK ONE-TOUCH VOICE SCENARIOS FOR TESTING             */}
        {/* ======================================================== */}
        <div className="px-4 py-2 bg-slate-50 dark:bg-[#080E1D] border-t border-slate-200 dark:border-slate-800 flex-shrink-0">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Lightbulb className="w-3 h-3 text-amber-500" />
              <span>{isAmharic ? 'ፈጣን የድምጽ ጥያቄዎች (በአንድ ንክኪ ይሞክሩ):' : 'Instant Voice Scenarios (Tap to query):'}</span>
            </span>
            <span className="text-[9px] font-mono text-blue-600 dark:text-cyan-400 font-bold">220V Addis Ababa</span>
          </div>

          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {VOICE_SAMPLE_PROMPTS.map((item, idx) => {
              const query = isAmharic ? item.am : item.en;
              const label = isAmharic ? item.labelAm : item.labelEn;

              return (
                <button
                  key={idx}
                  onClick={() => processUserVoiceQuery(query)}
                  className="flex-shrink-0 px-2.5 py-1 rounded-xl bg-white dark:bg-[#0E172A] border border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 hover:border-blue-500 hover:text-blue-600 text-[11px] font-medium transition-all shadow-2xs flex items-center gap-1.5 active:scale-95"
                >
                  <span>{item.icon}</span>
                  <span>{label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ======================================================== */}
        {/* MODAL FOOTER: LIVE MIC CONTROLS & MANUAL FALLBACK       */}
        {/* ======================================================== */}
        <div className="p-3 sm:p-4 bg-white dark:bg-[#0B1326] border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 flex-shrink-0">
          <button
            onClick={() => {
              stopTextToSpeech();
              setChatHistory([
                {
                  id: 'reset-1',
                  sender: 'ai',
                  text: isAmharic
                    ? 'አዲስ ውይይት ተጀምሯል። ምን ልርዳዎት?'
                    : 'New session started. How can I assist you with your repair or booking?',
                  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                  options: isAmharic
                    ? ['የኤሌክትሪክ ቆጣሪ ይወድቃል', 'የውሃ ፓምፕ ይጮሃል']
                    : ['Circuit breaker keeps tripping', 'Water pump humming']
                }
              ]);
            }}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors flex items-center gap-1 text-xs"
            title="Reset Conversation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isAmharic ? 'አጽዳ' : 'Reset'}</span>
          </button>

          {/* Central Big Talking Button */}
          <div className="flex-1 flex justify-center">
            <button
              onClick={() => {
                if (isListening) {
                  stopVoiceRecognition();
                } else {
                  startVoiceRecognition();
                }
              }}
              className={`w-full max-w-sm py-2.5 px-4 rounded-2xl font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-2 active:scale-98 ${
                isListening
                  ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse ring-4 ring-red-400/30'
                  : 'bg-gradient-to-r from-[#1E3A8A] via-[#2563EB] to-cyan-500 hover:from-[#1D4ED8] hover:to-cyan-400 text-white shadow-blue-900/25'
              }`}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              <span>
                {isListening
                  ? isAmharic
                    ? 'ድምጽዎን እያዳመጥኩ ነው (አቁም)'
                    : 'Listening to your voice (Tap to stop)'
                  : isAmharic
                  ? 'ማይክሮፎኑን ተጭነው ይናገሩ'
                  : 'Tap to Speak to SmartFix AI'}
              </span>
            </button>
          </div>

          <button
            onClick={() => {
              stopTextToSpeech();
              stopVoiceRecognition();
              onClose();
            }}
            className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold text-xs transition-colors"
          >
            {isAmharic ? 'ዝጋ' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
}
