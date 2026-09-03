import React, { useState } from 'react';
import {
  Building2,
  Users,
  Wrench,
  TrendingUp,
  MapPin,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Edit2,
  Shield,
  Search,
  ChevronRight,
  Filter,
  Phone,
  Star,
  Activity,
  Zap,
  Sliders,
  X,
  Image as ImageIcon,
  Upload,
  Layers,
  Trash2,
  Eye,
  Tv,
  Laptop,
  Sun,
  Droplet,
  Paintbrush,
  Sparkles,
  Trees,
  ShieldCheck,
  Cpu,
  Key,
  Camera,
  Car,
  Hammer,
  Flame,
  Fan,
  Tag,
  Check,
  ExternalLink,
  Info,
  DollarSign,
  Coins,
  ArrowUpRight,
  Navigation,
  LayoutDashboard,
  Radio,
  FileText,
  BadgeCheck,
  Scale,
  CreditCard,
  MessageSquare,
  BarChart3,
  Bell,
  Settings,
  ShieldAlert,
  AlertCircle,
  Smartphone,
  RefreshCw,
  Lock,
  Receipt,
  FileCheck,
  CheckCheck,
  XCircle,
  HelpCircle,
  ChevronDown,
  Menu
} from 'lucide-react';
import { Booking, Technician, ServiceItem, Zone, CategoryItem } from '../types';
import { INITIAL_ZONES } from '../data/mockData';
import { INITIAL_CATEGORIES, PRESET_SERVICE_IMAGES } from '../data/servicesData';
import { SmartFixLiveMap } from './SmartFixLiveMap';
import { ServiceImagePicker } from './ServiceImagePicker';

interface AdminDashboardProps {
  categories?: CategoryItem[];
  onAddCategory?: (newCategory: CategoryItem) => void;
  onUpdateCategory?: (categoryId: string, updates: Partial<CategoryItem>) => void;
  onDeleteCategory?: (categoryId: string) => void;
  services: ServiceItem[];
  onUpdateService?: (serviceId: string, updates: Partial<ServiceItem>) => void;
  onUpdateServicePrice: (serviceId: string, newPrice: number) => void;
  onAddService: (newService: ServiceItem) => void;
  onDeleteService?: (serviceId: string) => void;
  technicians: Technician[];
  onAddTechnician: (newTech: Technician) => void;
  onToggleTechVerify: (techId: string) => void;
  bookings: Booking[];
  onAssignTechnician: (bookingId: string, techId: string) => void;
  onUpdateBookingStatus: (bookingId: string, status: Booking['status']) => void;
  onResetDefaults?: () => void;
  isDarkMode: boolean;
}

const AVAILABLE_CATEGORY_ICONS = [
  { name: 'Zap', label: 'Electrical / Power', icon: Zap },
  { name: 'Droplet', label: 'Plumbing / Water', icon: Droplet },
  { name: 'Tv', label: 'TV & Home Appliances', icon: Tv },
  { name: 'Laptop', label: 'IT & Electronics', icon: Laptop },
  { name: 'Sun', label: 'Solar & Inverters', icon: Sun },
  { name: 'Car', label: 'Auto & Fleet Electrics', icon: Car },
  { name: 'Cpu', label: 'Heavy Machinery & Generators', icon: Cpu },
  { name: 'Paintbrush', label: 'Commercial Finishing', icon: Paintbrush },
  { name: 'Trees', label: 'Landscaping & Pumps', icon: Trees },
  { name: 'Sparkles', label: 'Deep Cleaning & Sanitation', icon: Sparkles },
  { name: 'Wrench', label: 'General Maintenance', icon: Wrench },
  { name: 'ShieldCheck', label: 'Security & CCTV', icon: ShieldCheck },
  { name: 'Key', label: 'Locksmith & Access', icon: Key },
  { name: 'Camera', label: 'Smart Tech & Cameras', icon: Camera },
  { name: 'Flame', label: 'HVAC & Boilers', icon: Flame },
  { name: 'Fan', label: 'Ventilation & AC', icon: Fan },
  { name: 'Hammer', label: 'Carpentry & Metalwork', icon: Hammer },
];

