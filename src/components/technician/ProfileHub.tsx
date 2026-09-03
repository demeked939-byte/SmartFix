import React, { useState } from 'react';
import {
  User,
  ShieldCheck,
  Award,
  FileText,
  Lock,
  Settings,
  HelpCircle,
  Phone,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Globe,
  Sliders,
  ExternalLink,
  ChevronRight,
  Eye,
  KeyRound,
  Shield,
  Smartphone,
  Bell,
  Languages,
  Moon,
  Sun,
  Headphones,
  Send,
  AlertOctagon,
  RefreshCw
} from 'lucide-react';
import { Technician } from '../../types';
import { INITIAL_ZONES } from '../../data/mockData';
import { MONTHLY_SECURITY_SUB_FEE } from '../../data/coinPackages';

interface ProfileHubProps {
  currentTech: Technician;
  onUpdateTechProfile?: (techId: string, updates: Partial<Technician>) => void;
  onRenewSecuritySub?: (techId: string, costCoins: number) => void;
  onToggleAutoRenew?: (techId: string) => void;
  onOpenPayoutSettingsModal: () => void;
  onOpenChapaModal: () => void;
  onShowToast: (title: string, desc: string, type?: 'success' | 'info' | 'coin') => void;
  isDarkMode: boolean;
}

type ProfileSection = 'kyc' | 'services' | 'documents' | 'guard' | 'security' | 'settings' | 'support';

const SERVICE_SPECIALTIES = [
  { id: 'electrical', label: 'Electrical & Power Systems', icon: '⚡', desc: 'Distribution boards, breakers, rewiring, generators' },
  { id: 'plumbing', label: 'Plumbing & Water Pumps', icon: '🔧', desc: 'Pipes, boilers, sanitary fixtures, water pressure pumps' },
  { id: 'hvac', label: 'HVAC & Commercial Refrigeration', icon: '❄️', desc: 'Air conditioning, chillers, deep freezers, HVAC compressors' },
  { id: 'solar', label: 'Solar PV & Inverter Systems', icon: '☀️', desc: 'Hybrid solar inverters, lithium battery banks, panel arrays' },
  { id: 'appliances', label: 'Major Home Appliances', icon: '🧺', desc: 'Washing machines, dishwashers, microwave ovens, induction stoves' },
  { id: 'generators', label: 'Diesel Generators & ATS', icon: '⚙️', desc: 'Perkins, Cummins automatic transfer switches & motor rewinds' }
];

