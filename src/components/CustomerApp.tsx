import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  MapPin,
  Bell,
  Star,
  Plus,
  ArrowRight,
  Sparkles,
  Check,
  X,
  Phone,
  Calendar,
  Grid,
  Home,
  FileText,
  Clock,
  ChevronDown,
  ChevronRight,
  Wrench,
  Cpu,
  UserCheck,
  ShieldCheck,
  ThumbsUp,
  CreditCard,
  Zap,
  Droplet,
  Tv,
  Paintbrush,
  Laptop,
  Sun,
  Trees,
  Share2,
  AlertOctagon,
  Lock,
  User,
  CheckCircle,
  Globe,
  Compass,
  LocateFixed,
  Radio,
  Navigation2,
  AlertTriangle,
  Award,
  Download,
  ExternalLink,
  Copy,
  RotateCcw,
  FileCheck,
  Truck,
  Settings,
  ShieldAlert,
  QrCode,
  Send,
  Info,
  Layers,
  Tag,
  Folder,
  CheckCheck,
  Smartphone,
  Receipt,
  RefreshCw,
  Edit2,
  RotateCw,
  Mic
} from 'lucide-react';
import { ServiceItem, Booking, Zone, NotificationItem, Language, Technician, CategoryItem } from '../types';
import { INITIAL_ZONES } from '../data/mockData';
import { MAIN_CATEGORIES, ALL_CATEGORY_GROUPS, POPULAR_SERVICES, INITIAL_CATEGORIES } from '../data/servicesData';
import {
  getLocalizedServiceName as resolveLocalizedServiceName,
  getLocalizedServiceDescription as resolveLocalizedServiceDescription,
  getLocalizedCategoryName as resolveLocalizedCategoryName,
  getLocalizedCategoryDescription as resolveLocalizedCategoryDescription
} from '../data/serviceTranslations';
import { TRANSLATIONS, LANGUAGE_OPTIONS } from '../data/translations';
import { RateTechnicianModal } from './RateTechnicianModal';
import { CleanSearchOverlay } from './CleanSearchOverlay';
import { AiStudioDiagnostics } from './AiStudioDiagnostics';
import { LocationPickerModal } from './LocationPickerModal';
import { SmartFixLiveMap } from './SmartFixLiveMap';
import { SmartFixLogo } from './SmartFixLogo';

interface CustomerAppProps {
  categories?: CategoryItem[];
  services: ServiceItem[];
  bookings: Booking[];
  technicians?: Technician[];
  language: Language;
  selectedLocation: string;
  onSelectLocation: (loc: string) => void;
  onSetLanguage: (lang: Language) => void;
  onBookService: (booking: Omit<Booking, 'id' | 'createdAt' | 'status'>) => void;
  onCancelBooking?: (bookingId: string, reason?: string, notes?: string) => void;
  onRateBooking?: (bookingId: string, rating: number, comment?: string, tags?: string[], tip?: number) => void;
  onPayBooking?: (bookingId: string, paymentMethod: 'telebirr' | 'cbe_birr' | 'cash') => void;
  onAcceptBooking?: (bookingId: string, techId: string) => void;
  isDarkMode: boolean;
}

const TRUST_SLOGANS: Record<Language, string[]> = {
  en: ['Your Trusted Partner', 'Professional Repairs Guaranteed', 'Smart Solutions for Ethiopia'],
  am: ['የእርስዎ ታማኝ አጋር', 'የተረጋገጠ ሙያዊ ጥገና', 'ዘመናዊ መፍትሄዎች ለኢትዮጵያ'],
  om: ['Hiriyaa Keessan Isa Amanamaa', 'Suphaa Ogummaa Qabu', 'Furmaata Ammayyaa Itoophiyaaf'],
  ti: ['እሙን መሻርኽትኹም', 'ውሑስ ናይ ሞያ ምዕራይ', 'ዘመናዊ ፍታሕ ንኢትዮጵያ'],
  so: ['Saaxiibkaaga Lagu Kalsoon Yahay', 'Dayactir Xirfadeed oo La Hubo', 'Xalka Casriga ah ee Itoobiya']
};