export function AdminDashboard({
  categories = INITIAL_CATEGORIES,
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory,
  services,
  onUpdateService,
  onUpdateServicePrice,
  onAddService,
  onDeleteService,
  technicians,
  onAddTechnician,
  onToggleTechVerify,
  bookings,
  onAssignTechnician,
  onUpdateBookingStatus,
  onResetDefaults,
  isDarkMode,
}: AdminDashboardProps) {
  // Navigation State matching exact requested hierarchy
  type AdminTab =
    | 'dashboard'
    // OPERATIONS
    | 'live_dispatch'
    | 'requests'
    | 'technicians'
    | 'customers'
    // COMMERCE
    | 'service_catalog'
    | 'rate_master'
    | 'payments'
    | 'disputes_refunds'
    // TRUST
    | 'technician_kyc'
    | 'reviews'
    | 'complaints'
    // INSIGHTS
    | 'analytics'
    | 'reports'
    // SYSTEM
    | 'notifications'
    | 'settings';

  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Search and Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | Booking['status']>('all');
  const [catalogCategoryFilter, setCatalogCategoryFilter] = useState<string>('all');
  const [catalogSearch, setCatalogSearch] = useState<string>('');

  // Selected Booking for Dispatch/Details
  const [selectedBookingForAction, setSelectedBookingForAction] = useState<Booking | null>(null);
  const [reassignTechId, setReassignTechId] = useState<string>('');

  // Editing Single Service State
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [editingPrice, setEditingPrice] = useState<string>('');

  // Modal State for full Service Editor
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [editServiceName, setEditServiceName] = useState<string>('');
  const [editServiceNameAm, setEditServiceNameAm] = useState<string>('');
  const [editServiceNameOm, setEditServiceNameOm] = useState<string>('');
  const [editServiceNameTi, setEditServiceNameTi] = useState<string>('');
  const [editServiceNameSo, setEditServiceNameSo] = useState<string>('');
  const [editServiceCategory, setEditServiceCategory] = useState<string>('electrical');
  const [editServicePrice, setEditServicePrice] = useState<string>('300');
  const [editServiceImage, setEditServiceImage] = useState<string>('');
  const [editServiceDesc, setEditServiceDesc] = useState<string>('');
  const [editServicePopular, setEditServicePopular] = useState<boolean>(false);
  const [editServiceWarranty, setEditServiceWarranty] = useState<number>(30);
  const [editServiceImageTab, setEditServiceImageTab] = useState<'presets' | 'url' | 'upload'>('presets');

  // Add Service Modal state
  const [showAddServiceModal, setShowAddServiceModal] = useState<boolean>(false);
  const [newServiceName, setNewServiceName] = useState<string>('');
  const [newServiceNameAm, setNewServiceNameAm] = useState<string>('');
  const [newServiceNameOm, setNewServiceNameOm] = useState<string>('');
  const [newServiceNameTi, setNewServiceNameTi] = useState<string>('');
  const [newServiceNameSo, setNewServiceNameSo] = useState<string>('');
  const [newServiceCategory, setNewServiceCategory] = useState<string>('electrical');
  const [newServicePrice, setNewServicePrice] = useState<string>('350');
  const [newServiceImage, setNewServiceImage] = useState<string>('https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80');
  const [newServiceDesc, setNewServiceDesc] = useState<string>('');
  const [newServicePopular, setNewServicePopular] = useState<boolean>(false);
  const [newServiceWarranty, setNewServiceWarranty] = useState<number>(30);
  const [newServiceImageTab, setNewServiceImageTab] = useState<'presets' | 'url' | 'upload'>('presets');

  // Delete Service Confirmation
  const [serviceToDelete, setServiceToDelete] = useState<ServiceItem | null>(null);

  // Category Management Modals
  const [showAddCategoryModal, setShowAddCategoryModal] = useState<boolean>(false);
  const [newCatId, setNewCatId] = useState<string>('');
  const [newCatLabel, setNewCatLabel] = useState<string>('');
  const [newCatLabelAm, setNewCatLabelAm] = useState<string>('');
  const [newCatLabelOm, setNewCatLabelOm] = useState<string>('');
  const [newCatLabelTi, setNewCatLabelTi] = useState<string>('');
  const [newCatLabelSo, setNewCatLabelSo] = useState<string>('');
  const [newCatIcon, setNewCatIcon] = useState<string>('Wrench');
  const [newCatDesc, setNewCatDesc] = useState<string>('');

  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);
  const [editCatLabel, setEditCatLabel] = useState<string>('');
  const [editCatLabelAm, setEditCatLabelAm] = useState<string>('');
  const [editCatLabelOm, setEditCatLabelOm] = useState<string>('');
  const [editCatLabelTi, setEditCatLabelTi] = useState<string>('');
  const [editCatLabelSo, setEditCatLabelSo] = useState<string>('');
  const [editCatIcon, setEditCatIcon] = useState<string>('Wrench');
  const [editCatDesc, setEditCatDesc] = useState<string>('');

  const [categoryToDelete, setCategoryToDelete] = useState<CategoryItem | null>(null);

  // Add Tech Modal state
  const [showAddTechModal, setShowAddTechModal] = useState<boolean>(false);
  const [newTechName, setNewTechName] = useState<string>('');
  const [newTechPhone, setNewTechPhone] = useState<string>('+251 91 ');
  const [newTechSpecialty, setNewTechSpecialty] = useState<string>('Electrical & Electronic Systems');
  const [newTechZone, setNewTechZone] = useState<string>('Bole, Medhanialem & Atlas');

  // Technician KYC Detail Modal State
  const [selectedTechKyc, setSelectedTechKyc] = useState<Technician | null>(null);

  // Dispute Detail Modal
  const [selectedDispute, setSelectedDispute] = useState<{
    id: string;
    bookingId: string;
    customerName: string;
    techName: string;
    amount: number;
    reason: string;
    status: 'open' | 'investigating' | 'resolved' | 'refunded';
    date: string;
  } | null>(null);

  interface DisputeItem {
    id: string;
    bookingId: string;
    customerName: string;
    techName: string;
    amount: number;
    reason: string;
    status: 'open' | 'investigating' | 'resolved' | 'refunded';
    date: string;
  }

  // Mock disputes & refunds
  const [disputesList, setDisputesList] = useState<DisputeItem[]>([
    {
      id: 'DSP-801',
      bookingId: 'SF-1082',
      customerName: 'Alemayehu Tadesse',
      techName: 'Dawit Abebe',
      amount: 450,
      reason: 'Breaker tripped again 24 hours after repair. Customer requests free rework under 30-Day Guarantee.',
      status: 'open',
      date: 'Today, 11:40 AM',
    },
    {
      id: 'DSP-794',
      bookingId: 'SF-1079',
      customerName: 'Samrawit Getachew',
      techName: 'Yohannes Bekele',
      amount: 600,
      reason: 'Parts invoice discrepancy on water pump gasket. Escrow hold applied.',
      status: 'investigating',
      date: 'Yesterday, 04:15 PM',
    }
  ]);

  // System Settings State
  const [platformCommissionRate, setPlatformCommissionRate] = useState<number>(10);
  const [minEscrowDeposit, setMinEscrowDeposit] = useState<number>(3500);
  const [chapaLiveMode, setChapaLiveMode] = useState<boolean>(true);
  const [telebirrWebhookStatus, setTelebirrWebhookStatus] = useState<boolean>(true);

  // Notification Toast
  const [adminToast, setAdminToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setAdminToast(msg);
    setTimeout(() => setAdminToast(null), 4000);
  };

  // KPI Calculations
  const totalRevenueETB = bookings
    .filter(b => b.status === 'completed')
    .reduce((sum, b) => sum + b.price + (b.partsCost || 0), 0);

  const totalCommissionETB = Math.round(totalRevenueETB * (platformCommissionRate / 100));
  const activeJobsCount = bookings.filter(b => b.status === 'in_progress' || b.status === 'in_route' || b.status === 'pending').length;
  const availableTechsCount = technicians.filter(t => t.status === 'available').length;
  const verifiedTechsCount = technicians.filter(t => t.verified).length;

  const filteredBookings = bookings.filter(b => {
    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
    const matchesSearch =
      b.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.serviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const filteredCatalogServices = services.filter(s => {
    const matchesCat = catalogCategoryFilter === 'all' || s.category === catalogCategoryFilter;
    const q = catalogSearch.toLowerCase();
    const matchesQ =
      s.name.toLowerCase().includes(q) ||
      (s.nameAm && s.nameAm.toLowerCase().includes(q)) ||
      (s.category && s.category.toLowerCase().includes(q)) ||
      (s.description && s.description.toLowerCase().includes(q));
    return matchesCat && matchesQ;
  });

  const renderCategoryIcon = (iconName?: string, className: string = 'w-4 h-4') => {
    const match = AVAILABLE_CATEGORY_ICONS.find(i => i.name === iconName);
    const IconComp = match ? match.icon : Wrench;
    return <IconComp className={className} />;
  };

  const handleSaveQuickPrice = (serviceId: string) => {
    const val = parseFloat(editingPrice);
    if (!isNaN(val) && val > 0) {
      if (onUpdateService) {
        onUpdateService(serviceId, { price: val });
      } else {
        onUpdateServicePrice(serviceId, val);
      }
      showToast(`Price updated to ${val} ETB`);
    }
    setEditingServiceId(null);
  };

  const handleOpenEditServiceModal = (service: ServiceItem) => {
    setEditingService(service);
    setEditServiceName(service.name || '');
    setEditServiceNameAm(service.nameAm || '');
    setEditServiceNameOm(service.nameOm || '');
    setEditServiceNameTi(service.nameTi || '');
    setEditServiceNameSo(service.nameSo || '');
    setEditServiceCategory(service.category || 'electrical');
    setEditServicePrice(service.price ? service.price.toString() : '300');
    setEditServiceImage(service.image || '');
    setEditServiceDesc(service.description || '');
    setEditServicePopular(!!service.popular);
    setEditServiceWarranty(service.warrantyDays || 30);
  };

  const handleSaveFullService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;
    const parsedPrice = parseFloat(editServicePrice) || editingService.price;
    const updates: Partial<ServiceItem> = {
      name: editServiceName.trim() || editingService.name,
      nameAm: editServiceNameAm.trim() || undefined,
      nameOm: editServiceNameOm.trim() || undefined,
      nameTi: editServiceNameTi.trim() || undefined,
      nameSo: editServiceNameSo.trim() || undefined,
      category: editServiceCategory,
      price: parsedPrice,
      image: editServiceImage || editingService.image,
      description: editServiceDesc.trim() || undefined,
      popular: editServicePopular,
      warrantyDays: editServiceWarranty,
    };
    if (onUpdateService) {
      onUpdateService(editingService.id, updates);
    }
    setEditingService(null);
    showToast(`Saved changes to "${updates.name}"`);
  };

  const handleCreateNewService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServiceName.trim()) return;
    const newService: ServiceItem = {
      id: `srv-${Date.now()}`,
      name: newServiceName.trim(),
      nameAm: newServiceNameAm.trim() || undefined,
      nameOm: newServiceNameOm.trim() || undefined,
      nameTi: newServiceNameTi.trim() || undefined,
      nameSo: newServiceNameSo.trim() || undefined,
      category: newServiceCategory,
      price: parseFloat(newServicePrice) || 350,
      rating: 5.0,
      reviewsCount: 0,
      image: newServiceImage,
      description: newServiceDesc.trim() || undefined,
      popular: newServicePopular,
      warrantyDays: newServiceWarranty,
    };
    onAddService(newService);
    setShowAddServiceModal(false);
    setNewServiceName('');
    setNewServiceNameAm('');
    setNewServiceNameOm('');
    setNewServiceNameTi('');
    setNewServiceNameSo('');
    setNewServiceDesc('');
    showToast(`Added new service: "${newService.name}"`);
  };

  const handleCreateNewCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatLabel.trim() || !onAddCategory) return;
    const generatedId = newCatId.trim()
      ? newCatId.trim().toLowerCase().replace(/\s+/g, '_')
      : newCatLabel.trim().toLowerCase().replace(/[^a-z0-9]/g, '_');
    const newCategory: CategoryItem = {
      id: generatedId,
      label: newCatLabel.trim(),
      labelAm: newCatLabelAm.trim() || undefined,
      labelOm: newCatLabelOm.trim() || undefined,
      labelTi: newCatLabelTi.trim() || undefined,
      labelSo: newCatLabelSo.trim() || undefined,
      iconName: newCatIcon,
      description: newCatDesc.trim() || undefined,
    };
    onAddCategory(newCategory);
    setShowAddCategoryModal(false);
    setNewCatId('');
    setNewCatLabel('');
    setNewCatLabelAm('');
    setNewCatLabelOm('');
    setNewCatLabelTi('');
    setNewCatLabelSo('');
    setNewCatDesc('');
    showToast(`Created category: "${newCategory.label}"`);
  };

  const handleSaveEditCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory || !onUpdateCategory) return;
    const updates: Partial<CategoryItem> = {
      label: editCatLabel.trim() || editingCategory.label,
      labelAm: editCatLabelAm.trim() || undefined,
      labelOm: editCatLabelOm.trim() || undefined,
      labelTi: editCatLabelTi.trim() || undefined,
      labelSo: editCatLabelSo.trim() || undefined,
      iconName: editCatIcon,
      description: editCatDesc.trim() || undefined,
    };
    onUpdateCategory(editingCategory.id, updates);
    setEditingCategory(null);
    showToast(`Updated category: "${updates.label}"`);
  };

  const handleAddTechSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTechName.trim()) return;
    const newTech: Technician = {
      id: `tech-${Date.now()}`,
      name: newTechName.trim(),
      phone: newTechPhone.trim(),
      specialty: newTechSpecialty,
      rating: 5.0,
      completedJobs: 0,
      status: 'available',
      activeZone: newTechZone,
      earningsTodayETB: 0,
      earningsTotalETB: 0,
      walletBalanceETB: 0,
      commissionDueETB: 0,
      coinBalance: 1000,
      securitySubscriptionActive: true,
      securitySubscriptionExpiry: '2026-09-30',
      securityAutoRenew: true,
      securityMonthlyFeeCoins: 299,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      verified: true,
      badge: 'Certified Master Pro',
      warrantyPromiseDays: 30,
      escrowDepositETB: 3500,
      warrantyCommitmentSigned: true
    };
    onAddTechnician(newTech);
    setShowAddTechModal(false);
    setNewTechName('');
    setNewTechPhone('+251 91 ');
    showToast(`Technician ${newTech.name} vetted & added to active fleet`);
  };

  // Nav Item click helper
  const selectNav = (tab: AdminTab) => {
    setActiveTab(tab);
    setMobileSidebarOpen(false);
  };

  return (
    <div className="w-full min-h-[85vh] bg-slate-100 dark:bg-[#060C18] text-slate-900 dark:text-slate-100 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col md:flex-row">
      
      {/* ======================================================== */}
      {/* 1. GLOBAL ADMIN TOAST NOTIFICATION                       */}
      {/* ======================================================== */}
      {adminToast && (
        <div className="fixed top-6 right-6 z-50 bg-[#0F1E3D] text-white border-2 border-blue-400 px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-slide-down">
          <div className="w-7 h-7 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold">{adminToast}</span>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. ADMIN SIDEBAR (PROFESSIONAL EXECUTIVE HIERARCHY)       */}
      {/* ======================================================== */}
      <aside className={`md:w-64 bg-white dark:bg-[#091122] border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between shrink-0 transition-all ${
        mobileSidebarOpen ? 'block fixed inset-0 z-50 w-72' : 'hidden md:flex'
      }`}>
        <div className="p-4 overflow-y-auto space-y-5 max-h-[85vh]">
          {/* Header Brand */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#1E3A8A] to-[#2563EB] text-white flex items-center justify-center shadow-md">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h1 className="font-black text-sm text-slate-900 dark:text-white tracking-tight flex items-center gap-1">
                  <span>SMARTFIX</span>
                  <span className="text-[10px] bg-[#1E3A8A] text-white px-1.5 py-0.2 rounded-md font-mono">
                    ADMIN
                  </span>
                </h1>
                <p className="text-[10px] text-slate-400 font-medium">Addis Marketplace Console</p>
              </div>
            </div>
            {mobileSidebarOpen && (
              <button onClick={() => setMobileSidebarOpen(false)} className="md:hidden text-slate-400 p-1">
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* MAIN NAVIGATION TREE */}
          <nav className="space-y-4 text-xs font-bold">
            {/* 🏠 DASHBOARD */}
            <div>
              <button
                onClick={() => selectNav('dashboard')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all ${
                  activeTab === 'dashboard'
                    ? 'bg-[#1E3A8A] text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Executive Dashboard</span>
              </button>
            </div>

            {/* SECTION: OPERATIONS */}
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 dark:text-slate-500 px-3 block">
                OPERATIONS
              </span>
              <button
                onClick={() => selectNav('live_dispatch')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all ${
                  activeTab === 'live_dispatch'
                    ? 'bg-[#1E3A8A] text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Radio className="w-4 h-4 text-amber-500" />
                  <span>Live Dispatch</span>
                </div>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-500">
                  {activeJobsCount}
                </span>
              </button>

              <button
                onClick={() => selectNav('requests')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all ${
                  activeTab === 'requests'
                    ? 'bg-[#1E3A8A] text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <FileText className="w-4 h-4 text-blue-500" />
                  <span>Requests & Orders</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400">{bookings.length}</span>
              </button>

              <button
                onClick={() => selectNav('technicians')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all ${
                  activeTab === 'technicians'
                    ? 'bg-[#1E3A8A] text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Wrench className="w-4 h-4 text-emerald-500" />
                  <span>Technicians Fleet</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400">{technicians.length}</span>
              </button>

              <button
                onClick={() => selectNav('customers')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all ${
                  activeTab === 'customers'
                    ? 'bg-[#1E3A8A] text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <Users className="w-4 h-4 text-cyan-500" />
                <span>Customers Registry</span>
              </button>
            </div>

            {/* SECTION: COMMERCE */}
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 dark:text-slate-500 px-3 block">
                COMMERCE
              </span>
              <button
                onClick={() => selectNav('service_catalog')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all ${
                  activeTab === 'service_catalog'
                    ? 'bg-[#1E3A8A] text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <Layers className="w-4 h-4 text-indigo-500" />
                <span>Service Catalog</span>
              </button>

              <button
                onClick={() => selectNav('rate_master')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all ${
                  activeTab === 'rate_master'
                    ? 'bg-[#1E3A8A] text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <Tag className="w-4 h-4 text-purple-500" />
                <span>Rate Master</span>
              </button>

              <button
                onClick={() => selectNav('payments')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all ${
                  activeTab === 'payments'
                    ? 'bg-[#1E3A8A] text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <CreditCard className="w-4 h-4 text-emerald-500" />
                <span>Payments & Settlement</span>
              </button>

              <button
                onClick={() => selectNav('disputes_refunds')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all ${
                  activeTab === 'disputes_refunds'
                    ? 'bg-[#1E3A8A] text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Scale className="w-4 h-4 text-rose-500" />
                  <span>Disputes & Refunds</span>
                </div>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-rose-500/20 text-rose-500">
                  {disputesList.filter(d => d.status === 'open').length}
                </span>
              </button>
            </div>

            {/* SECTION: TRUST & SAFETY */}
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 dark:text-slate-500 px-3 block">
                TRUST & SAFETY
              </span>
              <button
                onClick={() => selectNav('technician_kyc')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all ${
                  activeTab === 'technician_kyc'
                    ? 'bg-[#1E3A8A] text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <BadgeCheck className="w-4 h-4 text-amber-500" />
                <span>Technician KYC</span>
              </button>

              <button
                onClick={() => selectNav('reviews')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all ${
                  activeTab === 'reviews'
                    ? 'bg-[#1E3A8A] text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <Star className="w-4 h-4 text-yellow-500" />
                <span>Customer Reviews</span>
              </button>

              <button
                onClick={() => selectNav('complaints')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all ${
                  activeTab === 'complaints'
                    ? 'bg-[#1E3A8A] text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <MessageSquare className="w-4 h-4 text-orange-500" />
                <span>Complaints Box</span>
              </button>
            </div>

            {/* SECTION: INSIGHTS & REPORTS */}
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 dark:text-slate-500 px-3 block">
                INSIGHTS
              </span>
              <button
                onClick={() => selectNav('analytics')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all ${
                  activeTab === 'analytics'
                    ? 'bg-[#1E3A8A] text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <BarChart3 className="w-4 h-4 text-blue-500" />
                <span>Analytics & Zone Map</span>
              </button>

              <button
                onClick={() => selectNav('reports')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all ${
                  activeTab === 'reports'
                    ? 'bg-[#1E3A8A] text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <FileCheck className="w-4 h-4 text-teal-500" />
                <span>Financial Reports</span>
              </button>
            </div>

            {/* SECTION: SYSTEM */}
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 dark:text-slate-500 px-3 block">
                SYSTEM
              </span>
              <button
                onClick={() => selectNav('notifications')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all ${
                  activeTab === 'notifications'
                    ? 'bg-[#1E3A8A] text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <Bell className="w-4 h-4 text-pink-500" />
                <span>Broadcast & Alerts</span>
              </button>

              <button
                onClick={() => selectNav('settings')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all ${
                  activeTab === 'settings'
                    ? 'bg-[#1E3A8A] text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <Settings className="w-4 h-4 text-slate-400" />
                <span>Platform Settings</span>
              </button>
            </div>
          </nav>
        </div>

        {/* Footer Admin Tag */}
        <div className="p-3 bg-slate-50 dark:bg-[#070D1A] border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-mono text-slate-500">Node v20 • Addis-01</span>
          </div>
          <span className="text-[10px] font-bold text-slate-400">v2.4 Pro</span>
        </div>
      </aside>

      {/* ======================================================== */}
      {/* 3. MAIN EXECUTIVE CONTENT CANVAS                          */}
      {/* ======================================================== */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto max-h-[85vh]">
        {/* Mobile Header Bar */}
        <header className="p-3.5 bg-white dark:bg-[#0A1224] border-b border-slate-200 dark:border-slate-800 flex items-center justify-between md:hidden shrink-0">
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center gap-1.5 text-xs font-bold"
          >
            <Menu className="w-4 h-4" />
            <span>Menu</span>
          </button>
          <span className="font-extrabold text-xs uppercase tracking-wider text-[#1E3A8A] dark:text-[#93C5FD]">
            {activeTab.replace('_', ' ')}
          </span>
          <div className="w-8 h-8 rounded-full bg-[#1E3A8A] text-white flex items-center justify-center text-xs font-bold">
            AD
          </div>
        </header>

        {/* Dynamic Content View Container */}
        <div className="p-4 sm:p-6 space-y-6">

          {/* ======================================================== */}
          {/* TAB 1: 🏠 EXECUTIVE DASHBOARD                             */}
          {/* ======================================================== */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Header Title */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                    Executive Control Dashboard
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Real-time operational health across Addis Ababa sub-cities and marketplace economics.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => selectNav('live_dispatch')}
                    className="bg-[#1E3A8A] hover:bg-[#2563EB] text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow-sm flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Radio className="w-3.5 h-3.5 text-amber-300" />
                    <span>Live Dispatch Stream</span>
                  </button>
                </div>
              </div>

              {/* 4 Core Executive Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Metric 1 */}
                <div className="bg-white dark:bg-[#0A1224] p-4.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">Gross Turnover</span>
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                      <DollarSign className="w-4 h-4" />
                    </div>
                  </div>
                  <div>
                    <span className="text-2xl font-black font-mono text-slate-900 dark:text-white">
                      {totalRevenueETB.toLocaleString()}
                    </span>
                    <span className="text-xs font-bold text-slate-400 ml-1">ETB</span>
                  </div>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    <span>+{totalCommissionETB.toLocaleString()} ETB Platform Take (10%)</span>
                  </span>
                </div>

                {/* Metric 2 */}
                <div className="bg-white dark:bg-[#0A1224] p-4.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">Active In-Flight</span>
                    <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                      <Activity className="w-4 h-4" />
                    </div>
                  </div>
                  <div>
                    <span className="text-2xl font-black font-mono text-slate-900 dark:text-white">
                      {activeJobsCount}
                    </span>
                    <span className="text-xs font-bold text-slate-400 ml-1">Dispatches</span>
                  </div>
                  <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold">
                    {bookings.filter(b => b.status === 'in_progress').length} Currently Repairing
                  </span>
                </div>

                {/* Metric 3 */}
                <div className="bg-white dark:bg-[#0A1224] p-4.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">Online Tech Fleet</span>
                    <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                      <Wrench className="w-4 h-4" />
                    </div>
                  </div>
                  <div>
                    <span className="text-2xl font-black font-mono text-slate-900 dark:text-white">
                      {availableTechsCount} / {technicians.length}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-medium">
                    {verifiedTechsCount} Master Guild Certified
                  </span>
                </div>

                {/* Metric 4 */}
                <div className="bg-white dark:bg-[#0A1224] p-4.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">Escrow Backing</span>
                    <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                  </div>
                  <div>
                    <span className="text-2xl font-black font-mono text-purple-600 dark:text-purple-400">
                      {(technicians.reduce((sum, t) => sum + (t.escrowDepositETB || 3500), 0)).toLocaleString()}
                    </span>
                    <span className="text-xs font-bold text-slate-400 ml-1">ETB</span>
                  </div>
                  <span className="text-[10px] text-purple-600 dark:text-purple-400 font-bold">
                    30-Day Workmanship Pledge
                  </span>
                </div>
              </div>

              {/* Quick Operation Tables Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Live Operations Stream */}
                <div className="bg-white dark:bg-[#0A1224] p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                      <Radio className="w-4 h-4 text-amber-500" />
                      <span>Recent Orders & Dispatches</span>
                    </h3>
                    <button
                      onClick={() => selectNav('requests')}
                      className="text-xs font-bold text-[#1D4ED8] dark:text-[#60A5FA] hover:underline"
                    >
                      View All →
                    </button>
                  </div>

                  <div className="space-y-2 divide-y divide-slate-100 dark:divide-slate-800">
                    {bookings.slice(0, 4).map((b) => (
                      <div key={b.id} className="pt-2 flex items-center justify-between gap-3 text-xs">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-[#1E3A8A] dark:text-[#93C5FD]">#{b.id}</span>
                            <span className="font-bold text-slate-900 dark:text-white">{b.serviceName}</span>
                          </div>
                          <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3" />
                            <span>{b.customerName} • {b.address}</span>
                          </p>
                        </div>

                        <div className="text-right">
                          <span className="font-mono font-black text-emerald-600 dark:text-emerald-400">
                            {b.price} ETB
                          </span>
                          <span className={`text-[10px] font-bold block capitalize ${
                            b.status === 'completed' ? 'text-emerald-500' : 'text-amber-500'
                          }`}>
                            {b.status.replace('_', ' ')}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Addis Ababa Sub-City Radar */}
                <div className="bg-white dark:bg-[#0A1224] p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-blue-500" />
                      <span>Addis Ababa Sub-City Density</span>
                    </h3>
                    <button
                      onClick={() => selectNav('analytics')}
                      className="text-xs font-bold text-[#1D4ED8] dark:text-[#60A5FA] hover:underline"
                    >
                      Heatmap →
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    {INITIAL_ZONES.slice(0, 6).map((z) => (
                      <div key={z.id} className="p-3 bg-slate-50 dark:bg-[#070D1B] rounded-2xl border border-slate-200 dark:border-slate-800 text-xs">
                        <span className="font-bold text-slate-800 dark:text-slate-200 block truncate">{z.name}</span>
                        <div className="flex items-center justify-between mt-1 text-[11px] text-slate-500">
                          <span>{z.techs} Active Techs</span>
                          <span className="font-mono font-bold text-emerald-600">{z.eta}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 2: ⚡ LIVE DISPATCH (OPERATIONAL RADAR CONTROL)        */}
          {/* ======================================================== */}
          {activeTab === 'live_dispatch' && (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <Radio className="w-5 h-5 text-amber-500 animate-pulse" />
                    <span>Live Dispatch Stream & Radar Control</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Monitor customer dispatches, technician route telemetry, and manual override assignments.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as any)}
                    className="bg-white dark:bg-[#0A1224] border border-slate-200 dark:border-slate-800 text-xs font-bold rounded-xl px-3 py-2"
                  >
                    <option value="all">All Dispatch Statuses</option>
                    <option value="pending">Pending Radar</option>
                    <option value="in_route">In Route</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              {/* Addis Ababa Live Dispatch Operations Map */}
              <div className="bg-white dark:bg-[#0A1224] border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-5 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                    <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                      Live Fleet Telemetry & Dispatch Heatmap
                    </h3>
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-500">
                    {technicians.filter(t => t.status !== 'offline').length} active units across Addis Ababa
                  </span>
                </div>

                <SmartFixLiveMap
                  otherTechnicians={technicians}
                  showOtherTechs={true}
                  showDirections={false}
                  height="340px"
                  mode="admin"
                />
              </div>

              {/* Active Dispatch Radar Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredBookings.map((b) => {
                  const assignedTech = technicians.find(t => t.id === b.technicianId);
                  return (
                    <div
                      key={b.id}
                      className={`p-5 rounded-3xl border transition-all space-y-4 ${
                        b.status === 'in_progress'
                          ? 'bg-amber-500/5 border-amber-500/30'
                          : b.status === 'pending'
                          ? 'bg-blue-500/5 border-blue-500/30'
                          : 'bg-white dark:bg-[#0A1224] border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[10px] font-mono font-bold text-[#1E3A8A] dark:text-[#93C5FD]">
                            #{b.id}
                          </span>
                          <h4 className="font-extrabold text-base text-slate-900 dark:text-white">{b.serviceName}</h4>
                          <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3.5 h-3.5 text-amber-500" />
                            <span>{b.customerName} • {b.address}</span>
                          </p>
                        </div>

                        <span className={`text-[10px] font-mono font-black uppercase px-2.5 py-1 rounded-full border ${
                          b.status === 'in_progress'
                            ? 'bg-amber-500/10 text-amber-600 border-amber-500/30'
                            : b.status === 'completed'
                            ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30'
                            : 'bg-blue-500/10 text-blue-600 border-blue-500/30'
                        }`}>
                          {b.status.replace('_', ' ')}
                        </span>
                      </div>

                      {/* Technician assignment pill */}
                      <div className="p-3 bg-slate-50 dark:bg-[#070D1B] rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-xl bg-[#1E3A8A] text-white flex items-center justify-center font-bold text-[10px]">
                            {assignedTech ? assignedTech.name.charAt(0) : '?'}
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 block">Assigned Tech</span>
                            <span className="font-bold text-slate-900 dark:text-white">
                              {assignedTech ? assignedTech.name : 'Unassigned (Broadcasting)'}
                            </span>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="font-mono font-black text-emerald-600 dark:text-emerald-400 block">
                            {b.price} ETB
                          </span>
                          <span className="text-[10px] text-slate-400">Est. Labor</span>
                        </div>
                      </div>

                      {/* Security OTP Badges */}
                      <div className="flex items-center gap-2 text-[11px] font-mono">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          Start OTP: <strong>{b.startOtp || '4821'}</strong>
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          Completion OTP: <strong>{b.completionOtp || '7394'}</strong>
                        </span>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-2 pt-1 border-t border-slate-100 dark:border-slate-800">
                        <button
                          onClick={() => {
                            setSelectedBookingForAction(b);
                            setReassignTechId(b.technicianId || technicians[0]?.id || '');
                          }}
                          className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                        >
                          Manual Reassign / Override
                        </button>
                        {b.status !== 'completed' && (
                          <button
                            onClick={() => {
                              onUpdateBookingStatus(b.id, 'completed');
                              showToast(`Order #${b.id} marked completed by Admin`);
                            }}
                            className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
                          >
                            Mark Done
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 3: 📋 REQUESTS & ORDERS (MARKETPLACE OPERATIONS)      */}
          {/* ======================================================== */}
          {activeTab === 'requests' && (
            <div className="bg-white dark:bg-[#0A1224] p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                    Marketplace Orders & Booking Records ({bookings.length})
                  </h3>
                  <p className="text-xs text-slate-500">Comprehensive ledger of all service engagements.</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="Search customer, ID, address..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-8 pr-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs rounded-xl text-slate-900 dark:text-white focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 dark:bg-[#070D1B] text-slate-400 font-mono text-[10px] uppercase border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="p-3">Order ID</th>
                      <th className="p-3">Customer & Area</th>
                      <th className="p-3">Service</th>
                      <th className="p-3">Assigned Tech</th>
                      <th className="p-3">Gross Total</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {filteredBookings.map((b) => {
                      const tech = technicians.find(t => t.id === b.technicianId);
                      return (
                        <tr key={b.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                          <td className="p-3 font-mono font-bold text-[#1E3A8A] dark:text-[#93C5FD]">#{b.id}</td>
                          <td className="p-3">
                            <span className="font-bold text-slate-900 dark:text-white block">{b.customerName}</span>
                            <span className="text-[11px] text-slate-400">{b.address}</span>
                          </td>
                          <td className="p-3 font-medium text-slate-800 dark:text-slate-200">{b.serviceName}</td>
                          <td className="p-3 font-medium text-slate-600 dark:text-slate-400">
                            {tech ? tech.name : 'Unassigned'}
                          </td>
                          <td className="p-3 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                            {(b.price + (b.partsCost || 0))} ETB
                          </td>
                          <td className="p-3">
                            <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md ${
                              b.status === 'completed'
                                ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600'
                                : 'bg-amber-100 dark:bg-amber-950 text-amber-600'
                            }`}>
                              {b.status}
                            </span>
                          </td>
                          <td className="p-3">
                            <button
                              onClick={() => {
                                setSelectedBookingForAction(b);
                                setReassignTechId(b.technicianId || technicians[0]?.id || '');
                              }}
                              className="text-blue-600 dark:text-blue-400 hover:underline font-bold"
                            >
                              Inspect
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 4: 🛠️ TECHNICIANS (FLEET MANAGEMENT)                  */}
          {/* ======================================================== */}
          {activeTab === 'technicians' && (
            <div className="bg-white dark:bg-[#0A1224] p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                    Certified Technicians Fleet ({technicians.length})
                  </h3>
                  <p className="text-xs text-slate-500">Live roster of vetted craftsman with rating and escrow credentials.</p>
                </div>
                <button
                  onClick={() => setShowAddTechModal(true)}
                  className="bg-[#1E3A8A] hover:bg-[#2563EB] text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Onboard Technician</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {technicians.map((t) => (
                  <div
                    key={t.id}
                    className="p-4 bg-slate-50 dark:bg-[#070D1B] rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <img
                          src={t.avatar}
                          alt={t.name}
                          referrerPolicy="no-referrer"
                          className="w-12 h-12 rounded-xl object-cover border-2 border-slate-300 dark:border-slate-700"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">{t.name}</h4>
                            {t.verified && <BadgeCheck className="w-4 h-4 text-blue-500" />}
                          </div>
                          <p className="text-[11px] text-slate-400">{t.specialty}</p>
                          <p className="text-[10px] text-slate-500 font-mono">{t.phone}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[10px] bg-white dark:bg-[#0A1224] p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
                        <div>
                          <span className="text-slate-400 block">Rating</span>
                          <span className="font-bold text-amber-500 flex items-center gap-0.5">
                            <Star className="w-3 h-3 fill-amber-400" /> {t.rating}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 block">Jobs Done</span>
                          <span className="font-bold text-slate-900 dark:text-white">{t.completedJobs}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block">FixCoins</span>
                          <span className="font-bold text-amber-600 font-mono">{t.coinBalance ?? 1000}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block">Escrow Pledge</span>
                          <span className="font-bold text-purple-600 font-mono">{t.escrowDepositETB || 3500} ETB</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                      <button
                        onClick={() => setSelectedTechKyc(t)}
                        className="flex-1 py-1.5 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                      >
                        KYC & Escrow
                      </button>
                      <button
                        onClick={() => {
                          onToggleTechVerify(t.id);
                          showToast(`Verification status changed for ${t.name}`);
                        }}
                        className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-colors cursor-pointer ${
                          t.verified
                            ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 border border-rose-200 dark:border-rose-900'
                            : 'bg-emerald-600 text-white'
                        }`}
                      >
                        {t.verified ? 'Revoke' : 'Verify'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 5: 👥 CUSTOMERS REGISTRY                              */}
          {/* ======================================================== */}
          {activeTab === 'customers' && (
            <div className="bg-white dark:bg-[#0A1224] p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                    Registered Customers & Homeowners
                  </h3>
                  <p className="text-xs text-slate-500">Addis Ababa clients requesting residential and commercial repairs.</p>
                </div>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {bookings.map((b) => (
                  <div key={b.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                        {b.customerName.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-extrabold text-slate-900 dark:text-white">{b.customerName}</h4>
                        <p className="text-[11px] text-slate-500 flex items-center gap-2">
                          <span>{b.customerPhone}</span>
                          <span>•</span>
                          <span>{b.address}</span>
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="font-mono font-bold text-slate-900 dark:text-white block">{b.serviceName}</span>
                      <span className="text-[10px] text-emerald-600 font-bold">{b.price} ETB Paid</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 6: 📦 SERVICE CATALOG (COMMERCE CONTROL)              */}
          {/* ======================================================== */}
          {activeTab === 'service_catalog' && (
            <div className="bg-white dark:bg-[#0A1224] p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                    Dynamic Service Offerings ({services.length})
                  </h3>
                  <p className="text-xs text-slate-500">Edit titles, multilingual translations, descriptions, and cover artwork.</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowAddCategoryModal(true)}
                    className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 px-3 py-2 rounded-xl text-xs font-bold cursor-pointer"
                  >
                    + Add Category
                  </button>
                  <button
                    onClick={() => setShowAddServiceModal(true)}
                    className="bg-[#1E3A8A] hover:bg-[#2563EB] text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ New Service</span>
                  </button>
                </div>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <select
                  value={catalogCategoryFilter}
                  onChange={(e) => setCatalogCategoryFilter(e.target.value)}
                  className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold rounded-xl px-3 py-2 text-slate-700 dark:text-slate-300"
                >
                  <option value="all">All Categories ({categories.length})</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.label}</option>
                  ))}
                </select>

                <div className="relative flex-1 min-w-[200px]">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search services by title..."
                    value={catalogSearch}
                    onChange={(e) => setCatalogSearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs rounded-xl"
                  />
                </div>
              </div>

              {/* Services Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCatalogServices.map((s) => (
                  <div
                    key={s.id}
                    className="p-3.5 bg-slate-50 dark:bg-[#070D1B] rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="relative h-28 rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-800">
                        <img
                          src={s.image}
                          alt={s.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-slate-950/80 text-white font-mono font-bold text-[10px]">
                          {s.price} ETB
                        </span>
                      </div>

                      <div>
                        <h4 className="font-extrabold text-sm text-slate-900 dark:text-white line-clamp-1">{s.name}</h4>
                        {s.nameAm && <p className="text-[11px] text-slate-400 font-medium">{s.nameAm}</p>}
                        <span className="text-[10px] font-mono text-blue-600 dark:text-blue-400 uppercase">
                          {s.category}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                      <button
                        onClick={() => handleOpenEditServiceModal(s)}
                        className="flex-1 py-1.5 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                      >
                        Edit Details
                      </button>
                      <button
                        onClick={() => setServiceToDelete(s)}
                        className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/60 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 7: 🏷️ RATE MASTER (LABOR & BASE PRICING)              */}
          {/* ======================================================== */}
          {activeTab === 'rate_master' && (
            <div className="bg-white dark:bg-[#0A1224] p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                    Rate Master & Base Labor Pricing
                  </h3>
                  <p className="text-xs text-slate-500">Quickly adjust base Ethiopian Birr (ETB) diagnostic rates across all services.</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 dark:bg-[#070D1B] text-slate-400 font-mono text-[10px] uppercase border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="p-3">Service</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Base Diagnostic Rate (ETB)</th>
                      <th className="p-3">90% Tech Payout</th>
                      <th className="p-3">10% Platform Fee</th>
                      <th className="p-3">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {services.map((s) => (
                      <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                        <td className="p-3 font-bold text-slate-900 dark:text-white">{s.name}</td>
                        <td className="p-3 font-mono text-[11px] text-slate-400 capitalize">{s.category}</td>
                        <td className="p-3 font-mono font-bold text-slate-900 dark:text-white">
                          {editingServiceId === s.id ? (
                            <div className="flex items-center gap-1">
                              <input
                                type="number"
                                value={editingPrice}
                                onChange={(e) => setEditingPrice(e.target.value)}
                                className="w-20 px-2 py-1 bg-white dark:bg-slate-900 border border-blue-500 rounded text-xs"
                                autoFocus
                              />
                              <button
                                onClick={() => handleSaveQuickPrice(s.id)}
                                className="px-2 py-1 bg-emerald-600 text-white rounded text-[10px] font-bold"
                              >
                                Save
                              </button>
                            </div>
                          ) : (
                            <span>{s.price} ETB</span>
                          )}
                        </td>
                        <td className="p-3 font-mono text-emerald-600 font-bold">
                          {Math.round(s.price * 0.9)} ETB
                        </td>
                        <td className="p-3 font-mono text-blue-600 font-bold">
                          {Math.round(s.price * 0.1)} ETB
                        </td>
                        <td className="p-3">
                          <button
                            onClick={() => {
                              setEditingServiceId(s.id);
                              setEditingPrice(s.price.toString());
                            }}
                            className="text-blue-600 dark:text-blue-400 font-bold hover:underline"
                          >
                            Update Rate
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 8: 💳 PAYMENTS & SETTLEMENT                           */}
          {/* ======================================================== */}
          {activeTab === 'payments' && (
            <div className="bg-white dark:bg-[#0A1224] p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                    Payments, Settlements & Chapa Gateways
                  </h3>
                  <p className="text-xs text-slate-500">Live transaction logs, Telebirr direct deposits, and FixCoin commissions.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl">
                  <span className="text-[10px] uppercase font-bold text-emerald-600 block">Total Processed</span>
                  <span className="text-2xl font-black font-mono text-emerald-600">{totalRevenueETB.toLocaleString()} ETB</span>
                </div>
                <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-2xl">
                  <span className="text-[10px] uppercase font-bold text-blue-600 block">Platform Commission (10%)</span>
                  <span className="text-2xl font-black font-mono text-blue-600">{totalCommissionETB.toLocaleString()} ETB</span>
                </div>
                <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-2xl">
                  <span className="text-[10px] uppercase font-bold text-purple-600 block">Chapa Live Status</span>
                  <span className="text-lg font-bold text-purple-600 flex items-center gap-1 mt-1">
                    <CheckCircle2 className="w-4 h-4" /> Gateway Online
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 9: ⚖️ DISPUTES & REFUNDS (FINANCIAL CONTROL)          */}
          {/* ======================================================== */}
          {activeTab === 'disputes_refunds' && (
            <div className="bg-white dark:bg-[#0A1224] p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                    Disputes, Warranty Claims & Refund Console
                  </h3>
                  <p className="text-xs text-slate-500">30-Day workmanship warranty enforcement and escrow dispute mediation.</p>
                </div>
              </div>

              <div className="space-y-3">
                {disputesList.map((d) => (
                  <div key={d.id} className="p-4 bg-slate-50 dark:bg-[#070D1B] rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-rose-600">#{d.id}</span>
                          <span className="font-bold text-slate-900 dark:text-white">Booking #{d.bookingId}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 font-mono uppercase">
                            {d.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 font-medium">
                          {d.reason}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-1">
                          Client: <strong>{d.customerName}</strong> • Technician: <strong>{d.techName}</strong> • {d.date}
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="text-base font-black font-mono text-slate-900 dark:text-white block">
                          {d.amount} ETB
                        </span>
                        <span className="text-[10px] text-slate-400">Escrow Held</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                      <button
                        onClick={() => {
                          setDisputesList(prev => prev.map(item => item.id === d.id ? { ...item, status: 'resolved' } : item));
                          showToast(`Dispute #${d.id} resolved with free technician rework dispatched.`);
                        }}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                      >
                        Dispatch Free Warranty Rework
                      </button>
                      <button
                        onClick={() => {
                          setDisputesList(prev => prev.map(item => item.id === d.id ? { ...item, status: 'refunded' } : item));
                          showToast(`Refund of ${d.amount} ETB issued to ${d.customerName}.`);
                        }}
                        className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                      >
                        Issue Full Refund from Escrow
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 10: 🛡️ TECHNICIAN KYC (TRUST & VERIFICATION)          */}
          {/* ======================================================== */}
          {activeTab === 'technician_kyc' && (
            <div className="bg-white dark:bg-[#0A1224] p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                    Technician KYC & Guild Escrow Vetting
                  </h3>
                  <p className="text-xs text-slate-500">Kebele ID verification, trade certifications, and collateral lock.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {technicians.map((t) => (
                  <div key={t.id} className="p-4 bg-slate-50 dark:bg-[#070D1B] rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={t.avatar}
                          alt={t.name}
                          referrerPolicy="no-referrer"
                          className="w-10 h-10 rounded-xl object-cover"
                        />
                        <div>
                          <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">{t.name}</h4>
                          <span className="text-[10px] text-slate-400">{t.badge}</span>
                        </div>
                      </div>

                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        t.verified ? 'bg-emerald-500/10 text-emerald-600' : 'bg-rose-500/10 text-rose-600'
                      }`}>
                        {t.verified ? 'Verified' : 'Pending Review'}
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                      <div className="flex justify-between">
                        <span>National ID / Kebele:</span>
                        <span className="font-mono font-bold text-slate-800 dark:text-slate-200">ET-ID-8823910</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Collateral Escrow:</span>
                        <span className="font-mono font-bold text-purple-600">{t.escrowDepositETB || 3500} ETB Locked</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Warranty Pledge Signed:</span>
                        <span className="font-bold text-emerald-600">30-Day Free Rework Backed</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 11: ⭐ CUSTOMER REVIEWS                              */}
          {/* ======================================================== */}
          {activeTab === 'reviews' && (
            <div className="bg-white dark:bg-[#0A1224] p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Customer Ratings & Feedback</h3>
              <div className="space-y-3">
                {bookings.filter(b => b.rating).map((b) => (
                  <div key={b.id} className="p-3.5 bg-slate-50 dark:bg-[#070D1B] rounded-2xl border border-slate-200 dark:border-slate-800 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 dark:text-white">{b.customerName}</span>
                      <span className="flex items-center gap-1 text-amber-500 font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400" /> {b.rating} / 5
                      </span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 italic">"{b.ratingComment || 'Fast, professional, and punctual repair.'}"</p>
                    <p className="text-[10px] text-slate-400">{b.serviceName} • Verified Repair #{b.id}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 12: 💬 COMPLAINTS BOX                                 */}
          {/* ======================================================== */}
          {activeTab === 'complaints' && (
            <div className="bg-white dark:bg-[#0A1224] p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Direct Feedback & Inquiries</h3>
              <p className="text-xs text-slate-500">No unresolved complaints logged in the last 24 hours.</p>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 13: 📊 ANALYTICS & REPORTS                           */}
          {/* ======================================================== */}
          {activeTab === 'analytics' && (
            <div className="bg-white dark:bg-[#0A1224] p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Regional Growth & Analytics</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-[#070D1B] rounded-2xl border border-slate-200 dark:border-slate-800">
                  <span className="text-xs font-bold text-slate-400 block uppercase">Top Performing Category</span>
                  <span className="text-lg font-black text-slate-900 dark:text-white mt-1 block">Electrical & Power Systems (42%)</span>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-[#070D1B] rounded-2xl border border-slate-200 dark:border-slate-800">
                  <span className="text-xs font-bold text-slate-400 block uppercase">Top Sub-City</span>
                  <span className="text-lg font-black text-slate-900 dark:text-white mt-1 block">Bole, Medhanialem & Atlas (38%)</span>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 14: ⚙️ PLATFORM SETTINGS (BUSINESS CONTROL)           */}
          {/* ======================================================== */}
          {activeTab === 'settings' && (
            <div className="bg-white dark:bg-[#0A1224] p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">System & Marketplace Settings</h3>
              <div className="space-y-3 max-w-lg text-xs">
                <div className="p-3 bg-slate-50 dark:bg-[#070D1B] rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">Platform Commission Rate (%)</span>
                    <span className="text-[11px] text-slate-400">Deducted automatically from technician wallet in FixCoins</span>
                  </div>
                  <input
                    type="number"
                    value={platformCommissionRate}
                    onChange={(e) => setPlatformCommissionRate(parseFloat(e.target.value) || 10)}
                    className="w-16 px-2 py-1 bg-white dark:bg-slate-900 border rounded font-mono font-bold text-right"
                  />
                </div>

                <div className="p-3 bg-slate-50 dark:bg-[#070D1B] rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">Min. Escrow Collateral (ETB)</span>
                    <span className="text-[11px] text-slate-400">Required before technician receives live dispatches</span>
                  </div>
                  <input
                    type="number"
                    value={minEscrowDeposit}
                    onChange={(e) => setMinEscrowDeposit(parseFloat(e.target.value) || 3500)}
                    className="w-20 px-2 py-1 bg-white dark:bg-slate-900 border rounded font-mono font-bold text-right"
                  />
                </div>

                <button
                  onClick={() => showToast('Platform configuration settings updated.')}
                  className="w-full py-2.5 bg-[#1E3A8A] text-white font-bold rounded-xl cursor-pointer hover:bg-blue-800 transition-colors"
                >
                  Save Platform Configuration
                </button>

                {onResetDefaults && (
                  <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                    <div className="p-3.5 bg-rose-50/70 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 rounded-2xl flex items-center justify-between">
                      <div>
                        <span className="font-extrabold text-rose-900 dark:text-rose-300 block">Restore Default Demo Data</span>
                        <span className="text-[11px] text-rose-700/80 dark:text-rose-400/80">
                          Resets catalog, technicians, and local storage back to factory default mock records.
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm('Are you sure you want to reset all data and persistent storage back to factory defaults?')) {
                            onResetDefaults();
                            showToast('All system data reset to defaults.');
                          }
                        }}
                        className="px-3 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs shrink-0 cursor-pointer transition-colors"
                      >
                        Reset Storage
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </main>

      {/* ======================================================== */}
      {/* 4. MODALS (EDIT SERVICE, REASSIGN, ONBOARD TECH, ETC.)   */}
      {/* ======================================================== */}

      {/* REASSIGN / INSPECT BOOKING MODAL */}
      {selectedBookingForAction && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0A1224] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-scale-up">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-black text-base text-slate-900 dark:text-white">
                Dispatch Override (#{selectedBookingForAction.id})
              </h3>
              <button onClick={() => setSelectedBookingForAction(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-400 block">Service</span>
                <span className="font-bold text-slate-900 dark:text-white">{selectedBookingForAction.serviceName}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Customer</span>
                <span className="font-bold text-slate-900 dark:text-white">{selectedBookingForAction.customerName} ({selectedBookingForAction.customerPhone})</span>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Assign / Reassign Technician</label>
                <select
                  value={reassignTechId}
                  onChange={(e) => setReassignTechId(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl font-bold text-slate-800 dark:text-slate-200"
                >
                  {technicians.map(t => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.specialty}) • {t.status}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setSelectedBookingForAction(null)}
                className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onAssignTechnician(selectedBookingForAction.id, reassignTechId);
                  setSelectedBookingForAction(null);
                  showToast(`Assigned technician to order #${selectedBookingForAction.id}`);
                }}
                className="flex-1 py-2.5 bg-[#1E3A8A] text-white font-bold rounded-xl"
              >
                Confirm Dispatch
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FULL SERVICE EDIT MODAL */}
      {editingService && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0A1224] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-xl w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-black text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-blue-500" />
                <span>Edit Service Offering</span>
              </h3>
              <button onClick={() => setEditingService(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveFullService} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold block mb-1">Service Title (English)</label>
                <input
                  type="text"
                  value={editServiceName}
                  onChange={(e) => setEditServiceName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="font-bold block mb-1">Amharic Translation (አማርኛ)</label>
                <input
                  type="text"
                  value={editServiceNameAm}
                  onChange={(e) => setEditServiceNameAm(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold block mb-1">Base Price (ETB)</label>
                  <input
                    type="number"
                    value={editServicePrice}
                    onChange={(e) => setEditServicePrice(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border rounded-xl font-mono font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold block mb-1">Category</label>
                  <select
                    value={editServiceCategory}
                    onChange={(e) => setEditServiceCategory(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border rounded-xl font-bold"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Service Cover Artwork (Picker with Presets, Device Upload, URL) */}
              <ServiceImagePicker
                currentImage={editServiceImage}
                onSelectImage={(imgUrl) => setEditServiceImage(imgUrl)}
                serviceCategory={editServiceCategory}
              />

              <div className="flex items-center gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setEditingService(null)}
                  className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-800 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#1E3A8A] text-white font-bold rounded-xl hover:bg-blue-800 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD NEW SERVICE MODAL */}
      {showAddServiceModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0A1224] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-xl w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-black text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-emerald-500" />
                <span>Add New Service Offering</span>
              </h3>
              <button onClick={() => setShowAddServiceModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNewService} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold block mb-1">Service Title (English)</label>
                <input
                  type="text"
                  placeholder="e.g., Solar Inverter Diagnostic & Repair"
                  value={newServiceName}
                  onChange={(e) => setNewServiceName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="font-bold block mb-1">Amharic Title (አማርኛ)</label>
                <input
                  type="text"
                  placeholder="e.g., የሶላር ኢንቨርተር ጥገና"
                  value={newServiceNameAm}
                  onChange={(e) => setNewServiceNameAm(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold block mb-1">Base Price (ETB)</label>
                  <input
                    type="number"
                    value={newServicePrice}
                    onChange={(e) => setNewServicePrice(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border rounded-xl font-mono font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold block mb-1">Category</label>
                  <select
                    value={newServiceCategory}
                    onChange={(e) => setNewServiceCategory(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border rounded-xl font-bold"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Service Cover Artwork (Picker with Presets, Device Upload, URL) */}
              <ServiceImagePicker
                currentImage={newServiceImage}
                onSelectImage={(imgUrl) => setNewServiceImage(imgUrl)}
                serviceCategory={newServiceCategory}
              />

              <div className="flex items-center gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddServiceModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-800 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#1E3A8A] text-white font-bold rounded-xl hover:bg-blue-800 transition-colors"
                >
                  Create Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ONBOARD TECHNICIAN MODAL */}
      {showAddTechModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0A1224] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-black text-base text-slate-900 dark:text-white">
                Onboard & Vet Certified Technician
              </h3>
              <button onClick={() => setShowAddTechModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddTechSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold block mb-1">Technician Full Name</label>
                <input
                  type="text"
                  placeholder="e.g., Getachew Tadesse"
                  value={newTechName}
                  onChange={(e) => setNewTechName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="font-bold block mb-1">Phone Number</label>
                <input
                  type="text"
                  value={newTechPhone}
                  onChange={(e) => setNewTechPhone(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border rounded-xl font-mono"
                  required
                />
              </div>

              <div>
                <label className="font-bold block mb-1">Trade Specialization</label>
                <input
                  type="text"
                  value={newTechSpecialty}
                  onChange={(e) => setNewTechSpecialty(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border rounded-xl"
                />
              </div>

              <div className="flex items-center gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddTechModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-800 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-600 text-white font-bold rounded-xl"
                >
                  Confirm & Vet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE SERVICE CONFIRMATION MODAL */}
      {serviceToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0A1224] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 mx-auto flex items-center justify-center">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-black text-base text-slate-900 dark:text-white">Delete Service?</h3>
              <p className="text-xs text-slate-500 mt-1">
                Are you sure you want to delete "{serviceToDelete.name}" from the active catalog?
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setServiceToDelete(null)}
                className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-800 font-bold text-xs rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (onDeleteService) onDeleteService(serviceToDelete.id);
                  setServiceToDelete(null);
                  showToast(`Removed service "${serviceToDelete.name}"`);
                }}
                className="flex-1 py-2.5 bg-rose-600 text-white font-bold text-xs rounded-xl"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
