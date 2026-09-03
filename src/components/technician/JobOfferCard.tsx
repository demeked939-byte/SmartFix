import React, { useState, useEffect } from 'react';
import {
  Radio,
  Clock,
  MapPin,
  Check,
  X,
  Phone,
  ShieldCheck,
  Sparkles,
  Zap,
  TrendingUp,
  AlertTriangle,
  Volume2,
  VolumeX
} from 'lucide-react';
import { Booking } from '../../types';

interface JobOfferCardProps {
  incomingJob: Booking;
  onAccept: (bookingId: string) => void;
  onDecline: (bookingId: string) => void;
  techSpecialty: string;
}

export function JobOfferCard({
  incomingJob,
  onAccept,
  onDecline,
  techSpecialty
}: JobOfferCardProps) {
  const [countdown, setCountdown] = useState<number>(30);
  const [soundAlert, setSoundAlert] = useState<boolean>(true);

  // 30-Second countdown
  useEffect(() => {
    setCountdown(30);
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          onDecline(incomingJob.id);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [incomingJob.id]);

  const grossFare = incomingJob.price || 400;
  const platformFee = Math.round(grossFare * 0.10); // 10% SmartFix commission
  const netTakeHome = grossFare - platformFee; // 90% Tech Payout

  // Calculate percentage of remaining time
  const percentLeft = (countdown / 30) * 100;

  return (
    <div className="bg-gradient-to-br from-amber-500/20 via-blue-900/10 to-emerald-500/10 dark:from-amber-950/40 dark:via-[#090F1E] dark:to-[#06151E] border-2 border-amber-400 dark:border-amber-500 rounded-3xl p-4 sm:p-6 shadow-2xl space-y-4 relative overflow-hidden animate-fade-in">
      {/* Background Radar Rings */}
      <div className="absolute -top-16 -right-16 w-44 h-44 rounded-full bg-amber-400/10 dark:bg-amber-400/5 animate-ping pointer-events-none" />

      {/* Top Bar: Title & Countdown Ring */}
      <div className="flex items-center justify-between gap-3 relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shadow-lg">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase text-amber-800 dark:text-amber-300 tracking-wider">
                🛰️ SMART DISPATCH JOB OFFER
              </span>
              <span className="text-[10px] font-mono font-bold bg-amber-400/20 text-amber-900 dark:text-amber-300 px-2 py-0.5 rounded-full border border-amber-400/30">
                Level 1 Priority
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Dispatched to you via Addis GPS Radar Matching
            </p>
          </div>
        </div>

        {/* Circular Countdown Timer */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSoundAlert(!soundAlert)}
            className="w-8 h-8 rounded-full bg-slate-200/60 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 flex items-center justify-center hover:scale-105 transition-transform"
            title={soundAlert ? 'Mute Alert' : 'Unmute Alert'}
          >
            {soundAlert ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5 text-slate-400" />}
          </button>

          <div className="relative w-12 h-12 flex items-center justify-center flex-shrink-0">
            <svg className="w-12 h-12 transform -rotate-90">
              <circle
                cx="24"
                cy="24"
                r="20"
                stroke="currentColor"
                strokeWidth="3"
                className="text-slate-200 dark:text-slate-800 fill-none"
              />
              <circle
                cx="24"
                cy="24"
                r="20"
                stroke="currentColor"
                strokeWidth="3.5"
                strokeDasharray={125.6}
                strokeDashoffset={125.6 - (125.6 * percentLeft) / 100}
                strokeLinecap="round"
                className={`fill-none transition-all duration-1000 ${
                  countdown <= 10 ? 'text-rose-500' : 'text-amber-500'
                }`}
              />
            </svg>
            <span className={`absolute font-mono font-black text-sm ${
              countdown <= 10 ? 'text-rose-600 dark:text-rose-400 animate-pulse' : 'text-slate-900 dark:text-white'
            }`}>
              {countdown}s
            </span>
          </div>
        </div>
      </div>

      {/* Main Job Details Card */}
      <div className="bg-white dark:bg-[#070D1B] rounded-2xl border border-amber-200/70 dark:border-amber-900/40 p-4 space-y-3.5 shadow-sm">
        {/* Service & Fare Row */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <span className="text-[10px] font-mono font-bold text-[#1E3A8A] dark:text-[#93C5FD]">
              #{incomingJob.id} • {incomingJob.category?.toUpperCase() || 'GENERAL REPAIR'}
            </span>
            <h3 className="font-black text-base sm:text-lg text-slate-900 dark:text-white">
              {incomingJob.serviceName}
            </h3>
            <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 mt-1">
              <MapPin className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
              <span className="font-semibold">{incomingJob.address}</span>
              <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-1.5 py-0.2 rounded">
                ~1.4 km (5 min ETA)
              </span>
            </div>
          </div>

          <div className="text-right bg-emerald-50 dark:bg-emerald-950/60 p-2.5 rounded-xl border border-emerald-200 dark:border-emerald-900/40 flex-shrink-0">
            <span className="text-[9px] uppercase font-bold text-emerald-700 dark:text-emerald-300 block">
              Net Take-Home (90%)
            </span>
            <span className="text-xl font-black font-mono text-emerald-600 dark:text-emerald-400 block">
              {netTakeHome.toLocaleString()} ETB
            </span>
            <span className="text-[10px] text-slate-400">Gross: {grossFare} ETB</span>
          </div>
        </div>

        {/* Customer Diagnostic Problem Note */}
        {incomingJob.notes && (
          <div className="bg-slate-50 dark:bg-[#0D162B] p-2.5 rounded-xl text-xs border border-slate-200 dark:border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 uppercase block mb-0.5">Reported Issue / Notes:</span>
            <p className="text-slate-700 dark:text-slate-300 italic">
              "{incomingJob.notes}"
            </p>
          </div>
        )}

        {/* Trust Badges */}
        <div className="grid grid-cols-3 gap-2 text-[10px] text-center font-bold">
          <div className="p-1.5 bg-slate-50 dark:bg-[#0D162B] rounded-lg border border-slate-200 dark:border-slate-800">
            <span className="text-slate-400 block text-[8px] uppercase">Payment</span>
            <span className="text-slate-800 dark:text-slate-200">
              {incomingJob.paymentMethod ? incomingJob.paymentMethod.toUpperCase() : 'TELEBIRR DIRECT'}
            </span>
          </div>
          <div className="p-1.5 bg-slate-50 dark:bg-[#0D162B] rounded-lg border border-slate-200 dark:border-slate-800">
            <span className="text-slate-400 block text-[8px] uppercase">OTP Security</span>
            <span className="text-emerald-600 dark:text-emerald-400">Start & Complete</span>
          </div>
          <div className="p-1.5 bg-slate-50 dark:bg-[#0D162B] rounded-lg border border-slate-200 dark:border-slate-800">
            <span className="text-slate-400 block text-[8px] uppercase">Warranty</span>
            <span className="text-blue-600 dark:text-blue-400">30-Day Escrow</span>
          </div>
        </div>

        {/* Action Buttons: ACCEPT or DECLINE */}
        <div className="flex items-center gap-2.5 pt-1">
          <button
            type="button"
            onClick={() => onDecline(incomingJob.id)}
            className="flex-1 py-3 px-3 rounded-xl border border-slate-300 dark:border-slate-700 font-extrabold text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <X className="w-4 h-4" />
            <span>Decline / Pass</span>
          </button>

          <button
            type="button"
            onClick={() => onAccept(incomingJob.id)}
            className="flex-2 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs sm:text-sm shadow-xl shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all transform active:scale-95 cursor-pointer"
          >
            <Check className="w-5 h-5" />
            <span>ACCEPT JOB ({netTakeHome} ETB)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
