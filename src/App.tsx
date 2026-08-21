import React, { useState } from 'react';
import {
  Sun,
  Moon,
  Globe,
  Layers,
  Sparkles,
  Smartphone,
  CheckCircle,
  X,
  Shield,
  PhoneCall,
  RotateCcw,
  CheckCircle2,
  Maximize2,
  Star,
  Zap,
  Grid
} from 'lucide-react';
import { SwissCorporateApp } from './components/SwissCorporateApp';
import { ClassicAppBackup, FORMAL_CONCEPTS, ServiceItem, SERVICES } from './components/ClassicAppBackup';

export default function App() {
  const [activeTab, setActiveTab] = useState<'swiss' | 'backup' | 'concepts'>('swiss');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [language, setLanguage] = useState<'en' | 'am'>('en');
  const [selectedLocation, setSelectedLocation] = useState<string>('Bole, Medhanialem');
  const [emergencyModalOpen, setEmergencyModalOpen] = useState<boolean>(false);
  const [activeConceptModal, setActiveConceptModal] = useState<typeof FORMAL_CONCEPTS[0] | null>(null);
  const [bookingSuccessToast, setBookingSuccessToast] = useState<string | null>(null);

  const handleBookService = (serviceName: string) => {
    setBookingSuccessToast(`Booking Confirmed! Certified Master Technician dispatched for "${serviceName}". ETA: ~11 mins.`);
    setTimeout(() => {
      setBookingSuccessToast(null);
    }, 4500);
  };

  const handleOpenSOS = () => {
    setEmergencyModalOpen(true);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'dark bg-[#040812] text-slate-100' : 'bg-[#F4F6FB] text-slate-900'}`}>
      {/* GLOBAL TOAST NOTIFICATION */}
      {bookingSuccessToast && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-[#0F1E3D] text-white border-2 border-emerald-400 px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-slide-down max-w-md w-[92%]">
          <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
            <CheckCircle className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="flex-1 text-xs">
            <p className="font-extrabold text-emerald-300 uppercase text-[10px] tracking-wider">ISO Dispatch Successful</p>
            <p className="text-white mt-0.5">{bookingSuccessToast}</p>
          </div>
          <button onClick={() => setBookingSuccessToast(null)} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* TOP DESKTOP HEADER & CONTROLS */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-[#070C1A]/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 px-4 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#0F1E3D] via-[#1E3A8A] to-[#2563EB] text-white flex items-center justify-center font-black text-sm shadow-md">
              SF
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-black text-base tracking-tight text-[#0F1E3D] dark:text-white">
                  SMART<span className="text-[#2563EB] dark:text-[#60A5FA]">FIX</span>
                </h1>
                <span className="text-[10px] font-mono uppercase bg-[#1E3A8A]/10 dark:bg-[#2563EB]/20 text-[#1E3A8A] dark:text-[#93C5FD] px-2 py-0.5 rounded-full font-bold border border-[#1E3A8A]/20">
                  Swiss Precision Edition
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Formal Enterprise & Executive Technician Platform • Addis Ababa
              </p>
            </div>
          </div>

          {/* VIEW SWITCHER TABS */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800">
            <button
              id="tab-swiss-combined"
              onClick={() => setActiveTab('swiss')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
                activeTab === 'swiss'
                  ? 'bg-gradient-to-r from-[#1E3A8A] to-[#2563EB] text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Combined Swiss & Cobalt App</span>
            </button>

            <button
              id="tab-backup-app"
              onClick={() => setActiveTab('backup')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'backup'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm border border-slate-200 dark:border-slate-700'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Preserved original clean interactive app version"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span>Original Clean Backup</span>
            </button>

            <button
              id="tab-design-concepts"
              onClick={() => setActiveTab('concepts')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'concepts'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm border border-slate-200 dark:border-slate-700'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-blue-500" />
              <span>All 4 Formal Concepts Gallery</span>
            </button>
          </div>

          {/* GLOBAL TOGGLES */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setLanguage(language === 'en' ? 'am' : 'en')}
              className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-bold flex items-center gap-1.5 text-slate-700 dark:text-slate-300 hover:border-blue-500 transition-colors shadow-xs"
            >
              <Globe className="w-3.5 h-3.5 text-blue-600" />
              <span>{language === 'en' ? 'EN / አማርኛ' : 'አማርኛ / EN'}</span>
            </button>

            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-blue-500 transition-colors shadow-xs"
              title="Toggle Light / Executive Dark Mode"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-[#1E3A8A]" />}
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="py-6 px-4 sm:px-6">
        {/* ============================================================ */}
        {/* TAB 1: COMBINED SWISS CORPORATE PRECISION & COBALT APP       */}
        {/* ============================================================ */}
        {activeTab === 'swiss' && (
          <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center lg:items-start justify-center gap-8">
            {/* Left Context Explainer for the Combined Design */}
            <div className="max-w-md space-y-4 text-left hidden lg:block pt-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1E3A8A]/10 dark:bg-[#2563EB]/20 text-[#1E3A8A] dark:text-[#93C5FD] font-mono font-bold text-xs border border-[#1E3A8A]/20">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Unified Swiss & Cobalt Architecture</span>
              </div>
              <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                Interactive Swiss Corporate Precision
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                We have merged the exact architectural aesthetics of the <strong>Swiss Corporate Precision & Cobalt</strong> concept into the full interactive prototype:
              </p>
              
              <div className="space-y-2.5 pt-1">
                <div className="p-3 bg-white dark:bg-[#0D1527] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
                  <span className="font-bold text-xs text-[#1D4ED8] dark:text-[#60A5FA] block">Pristine Alabaster & Deep Cobalt Blue</span>
                  <p className="text-[11px] text-slate-500 mt-0.5">High-contrast geometric layout with hairline dividers and enterprise color pairing.</p>
                </div>
                <div className="p-3 bg-white dark:bg-[#0D1527] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
                  <span className="font-bold text-xs text-amber-600 dark:text-amber-400 block">Seamless Interactive Features Preserved</span>
                  <p className="text-[11px] text-slate-500 mt-0.5">Popular services carousel, AI Lens hardware diagnostics, 5-endpoint bottom bar, and SOS dispatch are 100% operational.</p>
                </div>
                <div className="p-3 bg-white dark:bg-[#0D1527] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
                  <span className="font-bold text-xs text-emerald-600 dark:text-emerald-400 block">Safe Instant Backup Available</span>
                  <p className="text-[11px] text-slate-500 mt-0.5">You can switch back to the previous version anytime via the "Original Clean Backup" tab above.</p>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  onClick={() => setActiveTab('backup')}
                  className="text-xs font-bold text-[#1D4ED8] dark:text-[#60A5FA] hover:underline flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Compare with Previous Clean Backup
                </button>
              </div>
            </div>

            {/* Render Swiss Corporate Interactive Application */}
            <div className="flex justify-center w-full lg:w-auto">
              <SwissCorporateApp
                isDarkMode={isDarkMode}
                language={language}
                selectedLocation={selectedLocation}
                onBookService={handleBookService}
                onOpenSOS={handleOpenSOS}
              />
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 2: PREVIOUS INTERACTIVE APP BACKUP                       */}
        {/* ============================================================ */}
        {activeTab === 'backup' && (
          <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center lg:items-start justify-center gap-8">
            <div className="max-w-md space-y-4 text-left hidden lg:block pt-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono font-bold text-xs">
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Original State Preserved</span>
              </div>
              <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                Original Clean Edition Backup
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                This is your exact previous version kept intact as requested. You can test and compare both versions side-by-side.
              </p>
              
              <button
                onClick={() => setActiveTab('swiss')}
                className="bg-[#1E3A8A] hover:bg-[#1D4ED8] text-white text-xs font-bold px-4 py-2 rounded-xl shadow-md transition-colors"
              >
                Switch to Combined Swiss Edition
              </button>
            </div>

            <div className="flex justify-center w-full lg:w-auto">
              <ClassicAppBackup
                isDarkMode={isDarkMode}
                language={language}
                selectedLocation={selectedLocation}
                onBookService={handleBookService}
                onOpenSOS={handleOpenSOS}
              />
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 3: FORMAL CONCEPTS GALLERY                               */}
        {/* ============================================================ */}
        {activeTab === 'concepts' && (
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="text-center max-w-3xl mx-auto">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#1E3A8A] dark:text-[#60A5FA] bg-blue-100 dark:bg-blue-950/70 px-3 py-1 rounded-full border border-blue-200 dark:border-blue-800">
                Executive AI Design Suite
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-2 text-slate-900 dark:text-white">
                Formal, Premium & Executive Design Concepts
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                Tailored for high institutional trust, formal craftsmanship, executive color palettes, and professional home services.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {FORMAL_CONCEPTS.map((concept) => (
                <div
                  key={concept.id}
                  id={`concept-card-${concept.id}`}
                  className="bg-white dark:bg-[#0D1527] border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xl flex flex-col justify-between group hover:border-blue-500/50 transition-all"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                        {concept.badge}
                      </span>
                      <span className="text-xs font-mono text-slate-500">Formal UI</span>
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">{concept.title}</h3>
                    <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 mt-0.5">
                      {concept.archetype}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                      {concept.tagline}
                    </p>

                    {/* Image Preview */}
                    <div
                      onClick={() => setActiveConceptModal(concept)}
                      className="mt-4 aspect-[9/16] rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 relative cursor-pointer group/img shadow-md bg-slate-950 max-h-[480px]"
                    >
                      <img
                        src={concept.image}
                        alt={concept.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover/img:scale-103 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="bg-white/95 dark:bg-slate-900/95 text-slate-900 dark:text-white px-4 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-xl">
                          <Maximize2 className="w-4 h-4 text-blue-500" />
                          Inspect Fullscreen
                        </div>
                      </div>
                    </div>

                    {/* Key Highlights */}
                    <div className="mt-4 space-y-1.5">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        Key Architectural Highlights:
                      </span>
                      {concept.highlights.map((h, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 flex-shrink-0" />
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
                      <strong className="text-slate-900 dark:text-white font-semibold">Best suited for:</strong> {concept.bestFor}
                    </div>
                  </div>

                  <div className="p-5 bg-slate-50 dark:bg-[#070D1C] border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <button
                      onClick={() => setActiveConceptModal(concept)}
                      className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1 hover:underline"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                      Open High-Res Preview
                    </button>
                    <button
                      onClick={() => setActiveTab('swiss')}
                      className="bg-[#1E3A8A] hover:bg-[#1D4ED8] text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-xs transition-colors"
                    >
                      Test Combined Prototype
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* ============================================================ */}
      {/* EMERGENCY SOS MODAL                                          */}
      {/* ============================================================ */}
      {emergencyModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0B152E] text-white border-2 border-rose-500/50 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
                  <Shield className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-rose-400 uppercase tracking-wide">
                    Swiss Priority SOS Dispatch
                  </h3>
                  <span className="text-[10px] text-slate-400 font-mono">CODE-RED RESPONSE</span>
                </div>
              </div>
              <button onClick={() => setEmergencyModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Immediate dispatch for electrical hazards, breaker fires, main pipe bursts, or backup generator failures across Addis Ababa.
            </p>

            <div className="bg-[#060C1B] p-3.5 rounded-2xl border border-blue-900/60 text-xs space-y-1.5">
              <div className="flex justify-between text-slate-400">
                <span>Average Response ETA:</span>
                <span className="text-amber-400 font-bold font-mono">11 - 14 Mins</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Emergency Surcharge:</span>
                <span className="text-emerald-400 font-bold">0 ETB (Swiss Corporate Guarantee)</span>
              </div>
            </div>

            <button
              onClick={() => {
                setEmergencyModalOpen(false);
                handleBookService('Emergency Master Electrician & Plumber SOS');
              }}
              className="w-full bg-rose-600 hover:bg-rose-700 text-white font-black py-3.5 rounded-2xl text-xs shadow-lg flex items-center justify-center gap-2 transition-colors"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Confirm Instant Master Tech Dispatch</span>
            </button>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* FULLSCREEN CONCEPT MODAL                                     */}
      {/* ============================================================ */}
      {activeConceptModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6">
          <div className="max-w-4xl w-full max-h-[92vh] bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden flex flex-col shadow-2xl">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between text-white">
              <div>
                <h3 className="font-extrabold text-base">{activeConceptModal.title}</h3>
                <span className="text-xs text-amber-400 font-medium">{activeConceptModal.archetype}</span>
              </div>
              <button
                onClick={() => setActiveConceptModal(null)}
                className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 flex justify-center bg-black/40">
              <img
                src={activeConceptModal.image}
                alt={activeConceptModal.title}
                referrerPolicy="no-referrer"
                className="max-h-[75vh] w-auto object-contain rounded-2xl border border-slate-800 shadow-2xl"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
