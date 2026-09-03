export type Role = 'customer' | 'technician' | 'admin';

export type Language = 'en' | 'am' | 'om' | 'ti' | 'so';

export type ServiceCategory = string;

export interface CategoryItem {
  id: string;
  label: string;
  labelAm?: string;
  labelOm?: string;
  labelTi?: string;
  labelSo?: string;
  iconName?: string;
  description?: string;
  descriptionAm?: string;
  descriptionOm?: string;
  descriptionTi?: string;
  descriptionSo?: string;
}

export interface ServiceItem {
  id: string;
  name: string;
  nameAm?: string;
  nameOm?: string;
  nameTi?: string;
  nameSo?: string;
  category: string;
  price: number;
  rating: number;
  reviewsCount: number;
  popular?: boolean;
  image: string;
  description: string;
  descriptionAm?: string;
  descriptionOm?: string;
  descriptionTi?: string;
  descriptionSo?: string;
  estimatedDuration?: string;
  warrantyDays?: number;
}

export type BookingStatus = 'pending' | 'accepted' | 'in_route' | 'in_progress' | 'completed' | 'cancelled';

export interface Booking {
  id: string;
  customerName: string;
  customerPhone: string;
  serviceId: string;
  serviceName: string;
  serviceNameAm?: string;
  serviceNameOm?: string;
  serviceNameTi?: string;
  serviceNameSo?: string;
  category: string;
  zone: string;
  address: string;
  price: number;
  status: BookingStatus;
  scheduledTime: string;
  createdAt: string;
  isUrgent?: boolean;
  notes?: string;
  technicianId?: string;
  technicianName?: string;
  technicianPhone?: string;
  rating?: number;
  partsCost?: number;
  laborPrice?: number;
  totalPrice?: number;
  commissionAmount?: number;
  technicianPayout?: number;
  paymentMethod?: 'telebirr' | 'cbe_birr' | 'cash';
  paymentStatus?: 'pending_payment' | 'paid_direct' | 'settled';
  startOtp?: string;
  completionOtp?: string;
  startOtpVerified?: boolean;
  completionOtpVerified?: boolean;
  cancellationReason?: string;
  cancellationNotes?: string;
  gpsCoordinates?: { lat: number; lng: number };
  gpsVerified?: boolean;
  ratingComment?: string;
  ratingTags?: string[];
  tipAmount?: number;
  warrantyDays?: number;
  warrantyExpiry?: string;
  warrantyObligorName?: string;
  warrantyStatus?: 'active' | 'claimed' | 'expired';
}

export interface CoinTransaction {
  id: string;
  technicianId?: string;
  bookingId?: string;
  type: 'chapa_topup' | 'commission_deduct' | 'monthly_security_sub' | 'payout_settlement' | 'bonus';
  amountCoins: number; // positive (credit) or negative (debit)
  amountETB?: number;
  description: string;
  createdAt: string;
  reference?: string; // e.g. CHAPA-ET-892348
  status: 'completed' | 'pending' | 'failed';
  paymentChannel?: 'chapa_telebirr' | 'chapa_cbe' | 'chapa_abyssinia' | 'chapa_card' | 'system';
}

export interface CoinPackage {
  id: string;
  name: string;
  coins: number;
  bonusCoins: number;
  priceETB: number;
  popular?: boolean;
  tag?: string;
  description: string;
}

export interface Technician {
  id: string;
  name: string;
  phone: string;
  specialty: string;
  specialtyAm?: string;
  specialtyOm?: string;
  specialtyTi?: string;
  specialtySo?: string;
  rating: number;
  completedJobs: number;
  status: 'available' | 'busy' | 'offline';
  activeZone: string;
  earningsTodayETB: number;
  earningsTotalETB: number;
  walletBalanceETB: number;
  commissionDueETB: number;
  coinBalance: number; // SmartFix FixCoins (1 Coin = 1 ETB)
  securitySubscriptionActive?: boolean;
  securitySubscriptionExpiry?: string;
  securityAutoRenew?: boolean;
  securityMonthlyFeeCoins?: number;
  coinLedger?: CoinTransaction[];
  telebirrAccount?: string;
  cbeAccount?: string;
  paymentPreference?: 'telebirr' | 'cbe_birr';
  avatar: string;
  verified: boolean;
  badge: string;
  warrantyPromiseDays?: number; // 30 (1 mo), 60 (2 mo), or 90 (3 mo) pledged based on specialty
  escrowDepositETB?: number; // Security deposit held by platform to protect customers
  warrantyCommitmentSigned?: boolean;
  currentGps?: {
    lat: number;
    lng: number;
    accuracyMeters?: number;
    heading?: number;
    speedKmh?: number;
    updatedAt?: string;
    addressLabel?: string;
  };
}

export interface Zone {
  id: string;
  name: string;
  nameAm?: string;
  nameOm?: string;
  nameTi?: string;
  nameSo?: string;
  techs: number;
  eta: string;
  isPopular: boolean;
}

export interface NotificationItem {
  id: string;
  title: string;
  desc: string;
  time: string;
  type: 'dispatch' | 'status' | 'payout' | 'alert' | 'otp' | 'accepted' | 'start_code' | 'completed_code';
  unread: boolean;
  bookingId?: string;
  actionType?: 'accepted' | 'start_code' | 'completed_code';
  code?: string;
  technicianName?: string;
  technicianPhone?: string;
  serviceName?: string;
  amount?: number;
}
