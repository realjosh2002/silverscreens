import { NextResponse } from 'next/server'

// Standard success response
export function successResponse(data: unknown, status = 200) {
  return NextResponse.json({ success: true, data }, { status })
}

// Standard error response
export function errorResponse(message: string, status = 400, details?: unknown) {
  return NextResponse.json(
    { success: false, error: message, ...(details ? { details } : {}) },
    { status }
  )
}

// Generate unique profile number
// Aspirants: ASP + MMYY + XXXXX  e.g. ASP072610234
// Agencies:  AG  + MMYY + XXXXX  e.g. AG072610234
export function generateProfileNumber(role: 'aspirant' | 'agency'): string {
  const prefix = role === 'aspirant' ? 'ASP' : 'AG'
  const now    = new Date()
  const mm     = String(now.getMonth() + 1).padStart(2, '0')
  const yy     = String(now.getFullYear()).slice(-2)
  const xxxxx  = String(Math.floor(Math.random() * 90000) + 10000)
  return `${prefix}${mm}${yy}${xxxxx}`
}

// Generate OTP (6 digits)
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// OTP expiry — 10 minutes from now
export function otpExpiresAt(): Date {
  return new Date(Date.now() + 10 * 60 * 1000)
}

// Calculate GST (18%)
export function calculateGST(amount: number): { gst: number; total: number } {
  const gst   = Math.round(amount * 0.18)
  const total = amount + gst
  return { gst, total }
}

// Validate email format
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

// Validate phone number (Indian format with optional ISD)
export function isValidPhone(phone: string): boolean {
  return /^(\+91)?[6-9]\d{9}$/.test(phone.replace(/\s/g, ''))
}

// Validate password strength
// Min 8 chars, at least 1 letter, 1 number, 1 special char
export function isValidPassword(password: string): boolean {
  return /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(password)
}

// Mask email for display (e.g. j***@gmail.com)
export function maskEmail(email: string): string {
  const [user, domain] = email.split('@')
  return `${user[0]}***@${domain}`
}

// Mask phone for display (e.g. ******7890)
export function maskPhone(phone: string): string {
  return phone.slice(-4).padStart(phone.length, '*')
}