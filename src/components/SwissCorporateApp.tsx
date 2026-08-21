import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Shield,
  Zap,
  Star,
  Clock,
  ChevronRight,
  Sun,
  Moon,
  Globe,
  Bell,
  Home,
  User,
  CheckCircle2,
  Wrench,
  Flame,
  Tv,
  Droplets,
  Paintbrush,
  Sparkles,
  Layers,
  Maximize2,
  Plus,
  MapPin,
  X,
  Gift,
  Check,
  Award,
  Grid,
  PhoneCall,
  Navigation,
  CheckCircle,
  ArrowRight,
  Cpu,
  Building2,
  ChevronLeft
} from 'lucide-react';
import { ServiceItem, SERVICES, CATEGORIES, PRESET_AI_DIAGNOSES } from './ClassicAppBackup';

interface SwissCorporateAppProps {
  isDarkMode: boolean;
  language: 'en' | 'am';
  selectedLocation: string;
  onBookService: (name: string) => void;
  onOpenSOS: () => void;
}

export function SwissCorporateApp({
  isDarkMode,
  language,
  selectedLocation,
  onBookService,
  onOpenSOS,
}: SwissCorporateAppProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [activeNav, setActiveNav] = useState<'home' | 'services' | 'ai' | 'activity' | 'profile'>('home');
  const [aiCustomInput, setAiCustomInput] = useState<string>('');
  const [activeAiDiagnosis, setActiveAiDiagnosis] = useState<typeof PRESET_AI_DIAGNOSES[0] | null>(PRESET_AI_DIAGNOSES[0]);
  const [isAiDiagnosing, setIsAiDiagnosing] = useState<boolean>(false);
  const [heroSlideIndex, setHeroSlideIndex] = useState<number>(0);
  const [isHoveredHero, setIsHoveredHero] = useState<boolean>(false);
  const [popularIndex, setPopularIndex] = useState<number>(0);
  const popularContainerRef = useRef<HTMLDivElement>(null);
  const [isHoveredPopular, setIsHoveredPopular] = useState<boolean>(false);

  const INSPIRATION_SLIDES = [
    {
      id: 'slogan-1',
      tag: language === 'en' ? 'PEACE OF MIND' : 'የአእምሮ እፎይታ',
      title: language === 'en' ? 'Quality Fixes. Happy Homes.' : 'ትክክለኛ ጥገና • አስተማማኝ እፎይታ',
      subtitle: language === 'en' ? 'Addis Ababa’s trusted technicians at your doorstep in minutes.' : 'የአዲስ አበባ ምርጥ እና ታማኝ የቴክኒክ ባለሙያዎች በደቂቃዎች ውስጥ ከእርስዎ ዘንድ።',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=80',
      badge: language === 'en' ? '100% Insured' : '100% ዋስትና ያለው',
      actionType: 'services'
    },
    {
      id: 'slogan-2',
      tag: language === 'en' ? '24/7 DISPATCH' : 'የ24/7 አስቸኳይ ጥሪ',
      title: language === 'en' ? 'Emergency SOS in ~11 Mins' : 'የአስቸኳይ ጥሪ በ ~11 ደቂቃ',
      subtitle: language === 'en' ? 'Fast technician response for electrical, plumbing & leaks.' : 'የኤሌክትሪክ፣ የቧንቧ እና የፍሳሽ አስቸኳይ ብልሽቶችን በቅጽበት ይፍቱ።',
      image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&auto=format&fit=crop&q=80',
      badge: language === 'en' ? 'Priority SOS' : 'አስቸኳይ ጥሪ',
      actionType: 'sos'
    },
    {
      id: 'slogan-3',
      tag: language === 'en' ? 'FAIR RATES' : 'ግልጽና ተመጣጣኝ',
      title: language === 'en' ? 'Clear ETB Rates. Zero Surprises.' : 'ግልጽ የዋጋ ተመን • ጽኑ እምነት',
      subtitle: language === 'en' ? 'Fixed rates with genuine spare parts and master-level inspection.' : 'የተረጋገጡ እውነተኛ መለዋወጫዎች እና ግልጽ የኢትዮጵያ ብር ተመን።',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&auto=format&fit=crop&q=80',
      badge: language === 'en' ? 'Fixed Rates' : 'ግልጽ ተመን',
      actionType: 'services'
    },
    {
      id: 'slogan-4',
      tag: language === 'en' ? 'EXPERT TEAM' : 'ጥራትን ማሳደግ',
      title: language === 'en' ? 'Certified Local Technicians' : 'የሀገር በቀል ባለሙያዎችን ጥራት ማሳደግ',
      subtitle: language === 'en' ? 'Vetted technicians, AI diagnostics & guaranteed satisfaction.' : 'ዘመናዊ የዲጂታል ምርመራ እና የደንበኞች ሙሉ እርካታ ቀዳሚ ግባችን ነው።',
      image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&auto=format&fit=crop&q=80',
      badge: language === 'en' ? 'Verified Techs' : 'የተረጋገጡ ባለሙያዎች',
      actionType: 'ai'
    }
  ];

  // Auto-slide inspirational hero carousel every 4.5 seconds
  useEffect(() => {
    if (isHoveredHero) return;
    const timer = setInterval(() => {
      setHeroSlideIndex((prev) => (prev + 1) % INSPIRATION_SLIDES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [isHoveredHero, INSPIRATION_SLIDES.length]);

  const filteredServices = SERVICES.filter((s) => {
    const matchesCat = selectedCategory === 'all' || s.category === selectedCategory;
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.nameAm && s.nameAm.includes(searchQuery)) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const popularServices = SERVICES.filter((s) => s.isPopular);

  // Auto-flowing popular services carousel every 3.2 seconds
  useEffect(() => {
    if (popularServices.length <= 1 || isHoveredPopular) return;
    const interval = setInterval(() => {
      setPopularIndex((prev) => {
        const nextIndex = (prev + 1) % popularServices.length;
        if (popularContainerRef.current) {
          const cardWidth = 160; // compact width
          popularContainerRef.current.scrollTo({
            left: nextIndex * cardWidth,
            behavior: 'smooth'
          });
        }
        return nextIndex;
      });
    }, 3200);

    return () => clearInterval(interval);
  }, [popularServices.length, isHoveredPopular]);

  const handleRunAiDiagnosis = () => {
    setIsAiDiagnosing(true);
    const query = aiCustomInput || PRESET_AI_DIAGNOSES[0].issue;
    setTimeout(() => {
      const match = PRESET_AI_DIAGNOSES.find(d => query.toLowerCase().includes(d.issue.toLowerCase().slice(0, 10))) || {
        issue: query,
        category: 'AI Diagnostics',
        diagnosis: `Analysis indicates wear on circuit components for "${query}". Professional inspection recommended.`,
        severity: 'Standard Issue',
        estCost: '350 - 500 ETB',
        partsNeeded: ['Replacement Fuse', 'Connector Block'],
        recommendedTech: 'Dawit Abebe (4.9 ⭐ • Certified Master Electrician)',
        eta: '11 mins arrival'
      };
      setActiveAiDiagnosis(match);
      setIsAiDiagnosing(false);
    }, 700);
  };

  const t = {
    searchPlaceholder: language === 'en' ? 'Search services (e.g. TV, plumbing)...' : 'አገልግሎቶችን ይፈልጉ (ቲቪ፣ ቧንቧ...)...',
    emergencyTitle: language === 'en' ? '24/7 EMERGENCY DISPATCH' : 'አስቸኳይ የ24/7 ጥሪ',
    emergencySub: language === 'en' ? 'Fast certified technician response • Live GPS ~11 mins' : 'ቅድሚያ የሚሰጠው የባለሙያ ጥሪ • ~11 ደቂቃ',
    popularTitle: language === 'en' ? 'Popular Services' : 'ተወዳጅ አገልግሎቶች',
    allTitle: language === 'en' ? 'All Services' : 'ሁሉም አገልግሎቶች',
    currency: 'ETB',
    startingFrom: language === 'en' ? 'Starting from' : 'መነሻ ዋጋ',
    bookNow: language === 'en' ? 'Book now' : 'ይዘዙ',
  };

  return (
    <div className="w-full max-w-md bg-[#FBFBFE] dark:bg-[#070B14] border-2 border-[#1E3A8A]/30 dark:border-[#2563EB]/40 rounded-[40px] shadow-[0_25px_60px_-15px_rgba(15,35,80,0.3)] dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col min-h-[860px] relative transition-colors duration-300">
      {/* Swiss Modernist Top Executive Bar */}
      <div className="bg-[#0F1E3D] dark:bg-[#060D1F] text-white px-5 py-2 flex items-center justify-between border-b border-blue-900/60 text-[11px] tracking-wide">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
          <span className="font-mono uppercase font-bold text-[10px] text-blue-200">
            SWISS PRECISION SYSTEM • ADDIS ABABA
          </span>
        </div>
        <span className="font-mono text-[10px] text-amber-400 font-bold bg-blue-950/90 px-2 py-0.5 rounded border border-blue-800/80">
          ONLINE DISPATCH
        </span>
      </div>

      {/* Modernist Mobile Status Bar */}
      <div className="px-6 pt-2.5 pb-1 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-mono">
        <span className="font-bold text-[13px] text-slate-900 dark:text-slate-100 tracking-tight">09:41</span>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold tracking-widest text-[#1D4ED8] dark:text-[#60A5FA]">COBALT-5G</span>
          <div className="w-5 h-2.5 border border-slate-700 dark:border-slate-300 rounded-2xs p-0.5 flex items-center">
            <div className="w-3.5 h-full bg-[#1D4ED8] dark:bg-[#60A5FA] rounded-3xs" />
          </div>
        </div>
      </div>

      {/* Swiss Corporate Header */}
      <div className="px-5 pt-2 pb-3.5 flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800/90 bg-white/70 dark:bg-[#0A1020]/70 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1E3A8A] via-[#1D4ED8] to-[#0284C7] p-0.5 shadow-md flex items-center justify-center text-white">
            <div className="w-full h-full bg-[#0B152E] rounded-[10px] flex items-center justify-center">
              <Building2 className="w-5 h-5 text-amber-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-[15px] tracking-tight text-[#0F1E3D] dark:text-white">
                SMART<span className="text-[#2563EB] dark:text-[#60A5FA]">FIX</span>
              </span>
              <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-800 dark:text-amber-300 border border-amber-400/40">
                PRO
              </span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
              <MapPin className="w-3 h-3 text-[#2563EB]" />
              <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedLocation}</span>
            </div>
          </div>
        </div>

        {/* Header Right Action */}
        <div className="flex items-center gap-2">
          <div className="relative p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 shadow-xs">
            <Bell className="w-4 h-4" />
            <span className="w-2 h-2 rounded-full bg-[#2563EB] absolute top-1.5 right-1.5" />
          </div>
        </div>
      </div>

      {/* Main Interactive Screen Content based on activeNav */}
      <div className="flex-1 overflow-y-auto px-4 py-3.5 space-y-4 pb-24">
        {/* ======================================================== */}
        {/* VIEW 1: HOME VIEW (Swiss Precision Layout)              */}
        {/* ======================================================== */}
        {activeNav === 'home' && (
          <>
            {/* 1. ARCHITECTURAL SEARCH BAR WITH AI INTEGRATION */}
            <div className="relative group">
              <Search className="w-4 h-4 text-[#1E3A8A] dark:text-[#60A5FA] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={t.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white dark:bg-[#0E172C] border-2 border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-24 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#2563EB] dark:focus:border-[#3B82F6] shadow-sm transition-all"
              />
              <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <button
                  onClick={() => setActiveNav('ai')}
                  className="bg-[#0F1E3D] hover:bg-[#1E3A8A] text-white px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 shadow-xs border border-blue-700/50"
                  title="Open Swiss AI Diagnostics"
                >
                  <Cpu className="w-3 h-3 text-amber-400" />
                  <span>AI Lens</span>
                </button>
              </div>
            </div>

            {/* 2. DYNAMIC INSPIRATIONAL SLOGAN & MOTIVATION HERO CAROUSEL + COMPACT SOS */}
            <div
              className="relative rounded-2xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-800 group"
              onMouseEnter={() => setIsHoveredHero(true)}
              onMouseLeave={() => setIsHoveredHero(false)}
            >
              {/* Active Hero Slide Container */}
              <div className="relative h-44 w-full bg-slate-950 overflow-hidden">
                {INSPIRATION_SLIDES.map((slide, idx) => (
                  <div
                    key={slide.id}
                    className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                      heroSlideIndex === idx ? 'opacity-100 z-10 scale-100' : 'opacity-0 z-0 scale-105 pointer-events-none'
                    }`}
                  >
                    {/* Background Satisfied Customer / Master Technician Image */}
                    <img
                      src={slide.image}
                      alt={slide.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-1000 ease-out brightness-105"
                    />

                    {/* Gradient Overlay for Pristine Readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />

                    {/* Top Slide Meta: Slogan Tag & Insured Badge */}
                    <div className="absolute top-3 inset-x-3 flex items-center justify-between z-20">
                      <span className="font-mono text-[9px] font-black uppercase px-2 py-0.5 rounded-md bg-[#1E3A8A]/90 text-amber-300 border border-blue-400/40 shadow-xs">
                        {slide.tag}
                      </span>
                      <span className="font-mono text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 backdrop-blur-md">
                        {slide.badge}
                      </span>
                    </div>

                    {/* Bottom Content: Slogan, Motivation, Objective & Action */}
                    <div className="absolute bottom-3 inset-x-3.5 z-20">
                      <h3 className="text-sm sm:text-[15px] font-black text-white leading-tight tracking-tight drop-shadow-md">
                        {slide.title}
                      </h3>
                      <p className="text-[10px] text-slate-200/90 font-medium line-clamp-2 mt-1 leading-snug drop-shadow-xs">
                        {slide.subtitle}
                      </p>

                      <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-white/15">
                        {/* Compact 1-Tap Trigger based on slide type */}
                        {slide.actionType === 'sos' ? (
                          <button
                            id="swiss-hero-sos-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              onOpenSOS();
                            }}
                            className="bg-red-600 hover:bg-red-500 active:scale-95 text-white text-[10px] font-black px-3 py-1 rounded-lg shadow-md flex items-center gap-1.5 transition-all"
                          >
                            <Shield className="w-3.5 h-3.5 animate-pulse text-amber-300" />
                            <span>1-Tap 24/7 SOS (~11m ETA)</span>
                          </button>
                        ) : slide.actionType === 'ai' ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveNav('ai');
                            }}
                            className="bg-[#2563EB] hover:bg-[#1D4ED8] active:scale-95 text-white text-[10px] font-black px-3 py-1 rounded-lg shadow-md flex items-center gap-1.5 transition-all"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                            <span>AI Diagnostics</span>
                          </button>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveNav('services');
                            }}
                            className="bg-amber-400 hover:bg-amber-300 active:scale-95 text-slate-950 text-[10px] font-black px-3 py-1 rounded-lg shadow-md flex items-center gap-1 transition-all"
                          >
                            <span>Explore Certified Fixes</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        )}

                        {/* Slide Pagination Dots & Next/Prev Controls */}
                        <div className="flex items-center gap-1.5 bg-black/50 backdrop-blur-md px-2 py-1 rounded-full border border-white/10">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setHeroSlideIndex((prev) => (prev === 0 ? INSPIRATION_SLIDES.length - 1 : prev - 1));
                            }}
                            className="text-slate-300 hover:text-white transition-colors"
                            title="Previous Slide"
                          >
                            <ChevronLeft className="w-3 h-3" />
                          </button>
                          <div className="flex gap-1">
                            {INSPIRATION_SLIDES.map((_, dotIdx) => (
                              <button
                                key={dotIdx}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setHeroSlideIndex(dotIdx);
                                }}
                                className={`h-1.5 rounded-full transition-all duration-300 ${
                                  heroSlideIndex === dotIdx ? 'w-4 bg-amber-400' : 'w-1.5 bg-white/40'
                                }`}
                              />
                            ))}
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setHeroSlideIndex((prev) => (prev + 1) % INSPIRATION_SLIDES.length);
                            }}
                            className="text-slate-300 hover:text-white transition-colors"
                            title="Next Slide"
                          >
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Sleek Compact 24/7 SOS Dispatch Bar directly anchored */}
              <div
                onClick={onOpenSOS}
                className="bg-gradient-to-r from-[#0B152E] via-[#0F224A] to-[#1E3A8A] px-3.5 py-2 flex items-center justify-between cursor-pointer border-t border-blue-800/50 hover:bg-[#1E3A8A] transition-colors"
              >
                <div className="flex items-center gap-2 text-white">
                  <div className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                  <span className="text-[10px] font-extrabold tracking-wide uppercase">
                    24/7 Emergency Dispatch
                  </span>
                  <span className="text-[9px] text-blue-200 font-mono hidden sm:inline">• Live Master Response</span>
                </div>
                <div className="flex items-center gap-1 text-amber-300 text-[10px] font-black">
                  <span>Call SOS ~11m</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>

            {/* 3. COMPACT AUTO-SWIPING POPULAR SERVICES CAROUSEL */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 rounded bg-[#1E3A8A]/10 dark:bg-[#2563EB]/20 flex items-center justify-center text-[#1E3A8A] dark:text-[#60A5FA]">
                    <Flame className="w-3 h-3 text-amber-500" />
                  </div>
                  <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                    {t.popularTitle}
                  </h3>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                  <span className="text-[9px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">Auto-rotating</span>
                  <div className="flex gap-1">
                    {popularServices.map((_, idx) => (
                      <span
                        key={idx}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          popularIndex === idx ? 'w-3.5 bg-[#2563EB]' : 'w-1.5 bg-slate-300 dark:bg-slate-700'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Compact Auto-flow Slider Container */}
              <div
                ref={popularContainerRef}
                onMouseEnter={() => setIsHoveredPopular(true)}
                onMouseLeave={() => setIsHoveredPopular(false)}
                onTouchStart={() => setIsHoveredPopular(true)}
                onTouchEnd={() => setTimeout(() => setIsHoveredPopular(false), 2000)}
                className="flex gap-2.5 overflow-x-auto pb-1.5 -mx-1 px-1 scrollbar-none snap-x scroll-smooth"
              >
                {popularServices.map((service, idx) => (
                  <div
                    key={service.id}
                    id={`swiss-popular-compact-${service.id}`}
                    onClick={() => setSelectedService(service)}
                    className={`snap-start w-[145px] flex-shrink-0 relative rounded-lg overflow-hidden shadow-sm hover:shadow-md cursor-pointer transition-all duration-300 border ${
                      popularIndex === idx
                        ? 'border-[#2563EB] ring-1 ring-[#2563EB]/40'
                        : 'border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    {/* Compact Image with Gradient Overlay */}
                    <div className="h-24 w-full relative overflow-hidden bg-slate-900">
                      <img
                        src={service.image}
                        alt={service.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 brightness-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

                      {/* Top rating badge */}
                      <div className="absolute top-1.5 left-1.5 bg-black/60 backdrop-blur-md px-1.5 py-0.2 rounded text-[8px] font-bold text-amber-300 flex items-center gap-0.5">
                        <Star className="w-2 h-2 fill-amber-300 text-amber-300" />
                        <span>{service.rating}</span>
                      </div>

                      {/* Bottom Info Overlay directly on photo */}
                      <div className="absolute bottom-1.5 inset-x-2 flex items-end justify-between gap-1">
                        <div className="text-white min-w-0 pr-1">
                          <h4 className="text-[10px] font-bold leading-tight truncate drop-shadow-xs">
                            {language === 'am' && service.nameAm ? service.nameAm : service.name}
                          </h4>
                          {/* Price and currency in ONE single clean line */}
                          <span className="text-[10px] font-black text-amber-300 font-mono block leading-tight drop-shadow-xs">
                            {service.price} {t.currency}
                          </span>
                        </div>
                        {/* Circular sign button (+) */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onBookService(service.name);
                          }}
                          className="w-5 h-5 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 flex items-center justify-center shadow-xs flex-shrink-0 active:scale-90 transition-transform"
                          title="Select Service"
                        >
                          <Plus className="w-3 h-3 stroke-[3]" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. SWISS ARCHITECTURAL CATEGORIES */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                  {language === 'am' ? 'ምድቦች' : 'Categories'}
                </h3>
                {selectedCategory !== 'all' && (
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className="text-[10px] font-bold text-[#2563EB] hover:underline"
                  >
                    Reset Filter
                  </button>
                )}
              </div>

              <div className="flex gap-3 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-none snap-x">
                {CATEGORIES.map((cat) => {
                  const isSelected = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      id={`swiss-cat-${cat.id}`}
                      onClick={() => setSelectedCategory(cat.id)}
                      className="snap-start flex flex-col items-center gap-1.5 flex-shrink-0 group focus:outline-none"
                    >
                      <div
                        className={`w-14 h-14 rounded-2xl p-0.5 transition-all relative ${
                          isSelected
                            ? 'ring-2 ring-[#2563EB] dark:ring-[#60A5FA] bg-[#1E3A8A]'
                            : 'border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0E172C] group-hover:border-blue-400'
                        }`}
                      >
                        <div className="w-full h-full rounded-[14px] overflow-hidden relative bg-slate-100 dark:bg-slate-800">
                          <img
                            src={cat.img}
                            alt={cat.label}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-200"
                          />
                          {isSelected && (
                            <div className="absolute inset-0 bg-[#1E3A8A]/70 backdrop-blur-2xs flex items-center justify-center">
                              <Check className="w-4 h-4 text-white font-black" />
                            </div>
                          )}
                        </div>
                      </div>
                      <span
                        className={`text-[10px] font-bold truncate max-w-[65px] ${
                          isSelected
                            ? 'text-[#1D4ED8] dark:text-[#60A5FA]'
                            : 'text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        {language === 'am' ? cat.labelAm : cat.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 5. ALL SERVICES DIRECTORY (Full-Bleed Photo Cards with Single-Line Price & Plus Sign) */}
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                  {t.allTitle} ({filteredServices.length})
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                  Addis Ababa Certified
                </span>
              </div>

              {/* Seamless Full-Bleed Photo Card Grid */}
              <div className="grid grid-cols-2 gap-2.5">
                {filteredServices.map((service) => (
                  <div
                    key={service.id}
                    id={`swiss-service-${service.id}`}
                    onClick={() => setSelectedService(service)}
                    className="group relative h-38 rounded-lg overflow-hidden shadow-sm hover:shadow-xl border border-slate-200/80 dark:border-slate-800/80 cursor-pointer transition-all duration-300 hover:scale-[1.02] bg-slate-950"
                  >
                    {/* Background Service Photo */}
                    <img
                      src={service.image}
                      alt={service.name}
                      referrerPolicy="no-referrer"
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-105"
                    />

                    {/* Rich Gradient Overlay for High-Contrast Typography */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/10 group-hover:from-black/85 transition-colors" />

                    {/* Top Content: Service Title in Clean Bold Typography & Star Rating */}
                    <div className="absolute top-2.5 inset-x-2.5 z-10">
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="text-[13px] font-black text-white leading-tight tracking-tight drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] line-clamp-2">
                          {language === 'am' && service.nameAm ? service.nameAm : service.name}
                        </h4>
                        <div className="bg-black/60 backdrop-blur-md px-1.5 py-0.5 rounded text-[9px] font-bold text-amber-300 flex items-center gap-0.5 flex-shrink-0 border border-white/10">
                          <Star className="w-2.5 h-2.5 fill-amber-300 text-amber-300" />
                          <span>{service.rating}</span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Content: Single-Line Price + Circular Sign (+) Action Button */}
                    <div className="absolute bottom-2.5 inset-x-2.5 z-10 flex items-center justify-between gap-1.5">
                      <div className="text-white">
                        {/* Price and currency cleanly in ONE single horizontal line */}
                        <span className="text-[12px] font-black text-white tracking-tight drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                          {service.price} <span className="text-amber-400 text-[10px] font-bold">{t.currency}</span>
                        </span>
                      </div>

                      {/* Circular Golden Sign (+) Button */}
                      <button
                        id={`swiss-book-btn-${service.id}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          onBookService(service.name);
                        }}
                        className="w-7 h-7 rounded-full bg-amber-400 hover:bg-amber-300 active:scale-90 text-slate-950 flex items-center justify-center shadow-md transition-all flex-shrink-0"
                        title="Book Service"
                      >
                        <Plus className="w-4 h-4 stroke-[3]" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ======================================================== */}
        {/* VIEW 2: SERVICES EXPLORER                                */}
        {/* ======================================================== */}
        {activeNav === 'services' && (
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-[#0F1E3D] to-[#1E3A8A] rounded-xl p-4 text-white border border-blue-700/40">
              <span className="text-[10px] font-mono uppercase text-amber-400 font-bold block">Our Services</span>
              <h3 className="font-black text-sm mt-0.5">Home & Office Repair Services</h3>
              <p className="text-xs text-blue-100 mt-1">Guaranteed quality, vetted technicians, and transparent ETB pricing.</p>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {SERVICES.map((s) => (
                <div
                  key={s.id}
                  onClick={() => setSelectedService(s)}
                  className="group relative h-38 rounded-lg overflow-hidden shadow-sm hover:shadow-xl border border-slate-200/80 dark:border-slate-800/80 cursor-pointer transition-all duration-300 bg-slate-950"
                >
                  <img
                    src={s.image}
                    alt={s.name}
                    referrerPolicy="no-referrer"
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/10" />

                  <div className="absolute top-2.5 inset-x-2.5 z-10">
                    <h4 className="text-[13px] font-black text-white leading-tight drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] line-clamp-2">
                      {s.name}
                    </h4>
                  </div>

                  <div className="absolute bottom-2.5 inset-x-2.5 z-10 flex items-center justify-between">
                    <span className="text-[12px] font-black text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                      {s.price} <span className="text-amber-400 text-[10px]">{t.currency}</span>
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onBookService(s.name);
                      }}
                      className="w-7 h-7 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 flex items-center justify-center shadow-md active:scale-90 transition-transform"
                    >
                      <Plus className="w-4 h-4 stroke-[3]" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* VIEW 3: AI DIAGNOSTIC CONCIERGE                          */}
        {/* ======================================================== */}
        {activeNav === 'ai' && (
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-[#0A1628] via-[#0F2347] to-[#1E3A8A] text-white rounded-2xl p-4 border border-blue-500/40 shadow-md">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-amber-300">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm tracking-tight">SmartFix AI Diagnostic</h3>
                  <p className="text-[10px] text-blue-200">Fast root cause & spare parts estimator</p>
                </div>
              </div>

              <div className="mt-3.5 relative">
                <input
                  type="text"
                  placeholder="e.g. Water heater trips breaker or low water pressure..."
                  value={aiCustomInput}
                  onChange={(e) => setAiCustomInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleRunAiDiagnosis()}
                  className="w-full bg-[#080E1B] border border-blue-500/40 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <button
                  onClick={handleRunAiDiagnosis}
                  disabled={isAiDiagnosing}
                  className="absolute right-1.5 top-1.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-3 py-1.5 rounded-lg text-[10px] font-black flex items-center gap-1 shadow-sm transition-colors"
                >
                  {isAiDiagnosing ? 'Analyzing...' : 'Diagnose'}
                </button>
              </div>
            </div>

            {/* AI Diagnosis Result Card */}
            {activeAiDiagnosis && (
              <div className="bg-white dark:bg-[#0D1527] border-2 border-blue-500/30 rounded-2xl p-4 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#1D4ED8] dark:text-[#60A5FA] font-mono">
                    DIAGNOSTIC REPORT #AI-902
                  </span>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800">
                    {activeAiDiagnosis.severity}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 font-bold block">ISSUE ANALYZED</span>
                  <p className="text-xs font-extrabold text-slate-900 dark:text-white">{activeAiDiagnosis.issue}</p>
                </div>

                <div className="bg-slate-50 dark:bg-[#080E1B] p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  {activeAiDiagnosis.diagnosis}
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div className="bg-blue-50 dark:bg-blue-950/40 p-2.5 rounded-xl border border-blue-200 dark:border-blue-900">
                    <span className="text-[9px] text-slate-500 dark:text-slate-400 font-bold block">ESTIMATED PARTS & LABOR</span>
                    <span className="text-xs font-black text-[#1D4ED8] dark:text-[#93C5FD]">{activeAiDiagnosis.estCost}</span>
                  </div>
                  <div className="bg-amber-50 dark:bg-amber-950/40 p-2.5 rounded-xl border border-amber-200 dark:border-amber-900">
                    <span className="text-[9px] text-slate-500 dark:text-slate-400 font-bold block">DISPATCH RESPONSE</span>
                    <span className="text-xs font-black text-amber-700 dark:text-amber-300">{activeAiDiagnosis.eta}</span>
                  </div>
                </div>

                <button
                  onClick={() => onBookService(activeAiDiagnosis.issue)}
                  className="w-full bg-gradient-to-r from-[#1E3A8A] to-[#2563EB] hover:from-[#1E3A8A] hover:to-[#1D4ED8] text-white font-bold py-3 rounded-xl text-xs shadow-md transition-colors flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Dispatch Technician</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* VIEW 4: ACTIVITY & DISPATCH TRACKER                     */}
        {/* ======================================================== */}
        {activeNav === 'activity' && (
          <div className="space-y-3.5">
            <div className="bg-white dark:bg-[#0D1527] border-2 border-emerald-500/40 rounded-2xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black uppercase text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/80 px-2.5 py-0.5 rounded-full font-mono">
                  LIVE DISPATCH • IN ROUTE
                </span>
                <span className="text-xs font-mono font-bold text-slate-400">#SF-8821</span>
              </div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">Emergency Breaker Panel Replacement</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Technician: Dawit Abebe (Master Certified Electrician)</p>
              
              <div className="mt-3 bg-slate-50 dark:bg-[#080E1B] p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-[#1D4ED8] dark:text-[#60A5FA] font-bold">
                  <Navigation className="w-4 h-4 animate-bounce" />
                  <span>Live GPS ETA: 8 minutes</span>
                </div>
                <span className="font-extrabold text-slate-900 dark:text-white">300 ETB</span>
              </div>
            </div>

            <div className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider px-1 pt-1">
              Service Records
            </div>

            <div className="bg-white dark:bg-[#0D1527] border border-slate-200 dark:border-slate-800 rounded-2xl p-3.5 shadow-xs">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-900 dark:text-white">Pipe Leak Fix & Copper Valve Install</span>
                <span className="text-emerald-600 font-bold text-[11px]">Completed & Inspected</span>
              </div>
              <span className="text-[10px] text-slate-500 block mt-0.5">Yesterday • Bole Medhanialem • 250 ETB</span>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* VIEW 5: USER PROFILE & ENTERPRISE PREFERENCES           */}
        {/* ======================================================== */}
        {activeNav === 'profile' && (
          <div className="space-y-3.5">
            <div className="bg-white dark:bg-[#0D1527] border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#1E3A8A] to-[#2563EB] text-white flex items-center justify-center text-sm font-extrabold shadow-sm">
                DA
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">Demeke D.</h4>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Bole, Addis Ababa • +251 91 123 4567</span>
                <span className="inline-block mt-1 text-[9px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded-md border border-amber-400/30">
                  ⭐ Enterprise Member (50 FixPoints)
                </span>
              </div>
            </div>

            <div className="bg-white dark:bg-[#0D1527] border border-slate-200 dark:border-slate-800 rounded-2xl divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              <div className="p-3 flex items-center justify-between">
                <span className="font-medium text-slate-800 dark:text-slate-200">Language (ቋንቋ)</span>
                <span className="text-[#1D4ED8] dark:text-[#60A5FA] font-bold">{language === 'en' ? 'English' : 'አማርኛ'}</span>
              </div>
              <div className="p-3 flex items-center justify-between">
                <span className="font-medium text-slate-800 dark:text-slate-200">Quality Guarantee</span>
                <span className="text-emerald-600 font-bold">100% Insured</span>
              </div>
              <div className="p-3 flex items-center justify-between">
                <span className="font-medium text-slate-800 dark:text-slate-200">24/7 Hotlines</span>
                <span className="text-[#1D4ED8] font-bold">8821 / +251 11 654 321</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* SWISS MODERNIST 5-ENDPOINT FLOATING BOTTOM BAR           */}
      {/* ======================================================== */}
      <div className="absolute bottom-0 inset-x-0 bg-white/95 dark:bg-[#070D1C]/95 backdrop-blur-md border-t-2 border-slate-200 dark:border-slate-800 px-3 py-2 flex items-center justify-around z-20">
        <button
          id="swiss-nav-home"
          onClick={() => setActiveNav('home')}
          className={`flex flex-col items-center gap-0.5 text-[9px] font-bold transition-colors ${
            activeNav === 'home' ? 'text-[#1D4ED8] dark:text-[#60A5FA] font-extrabold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Home className="w-4 h-4" />
          <span>Home</span>
        </button>

        <button
          id="swiss-nav-services"
          onClick={() => setActiveNav('services')}
          className={`flex flex-col items-center gap-0.5 text-[9px] font-bold transition-colors ${
            activeNav === 'services' ? 'text-[#1D4ED8] dark:text-[#60A5FA] font-extrabold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Grid className="w-4 h-4" />
          <span>Services</span>
        </button>

        {/* Center Prominent AI Lens Button */}
        <button
          id="swiss-nav-ai-center"
          onClick={() => setActiveNav('ai')}
          className={`w-11 h-11 -mt-5 rounded-2xl flex items-center justify-center shadow-xl border-2 border-white dark:border-[#070D1C] transition-transform hover:scale-105 ${
            activeNav === 'ai'
              ? 'bg-[#1D4ED8] text-white shadow-blue-600/50 ring-2 ring-amber-400'
              : 'bg-gradient-to-tr from-[#0F1E3D] via-[#1E3A8A] to-[#2563EB] text-white shadow-blue-900/40'
          }`}
          title="SmartFix AI Lens"
        >
          <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
        </button>

        <button
          id="swiss-nav-activity"
          onClick={() => setActiveNav('activity')}
          className={`flex flex-col items-center gap-0.5 text-[9px] font-bold transition-colors ${
            activeNav === 'activity' ? 'text-[#1D4ED8] dark:text-[#60A5FA] font-extrabold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Activity</span>
        </button>

        <button
          id="swiss-nav-profile"
          onClick={() => setActiveNav('profile')}
          className={`flex flex-col items-center gap-0.5 text-[9px] font-bold transition-colors ${
            activeNav === 'profile' ? 'text-[#1D4ED8] dark:text-[#60A5FA] font-extrabold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Profile</span>
        </button>
      </div>

      {/* Service Detail Drawer */}
      {selectedService && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="w-full max-w-sm bg-white dark:bg-[#0D1527] rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 animate-slide-up">
            <div className="relative h-44 w-full">
              <img
                src={selectedService.image}
                alt={selectedService.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setSelectedService(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="absolute bottom-3 left-3 bg-[#0F1E3D]/80 backdrop-blur-md px-2 py-0.5 rounded-lg text-xs font-bold text-amber-300 flex items-center gap-1 border border-white/20">
                <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                <span>{selectedService.rating} ({selectedService.reviewsCount} reviews)</span>
              </div>
            </div>

            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                  {selectedService.name}
                </h3>
                <span className="text-sm font-black text-[#1D4ED8] dark:text-[#93C5FD]">
                  {selectedService.price} {t.currency}
                </span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {selectedService.description}
              </p>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-50 dark:bg-[#080E1B] p-2 rounded-xl border border-slate-200 dark:border-slate-800">
                  <span className="text-[9px] text-slate-400 block font-bold">ESTIMATED TIME</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{selectedService.duration}</span>
                </div>
                <div className="bg-slate-50 dark:bg-[#080E1B] p-2 rounded-xl border border-slate-200 dark:border-slate-800">
                  <span className="text-[9px] text-slate-400 block font-bold">LOCATION</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 truncate block">{selectedLocation}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  onBookService(selectedService.name);
                  setSelectedService(null);
                }}
                className="w-full bg-gradient-to-r from-[#1E3A8A] to-[#2563EB] hover:from-[#1E3A8A] hover:to-[#1D4ED8] text-white font-bold py-2.5 rounded-xl text-xs shadow-md transition-colors"
              >
                Confirm Dispatch ({selectedService.price} ETB)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

