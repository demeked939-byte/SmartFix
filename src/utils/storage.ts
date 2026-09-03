/**
 * LocalStorage Persistence Layer for SmartFix
 * Ensures all Admin service edits, image uploads, price adjustments,
 * category additions, and technician changes stay permanent across reloads.
 */

const KEYS = {
  CATEGORIES: 'smartfix_v2_categories',
  SERVICES: 'smartfix_v2_services',
  TECHNICIANS: 'smartfix_v2_technicians',
  BOOKINGS: 'smartfix_v2_bookings',
  ROLE: 'smartfix_v2_role',
  LANGUAGE: 'smartfix_v2_lang',
  LOCATION: 'smartfix_v2_location',
};

export function loadFromStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const item = localStorage.getItem(key);
    if (!item) return defaultValue;
    return JSON.parse(item) as T;
  } catch (err) {
    console.warn(`Failed to parse localStorage key "${key}":`, err);
    return defaultValue;
  }
}

export function saveToStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn(`Failed to save to localStorage key "${key}":`, err);
  }
}

export function resetAllStorage(): void {
  if (typeof window === 'undefined') return;
  try {
    Object.values(KEYS).forEach((k) => localStorage.removeItem(k));
  } catch (err) {
    console.warn('Failed to clear storage:', err);
  }
}

export { KEYS };
