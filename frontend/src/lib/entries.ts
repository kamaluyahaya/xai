'use client';

import { useEffect, useState } from 'react';

export const ENTRIES_STORAGE_KEY = 'xai_banking_entries';
export const ENTRIES_EVENT = 'xai:entries-updated';

export type Decision = 'APPROVED' | 'REJECTED' | 'REVIEW';

export interface CustomerEntry {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  age: string;
  address: string;
  creditScore: number;
  annualIncome: string;
  loanAmount: string;
  loanTerm: number;
  employmentYears: number;
  existingDebts: string;
  loanPurpose: string;
  homeOwnership: string;
  paymentHistory: string;
  decision: Decision;
  confidence: number;
  riskScore: number;
  dti: number;
  score: number;
  createdAt: string;
}

export const loanPurposeLabels: Record<string, string> = {
  home_purchase: 'Mortgage Loan',
  refinance: 'Refinance',
  business: 'Business Credit',
  auto: 'Auto Loan',
  personal: 'Personal Loan',
  education: 'Education Loan',
};

export function formatNumber(value: string | number): string {
  const digits = String(value).replace(/\D/g, '');
  return digits ? Number(digits).toLocaleString('en-NG') : '';
}

export function formatNaira(value: string | number): string {
  return `₦${formatNumber(value) || '0'}`;
}

export function digitsOnly(value: string): string {
  return value.replace(/\D/g, '');
}

export function getEntries(): CustomerEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(ENTRIES_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? (parsed as CustomerEntry[]) : [];
  } catch {
    return [];
  }
}

export function saveEntry(entry: CustomerEntry): void {
  if (typeof window === 'undefined') return;
  const entries = [entry, ...getEntries()];
  window.localStorage.setItem(ENTRIES_STORAGE_KEY, JSON.stringify(entries));
  window.dispatchEvent(new CustomEvent(ENTRIES_EVENT));
}

export function createEntryId(): string {
  const next = getEntries().length + 843;
  return `TXN-${String(next).padStart(5, '0')}`;
}

export function useEntries(): CustomerEntry[] {
  const [entries, setEntries] = useState<CustomerEntry[]>([]);

  useEffect(() => {
    const sync = () => setEntries(getEntries());
    sync();
    window.addEventListener(ENTRIES_EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(ENTRIES_EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  return entries;
}
