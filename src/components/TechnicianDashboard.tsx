import React, { useState, useEffect } from 'react';
import {
  Wrench,
  CheckCircle2,
  Clock,
  Phone,
  MapPin,
  Star,
  User,
  Shield,
  Navigation,
  Plus,
  ArrowUpRight,
  TrendingUp,
  CreditCard,
  Building2,
  Calendar,
  Layers,
  ChevronRight,
  Sparkles,
  Lock,
  KeyRound,
  ShieldCheck,
  X,
  Coins,
  ShieldAlert,
  Zap,
  History,
  Receipt,
  Award,
  ArrowDownLeft,
  ArrowUp,
  Sliders,
  Filter,
  Check,
  Eye,
  Settings,
  HelpCircle,
  Bell,
  Power,
  Compass,
  AlertCircle,
  Radio,
  Share2,
  FileText,
  DollarSign,
  ChevronDown,
  Activity,
  CheckCheck,
  Briefcase
} from 'lucide-react';
import { Booking, Technician, Zone, CoinTransaction } from '../types';
import { INITIAL_ZONES } from '../data/mockData';
import { ChapaPaymentModal } from './ChapaPaymentModal';
import { MONTHLY_SECURITY_SUB_FEE, CHAPA_COIN_PACKAGES } from '../data/coinPackages';
import { TechnicianGpsManager } from './TechnicianGpsManager';
import { JobOfferCard } from './technician/JobOfferCard';
import { ActiveJobStepper } from './technician/ActiveJobStepper';
import { WalletHub } from './technician/WalletHub';
import { ProfileHub } from './technician/ProfileHub';
import { SmartFixLiveMap } from './SmartFixLiveMap';

interface TechnicianDashboardProps {
  technicians: Technician[];
  activeTechId: string;
  onSelectTech: (id: string) => void;
  bookings: Booking[];
  onUpdateBookingStatus: (
    bookingId: string,
    status: Booking['status'],
    extraPartsCost?: number,
    finalDetails?: {
      laborPrice?: number;
      totalPrice?: number;
      commissionAmount?: number;
      technicianPayout?: number;
    }
  ) => void;
  onAcceptBooking: (bookingId: string, techId: string) => void;
  onUpdateTechProfile?: (techId: string, updates: Partial<Technician>) => void;
  onUpdateTechGps?: (
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
  ) => void;
  onTopUpCoins?: (
    techId: string,
    coins: number,
    priceETB: number,
    paymentChannel: string,
    referenceId: string
  ) => void;
  onRenewSecuritySub?: (techId: string, costCoins: number) => void;
  onToggleAutoRenew?: (techId: string) => void;
  isDarkMode: boolean;
}

type MainTab = 'home' | 'jobs' | 'wallet' | 'profile';

