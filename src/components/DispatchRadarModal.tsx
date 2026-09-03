import React, { useState, useEffect } from 'react';
import {
  Radio,
  Navigation,
  Star,
  MapPin,
  Clock,
  ShieldCheck,
  Check,
  X,
  Compass,
  Zap,
  Activity,
  Layers,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  TrendingUp
} from 'lucide-react';
import { Booking, Technician } from '../types';
import { rankEligibleTechnicians, DispatchRankScore } from '../services/dispatchEngine';

interface DispatchRadarModalProps {
  booking: Booking;
  technicians: Technician[];
  allBookings: Booking[];
  isOpen: boolean;
  onClose: () => void;
  onAssignTechnician: (bookingId: string, technicianId: string) => void;
}

export function DispatchRadarModal({
  booking,
  technicians,
  allBookings,
  isOpen,
  onClose,
  onAssignTechnician
}: DispatchRadarModalProps) {
  const [stage, setStage] = useState<'ranking' | 'offered' | 'confirmed'>('ranking');
  const [rankedList, setRankedList] = useState<DispatchRankScore[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<DispatchRankScore | null>(null);
  const [offerCountdown, setOfferCountdown] = useState<number>(15);
  const [autoOfferActive, setAutoOfferActive] = useState<boolean>(true);

  // Compute live ranking on mount or when booking changes
  useEffect(() => {
    if (isOpen && booking) {
      setStage('ranking');
      const ranked = rankEligibleTechnicians(
        {
          category: booking.category,
          serviceName: booking.serviceName,
          zone: booking.zone,
          address: booking.address,
          gpsCoordinates: booking.gpsCoordinates
        },
        technicians,
        allBookings,
        25 // Max 25km radius
      );
      setRankedList(ranked);

      if (ranked.length > 0) {
        setSelectedMatch(ranked[0]);
        // Auto transition to offer stage after 1.5s radar animation
        const t = setTimeout(() => {
          setStage('offered');
          setOfferCountdown(15);
        }, 1200);
        return () => clearTimeout(t);
      }
    }
  }, [isOpen, booking?.id]);

  // Countdown timer for automatic offer dispatch
  useEffect(() => {
    if (stage === 'offered' && selectedMatch && autoOfferActive) {
      if (offerCountdown <= 0) {
        // Auto confirm to best technician
        handleConfirmOffer(selectedMatch.technician.id);
        return;
      }
      const interval = setInterval(() => {
        setOfferCountdown(prev => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [stage, offerCountdown, selectedMatch, autoOfferActive]);

  const handleConfirmOffer = (techId: string) => {
    setStage('confirmed');
    setTimeout(() => {
      onAssignTechnician(booking.id, techId);
      onClose();
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fade-in">
      <div className="w-full max-w-lg bg-white dark:bg-[#0A1224] border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Radar Header */}
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-blue-900/10 via-slate-50 to-transparent dark:from-blue-950/40 dark:via-[#090F1E] dark:to-transparent flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#0F1E3D] text-white flex items-center justify-center relative shadow-md">
              <Radio className="w-5 h-5 text-blue-400 animate-ping absolute opacity-60" />
              <Compass className="w-5 h-5 text-amber-400 relative z-10" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-sm text-slate-900 dark:text-white">
                  SmartFix GPS Dispatch Engine
                </h3>
                <span className="text-[10px] font-mono font-bold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 px-2 py-0.2 rounded-full">
                  Ride/Feres Algorithm
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Dispatching for #{booking.id} • {booking.serviceName} ({booking.zone})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Dynamic Content */}
        <div className="p-5 overflow-y-auto space-y-4">
          {/* 5-Step Pipeline Progress Indicator */}
          <div className="bg-slate-50 dark:bg-[#070D1B] p-3 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-extrabold text-slate-700 dark:text-slate-300">
              <span>Matching Pipeline:</span>
              <span className="text-blue-600 dark:text-blue-400">
                {stage === 'ranking' ? 'Scanning GPS Radii...' : stage === 'offered' ? 'Offering to Top Ranked Tech' : 'Dispatched & Locked'}
              </span>
            </div>

            {/* Visual 5-step filter checklist */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 text-[10px] font-medium">
              <div className="p-1.5 bg-white dark:bg-[#0D162B] rounded-lg border border-emerald-300 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-bold">
                <Check className="w-3 h-3 flex-shrink-0" />
                <span>1. Online GPS</span>
              </div>
              <div className="p-1.5 bg-white dark:bg-[#0D162B] rounded-lg border border-emerald-300 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-bold">
                <Check className="w-3 h-3 flex-shrink-0" />
                <span>2. Verified KYC</span>
              </div>
              <div className="p-1.5 bg-white dark:bg-[#0D162B] rounded-lg border border-emerald-300 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-bold">
                <Check className="w-3 h-3 flex-shrink-0" />
                <span>3. Skill Match</span>
              </div>
              <div className="p-1.5 bg-white dark:bg-[#0D162B] rounded-lg border border-emerald-300 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-bold">
                <Check className="w-3 h-3 flex-shrink-0" />
                <span>4. Not Busy</span>
              </div>
              <div className="p-1.5 bg-white dark:bg-[#0D162B] rounded-lg border border-emerald-300 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-bold">
                <Check className="w-3 h-3 flex-shrink-0" />
                <span>5. Service Radius</span>
              </div>
            </div>
          </div>

          {/* If top match is found, show the Featured Offer Card (Ride Style) */}
          {selectedMatch && (
            <div className="p-4 bg-gradient-to-br from-blue-500/10 via-slate-50 to-white dark:from-blue-950/40 dark:via-[#090F1E] dark:to-[#0D1527] rounded-3xl border-2 border-blue-500/30 shadow-md space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  <span className="text-xs font-black uppercase text-blue-600 dark:text-blue-400 tracking-wider">
                    Rank #1 Best Match Technician
                  </span>
                </div>

                {stage === 'offered' && (
                  <div className="flex items-center gap-1.5 bg-amber-400/20 text-amber-900 dark:text-amber-300 px-2.5 py-1 rounded-full border border-amber-400/40 text-xs font-mono font-black">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Auto-Offer ({offerCountdown}s)</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3">
                <img
                  src={selectedMatch.technician.avatar}
                  alt={selectedMatch.technician.name}
                  referrerPolicy="no-referrer"
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-blue-600 shadow-sm flex-shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-extrabold text-sm text-slate-900 dark:text-white truncate">
                      {selectedMatch.technician.name}
                    </h4>
                    <span className="text-[10px] font-mono font-bold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 px-1.5 py-0.2 rounded">
                      {selectedMatch.totalCompositeScore} Score
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                    {selectedMatch.technician.specialty}
                  </p>
                  <div className="flex items-center gap-3 text-xs mt-1 font-bold">
                    <span className="flex items-center gap-1 text-amber-500">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      {selectedMatch.technician.rating}
                    </span>
                    <span className="text-blue-600 dark:text-blue-400">
                      📍 {selectedMatch.distanceKm} km away
                    </span>
                    <span className="text-emerald-600 dark:text-emerald-400">
                      ⏱️ ETA: {selectedMatch.etaDisplay}
                    </span>
                  </div>
                </div>
              </div>

              {/* Match Criteria Metrics Breakdown */}
              <div className="grid grid-cols-3 gap-2 pt-1 text-xs">
                <div className="p-2 bg-white dark:bg-[#070D1B] rounded-xl border border-slate-200 dark:border-slate-800 text-center">
                  <span className="text-[9px] text-slate-400 uppercase block font-bold">Est. Travel</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">
                    {selectedMatch.estimatedTravelTimeMin} mins
                  </span>
                </div>
                <div className="p-2 bg-white dark:bg-[#070D1B] rounded-xl border border-slate-200 dark:border-slate-800 text-center">
                  <span className="text-[9px] text-slate-400 uppercase block font-bold">Active Jobs</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">
                    {selectedMatch.workloadActiveJobs} (Light)
                  </span>
                </div>
                <div className="p-2 bg-white dark:bg-[#070D1B] rounded-xl border border-slate-200 dark:border-slate-800 text-center">
                  <span className="text-[9px] text-slate-400 uppercase block font-bold">Warranty Pledge</span>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    {selectedMatch.technician.warrantyPromiseDays || 30} Days
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => handleConfirmOffer(selectedMatch.technician.id)}
                  className="flex-1 py-2.5 bg-gradient-to-r from-[#1E3A8A] to-[#2563EB] hover:from-[#1E3A8A] hover:to-[#1D4ED8] text-white font-extrabold rounded-xl text-xs shadow-md flex items-center justify-center gap-1.5 transition-transform active:scale-95 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Offer Job to {selectedMatch.technician.name.split(' ')[0]}</span>
                </button>
              </div>
            </div>
          )}

          {/* All Ranked Eligible Candidates */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                All Ranked Eligible Technicians ({rankedList.length}):
              </span>
              <span className="text-[10px] text-slate-400">Ranked by Time, Distance, Rating & Workload</span>
            </div>

            <div className="space-y-2">
              {rankedList.map((item, idx) => {
                const isSelected = selectedMatch?.technician.id === item.technician.id;
                return (
                  <div
                    key={item.technician.id}
                    onClick={() => setSelectedMatch(item)}
                    className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 cursor-pointer ${
                      isSelected
                        ? 'bg-blue-50/80 dark:bg-blue-950/60 border-blue-500 shadow-xs'
                        : 'bg-white dark:bg-[#070D1B] border-slate-200 dark:border-slate-800 hover:border-blue-400'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 flex items-center justify-center font-bold text-xs flex-shrink-0">
                        #{idx + 1}
                      </div>
                      <img
                        src={item.technician.avatar}
                        alt={item.technician.name}
                        referrerPolicy="no-referrer"
                        className="w-9 h-9 rounded-xl object-cover border border-slate-300 flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-slate-900 dark:text-white truncate">
                            {item.technician.name}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {item.technician.completedJobs} jobs
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 truncate">
                          {item.technician.currentGps?.addressLabel || item.technician.activeZone}
                        </p>
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <div className="font-extrabold text-xs text-blue-600 dark:text-blue-400 font-mono">
                        {item.distanceKm} km • {item.etaDisplay}
                      </div>
                      <div className="text-[10px] text-emerald-600 font-bold">
                        {item.totalCompositeScore} composite score
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
