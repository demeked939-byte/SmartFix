import { CoinPackage } from '../types';

export const CHAPA_COIN_PACKAGES: CoinPackage[] = [
  {
    id: 'pack_starter',
    name: 'Starter FixPack',
    coins: 500,
    bonusCoins: 0,
    priceETB: 500,
    tag: 'Quick Top-up',
    description: 'Covers ~10 regular jobs commission or 1 month of Security Guard.',
  },
  {
    id: 'pack_standard',
    name: 'Standard FixPack',
    coins: 1000,
    bonusCoins: 50,
    priceETB: 1000,
    popular: true,
    tag: '+50 Bonus Coins',
    description: 'Most popular for active technicians in Bole & Kazanchis.',
  },
  {
    id: 'pack_pro',
    name: 'Pro Guild Pack',
    coins: 2500,
    bonusCoins: 200,
    priceETB: 2500,
    tag: '+200 Bonus Coins',
    description: 'Includes priority dispatch booster + 3 months anti-hacker shield.',
  },
  {
    id: 'pack_master',
    name: 'Master Fleet Pack',
    coins: 5000,
    bonusCoins: 600,
    priceETB: 5000,
    tag: '+600 Bonus Coins (Best Value)',
    description: 'Maximum savings with dedicated platform warranty coverage.',
  },
];

export const MONTHLY_SECURITY_SUB_FEE = 299; // 299 FixCoins per month
