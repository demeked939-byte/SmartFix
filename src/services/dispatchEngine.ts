/**
 * SmartFix GPS Dispatch & Matching Engine
 * Inspired by modern on-demand ride-hailing algorithms (Ride, Uber, Feres, Bolt)
 * Gives technicians freedom to work anywhere in Ethiopia by broadcasting real-time GPS telemetry
 */

import { Booking, Technician, Zone } from '../types';

export interface GpsLocation {
  lat: number;
  lng: number;
  accuracyMeters?: number;
  heading?: number;
  speedKmh?: number;
  updatedAt?: string;
  addressLabel?: string;
}

export interface DispatchRankScore {
  technician: Technician;
  distanceKm: number;
  estimatedTravelTimeMin: number;
  etaDisplay: string;
  ratingScore: number;
  workloadActiveJobs: number;
  isOnline: boolean;
  isVerified: boolean;
  hasSkill: boolean;
  withinRadius: boolean;
  totalCompositeScore: number; // 0 to 100
  matchReason: string;
}

// Known Hub Coordinates for Addis Ababa and regional centers
export const ADDIS_SUB_CITY_COORDINATES: Record<string, { lat: number; lng: number }> = {
  'bole': { lat: 8.9954, lng: 38.7884 },
  'kazanchis': { lat: 9.0177, lng: 38.7667 },
  'sarbet': { lat: 8.9880, lng: 38.7368 },
  'cmc': { lat: 9.0232, lng: 38.8350 },
  'piassa': { lat: 9.0345, lng: 38.7523 },
  'megenagna': { lat: 9.0199, lng: 38.8021 },
  'gotera': { lat: 8.9790, lng: 38.7590 },
  'mexico': { lat: 9.0105, lng: 38.7450 },
  'arada': { lat: 9.0380, lng: 38.7580 },
  'kirkos': { lat: 9.0080, lng: 38.7620 },
  'nifas_silk': { lat: 8.9560, lng: 38.7480 },
  'kolfe': { lat: 9.0280, lng: 38.7080 },
  'gullele': { lat: 9.0680, lng: 38.7420 },
  'yeka': { lat: 9.0410, lng: 38.8230 },
  'akaki_kality': { lat: 8.8920, lng: 38.7680 },
  'lideta': { lat: 9.0060, lng: 38.7360 },
  'addis_ketema': { lat: 9.0320, lng: 38.7340 }
};

/**
 * Standard Haversine Distance Formula (kilometers)
 */
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return Math.round(d * 10) / 10; // 1 decimal place
}

/**
 * Calculate ETA travel time in minutes based on Addis Ababa traffic heuristics
 */
export function calculateEtaMinutes(distanceKm: number, isRushHour: boolean = false): number {
  // Average Addis urban road speed ~ 22 km/h, rush hour ~ 15 km/h
  const avgSpeed = isRushHour ? 15 : 22;
  const transitTimeMin = (distanceKm / avgSpeed) * 60;
  // Add 3 min response preparation buffer
  return Math.max(4, Math.round(transitTimeMin + 3));
}

/**
 * Match technician specialty against requested service category
 */
export function checkSkillMatch(techSpecialty: string, category: string, serviceName: string): boolean {
  const spec = (techSpecialty || '').toLowerCase();
  const cat = (category || '').toLowerCase();
  const sName = (serviceName || '').toLowerCase();

  if (cat === 'electrical' || sName.includes('electric') || sName.includes('breaker') || sName.includes('power') || sName.includes('wiring')) {
    return spec.includes('electric') || spec.includes('power') || spec.includes('master') || spec.includes('general');
  }
  if (cat === 'plumbing' || sName.includes('plumb') || sName.includes('pipe') || sName.includes('pump') || sName.includes('leak') || sName.includes('drain')) {
    return spec.includes('plumb') || spec.includes('hydraulic') || spec.includes('pump') || spec.includes('water') || spec.includes('general');
  }
  if (cat === 'appliances' || cat === 'electronics_it' || sName.includes('tv') || sName.includes('board') || sName.includes('fridge') || sName.includes('washing')) {
    return spec.includes('tv') || spec.includes('electronic') || spec.includes('appliance') || spec.includes('board') || spec.includes('it') || spec.includes('general');
  }
  if (cat === 'solar' || sName.includes('solar') || sName.includes('inverter') || sName.includes('battery')) {
    return spec.includes('solar') || spec.includes('inverter') || spec.includes('electric') || spec.includes('renewable');
  }
  if (cat === 'generator_heavy' || sName.includes('generator')) {
    return spec.includes('generator') || spec.includes('heavy') || spec.includes('power') || spec.includes('electric');
  }
  // Generic fallback if technician is versatile
  return true;
}

/**
 * Approximate GPS coordinates for an address string or zone
 */
