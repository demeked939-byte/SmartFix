import React, { useState } from 'react';
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
  Smartphone,
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
  SlidersHorizontal,
  Compass,
  ArrowRight
} from 'lucide-react';

// Import concepts
import conceptExecGoldImg from '../assets/images/smartfix_exec_gold_1787344999437.jpg';
import conceptSwissCorpImg from '../assets/images/smartfix_swiss_corp_1787345020379.jpg';
import conceptFormalAiImg from '../assets/images/smartfix_formal_ai_1787345037071.jpg';
import conceptFormalMonoImg from '../assets/images/smartfix_formal_mono_1787345051537.jpg';

export interface ServiceItem {
  id: string;
  name: string;
  nameAm?: string;
  category: string;
  price: number;
  rating: number;
  reviewsCount: number;
  ordersCount: string;
  duration: string;
  image: string;
  isPopular?: boolean;
  badge?: string;
  description: string;
}

export const CATEGORIES = [
  { id: 'all', label: 'All', labelAm: 'ሁሉም', icon: Layers, img: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=150&q=80' },
  { id: 'electrical', label: 'Electrical', labelAm: 'ኤሌክትሪክ', icon: Zap, img: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=150&q=80' },
  { id: 'appliances', label: 'Appliances', labelAm: 'የቤት እቃዎች', icon: Tv, img: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=150&q=80' },
  { id: 'plumbing', label: 'Plumbing', labelAm: 'ቧንቧ', icon: Droplets, img: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=150&q=80' },
  { id: 'improvement', label: 'Improvement', labelAm: 'ማሻሻያ', icon: Paintbrush, img: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=150&q=80' },
  { id: 'solar', label: 'Solar Power', labelAm: 'ሶላር', icon: Sun, img: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=150&q=80' },
  { id: 'cleaning', label: 'Cleaning', labelAm: 'ጽዳት', icon: Sparkles, img: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=150&q=80' },
];

export const SERVICES: ServiceItem[] = [
  {
    id: 'house-wiring',
    name: 'Electrical Wiring',
    nameAm: 'የኤሌክትሪክ መስመር ጥገና',
    category: 'electrical',
    price: 300,
    rating: 4.9,
    reviewsCount: 1420,
    ordersCount: '2.4k+ booked',
    duration: '1-2 hrs',
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80',
    isPopular: true,
    badge: 'Executive Verified',
    description: 'Certified electrical wiring, short-circuit diagnostics, main distribution panel servicing & load testing.',
  },
  {
    id: 'pipe-repair',
    name: 'Plumbing & Leaks',
    nameAm: 'የቧንቧ እና የፍሳሽ ጥገና',
    category: 'plumbing',
    price: 250,
    rating: 4.8,
    reviewsCount: 980,
    ordersCount: '1.8k+ booked',
    duration: '45 mins',
    image: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=600&q=80',
    isPopular: true,
    badge: 'Fast Arrival',
    description: 'High-pressure copper & PVC leak repair, sink traps, faucet replacements and drainage clearing.',
  },
  {
    id: 'tv-repair',
    name: 'TV Repair',
    nameAm: 'ቴሌቪዥን ጥገና',
    category: 'appliances',
    price: 400,
    rating: 4.9,
    reviewsCount: 860,
    ordersCount: '1.1k+ booked',
    duration: '1 hr',
    image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=600&q=80',
    isPopular: true,
    badge: 'Master Certified',
    description: 'OLED/LED panel troubleshooting, backlight repair, sound board fixes, and wall-mounting calibration.',
  },
  {
    id: 'generator-service',
    name: 'Generator Repair',
    nameAm: 'ጄኔሬተር ጥገና',
    category: 'electrical',
    price: 600,
    rating: 4.8,
    reviewsCount: 410,
    ordersCount: '480+ booked',
    duration: '1-3 hrs',
    image: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=600&q=80',
    isPopular: true,
    badge: 'Heavy Duty',
    description: 'Diesel & petrol standby generator maintenance, automatic transfer switch (ATS) diagnosis and oil change.',
  },
  {
    id: 'wall-painting',
    name: 'Wall Painting',
    nameAm: 'የቤት ውስጥ ቀለም ቅብ',
    category: 'improvement',
    price: 1500,
    rating: 4.7,
    reviewsCount: 640,
    ordersCount: '850+ booked',
    duration: 'Half Day',
    image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=600&q=80',
    badge: 'Premium Finish',
    description: 'Surface priming, crack patching, two-coat emulsion or satin luxury finish with dust-free masking.',
  },
  {
    id: 'socket-install',
    name: 'Sockets & Switches',
    nameAm: 'ሶኬት እና ማብሪያ ማጥፊያ',
    category: 'electrical',
    price: 200,
    rating: 4.8,
    reviewsCount: 520,
    ordersCount: '920+ booked',
    duration: '30 mins',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80',
    description: 'Modern surge-protected sockets, smart dimmers, and weatherproof outdoor power outlets installation.',
  },
  {
    id: 'water-pump',
    name: 'Water Pump Repair',
    nameAm: 'የውሃ ፓምፕ ጥገና',
    category: 'plumbing',
    price: 500,
    rating: 4.7,
    reviewsCount: 770,
    ordersCount: '1.3k+ booked',
    duration: '1.5 hrs',
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80',
    description: 'Booster pump installation, automatic float switch configuration, and high-rise pressure optimization.',
  },
  {
    id: 'washing-machine',
    name: 'Washing Machine',
    nameAm: 'ልብስ ማጠቢያ ማሽን ጥገና',
    category: 'appliances',
    price: 450,
    rating: 4.9,
    reviewsCount: 1100,
    ordersCount: '1.9k+ booked',
    duration: '1 hr',
    image: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=600&q=80',
    description: 'Drum bearing fixes, drainage pump replacement, spin cycle troubleshooting, and electronic motherboard fixes.',
  },
  {
    id: 'solar-panel',
    name: 'Solar System Repair',
    nameAm: 'ሶላር ሲስተም ጥገና',
    category: 'solar',
    price: 850,
    rating: 4.9,
    reviewsCount: 350,
    ordersCount: '520+ booked',
    duration: '2 hrs',
    image: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=600&q=80',
    description: 'Lithium battery bank balancing, hybrid solar inverter servicing, rooftop panel cleaning and efficiency test.',
  },
];

export const PRESET_AI_DIAGNOSES = [
  {
    issue: 'Water heater trips circuit breaker when turned on',
    category: 'Electrical & Plumbing',
    diagnosis: 'Short circuit in the heating element or calcified thermostat coil grounding to water tank.',
    severity: 'High (Fire / Electrical Hazard)',
    estCost: '400 - 650 ETB',
    partsNeeded: ['2000W Heating Element', 'Safety Thermostat Sensor'],
    recommendedTech: 'Dawit Abebe (4.9 ⭐ • Master Certified Electrician)',
    eta: '14 mins arrival',
  },
  {
    issue: 'Kitchen sink pipe dripping & low water pressure',
    category: 'Plumbing',
    diagnosis: 'P-trap joint seal degradation + aerator mineral blockage.',
    severity: 'Medium',
    estCost: '250 - 380 ETB',
    partsNeeded: ['Rubber O-ring Gasket Set', 'PVC 1.5" Connector'],
    recommendedTech: 'Kidus Tadesse (4.8 ⭐ • 620+ Plumb Jobs)',
    eta: '12 mins arrival',
  },
  {
    issue: 'Smart TV has sound but black screen',
    category: 'Appliances / TV',
    diagnosis: 'LED backlight strip burnout or inverter board capacitor failure.',
    severity: 'Standard Bench Repair',
    estCost: '500 - 850 ETB',
    partsNeeded: ['Replacement LED Array Strip', 'Power Regulation Fuse'],
    recommendedTech: 'Elias Worku (4.9 ⭐ • Electronics Specialist)',
    eta: '20 mins arrival',
  },
];

export const FORMAL_CONCEPTS = [
  {
    id: 'concept-exec-gold',
    title: 'Executive Midnight & Champagne Gold',
    archetype: 'Formal Luxury & Institutional Trust',
    image: conceptExecGoldImg,
    badge: 'EXECUTIVE PRO',
    tagline: 'Deep navy charcoal with brushed champagne gold & crisp high-contrast cards',
    highlights: [
      'Refined executive typography pairing with formal luxury gold certification seals',
      'Distinguished 24/7 priority emergency dispatch widget with gold accents',
      'Horizontal Popular Services slider with transparent pricing in ETB and arrival times',
      'Formal enterprise-grade navigation with discreet AI diagnostic concierge'
    ],
    bestFor: 'High-net-worth homeowners, estate managers, corporate properties, and VIP clients.'
  },
  {
    id: 'concept-swiss-corp',
    title: 'Swiss Corporate Precision & Cobalt',
    archetype: 'Modern Enterprise Reliability & Swiss Grid',
    image: conceptSwissCorpImg,
    badge: 'SWISS ENTERPRISE',
    tagline: 'Pristine alabaster canvas with deep corporate cobalt blue & architectural photo framing',
    highlights: [
      'Mathematically rigorous layout with generous negative space and sharp hairline dividers',
      'Enterprise-grade emergency dispatch pill with live technician response meter',
      'Prominent Popular Services carousel directly under hero search for rapid conversion',
      'High-legibility typography designed for instantaneous clarity and trust'
    ],
    bestFor: 'Users who demand clear, no-nonsense enterprise reliability and corporate accountability.'
  },
  {
    id: 'concept-formal-ai',
    title: 'Formal AI Diagnostic Concierge',
    archetype: 'Deep Titanium & Smart Diagnostic Dashboard',
    image: conceptFormalAiImg,
    badge: 'AI CONCIERGE',
    tagline: 'Titanium slate dark UI with emerald AI waveform & instant schematic breakdown',
    highlights: [
      'Dedicated AI Breakdown Terminal with root cause detection and parts cost estimator',
      'Formal certified master technician credential cards with verified ratings',
      'Streamlined horizontal popular repairs showcase between emergency and category rails',
      'Executive 1-tap priority dispatch with real-time GPS arrival countdown'
    ],
    bestFor: 'Tech-forward homeowners who want instant AI troubleshooting before booking a technician.'
  },
  {
    id: 'concept-formal-mono',
    title: 'Architectural Minimalist & Sapphire',
    archetype: 'Clean Architectural Restraint & Crisp White',
    image: conceptFormalMonoImg,
    badge: 'MINIMAL ARCHITECTURE',
    tagline: 'Minimalist monochrome design with sapphire accents and editorial service cards',
    highlights: [
      'Understated luxury with generous breathing room and zero visual clutter',
      'Clean horizontal popular services carousel with high-definition technician imagery',
      'Refined circular category pills with subtle active indicators',
      'Tactile floating bottom bar with all 5 essential navigation endpoints'
    ],
    bestFor: 'Modern minimalist design enthusiasts and design-conscious urban clients.'
  }
];

interface ClassicBackupProps {
  isDarkMode: boolean;
  language: 'en' | 'am';
  selectedLocation: string;
  onBookService: (name: string) => void;
  onOpenSOS: () => void;
}

export function ClassicAppBackup({
  isDarkMode,
  language,
  selectedLocation,
  onBookService,
  onOpenSOS,
}: ClassicBackupProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [activeNav, setActiveNav] = useState<'home' | 'services' | 'ai' | 'activity' | 'profile'>('home');
  const [aiCustomInput, setAiCustomInput] = useState<string>('');
  const [activeAiDiagnosis, setActiveAiDiagnosis] = useState<typeof PRESET_AI_DIAGNOSES[0] | null>(PRESET_AI_DIAGNOSES[0]);
  const [isAiDiagnosing, setIsAiDiagnosing] = useState<boolean>(false);

  const filteredServices = SERVICES.filter((s) => {
    const matchesCat = selectedCategory === 'all' || s.category === selectedCategory;
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.nameAm && s.nameAm.includes(searchQuery)) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const popularServices = SERVICES.filter((s) => s.isPopular);

  const handleRunAiDiagnosis = () => {
    setIsAiDiagnosing(true);
    const query = aiCustomInput || PRESET_AI_DIAGNOSES[0].issue;
    setTimeout(() => {
      const match = PRESET_AI_DIAGNOSES.find(d => query.toLowerCase().includes(d.issue.toLowerCase().slice(0, 10))) || {
        issue: query,
        category: 'SmartFix AI Hardware Diagnosis',
        diagnosis: `SmartFix AI analyzed "${query}": Electrical load imbalance or mechanical component wear detected. Professional on-site bench test required.`,
        severity: 'Moderate Priority',
        estCost: '350 - 550 ETB',
        partsNeeded: ['Standard OEM Part', 'Safety Seal Kit'],
        recommendedTech: 'Natnael Girma (4.9 ⭐ • Master Technician)',
        eta: '14 mins arrival'
      };
      setActiveAiDiagnosis(match);
      setIsAiDiagnosing(false);
    }, 700);
  };

  const t = {
    searchPlaceholder: language === 'en' ? 'Search repair or ask AI Lens...' : 'አገልግሎት ይፈልጉ ወይም AI ይጠይቁ...',
    emergencyTitle: language === 'en' ? '24/7 Priority Emergency Dispatch' : 'አስቸኳይ የ24/7 የጥገና ጥሪ',
    emergencySub: language === 'en' ? 'Immediate master technician dispatch • ~15 mins arrival' : 'ፈጣን የባለሙያ ጥሪ • ~15 ደቂቃ ውስጥ ይደርሳል',
    popularTitle: language === 'en' ? 'Popular Services' : 'ተወዳጅ አገልግሎቶች',
    allTitle: language === 'en' ? 'All Services' : 'ሁሉም አገልግሎቶች',
    currency: 'ETB',
  };

  return (
    <div className="w-full max-w-md bg-white dark:bg-[#101626] border border-slate-200/90 dark:border-slate-800 rounded-[36px] shadow-2xl overflow-hidden flex flex-col min-h-[850px] relative">
      {/* Top Banner Indicator */}
      <div className="bg-slate-100 dark:bg-slate-800/80 px-4 py-1.5 border-b border-slate-200 dark:border-slate-700/60 flex items-center justify-between text-[11px]">
        <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-slate-400"></span>
          Original Clean Edition (Backup)
        </span>
        <span className="text-[10px] text-slate-500 font-mono">Build v2.4</span>
      </div>

      {/* Status Bar */}
      <div className="px-6 pt-2 pb-1 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 font-medium">
        <span className="font-bold text-[13px]">9:41</span>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono tracking-tighter">5G</span>
          <div className="w-5 h-2.5 border border-current rounded-xs p-0.5 flex items-center">
            <div className="w-3.5 h-full bg-current rounded-2xs" />
          </div>
        </div>
      </div>

      {/* Top Header */}
      <div className="px-5 pt-2 pb-3 flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-700 to-indigo-700 text-white flex items-center justify-center font-extrabold text-xs shadow-sm">
            SF
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-sm tracking-tight text-blue-700 dark:text-blue-400">
                SMART<span className="text-amber-500">FIX</span>
              </span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-slate-600 dark:text-slate-400">
              <MapPin className="w-3 h-3 text-rose-500" />
              <span className="font-semibold text-slate-700 dark:text-slate-300">{selectedLocation}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-amber-500/10 dark:bg-amber-500/20 border border-amber-500/30 px-2.5 py-1 rounded-full flex items-center gap-1 text-[11px] font-bold text-amber-700 dark:text-amber-300">
            <Gift className="w-3 h-3 text-amber-500" />
            <span>50 Pts</span>
          </div>
          <div className="relative p-1.5 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            <Bell className="w-3.5 h-3.5" />
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 absolute top-1 right-1" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4 pb-24">
        {activeNav === 'home' && (
          <>
            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-600 dark:text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={t.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-2xl pl-10 pr-20 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-inner"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2">
                <button
                  onClick={() => setActiveNav('ai')}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-2.5 py-1 rounded-xl text-[10px] font-bold flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3 text-amber-300" />
                  <span>AI</span>
                </button>
              </div>
            </div>

            {/* SOS Emergency */}
            <div
              onClick={onOpenSOS}
              className="cursor-pointer bg-gradient-to-r from-blue-800 via-indigo-800 to-blue-950 text-white rounded-2xl p-3.5 shadow-md border border-blue-700/50"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center text-amber-300">
                    <Shield className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-xs">{t.emergencyTitle}</span>
                      <span className="bg-amber-400 text-slate-950 font-black text-[9px] px-1.5 py-0.2 rounded-full">
                        SOS
                      </span>
                    </div>
                    <p className="text-[10px] text-blue-100/90 mt-0.5">{t.emergencySub}</p>
                  </div>
                </div>
                <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
                  <ChevronRight className="w-3.5 h-3.5 text-white" />
                </div>
              </div>
            </div>

            {/* Popular Services */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-amber-500" />
                  <h3 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                    {t.popularTitle}
                  </h3>
                </div>
                <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold">Top Rated</span>
              </div>

              <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-none snap-x">
                {popularServices.map((service) => (
                  <div
                    key={service.id}
                    onClick={() => setSelectedService(service)}
                    className="snap-start w-[200px] flex-shrink-0 bg-white dark:bg-slate-800/95 border border-slate-200 dark:border-slate-700/80 rounded-2xl overflow-hidden shadow-sm cursor-pointer"
                  >
                    <div className="h-24 w-full relative">
                      <img src={service.image} alt={service.name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                      <div className="absolute top-1.5 left-1.5 bg-black/70 backdrop-blur-md px-1.5 py-0.5 rounded flex items-center gap-0.5 text-[9px] font-bold text-amber-300">
                        <Star className="w-2.5 h-2.5 fill-amber-300 text-amber-300" />
                        <span>{service.rating}</span>
                      </div>
                    </div>
                    <div className="p-2.5">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">{service.name}</h4>
                      <div className="flex items-center justify-between text-[10px] text-slate-600 dark:text-slate-400 mt-1">
                        <span>⏱️ {service.duration}</span>
                        <span className="text-emerald-600 font-semibold">{service.ordersCount}</span>
                      </div>
                      <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-slate-100 dark:border-slate-700/60">
                        <span className="text-xs font-black text-blue-600 dark:text-blue-400">{service.price} ETB</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onBookService(service.name);
                          }}
                          className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.8 rounded-lg shadow-xs"
                        >
                          Book
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Categories */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                  Categories
                </h3>
              </div>
              <div className="flex gap-2.5 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-none snap-x">
                {CATEGORIES.map((cat) => {
                  const isSelected = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className="snap-start flex flex-col items-center gap-1 flex-shrink-0"
                    >
                      <div
                        className={`w-13 h-13 rounded-full p-0.5 transition-all ${
                          isSelected
                            ? 'ring-2 ring-blue-600 bg-blue-600'
                            : 'ring-1 ring-slate-200 dark:ring-slate-700 bg-slate-100 dark:bg-slate-800'
                        }`}
                      >
                        <div className="w-full h-full rounded-full overflow-hidden relative">
                          <img src={cat.img} alt={cat.label} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                        </div>
                      </div>
                      <span className="text-[10px] font-semibold truncate max-w-[62px] text-slate-600 dark:text-slate-400">
                        {language === 'am' ? cat.labelAm : cat.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* All Services */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                  {t.allTitle} ({filteredServices.length})
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                {filteredServices.map((service) => (
                  <div
                    key={service.id}
                    className="bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 rounded-2xl overflow-hidden shadow-xs flex flex-col justify-between"
                  >
                    <div onClick={() => setSelectedService(service)} className="h-24 w-full relative cursor-pointer">
                      <img src={service.image} alt={service.name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                      <div className="absolute top-1.5 left-1.5 bg-black/65 backdrop-blur-md px-1.5 py-0.5 rounded text-[9px] font-bold text-amber-300">
                        ⭐ {service.rating}
                      </div>
                    </div>
                    <div className="p-2 flex-1 flex flex-col justify-between">
                      <h4 className="text-[11px] font-bold text-slate-900 dark:text-white line-clamp-1">{service.name}</h4>
                      <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-slate-100 dark:border-slate-700/60">
                        <span className="text-xs font-black text-blue-600 dark:text-blue-400">{service.price} ETB</span>
                        <button
                          onClick={() => onBookService(service.name)}
                          className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {activeNav === 'services' && (
          <div className="space-y-3">
            <div className="bg-blue-600 text-white p-3 rounded-2xl">
              <h3 className="font-bold text-xs">All Trade Categories</h3>
              <p className="text-[10px] text-blue-100">Select any certified service</p>
            </div>
            {SERVICES.map((s) => (
              <div key={s.id} onClick={() => setSelectedService(s)} className="bg-white dark:bg-slate-800 border p-2.5 rounded-2xl flex items-center gap-3 cursor-pointer">
                <img src={s.image} alt={s.name} referrerPolicy="no-referrer" className="w-12 h-12 rounded-xl object-cover" />
                <div className="flex-1">
                  <div className="flex justify-between text-xs font-bold">
                    <span>{s.name}</span>
                    <span className="text-blue-600">{s.price} ETB</span>
                  </div>
                  <p className="text-[10px] text-slate-500 line-clamp-1">{s.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeNav === 'ai' && (
          <div className="space-y-3">
            <div className="bg-emerald-900 text-white p-3.5 rounded-2xl border border-emerald-500/30">
              <h3 className="font-bold text-xs flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                AI Hardware Lens
              </h3>
              <div className="mt-2 flex gap-1.5">
                <input
                  type="text"
                  placeholder="Describe failure..."
                  value={aiCustomInput}
                  onChange={(e) => setAiCustomInput(e.target.value)}
                  className="w-full bg-slate-900 border border-emerald-500/40 rounded-xl px-2.5 py-1.5 text-xs text-white"
                />
                <button onClick={handleRunAiDiagnosis} className="bg-emerald-500 text-slate-950 font-bold px-3 py-1.5 rounded-xl text-xs">
                  {isAiDiagnosing ? '...' : 'Run'}
                </button>
              </div>
            </div>
            {activeAiDiagnosis && (
              <div className="bg-white dark:bg-slate-800 border rounded-2xl p-3 text-xs space-y-2">
                <span className="font-bold text-emerald-600">{activeAiDiagnosis.severity}</span>
                <p className="font-extrabold">{activeAiDiagnosis.issue}</p>
                <p className="text-slate-600 dark:text-slate-300">{activeAiDiagnosis.diagnosis}</p>
                <div className="flex justify-between font-bold text-blue-600 pt-2 border-t">
                  <span>Est: {activeAiDiagnosis.estCost}</span>
                  <span>ETA: {activeAiDiagnosis.eta}</span>
                </div>
                <button
                  onClick={() => onBookService(activeAiDiagnosis.issue)}
                  className="w-full bg-emerald-600 text-white font-bold py-2 rounded-xl mt-1"
                >
                  Book AI Recommended Tech
                </button>
              </div>
            )}
          </div>
        )}

        {activeNav === 'activity' && (
          <div className="space-y-3 text-xs">
            <div className="bg-white dark:bg-slate-800 border p-3 rounded-2xl">
              <span className="font-bold text-emerald-600">ACTIVE DISPATCH #SF-8821</span>
              <h4 className="font-bold text-slate-900 dark:text-white mt-1">Emergency Breaker Replacement</h4>
              <p className="text-slate-500 text-[11px]">Dawit Abebe (Master Electrician) • 9 mins arrival</p>
            </div>
          </div>
        )}

        {activeNav === 'profile' && (
          <div className="space-y-3 text-xs">
            <div className="bg-white dark:bg-slate-800 border p-3 rounded-2xl flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center">DA</div>
              <div>
                <h4 className="font-bold">Demeke D.</h4>
                <p className="text-slate-500 text-[11px]">Bole, Addis Ababa</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Nav */}
      <div className="absolute bottom-0 inset-x-0 bg-white/95 dark:bg-[#0C1220]/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-3 py-2 flex items-center justify-around z-20">
        <button onClick={() => setActiveNav('home')} className={`flex flex-col items-center gap-0.5 text-[9px] font-bold ${activeNav === 'home' ? 'text-blue-600' : 'text-slate-500'}`}>
          <Home className="w-4 h-4" />
          <span>Home</span>
        </button>
        <button onClick={() => setActiveNav('services')} className={`flex flex-col items-center gap-0.5 text-[9px] font-bold ${activeNav === 'services' ? 'text-blue-600' : 'text-slate-500'}`}>
          <Grid className="w-4 h-4" />
          <span>Services</span>
        </button>
        <button onClick={() => setActiveNav('ai')} className="w-10 h-10 -mt-4 rounded-full bg-gradient-to-tr from-emerald-600 to-blue-600 text-white flex items-center justify-center shadow-lg">
          <Sparkles className="w-5 h-5 text-amber-300" />
        </button>
        <button onClick={() => setActiveNav('activity')} className={`flex flex-col items-center gap-0.5 text-[9px] font-bold ${activeNav === 'activity' ? 'text-blue-600' : 'text-slate-500'}`}>
          <Clock className="w-4 h-4" />
          <span>Activity</span>
        </button>
        <button onClick={() => setActiveNav('profile')} className={`flex flex-col items-center gap-0.5 text-[9px] font-bold ${activeNav === 'profile' ? 'text-blue-600' : 'text-slate-500'}`}>
          <User className="w-4 h-4" />
          <span>Profile</span>
        </button>
      </div>

      {/* Service Detail Modal */}
      {selectedService && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl p-4 space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-sm">{selectedService.name}</h3>
              <button onClick={() => setSelectedService(null)} className="text-slate-400"><X className="w-4 h-4" /></button>
            </div>
            <p className="text-xs text-slate-500">{selectedService.description}</p>
            <div className="flex justify-between text-xs font-black text-blue-600">
              <span>{selectedService.price} ETB</span>
              <span>{selectedService.duration}</span>
            </div>
            <button
              onClick={() => {
                onBookService(selectedService.name);
                setSelectedService(null);
              }}
              className="w-full bg-blue-600 text-white font-bold py-2.5 rounded-xl text-xs shadow-md"
            >
              Confirm Dispatch
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
