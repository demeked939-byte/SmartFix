import React, { useState, useEffect } from 'react';
import {
  Navigation,
  MapPin,
  Phone,
  MessageSquare,
  KeyRound,
  CheckCheck,
  Clock,
  Play,
  Pause,
  Plus,
  Trash2,
  DollarSign,
  ShieldCheck,
  CheckCircle2,
  Coins,
  ArrowRight,
  Sparkles,
  Camera,
  Layers,
  HelpCircle,
  FileText
} from 'lucide-react';
import { Booking } from '../../types';

interface ActiveJobStepperProps {
  activeJob: Booking;
  onUpdateStatus: (
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
  onRequestStartOtpModal: (job: Booking) => void;
  onRequestCompletionOtpModal: (job: Booking) => void;
  onViewWallet: () => void;
}

export function ActiveJobStepper({
  activeJob,
  onUpdateStatus,
  onRequestStartOtpModal,
  onRequestCompletionOtpModal,
  onViewWallet
}: ActiveJobStepperProps) {
  // Service Timer (Stopwatch)
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(true);

  // Diagnostic checklist state
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({
    'safety_isolation': true,
    'circuit_check': true,
    'replacement_installed': false,
    'load_testing': false
  });

  // Additional spare parts line items
  const [partsList, setPartsList] = useState<Array<{ name: string; cost: number }>>([]);
  const [newPartName, setNewPartName] = useState<string>('');
  const [newPartCost, setNewPartCost] = useState<string>('');
  const [showAddPart, setShowAddPart] = useState<boolean>(false);

  // Simulated stopwatch
  useEffect(() => {
    let interval: any = null;
    if (activeJob.status === 'in_progress' && isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds(s => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeJob.status, isTimerRunning]);

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAddPart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPartName.trim()) return;
    const cost = parseFloat(newPartCost) || 0;
    setPartsList([...partsList, { name: newPartName.trim(), cost }]);
    setNewPartName('');
    setNewPartCost('');
    setShowAddPart(false);
  };

  const handleRemovePart = (index: number) => {
    setPartsList(partsList.filter((_, i) => i !== index));
  };

  const totalPartsCost = partsList.reduce((sum, p) => sum + p.cost, 0);
  const laborFare = activeJob.price || 450;
  const platformFee = Math.round(laborFare * 0.10);
  const netEarnings = (laborFare + totalPartsCost) - platformFee;

  // Determine current active step (1 to 6)
  let currentStepNumber = 1;
  if (activeJob.status === 'accepted') currentStepNumber = 1; // NAVIGATE
  else if (activeJob.status === 'in_route') currentStepNumber = 2; // ARRIVED / START CODE
  else if (activeJob.status === 'in_progress') currentStepNumber = 4; // SERVICE IN PROGRESS
  else if (activeJob.status === 'completed') currentStepNumber = 6; // FIXCOIN WALLET

  return (
    <div className="bg-white dark:bg-[#0A1224] border-2 border-[#1E3A8A] rounded-3xl p-4 sm:p-6 shadow-xl space-y-5">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[#0F1E3D] text-white flex items-center justify-center relative shadow-md">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 absolute top-2 right-2 animate-ping" />
            <Navigation className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-black text-base sm:text-lg text-slate-900 dark:text-white">
                Active Job: #{activeJob.id}
              </h3>
              <span className="text-[10px] font-mono font-black uppercase px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-800">
                {activeJob.status.replace('_', ' ')}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {activeJob.serviceName} • {activeJob.customerName}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={`tel:${activeJob.customerPhone}`}
            className="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-300 rounded-xl text-xs font-bold border border-emerald-300 dark:border-emerald-800 flex items-center gap-1.5 hover:scale-105 transition-transform"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Call ({activeJob.customerPhone})</span>
          </a>
          <a
            href={`sms:${activeJob.customerPhone}?body=Hello%20${encodeURIComponent(activeJob.customerName)},%20I%20am%20your%20SmartFix%20Technician%20en%20route.`}
            className="p-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl hover:text-blue-600 transition-colors"
            title="Send SMS"
          >
            <MessageSquare className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* 6-STEP RIDE-STYLE WORKFLOW STEPPER */}
      <div className="bg-slate-50 dark:bg-[#070D1B] p-3 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-1 text-center text-[10px] font-bold">
          {/* Step 1: NAVIGATE */}
          <div className={`p-2 rounded-xl border transition-all ${
            currentStepNumber >= 1
              ? 'bg-blue-50 dark:bg-blue-950/80 border-blue-400 text-blue-700 dark:text-blue-300 font-extrabold shadow-xs'
              : 'bg-white dark:bg-[#0D162B] border-slate-200 dark:border-slate-800 text-slate-400'
          }`}>
            <span className="block font-mono text-[9px]">STEP 1</span>
            <span>1. Navigate</span>
          </div>

          {/* Step 2: ARRIVED */}
          <div className={`p-2 rounded-xl border transition-all ${
            currentStepNumber >= 2
              ? 'bg-blue-50 dark:bg-blue-950/80 border-blue-400 text-blue-700 dark:text-blue-300 font-extrabold shadow-xs'
              : 'bg-white dark:bg-[#0D162B] border-slate-200 dark:border-slate-800 text-slate-400'
          }`}>
            <span className="block font-mono text-[9px]">STEP 2</span>
            <span>2. Arrived</span>
          </div>

          {/* Step 3: START CODE */}
          <div className={`p-2 rounded-xl border transition-all ${
            currentStepNumber >= 3
              ? 'bg-amber-50 dark:bg-amber-950/80 border-amber-400 text-amber-700 dark:text-amber-300 font-extrabold shadow-xs'
              : 'bg-white dark:bg-[#0D162B] border-slate-200 dark:border-slate-800 text-slate-400'
          }`}>
            <span className="block font-mono text-[9px]">STEP 3</span>
            <span>3. Start Code</span>
          </div>

          {/* Step 4: SERVICE IN PROGRESS */}
          <div className={`p-2 rounded-xl border transition-all ${
            currentStepNumber >= 4
              ? 'bg-amber-50 dark:bg-amber-950/80 border-amber-400 text-amber-700 dark:text-amber-300 font-extrabold shadow-xs'
              : 'bg-white dark:bg-[#0D162B] border-slate-200 dark:border-slate-800 text-slate-400'
          }`}>
            <span className="block font-mono text-[9px]">STEP 4</span>
            <span>4. In Progress</span>
          </div>

          {/* Step 5: COMPLETE */}
          <div className={`p-2 rounded-xl border transition-all ${
            currentStepNumber >= 5
              ? 'bg-emerald-50 dark:bg-emerald-950/80 border-emerald-400 text-emerald-700 dark:text-emerald-300 font-extrabold shadow-xs'
              : 'bg-white dark:bg-[#0D162B] border-slate-200 dark:border-slate-800 text-slate-400'
          }`}>
            <span className="block font-mono text-[9px]">STEP 5</span>
            <span>5. Complete</span>
          </div>

          {/* Step 6: FIXCOIN WALLET */}
          <div className={`p-2 rounded-xl border transition-all ${
            currentStepNumber >= 6
              ? 'bg-emerald-50 dark:bg-emerald-950/80 border-emerald-400 text-emerald-700 dark:text-emerald-300 font-extrabold shadow-xs'
              : 'bg-white dark:bg-[#0D162B] border-slate-200 dark:border-slate-800 text-slate-400'
          }`}>
            <span className="block font-mono text-[9px]">STEP 6</span>
            <span>6. Payout Wallet</span>
          </div>
        </div>
      </div>

      {/* STAGE-SPECIFIC ACTION CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left Card: Route, Address & Diagnostics */}
        <div className="p-4 bg-slate-50 dark:bg-[#070D1B] rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3.5 flex flex-col justify-between">
          <div className="space-y-3">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Customer Destination:</span>
              <div className="flex items-start gap-2 mt-1">
                <MapPin className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                    {activeJob.address}
                  </h4>
                  <p className="text-xs text-slate-500 font-mono">
                    Zone: {activeJob.zone} • Scheduled: {activeJob.scheduledTime || 'Immediate'}
                  </p>
                </div>
              </div>
            </div>

            {activeJob.notes && (
              <div className="p-2.5 bg-white dark:bg-[#0D162B] rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Problem Summary:</span>
                <p className="text-slate-700 dark:text-slate-300 italic">
                  "{activeJob.notes}"
                </p>
              </div>
            )}

            {/* In Progress Stopwatch */}
            {activeJob.status === 'in_progress' && (
              <div className="p-3 bg-amber-500/10 border border-amber-400/30 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-500 animate-spin" style={{ animationDuration: '6s' }} />
                  <div>
                    <span className="text-[10px] font-bold text-amber-800 dark:text-amber-300 uppercase block">
                      Active Repair Stopwatch
                    </span>
                    <span className="font-mono font-black text-lg text-slate-900 dark:text-white">
                      {formatTimer(timerSeconds)}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  className="px-2.5 py-1 bg-white dark:bg-[#0D162B] rounded-lg text-xs font-bold border border-amber-300 dark:border-amber-800 text-slate-700 dark:text-slate-300"
                >
                  {isTimerRunning ? 'Pause' : 'Resume'}
                </button>
              </div>
            )}
          </div>

          {/* Guaranteed Split Pill */}
          <div className="p-2.5 bg-white dark:bg-[#0D162B] rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-500">Guaranteed Split (90/10):</span>
            <span className="font-mono font-black text-emerald-600 dark:text-emerald-400">
              {netEarnings.toLocaleString()} ETB Net Payout
            </span>
          </div>
        </div>

        {/* Right Card: Stepper Execution Controls */}
        <div className="p-4 bg-slate-50 dark:bg-[#070D1B] rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Action Required:
              </span>
              <span className="text-[10px] font-mono text-blue-600 dark:text-blue-400 font-bold">
                SmartFix Addis Protocol
              </span>
            </div>

            {/* STAGE 1: NOT STARTED / ACCEPTED -> START ROUTE */}
            {activeJob.status === 'accepted' && (
              <div className="space-y-2">
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Tap below when you start driving or traveling toward the client address in {activeJob.zone.split(',')[0]}.
                </p>
                <button
                  type="button"
                  onClick={() => onUpdateStatus(activeJob.id, 'in_route')}
                  className="w-full py-3.5 bg-gradient-to-r from-[#1E3A8A] to-[#2563EB] hover:from-[#1E3A8A] hover:to-[#1D4ED8] text-white font-black text-xs rounded-xl shadow-md flex items-center justify-center gap-2 active:scale-95 transition-transform cursor-pointer"
                >
                  <Navigation className="w-4 h-4" />
                  <span>1. START ROUTE (EN ROUTE)</span>
                </button>
              </div>
            )}

            {/* STAGE 2: IN ROUTE -> ARRIVED & SUBMIT START OTP */}
            {activeJob.status === 'in_route' && (
              <div className="space-y-2">
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  You are en route. Once you reach the customer premises, ask for their <strong>4-Digit Start OTP</strong> to unlock the repair.
                </p>
                <button
                  type="button"
                  onClick={() => onRequestStartOtpModal(activeJob)}
                  className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs rounded-xl shadow-md flex items-center justify-center gap-2 active:scale-95 transition-transform cursor-pointer"
                >
                  <KeyRound className="w-4 h-4" />
                  <span>2. ARRIVED • ENTER START OTP</span>
                </button>
              </div>
            )}

            {/* STAGE 3: IN PROGRESS -> SPARE PARTS LEDGER & COMPLETE WITH COMPLETION OTP */}
            {activeJob.status === 'in_progress' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Additional Spare Parts:
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowAddPart(!showAddPart)}
                    className="text-[11px] font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Part</span>
                  </button>
                </div>

                {/* Add Part Mini Form */}
                {showAddPart && (
                  <form onSubmit={handleAddPart} className="p-2.5 bg-white dark:bg-[#0D162B] rounded-xl border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                    <input
                      type="text"
                      placeholder="Part description (e.g. Breaker 32A, PVC Valve)"
                      value={newPartName}
                      onChange={(e) => setNewPartName(e.target.value)}
                      className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#080E1B] text-slate-900 dark:text-white"
                      required
                    />
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        placeholder="Cost (ETB)"
                        value={newPartCost}
                        onChange={(e) => setNewPartCost(e.target.value)}
                        className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#080E1B] text-slate-900 dark:text-white font-mono"
                        required
                      />
                      <button
                        type="submit"
                        className="px-3 py-2 bg-blue-600 text-white rounded-lg font-bold text-xs"
                      >
                        Save
                      </button>
                    </div>
                  </form>
                )}

                {/* Parts Ledger List */}
                {partsList.length > 0 && (
                  <div className="space-y-1 text-xs">
                    {partsList.map((part, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 bg-white dark:bg-[#0D162B] rounded-lg border border-slate-200 dark:border-slate-800">
                        <span className="text-slate-800 dark:text-slate-200">{part.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                            +{part.cost.toLocaleString()} ETB
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemovePart(idx)}
                            className="text-rose-500 hover:text-rose-700"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => onRequestCompletionOtpModal(activeJob)}
                  className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs rounded-xl shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 active:scale-95 transition-transform cursor-pointer"
                >
                  <CheckCheck className="w-4 h-4" />
                  <span>3. REPAIR FINISHED • ENTER COMPLETION OTP</span>
                </button>
              </div>
            )}
          </div>

          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
            <span>Customer: {activeJob.customerName}</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">100% Escrow Protected</span>
          </div>
        </div>
      </div>
    </div>
  );
}
