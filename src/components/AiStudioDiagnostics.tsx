import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Sparkles,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  RotateCcw,
  Wrench,
  AlertTriangle,
  Clock,
  Coins,
  ShieldCheck,
  ChevronRight,
  Camera,
  Image as ImageIcon,
  Send,
  Radio,
  CheckCircle2,
  X,
  Play,
  Pause,
  MessageSquare,
  Flame,
  Zap,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ServiceItem, Language } from '../types';
import { SmartFixLogo } from './SmartFixLogo';

// Global declaration for audio API compatibility
declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  image?: string;
  userTranscript?: string;
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

interface AiStudioDiagnosticsProps {
  services: ServiceItem[];
  language: Language;
  onBookWithAiResult: (service: ServiceItem, initialNotes: string) => void;
}

const VOICE_SCENARIOS: Record<string, Array<{ icon: string; label: string; text: string }>> = {
  am: [
    { icon: '⚡', label: 'የኤሌክትሪክ ቆጣሪ መውደቅ', text: 'የቤት ውስጥ የኤሌክትሪክ ቆጣሪ (Breaker) ቦይለር ወይም እቃ ሲበራ ወዲያው ይወድቃል' },
    { icon: '💧', label: 'የውሃ ፓምፕ መጮህ', text: 'የውሃ ፓምፑ ሞተር በከፍተኛ ሁኔታ ይጮሃል ግን ውሃ ወደ ታንከሩ አያወጣም' },
    { icon: '📺', label: 'የቲቪ ምስል ማጣት', text: 'ቲቪዬ ድምጽ ያወጣል ግን ስክሪኑ ሙሉ በሙሉ ጥቁር ሆኗል' },
    { icon: '❄️', label: 'ፍሪጅ አለመቀዝቀዝ', text: 'የፍሪጁ የታችኛው የምግብ ማስቀመጫ ክፍል አይቀዘቅዝም ሞቃት ነው' },
    { icon: '☀️', label: 'የሶላር ኢንቨርተር ድምጽ', text: 'የሶላር ኢንቨርተሩ ቀይ መብራት እያበራ የማስጠንቀቂያ ድምጽ ያሰማል' },
  ],
  en: [
    { icon: '⚡', label: 'Circuit Breaker Tripping', text: 'My main electrical circuit breaker trips immediately when heavy appliances turn on' },
    { icon: '💧', label: 'Water Pump Humming', text: 'Rooftop water pump motor hums loudly but cannot pump water to the roof reservoir' },
    { icon: '📺', label: 'TV Black Screen With Audio', text: 'My LED TV has clear audio sound but the display screen is completely dark' },
    { icon: '❄️', label: 'Fridge Not Cooling', text: 'Refrigerator freezer is freezing but the bottom fresh food section is warm' },
    { icon: '☀️', label: 'Solar Inverter Overload', text: 'Solar hybrid inverter is beeping continuously with a red overload warning light' },
  ],
  om: [
    { icon: '⚡', label: 'Sarveesi Elektiriikii', text: 'Breaker elektiriikii mana kootii meeshaan yeroo banamu deddeebi\'ee dhaama' },
    { icon: '💧', label: 'Pompil Bishaan Iyyisa', text: 'Pompil bishaan ni iyyisa garuu bishaan ol hin baasu' },
    { icon: '📺', label: 'TV Sagalee Qaba', text: 'TV koo sagalee qaba garuu iskiriiniin isaa gurraacha ta\'ee jira' },
    { icon: '❄️', label: 'Firiijii Qorra Dhabe', text: 'Firiijiin qorra gahaa hin qabu, nyaanni keessa jiru ni oowwa' },
    { icon: '☀️', label: 'Inveertara Soolaarii', text: 'Inveertariin soolaarii mallattoo diimaa agarsiisaa iyyisa' },
  ],
  ti: [
    { icon: '⚡', label: 'ቆጻሪ ኤሌክትሪክ ይወድቕ', text: 'ናይ ገዛ ቆጻሪ ኤሌክትሪክ (Breaker) እቃታት ክውላዕ እንከሎ ይወድቕ' },
    { icon: '💧', label: 'ፓምፕ ማይ ይጭደር', text: 'ፓምፕ ማይ ብሓይሊ ይጭደር ግን ማይ ናብ ታንከር ኣየውጽእን' },
    { icon: '📺', label: 'ቲቪ ድምጺ ጥራይ ኣለዎ', text: 'ቲቪ ድምጺ የውጽእ ግን ስክሪን ጸሊም ኮይኑ ምስሊ የለን' },
    { icon: '❄️', label: 'ፍሪጅ ኣየዝሕልን', text: 'ፍሪጅ ብግቡእ ኣየዝሕልን ዘሎ' },
    { icon: '☀️', label: 'ሶላር ኢንቨርተር ድምጺ', text: 'ሶላር ኢንቨርተር ይጭደር ቀይሕ መብራህቲ የብርህ' },
  ],
};

