import React, { useState } from 'react';
import {
  X,
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Smartphone,
  Building2,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Coins,
  Receipt,
  Check,
  AlertCircle
} from 'lucide-react';
import { Technician, CoinPackage } from '../types';
import { CHAPA_COIN_PACKAGES } from '../data/coinPackages';

interface ChapaPaymentModalProps {
  technician: Technician;
  initialPackage?: CoinPackage;
  onClose: () => void;
  onSuccess: (
    coinsToAdd: number,
    priceETB: number,
    paymentChannel: string,
    referenceId: string
  ) => void;
  isDarkMode?: boolean;
}

type PaymentChannel = 'telebirr' | 'cbe_birr' | 'abyssinia' | 'awash' | 'card';

export function ChapaPaymentModal({
  technician,
  initialPackage = CHAPA_COIN_PACKAGES[1], // Standard pack default
  onClose,
  onSuccess,
  isDarkMode = false,
}: ChapaPaymentModalProps) {
  const [selectedPackage, setSelectedPackage] = useState<CoinPackage>(initialPackage);
  const [selectedChannel, setSelectedChannel] = useState<PaymentChannel>('telebirr');
  const [phoneNumber, setPhoneNumber] = useState<string>(technician.phone || '+251 91 123 4567');
  const [fullName, setFullName] = useState<string>(technician.name || 'Technician');
  const [email, setEmail] = useState<string>(`${technician.name.toLowerCase().replace(/\s+/g, '.')}@smartfix.et`);
  
  // Checkout flow states: 'input' | 'push_sent' | 'processing' | 'success'
  const [step, setStep] = useState<'input' | 'push_sent' | 'processing' | 'success'>('input');
  const [simulatedOtp, setSimulatedOtp] = useState<string>('8492');
  const [enteredOtp, setEnteredOtp] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [generatedRef, setGeneratedRef] = useState<string>('');

  const totalCoins = selectedPackage.coins + selectedPackage.bonusCoins;

  // Step 1: Initiate Chapa payment session
  const handleInitiatePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber) {
      setErrorMsg('Please enter a valid phone number for Chapa checkout.');
      return;
    }
    setErrorMsg(null);
    setStep('processing');

    const txRef = `CHAPA-SF-${Math.floor(100000 + Math.random() * 900000)}`;
    setGeneratedRef(txRef);

    // Simulate Chapa webhook & USSD dispatch (1.2s delay)
    setTimeout(() => {
      setStep('push_sent');
    }, 1200);
  };

  // Step 2: Confirm OTP / USSD Push
  const handleConfirmOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('processing');

    setTimeout(() => {
      setStep('success');
      onSuccess(
        totalCoins,
        selectedPackage.priceETB,
        `chapa_${selectedChannel}`,
        generatedRef
      );
    }, 1400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-[#0A1224] border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl relative text-slate-900 dark:text-slate-100 animate-scale-up">
        {/* TOP BRAND HEADER (Official Chapa Theme) */}
        <div className="bg-gradient-to-r from-[#004B23] via-[#007200] to-[#38B000] text-white p-5 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white p-1 rounded-xl bg-white/10 hover:bg-white/20 transition-all"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30 shadow-inner">
              <Coins className="w-6 h-6 text-amber-300 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-lg tracking-tight">Chapa Pay</span>
                <span className="text-[10px] font-mono font-bold bg-amber-400 text-slate-950 px-2 py-0.5 rounded-md uppercase">
                  Direct Gateway
                </span>
              </div>
              <p className="text-xs text-emerald-100 font-medium mt-0.5">
                Top Up FixCoins • Licensed by National Bank of Ethiopia
              </p>
            </div>
          </div>
        </div>

        {/* ================= STEP 1: PACKAGE & METHOD SELECTION ================= */}
        {step === 'input' && (
          <form onSubmit={handleInitiatePayment} className="p-6 space-y-5">
            {/* Package Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                1. Select FixCoin Package (1 Coin = 1 ETB)
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {CHAPA_COIN_PACKAGES.map((pkg) => {
                  const isSelected = selectedPackage.id === pkg.id;
                  const total = pkg.coins + pkg.bonusCoins;
                  return (
                    <div
                      key={pkg.id}
                      onClick={() => setSelectedPackage(pkg)}
                      className={`p-3 rounded-2xl border cursor-pointer transition-all relative ${
                        isSelected
                          ? 'border-[#007200] bg-emerald-50/70 dark:bg-emerald-950/40 ring-2 ring-[#007200]/30'
                          : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#070D1B] hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      {pkg.tag && (
                        <span className="absolute -top-2 right-2 text-[9px] font-extrabold bg-[#007200] text-white px-1.5 py-0.5 rounded-full shadow-xs">
                          {pkg.tag}
                        </span>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="font-black text-sm text-slate-900 dark:text-white">{pkg.name}</span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-[#007200]" />}
                      </div>
                      <div className="mt-1 flex items-baseline gap-1">
                        <span className="font-black font-mono text-base text-[#007200] dark:text-emerald-400">
                          {total.toLocaleString()}
                        </span>
                        <span className="text-[10px] font-bold text-amber-500">Coins</span>
                      </div>
                      <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                        Price: {pkg.priceETB.toLocaleString()} ETB
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Payment Method Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                2. Choose Chapa Payment Method
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedChannel('telebirr')}
                  className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                    selectedChannel === 'telebirr'
                      ? 'border-[#007200] bg-emerald-50 dark:bg-emerald-950/40 text-[#007200] dark:text-emerald-300 font-black ring-1 ring-[#007200]'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-bold'
                  }`}
                >
                  <Smartphone className="w-4 h-4 text-emerald-600 mb-1" />
                  <span className="text-xs">Telebirr</span>
                  <span className="text-[9px] text-slate-400">Instant USSD</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedChannel('cbe_birr')}
                  className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                    selectedChannel === 'cbe_birr'
                      ? 'border-[#007200] bg-emerald-50 dark:bg-emerald-950/40 text-[#007200] dark:text-emerald-300 font-black ring-1 ring-[#007200]'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-bold'
                  }`}
                >
                  <Building2 className="w-4 h-4 text-purple-600 mb-1" />
                  <span className="text-xs">CBE Birr</span>
                  <span className="text-[9px] text-slate-400">Direct Acct</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedChannel('abyssinia')}
                  className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                    selectedChannel === 'abyssinia'
                      ? 'border-[#007200] bg-emerald-50 dark:bg-emerald-950/40 text-[#007200] dark:text-emerald-300 font-black ring-1 ring-[#007200]'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-bold'
                  }`}
                >
                  <Building2 className="w-4 h-4 text-amber-600 mb-1" />
                  <span className="text-xs">Abyssinia</span>
                  <span className="text-[9px] text-slate-400">Apollo App</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedChannel('awash')}
                  className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                    selectedChannel === 'awash'
                      ? 'border-[#007200] bg-emerald-50 dark:bg-emerald-950/40 text-[#007200] dark:text-emerald-300 font-black ring-1 ring-[#007200]'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-bold'
                  }`}
                >
                  <Building2 className="w-4 h-4 text-blue-600 mb-1" />
                  <span className="text-xs">Awash / Dashen</span>
                  <span className="text-[9px] text-slate-400">Mobile Net</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedChannel('card')}
                  className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between col-span-2 ${
                    selectedChannel === 'card'
                      ? 'border-[#007200] bg-emerald-50 dark:bg-emerald-950/40 text-[#007200] dark:text-emerald-300 font-black ring-1 ring-[#007200]'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-bold'
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-blue-500 mb-1" />
                  <span className="text-xs">Debit / Credit Card</span>
                  <span className="text-[9px] text-slate-400">Visa / Mastercard / Local Birr Card</span>
                </button>
              </div>
            </div>

            {/* Payer Phone & Info */}
            <div className="space-y-3 pt-1">
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                  Payer Phone Number (Receives Chapa Push)
                </label>
                <div className="relative">
                  <Smartphone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+251 91 123 4567"
                    required
                    className="w-full pl-10 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#070D1B] font-mono text-slate-900 dark:text-white font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">Technician Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#070D1B] text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">Receipt Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#070D1B] text-slate-900 dark:text-white text-xs"
                  />
                </div>
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs rounded-xl flex items-center gap-2 border border-rose-200 dark:border-rose-900/50">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Total Summary & Checkout Button */}
            <div className="p-3.5 bg-slate-100 dark:bg-slate-900/80 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Total ETB Amount</span>
                <span className="font-mono font-black text-lg text-slate-900 dark:text-white">
                  {selectedPackage.priceETB.toLocaleString()} ETB
                </span>
              </div>

              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Credited FixCoins</span>
                <span className="font-mono font-black text-lg text-[#007200] dark:text-emerald-400">
                  +{totalCoins.toLocaleString()} Coins
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="w-1/3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-2/3 py-2.5 rounded-xl bg-[#007200] hover:bg-[#008000] text-white font-black text-xs shadow-lg shadow-emerald-700/20 flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <Lock className="w-3.5 h-3.5 text-amber-300" />
                <span>Pay via Chapa ({selectedPackage.priceETB} ETB)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-[#007200]" />
              <span>256-bit TLS Encrypted • 100% Secure Chapa Checkout</span>
            </div>
          </form>
        )}

        {/* ================= STEP: PROCESSING SPINNER ================= */}
        {step === 'processing' && (
          <div className="p-10 text-center space-y-4">
            <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-[#007200] flex items-center justify-center animate-spin">
              <RefreshCw className="w-7 h-7" />
            </div>
            <div>
              <h4 className="font-black text-base text-slate-900 dark:text-white">Connecting with Chapa Gateway</h4>
              <p className="text-xs text-slate-500 mt-1">
                Dispatching secure payment request to {selectedChannel.toUpperCase()} ({phoneNumber})...
              </p>
            </div>
            <div className="inline-block font-mono text-[11px] bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-lg text-slate-500">
              Reference: {generatedRef || 'CHAPA-SF-INIT'}
            </div>
          </div>
        )}

        {/* ================= STEP 2: USSD / PIN CONFIRMATION SIMULATOR ================= */}
        {step === 'push_sent' && (
          <form onSubmit={handleConfirmOtp} className="p-6 space-y-4">
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 rounded-2xl border border-emerald-200 dark:border-emerald-900/60 text-center space-y-2">
              <div className="w-10 h-10 mx-auto rounded-full bg-[#007200] text-white flex items-center justify-center">
                <Smartphone className="w-5 h-5 animate-bounce" />
              </div>
              <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                Chapa USSD Prompt Dispatched!
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                A payment authorization prompt for <strong>{selectedPackage.priceETB} ETB</strong> was sent to{' '}
                <span className="font-mono font-bold text-slate-900 dark:text-white">{phoneNumber}</span>.
              </p>
              <div className="text-[11px] font-mono bg-white dark:bg-[#070D1B] p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500">
                Simulated Test PIN: <strong className="text-[#007200]">{simulatedOtp}</strong>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5 text-center">
                Enter Mobile Authorization PIN / SMS Code
              </label>
              <input
                type="text"
                maxLength={4}
                value={enteredOtp}
                onChange={(e) => setEnteredOtp(e.target.value)}
                placeholder="4-digit PIN (e.g. 8492)"
                required
                autoFocus
                className="w-full text-center tracking-widest text-lg font-mono font-black py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#070D1B] text-slate-900 dark:text-white"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep('input')}
                className="w-1/3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 font-bold text-xs"
              >
                Back
              </button>
              <button
                type="submit"
                className="w-2/3 py-2.5 rounded-xl bg-[#007200] hover:bg-[#008000] text-white font-black text-xs shadow-md flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Verify & Credit Coins</span>
              </button>
            </div>
          </form>
        )}

        {/* ================= STEP 3: SUCCESS RECEIPT ================= */}
        {step === 'success' && (
          <div className="p-6 space-y-5 text-center">
            <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>

            <div>
              <h3 className="font-black text-lg text-slate-900 dark:text-white">Payment Successful!</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Your Chapa transaction has settled and FixCoins are instantly available.
              </p>
            </div>

            {/* Receipt Summary Card */}
            <div className="p-4 bg-slate-50 dark:bg-[#070D1B] rounded-2xl border border-slate-200 dark:border-slate-800 text-xs text-left space-y-2 font-mono">
              <div className="flex justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 font-sans">Transaction Ref:</span>
                <span className="font-bold text-slate-900 dark:text-white">{generatedRef}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-sans">Coins Added:</span>
                <span className="font-bold text-[#007200] dark:text-emerald-400">
                  +{totalCoins.toLocaleString()} FixCoins
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-sans">Amount Paid:</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {selectedPackage.priceETB.toLocaleString()} ETB
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-sans">Channel:</span>
                <span className="font-bold text-slate-900 dark:text-white uppercase">{selectedChannel}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-200 dark:border-slate-800 text-[11px]">
                <span className="text-slate-400 font-sans">Beneficiary:</span>
                <span className="text-slate-700 dark:text-slate-300 font-bold">{technician.name}</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-black text-xs shadow-md transition-transform active:scale-95"
            >
              Done & Return to Technician Portal
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
