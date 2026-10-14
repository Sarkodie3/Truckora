import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { CartItem } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats minor units (cents) into EUR currency string (e.g. 145000 -> €1,450.00)
 */
export function formatCentsToEur(cents: number, locale = 'nl-NL'): string {
  const amount = cents / 100;
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Normalizes OEM and part numbers for matching (strips special characters, spaces, uppercase)
 * Keeps letters and numbers intact.
 */
export function normalizeOem(input: string): string {
  if (!input) return '';
  return input.toUpperCase().replace(/[^A-Z0-9]/g, '');
}

/**
 * Calculates standard European shipping based on items weight and freight tier
 */
export function calculateShippingCents(items: CartItem[], countryCode: string = 'NL'): number {
  if (!items || items.length === 0) return 0;

  // Calculate total weight
  let totalWeightKg = 0;
  let hasHeavyFreight = false;

  for (const item of items) {
    const weight = item.product.weightKg || 5.0;
    totalWeightKg += weight * item.quantity;
    if (weight > 30 || item.product.shippingClass === 'heavy_pallet') {
      hasHeavyFreight = true;
    }
  }

  // Base freight logic for European commercial transport
  if (hasHeavyFreight || totalWeightKg > 40) {
    // Pallet transport
    switch (countryCode.toUpperCase()) {
      case 'NL':
      case 'BE':
        return 6500; // €65.00
      case 'DE':
        return 8500; // €85.00
      case 'FR':
      case 'AT':
      case 'DK':
        return 12000; // €120.00
      default:
        return 15000; // €150.00
    }
  } else {
    // Standard parcel shipping
    switch (countryCode.toUpperCase()) {
      case 'NL':
      case 'BE':
        return 1500; // €15.00
      case 'DE':
        return 1950; // €19.50
      default:
        return 2800; // €28.00
    }
  }
}

/**
 * Calculates VAT (Default 21% standard EU B2B rate)
 */
export function calculateTaxCents(subtotalCents: number, vatPercent: number = 21.0): number {
  if (subtotalCents <= 0) return 0;
  return Math.round((subtotalCents * vatPercent) / 100);
}

/**
 * Formats ISO date string to localized date
 */
export function formatDate(dateString: string): string {
  try {
    const d = new Date(dateString);
    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(d);
  } catch {
    return dateString;
  }
}

/**
 * Generates a clean, unique order reference e.g. TRK-2026-8491
 */
export function generateOrderNumber(): string {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `TRK-${year}-${randomNum}`;
}