export function ProfileHub({
  currentTech,
  onUpdateTechProfile,
  onRenewSecuritySub,
  onToggleAutoRenew,
  onOpenPayoutSettingsModal,
  onOpenChapaModal,
  onShowToast,
  isDarkMode
}: ProfileHubProps) {
  const [activeSubSection, setActiveSubSection] = useState<ProfileSection>('kyc');

  // Interactive Services toggles
  const [activeServices, setActiveServices] = useState<string[]>(['electrical', 'generators', 'appliances']);

  // Document Preview Modal State
  const [previewDoc, setPreviewDoc] = useState<{ title: string; type: string; idNum: string; status: string } | null>(null);

  // Security Toggles
  const [biometricsEnabled, setBiometricsEnabled] = useState<boolean>(true);
  const [soundAlerts, setSoundAlerts] = useState<boolean>(true);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('en');

  // Support SOS Trigger state
  const [sosSent, setSosSent] = useState<boolean>(false);

  const toggleService = (id: string) => {
    if (activeServices.includes(id)) {
      if (activeServices.length === 1) {
        onShowToast('At least one service required', 'You must keep at least one active trade category.', 'info');
        return;
      }
      setActiveServices(activeServices.filter(s => s !== id));
      onShowToast('Service Specialty Paused', `Radar will not dispatch jobs for ${id}.`, 'info');
    } else {
      setActiveServices([...activeServices, id]);
      onShowToast('Service Specialty Activated', `Radar matching enabled for ${id}.`, 'success');
    }
  };

  const handleRenewGuard = () => {
    const cost = currentTech.securityMonthlyFeeCoins || MONTHLY_SECURITY_SUB_FEE;
    if ((currentTech.coinBalance || 0) < cost) {
      onOpenChapaModal();
      onShowToast('Insufficient FixCoins', `You need ${cost} FixCoins. Top up via Chapa to activate the Anti-Hacker Shield.`, 'coin');
      return;
    }
    if (onRenewSecuritySub) {
      onRenewSecuritySub(currentTech.id, cost);
    }
    onShowToast('Security Shield Extended', `SmartFix Guard Anti-Hacker Shield renewed for 30 days (-${cost} FixCoins).`, 'coin');
  };

  const handleTriggerSos = () => {
    setSosSent(true);
    onShowToast(
      '🚨 SOS EMERGENCY DISPATCH TRIGGERED',
      'Addis Central Ops & Addis Ababa Emergency Response dispatched to your live GPS coordinates.',
      'info'
    );
  };

  return (
    <div className="space-y-4">
      {/* Technician Executive Card */}
      <div className="p-4 sm:p-5 bg-white dark:bg-[#0A1224] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3.5">
          <div className="relative">
            <img
              src={currentTech.avatar}
              alt={currentTech.name}
              referrerPolicy="no-referrer"
              className="w-14 h-14 rounded-2xl object-cover border-2 border-blue-600 shadow-md"
            />
            <span className="w-4 h-4 rounded-full bg-emerald-500 border-2 border-white dark:border-[#0A1224] absolute -bottom-1 -right-1" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-black text-base text-slate-900 dark:text-white">
                {currentTech.name}
              </h3>
              <span className="text-[10px] font-bold font-mono bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full border border-blue-200 dark:border-blue-800">
                Master Guild #{currentTech.id}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {currentTech.specialty} • {currentTech.activeZone}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-right">
            <span className="text-[9px] uppercase font-bold text-slate-400 block">KYC Rating</span>
            <span className="font-mono font-black text-amber-500 text-sm flex items-center gap-1 justify-end">
              ★ {currentTech.rating} ({currentTech.completedJobs} Jobs)
            </span>
          </div>
        </div>
      </div>

      {/* 7-Tab Structured Nav Strip */}
      <div className="bg-slate-100 dark:bg-[#070D1B] p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-1 overflow-x-auto no-scrollbar">
        <button
          type="button"
          onClick={() => setActiveSubSection('kyc')}
          className={`px-3 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
            activeSubSection === 'kyc'
              ? 'bg-white dark:bg-[#0F1E3D] text-[#1E3A8A] dark:text-blue-300 shadow-sm'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Verification / KYC</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubSection('services')}
          className={`px-3 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
            activeSubSection === 'services'
              ? 'bg-white dark:bg-[#0F1E3D] text-[#1E3A8A] dark:text-blue-300 shadow-sm'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Sliders className="w-3.5 h-3.5 text-blue-500" />
          <span>Services</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubSection('documents')}
          className={`px-3 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
            activeSubSection === 'documents'
              ? 'bg-white dark:bg-[#0F1E3D] text-[#1E3A8A] dark:text-blue-300 shadow-sm'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <FileText className="w-3.5 h-3.5 text-purple-500" />
          <span>Documents</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubSection('guard')}
          className={`px-3 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
            activeSubSection === 'guard'
              ? 'bg-white dark:bg-[#0F1E3D] text-[#1E3A8A] dark:text-blue-300 shadow-sm'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Zap className="w-3.5 h-3.5 text-amber-500" />
          <span>SmartFix Guard</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubSection('security')}
          className={`px-3 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
            activeSubSection === 'security'
              ? 'bg-white dark:bg-[#0F1E3D] text-[#1E3A8A] dark:text-blue-300 shadow-sm'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Lock className="w-3.5 h-3.5 text-rose-500" />
          <span>Security</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubSection('settings')}
          className={`px-3 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
            activeSubSection === 'settings'
              ? 'bg-white dark:bg-[#0F1E3D] text-[#1E3A8A] dark:text-blue-300 shadow-sm'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Settings className="w-3.5 h-3.5 text-slate-500" />
          <span>Settings</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubSection('support')}
          className={`px-3 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
            activeSubSection === 'support'
              ? 'bg-white dark:bg-[#0F1E3D] text-[#1E3A8A] dark:text-blue-300 shadow-sm'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Headphones className="w-3.5 h-3.5 text-teal-500" />
          <span>Support</span>
        </button>
      </div>

      {/* SUB-SECTION 1: VERIFICATION / KYC */}
      {activeSubSection === 'kyc' && (
        <div className="bg-white dark:bg-[#0A1224] rounded-3xl border border-slate-200 dark:border-slate-800 p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                Verification & KYC Identity Status
              </h4>
              <p className="text-xs text-slate-500">Tier 3 Master Verified Ethiopian Guild Craftsman</p>
            </div>
            <span className="text-xs font-mono font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 px-2.5 py-1 rounded-full border border-emerald-300 dark:border-emerald-800">
              Verified ✓
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-50 dark:bg-[#070D1B] rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800 dark:text-slate-200">Kebele National ID</span>
                <span className="text-emerald-600 font-mono font-bold">ETH-AA-998231</span>
              </div>
              <span className="text-[10px] text-slate-400 block">Biometrically verified with Bole Sub-City Office</span>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-[#070D1B] rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800 dark:text-slate-200">Ethiopian Master Guild License</span>
                <span className="text-blue-600 font-mono font-bold">GUILD-2026-M88</span>
              </div>
              <span className="text-[10px] text-slate-400 block">Grade A Master Technician (Electrical & HVAC)</span>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-[#070D1B] rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800 dark:text-slate-200">Police Security Clearance</span>
                <span className="text-emerald-600 font-mono font-bold">Clear (0 Records)</span>
              </div>
              <span className="text-[10px] text-slate-400 block">Addis Ababa Police Commission certified clean record</span>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-[#070D1B] rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800 dark:text-slate-200">Escrow Collateral Pledge</span>
                <span className="text-blue-600 font-mono font-bold">3,500 ETB Active</span>
              </div>
              <span className="text-[10px] text-slate-400 block">30-day workmanship re-work guarantee deposit locked</span>
            </div>
          </div>
        </div>
      )}

      {/* SUB-SECTION 2: SERVICES & SPECIALTIES */}
      {activeSubSection === 'services' && (
        <div className="bg-white dark:bg-[#0A1224] rounded-3xl border border-slate-200 dark:border-slate-800 p-5 space-y-4 shadow-sm">
          <div>
            <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
              Service Offerings & Trade Specialties
            </h4>
            <p className="text-xs text-slate-500">Toggle categories on/off to control what dispatch radar offers you</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {SERVICE_SPECIALTIES.map((srv) => {
              const isEnabled = activeServices.includes(srv.id);
              return (
                <div
                  key={srv.id}
                  onClick={() => toggleService(srv.id)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isEnabled
                      ? 'bg-blue-50/70 dark:bg-blue-950/60 border-blue-400 shadow-xs'
                      : 'bg-slate-50 dark:bg-[#070D1B] border-slate-200 dark:border-slate-800 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{srv.icon}</span>
                    <div>
                      <h5 className="font-extrabold text-xs text-slate-900 dark:text-white">
                        {srv.label}
                      </h5>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1">
                        {srv.desc}
                      </p>
                    </div>
                  </div>

                  <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                    isEnabled ? 'bg-blue-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                  }`}>
                    {isEnabled ? '✓' : ''}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUB-SECTION 3: DOCUMENTS */}
      {activeSubSection === 'documents' && (
        <div className="bg-white dark:bg-[#0A1224] rounded-3xl border border-slate-200 dark:border-slate-800 p-5 space-y-4 shadow-sm">
          <div>
            <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
              Official Verification Documents
            </h4>
            <p className="text-xs text-slate-500">Government credentials and certified guild credentials stored on file</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div
              onClick={() => setPreviewDoc({ title: 'Kebele National Resident ID Card', type: 'Government ID', idNum: 'ETH-AA-998231', status: 'Active & Verified' })}
              className="p-4 bg-slate-50 dark:bg-[#070D1B] rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-blue-400 transition-all cursor-pointer space-y-2 flex flex-col justify-between"
            >
              <div>
                <span className="text-[9px] uppercase font-bold text-slate-400 block">ID Document</span>
                <h5 className="font-extrabold text-xs text-slate-900 dark:text-white">Kebele Resident Card</h5>
                <span className="font-mono text-[10px] text-emerald-600">ETH-AA-998231</span>
              </div>
              <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1">
                <Eye className="w-3 h-3" /> View Scan
              </span>
            </div>

            <div
              onClick={() => setPreviewDoc({ title: 'Master Craftsman Trade Certificate', type: 'Guild License', idNum: 'GUILD-2026-M88', status: 'Certified Grade A' })}
              className="p-4 bg-slate-50 dark:bg-[#070D1B] rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-blue-400 transition-all cursor-pointer space-y-2 flex flex-col justify-between"
            >
              <div>
                <span className="text-[9px] uppercase font-bold text-slate-400 block">Trade License</span>
                <h5 className="font-extrabold text-xs text-slate-900 dark:text-white">Guild Master Certificate</h5>
                <span className="font-mono text-[10px] text-blue-600">GUILD-2026-M88</span>
              </div>
              <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1">
                <Eye className="w-3 h-3" /> View Scan
              </span>
            </div>

            <div
              onClick={() => setPreviewDoc({ title: 'Third-Party Liability Insurance Bond', type: 'Insurance Policy', idNum: 'EIC-POL-77192', status: '100,000 ETB Coverage' })}
              className="p-4 bg-slate-50 dark:bg-[#070D1B] rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-blue-400 transition-all cursor-pointer space-y-2 flex flex-col justify-between"
            >
              <div>
                <span className="text-[9px] uppercase font-bold text-slate-400 block">Insurance Bond</span>
                <h5 className="font-extrabold text-xs text-slate-900 dark:text-white">Ethiopian Insurance Corp</h5>
                <span className="font-mono text-[10px] text-purple-600">EIC-POL-77192</span>
              </div>
              <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1">
                <Eye className="w-3 h-3" /> View Scan
              </span>
            </div>
          </div>
        </div>
      )}

      {/* SUB-SECTION 4: SMARTFIX GUARD */}
      {activeSubSection === 'guard' && (
        <div className="bg-white dark:bg-[#0A1224] rounded-3xl border border-slate-200 dark:border-slate-800 p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                  SmartFix Guard Anti-Hacker Shield
                </h4>
                <p className="text-xs text-slate-500">24/7 Identity Protection & High-Priority Dispatch Radar Access</p>
              </div>
            </div>

            <span className="text-xs font-mono font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 px-2.5 py-1 rounded-full border border-emerald-300 dark:border-emerald-800">
              Active (299 Coins/mo)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 bg-slate-50 dark:bg-[#070D1B] rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
              <span className="font-bold text-slate-900 dark:text-white block">Shield Benefits:</span>
              <ul className="space-y-1 text-slate-600 dark:text-slate-400 text-[11px]">
                <li>✓ Automatic OTP Fraud Protection on every customer job</li>
                <li>✓ 2X Priority Weight in Addis Ababa GPS Dispatch Radar</li>
                <li>✓ 100,000 ETB SmartFix Guild Guarantee coverage</li>
              </ul>
            </div>

            <div className="p-3.5 bg-slate-50 dark:bg-[#070D1B] rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-2">
              <div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Status:</span>
                  <span className="font-bold text-emerald-600">Active (Next auto-renew: 2026-09-28)</span>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-slate-500">Auto-Renew:</span>
                  <button
                    onClick={() => onToggleAutoRenew && onToggleAutoRenew(currentTech.id)}
                    className="font-bold text-blue-600 hover:underline"
                  >
                    {currentTech.securityAutoRenew ? 'Enabled (ON)' : 'Disabled (OFF)'}
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={handleRenewGuard}
                className="w-full py-2 bg-gradient-to-r from-[#1E3A8A] to-[#2563EB] text-white font-black rounded-xl text-xs"
              >
                Extend Shield (+30 Days for 299 Coins)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUB-SECTION 5: SECURITY */}
      {activeSubSection === 'security' && (
        <div className="bg-white dark:bg-[#0A1224] rounded-3xl border border-slate-200 dark:border-slate-800 p-5 space-y-4 shadow-sm">
          <div>
            <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
              Device Lock & Security Controls
            </h4>
            <p className="text-xs text-slate-500">Protect your wallet and biometric technician account</p>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 bg-slate-50 dark:bg-[#070D1B] rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h5 className="font-bold text-slate-900 dark:text-white">Biometric Face / Fingerprint Login</h5>
                <p className="text-[11px] text-slate-500">Require fingerprint or face ID to open SmartFix Pro</p>
              </div>
              <button
                type="button"
                onClick={() => setBiometricsEnabled(!biometricsEnabled)}
                className={`w-12 h-6 rounded-full transition-colors p-0.5 flex items-center ${
                  biometricsEnabled ? 'bg-emerald-500 justify-end' : 'bg-slate-300 dark:bg-slate-700 justify-start'
                }`}
              >
                <span className="w-5 h-5 rounded-full bg-white shadow-xs" />
              </button>
            </div>

            <div className="p-3.5 bg-slate-50 dark:bg-[#070D1B] rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h5 className="font-bold text-slate-900 dark:text-white">4-Digit Security Cashout PIN</h5>
                <p className="text-[11px] text-slate-500">Required before withdrawing ETB to Telebirr or CBE Bank</p>
              </div>
              <button
                type="button"
                onClick={() => onShowToast('PIN Security Active', 'Cashout PIN is set to ****.', 'info')}
                className="px-3 py-1 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-bold"
              >
                Change PIN
              </button>
            </div>

            <div className="p-3.5 bg-slate-50 dark:bg-[#070D1B] rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h5 className="font-bold text-slate-900 dark:text-white">Active Device Session</h5>
                <p className="text-[11px] text-slate-500 font-mono">Samsung Galaxy S24 (Addis Ababa, Ethiopia)</p>
              </div>
              <span className="text-emerald-600 font-bold">This Device ✓</span>
            </div>
          </div>
        </div>
      )}

      {/* SUB-SECTION 6: SETTINGS */}
      {activeSubSection === 'settings' && (
        <div className="bg-white dark:bg-[#0A1224] rounded-3xl border border-slate-200 dark:border-slate-800 p-5 space-y-4 shadow-sm">
          <div>
            <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
              Application Preferences & Localisation
            </h4>
            <p className="text-xs text-slate-500">Configure language, notifications, and primary default zone</p>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 bg-slate-50 dark:bg-[#070D1B] rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Languages className="w-4 h-4 text-blue-500" />
                <div>
                  <h5 className="font-bold text-slate-900 dark:text-white">App Language</h5>
                  <p className="text-[11px] text-slate-500">Ethiopian Official Regional Languages</p>
                </div>
              </div>
              <select
                value={selectedLanguage}
                onChange={(e) => {
                  setSelectedLanguage(e.target.value);
                  onShowToast('Language Updated', `Switched interface language.`);
                }}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0A1224] text-slate-900 dark:text-white font-bold"
              >
                <option value="en">English (US)</option>
                <option value="am">አማርኛ (Amharic)</option>
                <option value="om">Afaan Oromoo</option>
                <option value="ti">ትግርኛ (Tigrinya)</option>
                <option value="so">Somali</option>
              </select>
            </div>

            <div className="p-3.5 bg-slate-50 dark:bg-[#070D1B] rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Bell className="w-4 h-4 text-amber-500" />
                <div>
                  <h5 className="font-bold text-slate-900 dark:text-white">Dispatch Audio Chime Alert</h5>
                  <p className="text-[11px] text-slate-500">Loud audible chime when a 30s job offer arrives</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSoundAlerts(!soundAlerts)}
                className={`w-12 h-6 rounded-full transition-colors p-0.5 flex items-center ${
                  soundAlerts ? 'bg-emerald-500 justify-end' : 'bg-slate-300 dark:bg-slate-700 justify-start'
                }`}
              >
                <span className="w-5 h-5 rounded-full bg-white shadow-xs" />
              </button>
            </div>

            <div className="p-3.5 bg-slate-50 dark:bg-[#070D1B] rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h5 className="font-bold text-slate-900 dark:text-white">Payout Accounts & Banking</h5>
                <p className="text-[11px] text-slate-500">Telebirr & Commercial Bank of Ethiopia (CBE)</p>
              </div>
              <button
                type="button"
                onClick={onOpenPayoutSettingsModal}
                className="px-3 py-1.5 bg-[#1E3A8A] text-white rounded-xl font-bold"
              >
                Configure Accounts
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUB-SECTION 7: SUPPORT */}
      {activeSubSection === 'support' && (
        <div className="bg-white dark:bg-[#0A1224] rounded-3xl border border-slate-200 dark:border-slate-800 p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                24/7 Technician Dispatch Support & SOS
              </h4>
              <p className="text-xs text-slate-500">Immediate assistance for Addis Ababa guild technicians</p>
            </div>
            <span className="text-xs font-mono font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 px-2.5 py-1 rounded-full">
              Live Dispatch Desk Online
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <a
              href="tel:9876"
              className="p-4 bg-blue-50 dark:bg-blue-950/60 rounded-2xl border border-blue-200 dark:border-blue-800 flex flex-col justify-between hover:scale-102 transition-transform"
            >
              <div className="space-y-1">
                <Phone className="w-5 h-5 text-blue-600" />
                <h5 className="font-extrabold text-slate-900 dark:text-white">Direct Hotline</h5>
                <span className="text-slate-500 block text-[11px]">Dial 9876 or +251 911 00 22 44</span>
              </div>
              <span className="text-blue-600 font-bold text-[10px] mt-2 block">Call Hotline →</span>
            </a>

            <a
              href="https://t.me/smartfix_ethiopia_support"
              target="_blank"
              rel="noreferrer"
              className="p-4 bg-sky-50 dark:bg-sky-950/60 rounded-2xl border border-sky-200 dark:border-sky-800 flex flex-col justify-between hover:scale-102 transition-transform"
            >
              <div className="space-y-1">
                <Send className="w-5 h-5 text-sky-600" />
                <h5 className="font-extrabold text-slate-900 dark:text-white">Telegram Help Desk</h5>
                <span className="text-slate-500 block text-[11px]">@smartfix_ethiopia_support</span>
              </div>
              <span className="text-sky-600 font-bold text-[10px] mt-2 block">Open Telegram →</span>
            </a>

            <div className="p-4 bg-rose-50 dark:bg-rose-950/60 rounded-2xl border border-rose-200 dark:border-rose-800 flex flex-col justify-between">
              <div className="space-y-1">
                <AlertOctagon className="w-5 h-5 text-rose-600" />
                <h5 className="font-extrabold text-slate-900 dark:text-white">Emergency SOS</h5>
                <span className="text-slate-500 block text-[11px]">Security or on-site hazard alert</span>
              </div>
              <button
                type="button"
                onClick={handleTriggerSos}
                disabled={sosSent}
                className="w-full py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-black text-[10px] cursor-pointer mt-2"
              >
                {sosSent ? '🚨 SOS Alert Broadcasting' : 'Trigger SOS Alert'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DOCUMENT PREVIEW MODAL */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white dark:bg-[#0A1224] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-500" />
                <div>
                  <h3 className="font-black text-sm text-slate-900 dark:text-white">{previewDoc.title}</h3>
                  <span className="text-[10px] text-slate-400">{previewDoc.type}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPreviewDoc(null)}
                className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-[#070D1B] rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Document No:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">{previewDoc.idNum}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Status:</span>
                <span className="font-bold text-emerald-600">{previewDoc.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Issuer:</span>
                <span className="text-slate-800 dark:text-slate-200">Federal Democratic Republic of Ethiopia</span>
              </div>
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 text-center text-slate-400 text-[10px]">
                🔒 Cryptographically signed & verified on SmartFix Addis Guild Ledger
              </div>
            </div>

            <button
              type="button"
              onClick={() => setPreviewDoc(null)}
              className="w-full py-2.5 bg-[#1E3A8A] text-white font-bold rounded-xl text-xs"
            >
              Close Viewer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
