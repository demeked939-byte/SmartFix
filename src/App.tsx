import React, { useState } from 'react';
import {
  Sun,
  Moon,
  Globe,
  User,
  Wrench,
  Shield,
  CheckCircle,
  X,
  Sparkles,
  Smartphone,
  Building2,
  ChevronDown
} from 'lucide-react';
import { Role, Language, ServiceItem, Technician, Booking, CategoryItem, CoinTransaction } from './types';
import { INITIAL_SERVICES, INITIAL_TECHNICIANS, INITIAL_BOOKINGS, INITIAL_CATEGORIES } from './data/mockData';
import { CustomerApp } from './components/CustomerApp';
import { TechnicianDashboard } from './components/TechnicianDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { DispatchRadarModal } from './components/DispatchRadarModal';
import { rankEligibleTechnicians } from './services/dispatchEngine';
import { SmartFixLogo } from './components/SmartFixLogo';
import { LANGUAGE_OPTIONS, TRANSLATIONS } from './data/translations';
import { MONTHLY_SECURITY_SUB_FEE } from './data/coinPackages';

// Helper to generate secure random 4-digit OTP
const generateOtp = () => Math.floor(1000 + Math.random() * 9000).toString();

export default function App() {
  const [role, setRole] = useState<Role>('customer');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [language, setLanguage] = useState<Language>('en');
  const [selectedLocation, setSelectedLocation] = useState<string>('Bole, Medhanialem & Atlas');
  
  // Real State Synchronized Across Customer, Tech & Admin
  const [categories, setCategories] = useState<CategoryItem[]>(INITIAL_CATEGORIES);
  const [services, setServices] = useState<ServiceItem[]>(INITIAL_SERVICES);
  const [technicians, setTechnicians] = useState<Technician[]>(INITIAL_TECHNICIANS);
  const [activeTechId, setActiveTechId] = useState<string>('tech-1');
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Live GPS Radar Dispatch Modal for newly created bookings
  const [activeDispatchBooking, setActiveDispatchBooking] = useState<Booking | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Update Technician GPS telemetry live (Ride / Uber / Feres style)
  const handleUpdateTechGps = (
    techId: string,
    gps: {
      lat: number;
      lng: number;
      accuracyMeters?: number;
      heading?: number;
      speedKmh?: number;
      updatedAt?: string;
      addressLabel?: string;
    },
    activeZone?: string
  ) => {
    setTechnicians(prev =>
      prev.map(t =>
        t.id === techId
          ? {
              ...t,
              currentGps: gps,
              ...(activeZone ? { activeZone } : {})
            }
          : t
      )
    );
  };

  // 1. Customer creates a booking -> Dispatches through the Ride/Feres Dispatch Engine
  const handleCustomerBooking = (newBookingData: Omit<Booking, 'id' | 'createdAt' | 'status'>) => {
    const newId = `SF-${Math.floor(1000 + Math.random() * 9000)}`;
    const startOtp = generateOtp();
    const completionOtp = generateOtp();

    // Run Dispatch Engine to rank eligible technicians
    const rankedMatches = rankEligibleTechnicians(
      {
        category: newBookingData.category,
        serviceName: newBookingData.serviceName,
        zone: newBookingData.zone,
        address: newBookingData.address,
        gpsCoordinates: newBookingData.gpsCoordinates
      },
      technicians,
      bookings,
      25 // 25km radius
    );

    const bestMatch = rankedMatches.length > 0 ? rankedMatches[0] : null;

    const newBooking: Booking = {
      ...newBookingData,
      id: newId,
      status: 'pending',
      technicianId: undefined,
      technicianName: undefined,
      technicianPhone: undefined,
      createdAt: 'Just now',
      startOtp,
      completionOtp,
      startOtpVerified: false,
      completionOtpVerified: false,
    };

    setBookings([newBooking, ...bookings]);

    if (bestMatch) {
      setActiveTechId(bestMatch.technician.id);
    }
    showToast(
      `Order #${newId} broadcast! Nearby certified technicians in ${newBookingData.zone.split(',')[0]} have been notified to accept.`
    );
  };

  // 2. Technician accepts booking -> Assures OTPs are active
  const handleTechAcceptBooking = (bookingId: string, techId: string) => {
    const tech = technicians.find(t => t.id === techId);
    setBookings(prev =>
      prev.map(b => {
        if (b.id === bookingId) {
          return {
            ...b,
            status: 'accepted',
            technicianId: techId,
            technicianName: tech?.name,
            technicianPhone: tech?.phone,
            startOtp: b.startOtp || generateOtp(),
            completionOtp: b.completionOtp || generateOtp(),
          };
        }
        return b;
      })
    );
    showToast(`Job #${bookingId} accepted by ${tech?.name || 'Technician'}. OTP generated.`);
  };

  // 3. Update booking status (with OTP verified transitions & earnings credit)
  const handleUpdateBookingStatus = (
    bookingId: string,
    status: Booking['status'],
    extraPartsCost?: number,
    finalDetails?: {
      laborPrice?: number;
      totalPrice?: number;
      commissionAmount?: number;
      technicianPayout?: number;
    }
  ) => {
    setBookings(prev =>
      prev.map(b => {
        if (b.id === bookingId) {
          const isStarting = status === 'in_progress';
          const isCompleting = status === 'completed';
          const laborPrice = finalDetails?.laborPrice ?? b.price;
          const partsCost = extraPartsCost !== undefined ? extraPartsCost : (b.partsCost || 0);
          const totalPrice = finalDetails?.totalPrice ?? (laborPrice + partsCost);
          // 10% Platform Commission on labor
          const commissionAmount = finalDetails?.commissionAmount ?? Math.round(laborPrice * 0.10);
          const technicianPayout = finalDetails?.technicianPayout ?? (totalPrice - commissionAmount);

          return {
            ...b,
            status,
            price: laborPrice,
            laborPrice,
            partsCost,
            totalPrice,
            commissionAmount,
            technicianPayout,
            paymentStatus: isCompleting ? 'pending_payment' : b.paymentStatus,
            startOtpVerified: isStarting ? true : b.startOtpVerified,
            completionOtpVerified: isCompleting ? true : b.completionOtpVerified,
          };
        }
        return b;
      })
    );

    if (status === 'in_progress') {
      showToast(`Start OTP verified! Job #${bookingId} is now in progress.`);
    } else if (status === 'completed') {
      const booking = bookings.find(b => b.id === bookingId);
      const labor = finalDetails?.laborPrice ?? (booking?.price || 0);
      const parts = extraPartsCost !== undefined ? extraPartsCost : (booking?.partsCost || 0);
      const total = finalDetails?.totalPrice ?? (labor + parts);
      const comm = finalDetails?.commissionAmount ?? Math.round(labor * 0.10);
      const netTech = finalDetails?.technicianPayout ?? (total - comm);

      if (booking && booking.technicianId) {
        const commTx: CoinTransaction = {
          id: 'ctx-comm-' + Date.now(),
          type: 'commission_deduct',
          amountCoins: -comm,
          amountETB: comm,
          bookingId: bookingId,
          description: `10% Platform Commission (${booking.serviceName})`,
          createdAt: 'Just now',
          reference: `COMM-${bookingId.slice(0, 8).toUpperCase()}`,
          status: 'completed',
        };

        setTechnicians(prev =>
          prev.map(t => {
            if (t.id === booking.technicianId) {
              const currentCoins = t.coinBalance ?? 1000;
              const newCoinBal = Math.max(0, currentCoins - comm);
              return {
                ...t,
                completedJobs: t.completedJobs + 1,
                earningsTodayETB: t.earningsTodayETB + netTech,
                earningsTotalETB: t.earningsTotalETB + netTech,
                walletBalanceETB: (t.walletBalanceETB || 0) + netTech,
                coinBalance: newCoinBal,
                coinLedger: [commTx, ...(t.coinLedger || [])],
                status: 'available',
              };
            }
            return t;
          })
        );
      }
      showToast(`Completion code verified! Invoice: ${total} ETB (10% platform commission auto-deducted: -${comm} FixCoins).`);
    } else if (status === 'cancelled') {
      showToast(`Order #${bookingId} has been cancelled.`);
    } else {
      showToast(`Job #${bookingId} status updated to ${status.replace('_', ' ')}`);
    }
  };

  // 3b. Top-up FixCoins via Chapa Payment Gateway
  const handleTopUpCoins = (
    techId: string,
    coins: number,
    priceETB: number,
    paymentChannel: string,
    referenceId: string
  ) => {
    const newTx: CoinTransaction = {
      id: 'ctx-topup-' + Date.now(),
      type: 'chapa_topup',
      amountCoins: coins,
      amountETB: priceETB,
      description: `Chapa Top-Up (+${coins.toLocaleString()} FixCoins)`,
      createdAt: 'Just now',
      reference: referenceId,
      paymentChannel: paymentChannel as any,
      status: 'completed'
    };

    setTechnicians(prev =>
      prev.map(t => {
        if (t.id === techId) {
          return {
            ...t,
            coinBalance: (t.coinBalance ?? 1000) + coins,
            coinLedger: [newTx, ...(t.coinLedger || [])]
          };
        }
        return t;
      })
    );
    showToast(`+${coins.toLocaleString()} FixCoins topped up via Chapa (${referenceId})!`);
  };

  // 3c. Renew Anti-Hacker Security Shield
  const handleRenewSecuritySub = (techId: string, costCoins: number) => {
    const newTx: CoinTransaction = {
      id: 'ctx-sub-' + Date.now(),
      type: 'monthly_security_sub',
      amountCoins: -costCoins,
      amountETB: costCoins,
      description: 'SmartFix Guard Anti-Hacker Shield (30 Days)',
      createdAt: 'Just now',
      reference: 'SUB-GUARD-' + Math.floor(100000 + Math.random() * 900000),
      status: 'completed'
    };

    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 30);
    const expiryStr = expiryDate.toISOString().split('T')[0];

    setTechnicians(prev =>
      prev.map(t => {
        if (t.id === techId) {
          return {
            ...t,
            coinBalance: Math.max(0, (t.coinBalance ?? 1000) - costCoins),
            securitySubscriptionActive: true,
            securitySubscriptionExpiry: expiryStr,
            coinLedger: [newTx, ...(t.coinLedger || [])]
          };
        }
        return t;
      })
    );
    showToast(`SmartFix Guard Anti-Hacker Shield renewed for 30 days (-${costCoins} FixCoins).`);
  };

  // 3d. Toggle Auto-Renew for Security Guard
  const handleToggleAutoRenew = (techId: string) => {
    setTechnicians(prev =>
      prev.map(t => {
        if (t.id === techId) {
          const nextVal = !t.securityAutoRenew;
          showToast(`Security Guard Auto-Renewal ${nextVal ? 'Enabled' : 'Disabled'}.`);
          return {
            ...t,
            securityAutoRenew: nextVal
          };
        }
        return t;
      })
    );
  };

  // 3b. Customer completes payment with selected method (Telebirr / CBE Birr / Cash)
  const handleCustomerPayBooking = (
    bookingId: string,
    paymentMethod: 'telebirr' | 'cbe_birr' | 'cash'
  ) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return;

    const labor = booking.laborPrice ?? booking.price;
    const parts = booking.partsCost || 0;
    const total = booking.totalPrice ?? (labor + parts);
    const comm = booking.commissionAmount ?? Math.round(labor * 0.10);
    const netTech = booking.technicianPayout ?? (total - comm);

    setBookings(prev =>
      prev.map(b =>
        b.id === bookingId
          ? {
              ...b,
              paymentMethod,
              paymentStatus: paymentMethod === 'cash' ? 'paid_direct' : 'settled',
            }
          : b
      )
    );

    // If customer paid via cash directly to technician, 10% commission is deducted from technician's SmartFix prepaid wallet
    // If paid via Telebirr or CBE Birr direct deposit, net 90% is credited directly to technician's account and 10% retained by platform
    if (paymentMethod === 'cash' && booking.technicianId) {
      setTechnicians(prev =>
        prev.map(t => {
          if (t.id === booking.technicianId) {
            return {
              ...t,
              commissionDueETB: Math.max(0, (t.commissionDueETB || 0) + comm),
              walletBalanceETB: Math.max(0, (t.walletBalanceETB || 0) - comm)
            };
          }
          return t;
        })
      );
    }

    const techName = booking.technicianName || 'Technician';
    if (paymentMethod === 'cash') {
      showToast(`Cash payment of ${total} ETB confirmed! (10% platform fee of ${comm} ETB recorded in tech wallet)`);
    } else if (paymentMethod === 'telebirr') {
      showToast(`Telebirr direct payment of ${netTech} ETB successfully sent to ${techName}! 10% (${comm} ETB) platform fee settled.`);
    } else {
      showToast(`CBE Birr direct payment of ${netTech} ETB successfully transferred to ${techName}! 10% (${comm} ETB) platform fee settled.`);
    }
  };

  // 3c. Technician profile payment info update
  const handleUpdateTechnicianProfile = (techId: string, updates: Partial<Technician>) => {
    setTechnicians(prev =>
      prev.map(t => (t.id === techId ? { ...t, ...updates } : t))
    );
    showToast('Technician direct deposit payment details updated successfully.');
  };

  // Customer cancels booking with optional reason
  const handleCancelBooking = (bookingId: string, reason?: string, notes?: string) => {
    setBookings(prev =>
      prev.map(b =>
        b.id === bookingId
          ? {
              ...b,
              status: 'cancelled',
              cancellationReason: reason,
              cancellationNotes: notes
            }
          : b
      )
    );
    showToast(`Order #${bookingId} cancelled. ${reason ? `Reason: ${reason}` : ''}`);
  };

  // Customer rates technician after completion
  const handleRateBooking = (bookingId: string, rating: number, comment?: string, tags?: string[], tip?: number) => {
    setBookings(prev =>
      prev.map(b => {
        if (b.id === bookingId) {
          return {
            ...b,
            rating,
            ratingComment: comment,
            ratingTags: tags,
            tipAmount: tip
          };
        }
        return b;
      })
    );

    const booking = bookings.find(b => b.id === bookingId);
    if (booking && booking.technicianId) {
      setTechnicians(prev =>
        prev.map(t => {
          if (t.id === booking.technicianId) {
            const currentTotalReviews = t.completedJobs || 1;
            const updatedRating = Number(((t.rating * currentTotalReviews + rating) / (currentTotalReviews + 1)).toFixed(2));
            return {
              ...t,
              rating: updatedRating,
              earningsTodayETB: t.earningsTodayETB + (tip || 0),
              earningsTotalETB: t.earningsTotalETB + (tip || 0)
            };
          }
          return t;
        })
      );
    }
    showToast(`Thank you! Review submitted for ${booking?.technicianName || 'Master Tech'} (${rating} ⭐)${tip ? ` • ${tip} ETB tip sent` : ''}`);
  };

  // 4. Admin assigns technician
  const handleAdminAssignTech = (bookingId: string, techId: string) => {
    const tech = technicians.find(t => t.id === techId);
    setBookings(prev =>
      prev.map(b => {
        if (b.id === bookingId) {
          return {
            ...b,
            technicianId: techId || undefined,
            technicianName: tech?.name,
            technicianPhone: tech?.phone,
            startOtp: b.startOtp || generateOtp(),
            completionOtp: b.completionOtp || generateOtp(),
            status: techId ? (b.status === 'pending' ? 'accepted' : b.status) : 'pending',
          };
        }
        return b;
      })
    );
    if (tech) {
      showToast(`Dispatched technician ${tech.name} to order #${bookingId}`);
    }
  };

  // 5. Admin updates full service details (name, price, image, category, etc.)
  const handleUpdateService = (serviceId: string, updates: Partial<ServiceItem>) => {
    setServices(prev =>
      prev.map(s => (s.id === serviceId ? { ...s, ...updates } : s))
    );
    showToast(`Updated service details in catalog`);
  };

  // 5b. Admin legacy price update
  const handleUpdateServicePrice = (serviceId: string, newPrice: number) => {
    handleUpdateService(serviceId, { price: newPrice });
  };

  // 6. Admin adds service
  const handleAddService = (newService: ServiceItem) => {
    setServices([newService, ...services]);
    showToast(`Added "${newService.name}" to official catalog`);
  };

  // 6b. Admin deletes service
  const handleDeleteService = (serviceId: string) => {
    const srv = services.find(s => s.id === serviceId);
    setServices(prev => prev.filter(s => s.id !== serviceId));
    showToast(`Removed "${srv?.name || 'Service'}" from catalog`);
  };

  // 6c. Admin Category Management (Add, Update, Delete)
  const handleAddCategory = (newCat: CategoryItem) => {
    setCategories(prev => [...prev, newCat]);
    showToast(`Created category "${newCat.label}"`);
  };

  const handleUpdateCategory = (categoryId: string, updates: Partial<CategoryItem>) => {
    setCategories(prev =>
      prev.map(c => (c.id === categoryId ? { ...c, ...updates } : c))
    );
    showToast(`Updated category "${updates.label || categoryId}"`);
  };

  const handleDeleteCategory = (categoryId: string) => {
    const cat = categories.find(c => c.id === categoryId);
    setCategories(prev => prev.filter(c => c.id !== categoryId));
    showToast(`Deleted category "${cat?.label || categoryId}"`);
  };

  // 7. Admin adds technician
  const handleAddTechnician = (newTech: Technician) => {
    setTechnicians([...technicians, newTech]);
    showToast(`Technician ${newTech.name} verified and added to fleet`);
  };

  // 8. Admin toggles tech verify
  const handleToggleTechVerify = (techId: string) => {
    setTechnicians(prev =>
      prev.map(t => (t.id === techId ? { ...t, verified: !t.verified } : t))
    );
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'dark bg-[#040812] text-slate-100' : 'bg-[#F4F6FB] text-slate-900'}`}>
      {/* GLOBAL NOTIFICATION TOAST */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-[#0F1E3D] text-white border-2 border-blue-400 px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-slide-down max-w-md w-[92%]">
          <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center flex-shrink-0">
            <CheckCircle className="w-5 h-5 text-blue-400" />
          </div>
          <div className="flex-1 text-xs">
            <p className="font-extrabold text-blue-300 uppercase text-[10px] tracking-wider">SmartFix Dispatch Event</p>
            <p className="text-white mt-0.5">{toastMessage}</p>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* TOP DESKTOP HEADER WITH ROLE SWITCHER & 5-LANGUAGE SELECTOR */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-[#070C1A]/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 px-4 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <SmartFixLogo variant="full" size="md" showTagline={true} isDark={isDarkMode} />
            <span className="hidden sm:inline-block text-[10px] font-mono uppercase bg-blue-50 dark:bg-blue-950/70 text-[#1E3A8A] dark:text-[#93C5FD] px-2 py-0.5 rounded-full font-bold border border-blue-200 dark:border-blue-800">
              Ethiopia
            </span>
          </div>

          {/* ROLE SWITCHER TABS (Customer, Technician, Admin) */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800">
            <button
              id="role-btn-customer"
              onClick={() => setRole('customer')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
                role === 'customer'
                  ? 'bg-gradient-to-r from-[#1E3A8A] to-[#2563EB] text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Customer App</span>
            </button>

            <button
              id="role-btn-technician"
              onClick={() => setRole('technician')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
                role === 'technician'
                  ? 'bg-gradient-to-r from-[#1E3A8A] to-[#2563EB] text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Wrench className="w-3.5 h-3.5 text-amber-300" />
              <span>Technician Portal</span>
            </button>

            <button
              id="role-btn-admin"
              onClick={() => setRole('admin')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
                role === 'admin'
                  ? 'bg-gradient-to-r from-[#1E3A8A] to-[#2563EB] text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>Admin Console</span>
            </button>
          </div>

          {/* 5-LANGUAGE DROPDOWN & THEME TOGGLE */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-bold text-slate-700 dark:text-slate-300 focus:outline-hidden hover:border-blue-500 shadow-xs cursor-pointer"
              >
                {LANGUAGE_OPTIONS.map(opt => (
                  <option key={opt.id} value={opt.id}>
                    {opt.flag} {opt.nativeName} ({opt.label})
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-blue-500 transition-colors shadow-xs"
              title="Toggle Dark / Light Mode"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-[#1E3A8A]" />}
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="py-6 px-4 sm:px-6">
        {/* ================= ROLE 1: CUSTOMER VIEW ================= */}
        {role === 'customer' && (
          <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center lg:items-start justify-center gap-8">
            {/* Left Context Explainer & Live Sync Info */}
            <div className="max-w-md space-y-4 text-left hidden lg:block pt-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1E3A8A]/10 dark:bg-[#2563EB]/20 text-[#1E3A8A] dark:text-[#93C5FD] font-mono font-bold text-xs border border-[#1E3A8A]/20">
                <Smartphone className="w-3.5 h-3.5 text-[#2563EB]" />
                <span>Customer Mobile Experience</span>
              </div>
              <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                Client Booking & Diagnostics
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Experience the verified Addis Ababa customer app: browse 8 core categories, run AI hardware diagnostics, schedule certified master technicians, and verify jobs with secure 2-step OTP codes.
              </p>
              
              <div className="space-y-2.5 pt-1">
                <div className="p-3 bg-white dark:bg-[#0D1527] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
                  <span className="font-bold text-xs text-[#1D4ED8] dark:text-[#60A5FA] block">2-Step Automated OTP Protocol</span>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Customers receive a <strong>Start OTP</strong> (given upon tech arrival) and a <strong>Completion OTP</strong> (given upon job completion and testing).
                  </p>
                </div>
                <div className="p-3 bg-white dark:bg-[#0D1527] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
                  <span className="font-bold text-xs text-emerald-600 dark:text-emerald-400 block">30-Day Quality Guarantee</span>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Every repair completed by SmartFix technicians is protected by our standard 30-day warranty.
                  </p>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  onClick={() => setRole('technician')}
                  className="text-xs font-bold text-[#1D4ED8] dark:text-[#60A5FA] hover:underline flex items-center gap-1"
                >
                  <Wrench className="w-3.5 h-3.5" />
                  Switch to Technician Portal
                </button>
              </div>
            </div>

            {/* Mobile App Canvas */}
            <div className="flex justify-center w-full lg:w-auto">
              <CustomerApp
                categories={categories}
                services={services}
                bookings={bookings}
                technicians={technicians}
                language={language}
                selectedLocation={selectedLocation}
                onSelectLocation={setSelectedLocation}
                onSetLanguage={setLanguage}
                onBookService={handleCustomerBooking}
                onCancelBooking={handleCancelBooking}
                onRateBooking={handleRateBooking}
                onPayBooking={handleCustomerPayBooking}
                onAcceptBooking={handleTechAcceptBooking}
                isDarkMode={isDarkMode}
              />
            </div>
          </div>
        )}

        {/* ================= ROLE 2: TECHNICIAN PORTAL ================= */}
        {role === 'technician' && (
          <div className="max-w-4xl mx-auto">
            <TechnicianDashboard
              technicians={technicians}
              activeTechId={activeTechId}
              onSelectTech={setActiveTechId}
              bookings={bookings}
              onUpdateBookingStatus={handleUpdateBookingStatus}
              onAcceptBooking={handleTechAcceptBooking}
              onUpdateTechProfile={handleUpdateTechnicianProfile}
              onUpdateTechGps={handleUpdateTechGps}
              onTopUpCoins={handleTopUpCoins}
              onRenewSecuritySub={handleRenewSecuritySub}
              onToggleAutoRenew={handleToggleAutoRenew}
              isDarkMode={isDarkMode}
            />
          </div>
        )}

        {/* ================= ROLE 3: ADMIN DISPATCH CONSOLE ================= */}
        {role === 'admin' && (
          <div className="w-full max-w-7xl mx-auto">
            <AdminDashboard
              categories={categories}
              onAddCategory={handleAddCategory}
              onUpdateCategory={handleUpdateCategory}
              onDeleteCategory={handleDeleteCategory}
              services={services}
              onUpdateService={handleUpdateService}
              onUpdateServicePrice={handleUpdateServicePrice}
              onAddService={handleAddService}
              onDeleteService={handleDeleteService}
              technicians={technicians}
              onAddTechnician={handleAddTechnician}
              onToggleTechVerify={handleToggleTechVerify}
              bookings={bookings}
              onAssignTechnician={handleAdminAssignTech}
              onUpdateBookingStatus={handleUpdateBookingStatus}
              isDarkMode={isDarkMode}
            />
          </div>
        )}
      </main>
    </div>
  );
}