export function AiStudioDiagnostics({
  services,
  language,
  onBookWithAiResult
}: AiStudioDiagnosticsProps) {
  // Current active language for AI voice & responses
  const [activeLang, setActiveLang] = useState<Language>(language);
  const isAmharic = activeLang === 'am';

  // Navigation mode: 'live_voice' (Primary Hero View) vs 'history' (Full Diagnostic Chat Log)
  const [viewMode, setViewMode] = useState<'live_voice' | 'history'>('live_voice');

  // Live Voice Call States: 'idle' | 'listening' | 'analyzing' | 'speaking'
  const [voiceStatus, setVoiceStatus] = useState<'idle' | 'listening' | 'analyzing' | 'speaking'>('idle');
  const [recordTimer, setRecordTimer] = useState<number>(0);
  const [audioAmplitude, setAudioAmplitude] = useState<number>(15);
  const [voiceError, setVoiceError] = useState<string | null>(null);

  // Latest Live Turn (User spoken transcript + latest AI reply & diagnosis)
  const [latestUserTranscript, setLatestUserTranscript] = useState<string>('');
  const [latestAiMessage, setLatestAiMessage] = useState<ChatMessage | null>(null);

  // Conversation history for persistence and context
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>(() => [
    {
      id: 'welcome-init',
      sender: 'ai',
      text: isAmharic
        ? 'ሰላም! እኔ የስማርትፊክስ SmartAI የቀጥታ ድምጽና የምርመራ ረዳት ነኝ። የኤሌክትሪክ፣ የቧንቧ፣ የቲቪ ወይም የፍሪጅ ችግርዎን በድምጽ ይንገሩኝ። መንስኤውን አውቄ ወዲያውኑ የአዲስ አበባ ባለሙያ አገናኝዎታለሁ።'
        : 'Welcome! I am SmartFix SmartAI Live Voice & Diagnostic Assistant. Speak your electrical, plumbing, water pump, TV, or appliance fault. I will diagnose the issue and match you with a certified Addis Ababa technician.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      diagnosisCard: {
        issueTitle: isAmharic ? 'የስማርትፊክስ የቀጥታ ድምጽ ምርመራ' : 'SmartFix Live AI Diagnostic Ready',
        rootCause: isAmharic ? 'የድምጽ ማይክሮፎኑን ተጭነው ይናገሩ ወይም ከታች ካሉት አማራጮች አንዱን ይምረጡ።' : 'Tap the microphone or select a quick scenario to begin instant voice diagnosis.',
        dangerLevel: 'low',
        safetyTip: isAmharic ? 'ለደህንነትዎ የተበላሸ የኤሌክትሪክ እቃን በባዶ እጅ አይንኩ።' : 'For your safety, do not touch exposed live wiring or humming pump casings.',
        estCost: '650 - 1,200 ETB',
        estDuration: '30 - 60 mins',
        matchedServiceId: 'wiring',
        serviceName: isAmharic ? 'የኤሌክትሪክና አጠቃላይ ጥገና' : 'House Wiring & Electrical',
        suggestedTech: 'Kidus Assefa (4.95 ⭐ • Licensed Master Tech)'
      }
    }
  ]);

  // Text fallback input (in history view)
  const [historyInputText, setHistoryInputText] = useState('');
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [autoVoiceReplies, setAutoVoiceReplies] = useState<boolean>(true);

  // Audio & Recording Refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const timerIntervalRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Speech synthesis audio reference
  const activeUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Synchronize language prop change
  useEffect(() => {
    setActiveLang(language);
  }, [language]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopRecordingCleanup();
      stopVoiceAudio();
    };
  }, []);

  // Cleanup recorder and audio context
  const stopRecordingCleanup = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      try {
        mediaRecorderRef.current.stop();
      } catch {
        // ignore
      }
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      try {
        audioContextRef.current.close();
      } catch {
        // ignore
      }
    }
  };

  // Play natural audio response
  const playVoiceAudio = useCallback((textToSpeak: string) => {
    if (!('speechSynthesis' in window) || !autoVoiceReplies) {
      setVoiceStatus('idle');
      return;
    }

    try {
      window.speechSynthesis.cancel();

      // Clean markdown tags, emojis, and urls
      const clean = textToSpeak
        .replace(/[*_~`#]/g, '')
        .replace(/https?:\/\/\S+/g, '')
        .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')
        .trim();

      if (!clean) {
        setVoiceStatus('idle');
        return;
      }

      const utterance = new SpeechSynthesisUtterance(clean);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;

      // Select matching voice
      const voices = window.speechSynthesis.getVoices();
      if (activeLang === 'am') {
        const amVoice = voices.find(v => v.lang.startsWith('am') || v.lang.startsWith('ethi'));
        if (amVoice) utterance.voice = amVoice;
        utterance.lang = 'am-ET';
      } else {
        const enVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google')));
        if (enVoice) utterance.voice = enVoice;
        utterance.lang = 'en-US';
      }

      utterance.onstart = () => {
        setVoiceStatus('speaking');
      };

      utterance.onend = () => {
        setVoiceStatus('idle');
      };

      utterance.onerror = () => {
        setVoiceStatus('idle');
      };

      activeUtteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    } catch {
      setVoiceStatus('idle');
    }
  }, [activeLang, autoVoiceReplies]);

  const stopVoiceAudio = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setVoiceStatus('idle');
  };

  // 1. START LIVE VOICE RECORDING
  const handleStartSpeaking = async () => {
    stopVoiceAudio();
    setVoiceError(null);

    try {
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      // Set up real-time audio visualizer spectrum
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        const audioCtx = new AudioCtx();
        audioContextRef.current = audioCtx;
        const source = audioCtx.createMediaStreamSource(stream);
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 64;
        source.connect(analyser);
        analyserRef.current = analyser;

        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        const updateLevel = () => {
          if (!analyserRef.current) return;
          analyserRef.current.getByteFrequencyData(dataArray);
          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) {
            sum += dataArray[i];
          }
          const avg = sum / dataArray.length;
          const normalized = Math.min(100, Math.max(12, Math.round((avg / 128) * 100)));
          setAudioAmplitude(normalized);
          animationFrameRef.current = requestAnimationFrame(updateLevel);
        };
        updateLevel();
      }

      // Check supported recording format
      let mimeType = 'audio/webm;codecs=opus';
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'audio/webm';
        if (!MediaRecorder.isTypeSupported(mimeType)) {
          mimeType = '';
        }
      }

      const mediaRecorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        // Stop audio tracks
        stream.getTracks().forEach(track => track.stop());
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
        if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
          try {
            audioContextRef.current.close();
          } catch {
            // ignore
          }
        }

        const actualMime = mediaRecorder.mimeType || 'audio/webm';
        const audioBlob = new Blob(audioChunksRef.current, { type: actualMime });

        if (audioBlob.size < 500) {
          setVoiceStatus('idle');
          setVoiceError(isAmharic ? 'ድምጽ አልተሰማም። እባክዎ እንደገና ይሞክሩ።' : 'No sound detected. Please try speaking again.');
          return;
        }

        // Convert to Base64 and send directly to /api/ai/chat
        setVoiceStatus('analyzing');
        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64Audio = reader.result as string;
          await processVoiceInteraction({
            audio: base64Audio,
            mimeType: actualMime
          });
        };
        reader.readAsDataURL(audioBlob);
      };

      mediaRecorder.start(250);
      setVoiceStatus('listening');
      setRecordTimer(0);

      // Start timer
      timerIntervalRef.current = setInterval(() => {
        setRecordTimer(prev => {
          // Auto finish after 25 seconds
          if (prev >= 25) {
            handleStopSpeaking();
            return prev;
          }
          return prev + 1;
        });
      }, 1000);

    } catch (err: any) {
      console.error('Microphone access failed:', err);
      setVoiceStatus('idle');
      setVoiceError(
        isAmharic
          ? 'ማይክሮፎን መክፈት አልተቻለም። እባክዎ በብሮውዘርዎ የፍቃድ ምልክት (Allow) ይጫኑ ወይም ከታች ካሉት ጥያቄዎች አንዱን ይምረጡ።'
          : 'Could not access microphone. Please allow microphone permission in your browser, or select a scenario below.'
      );
    }
  };

  // 2. STOP LIVE VOICE RECORDING
  const handleStopSpeaking = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      try {
        mediaRecorderRef.current.stop();
      } catch (err) {
        console.error('Error stopping recorder:', err);
        setVoiceStatus('idle');
      }
    }
  };

  // 3. PROCESS VOICE INTERACTION WITH /api/ai/chat
  const processVoiceInteraction = async ({
    audio,
    mimeType,
    textQuery,
    image
  }: {
    audio?: string;
    mimeType?: string;
    textQuery?: string;
    image?: string;
  }) => {
    setVoiceStatus('analyzing');
    setVoiceError(null);

    const userMessageId = `user-${Date.now()}`;
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Temporary placeholder in history
    if (textQuery) {
      setLatestUserTranscript(textQuery);
      const userMsg: ChatMessage = {
        id: userMessageId,
        sender: 'user',
        text: textQuery,
        timestamp,
        image: image || attachedImage || undefined
      };
      setChatHistory(prev => [...prev, userMsg]);
    }

    try {
      const payload: any = {
        language: activeLang,
        history: chatHistory.slice(-5).map(m => ({
          role: m.sender === 'user' ? 'user' : 'model',
          text: m.text
        })),
        context: {
          city: 'Addis Ababa',
          voltageGrid: '220V 50Hz',
          availableServices: services.map(s => ({ id: s.id, name: s.name, price: s.price }))
        }
      };

      if (audio) {
        payload.audio = audio;
        payload.mimeType = mimeType || 'audio/webm';
      }
      if (textQuery) {
        payload.message = textQuery;
      }
      if (image || attachedImage) {
        payload.image = image || attachedImage;
      }

      const resp = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await resp.json();

      // Determine user spoken transcript
      const transcript = data.userTranscript || textQuery || (isAmharic ? 'የድምጽ ጥያቄ' : 'Spoken Voice Query');
      setLatestUserTranscript(transcript);

      // Construct AI message
      const aiMessageId = `ai-${Date.now()}`;
      const aiReplyText = data.reply || (isAmharic
        ? 'የችግሩን ሁኔታ መርምሬያለሁ። ለደህንነትዎ ሲባል የተበላሸውን እቃ ያጥፉና የተመደበውን ቴክኒሻን ይዘዙ።'
        : 'I have analyzed your repair request. Please keep the unit turned off while our certified technician arrives.');

      const newAiMessage: ChatMessage = {
        id: aiMessageId,
        sender: 'ai',
        text: aiReplyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        userTranscript: transcript,
        diagnosisCard: data.diagnosisCard,
        options: data.followUps
      };

      // Add to conversation history
      setChatHistory(prev => {
        // If it was voice without prior user text card, prepend the user turn
        if (!textQuery) {
          const userVoiceMsg: ChatMessage = {
            id: userMessageId,
            sender: 'user',
            text: transcript,
            timestamp,
            userTranscript: transcript,
            image: image || attachedImage || undefined
          };
          return [...prev, userVoiceMsg, newAiMessage];
        }
        return [...prev, newAiMessage];
      });

      setLatestAiMessage(newAiMessage);
      setAttachedImage(null);

      // Play voice audio response
      playVoiceAudio(aiReplyText);

    } catch (err: any) {
      console.error('Error diagnosing via SmartAI:', err);
      setVoiceStatus('idle');
      setVoiceError(
        isAmharic
          ? 'የኔትወርክ ወይም የምርመራ መቆራረጥ አጋጥሟል። እባክዎ እንደገና ይሞክሩ።'
          : 'Network or diagnostic interruption. Please try again.'
      );
    }
  };

  // Quick 1-Tap Voice Scenario trigger
  const handleTriggerScenario = (scenarioText: string) => {
    stopVoiceAudio();
    processVoiceInteraction({ textQuery: scenarioText });
  };

  // Book service with initial prefilled notes from AI diagnosis
  const handleBookFromCard = (matchedServiceId?: string, notes?: string) => {
    const srv = services.find(s => s.id === matchedServiceId) || services[0];
    onBookWithAiResult(srv, notes || latestAiMessage?.diagnosisCard?.issueTitle || 'AI Diagnostic Booking');
  };

  // Image upload
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setAttachedImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const currentScenarios = VOICE_SCENARIOS[activeLang] || VOICE_SCENARIOS.en;
  const displayCard = latestAiMessage?.diagnosisCard || chatHistory[chatHistory.length - 1]?.diagnosisCard;

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col h-[670px] max-h-[85vh] bg-white dark:bg-[#070D1B] rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xl overflow-hidden relative font-sans">
      
      {/* ======================================================== */}
      {/* 1. TOP HEADER WITH ETHIOPIAN TECH AESTHETIC & CONTROLS   */}
      {/* ======================================================== */}
      <header className="px-4 py-3 bg-gradient-to-r from-[#0C172E] via-[#0F1E3D] to-[#16274E] text-white border-b border-blue-900/40 flex items-center justify-between flex-shrink-0 z-20 shadow-xs">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#1E3A8A] to-[#2563EB] text-amber-300 flex items-center justify-center shadow-md flex-shrink-0 border border-blue-400/20">
            <Sparkles className="w-4 h-4 animate-pulse" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h3 className="font-black text-sm tracking-tight text-white flex items-center gap-1">
                <span>SmartAI</span>
                <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 font-bold border border-blue-400/25">
                  Live Voice
                </span>
              </h3>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </div>
            <p className="text-[10px] text-blue-200/80 truncate">
              {isAmharic ? 'የቀጥታ የድምጽ ውይይትና የአዲስ አበባ ፈጣን ምርመራ' : 'Live Voice Conversation & Addis Ababa Diagnostics'}
            </p>
          </div>
        </div>

        {/* View Switcher Pills & Voice Volume */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {/* Mode Switch Pills */}
          <div className="flex items-center bg-black/30 backdrop-blur-md p-0.5 rounded-xl border border-white/10 text-[11px]">
            <button
              type="button"
              onClick={() => setViewMode('live_voice')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all flex items-center gap-1 ${
                viewMode === 'live_voice'
                  ? 'bg-[#2563EB] text-white shadow-xs'
                  : 'text-blue-200 hover:text-white'
              }`}
            >
              <Mic className="w-3 h-3" />
              <span>{isAmharic ? 'ድምጽ' : 'Voice'}</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('history')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all flex items-center gap-1 ${
                viewMode === 'history'
                  ? 'bg-[#2563EB] text-white shadow-xs'
                  : 'text-blue-200 hover:text-white'
              }`}
            >
              <MessageSquare className="w-3 h-3" />
              <span>{isAmharic ? 'ታሪክ' : 'History'}</span>
            </button>
          </div>

          {/* Voice Response Sound Toggle */}
          <button
            type="button"
            onClick={() => {
              if (voiceStatus === 'speaking') stopVoiceAudio();
              setAutoVoiceReplies(!autoVoiceReplies);
            }}
            className={`p-1.5 rounded-xl border transition-colors ${
              autoVoiceReplies
                ? 'bg-blue-600/30 border-blue-400/40 text-blue-200'
                : 'bg-black/20 border-white/10 text-slate-400'
            }`}
            title={autoVoiceReplies ? 'Auto Voice Replies: ON' : 'Auto Voice Replies: MUTED'}
          >
            {autoVoiceReplies ? <Volume2 className="w-4 h-4 text-amber-300" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* ======================================================== */}
      {/* 2. SECONDARY BAR: LANGUAGE PILLS & ADDIS 220V STAMP      */}
      {/* ======================================================== */}
      <div className="px-4 py-2 bg-slate-50 dark:bg-[#0A1224] border-b border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between flex-shrink-0 text-xs">
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-none py-0.5">
          {[
            { id: 'am' as Language, label: 'አማርኛ' },
            { id: 'en' as Language, label: 'English' },
            { id: 'om' as Language, label: 'Afaan Oromoo' },
            { id: 'ti' as Language, label: 'ትግርኛ' }
          ].map(l => (
            <button
              key={l.id}
              onClick={() => setActiveLang(l.id)}
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold transition-all flex-shrink-0 ${
                activeLang === l.id
                  ? 'bg-[#1E3A8A] text-white shadow-xs'
                  : 'bg-white dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60 hover:border-blue-400'
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1 text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 pl-2">
          <Zap className="w-3 h-3 text-amber-500" />
          <span>Addis 220V</span>
        </div>
      </div>

      {/* ======================================================== */}
      {/* VIEW 1: HERO LIVE CONVERSATION CONSOLE (PRIMARY EXPERIENCE) */}
      {/* ======================================================== */}
      {viewMode === 'live_voice' && (
        <div className="flex-1 flex flex-col overflow-y-auto p-4 space-y-4">
          
          {/* A. Dynamic Voice Orb & Visualizer Centerpiece */}
          <div className="relative rounded-3xl bg-gradient-to-b from-[#081022] via-[#0B1730] to-[#060D1D] p-5 border border-blue-900/40 text-center shadow-lg flex flex-col items-center justify-center overflow-hidden">
            
            {/* Ambient Background Aura Rings */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div
                className={`w-64 h-64 rounded-full transition-all duration-700 blur-2xl opacity-20 ${
                  voiceStatus === 'listening'
                    ? 'bg-rose-500 scale-125'
                    : voiceStatus === 'analyzing'
                    ? 'bg-amber-400 scale-110'
                    : voiceStatus === 'speaking'
                    ? 'bg-emerald-400 scale-120'
                    : 'bg-blue-600 scale-100'
                }`}
              />
            </div>

            {/* Status Pill Badge */}
            <div className="relative z-10 mb-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[11px] font-bold text-white shadow-xs">
              <span
                className={`w-2 h-2 rounded-full ${
                  voiceStatus === 'listening'
                    ? 'bg-rose-500 animate-ping'
                    : voiceStatus === 'analyzing'
                    ? 'bg-amber-400 animate-spin'
                    : voiceStatus === 'speaking'
                    ? 'bg-emerald-400 animate-pulse'
                    : 'bg-blue-400'
                }`}
              />
              <span>
                {voiceStatus === 'listening'
                  ? isAmharic ? `እያዳመጥኩ ነው... (${recordTimer} ሰከንድ)` : `Listening... (${recordTimer}s)`
                  : voiceStatus === 'analyzing'
                  ? isAmharic ? 'ምርመራ በማከናወን ላይ...' : 'Analyzing Addis Grid & Fault...'
                  : voiceStatus === 'speaking'
                  ? isAmharic ? 'SmartAI እየተናገረ ነው...' : 'SmartAI Speaking...'
                  : isAmharic ? 'ለመናገር ይጫኑ • Live Voice' : 'Tap Orb to Speak • Live Voice'}
              </span>
            </div>

            {/* Central Interactive Voice Orb Button */}
            <div className="relative z-10 my-2 flex items-center justify-center">
              {/* Concentric Pulsing Equalizer Halo */}
              {voiceStatus === 'listening' && (
                <motion.div
                  animate={{ scale: [1, 1.25, 1], opacity: [0.7, 0.2, 0.7] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute w-36 h-36 rounded-full border-2 border-rose-400/40 pointer-events-none"
                />
              )}

              {voiceStatus === 'speaking' && (
                <motion.div
                  animate={{ scale: [1, 1.2, 1], opacity: [0.6, 0.15, 0.6] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute w-36 h-36 rounded-full border-2 border-emerald-400/40 pointer-events-none"
                />
              )}

              <button
                type="button"
                id="smartai-orb-button"
                onClick={() => {
                  if (voiceStatus === 'listening') {
                    handleStopSpeaking();
                  } else if (voiceStatus === 'speaking') {
                    stopVoiceAudio();
                  } else if (voiceStatus === 'idle') {
                    handleStartSpeaking();
                  }
                }}
                className={`relative w-28 h-28 rounded-full flex flex-col items-center justify-center transition-all transform active:scale-95 shadow-2xl focus:outline-hidden ${
                  voiceStatus === 'listening'
                    ? 'bg-gradient-to-tr from-rose-700 via-rose-600 to-amber-500 ring-4 ring-rose-400/50 shadow-rose-900/60'
                    : voiceStatus === 'analyzing'
                    ? 'bg-gradient-to-tr from-amber-600 via-indigo-700 to-blue-600 ring-4 ring-amber-400/40 animate-pulse'
                    : voiceStatus === 'speaking'
                    ? 'bg-gradient-to-tr from-emerald-600 via-teal-700 to-[#1E3A8A] ring-4 ring-emerald-400/50 shadow-emerald-900/60'
                    : 'bg-gradient-to-tr from-[#0F1E3D] via-[#1E3A8A] to-[#2563EB] ring-4 ring-blue-400/30 hover:ring-blue-400/60 hover:scale-105 shadow-blue-950/80'
                }`}
                title="Tap to talk with SmartFix AI"
              >
                {voiceStatus === 'listening' ? (
                  <>
                    <MicOff className="w-10 h-10 text-white drop-shadow-md" />
                    <span className="text-[10px] font-black text-white mt-1 tracking-tight">
                      {isAmharic ? 'ጨርሻለሁ' : 'Done'}
                    </span>
                  </>
                ) : voiceStatus === 'analyzing' ? (
                  <>
                    <Sparkles className="w-10 h-10 text-amber-300 animate-spin" />
                    <span className="text-[10px] font-black text-amber-200 mt-1">
                      {isAmharic ? 'ምርመራ...' : 'Diagnosing'}
                    </span>
                  </>
                ) : voiceStatus === 'speaking' ? (
                  <>
                    <Volume2 className="w-10 h-10 text-white drop-shadow-md animate-pulse" />
                    <span className="text-[10px] font-black text-emerald-200 mt-1">
                      {isAmharic ? 'አቁም' : 'Stop'}
                    </span>
                  </>
                ) : (
                  <>
                    <Mic className="w-10 h-10 text-white drop-shadow-md group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-black text-blue-200 mt-1">
                      {isAmharic ? 'ይናገሩ' : 'Tap to Speak'}
                    </span>
                  </>
                )}
              </button>
            </div>

            {/* Bouncing Audio Wave Equalizer (Reacts to live voice amplitude) */}
            <div className="relative z-10 flex items-center justify-center gap-1.5 h-7 mt-2">
              {[0.4, 0.7, 1.0, 0.6, 0.9, 1.1, 0.75, 0.5].map((scale, i) => {
                const height = voiceStatus === 'listening'
                  ? Math.max(6, Math.min(28, (audioAmplitude / 3) * scale))
                  : voiceStatus === 'speaking'
                  ? Math.max(6, 18 * Math.sin(Date.now() / 150 + i))
                  : 4;

                return (
                  <span
                    key={i}
                    style={{ height: `${height}px` }}
                    className={`w-1 rounded-full transition-all duration-75 ${
                      voiceStatus === 'listening'
                        ? 'bg-rose-400'
                        : voiceStatus === 'speaking'
                        ? 'bg-emerald-400'
                        : 'bg-blue-400/40'
                    }`}
                  />
                );
              })}
            </div>

            <p className="relative z-10 text-[11px] text-blue-200/90 font-medium max-w-sm mt-1">
              {voiceStatus === 'listening'
                ? isAmharic ? 'ስለ ኤሌክትሪክ፣ ቲቪ፣ ቧንቧ ወይም ፍሪጅ ችግርዎ ይናገሩ...' : 'Speak clearly about your equipment fault...'
                : voiceStatus === 'analyzing'
                ? isAmharic ? 'የድምጽ መልዕክትዎን አዳምጬ የጥገና መፍትሄ እያዘጋጀሁ ነው...' : 'Listening to speech & analyzing Addis electrical context...'
                : voiceStatus === 'speaking'
                ? isAmharic ? 'የድምጽ መልሱን ያዳምጡ ወይም ከታች ያለውን የጥገና ካርድ ይመልከቱ' : 'Listen to diagnostic advice or book certified master tech below'
                : isAmharic ? 'የማይክሮፎኑን ምልክት ይጫኑ ወይም ከታች ካሉት የተለመዱ ችግሮች አንዱን ይምረጡ' : 'Tap the microphone or choose an Addis Ababa scenario below'}
            </p>

            {/* Error Notification banner if mic blocked */}
            {voiceError && (
              <div className="relative z-10 mt-3 p-2.5 rounded-2xl bg-amber-950/80 border border-amber-500/60 text-amber-200 text-xs flex items-start gap-2 text-left">
                <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] leading-snug">{voiceError}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setVoiceError(null)}
                  className="text-amber-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* B. Live Spoken User Transcript Card (Shows what the user spoke) */}
          {latestUserTranscript && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3.5 rounded-2xl bg-blue-50 dark:bg-[#0B152B] border border-blue-200 dark:border-blue-900/60 space-y-1 shadow-2xs"
            >
              <div className="flex items-center justify-between text-[10px] font-bold text-blue-700 dark:text-blue-300">
                <div className="flex items-center gap-1.5">
                  <Mic className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <span>{isAmharic ? 'እርስዎ የተናገሩት (Transcribed Voice)' : 'Your Spoken Words'}</span>
                </div>
                <span className="font-mono text-[9px] px-1.5 py-0.2 rounded bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-200 font-bold">
                  Verified
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-100 leading-relaxed pl-5">
                "{latestUserTranscript}"
              </p>
            </motion.div>
          )}

          {/* C. Primary Diagnostic & Safety Recommendation Card */}
          {displayCard && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-3xl bg-white dark:bg-[#0A1224] border-2 border-blue-500/30 dark:border-blue-600/40 shadow-md space-y-3"
            >
              {/* Card Header: Title & Hazard Level Badge */}
              <div className="flex items-start justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-2.5">
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="w-2 h-2 rounded-full bg-blue-600" />
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                      {isAmharic ? 'የምርመራ ውጤት' : 'Diagnostic Breakdown'}
                    </span>
                  </div>
                  <h4 className="font-black text-sm text-slate-900 dark:text-white leading-snug">
                    {displayCard.issueTitle}
                  </h4>
                </div>

                <span
                  className={`px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-1 flex-shrink-0 ${
                    displayCard.dangerLevel === 'high'
                      ? 'bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800'
                      : displayCard.dangerLevel === 'medium'
                      ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                      : 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                  }`}
                >
                  <AlertTriangle className="w-3 h-3" />
                  <span>
                    {displayCard.dangerLevel === 'high'
                      ? isAmharic ? 'ከፍተኛ አደጋ' : 'High Hazard'
                      : displayCard.dangerLevel === 'medium'
                      ? isAmharic ? 'መካከለኛ ጥንቃቄ' : 'Medium Risk'
                      : isAmharic ? 'ዝቅተኛ አደጋ' : 'Low Risk'}
                  </span>
                </span>
              </div>

              {/* Root Cause Explanation */}
              <div className="space-y-1 text-xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  {isAmharic ? 'መንስኤና ሁኔታ' : 'Root Cause & Analysis'}
                </span>
                <p className="text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
                  {displayCard.rootCause}
                </p>
              </div>

              {/* Safety Tip Alert Box */}
              {displayCard.safetyTip && (
                <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <span className="text-[10px] font-black uppercase text-amber-800 dark:text-amber-300 tracking-wide block">
                      {isAmharic ? 'የደህንነት ማስጠንቀቂያ' : 'Safety Precaution'}
                    </span>
                    <p className="text-[11px] text-amber-900/90 dark:text-amber-200/90 font-semibold leading-tight mt-0.5">
                      {displayCard.safetyTip}
                    </p>
                  </div>
                </div>
              )}

              {/* Cost & Duration Estimate Pills */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 flex items-center gap-2">
                  <div className="w-7 h-7 rounded-xl bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 flex items-center justify-center flex-shrink-0 font-bold text-xs">
                    ETB
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 block uppercase font-bold">
                      {isAmharic ? 'የዋጋ ግምት' : 'Estimated Cost'}
                    </span>
                    <span className="text-xs font-black text-slate-900 dark:text-white font-mono">
                      {displayCard.estCost}
                    </span>
                  </div>
                </div>

                <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 flex items-center gap-2">
                  <div className="w-7 h-7 rounded-xl bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 block uppercase font-bold">
                      {isAmharic ? 'የጊዜ ቆይታ' : 'Repair Time'}
                    </span>
                    <span className="text-xs font-black text-slate-900 dark:text-white font-mono">
                      {displayCard.estDuration}
                    </span>
                  </div>
                </div>
              </div>

              {/* Recommended Master Technician & Instant Book CTA */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-[#1E3A8A] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                    ✓
                  </div>
                  <div className="min-w-0">
                    <span className="text-[9px] text-slate-400 block font-bold uppercase">
                      {isAmharic ? 'የተመከረ ቴክኒሻን' : 'Recommended Master Tech'}
                    </span>
                    <span className="text-xs font-extrabold text-slate-900 dark:text-white truncate block">
                      {displayCard.suggestedTech || 'Dawit Abebe (4.95 ⭐)'}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  id="book-tech-from-diagnostic-card"
                  onClick={() => handleBookFromCard(displayCard.matchedServiceId)}
                  className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#1E3A8A] to-[#2563EB] hover:from-[#1D4ED8] hover:to-[#3B82F6] text-white font-black text-xs shadow-md flex items-center justify-center gap-1.5 active:scale-95 transition-all"
                >
                  <Wrench className="w-3.5 h-3.5 text-amber-300" />
                  <span>{isAmharic ? 'ባለሙያውን ወዲያውኑ ይዘዙ' : 'Book Technician Now'}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          )}

          {/* D. Quick Spoken Voice Scenarios (1-Tap Addis Fault Prompts) */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 animate-pulse" />
                <span>{isAmharic ? 'የተለመዱ የአዲስ አበባ ችግሮች (በ1 ንክኪ ይመርምሩ)' : 'Quick Scenarios (Tap to diagnose)'}</span>
              </span>
              <span className="text-[9px] font-mono text-slate-400">Addis Ababa</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {currentScenarios.map((sc, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleTriggerScenario(sc.text)}
                  className="p-2.5 rounded-2xl bg-white dark:bg-[#0B1428] border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-600 text-left transition-all shadow-2xs hover:shadow-sm flex items-start gap-2.5 group active:scale-98"
                >
                  <span className="text-xl p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 group-hover:scale-110 transition-transform">
                    {sc.icon}
                  </span>
                  <div className="min-w-0 flex-1">
                    <span className="text-xs font-bold text-slate-900 dark:text-white block group-hover:text-blue-600 dark:group-hover:text-blue-400">
                      {sc.label}
                    </span>
                    <span className="text-[10px] text-slate-500 line-clamp-1">
                      {sc.text}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* VIEW 2: COMPLETE DIAGNOSTIC LOG & CHAT HISTORY VIEW      */}
      {/* ======================================================== */}
      {viewMode === 'history' && (
        <div className="flex-1 flex flex-col min-h-0 bg-slate-50/50 dark:bg-[#060B17]">
          
          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
            {chatHistory.map((msg) => {
              const isUser = msg.sender === 'user';

              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[88%] rounded-3xl p-3.5 text-xs leading-relaxed shadow-2xs relative space-y-2 ${
                      isUser
                        ? 'bg-gradient-to-tr from-[#1E3A8A] to-[#2563EB] text-white rounded-tr-xs'
                        : 'bg-white dark:bg-[#0B152B] text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800 rounded-tl-xs'
                    }`}
                  >
                    {/* Attached Photo if any */}
                    {msg.image && (
                      <div className="rounded-2xl overflow-hidden mb-2 max-h-40 border border-white/20">
                        <img
                          src={msg.image}
                          alt="Attached equipment photo"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    {/* Message Text */}
                    <p className="font-medium whitespace-pre-wrap">{msg.text}</p>

                    {/* Nested Diagnosis Card if present */}
                    {msg.diagnosisCard && (
                      <div className="mt-2 p-3 rounded-2xl bg-blue-50 dark:bg-[#070D1D] border border-blue-200 dark:border-blue-900/60 text-slate-900 dark:text-white space-y-2">
                        <div className="flex items-center justify-between">
                          <h5 className="font-extrabold text-xs text-blue-950 dark:text-blue-100">
                            {msg.diagnosisCard.issueTitle}
                          </h5>
                          <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-200">
                            {msg.diagnosisCard.estCost}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 dark:text-slate-300">
                          {msg.diagnosisCard.rootCause}
                        </p>
                        <button
                          type="button"
                          onClick={() => handleBookFromCard(msg.diagnosisCard?.matchedServiceId)}
                          className="w-full py-1.5 rounded-xl bg-[#1E3A8A] hover:bg-[#2563EB] text-white font-bold text-[11px] flex items-center justify-center gap-1 shadow-xs"
                        >
                          <Wrench className="w-3 h-3 text-amber-300" />
                          <span>{isAmharic ? 'ባለሙያ ይዘዙ' : 'Book Technician'}</span>
                        </button>
                      </div>
                    )}

                    {/* Timestamp & Replay button */}
                    <div className="flex items-center justify-between text-[9px] opacity-75 pt-1">
                      <span>{msg.timestamp}</span>
                      {!isUser && (
                        <button
                          type="button"
                          onClick={() => playVoiceAudio(msg.text)}
                          className="hover:opacity-100 flex items-center gap-1 font-bold"
                          title="Read aloud"
                        >
                          <Volume2 className="w-3 h-3" />
                          <span>{isAmharic ? 'ድምጽ አጫውት' : 'Listen'}</span>
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* History Mode Input Bar (Allows typing or attaching image) */}
          <div className="p-3 bg-white dark:bg-[#0A1224] border-t border-slate-200 dark:border-slate-800 space-y-2">
            {attachedImage && (
              <div className="relative inline-block">
                <img
                  src={attachedImage}
                  alt="Preview"
                  className="w-14 h-14 rounded-xl object-cover border border-blue-400"
                />
                <button
                  type="button"
                  onClick={() => setAttachedImage(null)}
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center text-[10px]"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!historyInputText.trim() && !attachedImage) return;
                const text = historyInputText.trim();
                setHistoryInputText('');
                processVoiceInteraction({ textQuery: text, image: attachedImage || undefined });
              }}
              className="flex items-center gap-2"
            >
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition-colors"
                title="Attach photo of broken equipment"
              >
                <Camera className="w-4 h-4" />
              </button>

              <input
                type="text"
                value={historyInputText}
                onChange={(e) => setHistoryInputText(e.target.value)}
                placeholder={isAmharic ? 'ጥያቄዎን ወይም ችግርዎን እዚህ ይጻፉ...' : 'Type your equipment issue here...'}
                className="flex-1 p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />

              <button
                type="submit"
                disabled={!historyInputText.trim() && !attachedImage}
                className="p-2.5 rounded-2xl bg-[#1E3A8A] hover:bg-[#2563EB] disabled:opacity-40 text-white transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
