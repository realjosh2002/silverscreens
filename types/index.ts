// ─── User & Auth ─────────────────────────────────────────────────────────────

export type UserRole = 'aspirant' | 'agency' | 'admin'

export type VerificationStatus = 'pending' | 'approved' | 'rejected' | 'suspended'

export type SubscriptionStatus = 'active' | 'expired' | 'cancelled' | 'pending_payment'

export interface User {
  id: string
  email: string
  phone: string | null
  role: UserRole
  profile_id: string | null       // e.g. A10245 or C20458
  created_at: string
  last_sign_in_at: string | null
}

// ─── Aspirant ────────────────────────────────────────────────────────────────

export interface AspirantProfile {
  id: string
  user_id: string
  profile_number: string          // A10245
  title: 'Mr' | 'Ms' | 'Mrs' | 'Dr' | 'Master' | 'Miss'
  first_name: string
  last_name: string
  gender: 'Male' | 'Female' | 'Others'
  date_of_birth: string
  address_line1: string
  address_line2: string | null
  city: string
  state: string
  pincode: string
  country: string
  height_cm: number | null
  weight_kg: number | null
  hair_color: string | null
  eye_color: string | null
  body_tone: string | null
  body_type: string | null
  chest_size: number | null
  hip_size: number | null
  waist_size: number | null
  shoe_size: number | null
  languages: string[]
  availability: string[]
  about_me: string | null
  profile_image_url: string | null
  category: string | null
  role: string | null
  experience_level: string | null
  social_links: SocialLinks
  resume_url: string | null
  intro_video_url: string | null
  verification_status: VerificationStatus
  trust_score: number             // 100 default, -10 per confirmed complaint
  is_available: boolean
  profile_completion: number      // 0-100 percentage
  profile_views: number
  created_at: string
  updated_at: string
}

export interface AspirantMedia {
  id: string
  aspirant_id: string
  type: 'image' | 'video'
  url: string
  is_primary: boolean
  order_index: number
  created_at: string
}

// ─── Agency ──────────────────────────────────────────────────────────────────

export interface AgencyProfile {
  id: string
  user_id: string
  profile_number: string          // C20458
  company_name: string
  registration_number: string | null
  gst_number: string | null
  pan_number: string | null
  years_of_experience: number | null
  website_url: string | null
  company_description: string | null
  address_line1: string
  address_line2: string | null
  city: string
  state: string
  pincode: string
  country: string
  logo_url: string | null
  banner_url: string | null
  social_links: SocialLinks
  contact_person_name: string
  contact_email: string
  contact_phone: string
  show_phone: boolean
  show_email: boolean
  verification_status: VerificationStatus
  trust_score: number
  profile_views: number
  created_at: string
  updated_at: string
}

// ─── Casting Calls ───────────────────────────────────────────────────────────

export type CastingCallStatus = 'draft' | 'active' | 'closed' | 'expired'
export type AuditionMode = 'online' | 'offline' | 'both'

export interface CastingCall {
  id: string
  agency_id: string
  agency?: AgencyProfile
  title: string
  project_type: string
  role_name: string
  role_description: string
  eligibility_criteria: string | null
  gender_preference: 'Male' | 'Female' | 'Any'
  age_min: number | null
  age_max: number | null
  experience_level: string | null
  skills_required: string[]
  languages_required: string[]
  budget_min: number | null
  budget_max: number | null
  location: string
  audition_mode: AuditionMode
  audition_details: string | null
  compensation_details: string | null
  last_application_date: string
  status: CastingCallStatus
  reference_media_urls: string[]
  applications_count: number
  views_count: number
  bookmarks_count: number
  created_at: string
  updated_at: string
}

// ─── Applications ────────────────────────────────────────────────────────────

export type ApplicationStatus = 'applied' | 'in_review' | 'shortlisted' | 'rejected' | 'selected' | 'on_hold'

export interface Application {
  id: string
  casting_call_id: string
  aspirant_id: string
  agency_id: string
  status: ApplicationStatus
  applied_at: string
  reviewed_at: string | null
  shortlisted_at: string | null
  notes: string | null
  casting_call?: CastingCall
  aspirant?: AspirantProfile
}

// ─── Auditions ───────────────────────────────────────────────────────────────

export type AuditionStatus = 'scheduled' | 'completed' | 'cancelled' | 'rescheduled'

export interface Audition {
  id: string
  application_id: string
  casting_call_id: string
  aspirant_id: string
  agency_id: string
  scheduled_at: string
  duration_minutes: number
  mode: AuditionMode
  meeting_link: string | null
  venue_details: string | null
  notes: string | null
  status: AuditionStatus
  safety_instructions_agreed: boolean
  outcome: 'selected' | 'rejected' | 'on_hold' | null
  created_at: string
}

// ─── Messages ────────────────────────────────────────────────────────────────

export interface Conversation {
  id: string
  participant_1_id: string
  participant_2_id: string
  last_message: string | null
  last_message_at: string | null
  unread_count_1: number
  unread_count_2: number
  is_blocked: boolean
  created_at: string
}

export interface Message {
  id: string
  conversation_id: string
  sender_id: string
  content: string
  type: 'text' | 'image' | 'video' | 'audio' | 'document'
  attachment_url: string | null
  is_read: boolean
  created_at: string
}

// ─── Subscriptions ───────────────────────────────────────────────────────────

export interface Subscription {
  id: string
  user_id: string
  plan_id: string
  plan_name: string
  user_type: 'aspirant' | 'agency'
  amount: number
  currency: string
  gst_amount: number
  total_amount: number
  status: SubscriptionStatus
  payment_method: string | null
  transaction_id: string | null
  gateway_status: string | null
  starts_at: string
  ends_at: string
  created_at: string
}

// ─── Notifications ───────────────────────────────────────────────────────────

export type NotificationType =
  | 'casting_call_alert'
  | 'application_update'
  | 'audition_scheduled'
  | 'audition_reminder'
  | 'profile_verified'
  | 'subscription_expiry'
  | 'payment_success'
  | 'payment_failure'
  | 'new_message'
  | 'trust_score_update'
  | 'system_announcement'

export interface Notification {
  id: string
  user_id: string
  type: NotificationType
  title: string
  message: string
  action_url: string | null
  is_read: boolean
  created_at: string
}

// ─── Reports & Complaints ────────────────────────────────────────────────────

export type ReportReason =
  | 'fraud'
  | 'impersonation'
  | 'fake_profile'
  | 'scam_casting'
  | 'harassment'
  | 'abusive_behavior'
  | 'suspicious_payment'
  | 'spam'
  | 'copyright_violation'
  | 'inappropriate_content'
  | 'other'

export type ReportStatus = 'pending' | 'investigating' | 'resolved' | 'dismissed'

export interface Report {
  id: string
  reported_by: string
  reported_user_id: string
  reason: ReportReason
  description: string
  evidence_urls: string[]
  status: ReportStatus
  admin_notes: string | null
  trust_score_deducted: number
  created_at: string
  resolved_at: string | null
}

// ─── Shared ──────────────────────────────────────────────────────────────────

export interface SocialLinks {
  instagram?: string
  facebook?: string
  youtube?: string
  twitter?: string
  linkedin?: string
  imdb?: string
  website?: string
}

export interface PaginationParams {
  page: number
  limit: number
}

export interface ApiResponse<T> {
  data: T | null
  error: string | null
  count?: number
}