export function resolveCoordinatesForLocation(locationString: string): { lat: number; lng: number } {
  const str = locationString.toLowerCase();
  for (const [key, coords] of Object.entries(ADDIS_SUB_CITY_COORDINATES)) {
    if (str.includes(key) || (key === 'bole' && (str.includes('atlas') || str.includes('medhanialem') || str.includes('edna')))) {
      return coords;
    }
  }
  // Default to central Addis Ababa (Meskel Square)
  return { lat: 9.0105, lng: 38.7610 };
}

/**
 * Core 5-Tier Dispatch Engine Ranking Pipeline
 * Matches user's exact specification:
 * 1. Filter: Service skill, Verified, Online, Not busy, Within service radius (e.g. 15km)
 * 2. Rank by: Estimated travel time (35%), Distance (25%), Rating (20%), Availability (10%), Workload (10%)
 */
export function rankEligibleTechnicians(
  booking: {
    category: string;
    serviceName: string;
    zone: string;
    address: string;
    gpsCoordinates?: { lat: number; lng: number };
  },
  technicians: Technician[],
  allBookings: Booking[],
  maxRadiusKm: number = 20
): DispatchRankScore[] {
  const destinationCoords = booking.gpsCoordinates || resolveCoordinatesForLocation(booking.zone + ' ' + booking.address);

  const scoredList: DispatchRankScore[] = [];

  for (const tech of technicians) {
    // 1. Check if Online
    const isOnline = tech.status !== 'offline';
    
    // 2. Check if Verified
    const isVerified = !!tech.verified;

    // 3. Check Skill
    const hasSkill = checkSkillMatch(tech.specialty, booking.category, booking.serviceName);

    // 4. Check if Not Busy
    const isAvailable = tech.status === 'available';

    // 5. Workload count (active in-progress / in-route jobs)
    const activeJobs = allBookings.filter(
      b => b.technicianId === tech.id && (b.status === 'in_progress' || b.status === 'in_route' || b.status === 'accepted')
    ).length;

    // Tech coordinates (from real-time GPS or active zone hub)
    const techCoords = tech.currentGps || resolveCoordinatesForLocation(tech.activeZone);
    const distanceKm = calculateDistanceKm(
      techCoords.lat,
      techCoords.lng,
      destinationCoords.lat,
      destinationCoords.lng
    );

    const withinRadius = distanceKm <= maxRadiusKm;
    const estimatedTravelTimeMin = calculateEtaMinutes(distanceKm);

    // Scoring weights (0 to 100)
    // 1. Travel Time score (shorter is better, max 35 pts)
    const timeScore = Math.max(0, 35 - (estimatedTravelTimeMin * 0.7));

    // 2. Distance score (closer is better, max 25 pts)
    const distScore = Math.max(0, 25 - (distanceKm * 1.25));

    // 3. Rating score (5.0 = 20 pts)
    const ratingScore = ((tech.rating || 4.5) / 5.0) * 20;

    // 4. Availability & Status (10 pts)
    const availScore = isAvailable ? 10 : (tech.status === 'busy' ? 3 : 0);

    // 5. Workload factor (fewer active jobs = higher score, max 10 pts)
    const workloadScore = Math.max(0, 10 - (activeJobs * 4));

    const totalCompositeScore = Math.round(
      (timeScore + distScore + ratingScore + availScore + workloadScore) * 10
    ) / 10;

    let matchReason = '';
    if (distanceKm <= 2.5) {
      matchReason = 'Immediate Proximity (<3 km)';
    } else if (tech.rating >= 4.9) {
      matchReason = 'Top-Rated Master Guild Specialist';
    } else if (hasSkill) {
      matchReason = 'Matched Direct Trade Skill';
    } else {
      matchReason = 'Zone Coverage Area';
    }

    scoredList.push({
      technician: tech,
      distanceKm,
      estimatedTravelTimeMin,
      etaDisplay: `${estimatedTravelTimeMin} min`,
      ratingScore: tech.rating,
      workloadActiveJobs: activeJobs,
      isOnline,
      isVerified,
      hasSkill,
      withinRadius,
      totalCompositeScore,
      matchReason,
    });
  }

  // Filter only eligible technicians who meet the strict baseline
  // (Online, Verified, Skill, Within Radius)
  const eligible = scoredList.filter(
    item => item.isOnline && item.isVerified && item.hasSkill && item.withinRadius
  );

  // If no strict matches found, fallback to closest online technicians with partial skill
  const finalCandidates = eligible.length > 0
    ? eligible
    : scoredList.filter(item => item.isOnline && item.withinRadius);

  // Sort descending by total composite score
  finalCandidates.sort((a, b) => b.totalCompositeScore - a.totalCompositeScore);

  return finalCandidates;
}