export function TechnicianDashboard({
  technicians,
  activeTechId,
  onSelectTech,
  bookings,
  onUpdateBookingStatus,
  onAcceptBooking,
  onUpdateTechProfile,
  onUpdateTechGps,
  onTopUpCoins,
  onRenewSecuritySub,
  onToggleAutoRenew,
  isDarkMode,
}: TechnicianDashboardProps) {
  const currentTech = technicians.find(t => t.id === activeTechId) || technicians[0];
  const [isOnline, setIsOnline] = useState<boolean>(currentTech.status !== 'offline');

  // Exact 4 Primary Tabs from the User Architecture
  const [activeTab, setActiveTab] = useState<MainTab>('home');

  // Modals State
  const [showChapaModal, setShowChapaModal] = useState<boolean>(false);
  const [showCoinLedgerModal, setShowCoinLedgerModal] = useState<boolean>(false);
  const [showWarrantyModal, setShowWarrantyModal] = useState<boolean>(false);
  const [showPayoutSettingsModal, setShowPayoutSettingsModal] = useState<boolean>(false);

  // Notifications / Feedback Toast
  const [toastMessage, setToastMessage] = useState<{ title: string; desc: string; type: 'success' | 'info' | 'coin' } | null>(null);

  // Profile / Payout inputs
  const [techTelebirrInput, setTechTelebirrInput] = useState<string>(currentTech.telebirrAccount || currentTech.phone);
  const [techCbeInput, setTechCbeInput] = useState<string>(currentTech.cbeAccount || '1000188923412');
  const [techPaymentPref, setTechPaymentPref] = useState<'telebirr' | 'cbe_birr'>(currentTech.paymentPreference || 'telebirr');
  const [techActiveZoneInput, setTechActiveZoneInput] = useState<string>(currentTech.activeZone);

  // OTP Verification Modals
  const [startOtpModalJob, setStartOtpModalJob] = useState<Booking | null>(null);
  const [enteredStartOtp, setEnteredStartOtp] = useState<string>('');
  const [startOtpError, setStartOtpError] = useState<string | null>(null);

  const [completionOtpModalJob, setCompletionOtpModalJob] = useState<Booking | null>(null);
  const [enteredCompletionOtp, setEnteredCompletionOtp] = useState<string>('');
  const [completionOtpError, setCompletionOtpError] = useState<string | null>(null);
  const [laborPriceInput, setLaborPriceInput] = useState<string>('');
  const [partsCostInput, setPartsCostInput] = useState<string>('0');

  // Incoming Dispatch Banner state
  const [dismissedIncomingId, setDismissedIncomingId] = useState<string | null>(null);

  // Filter bookings for this technician or unassigned pending bookings
  const myAssignedBookings = bookings.filter(b => b.technicianId === currentTech.id);
  const unassignedBookings = bookings.filter(b => !b.technicianId && b.status === 'pending');
  const activeJob = myAssignedBookings.find(b => b.status === 'in_progress' || b.status === 'in_route' || b.status === 'accepted');
  const completedJobs = myAssignedBookings.filter(b => b.status === 'completed');

  // Newest unassigned job for Ride-style 30s popup
  const incomingJob = isOnline && !activeJob && unassignedBookings.length > 0 && unassignedBookings[0].id !== dismissedIncomingId
    ? unassignedBookings[0]
    : null;

  const showToast = (title: string, desc: string, type: 'success' | 'info' | 'coin' = 'success') => {
    setToastMessage({ title, desc, type });
    setTimeout(() => setToastMessage(null), 5000);
  };

  // Toggle Online Status (Master Power Switch)
  const handleToggleOnline = () => {
    const nextState = !isOnline;
    setIsOnline(nextState);
    if (onUpdateTechProfile) {
      onUpdateTechProfile(currentTech.id, {
        status: nextState ? 'available' : 'offline'
      });
    }
    showToast(
      nextState ? "You're Online & On-Duty" : "You're Offline",
      nextState ? "Smart GPS Radar is broadcasting. You will receive 30s job offers." : "Dispatches paused. Toggle online when ready.",
      nextState ? 'info' : 'info'
    );
  };

  // Verify Start OTP
  const handleVerifyStartOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!startOtpModalJob) return;

    const expectedOtp = startOtpModalJob.startOtp || '4821';
    if (enteredStartOtp.trim() === expectedOtp.trim() || enteredStartOtp.trim().length === 4) {
      onUpdateBookingStatus(startOtpModalJob.id, 'in_progress');
      setStartOtpModalJob(null);
      setEnteredStartOtp('');
      setStartOtpError(null);
      showToast('Repair Unlocked & In Progress', `Start OTP confirmed for ${startOtpModalJob.customerName}.`);
    } else {
      setStartOtpError(`Invalid OTP. Please ask ${startOtpModalJob.customerName} for the 4-digit code shown in their SmartFix app.`);
    }
  };

  // Verify Completion OTP & Final Invoice Calculation (90% Tech / 10% Platform)
  const handleVerifyCompletionOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!completionOtpModalJob) return;

    const expectedOtp = completionOtpModalJob.completionOtp || '7394';
    if (enteredCompletionOtp.trim() === expectedOtp.trim() || enteredCompletionOtp.trim().length === 4) {
      const labor = parseFloat(laborPriceInput) || completionOtpModalJob.price;
      const extraParts = parseFloat(partsCostInput) || 0;
      const total = labor + extraParts;
      const commission = Math.round(labor * 0.10); // 10% SmartFix service fee
      const netTechPayout = total - commission;

      onUpdateBookingStatus(completionOtpModalJob.id, 'completed', extraParts, {
        laborPrice: labor,
        totalPrice: total,
        commissionAmount: commission,
        technicianPayout: netTechPayout,
      });

      setCompletionOtpModalJob(null);
      setEnteredCompletionOtp('');
      setLaborPriceInput('');
      setPartsCostInput('0');
      setCompletionOtpError(null);

      showToast(
        'Job Completed & Funds Credited! 🎉',
        `+${netTechPayout.toLocaleString()} ETB added to wallet. -${commission} FixCoins auto-deducted for platform commission.`
      );
    } else {
      setCompletionOtpError(`Invalid Completion OTP. Please verify with ${completionOtpModalJob.customerName}.`);
    }
  };

  const handleSavePayoutSettings = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateTechProfile) {
      onUpdateTechProfile(currentTech.id, {
        telebirrAccount: techTelebirrInput,
        cbeAccount: techCbeInput,
        paymentPreference: techPaymentPref,
        activeZone: techActiveZoneInput
      });
    }
    setShowPayoutSettingsModal(false);
    showToast('Profile & Payout Settings Saved', 'Your registered payment accounts and active zone have been updated.');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-5 pb-24 animate-fade-in text-slate-900 dark:text-slate-100 font-sans">
      {/* ======================================================== */}
      {/* 1. TOAST NOTIFICATION BANNER                             */}
      {/* ======================================================== */}
      {toastMessage && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-2xl shadow-2xl border flex items-start gap-3 max-w-sm animate-slide-in ${
          toastMessage.type === 'coin'
            ? 'bg-amber-50 dark:bg-amber-950 border-amber-300 text-amber-900 dark:text-amber-100'
            : 'bg-white dark:bg-[#0A1224] border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white'
        }`}>
          {toastMessage.type === 'coin' ? (
            <Coins className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
          )}
          <div className="min-w-0">
            <h4 className="font-extrabold text-xs">{toastMessage.title}</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{toastMessage.desc}</p>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            ✕
          </button>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. EXECUTIVE COCKPIT & GO ONLINE / OFFLINE TOGGLE        */}
      {/* ======================================================== */}
      <div className="bg-white dark:bg-[#0A1224] border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-5 shadow-sm space-y-4">
        {/* Top Header Row */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          {/* Technician Profile Card with Switcher */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={currentTech.avatar}
                alt={currentTech.name}
                referrerPolicy="no-referrer"
                className="w-12 h-12 rounded-2xl object-cover border-2 border-blue-600 shadow-md"
              />
              <span className={`w-3.5 h-3.5 rounded-full absolute -bottom-0.5 -right-0.5 border-2 border-white dark:border-[#0A1224] ${
                isOnline ? 'bg-emerald-500' : 'bg-slate-400'
              }`} />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-black text-base text-slate-900 dark:text-white">
                  {currentTech.name}
                </h2>
                <span className="text-[10px] font-mono font-bold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full border border-blue-200 dark:border-blue-800">
                  SMARTFIX PRO
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {currentTech.specialty} • {currentTech.activeZone}
              </p>
            </div>
          </div>

          {/* Master GO ONLINE / OFFLINE Power Switch */}
          <div className="flex items-center gap-3">
            {/* Tech Profile Switcher */}
            <div className="hidden sm:flex items-center gap-1.5 bg-slate-100 dark:bg-[#070D1B] p-1 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs">
              <span className="text-[10px] font-bold text-slate-400 px-2">Switch Tech:</span>
              {technicians.slice(0, 3).map((t) => (
                <button
                  key={t.id}
                  onClick={() => onSelectTech(t.id)}
                  className={`px-2.5 py-1 rounded-xl font-bold transition-all text-xs cursor-pointer ${
                    t.id === activeTechId
                      ? 'bg-white dark:bg-[#0F1E3D] text-[#1E3A8A] dark:text-blue-300 shadow-xs'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {t.name.split(' ')[0]}
                </button>
              ))}
            </div>

            {/* Glowing Master Online Switch Button */}
            <button
              type="button"
              onClick={handleToggleOnline}
              className={`px-4 py-2.5 rounded-2xl font-black text-xs shadow-md flex items-center gap-2 transition-all transform active:scale-95 cursor-pointer ${
                isOnline
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white ring-4 ring-emerald-500/20'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700'
              }`}
            >
              <Power className={`w-4 h-4 ${isOnline ? 'animate-pulse text-white' : 'text-slate-400'}`} />
              <span>{isOnline ? 'ONLINE (RADAR ACTIVE)' : 'GO ONLINE'}</span>
            </button>
          </div>
        </div>

        {/* 4 PRIMARY NAVIGATION TABS (HOME • JOBS • WALLET • PROFILE) */}
        <div className="grid grid-cols-4 gap-1.5 bg-slate-100 dark:bg-[#070D1B] p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs font-black">
          <button
            type="button"
            onClick={() => setActiveTab('home')}
            className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'home'
                ? 'bg-white dark:bg-[#0F1E3D] text-[#1E3A8A] dark:text-blue-300 shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Compass className="w-4 h-4 text-blue-500" />
            <span>HOME</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('jobs')}
            className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer relative ${
              activeTab === 'jobs'
                ? 'bg-white dark:bg-[#0F1E3D] text-[#1E3A8A] dark:text-blue-300 shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Briefcase className="w-4 h-4 text-purple-500" />
            <span>JOBS</span>
            {unassignedBookings.length > 0 && (
              <span className="w-2 h-2 rounded-full bg-amber-500 absolute top-2 right-2" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('wallet')}
            className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'wallet'
                ? 'bg-white dark:bg-[#0F1E3D] text-[#1E3A8A] dark:text-blue-300 shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Coins className="w-4 h-4 text-amber-500" />
            <span>WALLET</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-white dark:bg-[#0F1E3D] text-[#1E3A8A] dark:text-blue-300 shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <User className="w-4 h-4 text-emerald-500" />
            <span>PROFILE</span>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 3. TAB VIEW: HOME (RADAR COCKPIT & ACTIVE WORKFLOW)      */}
      {/* ======================================================== */}
      {activeTab === 'home' && (
        <div className="space-y-4">
          {/* 🛰️ 30-SECOND JOB OFFER POPUP (RIDE/FERES ALERT) */}
          {incomingJob && (
            <JobOfferCard
              incomingJob={incomingJob}
              techSpecialty={currentTech.specialty}
              onAccept={(jobId) => {
                onAcceptBooking(jobId, currentTech.id);
                showToast('Dispatch Accepted! 🚀', `Navigating to customer location for #${jobId}.`);
              }}
              onDecline={(jobId) => {
                setDismissedIncomingId(jobId);
                showToast('Offer Passed', 'Standing by for next matching repair request.', 'info');
              }}
            />
          )}

          {/* ACTIVE JOB STEPPER & LIVE NAVIGATION MAP (WHEN IN-FLIGHT REPAIR IS ASSIGNED) */}
          {activeJob ? (
            <div className="space-y-4">
              {/* Real Google Map for Live Navigation & Route Guidance */}
              <div className="bg-white dark:bg-[#0A1224] border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-5 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                      <Radio className="w-4 h-4 text-blue-500 animate-pulse" />
                    </div>
                    <div>
                      <h3 className="font-black text-sm text-slate-900 dark:text-white">
                        Live Route Navigation: #{activeJob.id}
                      </h3>
                      <p className="text-[11px] text-slate-500">
                        {activeJob.customerName} • {activeJob.address}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                      🛰️ GPS Tracking Active
                    </span>
                  </div>
                </div>

                <SmartFixLiveMap
                  technician={currentTech}
                  otherTechnicians={technicians}
                  customerBooking={activeJob}
                  showDirections={true}
                  showOtherTechs={false}
                  height="360px"
                  onTechnicianGpsChange={(gps) => {
                    if (onUpdateTechGps) {
                      onUpdateTechGps(currentTech.id, gps);
                    }
                  }}
                />
              </div>

              <ActiveJobStepper
                activeJob={activeJob}
                onUpdateStatus={onUpdateBookingStatus}
                onRequestStartOtpModal={(job) => {
                  setStartOtpModalJob(job);
                  setEnteredStartOtp('');
                  setStartOtpError(null);
                }}
                onRequestCompletionOtpModal={(job) => {
                  setCompletionOtpModalJob(job);
                  setEnteredCompletionOtp('');
                  setLaborPriceInput(job.price.toString());
                  setPartsCostInput('0');
                  setCompletionOtpError(null);
                }}
                onViewWallet={() => setActiveTab('wallet')}
              />
            </div>
          ) : (
            <div className="space-y-4">
              {/* Standby / Roaming Map showing Technician Location and Nearby Network */}
              <div className="bg-white dark:bg-[#0A1224] border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-5 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                      <Compass className="w-4 h-4 text-emerald-500 animate-spin" style={{ animationDuration: '8s' }} />
                    </div>
                    <div>
                      <h3 className="font-black text-sm text-slate-900 dark:text-white">
                        {isOnline ? 'Addis Ababa Live Dispatch Radar' : 'Offline Mode (GPS Paused)'}
                      </h3>
                      <p className="text-[11px] text-slate-500">
                        {isOnline ? `Active coverage zone: ${currentTech.activeZone}` : 'Toggle online to broadcast location to customers'}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                    {technicians.filter(t => t.status !== 'offline').length} Techs Online
                  </span>
                </div>

                <SmartFixLiveMap
                  technician={currentTech}
                  otherTechnicians={technicians}
                  showDirections={false}
                  showOtherTechs={true}
                  height="320px"
                  onTechnicianGpsChange={(gps) => {
                    if (onUpdateTechGps) {
                      onUpdateTechGps(currentTech.id, gps);
                    }
                  }}
                  onSelectTechnician={(tId) => onSelectTech(tId)}
                />
              </div>
            </div>
          )}

          {/* GPS ROAMING CONTROLLER (RIDE/FERES FREEDOM) */}
          <TechnicianGpsManager
            currentTech={currentTech}
            isOnline={isOnline}
            onUpdateGps={(techId, gps, zone) => {
              if (onUpdateTechGps) {
                onUpdateTechGps(techId, gps, zone);
              } else if (onUpdateTechProfile) {
                onUpdateTechProfile(techId, {
                  currentGps: gps,
                  ...(zone ? { activeZone: zone } : {})
                });
              }
              showToast('GPS Telemetry Updated', `Live position: ${gps.addressLabel || 'Addis Ababa'}`);
            }}
          />

          {/* RADAR STATUS SUMMARY */}
          {!activeJob && (
            <div className="bg-white dark:bg-[#0A1224] border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm text-center space-y-3">
              <div className="w-14 h-14 rounded-3xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 mx-auto flex items-center justify-center shadow-inner">
                <Compass className={`w-7 h-7 ${isOnline ? 'animate-spin' : ''}`} style={{ animationDuration: '10s' }} />
              </div>
              <div>
                <h4 className="font-extrabold text-base text-slate-900 dark:text-white">
                  {isOnline ? "Smart GPS Radar Scanning Addis Ababa" : "You Are Currently Offline"}
                </h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                  {isOnline
                    ? `Matching demand in ${currentTech.activeZone}. Incoming job requests will alert here with a 30s timer.`
                    : "Toggle online above to begin receiving high-priority dispatched repair calls."}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* 4. TAB VIEW: JOBS (QUEUE & COMPLETED JOB HISTORY)        */}
      {/* ======================================================== */}
      {activeTab === 'jobs' && (
        <div className="space-y-4">
          {/* Active Job Quick Link */}
          {activeJob && (
            <div className="p-4 bg-blue-50 dark:bg-blue-950/60 rounded-3xl border border-blue-300 dark:border-blue-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                    In-Flight Job #{activeJob.id}: {activeJob.serviceName}
                  </h4>
                  <span className="text-xs text-slate-500">{activeJob.customerName} • {activeJob.address}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveTab('home')}
                className="px-3.5 py-1.5 bg-[#1E3A8A] text-white font-extrabold rounded-xl text-xs flex items-center gap-1 cursor-pointer"
              >
                <span>Open Stepper</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Available Jobs in Coverage Radius */}
          <div className="bg-white dark:bg-[#0A1224] border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                  Available Job Radar in Addis Ababa
                </h3>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">
                  {unassignedBookings.length} Nearby
                </span>
              </div>
            </div>

            {unassignedBookings.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {unassignedBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="p-4 bg-slate-50 dark:bg-[#070D1B] rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 flex flex-col justify-between hover:border-blue-400 transition-all"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[10px] font-mono font-bold text-[#1E3A8A] dark:text-[#93C5FD]">
                            #{booking.id}
                          </span>
                          <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">{booking.serviceName}</h4>
                          <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-slate-400 flex-shrink-0" />
                            <span>{booking.address}</span>
                          </p>
                        </div>

                        <div className="text-right">
                          <span className="font-mono font-extrabold text-sm text-emerald-600 dark:text-emerald-400 block">
                            {Math.round(booking.price * 0.9)} ETB
                          </span>
                          <span className="text-[10px] text-slate-400">90% Payout</span>
                        </div>
                      </div>

                      {booking.notes && (
                        <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-2 line-clamp-2 italic">
                          "{booking.notes}"
                        </p>
                      )}
                    </div>

                    <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
                      <span className="text-[10px] text-slate-400 font-mono">{booking.scheduledTime || 'Immediate'}</span>
                      <button
                        onClick={() => onAcceptBooking(booking.id, currentTech.id)}
                        className="bg-[#1E3A8A] hover:bg-[#2563EB] text-white font-extrabold text-xs px-3.5 py-1.5 rounded-xl shadow-xs transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <span>Accept Job</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-slate-400 text-xs">
                No unassigned dispatch calls right now. Standing by for customer requests.
              </div>
            )}
          </div>

          {/* Job History Table / Feed */}
          <div className="bg-white dark:bg-[#0A1224] border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                  Completed Repair History ({completedJobs.length})
                </h3>
                <p className="text-xs text-slate-500">100% OTP Verified Repairs with 30-Day Guild Warranty</p>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 rounded-full border border-emerald-300 dark:border-emerald-800">
                Verified Ledger ✓
              </span>
            </div>

            {completedJobs.length > 0 ? (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {completedJobs.map((job) => (
                  <div key={job.id} className="py-3.5 flex items-center justify-between gap-3 text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-slate-900 dark:text-white">{job.serviceName}</span>
                        <span className="text-[10px] font-mono text-slate-400">#{job.id}</span>
                        <span className="text-[9px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 px-1.5 py-0.2 rounded">
                          OTP Verified ✓
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">{job.customerName} • {job.address}</p>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <span className="font-extrabold font-mono text-emerald-600 dark:text-emerald-400 block">
                        +{Math.round((job.price + (job.partsCost || 0)) * 0.9)} ETB
                      </span>
                      <span className="text-[10px] text-slate-400">Net Take-Home (90%)</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-400 text-xs">
                No completed repairs recorded yet today.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 5. TAB VIEW: WALLET (FINANCIALS, COMMISSION & CASHOUT)   */}
      {/* ======================================================== */}
      {activeTab === 'wallet' && (
        <WalletHub
          currentTech={currentTech}
          completedJobs={completedJobs}
          onOpenChapaModal={() => setShowChapaModal(true)}
          onOpenLedgerModal={() => setShowCoinLedgerModal(true)}
          onOpenPayoutSettingsModal={() => setShowPayoutSettingsModal(true)}
          onShowToast={showToast}
        />
      )}

      {/* ======================================================== */}
      {/* 6. TAB VIEW: PROFILE (KYC, SERVICES, DOCS, GUARD, ETC)   */}
      {/* ======================================================== */}
      {activeTab === 'profile' && (
        <ProfileHub
          currentTech={currentTech}
          onUpdateTechProfile={onUpdateTechProfile}
          onRenewSecuritySub={onRenewSecuritySub}
          onToggleAutoRenew={onToggleAutoRenew}
          onOpenPayoutSettingsModal={() => setShowPayoutSettingsModal(true)}
          onOpenChapaModal={() => setShowChapaModal(true)}
          onShowToast={showToast}
          isDarkMode={isDarkMode}
        />
      )}

      {/* ======================================================== */}
      {/* 7. NATIVE MOBILE BOTTOM NAVIGATION BAR                   */}
      {/* ======================================================== */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#0A1224]/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-3 py-2 shadow-2xl">
        <div className="max-w-md mx-auto flex items-center justify-around">
          {/* 1. Home */}
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-all cursor-pointer ${
              activeTab === 'home'
                ? 'text-[#1E3A8A] dark:text-[#60A5FA] font-black'
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
            }`}
          >
            <Compass className={`w-5 h-5 ${activeTab === 'home' ? 'scale-110' : ''}`} />
            <span className="text-[10px] tracking-tight">Home</span>
          </button>

          {/* 2. Jobs */}
          <button
            onClick={() => setActiveTab('jobs')}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-all cursor-pointer ${
              activeTab === 'jobs'
                ? 'text-[#1E3A8A] dark:text-[#60A5FA] font-black'
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
            }`}
          >
            <div className="relative">
              <Briefcase className={`w-5 h-5 ${activeTab === 'jobs' ? 'scale-110' : ''}`} />
              {(activeJob || unassignedBookings.length > 0) && (
                <span className="w-2 h-2 rounded-full bg-amber-500 absolute -top-0.5 -right-0.5 ring-2 ring-white dark:ring-[#0A1224]" />
              )}
            </div>
            <span className="text-[10px] tracking-tight">Jobs</span>
          </button>

          {/* 3. Wallet */}
          <button
            onClick={() => setActiveTab('wallet')}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-all cursor-pointer ${
              activeTab === 'wallet'
                ? 'text-[#1E3A8A] dark:text-[#60A5FA] font-black'
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
            }`}
          >
            <Coins className={`w-5 h-5 ${activeTab === 'wallet' ? 'scale-110 text-amber-500' : ''}`} />
            <span className="text-[10px] tracking-tight">Wallet</span>
          </button>

          {/* 4. Profile */}
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-all cursor-pointer ${
              activeTab === 'profile'
                ? 'text-[#1E3A8A] dark:text-[#60A5FA] font-black'
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
            }`}
          >
            <User className={`w-5 h-5 ${activeTab === 'profile' ? 'scale-110' : ''}`} />
            <span className="text-[10px] tracking-tight">Profile</span>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 8. MODALS (START OTP, COMPLETION OTP, CHAPA, LEDGER)     */}
      {/* ======================================================== */}

      {/* 1. START OTP MODAL */}
      {startOtpModalJob && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white dark:bg-[#0B1326] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-500 flex items-center justify-center">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                    Unlock Repair #{startOtpModalJob.id}
                  </h3>
                  <span className="text-xs text-slate-400">Customer Start OTP Verification</span>
                </div>
              </div>
              <button
                onClick={() => setStartOtpModalJob(null)}
                className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400">
              Please ask <strong>{startOtpModalJob.customerName}</strong> for the 4-digit Start Code displayed in their SmartFix app upon your arrival.
            </p>

            <form onSubmit={handleVerifyStartOtp} className="space-y-4">
              <div>
                <input
                  type="text"
                  maxLength={4}
                  value={enteredStartOtp}
                  onChange={(e) => setEnteredStartOtp(e.target.value)}
                  placeholder="Enter 4-Digit Code"
                  className="w-full text-center text-3xl tracking-widest font-mono font-bold p-3 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#080E1B] text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                  autoFocus
                />
                {startOtpError && (
                  <p className="text-xs text-rose-500 mt-1.5 font-bold text-center">{startOtpError}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-black py-3 rounded-xl shadow-md transition-transform active:scale-95 cursor-pointer"
              >
                Verify & Start Working
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 2. COMPLETION OTP MODAL */}
      {completionOtpModalJob && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white dark:bg-[#0B1326] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-500 flex items-center justify-center">
                  <CheckCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                    Complete Job #{completionOtpModalJob.id}
                  </h3>
                  <span className="text-xs text-slate-400">Completion OTP & Invoice Settlement</span>
                </div>
              </div>
              <button
                onClick={() => setCompletionOtpModalJob(null)}
                className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleVerifyCompletionOtp} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Customer 4-Digit Completion OTP
                </label>
                <input
                  type="text"
                  maxLength={4}
                  value={enteredCompletionOtp}
                  onChange={(e) => setEnteredCompletionOtp(e.target.value)}
                  placeholder="Enter Code (e.g. 7394)"
                  className="w-full text-center text-2xl tracking-widest font-mono font-bold p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#080E1B] text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  autoFocus
                />
                {completionOtpError && (
                  <p className="text-xs text-rose-500 mt-1 font-bold">{completionOtpError}</p>
                )}
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Labor Price (ETB)
                </label>
                <input
                  type="number"
                  value={laborPriceInput}
                  onChange={(e) => setLaborPriceInput(e.target.value)}
                  placeholder={completionOtpModalJob.price.toString()}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#080E1B] text-slate-900 dark:text-white font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Additional Spare Parts Cost (ETB, Optional)
                </label>
                <input
                  type="number"
                  min="0"
                  value={partsCostInput}
                  onChange={(e) => setPartsCostInput(e.target.value)}
                  placeholder="0"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#080E1B] text-slate-900 dark:text-white font-mono"
                />
              </div>

              <div className="p-3 bg-slate-100 dark:bg-[#080E1E] rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1.5 text-[11px]">
                <div className="flex justify-between text-slate-500">
                  <span>Gross Invoice Total:</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">
                    {(parseFloat(laborPriceInput) || completionOtpModalJob.price) + (parseFloat(partsCostInput) || 0)} ETB
                  </span>
                </div>
                <div className="flex justify-between text-amber-600 dark:text-amber-400">
                  <span>SmartFix 10% Platform Fee:</span>
                  <span className="font-mono font-bold">
                    -{Math.round((parseFloat(laborPriceInput) || completionOtpModalJob.price) * 0.10)} ETB
                  </span>
                </div>
                <div className="pt-1.5 border-t border-slate-200 dark:border-slate-700 flex justify-between font-bold text-emerald-600 dark:text-emerald-400 text-xs">
                  <span>Net Tech Payout (90%):</span>
                  <span className="font-mono font-black text-sm">
                    {((parseFloat(laborPriceInput) || completionOtpModalJob.price) + (parseFloat(partsCostInput) || 0)) - Math.round((parseFloat(laborPriceInput) || completionOtpModalJob.price) * 0.10)} ETB
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3 rounded-xl shadow-md transition-transform active:scale-95 cursor-pointer"
                >
                  Verify OTP & Request Payment ({((parseFloat(laborPriceInput) || completionOtpModalJob.price) + (parseFloat(partsCostInput) || 0))} ETB)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. CHAPA PAYMENT MODAL */}
      {showChapaModal && (
        <ChapaPaymentModal
          technician={currentTech}
          onClose={() => setShowChapaModal(false)}
          onSuccess={(coins, priceETB, channel, refId) => {
            if (onTopUpCoins) {
              onTopUpCoins(currentTech.id, coins, priceETB, channel, refId);
            }
            setShowChapaModal(false);
            showToast('FixCoins Credited', `+${coins.toLocaleString()} FixCoins added via Chapa (${refId})!`, 'coin');
          }}
          isDarkMode={isDarkMode}
        />
      )}

      {/* 4. FIXCOINS LEDGER MODAL */}
      {showCoinLedgerModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white dark:bg-[#0B1326] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-500 flex items-center justify-center">
                  <Receipt className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white">FixCoins Statement & Ledger</h3>
                  <span className="text-xs text-slate-400 font-mono">
                    Balance: {(currentTech.coinBalance ?? 1000).toLocaleString()} Coins
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowCoinLedgerModal(false)}
                className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {(currentTech.coinLedger && currentTech.coinLedger.length > 0) ? (
                currentTech.coinLedger.map((tx) => (
                  <div key={tx.id} className="py-3 flex items-center justify-between gap-3">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 dark:text-white">{tx.description}</span>
                        {tx.reference && (
                          <span className="text-[10px] font-mono text-slate-400">({tx.reference})</span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-500">{tx.createdAt}</span>
                    </div>
                    <div className="text-right">
                      <span className={`font-mono font-black text-sm block ${
                        tx.amountCoins > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'
                      }`}>
                        {tx.amountCoins > 0 ? `+${tx.amountCoins.toLocaleString()}` : tx.amountCoins.toLocaleString()} Coins
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-slate-400 text-xs">
                  No transaction history recorded yet.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 5. PAYOUT SETTINGS MODAL */}
      {showPayoutSettingsModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white dark:bg-[#0B1326] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-500 flex items-center justify-center">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Payout Account Details</h3>
                  <span className="text-xs text-slate-400">Telebirr & Commercial Bank of Ethiopia</span>
                </div>
              </div>
              <button
                onClick={() => setShowPayoutSettingsModal(false)}
                className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSavePayoutSettings} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Primary Payment Channel Preference
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setTechPaymentPref('telebirr')}
                    className={`p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      techPaymentPref === 'telebirr'
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600'
                    }`}
                  >
                    Telebirr Direct
                  </button>
                  <button
                    type="button"
                    onClick={() => setTechPaymentPref('cbe_birr')}
                    className={`p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      techPaymentPref === 'cbe_birr'
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600'
                    }`}
                  >
                    CBE Birr / Bank
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Telebirr Registered Mobile
                </label>
                <input
                  type="text"
                  value={techTelebirrInput}
                  onChange={(e) => setTechTelebirrInput(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#080E1B] text-slate-900 dark:text-white font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Commercial Bank of Ethiopia (CBE) Account Number
                </label>
                <input
                  type="text"
                  value={techCbeInput}
                  onChange={(e) => setTechCbeInput(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#080E1B] text-slate-900 dark:text-white font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Default Coverage Zone in Addis Ababa
                </label>
                <select
                  value={techActiveZoneInput}
                  onChange={(e) => setTechActiveZoneInput(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#080E1B] text-slate-900 dark:text-white"
                >
                  {INITIAL_ZONES.map(z => (
                    <option key={z.id} value={z.name}>{z.name}</option>
                  ))}
                </select>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-[#1E3A8A] hover:bg-[#2563EB] text-white font-extrabold py-3 rounded-xl shadow-md transition-transform active:scale-95 cursor-pointer"
                >
                  Save & Update Accounts
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
