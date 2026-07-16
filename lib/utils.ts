import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency = 'INR') {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(date: string | Date) {
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date))
}

export function generateProfileId(type: 'aspirant' | 'agency') {
  const prefix = type === 'aspirant' ? 'A' : 'C'
  const num = Math.floor(10000 + Math.random() * 90000)
  return `${prefix}${num}`
}

export function truncate(str: string, length: number) {
  return str.length > length ? str.slice(0, length) + '...' : str
}
