import React, { useState } from 'react';
import {
  Coins,
  TrendingUp,
  CreditCard,
  History,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  Building2,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Receipt,
  HelpCircle,
  Clock,
  Sparkles
} from 'lucide-react';
import { Technician, Booking, CoinTransaction } from '../../types';
import { MONTHLY_SECURITY_SUB_FEE } from '../../data/coinPackages';

interface WalletHubProps {
  currentTech: Technician;
  completedJobs: Booking[];
  onOpenChapaModal: () => void;
  onOpenLedgerModal: () => void;
  onOpenPayoutSettingsModal: () => void;
  onShowToast: (title: string, desc: string, type?: 'success' | 'info' | 'coin') => void;
}

export function WalletHub({
  currentTech,
  completedJobs,
  onOpenChapaModal,
  onOpenLedgerModal,
  onOpenPayoutSettingsModal,
  onShowToast
}: WalletHubProps) {
  const [withdrawAmount, setWithdrawAmount] = useState<string>('');
  const [withdrawChannel, setWithdrawChannel] = useState<'telebirr' | 'cbe_bank' | 'cbe_birr' | 'dashen_amole'>('telebirr');
  const [isWithdrawing, setIsWithdrawing] = useState<boolean>(false);
  const [showCashoutModal, setShowCashoutModal] = useState<boolean>(false);

  const netWalletETB = currentTech.walletBalanceETB || currentTech.earningsTodayETB || 3450;
  const fixCoins = currentTech.coinBalance ?? 1250;
  const escrowHeld = currentTech.escrowDepositETB || 3500;

  // Calculate gross and commission statistics
  const totalGrossTurnover = completedJobs.reduce((sum, j) => sum + j.price + (j.partsCost || 0), 8600);
  const totalCommissionPaid = Math.round(totalGrossTurnover * 0.10);
  const totalNetTakeHome = totalGrossTurnover - totalCommissionPaid;

  const handleExecuteWithdrawal = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(withdrawAmount) || netWalletETB;
    if (amount <= 0 || amount > netWalletETB) {
      onShowToast('Invalid Amount', `Please enter an amount up to ${netWalletETB.toLocaleString()} ETB.`);
      return;
    }

    setIsWithdrawing(true);
    setTimeout(() => {
      setIsWithdrawing(false);
      setShowCashoutModal(false);
      setWithdrawAmount('');
      const channelLabel = withdrawChannel === 'telebirr'
        ? `Telebirr (${currentTech.telebirrAccount || currentTech.phone})`
        : withdrawChannel === 'cbe_bank'
        ? `CBE Bank Acct (${currentTech.cbeAccount || '1000188923412'})`
        : withdrawChannel === 'dashen_amole'
        ? 'Dashen Amole Wallet'
        : 'CBE Birr Mobile';

      onShowToast(
        'Instant Cashout Dispatched! 💸',
        `${amount.toLocaleString()} ETB transferred instantly to ${channelLabel}. Transaction Ref: #TX-${Math.floor(100000 + Math.random() * 900000)}.`
      );
    }, 900);
  };

  return (
    <div className="space-y-4">
      {/* 4-Stat Metric Header */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Net Take-Home Wallet */}
        <div className="p-4 bg-gradient-to-br from-[#0F1E3D] to-[#1E3A8A] text-white rounded-3xl shadow-sm border border-blue-900 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold uppercase text-blue-200">Net Take-Home (90%)</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2">
            <span className="text-xl sm:text-2xl font-black font-mono">
              {netWalletETB.toLocaleString()} <span className="text-xs text-amber-300">ETB</span>
            </span>
            <span className="text-[10px] text-emerald-300 block font-medium mt-0.5">Available for Cashout</span>
          </div>
        </div>

        {/* FixCoins Balance */}
        <div className="p-4 bg-gradient-to-br from-[#003B1E] to-[#005B2E] text-white rounded-3xl shadow-sm border border-emerald-900 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold uppercase text-amber-300">FixCoins</span>
            <Coins className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2">
            <span className="text-xl sm:text-2xl font-black font-mono">
              {fixCoins.toLocaleString()}
            </span>
            <span className="text-[10px] text-emerald-200 block font-medium mt-0.5">1 Coin = 1 ETB Parity</span>
          </div>
        </div>

        {/* 10% Platform Commission Tracker */}
        <div className="p-4 bg-white dark:bg-[#0A1224] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Platform Fee (10%)</span>
            <Receipt className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2">
            <span className="text-xl font-black font-mono text-amber-600 dark:text-amber-400">
              {totalCommissionPaid.toLocaleString()} <span className="text-xs">ETB</span>
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Auto-deducted via coins</span>
          </div>
        </div>

        {/* 30-Day Escrow Collateral */}
        <div className="p-4 bg-white dark:bg-[#0A1224] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Warranty Escrow</span>
            <ShieldCheck className="w-4 h-4 text-blue-500" />
          </div>
          <div className="mt-2">
            <span className="text-xl font-black font-mono text-blue-600 dark:text-blue-400">
              {escrowHeld.toLocaleString()} <span className="text-xs">ETB</span>
            </span>
            <span className="text-[10px] text-emerald-600 font-bold block mt-0.5">Guild Backed ✓</span>
          </div>
        </div>
      </div>

      {/* Main Action Hub Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card 1: Top-Up FixCoins via Chapa Gateway */}
        <div className="p-5 bg-white dark:bg-[#0A1224] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                  <Coins className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                    FixCoin Wallet & Top-up
                  </h4>
                  <span className="text-[10px] text-slate-400">Maintains 10% platform commission balance</span>
                </div>
              </div>

              <button
                type="button"
                onClick={onOpenLedgerModal}
                className="text-[11px] font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1 hover:underline cursor-pointer"
              >
                <History className="w-3.5 h-3.5" />
                <span>Ledger</span>
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400">
              FixCoins enable uninterrupted automated dispatch matching. When you finish a job, 10% SmartFix fee is deducted directly from this balance.
            </p>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              type="button"
              onClick={onOpenChapaModal}
              className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs rounded-xl shadow-md flex items-center justify-center gap-2 active:scale-95 transition-transform cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Top-Up via Chapa / Telebirr</span>
            </button>
          </div>
        </div>

        {/* Card 2: Instant Payout / Cashout Direct Deposit */}
        <div className="p-5 bg-white dark:bg-[#0A1224] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                    Direct Payout & Withdrawal
                  </h4>
                  <span className="text-[10px] text-slate-400">Telebirr • CBE Bank • CBE Birr • Amole</span>
                </div>
              </div>

              <button
                type="button"
                onClick={onOpenPayoutSettingsModal}
                className="text-[11px] font-bold text-[#1E3A8A] dark:text-blue-400 hover:underline cursor-pointer"
              >
                Edit Accounts
              </button>
            </div>

            <div className="p-2.5 bg-slate-50 dark:bg-[#070D1B] rounded-xl border border-slate-200 dark:border-slate-800 text-xs flex items-center justify-between">
              <span className="text-slate-500">Destination:</span>
              <span className="font-bold text-slate-900 dark:text-white">
                {currentTech.paymentPreference === 'cbe_birr' ? 'CBE Bank Account' : 'Telebirr Wallet'}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowCashoutModal(true)}
            className="w-full py-3 bg-[#0F1E3D] hover:bg-[#1E3A8A] text-white font-black text-xs rounded-xl shadow-md flex items-center justify-center gap-2 active:scale-95 transition-transform cursor-pointer"
          >
            <ArrowDownLeft className="w-4 h-4 text-amber-400" />
            <span>Withdraw Cash ({netWalletETB.toLocaleString()} ETB)</span>
          </button>
        </div>
      </div>

      {/* CASHOUT MODAL */}
      {showCashoutModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="w-full max-w-md bg-white dark:bg-[#0A1224] border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-base text-slate-900 dark:text-white">
                    Instant Bank & Wallet Payout
                  </h3>
                  <span className="text-xs text-slate-400">Direct disbursement in seconds</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowCashoutModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleExecuteWithdrawal} className="space-y-4 text-xs">
              {/* Channel Selector */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Select Payout Channel:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setWithdrawChannel('telebirr')}
                    className={`p-2.5 rounded-xl border text-left font-bold transition-all cursor-pointer ${
                      withdrawChannel === 'telebirr'
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-300'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <span>📱 Telebirr</span>
                    <span className="block text-[10px] text-slate-400 font-mono mt-0.5">{currentTech.telebirrAccount || currentTech.phone}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setWithdrawChannel('cbe_bank')}
                    className={`p-2.5 rounded-xl border text-left font-bold transition-all cursor-pointer ${
                      withdrawChannel === 'cbe_bank'
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-300'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <span>🏦 CBE Bank</span>
                    <span className="block text-[10px] text-slate-400 font-mono mt-0.5">{currentTech.cbeAccount || '1000188923412'}</span>
                  </button>
                </div>
              </div>

              {/* Amount Input */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">
                    Withdrawal Amount (ETB):
                  </label>
                  <button
                    type="button"
                    onClick={() => setWithdrawAmount(netWalletETB.toString())}
                    className="text-[10px] font-bold text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Max ({netWalletETB.toLocaleString()} ETB)
                  </button>
                </div>
                <input
                  type="number"
                  min="50"
                  max={netWalletETB}
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  placeholder={netWalletETB.toString()}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#070D1B] text-slate-900 dark:text-white font-mono font-bold text-sm"
                  required
                />
              </div>

              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-900/40 text-[11px] text-emerald-800 dark:text-emerald-300 space-y-1">
                <div className="flex justify-between">
                  <span>Transfer Fee:</span>
                  <span className="font-bold">0.00 ETB (SmartFix Subsidized)</span>
                </div>
                <div className="flex justify-between">
                  <span>Settlement Speed:</span>
                  <span className="font-bold">Instant (0-30 seconds)</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isWithdrawing}
                className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs rounded-xl shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 active:scale-95 transition-transform cursor-pointer disabled:opacity-50"
              >
                <CreditCard className="w-4 h-4" />
                <span>{isWithdrawing ? 'Processing Transfer...' : `Confirm Cashout`}</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
