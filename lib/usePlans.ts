'use client';

import { useState, useEffect } from 'react';

export interface Plan {
  id:               string;
  plan_key:         string;
  plan_name:        string;
  user_type:        string;
  duration_months:  number;
  price:            number;
  original_price:   number | null;
  features:         string[] | Record<string, unknown>;
  application_limit: number | null;
  is_featured:      boolean;
  sort_order:       number;
}

export interface UsePlansResult {
  plans:         Plan[];
  loading:       boolean;
  error:         string | null;
}

/**
 * Fetches aspirant plans from /api/plans dynamically.
 * Any admin changes to plans will be reflected here automatically.
 */
export function usePlans(type: 'aspirant' | 'agency' = 'aspirant'): UsePlansResult {
  const [plans,   setPlans]   = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/plans?type=${type}`)
      .then(r => r.ok ? r.json() : Promise.reject(r.statusText))
      .then(data => {
        const list: Plan[] = data.data?.aspirant_plans
          ?? data.data?.agency_plans
          ?? data.aspirant_plans
          ?? data.agency_plans
          ?? data.all_plans
          ?? [];
        setPlans(type === 'aspirant'
          ? list.filter(p => p.user_type === 'aspirant')
          : list.filter(p => p.user_type === 'agency')
        );
        setError(null);
      })
      .catch(e => setError(String(e)))
      .finally(() => setLoading(false));
  }, [type]);

  return { plans, loading, error };
}

/**
 * Helper: format price as ₹ string
 */
export function formatPrice(price: number): string {
  return `₹${price.toLocaleString('en-IN')}`;
}

/**
 * Helper: get features as string array regardless of how they're stored
 */
export function getPlanFeatures(plan: Plan): string[] {
  if (Array.isArray(plan.features)) return plan.features as string[];
  if (plan.features && typeof plan.features === 'object') {
    // Could be { included: [...], excluded: [...] } or similar
    const f = plan.features as Record<string, unknown>;
    if (Array.isArray(f.included)) return f.included as string[];
    if (Array.isArray(f.features)) return f.features as string[];
    return Object.values(f).flat().filter(v => typeof v === 'string') as string[];
  }
  return [];
}

/**
 * Helper: get duration label
 */
export function getDurationLabel(months: number): string {
  if (months === 1)  return '1 Month';
  if (months === 3)  return '3 Months';
  if (months === 6)  return '6 Months';
  if (months === 12) return '12 Months';
  return `${months} Months`;
}

/**
 * Helper: get price per month label
 */
export function getPricePerMonth(price: number, months: number): string {
  const perMonth = Math.round(price / months);
  return `≈ ₹${perMonth}/mo`;
}