export function CustomerApp({
  categories: passedCategories = INITIAL_CATEGORIES,
  services,
  bookings,
  technicians = [],
  language,
  selectedLocation,
  onSelectLocation,
  onSetLanguage,
  onBookService,
  onCancelBooking,
  onRateBooking,
  onPayBooking,
  onAcceptBooking,
  isDarkMode,
}: CustomerAppProps) {
  const [activeNav, setActiveNav] = useState<'home' | 'requests' | 'ai' | 'notifications' | 'profile'>('home');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [bookingModalService, setBookingModalService] = useState<ServiceItem | null>(null);
  
  // Interactive Modals
  const [showLocationModal, setShowLocationModal] = useState<boolean>(false);
  const [showLanguageModal, setShowLanguageModal] = useState<boolean>(false);
  const [showEmergencyModal, setShowEmergencyModal] = useState<boolean>(false);
  const [shareSuccessToast, setShareSuccessToast] = useState<string | null>(null);
  const [payingBooking, setPayingBooking] = useState<Booking | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'telebirr' | 'cbe_birr' | 'cash'>('telebirr');
  const [isProcessingPayment, setIsProcessingPayment] = useState<boolean>(false);
  
  // Dedicated Telebirr & CBE Payment Sub-flows
  const [telebirrSubMethod, setTelebirrSubMethod] = useState<'direct_push' | 'qr_code' | 'ussd_dial'>('direct_push');
  const [cbeSubMethod, setCbeSubMethod] = useState<'cbe_transfer' | 'cbe_ussd' | 'qr_code'>('cbe_transfer');
  const [payerTelebirrPhone, setPayerTelebirrPhone] = useState<string>('0911234567');
  const [payerTelebirrPin, setPayerTelebirrPin] = useState<string>('');
  const [payerTelebirrOtp, setPayerTelebirrOtp] = useState<string>('');
  const [telebirrPushActive, setTelebirrPushActive] = useState<boolean>(false);
  const [telebirrCountdown, setTelebirrCountdown] = useState<number>(60);
  const [payerCbeAccount, setPayerCbeAccount] = useState<string>('1000188923412');
  const [payerCbeRef, setPayerCbeRef] = useState<string>('');
  const [payerCbePhone, setPayerCbePhone] = useState<string>('0911234567');
  const [cbePushActive, setCbePushActive] = useState<boolean>(false);
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);
  
  // Electronic Receipt Modal Data
  const [receiptModalData, setReceiptModalData] = useState<{
    booking: Booking;
    txnId: string;
    paymentMethod: 'telebirr' | 'cbe_birr' | 'cash';
    amount: number;
    laborPrice: number;
    partsCost: number;
    commission: number;
    technicianPayout: number;
    technicianName: string;
    technicianAccount: string;
    date: string;
    authCode: string;
  } | null>(null);

  // Rating Modal
  const [ratingBooking, setRatingBooking] = useState<Booking | null>(null);

  // Folder Navigation for Requests
  const [requestsFolderTab, setRequestsFolderTab] = useState<'active' | 'completed' | 'cancelled'>('active');

  // Booking Form State
  const [customerName, setCustomerName] = useState<string>('Abebe Girma');
  const [customerPhone, setCustomerPhone] = useState<string>('+251 91 234 5678');
  const [customerAddress, setCustomerAddress] = useState<string>('Bole Atlas, Near Edna Mall, House 402');
  const [customerNotes, setCustomerNotes] = useState<string>('');
  const [isUrgent, setIsUrgent] = useState<boolean>(false);
  const [paymentMethod, setPaymentMethod] = useState<'telebirr' | 'cbe_birr' | 'cash'>('telebirr');

  // GPS Geolocation Autofill State & Request Form Location Mode
  const [isLocatingGps, setIsLocatingGps] = useState<boolean>(false);
  const [gpsCoords, setGpsCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [isGpsVerified, setIsGpsVerified] = useState<boolean>(false);
  const [locationInputMode, setLocationInputMode] = useState<'gps' | 'manual'>('gps');
  const [gpsPermissionState, setGpsPermissionState] = useState<'idle' | 'requesting' | 'granted' | 'denied' | 'unsupported'>('idle');
  const [gpsAccuracy, setGpsAccuracy] = useState<number | null>(null);
  const [additionalGateInfo, setAdditionalGateInfo] = useState<string>('');

  // Active Requests GPS Live Tracking & Cancellation State
  const [trackingBooking, setTrackingBooking] = useState<Booking | null>(null);
  const [cancellingBooking, setCancellingBooking] = useState<Booking | null>(null);
  const [selectedCancelReason, setSelectedCancelReason] = useState<string>('Technician arrival took longer than expected');
  const [cancelNotes, setCancelNotes] = useState<string>('');
  const [trackingNote, setTrackingNote] = useState<string>('');
  const [trackingNoteSent, setTrackingNoteSent] = useState<boolean>(false);

  // Premium Profile State
  const [viewingCertificate, setViewingCertificate] = useState<{
    id: string;
    service: string;
    tech: string;
    techSpecialty?: string;
    techPhone?: string;
    date: string;
    warrantyDays: number;
    warrantyEnd: string;
    guaranteeType: string;
    escrowProtection: boolean;
    qrCodeText: string;
  } | null>(null);

  const [savedAddressesList, setSavedAddressesList] = useState<Array<{ id: string; label: string; address: string; isDefault: boolean }>>([
    { id: 'addr-1', label: 'Home (Apartment)', address: 'Bole Atlas, Near Edna Mall, House 402', isDefault: true },
    { id: 'addr-2', label: 'Office / Workplace', address: 'Kazanchis, Bloom Tower, 5th Floor', isDefault: false },
    { id: 'addr-3', label: 'Family Residence', address: 'Old Airport / Sarbet, Near AU Headquarters', isDefault: false }
  ]);

  const [isAddingAddress, setIsAddingAddress] = useState<boolean>(false);
  const [newAddrLabel, setNewAddrLabel] = useState<string>('Studio / Shop');
  const [newAddrText, setNewAddrText] = useState<string>('');
  const [showAddPaymentModal, setShowAddPaymentModal] = useState<boolean>(false);
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);
  const [showSavedAddressesModal, setShowSavedAddressesModal] = useState<boolean>(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState<boolean>(false);
  const [showTermsModal, setShowTermsModal] = useState<boolean>(false);
  const [activeNotificationPrefs, setActiveNotificationPrefs] = useState({
    smsOtp: true,
    pushAlerts: true,
    emailReceipts: true
  });

  const CANCELLATION_REASONS = [
    'Technician arrival took longer than expected',
    'Issue resolved myself / No longer needed',
    'Booked wrong service category by mistake',
    'Price or estimate was higher than budget',
    'Need to reschedule to another day or time',
    'Other reason'
  ];

  // Find closest Ethiopian / Addis Ababa zone name based on GPS coordinates
  const findNearestEthiopianZoneName = (lat: number, lng: number): string => {
    const ethiopianHubs = [
      { name: 'Bole (Atlas / Medhanialem)', lat: 9.0054, lng: 38.7636 },
      { name: 'Kazanchis (Kirkos / UNECA)', lat: 9.0182, lng: 38.7694 },
      { name: 'Piassa & Arada Heritage', lat: 9.0345, lng: 38.7518 },
      { name: 'CMC, Summit & Ayat', lat: 9.0227, lng: 38.8041 },
      { name: 'Sarbet & Old Airport', lat: 8.9950, lng: 38.7320 },
      { name: 'Gerji, Jackros & Imperial', lat: 9.0012, lng: 38.8015 },
      { name: 'Lebu, Jemo & Nifas Silk', lat: 8.9650, lng: 38.7210 },
      { name: 'Gotera, Lancia & Beklobet', lat: 8.9880, lng: 38.7590 },
      { name: 'Akaki-Kality Industrial Zone', lat: 8.9120, lng: 38.7750 },
      { name: 'Bishoftu / Debre Zeyit', lat: 8.7523, lng: 38.9785 },
      { name: 'Adama / Nazret Central', lat: 8.5414, lng: 39.2689 },
      { name: 'Hawassa Lake Area', lat: 7.0621, lng: 38.4764 },
      { name: 'Bahir Dar (Tana Basin)', lat: 11.5936, lng: 37.3908 },
      { name: 'Mekelle (Kedamay Weyane)', lat: 13.4967, lng: 39.4753 },
      { name: 'Dire Dawa Metropolis', lat: 9.5931, lng: 41.8661 }
    ];

    let closest = ethiopianHubs[0];
    let minDistanceSq = Number.MAX_VALUE;
    for (const hub of ethiopianHubs) {
      const dSq = Math.pow(lat - hub.lat, 2) + Math.pow(lng - hub.lng, 2);
      if (dSq < minDistanceSq) {
        minDistanceSq = dSq;
        closest = hub;
      }
    }
    return closest.name;
  };

  // GPS Geolocation Autofill Function (Requests live GPS permission first)
  const handleAutoFillGps = (forceReset: boolean = false) => {
    setIsLocatingGps(true);
    setGpsPermissionState('requesting');
    if (forceReset) {
      setIsGpsVerified(false);
    }

    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          const accuracy = Math.round(position.coords.accuracy || 4);
          setGpsCoords({ lat, lng });
          setGpsAccuracy(accuracy);
          setIsGpsVerified(true);
          setIsLocatingGps(false);
          setGpsPermissionState('granted');
          const zoneName = findNearestEthiopianZoneName(lat, lng);
          const detectedAddress = `${zoneName}, Addis Ababa (📍 GPS: ${lat.toFixed(4)}°N, ${lng.toFixed(4)}°E)`;
          setCustomerAddress(detectedAddress);
        },
        (error) => {
          console.warn('GPS location permission error or denied:', error);
          setIsLocatingGps(false);
          setGpsPermissionState('denied');
          // Fallback coordinates for Addis Ababa center
          const fallbackLat = 9.0054;
          const fallbackLng = 38.7636;
          setGpsCoords({ lat: fallbackLat, lng: fallbackLng });
          setGpsAccuracy(10);
          if (!customerAddress || customerAddress.includes('📍 GPS')) {
            setCustomerAddress(`${selectedLocation}, Addis Ababa`);
          }
        },
        { timeout: 9000, enableHighAccuracy: true, maximumAge: 0 }
      );
    } else {
      setIsLocatingGps(false);
      setGpsPermissionState('unsupported');
      if (!customerAddress) {
        setCustomerAddress(`${selectedLocation}, Addis Ababa`);
      }
    }
  };

  // Dedicated countdown timer for Telebirr / CBE USSD push requests
  useEffect(() => {
    let timer: any;
    if (telebirrPushActive && telebirrCountdown > 0) {
      timer = setInterval(() => {
        setTelebirrCountdown(prev => prev - 1);
      }, 1000);
    } else if (telebirrCountdown === 0) {
      setTelebirrPushActive(false);
    }
    return () => clearInterval(timer);
  }, [telebirrPushActive, telebirrCountdown]);

  const handleCopyToClipboard = (text: string, label: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
    }
    setCopyFeedback(`Copied ${label}!`);
    setTimeout(() => setCopyFeedback(null), 2500);
  };

  const handleConfirmCancel = () => {
    if (!cancellingBooking) return;
    if (onCancelBooking) {
      onCancelBooking(cancellingBooking.id, selectedCancelReason, cancelNotes);
    }
    setCancellingBooking(null);
    setSelectedCancelReason('Technician arrival took longer than expected');
    setCancelNotes('');
  };

  const handleAddNewAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddrText.trim()) return;
    const newAddr = {
      id: `addr-${Date.now()}`,
      label: newAddrLabel || 'Custom Place',
      address: newAddrText,
      isDefault: false
    };
    setSavedAddressesList([...savedAddressesList, newAddr]);
    setNewAddrText('');
    setIsAddingAddress(false);
  };

  // AI Diagnostics State
  const [aiInput, setAiInput] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [aiResult, setAiResult] = useState<{
    issue: string;
    diagnosis: string;
    parts: string[];
    estCost: string;
    recommendedTech: string;
  } | null>(null);

  // Trust Slogan Text-Scrolling State
  const [sloganIndex, setSloganIndex] = useState<number>(0);

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const currentSlogans = TRUST_SLOGANS[language] || TRUST_SLOGANS.en;

  useEffect(() => {
    const timer = setInterval(() => {
      setSloganIndex((prev) => (prev + 1) % currentSlogans.length);
    }, 3200);
    return () => clearInterval(timer);
  }, [currentSlogans.length]);

  // Dynamic Notifications based on Bookings and System Events
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'n-1',
      title: 'Technician Assigned',
      desc: 'Master Electrician Dawit Abebe is assigned to your area.',
      time: '5 mins ago',
      type: 'dispatch',
      unread: true
    },
    {
      id: 'n-2',
      title: 'Warranty Guarantee Active',
      desc: 'All SmartFix repairs include a 30-day verified quality warranty.',
      time: '1 hour ago',
      type: 'status',
      unread: false
    }
  ]);

  const unreadCount = notifications.filter(n => n.unread).length;

  const getCategoryIcon = (iconName?: string) => {
    switch (iconName) {
      case 'Zap': return Zap;
      case 'Tv': return Tv;
      case 'Laptop': return Laptop;
      case 'Sun': return Sun;
      case 'Droplet': return Droplet;
      case 'Paintbrush': return Paintbrush;
      case 'Sparkles': return Sparkles;
      case 'Trees': return Trees;
      case 'Wrench': return Wrench;
      case 'Shield': return ShieldCheck;
      case 'Cpu': return Cpu;
      default: return Wrench;
    }
  };

  const categories = [
    { id: 'all', name: t.allServices, icon: Grid },
    ...passedCategories.map(c => {
      return {
        id: c.id,
        name: resolveLocalizedCategoryName(c, language),
        icon: getCategoryIcon(c.iconName)
      };
    })
  ];

  // Helper for localized service name (supports ServiceItem and Booking)
  const getLocalizedServiceName = (s: any) => {
    return resolveLocalizedServiceName(s, language);
  };

  // Helper for localized service description
  const getLocalizedServiceDescription = (s: any) => {
    return resolveLocalizedServiceDescription(s, language);
  };

  // Active Pop-up Message Modal for customer alerts (accepted, startCode, completedCode)
  const [activePopupAlert, setActivePopupAlert] = useState<{
    id: string;
    type: 'accepted' | 'start_code' | 'completed_code';
    title: string;
    desc: string;
    bookingId: string;
    booking?: Booking;
    code?: string;
    technicianName?: string;
    technicianPhone?: string;
    serviceName?: string;
    amount?: number;
    time?: string;
  } | null>(null);

  const [copiedCodeNotice, setCopiedCodeNotice] = useState<string | null>(null);
  const prevBookingsStatusRef = useRef<Record<string, string>>({});
  const hasInitializedBookingsRef = useRef<boolean>(false);

  const handleCopyAlertCode = (code: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(code);
    }
    setCopiedCodeNotice(code);
    setTimeout(() => setCopiedCodeNotice(null), 2500);
  };

  const handleOpenAlertPopup = (n: NotificationItem) => {
    const booking = bookings.find(b => b.id === n.bookingId);
    setActivePopupAlert({
      id: n.id,
      type: (n.actionType || (n.type as any)) || 'accepted',
      title: n.title,
      desc: n.desc,
      bookingId: n.bookingId || 'SF-1082',
      booking,
      code: n.code || (n.actionType === 'start_code' ? (booking?.startOtp || '4821') : (booking?.completionOtp || '7394')),
      technicianName: n.technicianName || booking?.technicianName || 'Master Technician',
      technicianPhone: n.technicianPhone || booking?.technicianPhone || '+251 91 123 4567',
      serviceName: n.serviceName || (booking ? getLocalizedServiceName(booking) : 'SmartFix Service'),
      amount: n.amount || booking?.price || 400,
      time: n.time
    });
    // Mark as read
    setNotifications(prev => prev.map(item => item.id === n.id ? { ...item, unread: false } : item));
  };

  // Effect to monitor booking lifecycle transitions (accepted, start_code, completed_code)
  // and trigger immediate pop-up alerts and sync notifications across all 5 languages 100%
  useEffect(() => {
    if (!bookings || bookings.length === 0) return;

    // On initial mount, register current statuses and build rich alert feed
    if (!hasInitializedBookingsRef.current) {
      hasInitializedBookingsRef.current = true;
      const initialStatuses: Record<string, string> = {};
      const initialAlerts: NotificationItem[] = [];

      bookings.forEach(b => {
        initialStatuses[b.id] = b.status;
        const localizedName = getLocalizedServiceName(b);

        if (b.status === 'accepted' || b.status === 'in_route') {
          initialAlerts.push({
            id: `notif-acc-${b.id}`,
            title: `${t.alertAcceptedTitle} (#${b.id})`,
            desc: `${b.technicianName || 'Master Technician'} ${t.alertAcceptedDesc}`,
            time: b.createdAt || '10 mins ago',
            type: 'accepted',
            actionType: 'accepted',
            unread: false,
            bookingId: b.id,
            technicianName: b.technicianName,
            technicianPhone: b.technicianPhone,
            serviceName: localizedName
          });
        } else if (b.status === 'in_progress') {
          initialAlerts.push({
            id: `notif-start-${b.id}`,
            title: `${t.alertStartCodeTitle} (#${b.id})`,
            desc: t.alertStartCodeDesc,
            time: '5 mins ago',
            type: 'start_code',
            actionType: 'start_code',
            code: b.startOtp || '4821',
            unread: true,
            bookingId: b.id,
            technicianName: b.technicianName,
            technicianPhone: b.technicianPhone,
            serviceName: localizedName
          });
        } else if (b.status === 'completed') {
          initialAlerts.push({
            id: `notif-comp-${b.id}`,
            title: `${t.alertCompletedCodeTitle} (#${b.id})`,
            desc: t.alertCompletedCodeDesc,
            time: 'Today',
            type: 'completed_code',
            actionType: 'completed_code',
            code: b.completionOtp || '7394',
            unread: false,
            bookingId: b.id,
            technicianName: b.technicianName,
            technicianPhone: b.technicianPhone,
            serviceName: localizedName,
            amount: b.price
          });
        }
      });

      prevBookingsStatusRef.current = initialStatuses;
      if (initialAlerts.length > 0) {
        setNotifications(prev => {
          const existingIds = new Set(prev.map(p => p.id));
          const toAdd = initialAlerts.filter(a => !existingIds.has(a.id));
          return [...toAdd, ...prev];
        });
      }
      return;
    }

    // Subsequent updates: detect lifecycle transitions
    bookings.forEach(b => {
      const prevStatus = prevBookingsStatusRef.current[b.id];
      const localizedName = getLocalizedServiceName(b);

      // Transition 1: Booking accepted by technician (from pending or newly dispatched)
      if (b.status === 'accepted' && (prevStatus === 'pending' || !prevStatus)) {
        const notifId = `notif-acc-${b.id}-${Date.now()}`;
        const newNotif: NotificationItem = {
          id: notifId,
          title: `${t.alertAcceptedTitle} (#${b.id})`,
          desc: `${b.technicianName || 'Master Technician'} ${t.alertAcceptedDesc}`,
          time: 'Just now',
          type: 'accepted',
          actionType: 'accepted',
          unread: true,
          bookingId: b.id,
          technicianName: b.technicianName,
          technicianPhone: b.technicianPhone,
          serviceName: localizedName
        };

        setNotifications(prev => [newNotif, ...prev.filter(n => n.id !== newNotif.id)]);

        // Trigger Pop-up Message!
        setActivePopupAlert({
          id: notifId,
          type: 'accepted',
          title: t.alertAcceptedTitle,
          desc: `${b.technicianName || 'Master Technician'} ${t.alertAcceptedDesc}`,
          bookingId: b.id,
          booking: b,
          technicianName: b.technicianName,
          technicianPhone: b.technicianPhone,
          serviceName: localizedName,
          time: 'Just now'
        });
      }

      // Transition 2: Service started -> Start Code needed
      if (b.status === 'in_progress' && prevStatus !== 'in_progress') {
        const notifId = `notif-start-${b.id}-${Date.now()}`;
        const startCode = b.startOtp || '4821';
        const newNotif: NotificationItem = {
          id: notifId,
          title: `${t.alertStartCodeTitle} (#${b.id})`,
          desc: t.alertStartCodeDesc,
          time: 'Just now',
          type: 'start_code',
          actionType: 'start_code',
          code: startCode,
          unread: true,
          bookingId: b.id,
          technicianName: b.technicianName,
          technicianPhone: b.technicianPhone,
          serviceName: localizedName
        };

        setNotifications(prev => [newNotif, ...prev.filter(n => n.id !== newNotif.id)]);

        // Trigger Pop-up Message!
        setActivePopupAlert({
          id: notifId,
          type: 'start_code',
          title: t.alertStartCodeTitle,
          desc: t.alertStartCodeDesc,
          bookingId: b.id,
          booking: b,
          code: startCode,
          technicianName: b.technicianName,
          technicianPhone: b.technicianPhone,
          serviceName: localizedName,
          time: 'Just now'
        });
      }

      // Transition 3: Service completed -> Completed Code & Settlement
      if (b.status === 'completed' && prevStatus !== 'completed') {
        const notifId = `notif-comp-${b.id}-${Date.now()}`;
        const completionCode = b.completionOtp || '7394';
        const newNotif: NotificationItem = {
          id: notifId,
          title: `${t.alertCompletedCodeTitle} (#${b.id})`,
          desc: t.alertCompletedCodeDesc,
          time: 'Just now',
          type: 'completed_code',
          actionType: 'completed_code',
          code: completionCode,
          unread: true,
          bookingId: b.id,
          technicianName: b.technicianName,
          technicianPhone: b.technicianPhone,
          serviceName: localizedName,
          amount: b.price
        };

        setNotifications(prev => [newNotif, ...prev.filter(n => n.id !== newNotif.id)]);

        // Trigger Pop-up Message!
        setActivePopupAlert({
          id: notifId,
          type: 'completed_code',
          title: t.alertCompletedCodeTitle,
          desc: t.alertCompletedCodeDesc,
          bookingId: b.id,
          booking: b,
          code: completionCode,
          technicianName: b.technicianName,
          technicianPhone: b.technicianPhone,
          serviceName: localizedName,
          amount: b.price,
          time: 'Just now'
        });
      }

      prevBookingsStatusRef.current[b.id] = b.status;
    });
  }, [bookings, t]);

  const getLocalizedZoneName = (zone: Zone) => {
    if (language === 'am' && zone.nameAm) return zone.nameAm;
    if (language === 'om' && zone.nameOm) return zone.nameOm;
    if (language === 'ti' && zone.nameTi) return zone.nameTi;
    if (language === 'so' && zone.nameSo) return zone.nameSo;
    return zone.name;
  };

  const filteredServices = services.filter((s) => {
    const matchesCategory = selectedCategory === 'all' || s.category === selectedCategory;
    const localizedName = getLocalizedServiceName(s).toLowerCase();
    const localizedDesc = getLocalizedServiceDescription(s).toLowerCase();
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      s.name.toLowerCase().includes(query) ||
      localizedName.includes(query) ||
      (s.description || '').toLowerCase().includes(query) ||
      localizedDesc.includes(query);
    return matchesCategory && matchesSearch;
  });

  const popularServices = services.filter((s) => s.popular);

  const popularRowRef = useRef<HTMLDivElement>(null);
  const [isAutoScrolling, setIsAutoScrolling] = useState<boolean>(true);

  useEffect(() => {
    if (!isAutoScrolling) return;
    const container = popularRowRef.current;
    if (!container) return;

    const scrollInterval = setInterval(() => {
      if (!container) return;
      const maxScroll = container.scrollWidth - container.clientWidth;
      if (container.scrollLeft >= maxScroll - 6) {
        container.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        container.scrollBy({ left: 150, behavior: 'smooth' });
      }
    }, 2800);

    return () => clearInterval(scrollInterval);
  }, [isAutoScrolling, popularServices.length]);

  const handleOpenBookingModal = (service: ServiceItem, isEmergency: boolean = false, initialNotes: string = '') => {
    setBookingModalService(service);
    setIsUrgent(isEmergency);
    setSelectedService(null);
    setShowEmergencyModal(false);
    if (initialNotes) {
      setCustomerNotes(initialNotes);
    }
    setAdditionalGateInfo('');
    // Take present location first by default: initiate GPS permission prompt immediately
    setLocationInputMode('gps');
    handleAutoFillGps(true);
  };

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingModalService) return;

    const finalAddressWithNotes = additionalGateInfo.trim()
      ? `${customerAddress} [Gate/Apt: ${additionalGateInfo.trim()}]`
      : customerAddress;

    onBookService({
      customerName: customerName || 'Valued Customer',
      customerPhone: customerPhone || '+251 91 100 0000',
      serviceId: bookingModalService.id,
      serviceName: bookingModalService.name,
      serviceNameAm: bookingModalService.nameAm,
      serviceNameOm: bookingModalService.nameOm,
      serviceNameTi: bookingModalService.nameTi,
      serviceNameSo: bookingModalService.nameSo,
      category: bookingModalService.category,
      zone: selectedLocation,
      address: finalAddressWithNotes || selectedLocation,
      price: bookingModalService.price,
      scheduledTime: isUrgent ? 'Immediate SOS Dispatch (<15 mins)' : 'Today, Standard Slot',
      isUrgent,
      notes: customerNotes,
      paymentMethod,
      gpsCoordinates: gpsCoords || undefined,
      gpsVerified: isGpsVerified
    });

    setBookingModalService(null);
    setCustomerNotes('');
    setAdditionalGateInfo('');
    setActiveNav('requests');
  };

  const handleRunAiDiagnostics = () => {
    if (!aiInput.trim()) return;
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setAiResult({
        issue: aiInput,
        diagnosis: `SmartFix AI Diagnosis: The described fault indicates potential circuit board overload or capacitor degradation. Recommended physical inspection & multi-meter test.`,
        parts: ['16A Replacement Fuse/Breaker', 'Terminal Connector'],
        estCost: '350 - 550 ETB',
        recommendedTech: 'Dawit Abebe (4.95 ⭐ • Master Certified)'
      });
    }, 1100);
  };

  // Web Share API Implementation with Clipboard Fallback
  const handleShareService = async (service: ServiceItem) => {
    const shareTitle = `${getLocalizedServiceName(service)} - SmartFix Ethiopia`;
    const shareText = `Check out ${getLocalizedServiceName(service)} (${service.price} ETB) on SmartFix Addis Ababa! Verified master technicians with 30-day warranty.`;
    const shareUrl = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl
        });
      } catch (err) {
        // User cancelled or share dismissed
      }
    } else {
      // Clipboard fallback
      try {
        await navigator.clipboard.writeText(`${shareTitle}\n${shareText}\n${shareUrl}`);
        setShareSuccessToast(t.shareSuccess);
        setTimeout(() => setShareSuccessToast(null), 3500);
      } catch (err) {
        setShareSuccessToast('Service link ready to share!');
        setTimeout(() => setShareSuccessToast(null), 3000);
      }
    }
  };

  return (
    <div className="w-full max-w-md bg-[#FBFBFE] dark:bg-[#070B14] border-2 border-[#1E3A8A]/30 dark:border-[#2563EB]/40 rounded-[36px] shadow-[0_25px_60px_-15px_rgba(15,35,80,0.25)] dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col min-h-[850px] max-h-[920px] relative transition-colors duration-300">
      {/* Mobile Device Status Bar */}
      <div className="px-5 pt-2.5 pb-1 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-mono bg-white/50 dark:bg-[#070B14]/50">
        <span className="font-bold text-[12px] text-slate-900 dark:text-slate-100 tracking-tight">09:41</span>
        <div className="flex items-center gap-2">
          <span className="text-[9px] font-bold tracking-widest text-[#1D4ED8] dark:text-[#60A5FA]">ADDIS-5G</span>
          <div className="w-5 h-2.5 border border-slate-700 dark:border-slate-300 rounded-2xs p-0.5 flex items-center">
            <div className="w-3.5 h-full bg-[#1D4ED8] dark:bg-[#60A5FA] rounded-3xs" />
          </div>
        </div>
      </div>

      {/* GLOBAL SHARE TOAST */}
      {shareSuccessToast && (
        <div className="absolute top-14 inset-x-4 z-50 bg-[#0F1E3D] text-white border border-blue-400 px-4 py-2.5 rounded-2xl shadow-xl flex items-center justify-between animate-slide-down text-xs">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span className="font-bold text-blue-100">{shareSuccessToast}</span>
          </div>
          <button onClick={() => setShareSuccessToast(null)} className="text-slate-400 hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* ======================================================== */}
      {/* HEADER: Clean Brand Emblem, Location Picker, Language & Alerts */}
      {/* ======================================================== */}
      <header className="px-4 pt-2 pb-3 border-b border-slate-200/90 dark:border-slate-800/90 bg-gradient-to-b from-white/95 via-white/85 to-slate-50/80 dark:from-[#0A1224]/95 dark:via-[#090F1E]/90 dark:to-[#070B14]/90 backdrop-blur-xl shadow-xs relative z-30">
        <div className="flex items-center justify-between gap-2">
          {/* Brand Emblem & Location Picker */}
          <div className="flex items-center gap-2.5 min-w-0 cursor-pointer" onClick={() => setActiveNav('home')}>
            <SmartFixLogo variant="full" size="sm" showTagline={true} />
            <span className="hidden sm:inline-block text-[9px] font-mono uppercase bg-blue-50 dark:bg-blue-950/70 text-[#1E3A8A] dark:text-[#93C5FD] px-1.5 py-0.5 rounded-md font-bold border border-blue-200 dark:border-blue-800">
              Ethiopia
            </span>
          </div>

          {/* Right Action Suite: Language Switcher (Global Sign Only) & Notification Bell */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {/* Language Selector Button (Only Globe Sign) */}
            <button
              type="button"
              id="header-language-toggle"
              onClick={() => setShowLanguageModal(true)}
              className="p-2 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 text-[#1E3A8A] dark:text-[#93C5FD] hover:bg-slate-100 dark:hover:bg-slate-800 shadow-xs transition-all flex items-center justify-center"
              title="Change Language"
            >
              <Globe className="w-4 h-4 text-[#2563EB] dark:text-[#60A5FA]" />
            </button>

            {/* Notification Bell */}
            <button
              type="button"
              id="header-notification-bell"
              onClick={() => setActiveNav('notifications')}
              className="relative p-2 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:text-[#2563EB] dark:hover:text-[#60A5FA] shadow-xs transition-colors"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-[#2563EB] ring-2 ring-white dark:ring-[#0D1527] absolute top-1.5 right-1.5" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* ======================================================== */}
      {/* 5-LANGUAGE SELECTOR MODAL                                */}
      {/* ======================================================== */}
      {showLanguageModal && (
        <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-xs flex flex-col justify-end animate-fade-in">
          <div className="bg-white dark:bg-[#0B1326] border-t-2 border-[#1E3A8A]/50 rounded-t-[28px] p-5 shadow-2xl space-y-4 max-h-[80%] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-[#2563EB] flex items-center justify-center">
                  <Globe className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                    {t.switchLanguage}
                  </h3>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">Select preferred Ethiopian regional language</p>
                </div>
              </div>
              <button
                onClick={() => setShowLanguageModal(false)}
                className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              {LANGUAGE_OPTIONS.map((opt) => {
                const isSelected = language === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => {
                      onSetLanguage(opt.id);
                      setShowLanguageModal(false);
                    }}
                    className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-blue-50 dark:bg-blue-950/60 border-[#2563EB] shadow-xs'
                        : 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{opt.flag}</span>
                      <div>
                        <div className="font-extrabold text-xs text-slate-900 dark:text-white">
                          {opt.nativeName}
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono">{opt.label}</div>
                      </div>
                    </div>

                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-[#2563EB] text-white flex items-center justify-center">
                        <Check className="w-3 h-3" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* LOCATION PICKER MODAL (ALL ETHIOPIA & ADDIS ABABA HUBS)  */}
      {/* ======================================================== */}
      {showLocationModal && (
        <LocationPickerModal
          currentLocation={selectedLocation}
          language={language}
          onClose={() => setShowLocationModal(false)}
          onSelectLocation={(loc, gpsInfo) => {
            onSelectLocation(loc);
            if (gpsInfo) {
              setCustomerAddress(gpsInfo.fullAddress);
              setGpsCoords({ lat: gpsInfo.lat, lng: gpsInfo.lng });
              setIsGpsVerified(true);
            }
          }}
        />
      )}

      {/* ======================================================== */}
      {/* EMERGENCY SOS MODAL                                      */}
      {/* ======================================================== */}
      {showEmergencyModal && (
        <div className="absolute inset-0 z-50 bg-black/70 backdrop-blur-xs flex flex-col justify-end animate-fade-in">
          <div className="bg-white dark:bg-[#0B1326] border-t-2 border-red-500 rounded-t-[28px] p-5 shadow-2xl space-y-4 max-h-[85%] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-red-500/20 text-red-500 flex items-center justify-center">
                  <AlertOctagon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                    {t.emergencyModalTitle}
                  </h3>
                  <p className="text-[10px] text-slate-500">{t.emergencyModalDesc}</p>
                </div>
              </div>
              <button
                onClick={() => setShowEmergencyModal(false)}
                className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Select Emergency Repair Type:</p>
              <div className="grid grid-cols-2 gap-2">
                {services.slice(0, 4).map((srv) => (
                  <button
                    key={srv.id}
                    onClick={() => handleOpenBookingModal(srv, true)}
                    className="p-3 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50/50 dark:bg-red-950/20 hover:border-red-400 text-left transition-all"
                  >
                    <span className="font-extrabold text-xs text-slate-900 dark:text-white block truncate">
                      {getLocalizedServiceName(srv)}
                    </span>
                    <span className="text-[10px] font-mono text-red-600 dark:text-red-400 font-bold block mt-1 flex items-baseline gap-0.5">
                      <span className="text-[8.5px] font-normal text-slate-500 lowercase">{t.priceFrom}</span>
                      <span>{srv.price} ETB • Priority</span>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MAIN SCREEN BODY                                         */}
      {/* ======================================================== */}
      <div className="flex-1 overflow-y-auto px-3.5 py-3 space-y-3.5 pb-24">
        {/* ================= TAB 1: HOME ================= */}
        {activeNav === 'home' && (
          <div className="space-y-3.5">
            {/* Search Bar + AI Mode Option Beside Search Box */}
            <div className="flex items-center gap-2">
              <div
                onClick={() => setIsSearchOpen(true)}
                className="relative flex-1 cursor-pointer"
              >
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  readOnly
                  placeholder={t.searchPlaceholder}
                  onClick={() => setIsSearchOpen(true)}
                  onFocus={() => setIsSearchOpen(true)}
                  className="w-full pl-9 pr-3 py-2.5 bg-white dark:bg-[#0A1122] border border-slate-200/90 dark:border-slate-800 rounded-2xl text-xs text-slate-900 dark:text-white cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-[#2563EB] shadow-xs"
                />
              </div>

              {/* AI Mode Trigger Button Beside Search Box with Clear Short Word */}
              <button
                type="button"
                id="search-ai-mode-btn"
                onClick={() => setActiveNav('ai')}
                className="px-3 py-2.5 bg-gradient-to-r from-[#1E3A8A] to-[#2563EB] hover:from-[#1D4ED8] hover:to-[#3B82F6] text-white rounded-2xl text-xs font-bold flex items-center gap-1.5 shadow-md flex-shrink-0 active:scale-95 transition-all"
                title={t.aiModeDesc}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                <span className="font-black text-[11px] tracking-tight">Smart AI</span>
              </button>
            </div>

            {/* Hero Banner with Rotating Trust Slogans (Fitting side borders with minimal space) */}
            <div className="relative rounded-xl overflow-hidden border border-blue-900/40 shadow-lg min-h-[190px] bg-slate-950 flex flex-col justify-between p-3.5 -mx-1 sm:mx-0">
              <img
                src="https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=800&auto=format&fit=crop&q=80"
                alt="SmartFix Certified Techs in Addis"
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover brightness-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30" />

              {/* Text-Scrolling Trust Slogan Animation Bar */}
              <div className="relative z-10 flex items-center justify-between gap-2">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white shadow-xs">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
                  <div className="h-4.5 overflow-hidden relative flex items-center min-w-[170px] sm:min-w-[200px]">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={`${language}-${sloganIndex}`}
                        initial={{ y: 14, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -14, opacity: 0 }}
                        transition={{ duration: 0.35, ease: 'easeOut' }}
                        className="flex items-center gap-1.5 absolute inset-0"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-amber-300 flex-shrink-0" />
                        <span className="text-[11px] font-extrabold text-amber-300 tracking-tight whitespace-nowrap truncate">
                          {currentSlogans[sloganIndex % currentSlogans.length]}
                        </span>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
              </div>

              <div className="relative z-10 space-y-1 pt-3">
                <h3 className="text-base font-black text-white leading-tight drop-shadow-md">
                  {t.tagline}
                </h3>
                <p className="text-[11px] text-slate-200 leading-relaxed drop-shadow-xs max-w-[280px]">
                  {t.satisfactionGuarantee}
                </p>

                {/* Slogan Image Action Buttons: Explore & Emergency SOS Option */}
                <div className="pt-2 flex items-center gap-2">
                  <button
                    onClick={() => {
                      setSelectedCategory('all');
                      const el = document.getElementById('all-services-section');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="bg-[#1E3A8A] hover:bg-[#2563EB] text-white text-[11px] font-bold px-3 py-1.5 rounded-xl shadow-md flex items-center gap-1 transition-colors"
                  >
                    <span>{t.explore}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>

                  <button
                    onClick={() => setShowEmergencyModal(true)}
                    className="bg-red-600 hover:bg-red-700 text-white text-[11px] font-bold px-3 py-1.5 rounded-xl shadow-md flex items-center gap-1.5 transition-colors border border-red-400/40"
                  >
                    <AlertOctagon className="w-3.5 h-3.5 text-amber-300" />
                    <span>{t.emergency}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Popular Services Section (Clean Animated Cards & Indicator Dots) */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                  {t.popularServices}
                </h3>
                {/* Visual Moving Dots Indicator */}
                <div className="flex items-center gap-1">
                  <span className="w-2 h-1.5 rounded-full bg-blue-600 animate-pulse" />
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700" />
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700" />
                </div>
              </div>

              {/* Horizontal Scrollable Row with Automatic Scrolling */}
              <div
                ref={popularRowRef}
                onMouseEnter={() => setIsAutoScrolling(false)}
                onMouseLeave={() => setIsAutoScrolling(true)}
                onTouchStart={() => setIsAutoScrolling(false)}
                onTouchEnd={() => setIsAutoScrolling(true)}
                className="flex gap-2.5 overflow-x-auto pb-1.5 scrollbar-none snap-x touch-pan-x scroll-smooth"
              >
                {popularServices.map((service, index) => (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: index * 0.05 }}
                    whileHover={{ scale: 1.04, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex-shrink-0 w-36 bg-slate-900 rounded-lg overflow-hidden border border-slate-200/90 dark:border-slate-800 shadow-sm relative group h-28 cursor-pointer snap-start"
                    onClick={() => setSelectedService(service)}
                  >
                    <img
                      src={service.image}
                      alt={service.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 brightness-115 contrast-105"
                    />
                    {/* Bottom-only gradient for high legibility while keeping the rest of the image bright & clear */}
                    <div className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />

                    {/* Top rating badge */}
                    <div className="absolute top-1.5 right-1.5 z-10">
                      <div className="bg-black/60 backdrop-blur-xs px-1.5 py-0.5 rounded text-[8px] font-bold text-amber-300 flex items-center gap-0.5 border border-white/15 shadow-xs">
                        <Star className="w-2.5 h-2.5 fill-amber-300 text-amber-300" />
                        <span>{service.rating}</span>
                      </div>
                    </div>

                    {/* Bottom Info */}
                    <div className="absolute bottom-1.5 inset-x-2 flex items-end justify-between gap-1 z-10">
                      <div className="text-white min-w-0 pr-1">
                        <h4 className="text-[11px] font-black leading-tight truncate drop-shadow-md">
                          {getLocalizedServiceName(service)}
                        </h4>
                        <span className="text-[10px] font-extrabold text-amber-300 font-mono block leading-tight drop-shadow-md flex items-baseline gap-0.5">
                          <span className="text-[8px] font-normal text-slate-200 lowercase">{t.priceFrom}</span>
                          <span>{service.price} {t.etb}</span>
                        </span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenBookingModal(service);
                        }}
                        className="w-5 h-5 rounded-md bg-[#2563EB] text-white flex items-center justify-center shadow-md active:scale-95 transition-transform flex-shrink-0"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Main Categories Section (Single Line Horizontal Swipe) */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                  {t.categories}
                </h3>
              </div>

              <div className="flex gap-2 overflow-x-auto pb-1.5 scrollbar-none snap-x touch-pan-x">
                {categories.map((cat) => {
                  const IconComp = cat.icon;
                  const isSelected = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(selectedCategory === cat.id ? 'all' : cat.id)}
                      className={`flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-lg border transition-all snap-start whitespace-nowrap shadow-xs ${
                        isSelected
                          ? 'bg-[#1E3A8A] text-white border-[#2563EB] shadow-md ring-2 ring-blue-400/40'
                          : 'bg-white dark:bg-[#0B1326] border-slate-200/90 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-blue-400'
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 ${
                        isSelected
                          ? 'bg-white/20 text-white'
                          : 'bg-blue-50 dark:bg-blue-950/60 text-[#1D4ED8] dark:text-[#60A5FA]'
                      }`}>
                        <IconComp className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-[11px] font-extrabold tracking-tight">
                        {cat.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* All Services 2-Column Matrix (Very Little Curve rounded-xs, Maximized Square Size, Narrow Gap) */}
            <div id="all-services-section" className="space-y-2 pt-1">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                    {selectedCategory === 'all' ? t.allServices : categories.find(c => c.id === selectedCategory)?.name} ({filteredServices.length})
                  </h3>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                    {selectedCategory === 'all' 
                      ? resolveLocalizedCategoryDescription({ id: 'all' }, language) 
                      : resolveLocalizedCategoryDescription(INITIAL_CATEGORIES.find(c => c.id === selectedCategory), language)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-1.5 -mx-0.5">
                {filteredServices.map((service) => (
                  <div
                    key={service.id}
                    onClick={() => setSelectedService(service)}
                    className="relative aspect-square sm:aspect-[4/3] rounded-xs overflow-hidden border border-slate-200/90 dark:border-slate-800 shadow-sm group cursor-pointer bg-slate-900 flex flex-col justify-between p-2"
                  >
                    <img
                      src={service.image}
                      alt={service.name}
                      referrerPolicy="no-referrer"
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-115 contrast-105"
                    />
                    {/* Bottom gradient only so image is bright, clear & legible */}
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/90 via-black/45 to-transparent pointer-events-none" />

                    {/* Top rating badge on top-right only (No category text) */}
                    <div className="relative z-10 flex justify-end">
                      <div className="bg-black/60 backdrop-blur-xs px-1.5 py-0.5 rounded-2xs text-[9px] font-bold text-amber-300 flex items-center gap-0.5 border border-white/15 shadow-xs">
                        <Star className="w-2.5 h-2.5 fill-amber-300 text-amber-300" />
                        <span>{service.rating}</span>
                      </div>
                    </div>

                    {/* Bottom Content: Clean Bold Title, Price & Book Action */}
                    <div className="relative z-10 space-y-0.5">
                      <h4 className="text-[12px] sm:text-[13px] font-black text-white leading-snug tracking-tight drop-shadow-[0_1px_3px_rgba(0,0,0,0.95)] line-clamp-2">
                        {getLocalizedServiceName(service)}
                      </h4>

                      <div className="flex items-center justify-between gap-1 pt-0.5">
                        <div className="flex items-baseline gap-0.5">
                          <span className="text-[9px] font-normal text-slate-200 drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] lowercase">
                            {t.priceFrom}
                          </span>
                          <span className="text-[12px] sm:text-[13px] font-black text-white tracking-tight drop-shadow-[0_1px_3px_rgba(0,0,0,0.95)]">
                            {service.price} <span className="text-amber-400 text-[10px] font-bold">{t.etb}</span>
                          </span>
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenBookingModal(service);
                          }}
                          className="w-6 h-6 rounded-xs bg-[#2563EB] hover:bg-[#1D4ED8] text-white flex items-center justify-center shadow-md active:scale-95 transition-transform flex-shrink-0"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 2: REQUESTS FOLDER VAULT & RATING ================= */}
        {activeNav === 'requests' && (
          <div className="space-y-3">
            {/* Header & Folder Selector Tabs */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                  {t.activeOrders}
                </h3>
                <p className="text-[10px] text-slate-500 font-mono">Organized Service Folders & Warranties</p>
              </div>
              <span className="text-[10px] font-mono font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full border border-blue-200 dark:border-blue-800">
                {bookings.length} Total
              </span>
            </div>

            {/* Folder Sub-Tabs (Clean Folder Pills to prevent wide scrolling) */}
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 dark:bg-[#070D1A] rounded-2xl border border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setRequestsFolderTab('active')}
                className={`py-2 px-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
                  requestsFolderTab === 'active'
                    ? 'bg-[#1E3A8A] text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Folder className="w-3.5 h-3.5" />
                <span>Active</span>
                <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-blue-500/30 text-white font-mono">
                  {bookings.filter(b => b.status !== 'completed' && b.status !== 'cancelled').length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setRequestsFolderTab('completed')}
                className={`py-2 px-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
                  requestsFolderTab === 'completed'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Vault</span>
                <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-500/30 text-white font-mono">
                  {bookings.filter(b => b.status === 'completed').length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setRequestsFolderTab('cancelled')}
                className={`py-2 px-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
                  requestsFolderTab === 'cancelled'
                    ? 'bg-slate-700 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>History</span>
                <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-slate-500/30 text-white font-mono">
                  {bookings.filter(b => b.status === 'cancelled').length}
                </span>
              </button>
            </div>

            {/* Folder 1: ACTIVE REQUESTS */}
            {requestsFolderTab === 'active' && (
              <div className="space-y-3">
                {bookings.filter(b => b.status !== 'completed' && b.status !== 'cancelled').length > 0 ? (
                  bookings
                    .filter(b => b.status !== 'completed' && b.status !== 'cancelled')
                    .map((booking) => (
                      <div
                        key={booking.id}
                        className="p-4 bg-white dark:bg-[#0D1527] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] font-mono font-bold text-[#1D4ED8] dark:text-[#60A5FA]">
                                #{booking.id}
                              </span>
                              {booking.gpsVerified && (
                                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 flex items-center gap-0.5">
                                  <LocateFixed className="w-2.5 h-2.5" />
                                  <span>GPS Verified</span>
                                </span>
                              )}
                            </div>
                            <h4 className="font-extrabold text-sm text-slate-900 dark:text-white mt-0.5">
                              {getLocalizedServiceName(booking)}
                            </h4>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                              <MapPin className="w-3 h-3 text-slate-400 flex-shrink-0" />
                              <span className="truncate max-w-[200px]">{booking.address}</span>
                            </p>
                          </div>

                          <div className="text-right">
                            <span className="font-extrabold text-xs text-slate-900 dark:text-white block font-mono">
                              {booking.price} {t.etb}
                            </span>
                            <span
                              className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full inline-block mt-1 ${
                                booking.status === 'in_progress'
                                  ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border border-amber-300'
                                  : booking.status === 'in_route'
                                  ? 'bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-300'
                                  : 'bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800'
                              }`}
                            >
                              {booking.status === 'pending' ? t.statusPending :
                               booking.status === 'accepted' ? t.statusAccepted :
                               booking.status === 'in_route' ? t.statusInRoute : t.statusInProgress}
                            </span>
                          </div>
                        </div>

                        {/* 1. If Pending: Awaiting Technician Acceptance Card */}
                        {booking.status === 'pending' && (
                          <div className="p-3 bg-blue-50/80 dark:bg-blue-950/40 rounded-xl border border-blue-200 dark:border-blue-800/60 space-y-2.5">
                            <div className="flex items-start gap-2.5">
                              <div className="w-8 h-8 rounded-xl bg-blue-600/10 dark:bg-blue-400/10 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <Radio className="w-4 h-4 animate-pulse text-blue-600 dark:text-blue-400" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <span className="font-extrabold text-xs text-blue-950 dark:text-blue-200 block">
                                  {t.statusPendingAwaiting}
                                </span>
                                <p className="text-[10px] text-blue-800/80 dark:text-blue-300/80 leading-tight mt-0.5">
                                  {t.awaitingTechDesc}
                                </p>
                              </div>
                            </div>

                            {/* Technician acceptance CTA / simulation */}
                            {onAcceptBooking && technicians && technicians.length > 0 && (
                              <div className="pt-2 border-t border-blue-200/70 dark:border-blue-900/60 flex items-center justify-between gap-2">
                                <span className="text-[9px] font-mono text-slate-500 dark:text-slate-400">
                                  {t.technicianActionRequired}:
                                </span>
                                <button
                                  type="button"
                                  onClick={() => onAcceptBooking(booking.id, technicians[0].id)}
                                  className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[10px] shadow-xs flex items-center gap-1 transition-all"
                                >
                                  <Check className="w-3 h-3" />
                                  <span>{t.simulateAcceptance}</span>
                                </button>
                              </div>
                            )}
                          </div>
                        )}

                        {/* 2. If Accepted / In Route / In Progress: Assigned Technician Card */}
                        {booking.technicianName && (
                          <div className="p-2.5 bg-slate-50 dark:bg-[#080E1D] rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full bg-[#1E3A8A] text-white flex items-center justify-center font-bold text-xs">
                                {booking.technicianName.charAt(0)}
                              </div>
                              <div>
                                <span className="font-bold text-slate-800 dark:text-slate-200 block">{booking.technicianName}</span>
                                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">{t.statusAccepted}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-1.5">
                              {booking.technicianPhone && (
                                <a
                                  href={`tel:${booking.technicianPhone}`}
                                  className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20"
                                >
                                  <Phone className="w-3.5 h-3.5" />
                                </a>
                              )}
                              <button
                                type="button"
                                onClick={() => {
                                  setActivePopupAlert({
                                    id: `pop-${booking.id}`,
                                    type: 'accepted',
                                    title: t.alertAcceptedTitle,
                                    desc: `${booking.technicianName} ${t.alertAcceptedDesc}`,
                                    bookingId: booking.id,
                                    booking,
                                    technicianName: booking.technicianName,
                                    technicianPhone: booking.technicianPhone,
                                    serviceName: getLocalizedServiceName(booking),
                                    time: 'Just now'
                                  });
                                }}
                                title="View Pop-up Alert"
                                className="p-1.5 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500/20"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Action Buttons: GPS Tracking & Cancel */}
                        <div className="pt-1 flex items-center gap-2">
                          <button
                            onClick={() => setTrackingBooking(booking)}
                            className="flex-1 bg-gradient-to-r from-[#1D4ED8] to-[#2563EB] hover:from-[#1E40AF] hover:to-[#1D4ED8] text-white font-bold py-2 px-3 rounded-xl text-xs shadow-xs transition-all flex items-center justify-center gap-1.5"
                          >
                            <Radio className="w-3.5 h-3.5 text-cyan-300 animate-pulse" />
                            <span>{t.liveTracking}</span>
                          </button>

                          <button
                            onClick={() => {
                              setCancellingBooking(booking);
                              setSelectedCancelReason('Technician arrival took longer than expected');
                              setCancelNotes('');
                            }}
                            className="px-3 py-2 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50/80 dark:bg-red-950/30 hover:bg-red-100 text-red-700 dark:text-red-300 font-bold text-xs transition-all flex items-center gap-1"
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>{t.cancelRequest}</span>
                          </button>
                        </div>

                        {/* Automated OTP Verification Protocol */}
                        {(booking.status === 'accepted' || booking.status === 'in_route' || booking.status === 'in_progress') && (
                          <div className="p-3 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/30 rounded-xl border border-amber-300 dark:border-amber-700/50 space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1.5 text-amber-800 dark:text-amber-300 font-black text-xs">
                                <Lock className="w-3.5 h-3.5" />
                                <span>{t.startOtpLabel}</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <span className="text-sm font-black font-mono tracking-widest bg-white dark:bg-black/60 px-2.5 py-0.5 rounded-lg border border-amber-400 text-amber-700 dark:text-amber-300">
                                  {booking.startOtp || '4821'}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setActivePopupAlert({
                                      id: `pop-start-${booking.id}`,
                                      type: 'start_code',
                                      title: t.alertStartCodeTitle,
                                      desc: t.alertStartCodeDesc,
                                      bookingId: booking.id,
                                      booking,
                                      code: booking.startOtp || '4821',
                                      technicianName: booking.technicianName,
                                      technicianPhone: booking.technicianPhone,
                                      serviceName: getLocalizedServiceName(booking),
                                      time: 'Just now'
                                    });
                                  }}
                                  className="p-1 rounded-md bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200 hover:bg-amber-200 text-[10px]"
                                  title="View Pop-up Alert"
                                >
                                  <ExternalLink className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                            <p className="text-[10px] text-amber-900/80 dark:text-amber-200/90 leading-tight">
                              {t.startOtpNotice}
                            </p>

                            {booking.status === 'in_progress' && (
                              <div className="pt-2 mt-2 border-t border-amber-200 dark:border-amber-800/60 space-y-1">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-1.5 text-emerald-800 dark:text-emerald-300 font-black text-xs">
                                    <ShieldCheck className="w-3.5 h-3.5" />
                                    <span>{t.completionOtpLabel}</span>
                                  </div>
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-sm font-black font-mono tracking-widest bg-white dark:bg-black/60 px-2.5 py-0.5 rounded-lg border border-emerald-400 text-emerald-700 dark:text-emerald-300">
                                      {booking.completionOtp || '7394'}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setActivePopupAlert({
                                          id: `pop-comp-${booking.id}`,
                                          type: 'completed_code',
                                          title: t.alertCompletedCodeTitle,
                                          desc: t.alertCompletedCodeDesc,
                                          bookingId: booking.id,
                                          booking,
                                          code: booking.completionOtp || '7394',
                                          technicianName: booking.technicianName,
                                          technicianPhone: booking.technicianPhone,
                                          serviceName: getLocalizedServiceName(booking),
                                          amount: booking.price,
                                          time: 'Just now'
                                        });
                                      }}
                                      className="p-1 rounded-md bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 hover:bg-emerald-200 text-[10px]"
                                      title="View Pop-up Alert"
                                    >
                                      <ExternalLink className="w-3 h-3" />
                                    </button>
                                  </div>
                                </div>
                                <p className="text-[10px] text-emerald-900/80 dark:text-emerald-200/90 leading-tight">
                                  {t.completionOtpNotice}
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))
                ) : (
                  <div className="text-center py-10 bg-white dark:bg-[#0D1527] rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
                    <Folder className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
                    <p className="text-xs text-slate-500">No active dispatch orders</p>
                    <button
                      onClick={() => setActiveNav('home')}
                      className="text-xs font-bold text-[#1D4ED8] dark:text-[#60A5FA] hover:underline"
                    >
                      Browse Services & Book
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Folder 2: COMPLETED VAULT (With 30-Day Warranty & Rate Technician Prompt) */}
            {requestsFolderTab === 'completed' && (
              <div className="space-y-3">
                {bookings.filter(b => b.status === 'completed').length > 0 ? (
                  bookings
                    .filter(b => b.status === 'completed')
                    .map((booking) => (
                      <div
                        key={booking.id}
                        className="p-4 bg-white dark:bg-[#0D1527] rounded-2xl border border-emerald-200 dark:border-emerald-900/50 shadow-sm space-y-3"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400">
                              #{booking.id}
                            </span>
                            <h4 className="font-extrabold text-sm text-slate-900 dark:text-white mt-0.5">
                              {getLocalizedServiceName(booking)}
                            </h4>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                              <MapPin className="w-3 h-3 text-slate-400 flex-shrink-0" />
                              <span className="truncate max-w-[200px]">{booking.address}</span>
                            </p>
                          </div>

                          <div className="text-right">
                            <span className="font-extrabold text-xs text-slate-900 dark:text-white block font-mono">
                              {(booking.totalPrice ?? (booking.price + (booking.partsCost || 0)))} {t.etb}
                            </span>
                            {booking.paymentStatus === 'paid_direct' || booking.paymentStatus === 'settled' ? (
                              <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-300 inline-block mt-1">
                                Paid ({booking.paymentMethod?.replace('_', ' ') || 'Settled'})
                              </span>
                            ) : (
                              <button
                                onClick={() => setPayingBooking(booking)}
                                className="text-[9px] font-black uppercase px-2.5 py-1 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-xs inline-block mt-1 animate-pulse"
                              >
                                Pay Invoice Now
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Price Breakdown Banner if extra parts or payment pending */}
                        {booking.paymentStatus !== 'settled' && booking.paymentStatus !== 'paid_direct' && (
                          <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-xl border border-amber-300 dark:border-amber-700/60 flex items-center justify-between text-xs">
                            <div>
                              <span className="font-bold text-amber-900 dark:text-amber-200 block">
                                Repair Completed • Awaiting Payment
                              </span>
                              <span className="text-[10px] text-amber-700 dark:text-amber-300">
                                Labor: {booking.laborPrice ?? booking.price} ETB {booking.partsCost ? `+ Parts: ${booking.partsCost} ETB` : ''}
                              </span>
                            </div>
                            <button
                              onClick={() => setPayingBooking(booking)}
                              className="px-3 py-1.5 bg-[#0F1E3D] hover:bg-[#1E3A8A] text-white rounded-lg font-bold text-xs shadow-xs flex items-center gap-1"
                            >
                              <CreditCard className="w-3.5 h-3.5 text-amber-400" />
                              <span>Choose Payment</span>
                            </button>
                          </div>
                        )}

                        {/* Completed Technician Info */}
                        <div className="p-2.5 bg-slate-50 dark:bg-[#080E1D] rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-xs">
                              {(booking.technicianName || 'D').charAt(0)}
                            </div>
                            <div>
                              <span className="font-bold text-slate-800 dark:text-slate-200 block">
                                {booking.technicianName || 'Master Tech Dawit Abebe'}
                              </span>
                              <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                                <CheckCheck className="w-3 h-3" />
                                <span>Certified Repair Completed</span>
                              </span>
                            </div>
                          </div>

                          {/* Existing Rating Badge or Rate Button */}
                          {booking.rating ? (
                            <div className="flex items-center gap-1 bg-amber-400/20 text-amber-700 dark:text-amber-300 px-2 py-1 rounded-lg border border-amber-400/30 text-xs font-extrabold">
                              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                              <span>{booking.rating}.0 Rated</span>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setRatingBooking(booking)}
                              className="px-2.5 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-lg text-xs font-bold shadow-xs flex items-center gap-1"
                            >
                              <Star className="w-3.5 h-3.5 fill-white" />
                              <span>Rate Tech</span>
                            </button>
                          )}
                        </div>

                        {/* Rating comment & tags display if present */}
                        {booking.rating && (
                          <div className="p-2 bg-amber-50/70 dark:bg-amber-950/20 rounded-xl border border-amber-200 dark:border-amber-900/40 text-xs space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="font-extrabold text-[11px] text-amber-900 dark:text-amber-200">
                                Your Feedback:
                              </span>
                              {booking.tipAmount && (
                                <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300">
                                  Tip: +{booking.tipAmount} ETB
                                </span>
                              )}
                            </div>
                            {booking.ratingComment && (
                              <p className="text-[11px] text-slate-700 dark:text-slate-300 italic">
                                "{booking.ratingComment}"
                              </p>
                            )}
                            {booking.ratingTags && booking.ratingTags.length > 0 && (
                              <div className="flex flex-wrap gap-1 pt-0.5">
                                {booking.ratingTags.map((tag, tIdx) => (
                                  <span key={tIdx} className="text-[9px] font-bold bg-amber-200/70 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 px-1.5 py-0.2 rounded">
                                    ✓ {tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Technician Workmanship Warranty & Electronic Receipt Action Bar */}
                        {(() => {
                          const wDays = booking.category === 'solar' ? 90 : (booking.category === 'appliances' || booking.category === 'electronics_it') ? 60 : 30;
                          const wMonths = wDays === 90 ? '3-Month' : wDays === 60 ? '2-Month' : '30-Day';
                          return (
                            <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-300 dark:border-emerald-800 flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-300">
                              <div className="flex items-center gap-2 min-w-0 pr-2">
                                <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                                <div className="truncate">
                                  <span className="text-[11px] font-bold block truncate">
                                    {wMonths} Tech Workmanship Warranty
                                  </span>
                                  <span className="text-[9px] text-emerald-700/80 dark:text-emerald-400/80 truncate block">
                                    Pledged by {booking.technicianName || 'Master Tech'} • SmartFix Escrow Backed
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center gap-1.5 flex-shrink-0">
                                <button
                                  onClick={() => {
                                    const total = (booking.totalPrice ?? (booking.price + (booking.partsCost || 0)));
                                    const labor = booking.laborPrice ?? booking.price;
                                    const parts = booking.partsCost || 0;
                                    const commission = Math.round(labor * 0.10);
                                    const techNet = total - commission;
                                    setReceiptModalData({
                                      booking,
                                      txnId: `TB-ET-${booking.id.toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
                                      paymentMethod: (booking.paymentMethod as any) || 'telebirr',
                                      amount: total,
                                      laborPrice: labor,
                                      partsCost: parts,
                                      commission,
                                      technicianPayout: techNet,
                                      technicianName: booking.technicianName || 'Dawit Abebe',
                                      technicianAccount: '+251 91 123 4567',
                                      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                                      authCode: `AUTH-SF-${booking.id.slice(0, 6).toUpperCase()}`
                                    });
                                  }}
                                  className="px-2 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 font-bold text-[10px] flex items-center gap-1 shadow-xs hover:bg-blue-100"
                                >
                                  <Receipt className="w-3 h-3" />
                                  <span>E-Receipt</span>
                                </button>
                                <button
                                  onClick={() => setViewingCertificate({
                                    id: `SF-WAR-${booking.id.toUpperCase()}`,
                                    service: getLocalizedServiceName(booking),
                                    tech: booking.technicianName || 'Dawit Abebe',
                                    techSpecialty: booking.category.toUpperCase(),
                                    techPhone: booking.technicianPhone || '+251 91 123 4567',
                                    date: '2026-08-21',
                                    warrantyDays: wDays,
                                    warrantyEnd: wDays === 90 ? '2026-11-20 (3 Months)' : wDays === 60 ? '2026-10-20 (2 Months)' : '2026-09-20 (30 Days)',
                                    guaranteeType: `${wMonths} Direct Workmanship Guarantee`,
                                    escrowProtection: true,
                                    qrCodeText: `SMARTFIX-ETHIOPIA-WARRANTY-VERIFIED-${booking.id}`
                                  })}
                                  className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] flex items-center gap-1 shadow-xs"
                                >
                                  <FileCheck className="w-3 h-3" />
                                  <span>View Cert</span>
                                </button>
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    ))
                ) : (
                  <div className="text-center py-10 bg-white dark:bg-[#0D1527] rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
                    <ShieldCheck className="w-8 h-8 text-emerald-400 mx-auto" />
                    <p className="text-xs text-slate-500">No completed repairs yet</p>
                    <p className="text-[10px] text-slate-400">Completed jobs and 30-day warranty certificates will appear here.</p>
                  </div>
                )}
              </div>
            )}

            {/* Folder 3: CANCELLED & HISTORIC */}
            {requestsFolderTab === 'cancelled' && (
              <div className="space-y-3">
                {bookings.filter(b => b.status === 'cancelled').length > 0 ? (
                  bookings
                    .filter(b => b.status === 'cancelled')
                    .map((booking) => (
                      <div
                        key={booking.id}
                        className="p-4 bg-white dark:bg-[#0D1527] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2.5 opacity-90"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="text-[10px] font-mono font-bold text-slate-400">
                              #{booking.id}
                            </span>
                            <h4 className="font-extrabold text-sm text-slate-800 dark:text-slate-200 mt-0.5">
                              {getLocalizedServiceName(booking)}
                            </h4>
                            <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                              <MapPin className="w-3 h-3 text-slate-400 flex-shrink-0" />
                              <span className="truncate max-w-[200px]">{booking.address}</span>
                            </p>
                          </div>
                          <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-950/80 text-red-700 dark:text-red-300 border border-red-300">
                            Cancelled
                          </span>
                        </div>

                        {booking.cancellationReason && (
                          <div className="p-2 bg-red-50/60 dark:bg-red-950/20 rounded-xl border border-red-200 dark:border-red-900/40 text-[11px] text-red-700 dark:text-red-300">
                            <span className="font-bold">Cancellation Reason:</span> {booking.cancellationReason}
                          </div>
                        )}

                        <div className="pt-1 flex justify-end">
                          <button
                            type="button"
                            onClick={() => {
                              const matched = services.find(s => s.id === booking.serviceId) || services[0];
                              handleOpenBookingModal(matched);
                            }}
                            className="px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-bold text-xs border border-blue-200 dark:border-blue-800 hover:bg-blue-100 flex items-center gap-1.5"
                          >
                            <RotateCcw className="w-3 h-3" />
                            <span>Re-Book Service</span>
                          </button>
                        </div>
                      </div>
                    ))
                ) : (
                  <div className="text-center py-10 bg-white dark:bg-[#0D1527] rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
                    <CheckCircle className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
                    <p className="text-xs text-slate-500">No cancelled requests</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 3: AI STUDIO DIAGNOSTICS & MULTI-LENS ================= */}
        {activeNav === 'ai' && (
          <AiStudioDiagnostics
            services={services}
            language={language}
            onBookWithAiResult={(srv, initialNotes) => {
              handleOpenBookingModal(srv, false, initialNotes);
            }}
          />
        )}

        {/* ================= TAB 4: NOTIFICATIONS ================= */}
        {activeNav === 'notifications' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-1">
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                {t.navNotifications} ({notifications.length})
              </h3>
              {unreadCount > 0 && (
                <button
                  onClick={() => setNotifications(prev => prev.map(item => ({ ...item, unread: false })))}
                  className="text-xs font-bold text-[#2563EB] dark:text-[#60A5FA] hover:underline"
                >
                  Mark all as read
                </button>
              )}
            </div>

            <div className="space-y-2.5">
              {notifications.length === 0 ? (
                <div className="text-center py-10 bg-white dark:bg-[#0D1527] rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
                  <Bell className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300">{t.noNotifications}</p>
                  <p className="text-[11px] text-slate-500 max-w-xs mx-auto">{t.noNotificationsDesc}</p>
                </div>
              ) : (
                notifications.map((n) => {
                  const isAccepted = n.actionType === 'accepted' || n.type === 'accepted';
                  const isStartCode = n.actionType === 'start_code' || n.type === 'start_code';
                  const isCompletedCode = n.actionType === 'completed_code' || n.type === 'completed_code';

                  return (
                    <div
                      key={n.id}
                      className={`p-3.5 rounded-2xl border transition-all space-y-2.5 ${
                        n.unread
                          ? isAccepted
                            ? 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800/80 shadow-xs'
                            : isStartCode
                            ? 'bg-amber-50/60 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800/80 shadow-xs'
                            : isCompletedCode
                            ? 'bg-blue-50/60 dark:bg-blue-950/30 border-blue-300 dark:border-blue-800/80 shadow-xs'
                            : 'bg-blue-50/80 dark:bg-blue-950/50 border-blue-200 dark:border-blue-800'
                          : 'bg-white dark:bg-[#0D1527] border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2.5">
                        <div className="flex items-start gap-2.5">
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${
                            isAccepted
                              ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                              : isStartCode
                              ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                              : isCompletedCode
                              ? 'bg-blue-500/15 text-blue-600 dark:text-blue-400'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                          }`}>
                            {isAccepted ? (
                              <CheckCircle className="w-4 h-4" />
                            ) : isStartCode ? (
                              <Lock className="w-4 h-4" />
                            ) : isCompletedCode ? (
                              <ShieldCheck className="w-4 h-4" />
                            ) : (
                              <Bell className="w-4 h-4" />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className={`text-[9px] font-black uppercase px-1.5 py-0.2 rounded-md ${
                                isAccepted
                                  ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300'
                                  : isStartCode
                                  ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300'
                                  : isCompletedCode
                                  ? 'bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                              }`}>
                                {isAccepted
                                  ? t.statusAccepted
                                  : isStartCode
                                  ? t.startOtpLabel
                                  : isCompletedCode
                                  ? t.completionOtpLabel
                                  : 'Notice'}
                              </span>
                              {n.bookingId && (
                                <span className="text-[9px] font-mono text-slate-400">
                                  #{n.bookingId}
                                </span>
                              )}
                              {n.unread && (
                                <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
                              )}
                            </div>
                            <h4 className="font-extrabold text-xs text-slate-900 dark:text-white mt-1">
                              {n.title}
                            </h4>
                          </div>
                        </div>
                        <span className="text-[9px] font-mono text-slate-400 flex-shrink-0">{n.time}</span>
                      </div>

                      <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed pl-10">
                        {n.desc}
                      </p>

                      {/* Code Box for Start Code / Completed Code */}
                      {n.code && (
                        <div className="ml-10 p-2.5 rounded-xl bg-white dark:bg-black/50 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                          <div>
                            <span className="text-[9px] font-mono font-bold text-slate-500 dark:text-slate-400 block">
                              {isStartCode ? t.startOtpLabel : t.completionOtpLabel}:
                            </span>
                            <span className="text-lg font-black font-mono tracking-widest text-slate-900 dark:text-white">
                              {n.code}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopyAlertCode(n.code!);
                            }}
                            className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-[10px] font-bold flex items-center gap-1 transition-colors"
                          >
                            <Copy className="w-3 h-3" />
                            <span>{copiedCodeNotice === n.code ? t.codeCopied : t.copyCode}</span>
                          </button>
                        </div>
                      )}

                      {/* Action Bar: View Pop-up Message + Call Tech */}
                      <div className="ml-10 flex items-center gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => handleOpenAlertPopup(n)}
                          className="flex-1 py-1.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>{t.viewAlertPopup}</span>
                        </button>

                        {n.technicianPhone && (
                          <a
                            href={`tel:${n.technicianPhone}`}
                            className="py-1.5 px-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 text-[11px] font-bold flex items-center gap-1 hover:bg-emerald-100"
                          >
                            <Phone className="w-3 h-3" />
                            <span>Call</span>
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* ================= TAB 5: PREMIUM PROFILE ================= */}
        {activeNav === 'profile' && (
          <div className="space-y-4 pb-6">
            {/* VIP Member Metallic Gold & Navy Card - Screen-fitted phone width */}
            <div className="relative overflow-hidden rounded-2xl p-4 bg-gradient-to-br from-[#091122] via-[#0F1E3D] to-[#1E3A8A] text-white border border-amber-400/40 shadow-md space-y-3 w-full">
              <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 bg-amber-400/20 text-amber-300 border border-amber-400/40 px-2 py-0.5 rounded-full text-[9px] font-black tracking-wider uppercase">
                  <Award className="w-3 h-3 text-amber-400" />
                  <span>{t.vipTier}</span>
                </div>
                <span className="text-[10px] text-amber-300 font-mono font-bold">ET-SF-8921-VIP</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-400 via-amber-200 to-amber-500 text-slate-950 flex items-center justify-center font-black text-lg shadow-md border border-amber-200 flex-shrink-0">
                  {customerName.charAt(0)}
                </div>
                <div className="min-w-0">
                  <h3 className="font-extrabold text-sm text-white tracking-tight truncate">{customerName}</h3>
                  <p className="text-xs text-blue-200 font-mono">{customerPhone}</p>
                </div>
              </div>

              {/* VIP Benefits Badges */}
              <div className="pt-2 border-t border-white/10 grid grid-cols-2 gap-1.5 text-[10px]">
                <div className="flex items-center gap-1 text-blue-200">
                  <ShieldCheck className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                  <span className="truncate">30-Day Guaranteed Warranty</span>
                </div>
                <div className="flex items-center gap-1 text-blue-200">
                  <Zap className="w-3 h-3 text-amber-400 flex-shrink-0" />
                  <span className="truncate">Priority &lt;15m Dispatch</span>
                </div>
              </div>
            </div>

            {/* Group 1: Account & Preferences */}
            <div className="space-y-1.5">
              <h4 className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider px-1">
                Account & Settings
              </h4>
              <div className="bg-white dark:bg-[#0D1527] border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-2xs divide-y divide-slate-100 dark:divide-slate-800/80">
                {/* Settings & Preferences */}
                <button
                  type="button"
                  onClick={() => setShowSettingsModal(true)}
                  className="w-full p-3.5 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-[#0A101F] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center flex-shrink-0">
                      <Settings className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 dark:text-white block">
                        {t.appPreferences}
                      </span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400">
                        SMS OTP, Push radar alerts
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>

                {/* Payment Methods */}
                <button
                  type="button"
                  onClick={() => setShowAddPaymentModal(true)}
                  className="w-full p-3.5 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-[#0A101F] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
                      <CreditCard className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 dark:text-white block">
                        {t.paymentMethods}
                      </span>
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                        Telebirr (Linked) • CBE Birr • Cash
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>

                {/* Saved Addresses */}
                <button
                  type="button"
                  onClick={() => setShowSavedAddressesModal(true)}
                  className="w-full p-3.5 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-[#0A101F] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 dark:text-white block">
                        {t.savedAddresses}
                      </span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400">
                        {savedAddressesList.length} saved places ({savedAddressesList[0]?.label})
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>

                {/* Language Selection */}
                <button
                  type="button"
                  onClick={() => setShowLanguageModal(true)}
                  className="w-full p-3.5 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-[#0A101F] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center flex-shrink-0">
                      <Globe className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 dark:text-white block">
                        {t.switchLanguage}
                      </span>
                      <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold uppercase">
                        {LANGUAGE_OPTIONS.find(o => o.id === language)?.nativeName}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>
              </div>
            </div>

            {/* Group 2: Support & Legal */}
            <div className="space-y-1.5">
              <h4 className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider px-1">
                Support, Safety & Legal
              </h4>
              <div className="bg-white dark:bg-[#0D1527] border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-2xs divide-y divide-slate-100 dark:divide-slate-800/80">
                {/* Verified Digital Warranty Vault */}
                <button
                  type="button"
                  onClick={() => setViewingCertificate({
                    id: 'SF-WAR-8821',
                    service: 'TV & Circuit Board Overhaul',
                    tech: 'Master Tech Dawit Abebe',
                    techSpecialty: 'ELECTRONICS & CIRCUITS',
                    techPhone: '+251 91 123 4567',
                    date: '2026-08-21',
                    warrantyDays: 60,
                    warrantyEnd: '2026-10-20 (2 Months)',
                    guaranteeType: '60-Day Workmanship Guarantee',
                    escrowProtection: true,
                    qrCodeText: 'SMARTFIX-ETHIOPIA-WARRANTY-VERIFIED-SF8821'
                  })}
                  className="w-full p-3.5 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-[#0A101F] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 dark:text-white block">
                        {t.warrantyCertificates}
                      </span>
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                        1 Active Guarantee (Sept 2026)
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>

                {/* 24/7 SmartFix Emergency SOS */}
                <a
                  href="tel:+251911002233"
                  className="w-full p-3.5 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-[#0A101F] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-red-600 dark:text-red-400 block">
                        {t.emergencyHotline}
                      </span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400">
                        +251 911 002233 (Addis Dispatch Center)
                      </span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-lg bg-red-600 text-white font-bold text-[10px]">
                    Call SOS
                  </span>
                </a>

                {/* Privacy Policy */}
                <button
                  type="button"
                  onClick={() => setShowPrivacyModal(true)}
                  className="w-full p-3.5 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-[#0A101F] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center flex-shrink-0">
                      <Lock className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 dark:text-white block">
                        Privacy Policy
                      </span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400">
                        Data protection & customer security terms
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>

                {/* Terms of Service */}
                <button
                  type="button"
                  onClick={() => setShowTermsModal(true)}
                  className="w-full p-3.5 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-[#0A101F] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 dark:text-white block">
                        Terms of Service
                      </span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400">
                        Warranties, rates & technician standards
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>
              </div>
            </div>

            {/* App Build & Sync */}
            <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 px-2">
              <span>SmartFix v2.4.0 • Addis Ababa</span>
              <button
                type="button"
                onClick={() => {
                  setShareSuccessToast('Profile synced & verified with Addis Cloud.');
                  setTimeout(() => setShareSuccessToast(null), 2500);
                }}
                className="font-bold text-blue-600 dark:text-blue-400 hover:underline"
              >
                Sync Profile
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* SERVICE DETAILS MODAL (WITH WEB SHARE API BUTTON)        */}
      {/* ======================================================== */}
      {selectedService && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white dark:bg-[#0B1326] border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-2xl space-y-4">
            <div className="relative h-44 bg-slate-950">
              <img
                src={selectedService.image}
                alt={selectedService.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover brightness-115 contrast-105"
              />
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />

              {/* Close Button */}
              <button
                onClick={() => setSelectedService(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Web Share Button on Image */}
              <button
                onClick={() => handleShareService(selectedService)}
                className="absolute top-3 left-3 px-2.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-bold flex items-center gap-1.5 hover:bg-black/80 border border-white/20 shadow-md"
                title={t.shareService}
              >
                <Share2 className="w-3.5 h-3.5 text-blue-400" />
                <span>{t.shareService}</span>
              </button>

              <div className="absolute bottom-3 left-4 right-4 text-white z-10">
                <h3 className="font-extrabold text-base leading-tight drop-shadow-md">
                  {getLocalizedServiceName(selectedService)}
                </h3>
                <span className="text-amber-300 text-xs font-mono font-bold drop-shadow-sm flex items-baseline gap-1">
                  <span className="text-[10px] font-normal text-amber-200/90 lowercase">{t.priceFrom}</span>
                  <span>{selectedService.price} {t.etb}</span>
                </span>
              </div>
            </div>

            <div className="px-5 pb-5 space-y-3 text-xs">
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                {getLocalizedServiceDescription(selectedService)}
              </p>
              
              <div className="p-3 bg-slate-50 dark:bg-[#091122] rounded-xl border border-slate-200 dark:border-slate-800 space-y-1.5">
                <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>30-Day SmartFix Guarantee</span>
                </div>
                <p className="text-[10px] text-slate-500">Free re-inspection if issue recurs within 30 days.</p>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  onClick={() => handleShareService(selectedService)}
                  className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-400 text-slate-700 dark:text-slate-200 flex items-center justify-center"
                  title={t.shareService}
                >
                  <Share2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleOpenBookingModal(selectedService)}
                  className="flex-1 bg-[#1E3A8A] hover:bg-[#2563EB] text-white font-bold py-3 rounded-xl text-xs shadow-md transition-colors"
                >
                  {t.bookNow}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* BOOKING CONFIRMATION MODAL                               */}
      {/* ======================================================== */}
      {bookingModalService && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white dark:bg-[#0B1326] border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">Confirm Booking</h3>
                <span className="text-[10px] text-slate-500 font-mono flex items-baseline gap-1">
                  <span>{getLocalizedServiceName(bookingModalService)} •</span>
                  <span className="text-[9px] font-normal lowercase">{t.priceFrom}</span>
                  <span>{bookingModalService.price} {t.etb}</span>
                </span>
              </div>
              <button
                onClick={() => setBookingModalService(null)}
                className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmBooking} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Your Full Name</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#080E1B] text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Phone Number (Addis Ababa)</label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#080E1B] text-slate-900 dark:text-white font-mono"
                />
              </div>

              {/* LOCATION SECTION: PRESENT GPS FIRST (FORCING SATELLITE PERMISSION) WITH MANUAL OPTION */}
              <div className="space-y-2 pt-1 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <label className="block font-extrabold text-slate-900 dark:text-white text-xs">
                      Repair Location
                    </label>
                    <span className="text-[9px] font-black px-1.5 py-0.5 rounded-md bg-blue-100 dark:bg-blue-950 text-[#1E3A8A] dark:text-blue-300 font-mono">
                      GPS First
                    </span>
                  </div>

                  {/* Mode Switch Pills */}
                  <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-xl text-[10px]">
                    <button
                      type="button"
                      onClick={() => {
                        setLocationInputMode('gps');
                        if (!isGpsVerified) handleAutoFillGps(true);
                      }}
                      className={`px-2 py-0.5 rounded-lg font-bold transition-all flex items-center gap-1 ${
                        locationInputMode === 'gps'
                          ? 'bg-[#1E3A8A] text-white shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <Compass className="w-3 h-3 text-amber-400" />
                      <span>GPS Lock</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setLocationInputMode('manual')}
                      className={`px-2 py-0.5 rounded-lg font-bold transition-all flex items-center gap-1 ${
                        locationInputMode === 'manual'
                          ? 'bg-[#1E3A8A] text-white shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>Manual</span>
                    </button>
                  </div>
                </div>

                {/* MODE 1: GPS DEFAULT (FORCING SATELLITE PERMISSION PROMPT FIRST) */}
                {locationInputMode === 'gps' && (
                  <div className="space-y-2">
                    {/* While Locating / Requesting Browser Permission */}
                    {isLocatingGps && (
                      <div className="p-3.5 rounded-2xl bg-blue-50/90 dark:bg-blue-950/40 border-2 border-blue-400/70 dark:border-blue-700 space-y-2 animate-pulse">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center animate-spin flex-shrink-0 shadow-xs">
                            <Compass className="w-4 h-4 text-amber-300" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between">
                              <h4 className="font-extrabold text-xs text-blue-950 dark:text-blue-100">
                                Acquiring Present Location...
                              </h4>
                              <span className="text-[9px] font-mono text-blue-600 dark:text-blue-400 font-bold">
                                GPS Radar
                              </span>
                            </div>
                            <p className="text-[10px] text-blue-800/90 dark:text-blue-200/90 mt-0.5 leading-snug">
                              Please click <strong>"Allow"</strong> on your browser prompt to pinpoint your exact Ethiopian repair location.
                            </p>
                          </div>
                        </div>
                        <div className="pt-1.5 flex items-center justify-between border-t border-blue-200 dark:border-blue-900/60 text-[10px]">
                          <button
                            type="button"
                            onClick={() => handleAutoFillGps(true)}
                            className="font-bold text-blue-700 dark:text-blue-300 hover:underline flex items-center gap-1"
                          >
                            <RotateCw className="w-2.5 h-2.5" />
                            <span>Re-prompt Permission</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setLocationInputMode('manual')}
                            className="font-bold text-slate-600 dark:text-slate-300 hover:text-blue-600 underline"
                          >
                            Or fill manually →
                          </button>
                        </div>
                      </div>
                    )}

                    {/* If Permission Denied or Failed */}
                    {!isLocatingGps && gpsPermissionState === 'denied' && !isGpsVerified && (
                      <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700/80 space-y-2">
                        <div className="flex items-start gap-2 text-amber-900 dark:text-amber-200">
                          <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                          <div className="min-w-0 flex-1">
                            <span className="font-bold text-xs block">GPS Permission Denied or Unavailable</span>
                            <p className="text-[10px] text-amber-800/90 dark:text-amber-300/90 leading-tight mt-0.5">
                              Location access was denied or not supported. You can retry permission or enter your address manually.
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => handleAutoFillGps(true)}
                            className="px-2.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-[10px] flex items-center gap-1 shadow-xs transition-colors"
                          >
                            <RotateCw className="w-3 h-3" />
                            <span>Retry Permission</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setLocationInputMode('manual')}
                            className="px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-700 text-slate-800 dark:text-slate-200 font-bold text-[10px] hover:bg-amber-100/50"
                          >
                            Fill Address Manually
                          </button>
                        </div>
                      </div>
                    )}

                    {/* If GPS Verified (Acquired) */}
                    {!isLocatingGps && isGpsVerified && (
                      <div className="p-3 rounded-2xl bg-emerald-50/90 dark:bg-emerald-950/40 border-2 border-emerald-500/60 dark:border-emerald-600/50 space-y-2 shadow-xs">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-start gap-2.5 min-w-0">
                            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs">
                              <LocateFixed className="w-4 h-4" />
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className="font-extrabold text-xs text-emerald-950 dark:text-emerald-100">
                                  ✓ Present Location Locked
                                </span>
                                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-200 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-100 font-bold">
                                  ±{gpsAccuracy || 4}m
                                </span>
                              </div>
                              <p className="text-[11px] font-bold text-slate-800 dark:text-slate-200 truncate mt-0.5">
                                {customerAddress}
                              </p>
                              {gpsCoords && (
                                <p className="text-[9px] font-mono text-emerald-700 dark:text-emerald-400 mt-0.5">
                                  Coordinates: {gpsCoords.lat.toFixed(5)}°N, {gpsCoords.lng.toFixed(5)}°E
                                </p>
                              )}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleAutoFillGps(true)}
                            title="Refresh GPS Satellite Fix"
                            className="p-1.5 rounded-lg text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 flex-shrink-0"
                          >
                            <RotateCw className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Additional Gate / Apt Details (Optional add-on to GPS) */}
                        <div className="pt-2 border-t border-emerald-200/80 dark:border-emerald-900/80">
                          <div className="flex items-center justify-between mb-1">
                            <label className="text-[10px] text-slate-600 dark:text-slate-400 font-bold">
                              House, Apartment # or Gate Landmark (Optional):
                            </label>
                            <button
                              type="button"
                              onClick={() => setLocationInputMode('manual')}
                              className="text-[10px] font-bold text-blue-600 dark:text-blue-400 hover:underline"
                            >
                              Edit address manually →
                            </button>
                          </div>
                          <input
                            type="text"
                            value={additionalGateInfo}
                            onChange={(e) => setAdditionalGateInfo(e.target.value)}
                            placeholder="e.g. House #402, 2nd Floor, Blue Metal Gate"
                            className="w-full p-2.5 text-xs rounded-xl border border-emerald-300 dark:border-emerald-800/80 bg-white dark:bg-[#080E1B] text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* MODE 2: MANUAL FILL OPTION */}
                {locationInputMode === 'manual' && (
                  <div className="space-y-2 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-[#080E1D]">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                        Enter Street / Landmark Manually:
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setLocationInputMode('gps');
                          handleAutoFillGps(true);
                        }}
                        className="text-[10px] font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                      >
                        <Compass className="w-3 h-3 text-blue-500" />
                        <span>Switch to Present GPS</span>
                      </button>
                    </div>

                    {/* Quick Ethiopian Neighborhood Selector Chips */}
                    <div className="space-y-1">
                      <span className="text-[9px] text-slate-500 font-mono">Popular Addis Ababa Zones:</span>
                      <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
                        {['Bole Atlas', 'Kazanchis', 'CMC Summit', 'Sarbet', 'Piassa', 'Gerji', 'Lebu', 'Megenagna', 'Ayat'].map((nh) => (
                          <button
                            key={nh}
                            type="button"
                            onClick={() => {
                              setCustomerAddress(`${nh}, Addis Ababa`);
                              setIsGpsVerified(false);
                            }}
                            className="flex-shrink-0 px-2 py-1 rounded-lg text-[10px] font-bold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-blue-400 text-slate-700 dark:text-slate-300"
                          >
                            {nh}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Saved Address Quick Selector Chips */}
                    {savedAddressesList.length > 0 && (
                      <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
                        {savedAddressesList.map((addr) => {
                          const isSelected = customerAddress === addr.address;
                          return (
                            <button
                              key={addr.id}
                              type="button"
                              onClick={() => {
                                setCustomerAddress(addr.address);
                                setIsGpsVerified(false);
                              }}
                              className={`flex-shrink-0 px-2 py-0.5 rounded-lg text-[10px] font-bold border transition-all flex items-center gap-1 ${
                                isSelected
                                  ? 'bg-blue-600 text-white border-blue-700 shadow-2xs'
                                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-blue-400'
                              }`}
                            >
                              <MapPin className="w-2.5 h-2.5" />
                              <span>{addr.label}</span>
                              {addr.isDefault && <span className="text-[8px] opacity-80">(Default)</span>}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* Address Textarea / Input */}
                    <div className="relative">
                      <input
                        type="text"
                        required
                        placeholder="e.g. Bole Atlas, Near Edna Mall, House 402"
                        value={customerAddress}
                        onChange={(e) => {
                          setCustomerAddress(e.target.value);
                          setIsGpsVerified(false);
                        }}
                        className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#070B14] text-slate-900 dark:text-white pr-8 text-xs focus:ring-1 focus:ring-blue-500"
                      />
                      <MapPin className="w-4 h-4 text-slate-400 absolute right-2.5 top-2.5" />
                    </div>

                    {/* Button to open All-Ethiopia Hubs modal */}
                    <button
                      type="button"
                      onClick={() => setShowLocationModal(true)}
                      className="w-full py-2 rounded-xl border border-dashed border-blue-300 dark:border-blue-900 bg-blue-50/60 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 text-[10px] font-bold flex items-center justify-center gap-1.5 hover:bg-blue-100/60 transition-colors"
                    >
                      <Globe className="w-3.5 h-3.5 text-blue-500" />
                      <span>Browse All Ethiopia Hubs & Regional Zones</span>
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Problem Description / Notes</label>
                <textarea
                  rows={2}
                  placeholder="e.g. TV screen black, pipe leaking under kitchen sink..."
                  value={customerNotes}
                  onChange={(e) => setCustomerNotes(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#080E1B] text-slate-900 dark:text-white"
                />
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#080E1B] border border-slate-200 dark:border-slate-800/80 flex items-start gap-2 text-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                  {t.paymentDirectNotice}
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#1E3A8A] to-[#2563EB] hover:from-[#1E3A8A] hover:to-[#1D4ED8] text-white font-extrabold py-3 rounded-xl shadow-md transition-transform active:scale-95"
                >
                  {isUrgent ? 'Dispatch Priority Master Tech (<15 min)' : 'Confirm & Dispatch Master Tech'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* LIVE GPS TECHNICIAN TRACKING MODAL                       */}
      {/* ======================================================== */}
      {trackingBooking && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 animate-fade-in">
          <div className="w-full max-w-sm bg-white dark:bg-[#0B1326] border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-2xl space-y-3 max-h-[92vh] flex flex-col">
            {/* Header */}
            <div className="px-4 pt-3.5 pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <Radio className="w-4 h-4 text-blue-500 animate-pulse" />
                </div>
                <div>
                  <h3 className="font-extrabold text-xs text-slate-900 dark:text-white">
                    {t.liveTracking}
                  </h3>
                  <div className="flex items-center gap-1.5 text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    <span>GPS 10Hz Lock Active</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setTrackingBooking(null)}
                className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="px-4 pb-4 space-y-3 overflow-y-auto">
              {/* Real Interactive Google Maps Live Tracking */}
              {(() => {
                const assignedTech = technicians.find(t => t.id === trackingBooking.technicianId) || technicians[0];
                return (
                  <div className="overflow-hidden rounded-2xl border border-blue-400/30 shadow-inner">
                    <SmartFixLiveMap
                      technician={assignedTech}
                      otherTechnicians={technicians}
                      customerBooking={trackingBooking}
                      showDirections={true}
                      showOtherTechs={false}
                      height="220px"
                      mode="customer"
                    />
                  </div>
                );
              })()}

              {/* ETA & Distance Card */}
              <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/30 rounded-2xl border border-blue-200 dark:border-blue-800/80 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                    {t.estimatedArrival}
                  </span>
                  <div className="flex items-baseline gap-1.5 mt-0.5">
                    <span className="text-base font-black text-[#1D4ED8] dark:text-[#60A5FA]">6 Mins</span>
                    <span className="text-xs text-slate-500 font-mono">(1.4 km away)</span>
                  </div>
                </div>
                <div className="text-right text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950 px-2 py-1 rounded-xl border border-emerald-300 dark:border-emerald-800">
                  On Schedule
                </div>
              </div>

              {/* Technician Info & Call */}
              <div className="p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-[#080E1D] flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-[#1E3A8A] text-white flex items-center justify-center font-bold text-sm shadow-xs">
                    {(trackingBooking.technicianName || 'Dawit').charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-900 dark:text-white">
                      {trackingBooking.technicianName || 'Dawit Abebe'}
                    </h4>
                    <p className="text-[10px] text-slate-500">Master Certified • 4.95 ⭐</p>
                    <span className="text-[9px] font-mono text-[#1D4ED8] dark:text-[#60A5FA] font-bold">
                      Vehicle: ET-AA-3-88941
                    </span>
                  </div>
                </div>

                <a
                  href={`tel:${trackingBooking.technicianPhone || '+251911234567'}`}
                  className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs flex items-center gap-1 font-bold text-xs"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call</span>
                </a>
              </div>

              {/* Real-time Journey Steps */}
              <div className="space-y-2 text-xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Trip Progress
                </span>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-[11px]">
                    <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>Technician Dispatched from Meskel Square Hub</span>
                  </div>
                  <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-[11px]">
                    <Radio className="w-3.5 h-3.5 flex-shrink-0 animate-pulse" />
                    <span>Driving on Bole Road (Near Atlas Junction)</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                    <div className="w-3.5 h-3.5 rounded-full border-2 border-slate-300 dark:border-slate-700 flex-shrink-0" />
                    <span>Arrival at your residence & Start OTP Verification</span>
                  </div>
                </div>
              </div>

              {/* Gate Note / Quick Direction message */}
              <div className="pt-1">
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    placeholder="e.g. Ring doorbell #4, blue gate..."
                    value={trackingNote}
                    onChange={(e) => setTrackingNote(e.target.value)}
                    className="flex-1 p-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#070B14] text-slate-900 dark:text-white"
                  />
                  <button
                    onClick={() => {
                      if (!trackingNote.trim()) return;
                      setTrackingNoteSent(true);
                      setTimeout(() => setTrackingNoteSent(false), 3000);
                      setTrackingNote('');
                    }}
                    className="px-3 bg-[#1E3A8A] hover:bg-[#2563EB] text-white rounded-xl font-bold text-xs flex items-center gap-1"
                  >
                    <Send className="w-3 h-3" />
                  </button>
                </div>
                {trackingNoteSent && (
                  <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold mt-1">
                    ✓ Gate direction dispatched to driver
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* CANCELLATION WARNING & REASON MODAL                      */}
      {/* ======================================================== */}
      {cancellingBooking && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="w-full max-w-sm bg-white dark:bg-[#0B1326] border border-red-300 dark:border-red-900/60 rounded-3xl p-5 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                <div className="w-8 h-8 rounded-xl bg-red-100 dark:bg-red-950/60 flex items-center justify-center">
                  <ShieldAlert className="w-4 h-4 text-red-600" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                    {t.cancelRequest}
                  </h3>
                  <span className="text-[10px] text-slate-500 font-mono">Order #{cancellingBooking.id}</span>
                </div>
              </div>
              <button
                onClick={() => setCancellingBooking(null)}
                className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Warning Banner */}
            <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-2xl border border-amber-300 dark:border-amber-700 text-xs text-amber-900 dark:text-amber-200 space-y-1">
              <div className="flex items-center gap-1.5 font-bold">
                <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <span>{t.cancelWarning}</span>
              </div>
              <p className="text-[10px] text-amber-800/90 dark:text-amber-300/90 leading-tight">
                Cancelling will release your reserved technician and reset your priority dispatch queue.
              </p>
            </div>

            {/* Cancellation Reason Selection */}
            <div className="space-y-2 text-xs">
              <label className="font-extrabold text-slate-900 dark:text-white block">
                {t.selectCancelReason}
              </label>
              <div className="space-y-1.5">
                {CANCELLATION_REASONS.map((reason) => (
                  <label
                    key={reason}
                    className={`p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${
                      selectedCancelReason === reason
                        ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-500 text-blue-950 dark:text-blue-100 font-bold'
                        : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="cancel_reason"
                      checked={selectedCancelReason === reason}
                      onChange={() => setSelectedCancelReason(reason)}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-xs">{reason}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Optional Additional Notes */}
            <div className="space-y-1 text-xs">
              <label className="font-bold text-slate-700 dark:text-slate-300 block">
                {t.cancelNotesPlaceholder} (Optional)
              </label>
              <textarea
                rows={2}
                value={cancelNotes}
                onChange={(e) => setCancelNotes(e.target.value)}
                placeholder="Tell us what we could improve..."
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#080E1B] text-slate-900 dark:text-white"
              />
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex gap-2">
              <button
                type="button"
                onClick={() => setCancellingBooking(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-50"
              >
                {t.keepBooking}
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs shadow-md transition-colors"
              >
                {t.confirmCancel}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* VERIFIED DIGITAL WORKMANSHIP WARRANTY CERTIFICATE MODAL   */}
      {/* ======================================================== */}
      {viewingCertificate && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="w-full max-w-sm bg-gradient-to-b from-[#0F1E3D] via-[#091122] to-[#040812] border-2 border-amber-400/60 rounded-3xl p-5 text-white shadow-2xl space-y-3.5 max-h-[90vh] overflow-y-auto relative">
            <div className="flex items-center justify-between pb-2 border-b border-amber-400/20">
              <div className="flex items-center gap-2 text-amber-300 font-extrabold text-xs">
                <Award className="w-5 h-5 text-amber-400" />
                <span>Certified Workmanship Guarantee</span>
              </div>
              <button
                onClick={() => setViewingCertificate(null)}
                className="w-7 h-7 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-center space-y-1">
              <span className="text-[9px] font-mono tracking-widest text-amber-300 uppercase px-2 py-0.5 bg-amber-400/10 rounded-full border border-amber-400/30">
                {viewingCertificate.guaranteeType || `${viewingCertificate.warrantyDays}-Day Guarantee`}
              </span>
              <h3 className="font-black text-lg text-white tracking-tight">{viewingCertificate.service}</h3>
              <p className="text-[11px] text-blue-200">
                Primary Obligor: <span className="font-bold text-white">{viewingCertificate.tech}</span>
              </p>
            </div>

            {/* Certificate Details Plate */}
            <div className="p-3.5 bg-black/50 rounded-2xl border border-amber-400/30 space-y-2 text-xs font-mono">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400">CERTIFICATE NO:</span>
                <span className="font-bold text-amber-300">{viewingCertificate.id}</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400">ISSUED DATE:</span>
                <span className="font-bold text-white">{viewingCertificate.date}</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400">WARRANTY EXPIRES:</span>
                <span className="font-bold text-emerald-400">{viewingCertificate.warrantyEnd}</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400">SERVICE SPECIALTY:</span>
                <span className="font-bold text-blue-300">{viewingCertificate.techSpecialty || 'CERTIFIED TRADE'}</span>
              </div>
            </div>

            {/* Legal Liability & Responsibility Terms */}
            <div className="p-3 bg-blue-950/40 rounded-2xl border border-blue-800/60 text-[11px] space-y-2 text-slate-300">
              <div className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block text-[11px]">1. Technician Direct Liability:</span>
                  <p className="text-[10px] text-slate-300 leading-relaxed">
                    Certified Technician <strong className="text-white">{viewingCertificate.tech}</strong> is contractually & legally obligated to provide 100% free corrective repair if the identical issue recurs during this warranty period.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2 pt-1 border-t border-blue-900/60">
                <Lock className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block text-[11px]">2. SmartFix Escrow Shield (Default Protection):</span>
                  <p className="text-[10px] text-slate-300 leading-relaxed">
                    If the assigned technician is unresponsive, fails to honor the warranty, or becomes unreachable, SmartFix Ethiopia's platform escrow reserve immediately funds and dispatches an emergency replacement guild master technician at <strong className="text-emerald-400">zero extra cost</strong>.
                  </p>
                </div>
              </div>
            </div>

            {/* QR Code Verification Stamp */}
            <div className="p-3 bg-white text-slate-950 rounded-2xl flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="font-extrabold text-xs block">Official Digital Guarantee Seal</span>
                <p className="text-[9px] text-slate-600 font-mono leading-tight">
                  Cryptographically registered on SmartFix central escrow ledger.
                </p>
              </div>
              <QrCode className="w-11 h-11 text-slate-900 flex-shrink-0" />
            </div>

            <button
              onClick={() => {
                setShareSuccessToast('Warranty Certificate copied to clipboard!');
                setTimeout(() => setShareSuccessToast(null), 3000);
                setViewingCertificate(null);
              }}
              className="w-full py-3 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Save & Download Guarantee Card</span>
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* ADD PAYMENT METHOD MODAL                                 */}
      {/* ======================================================== */}
      {showAddPaymentModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="w-full max-w-sm bg-white dark:bg-[#0B1326] border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                {t.addPaymentMethod}
              </h3>
              <button
                onClick={() => setShowAddPaymentModal(false)}
                className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <button
                onClick={() => {
                  setShareSuccessToast('Telebirr account linked successfully!');
                  setTimeout(() => setShareSuccessToast(null), 3000);
                  setShowAddPaymentModal(false);
                }}
                className="w-full p-3 rounded-xl border border-blue-200 dark:border-blue-900 bg-blue-50/60 dark:bg-blue-950/40 text-left flex items-center justify-between hover:border-blue-400"
              >
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block">Telebirr Direct Link</span>
                  <span className="text-[10px] text-slate-500">Ethio Telecom Quick Pay</span>
                </div>
                <ChevronRight className="w-4 h-4 text-blue-600" />
              </button>

              <button
                onClick={() => {
                  setShareSuccessToast('CBE Birr account linked successfully!');
                  setTimeout(() => setShareSuccessToast(null), 3000);
                  setShowAddPaymentModal(false);
                }}
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#080E1D] text-left flex items-center justify-between hover:border-blue-400"
              >
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block">Commercial Bank of Ethiopia (CBE)</span>
                  <span className="text-[10px] text-slate-500">CBE Birr Mobile Wallet</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 5-ENDPOINT BOTTOM NAVIGATION BAR                         */}
      {/* Home | Requests | [AI Center] | Notifications | Profile  */}
      {/* ======================================================== */}
      <nav className="absolute bottom-0 inset-x-0 bg-white/95 dark:bg-[#070B14]/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800/80 px-2 py-2 flex items-center justify-around z-30">
        {/* 1. Home */}
        <button
          onClick={() => setActiveNav('home')}
          className={`flex flex-col items-center gap-1 text-[10px] font-bold transition-colors flex-1 ${
            activeNav === 'home' ? 'text-[#2563EB] dark:text-[#60A5FA]' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Home className="w-4 h-4" />
          <span>{t.navHome}</span>
        </button>

        {/* 2. Requests (Replaced Services) */}
        <button
          onClick={() => setActiveNav('requests')}
          className={`flex flex-col items-center gap-1 text-[10px] font-bold transition-colors relative flex-1 ${
            activeNav === 'requests' ? 'text-[#2563EB] dark:text-[#60A5FA]' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>{t.navRequests}</span>
          {bookings.length > 0 && (
            <span className="w-2 h-2 rounded-full bg-[#2563EB] absolute top-0 right-3" />
          )}
        </button>

        {/* 3. Center Elevated AI Button with Clear Indicator Word */}
        <div className="flex-1 flex flex-col items-center">
          <button
            onClick={() => setActiveNav('ai')}
            className={`relative -top-3.5 w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#0F1E3D] via-[#1E3A8A] to-[#2563EB] text-white flex items-center justify-center shadow-lg shadow-blue-950/30 active:scale-95 transition-transform ${
              activeNav === 'ai' ? 'ring-2 ring-amber-400 scale-105' : ''
            }`}
            title="SmartFix AI Lens"
          >
            <Sparkles className="w-5 h-5 text-amber-300" />
          </button>
          <span
            className={`text-[9px] font-black -mt-2.5 tracking-tight ${
              activeNav === 'ai' ? 'text-[#2563EB] dark:text-[#60A5FA]' : 'text-slate-400 dark:text-slate-500'
            }`}
          >
            Smart AI
          </span>
        </div>

        {/* 4. Notifications */}
        <button
          onClick={() => setActiveNav('notifications')}
          className={`flex flex-col items-center gap-1 text-[10px] font-bold transition-colors relative flex-1 ${
            activeNav === 'notifications' ? 'text-[#2563EB] dark:text-[#60A5FA]' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>{t.navNotifications}</span>
          {unreadCount > 0 && (
            <span className="w-2 h-2 rounded-full bg-[#2563EB] absolute top-0 right-3" />
          )}
        </button>

        {/* 5. Profile */}
        <button
          onClick={() => setActiveNav('profile')}
          className={`flex flex-col items-center gap-1 text-[10px] font-bold transition-colors flex-1 ${
            activeNav === 'profile' ? 'text-[#2563EB] dark:text-[#60A5FA]' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <User className="w-4 h-4" />
          <span>{t.navProfile}</span>
        </button>
      </nav>

      {/* ======================================================== */}
      {/* CLEAN SEARCH OVERLAY                                     */}
      {/* ======================================================== */}
      {isSearchOpen && (
        <CleanSearchOverlay
          services={services}
          language={language}
          selectedLocation={selectedLocation}
          onClose={() => setIsSearchOpen(false)}
          onSelectService={(srv) => {
            setIsSearchOpen(false);
            setSelectedService(srv);
          }}
          onBookService={(srv) => {
            setIsSearchOpen(false);
            handleOpenBookingModal(srv);
          }}
        />
      )}

      {/* ======================================================== */}
      {/* RATE TECHNICIAN MODAL                                    */}
      {/* ======================================================== */}
      {ratingBooking && (
        <RateTechnicianModal
          booking={ratingBooking}
          language={language}
          onClose={() => setRatingBooking(null)}
          onSubmitRating={(bookingId, rating, comment, tip, tags) => {
            if (onRateBooking) {
              onRateBooking(bookingId, rating, comment, tip, tags);
            }
            setShareSuccessToast(`Rating for ${ratingBooking.technicianName || 'technician'} submitted! ⭐`);
            setTimeout(() => setShareSuccessToast(null), 3000);
            setRatingBooking(null);
          }}
        />
      )}

      {/* ======================================================== */}
      {/* SETTINGS & APP PREFERENCES MODAL                         */}
      {/* ======================================================== */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white dark:bg-[#0B1326] border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200">
                  <Settings className="w-4 h-4" />
                </div>
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                  {t.appPreferences}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowSettingsModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-[#080E1E] border border-slate-200/60 dark:border-slate-800">
                <div>
                  <span className="font-bold text-slate-800 dark:text-slate-200 block">{t.smsOtpAlerts}</span>
                  <span className="text-[10px] text-slate-400">Receive OTP codes & arrival SMS</span>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveNotificationPrefs(p => ({ ...p, smsOtp: !p.smsOtp }))}
                  className={`w-9 h-5 rounded-full transition-colors relative p-0.5 ${
                    activeNotificationPrefs.smsOtp ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    activeNotificationPrefs.smsOtp ? 'translate-x-4' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-[#080E1E] border border-slate-200/60 dark:border-slate-800">
                <div>
                  <span className="font-bold text-slate-800 dark:text-slate-200 block">{t.pushTracking}</span>
                  <span className="text-[10px] text-slate-400">Live GPS technician radar notifications</span>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveNotificationPrefs(p => ({ ...p, pushAlerts: !p.pushAlerts }))}
                  className={`w-9 h-5 rounded-full transition-colors relative p-0.5 ${
                    activeNotificationPrefs.pushAlerts ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    activeNotificationPrefs.pushAlerts ? 'translate-x-4' : 'translate-x-0'
                  }`} />
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowSettingsModal(false)}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-md transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SAVED ADDRESSES MODAL                                    */}
      {/* ======================================================== */}
      {showSavedAddressesModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white dark:bg-[#0B1326] border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
                  <MapPin className="w-4 h-4" />
                </div>
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                  {t.savedAddresses}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowSavedAddressesModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {isAddingAddress ? (
              <form onSubmit={handleAddNewAddress} className="p-3 bg-slate-50 dark:bg-[#091122] rounded-xl border border-blue-200 dark:border-blue-900/60 space-y-2 text-xs">
                <input
                  type="text"
                  placeholder="Label (e.g. Workshop, Villa)"
                  value={newAddrLabel}
                  onChange={(e) => setNewAddrLabel(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#070B14] text-slate-900 dark:text-white"
                />
                <input
                  type="text"
                  required
                  placeholder="Full Address & Woreda"
                  value={newAddrText}
                  onChange={(e) => setNewAddrText(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#070B14] text-slate-900 dark:text-white"
                />
                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsAddingAddress(false)}
                    className="px-2.5 py-1 text-slate-500 hover:text-slate-700 text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-xs"
                  >
                    Save Place
                  </button>
                </div>
              </form>
            ) : (
              <button
                type="button"
                onClick={() => setIsAddingAddress(true)}
                className="w-full py-2 border border-dashed border-blue-400 text-blue-600 dark:text-blue-400 rounded-xl text-xs font-bold flex items-center justify-center gap-1 hover:bg-blue-50 dark:hover:bg-blue-950/40"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{t.addNewAddress}</span>
              </button>
            )}

            <div className="space-y-2">
              {savedAddressesList.map((addr) => (
                <div
                  key={addr.id}
                  className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-[#080E1D] flex items-center justify-between text-xs"
                >
                  <div className="min-w-0 pr-2">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-slate-900 dark:text-white">{addr.label}</span>
                      {addr.isDefault && (
                        <span className="text-[9px] font-bold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 px-1.5 py-0.2 rounded">
                          {t.defaultAddress}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">{addr.address}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      onSelectLocation(addr.label);
                      setCustomerAddress(addr.address);
                      setShowSavedAddressesModal(false);
                      setShareSuccessToast(`Location set to ${addr.label}`);
                      setTimeout(() => setShareSuccessToast(null), 2000);
                    }}
                    className="px-2.5 py-1 bg-blue-600 text-white rounded-lg font-bold text-[11px] hover:bg-blue-700 flex-shrink-0"
                  >
                    Select
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* PRIVACY POLICY MODAL                                     */}
      {/* ======================================================== */}
      {showPrivacyModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white dark:bg-[#0B1326] border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200">
                  <Lock className="w-4 h-4" />
                </div>
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                  Privacy Policy
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowPrivacyModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              <p className="font-bold text-slate-900 dark:text-white">1. Data Protection & Encryption</p>
              <p className="text-[11px]">
                SmartFix Ethiopia encrypts all customer phone numbers, residential addresses, and GPS data with bank-grade 256-bit AES encryption.
              </p>

              <p className="font-bold text-slate-900 dark:text-white">2. Verified Technician Access</p>
              <p className="text-[11px]">
                Technicians only receive service coordinates upon active job acceptance. Customer data is never sold or shared with 3rd-party advertisers.
              </p>

              <p className="font-bold text-slate-900 dark:text-white">3. Payment Security</p>
              <p className="text-[11px]">
                Telebirr and CBE Birr transactions are authenticated directly through Ethio Telecom and Commercial Bank of Ethiopia secure gateways.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowPrivacyModal(false)}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-md transition-colors"
            >
              I Understand
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TERMS OF SERVICE MODAL                                   */}
      {/* ======================================================== */}
      {showTermsModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white dark:bg-[#0B1326] border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200">
                  <FileText className="w-4 h-4" />
                </div>
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                  Terms of Service
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowTermsModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              <p className="font-bold text-slate-900 dark:text-white">1. Technician Workmanship Warranty & Liability</p>
              <p className="text-[11px]">
                Upon registering, every certified technician legally pledges a trade-specific Workmanship Warranty (<strong>30 Days</strong> for plumbing/general, <strong>60 Days (2 Months)</strong> for appliances/TV, <strong>90 Days (3 Months)</strong> for solar/inverters). The assigned technician is directly responsible for 100% free corrective repair if an identical defect recurs within the warranty window.
              </p>

              <p className="font-bold text-slate-900 dark:text-white">2. SmartFix Escrow Shield (Technician Default Protection)</p>
              <p className="text-[11px]">
                SmartFix holds a mandatory Escrow Collateral Deposit from every verified technician. If a customer files a warranty claim and the technician is unresponsive, refuses service, or defaults ("disappears"), SmartFix immediately funds and dispatches an emergency replacement master technician at <strong>zero extra cost</strong>.
              </p>

              <p className="font-bold text-slate-900 dark:text-white">3. Transparent 10% Platform Fee & 90% Direct Payout</p>
              <p className="text-[11px]">
                SmartFix deducts a 10% service & mediation fee to maintain GPS dispatch, SMS OTP gateways, dispute resolution, and platform escrow reserves. 90% of labor and 100% of parts are paid directly to the technician.
              </p>

              <p className="font-bold text-slate-900 dark:text-white">4. Addis Police Clearance & ID Verification</p>
              <p className="text-[11px]">
                All SmartFix technicians hold verified Kebele ID credentials, biometric vetting, and Addis Ababa police clearance records.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowTermsModal(false)}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-md transition-colors"
            >
              Accept Terms
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* REAL FUNCTIONAL TELEBIRR / CBE / CASH PAYMENT GATEWAY    */}
      {/* ======================================================== */}
      {payingBooking && (() => {
        const labor = payingBooking.laborPrice ?? payingBooking.price;
        const parts = payingBooking.partsCost || 0;
        const total = payingBooking.totalPrice ?? (labor + parts);
        const commission = Math.round(labor * 0.10);
        const techPayout = total - commission;

        const handleCompletePaymentProcess = (method: 'telebirr' | 'cbe_birr' | 'cash', refCode?: string) => {
          setIsProcessingPayment(true);
          const txnPrefix = method === 'telebirr' ? 'TB-ET' : method === 'cbe_birr' ? 'CBE-FT' : 'CSH-ET';
          const generatedTxnId = refCode || `${txnPrefix}-2026-${Math.floor(100000 + Math.random() * 900000)}`;
          
          setTimeout(() => {
            if (onPayBooking) {
              onPayBooking(payingBooking.id, method);
            }
            setIsProcessingPayment(false);
            const finishedBooking = { ...payingBooking, paymentStatus: 'paid_direct' as const, paymentMethod: method };
            
            // Set Electronic Receipt Data
            setReceiptModalData({
              booking: finishedBooking,
              txnId: generatedTxnId,
              paymentMethod: method,
              amount: total,
              laborPrice: labor,
              partsCost: parts,
              commission,
              technicianPayout: techPayout,
              technicianName: payingBooking.technicianName || 'Dawit Abebe',
              technicianAccount: method === 'cbe_birr' ? 'CBE 1000188923412' : (payingBooking.technicianPhone || '+251 91 123 4567'),
              date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              authCode: `AUTH-SF-${payingBooking.id.slice(0, 6).toUpperCase()}`
            });

            setPayingBooking(null);
            setTelebirrPushActive(false);
            setCbePushActive(false);
          }, 800);
        };

        return (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-fade-in">
            <div className="w-full max-w-md bg-white dark:bg-[#0B1326] border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
              
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-blue-500/10 dark:bg-blue-500/20 text-[#2563EB] flex items-center justify-center font-black">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                      Direct Service Payment Gateway
                    </h3>
                    <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono">
                      <span>Order #{payingBooking.id}</span>
                      <span>•</span>
                      <span className="text-emerald-600 font-bold">Tested & Completed</span>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setPayingBooking(null)}
                  className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Toast Feedback for Copying */}
              {copyFeedback && (
                <div className="p-2 bg-emerald-500 text-white rounded-xl text-xs font-bold text-center animate-bounce shadow-md">
                  ✓ {copyFeedback}
                </div>
              )}

              {/* Itemized Cost Summary Card */}
              <div className="p-3.5 bg-gradient-to-br from-slate-50 to-blue-50/40 dark:from-[#080E1E] dark:to-[#0F1E3D]/40 rounded-2xl border border-blue-200/70 dark:border-blue-900/50 space-y-2 text-xs">
                <div className="flex justify-between items-center text-slate-500 dark:text-slate-400">
                  <span>Service & Technician:</span>
                  <span className="font-bold text-slate-900 dark:text-white truncate max-w-[200px]">
                    {getLocalizedServiceName(payingBooking)} ({payingBooking.technicianName || 'Dawit Abebe'})
                  </span>
                </div>

                <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                  <span>Diagnostic & Labor:</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">{labor} ETB</span>
                </div>

                {parts > 0 && (
                  <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                    <span>Authorized Spare Parts:</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">+{parts} ETB</span>
                  </div>
                )}

                <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between items-baseline">
                  <div>
                    <span className="text-slate-900 dark:text-white font-extrabold text-sm block">Total Due:</span>
                    <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold block">
                      10% SmartFix Platform Fee ({commission} ETB) • 90% Direct Tech Payout ({techPayout} ETB)
                    </span>
                    <span className="text-[9.5px] text-emerald-600 dark:text-emerald-400 font-medium block mt-0.5">
                      ✓ Includes {payingBooking.category === 'solar' ? '90-Day (3 Month)' : (payingBooking.category === 'appliances' || payingBooking.category === 'electronics_it') ? '60-Day (2 Month)' : '30-Day'} Workmanship Warranty pledged by {payingBooking.technicianName || 'Certified Technician'} (SmartFix Escrow Protected)
                    </span>
                  </div>
                  <span className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">
                    {total} <span className="text-xs font-bold text-slate-500">ETB</span>
                  </span>
                </div>
              </div>

              {/* Main Payment Channel Selector (Telebirr / CBE / Cash) */}
              <div className="space-y-2">
                <label className="font-extrabold text-slate-900 dark:text-white block text-[11px] uppercase tracking-wider">
                  Select Ethiopian Payment Method:
                </label>
                
                <div className="grid grid-cols-3 gap-2">
                  {/* Channel 1: Telebirr */}
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedPaymentMethod('telebirr');
                      setTelebirrPushActive(false);
                    }}
                    className={`p-2.5 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
                      selectedPaymentMethod === 'telebirr'
                        ? 'border-blue-500 bg-blue-50/80 dark:bg-blue-950/60 shadow-md ring-2 ring-blue-400/40'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-xl bg-blue-500 text-white font-black text-xs flex items-center justify-center shadow-xs">
                      TB
                    </div>
                    <span className="font-extrabold text-xs text-slate-900 dark:text-white">Telebirr</span>
                    <span className="text-[9px] text-blue-600 dark:text-blue-400 font-bold">Direct Push</span>
                  </button>

                  {/* Channel 2: CBE Birr */}
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedPaymentMethod('cbe_birr');
                      setCbePushActive(false);
                    }}
                    className={`p-2.5 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
                      selectedPaymentMethod === 'cbe_birr'
                        ? 'border-purple-500 bg-purple-50/80 dark:bg-purple-950/60 shadow-md ring-2 ring-purple-400/40'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-xl bg-purple-600 text-white font-black text-xs flex items-center justify-center shadow-xs">
                      CBE
                    </div>
                    <span className="font-extrabold text-xs text-slate-900 dark:text-white">CBE / CBE Birr</span>
                    <span className="text-[9px] text-purple-600 dark:text-purple-400 font-bold">Bank & USSD</span>
                  </button>

                  {/* Channel 3: Cash In-Person */}
                  <button
                    type="button"
                    onClick={() => setSelectedPaymentMethod('cash')}
                    className={`p-2.5 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
                      selectedPaymentMethod === 'cash'
                        ? 'border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/60 shadow-md ring-2 ring-emerald-400/40'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white font-black text-xs flex items-center justify-center shadow-xs">
                      💵
                    </div>
                    <span className="font-extrabold text-xs text-slate-900 dark:text-white">Cash</span>
                    <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-bold">On-Site</span>
                  </button>
                </div>
              </div>

              {/* ========================================================= */}
              {/* SECTION A: TELEBIRR PAYMENT GATEWAY OPTIONS               */}
              {/* ========================================================= */}
              {selectedPaymentMethod === 'telebirr' && (
                <div className="p-3.5 bg-blue-50/50 dark:bg-[#071224] rounded-2xl border border-blue-200 dark:border-blue-900/60 space-y-3">
                  
                  {/* Telebirr Sub-mode tabs */}
                  <div className="flex bg-white dark:bg-[#0B1428] p-1 rounded-xl border border-blue-100 dark:border-blue-900/40 text-xs">
                    <button
                      type="button"
                      onClick={() => setTelebirrSubMethod('direct_push')}
                      className={`flex-1 py-1.5 rounded-lg font-bold transition-all text-[11px] flex items-center justify-center gap-1 ${
                        telebirrSubMethod === 'direct_push'
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                      }`}
                    >
                      <Smartphone className="w-3 h-3" />
                      <span>USSD Push / App</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setTelebirrSubMethod('qr_code')}
                      className={`flex-1 py-1.5 rounded-lg font-bold transition-all text-[11px] flex items-center justify-center gap-1 ${
                        telebirrSubMethod === 'qr_code'
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                      }`}
                    >
                      <QrCode className="w-3 h-3" />
                      <span>Telebirr QR</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setTelebirrSubMethod('ussd_dial')}
                      className={`flex-1 py-1.5 rounded-lg font-bold transition-all text-[11px] flex items-center justify-center gap-1 ${
                        telebirrSubMethod === 'ussd_dial'
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                      }`}
                    >
                      <span>Dial *127#</span>
                    </button>
                  </div>

                  {/* SUBMODE 1: DIRECT USSD PUSH PROMPT */}
                  {telebirrSubMethod === 'direct_push' && (
                    <div className="space-y-3 text-xs">
                      <div>
                        <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                          Telebirr Registered Mobile Number:
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={payerTelebirrPhone}
                            onChange={(e) => setPayerTelebirrPhone(e.target.value)}
                            placeholder="0911234567"
                            className="flex-1 p-2.5 rounded-xl border border-blue-200 dark:border-blue-800 bg-white dark:bg-[#0A1122] text-slate-900 dark:text-white font-mono font-bold"
                          />
                          {!telebirrPushActive && (
                            <button
                              type="button"
                              onClick={() => {
                                setTelebirrPushActive(true);
                                setTelebirrCountdown(60);
                                setPayerTelebirrPin('');
                                setPayerTelebirrOtp('4821');
                              }}
                              className="px-3.5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-xs flex items-center gap-1"
                            >
                              <Send className="w-3.5 h-3.5" />
                              <span>Request Push</span>
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Simulated Interactive Telebirr Push Notification Overlay */}
                      {telebirrPushActive && (
                        <div className="p-3 bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-2xl shadow-lg space-y-2.5 animate-bounce-short">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-white text-blue-600 flex items-center justify-center font-black text-[10px]">
                                TB
                              </div>
                              <span className="font-bold text-xs">Ethio Telecom / Telebirr Prompt</span>
                            </div>
                            <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-mono">
                              {telebirrCountdown}s left
                            </span>
                          </div>

                          <div className="text-[11px] bg-black/20 p-2 rounded-xl space-y-1">
                            <div className="flex justify-between">
                              <span className="text-blue-200">Merchant:</span>
                              <span className="font-bold">SmartFix Ethiopia (127888)</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-blue-200">Amount:</span>
                              <span className="font-bold text-amber-300 font-mono">{total} ETB</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-blue-200">Order Ref:</span>
                              <span className="font-mono">#SF-{payingBooking.id}</span>
                            </div>
                          </div>

                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <label className="text-[11px] font-bold">Enter 4-Digit Telebirr PIN:</label>
                              <button
                                type="button"
                                onClick={() => setPayerTelebirrPin('4821')}
                                className="text-[9px] bg-white/30 hover:bg-white/40 text-white px-2 py-0.5 rounded-md font-bold"
                              >
                                Auto-Fill Test PIN (4821)
                              </button>
                            </div>
                            <input
                              type="password"
                              maxLength={4}
                              value={payerTelebirrPin}
                              onChange={(e) => setPayerTelebirrPin(e.target.value)}
                              placeholder="••••"
                              className="w-full text-center tracking-[0.5em] text-lg font-mono p-2 bg-white text-slate-900 rounded-xl font-black"
                            />
                          </div>

                          <button
                            type="button"
                            disabled={isProcessingPayment || !payerTelebirrPin}
                            onClick={() => handleCompletePaymentProcess('telebirr', `TB-ET-2026-${Math.floor(100000 + Math.random() * 900000)}`)}
                            className="w-full py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl text-xs shadow-md transition-transform active:scale-95 flex items-center justify-center gap-1.5"
                          >
                            {isProcessingPayment ? (
                              <span>Authorizing Telebirr Payment...</span>
                            ) : (
                              <>
                                <Lock className="w-3.5 h-3.5" />
                                <span>Authorize & Pay {total} ETB</span>
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* SUBMODE 2: TELEBIRR QR CODE */}
                  {telebirrSubMethod === 'qr_code' && (
                    <div className="p-3 bg-white dark:bg-[#0A1122] rounded-2xl border border-blue-200 dark:border-blue-900 text-center space-y-2">
                      <div className="w-32 h-32 mx-auto bg-slate-100 dark:bg-slate-900 rounded-2xl p-2 border-2 border-dashed border-blue-400 flex flex-col items-center justify-center relative">
                        <QrCode className="w-24 h-24 text-blue-600 dark:text-blue-400" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="bg-blue-600 text-white font-black text-[9px] px-1.5 py-0.5 rounded shadow">
                            TB PAY
                          </span>
                        </div>
                      </div>
                      <div className="text-[11px] text-slate-500">
                        <span className="font-bold text-slate-800 dark:text-slate-200 block">
                          Scan with Telebirr SuperApp
                        </span>
                        <span>Merchant Shortcode: 127888 • Total: {total} ETB</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCompletePaymentProcess('telebirr', `TB-QR-2026-${Math.floor(100000 + Math.random() * 900000)}`)}
                        className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs"
                      >
                        Simulate Scan & Pay from SuperApp
                      </button>
                    </div>
                  )}

                  {/* SUBMODE 3: QUICK USSD STRING */}
                  {telebirrSubMethod === 'ussd_dial' && (
                    <div className="p-3 bg-white dark:bg-[#0A1122] rounded-2xl border border-blue-200 dark:border-blue-900 space-y-2 text-xs">
                      <span className="font-bold text-slate-700 dark:text-slate-300 block text-[11px]">
                        Dial Directly on your Ethio Telecom SIM:
                      </span>
                      <div className="p-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl font-mono font-bold text-sm text-blue-600 dark:text-blue-400 flex items-center justify-between">
                        <span>*127*1*127888*{total}#</span>
                        <button
                          type="button"
                          onClick={() => handleCopyToClipboard(`*127*1*127888*${total}#`, 'USSD Dial Code')}
                          className="px-2 py-1 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-[10px] font-bold flex items-center gap-1 hover:bg-slate-50"
                        >
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </button>
                      </div>
                      <div className="flex gap-2 pt-1">
                        <a
                          href={`tel:*127*1*127888*${total}#`}
                          className="flex-1 py-2 bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold rounded-xl text-center text-xs hover:bg-slate-300"
                        >
                          Open Dialer
                        </a>
                        <button
                          type="button"
                          onClick={() => handleCompletePaymentProcess('telebirr', `TB-USSD-2026-${Math.floor(100000 + Math.random() * 900000)}`)}
                          className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-xs"
                        >
                          I Have Dialed & Paid
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ========================================================= */}
              {/* SECTION B: CBE & CBE BIRR PAYMENT GATEWAY OPTIONS         */}
              {/* ========================================================= */}
              {selectedPaymentMethod === 'cbe_birr' && (
                <div className="p-3.5 bg-purple-50/50 dark:bg-[#140A24] rounded-2xl border border-purple-200 dark:border-purple-900/60 space-y-3">
                  
                  {/* CBE Sub-mode tabs */}
                  <div className="flex bg-white dark:bg-[#0E061A] p-1 rounded-xl border border-purple-100 dark:border-purple-900/40 text-xs">
                    <button
                      type="button"
                      onClick={() => setCbeSubMethod('cbe_transfer')}
                      className={`flex-1 py-1.5 rounded-lg font-bold transition-all text-[11px] flex items-center justify-center gap-1 ${
                        cbeSubMethod === 'cbe_transfer'
                          ? 'bg-purple-700 text-white shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                      }`}
                    >
                      <CreditCard className="w-3 h-3" />
                      <span>CBE Mobile Bank</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setCbeSubMethod('cbe_ussd')}
                      className={`flex-1 py-1.5 rounded-lg font-bold transition-all text-[11px] flex items-center justify-center gap-1 ${
                        cbeSubMethod === 'cbe_ussd'
                          ? 'bg-purple-700 text-white shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                      }`}
                    >
                      <Smartphone className="w-3 h-3" />
                      <span>CBE Birr *847#</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setCbeSubMethod('qr_code')}
                      className={`flex-1 py-1.5 rounded-lg font-bold transition-all text-[11px] flex items-center justify-center gap-1 ${
                        cbeSubMethod === 'qr_code'
                          ? 'bg-purple-700 text-white shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                      }`}
                    >
                      <QrCode className="w-3 h-3" />
                      <span>CBE QR</span>
                    </button>
                  </div>

                  {/* CBE SUBMODE 1: MOBILE BANKING ACCOUNT TRANSFER */}
                  {cbeSubMethod === 'cbe_transfer' && (
                    <div className="space-y-2.5 text-xs">
                      <div className="p-2.5 bg-white dark:bg-[#0E061A] rounded-xl border border-purple-200 dark:border-purple-900 space-y-1.5">
                        <span className="text-[10px] font-bold uppercase text-purple-700 dark:text-purple-300 block">
                          Official CBE Escrow Deposit Account:
                        </span>
                        <div className="flex items-center justify-between font-mono font-black text-sm text-slate-900 dark:text-white">
                          <span>1000188923412</span>
                          <button
                            type="button"
                            onClick={() => handleCopyToClipboard('1000188923412', 'CBE Account Number')}
                            className="px-2 py-0.5 bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 rounded text-[10px] font-bold flex items-center gap-1 hover:bg-purple-200"
                          >
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </button>
                        </div>
                        <div className="text-[10px] text-slate-500">
                          Beneficiary: <span className="font-bold text-slate-700 dark:text-slate-300">SmartFix Services Ethiopia</span>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <label className="font-bold text-slate-700 dark:text-slate-300">
                            CBE Transfer Reference / Ref ID:
                          </label>
                          <button
                            type="button"
                            onClick={() => setPayerCbeRef(`FT26${Math.floor(100000000 + Math.random() * 900000000)}`)}
                            className="text-[10px] text-purple-600 dark:text-purple-400 font-bold hover:underline"
                          >
                            Auto-Generate Test Ref
                          </button>
                        </div>
                        <input
                          type="text"
                          value={payerCbeRef}
                          onChange={(e) => setPayerCbeRef(e.target.value)}
                          placeholder="e.g. FT26234901928"
                          className="w-full p-2.5 rounded-xl border border-purple-200 dark:border-purple-800 bg-white dark:bg-[#0E061A] text-slate-900 dark:text-white font-mono font-bold"
                        />
                      </div>

                      <button
                        type="button"
                        disabled={isProcessingPayment}
                        onClick={() => {
                          const refToUse = payerCbeRef || `FT26${Math.floor(100000000 + Math.random() * 900000000)}`;
                          handleCompletePaymentProcess('cbe_birr', refToUse);
                        }}
                        className="w-full py-2.5 bg-purple-700 hover:bg-purple-800 text-white font-black rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
                      >
                        {isProcessingPayment ? (
                          <span>Verifying CBE Deposit...</span>
                        ) : (
                          <>
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>Verify & Confirm {total} ETB CBE Transfer</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  {/* CBE SUBMODE 2: CBE BIRR USSD PUSH */}
                  {cbeSubMethod === 'cbe_ussd' && (
                    <div className="p-3 bg-white dark:bg-[#0E061A] rounded-2xl border border-purple-200 dark:border-purple-900 space-y-2 text-xs">
                      <span className="font-bold text-slate-700 dark:text-slate-300 block text-[11px]">
                        CBE Birr Quick USSD Push (*847#):
                      </span>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={payerCbePhone}
                          onChange={(e) => setPayerCbePhone(e.target.value)}
                          placeholder="0911234567"
                          className="flex-1 p-2.5 rounded-xl border border-purple-200 dark:border-purple-800 bg-slate-50 dark:bg-slate-900 font-mono font-bold"
                        />
                        <button
                          type="button"
                          onClick={() => handleCompletePaymentProcess('cbe_birr', `CBE-USSD-2026-${Math.floor(100000 + Math.random() * 900000)}`)}
                          className="px-3 py-2 bg-purple-700 hover:bg-purple-800 text-white font-bold rounded-xl text-xs shadow-xs"
                        >
                          Send *847#
                        </button>
                      </div>
                      <p className="text-[10px] text-slate-500">
                        A CBE Birr authorization request of {total} ETB will be pushed to your phone.
                      </p>
                    </div>
                  )}

                  {/* CBE SUBMODE 3: CBE QR */}
                  {cbeSubMethod === 'qr_code' && (
                    <div className="p-3 bg-white dark:bg-[#0E061A] rounded-2xl border border-purple-200 dark:border-purple-900 text-center space-y-2">
                      <div className="w-32 h-32 mx-auto bg-slate-100 dark:bg-slate-900 rounded-2xl p-2 border-2 border-dashed border-purple-400 flex flex-col items-center justify-center relative">
                        <QrCode className="w-24 h-24 text-purple-700 dark:text-purple-400" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="bg-purple-700 text-white font-black text-[9px] px-1.5 py-0.5 rounded shadow">
                            CBE BIRR
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCompletePaymentProcess('cbe_birr', `CBE-QR-2026-${Math.floor(100000 + Math.random() * 900000)}`)}
                        className="w-full py-2 bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs rounded-xl shadow-xs"
                      >
                        Simulate CBE Birr App Scan & Pay
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* ========================================================= */}
              {/* SECTION C: CASH IN-PERSON                                 */}
              {/* ========================================================= */}
              {selectedPaymentMethod === 'cash' && (
                <div className="p-3.5 bg-emerald-50/70 dark:bg-[#061A14] rounded-2xl border border-emerald-300 dark:border-emerald-800 space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>Direct In-Person Cash Settlement</span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400">
                    Hand physical cash of <strong className="text-slate-900 dark:text-white font-mono">{total} ETB</strong> directly to technician {payingBooking.technicianName || 'Dawit Abebe'}. The 10% platform commission ({commission} ETB) is settled from the technician's Smart Wallet automatically.
                  </p>
                  <button
                    type="button"
                    disabled={isProcessingPayment}
                    onClick={() => handleCompletePaymentProcess('cash', `CSH-2026-${Math.floor(100000 + Math.random() * 900000)}`)}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl text-xs shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    {isProcessingPayment ? (
                      <span>Recording Cash Payment...</span>
                    ) : (
                      <>
                        <CheckCheck className="w-4 h-4" />
                        <span>Confirm Cash Paid ({total} ETB)</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* 30-Day Guarantee Footer */}
              <div className="p-2.5 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-[10px] text-slate-600 dark:text-slate-400 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>All payments are covered by SmartFix 30-Day Workmanship Warranty & digital receipt.</span>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ======================================================== */}
      {/* OFFICIAL ETHIOPIAN DIGITAL E-RECEIPT & WARRANTY MODAL    */}
      {/* ======================================================== */}
      {receiptModalData && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-fade-in">
          <div className="w-full max-w-sm bg-white dark:bg-[#0B1326] border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
            
            {/* Stamp & Header */}
            <div className="text-center pb-3 border-b border-slate-100 dark:border-slate-800 space-y-1">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 mx-auto flex items-center justify-center font-black">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <span className="text-[9px] font-mono uppercase font-bold text-emerald-600 tracking-wider block">
                Official Ethiopian Electronic Receipt
              </span>
              <h3 className="font-black text-base text-slate-900 dark:text-white">
                SmartFix Ethiopia
              </h3>
              <p className="text-[10px] text-slate-400 font-mono">Txn #{receiptModalData.txnId}</p>
            </div>

            {/* Receipt Summary Grid */}
            <div className="p-3.5 bg-slate-50 dark:bg-[#080E1E] rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Service:</span>
                <span className="font-bold text-slate-900 dark:text-white">{getLocalizedServiceName(receiptModalData.booking)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Technician:</span>
                <span className="font-bold text-slate-900 dark:text-white">{receiptModalData.technicianName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Channel / Method:</span>
                <span className="font-bold font-mono text-blue-600 dark:text-blue-400 uppercase">
                  {receiptModalData.paymentMethod.replace('_', ' ')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Date & Time:</span>
                <span className="font-mono text-slate-700 dark:text-slate-300">{receiptModalData.date}</span>
              </div>
              
              <div className="pt-2 border-t border-slate-200 dark:border-slate-700 space-y-1">
                <div className="flex justify-between text-slate-600 dark:text-slate-400 text-[11px]">
                  <span>Labor Fee:</span>
                  <span className="font-mono">{receiptModalData.laborPrice} ETB</span>
                </div>
                {receiptModalData.partsCost > 0 && (
                  <div className="flex justify-between text-slate-600 dark:text-slate-400 text-[11px]">
                    <span>Spare Parts:</span>
                    <span className="font-mono">+{receiptModalData.partsCost} ETB</span>
                  </div>
                )}
                <div className="flex justify-between items-baseline font-black pt-1 border-t border-slate-200 dark:border-slate-700 text-sm">
                  <span className="text-slate-900 dark:text-white">Total Paid:</span>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400 text-lg">{receiptModalData.amount} ETB</span>
                </div>
              </div>
            </div>

            {/* Direct Deposit & Commission Settlement Badge */}
            <div className="p-3 bg-blue-50/70 dark:bg-blue-950/30 rounded-2xl border border-blue-200 dark:border-blue-900/60 text-[11px] space-y-1">
              <span className="font-bold text-blue-700 dark:text-blue-300 block text-[10px] uppercase tracking-wider">
                Direct Payout Settlement Verified:
              </span>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Technician Net (90%):</span>
                <span className="font-mono font-bold text-emerald-600">{receiptModalData.technicianPayout} ETB</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>SmartFix Platform Fee (10%):</span>
                <span className="font-mono">{receiptModalData.commission} ETB</span>
              </div>
            </div>

            {/* Guaranteed Warranty & Escrow Shield Badge */}
            {(() => {
              const bCat = receiptModalData.booking?.category;
              const wDays = bCat === 'solar' ? 90 : (bCat === 'appliances' || bCat === 'electronics_it') ? 60 : 30;
              const wLabel = wDays === 90 ? '90-Day (3 Month)' : wDays === 60 ? '60-Day (2 Month)' : '30-Day';
              return (
                <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-300 dark:border-emerald-800 flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-300">
                  <div className="flex items-center gap-2 min-w-0 pr-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                    <div className="truncate">
                      <span className="font-bold block text-[11px] truncate">
                        {wLabel} Workmanship Guarantee
                      </span>
                      <span className="text-[9px] text-emerald-600 font-mono block truncate">
                        Pledged by {receiptModalData.technicianName} • Escrow Secured
                      </span>
                    </div>
                  </div>
                  <span className="text-[9px] bg-emerald-600 text-white font-bold px-2 py-0.5 rounded-full flex-shrink-0">
                    SEALED
                  </span>
                </div>
              );
            })()}

            {/* Action Buttons */}
            <div className="space-y-2 pt-1">
              <div className="grid grid-cols-2 gap-2">
                {/* Download PDF simulation */}
                <button
                  type="button"
                  onClick={() => {
                    handleCopyToClipboard(`SMARTFIX-ETHIOPIA-RECEIPT-${receiptModalData.txnId}-${receiptModalData.amount}ETB`, 'Receipt Download Link');
                    alert(`Official Receipt #${receiptModalData.txnId} ready! Downloaded / Saved to device.`);
                  }}
                  className="py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <Download className="w-3.5 h-3.5 text-blue-500" />
                  <span>Download PDF</span>
                </button>

                {/* Share Link */}
                <button
                  type="button"
                  onClick={() => handleCopyToClipboard(`https://smartfix.et/receipt/${receiptModalData.txnId}`, 'Receipt Sharing Link')}
                  className="py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <Share2 className="w-3.5 h-3.5 text-purple-500" />
                  <span>Share Receipt</span>
                </button>
              </div>

              {/* Rate Technician CTA */}
              <button
                type="button"
                onClick={() => {
                  const b = receiptModalData.booking;
                  setReceiptModalData(null);
                  setRatingBooking(b);
                }}
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-2xl font-black text-xs shadow-md flex items-center justify-center gap-1.5"
              >
                <Star className="w-4 h-4 fill-white" />
                <span>Rate {receiptModalData.technicianName} & Leave Review</span>
              </button>

              <button
                type="button"
                onClick={() => setReceiptModalData(null)}
                className="w-full py-2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 font-bold text-xs"
              >
                Close & Return to App
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* REAL-TIME POP-UP ALERT MODAL (ACCEPTED, START, COMPLETE)  */}
      {/* ======================================================== */}
      <AnimatePresence>
        {activePopupAlert && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 15 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-sm bg-white dark:bg-[#0B1326] border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            >
              {/* Header with Type Badge & Close Button */}
              <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                    activePopupAlert.type === 'accepted'
                      ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                      : activePopupAlert.type === 'start_code'
                      ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                      : 'bg-blue-500/15 text-blue-600 dark:text-blue-400'
                  }`}>
                    {activePopupAlert.type === 'accepted' ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : activePopupAlert.type === 'start_code' ? (
                      <Lock className="w-4 h-4" />
                    ) : (
                      <ShieldCheck className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${
                      activePopupAlert.type === 'accepted'
                        ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300'
                        : activePopupAlert.type === 'start_code'
                        ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300'
                        : 'bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300'
                    }`}>
                      {activePopupAlert.type === 'accepted'
                        ? t.statusAccepted
                        : activePopupAlert.type === 'start_code'
                        ? t.startOtpLabel
                        : t.completionOtpLabel}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 block mt-0.5">
                      #{activePopupAlert.bookingId}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setActivePopupAlert(null)}
                  className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="px-4 py-4 space-y-3.5 overflow-y-auto">
                {/* Title & Service Name */}
                <div className="text-center space-y-1">
                  <h3 className="text-base font-black text-slate-900 dark:text-white leading-snug">
                    {activePopupAlert.title}
                  </h3>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    {activePopupAlert.serviceName}
                  </p>
                </div>

                {/* 1. ACCEPTED POP-UP BODY */}
                {activePopupAlert.type === 'accepted' && (
                  <div className="space-y-3">
                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#080E1D] border border-slate-200 dark:border-slate-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-10 h-10 rounded-full bg-[#1E3A8A] text-white flex items-center justify-center font-black text-sm shadow-xs">
                            {(activePopupAlert.technicianName || 'T').charAt(0)}
                          </div>
                          <div>
                            <div className="flex items-center gap-1">
                              <span className="font-extrabold text-xs text-slate-900 dark:text-white">
                                {activePopupAlert.technicianName || 'Master Technician'}
                              </span>
                              <CheckCircle className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                            </div>
                            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold block">
                              ✓ {t.verifiedTechBadge} • 4.9 ★
                            </span>
                          </div>
                        </div>

                        {activePopupAlert.technicianPhone && (
                          <a
                            href={`tel:${activePopupAlert.technicianPhone}`}
                            className="py-1.5 px-3 rounded-xl bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 flex items-center gap-1 text-xs font-bold transition-colors"
                          >
                            <Phone className="w-3.5 h-3.5" />
                            <span>Call</span>
                          </a>
                        )}
                      </div>

                      <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed bg-white/70 dark:bg-black/40 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800/80">
                        {activePopupAlert.desc}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      {activePopupAlert.booking && (
                        <button
                          type="button"
                          onClick={() => {
                            setTrackingBooking(activePopupAlert.booking!);
                            setActivePopupAlert(null);
                          }}
                          className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#1D4ED8] to-[#2563EB] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs"
                        >
                          <Radio className="w-3.5 h-3.5 text-cyan-300 animate-pulse" />
                          <span>{t.liveTracking}</span>
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => setActivePopupAlert(null)}
                        className={`py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-100 ${
                          !activePopupAlert.booking ? 'col-span-2' : ''
                        }`}
                      >
                        {t.dismiss}
                      </button>
                    </div>
                  </div>
                )}

                {/* 2. START CODE POP-UP BODY */}
                {activePopupAlert.type === 'start_code' && (
                  <div className="space-y-3">
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/30 border-2 border-amber-400 dark:border-amber-600/60 text-center space-y-2.5">
                      <span className="text-[10px] font-black uppercase text-amber-800 dark:text-amber-300 tracking-wider block">
                        {t.startOtpLabel}
                      </span>
                      <div className="py-2 px-5 rounded-xl bg-white dark:bg-black/70 border border-amber-300 dark:border-amber-700 inline-block shadow-inner">
                        <span className="text-3xl font-black font-mono tracking-widest text-amber-700 dark:text-amber-300">
                          {activePopupAlert.code || '4821'}
                        </span>
                      </div>
                      <p className="text-[11px] text-amber-950/90 dark:text-amber-200/90 leading-tight">
                        {t.alertStartCodeDesc}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => handleCopyAlertCode(activePopupAlert.code || '4821')}
                        className="py-2.5 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>{copiedCodeNotice === (activePopupAlert.code || '4821') ? t.codeCopied : t.copyCode}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setActivePopupAlert(null)}
                        className="py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-100"
                      >
                        {t.dismiss}
                      </button>
                    </div>
                  </div>
                )}

                {/* 3. COMPLETED CODE POP-UP BODY */}
                {activePopupAlert.type === 'completed_code' && (
                  <div className="space-y-3">
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/30 border-2 border-blue-400 dark:border-blue-600/60 text-center space-y-2.5">
                      <span className="text-[10px] font-black uppercase text-blue-800 dark:text-blue-300 tracking-wider block">
                        {t.completionOtpLabel}
                      </span>
                      <div className="py-2 px-5 rounded-xl bg-white dark:bg-black/70 border border-blue-300 dark:border-blue-700 inline-block shadow-inner">
                        <span className="text-3xl font-black font-mono tracking-widest text-blue-700 dark:text-blue-300">
                          {activePopupAlert.code || '7394'}
                        </span>
                      </div>

                      {activePopupAlert.amount && (
                        <div className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200">
                          Total Due: <span className="text-blue-600 dark:text-blue-400 font-extrabold">{activePopupAlert.amount} ETB</span>
                        </div>
                      )}

                      <p className="text-[11px] text-blue-950/90 dark:text-blue-200/90 leading-tight">
                        {t.alertCompletedCodeDesc}
                      </p>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#080E1B] border border-slate-200 dark:border-slate-800/80 flex items-start gap-2 text-xs">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                      <p className="text-[10px] text-slate-600 dark:text-slate-400 leading-snug">
                        {t.paymentDirectNotice}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => handleCopyAlertCode(activePopupAlert.code || '7394')}
                        className="py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>{copiedCodeNotice === (activePopupAlert.code || '7394') ? t.codeCopied : t.copyCode}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setActivePopupAlert(null)}
                        className="py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-100"
                      >
                        {t.dismiss}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
