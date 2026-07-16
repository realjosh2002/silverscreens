-- ============================================================
-- SilverScreens — Supabase Database Schema
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New query)
-- ============================================================

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─── ENUMS ───────────────────────────────────────────────────────────────────

DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('aspirant', 'agency', 'admin');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE verification_status AS ENUM ('pending', 'approved', 'rejected', 'suspended');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE subscription_status AS ENUM ('active', 'expired', 'cancelled', 'pending_payment');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE casting_call_status AS ENUM ('draft', 'active', 'closed', 'expired');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE application_status AS ENUM ('applied', 'in_review', 'shortlisted', 'rejected', 'selected', 'on_hold');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE audition_mode AS ENUM ('online', 'offline', 'both');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE audition_status AS ENUM ('scheduled', 'completed', 'cancelled', 'rescheduled');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE report_reason AS ENUM ('fraud', 'impersonation', 'fake_profile', 'scam_casting', 'harassment', 'abusive_behavior', 'suspicious_payment', 'spam', 'copyright_violation', 'inappropriate_content', 'other');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE report_status AS ENUM ('pending', 'investigating', 'resolved', 'dismissed');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE message_type AS ENUM ('text', 'image', 'video', 'audio', 'document');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE notification_type AS ENUM ('casting_call_alert', 'application_update', 'audition_scheduled', 'audition_reminder', 'profile_verified', 'subscription_expiry', 'payment_success', 'payment_failure', 'new_message', 'trust_score_update', 'system_announcement');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE gender_type AS ENUM ('Male', 'Female', 'Any', 'Others');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE audition_outcome AS ENUM ('selected', 'rejected', 'on_hold');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ─── PROFILES (extends auth.users) ───────────────────────────────────────────

CREATE TABLE public.profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role          user_role NOT NULL DEFAULT 'aspirant',
  profile_number TEXT UNIQUE,   -- A10245 or C20458, assigned after approval
  email         TEXT NOT NULL,
  phone         TEXT,
  email_verified BOOLEAN DEFAULT FALSE,
  phone_verified BOOLEAN DEFAULT FALSE,
  two_fa_enabled BOOLEAN DEFAULT FALSE,
  is_active     BOOLEAN DEFAULT TRUE,
  last_login_at TIMESTAMPTZ,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ─── ASPIRANT PROFILES ───────────────────────────────────────────────────────

CREATE TABLE public.aspirant_profiles (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id           UUID UNIQUE NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  profile_number    TEXT UNIQUE,
  title             TEXT,
  first_name        TEXT NOT NULL,
  last_name         TEXT NOT NULL,
  gender            gender_type,
  date_of_birth     DATE,
  address_line1     TEXT,
  address_line2     TEXT,
  city              TEXT,
  state             TEXT,
  pincode           TEXT,
  country           TEXT DEFAULT 'India',
  height_cm         NUMERIC(5,1),
  weight_kg         NUMERIC(5,1),
  hair_color        TEXT,
  eye_color         TEXT,
  body_tone         TEXT,
  body_type         TEXT,
  chest_size        NUMERIC(5,1),
  hip_size          NUMERIC(5,1),
  waist_size        NUMERIC(5,1),
  shoe_size         NUMERIC(4,1),
  languages         TEXT[] DEFAULT '{}',
  availability      TEXT[] DEFAULT '{}',
  about_me          TEXT CHECK (char_length(about_me) <= 1000),
  profile_image_url TEXT,
  category          TEXT,
  role              TEXT,
  experience_level  TEXT,
  social_links      JSONB DEFAULT '{}',
  resume_url        TEXT,
  intro_video_url   TEXT,
  verification_status verification_status DEFAULT 'pending',
  trust_score       INTEGER DEFAULT 100 CHECK (trust_score >= 0 AND trust_score <= 100),
  is_available      BOOLEAN DEFAULT TRUE,
  profile_completion INTEGER DEFAULT 0 CHECK (profile_completion >= 0 AND profile_completion <= 100),
  profile_views     INTEGER DEFAULT 0,
  search_appearances INTEGER DEFAULT 0,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

-- ─── ASPIRANT MEDIA ──────────────────────────────────────────────────────────

CREATE TABLE public.aspirant_media (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  aspirant_id   UUID NOT NULL REFERENCES public.aspirant_profiles(id) ON DELETE CASCADE,
  type          TEXT NOT NULL CHECK (type IN ('image', 'video')),
  url           TEXT NOT NULL,
  is_primary    BOOLEAN DEFAULT FALSE,
  order_index   INTEGER DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure max 10 images and 5 videos per aspirant
CREATE OR REPLACE FUNCTION check_media_limits()
RETURNS TRIGGER AS $$
DECLARE
  img_count INTEGER;
  vid_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO img_count FROM aspirant_media
    WHERE aspirant_id = NEW.aspirant_id AND type = 'image';
  SELECT COUNT(*) INTO vid_count FROM aspirant_media
    WHERE aspirant_id = NEW.aspirant_id AND type = 'video';

  IF NEW.type = 'image' AND img_count >= 10 THEN
    RAISE EXCEPTION 'Maximum 10 images allowed per aspirant';
  END IF;
  IF NEW.type = 'video' AND vid_count >= 5 THEN
    RAISE EXCEPTION 'Maximum 5 videos allowed per aspirant';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_media_limits
  BEFORE INSERT ON public.aspirant_media
  FOR EACH ROW EXECUTE FUNCTION check_media_limits();

-- ─── AGENCY PROFILES ─────────────────────────────────────────────────────────

CREATE TABLE public.agency_profiles (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id             UUID UNIQUE NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  profile_number      TEXT UNIQUE,
  company_name        TEXT NOT NULL,
  registration_number TEXT,
  gst_number          TEXT,
  pan_number          TEXT,
  years_of_experience INTEGER,
  website_url         TEXT,
  company_description TEXT,
  address_line1       TEXT,
  address_line2       TEXT,
  city                TEXT,
  state               TEXT,
  pincode             TEXT,
  country             TEXT DEFAULT 'India',
  logo_url            TEXT,
  banner_url          TEXT,
  social_links        JSONB DEFAULT '{}',
  contact_person_name TEXT NOT NULL,
  contact_email       TEXT NOT NULL,
  contact_phone       TEXT NOT NULL,
  show_phone          BOOLEAN DEFAULT FALSE,
  show_email          BOOLEAN DEFAULT FALSE,
  verification_status verification_status DEFAULT 'pending',
  trust_score         INTEGER DEFAULT 100 CHECK (trust_score >= 0 AND trust_score <= 100),
  profile_views       INTEGER DEFAULT 0,
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);

-- ─── CASTING CALLS ───────────────────────────────────────────────────────────

CREATE TABLE public.casting_calls (
  id                     UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agency_id              UUID NOT NULL REFERENCES public.agency_profiles(id) ON DELETE CASCADE,
  title                  TEXT NOT NULL,
  project_type           TEXT NOT NULL,
  role_name              TEXT NOT NULL,
  role_description       TEXT,
  eligibility_criteria   TEXT,
  gender_preference      gender_type DEFAULT 'Any',
  age_min                INTEGER,
  age_max                INTEGER,
  experience_level       TEXT,
  skills_required        TEXT[] DEFAULT '{}',
  languages_required     TEXT[] DEFAULT '{}',
  budget_min             NUMERIC(12,2),
  budget_max             NUMERIC(12,2),
  location               TEXT,
  audition_mode          audition_mode DEFAULT 'offline',
  audition_details       TEXT,
  compensation_details   TEXT,
  last_application_date  DATE NOT NULL,
  status                 casting_call_status DEFAULT 'draft',
  reference_media_urls   TEXT[] DEFAULT '{}',
  applications_count     INTEGER DEFAULT 0,
  views_count            INTEGER DEFAULT 0,
  bookmarks_count        INTEGER DEFAULT 0,
  created_at             TIMESTAMPTZ DEFAULT NOW(),
  updated_at             TIMESTAMPTZ DEFAULT NOW()
);

-- ─── APPLICATIONS ────────────────────────────────────────────────────────────

CREATE TABLE public.applications (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  casting_call_id  UUID NOT NULL REFERENCES public.casting_calls(id) ON DELETE CASCADE,
  aspirant_id      UUID NOT NULL REFERENCES public.aspirant_profiles(id) ON DELETE CASCADE,
  agency_id        UUID NOT NULL REFERENCES public.agency_profiles(id) ON DELETE CASCADE,
  status           application_status DEFAULT 'applied',
  applied_at       TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at      TIMESTAMPTZ,
  shortlisted_at   TIMESTAMPTZ,
  notes            TEXT,
  UNIQUE(casting_call_id, aspirant_id)
);

-- Auto-increment applications_count
CREATE OR REPLACE FUNCTION increment_applications_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE casting_calls SET applications_count = applications_count + 1
    WHERE id = NEW.casting_call_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_application_insert
  AFTER INSERT ON public.applications
  FOR EACH ROW EXECUTE FUNCTION increment_applications_count();

-- ─── AUDITIONS ───────────────────────────────────────────────────────────────

CREATE TABLE public.auditions (
  id                         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_id             UUID NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
  casting_call_id            UUID NOT NULL REFERENCES public.casting_calls(id),
  aspirant_id                UUID NOT NULL REFERENCES public.aspirant_profiles(id),
  agency_id                  UUID NOT NULL REFERENCES public.agency_profiles(id),
  scheduled_at               TIMESTAMPTZ NOT NULL,
  duration_minutes           INTEGER DEFAULT 30,
  mode                       audition_mode NOT NULL,
  meeting_link               TEXT,
  venue_details              TEXT,
  notes                      TEXT,
  status                     audition_status DEFAULT 'scheduled',
  safety_instructions_agreed BOOLEAN DEFAULT FALSE,
  outcome                    audition_outcome,
  created_at                 TIMESTAMPTZ DEFAULT NOW()
);

-- ─── SAVED CASTING CALLS ─────────────────────────────────────────────────────

CREATE TABLE public.saved_casting_calls (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  aspirant_id     UUID NOT NULL REFERENCES public.aspirant_profiles(id) ON DELETE CASCADE,
  casting_call_id UUID NOT NULL REFERENCES public.casting_calls(id) ON DELETE CASCADE,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(aspirant_id, casting_call_id)
);

-- ─── SHORTLISTED TALENTS ─────────────────────────────────────────────────────

CREATE TABLE public.shortlisted_talents (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agency_id    UUID NOT NULL REFERENCES public.agency_profiles(id) ON DELETE CASCADE,
  aspirant_id  UUID NOT NULL REFERENCES public.aspirant_profiles(id) ON DELETE CASCADE,
  notes        TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(agency_id, aspirant_id)
);

-- ─── MESSAGES ────────────────────────────────────────────────────────────────

CREATE TABLE public.conversations (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  participant_1_id  UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  participant_2_id  UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  last_message      TEXT,
  last_message_at   TIMESTAMPTZ,
  unread_count_1    INTEGER DEFAULT 0,
  unread_count_2    INTEGER DEFAULT 0,
  is_blocked        BOOLEAN DEFAULT FALSE,
  blocked_by        UUID REFERENCES public.profiles(id),
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(participant_1_id, participant_2_id)
);

CREATE TABLE public.messages (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id  UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id        UUID NOT NULL REFERENCES public.profiles(id),
  content          TEXT NOT NULL,
  type             message_type DEFAULT 'text',
  attachment_url   TEXT,
  is_read          BOOLEAN DEFAULT FALSE,
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

-- ─── NOTIFICATIONS ───────────────────────────────────────────────────────────

CREATE TABLE public.notifications (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type        notification_type NOT NULL,
  title       TEXT NOT NULL,
  message     TEXT NOT NULL,
  action_url  TEXT,
  is_read     BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─── SUBSCRIPTIONS ───────────────────────────────────────────────────────────

CREATE TABLE public.subscriptions (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id          UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  plan_id          TEXT NOT NULL,
  plan_name        TEXT NOT NULL,
  user_type        TEXT NOT NULL CHECK (user_type IN ('aspirant', 'agency')),
  amount           NUMERIC(10,2) NOT NULL,
  currency         TEXT DEFAULT 'INR',
  gst_amount       NUMERIC(10,2) DEFAULT 0,
  total_amount     NUMERIC(10,2) NOT NULL,
  status           subscription_status DEFAULT 'pending_payment',
  payment_method   TEXT,
  transaction_id   TEXT,
  gateway_status   TEXT,
  coupon_code      TEXT,
  discount_amount  NUMERIC(10,2) DEFAULT 0,
  starts_at        TIMESTAMPTZ,
  ends_at          TIMESTAMPTZ,
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

-- ─── REPORTS & COMPLAINTS ────────────────────────────────────────────────────

CREATE TABLE public.reports (
  id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reported_by          UUID NOT NULL REFERENCES public.profiles(id),
  reported_user_id     UUID NOT NULL REFERENCES public.profiles(id),
  reason               report_reason NOT NULL,
  description          TEXT NOT NULL,
  evidence_urls        TEXT[] DEFAULT '{}',
  status               report_status DEFAULT 'pending',
  admin_notes          TEXT,
  trust_score_deducted INTEGER DEFAULT 0,
  created_at           TIMESTAMPTZ DEFAULT NOW(),
  resolved_at          TIMESTAMPTZ
);

-- Auto-deduct 10 trust score points when complaint is confirmed
CREATE OR REPLACE FUNCTION auto_deduct_trust_score()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'resolved' AND OLD.status != 'resolved' THEN
    -- Deduct from aspirant profile if exists
    UPDATE aspirant_profiles
      SET trust_score = GREATEST(0, trust_score - 10)
      WHERE user_id = NEW.reported_user_id;
    -- Deduct from agency profile if exists
    UPDATE agency_profiles
      SET trust_score = GREATEST(0, trust_score - 10)
      WHERE user_id = NEW.reported_user_id;
    -- Record deduction
    NEW.trust_score_deducted := 10;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_report_resolved
  BEFORE UPDATE ON public.reports
  FOR EACH ROW EXECUTE FUNCTION auto_deduct_trust_score();

-- ─── CONTACT FORM ────────────────────────────────────────────────────────────

CREATE TABLE public.contact_messages (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL,
  email       TEXT NOT NULL,
  phone       TEXT,
  subject     TEXT NOT NULL,
  message     TEXT NOT NULL,
  is_resolved BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─── SUPPORT TICKETS ─────────────────────────────────────────────────────────

CREATE TYPE ticket_status AS ENUM ('open', 'in_progress', 'resolved', 'escalated', 'closed');
CREATE TYPE ticket_priority AS ENUM ('low', 'medium', 'high', 'urgent');

CREATE TABLE public.support_tickets (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  category      TEXT NOT NULL,
  subject       TEXT NOT NULL,
  description   TEXT NOT NULL,
  status        ticket_status DEFAULT 'open',
  priority      ticket_priority DEFAULT 'medium',
  assigned_to   UUID REFERENCES public.profiles(id),
  resolved_at   TIMESTAMPTZ,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.ticket_replies (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_id   UUID NOT NULL REFERENCES public.support_tickets(id) ON DELETE CASCADE,
  sender_id   UUID NOT NULL REFERENCES public.profiles(id),
  message     TEXT NOT NULL,
  is_admin    BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─── EMAIL TEMPLATES ─────────────────────────────────────────────────────────

CREATE TABLE public.email_templates (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL UNIQUE,
  subject     TEXT NOT NULL,
  body_html   TEXT NOT NULL,
  variables   TEXT[] DEFAULT '{}', -- e.g. ['{{name}}', '{{casting_title}}']
  is_active   BOOLEAN DEFAULT TRUE,
  created_by  UUID REFERENCES public.profiles(id),
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─── AUDIT LOGS ──────────────────────────────────────────────────────────────

CREATE TABLE public.audit_logs (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID REFERENCES public.profiles(id),
  action      TEXT NOT NULL,
  entity_type TEXT,
  entity_id   UUID,
  old_values  JSONB,
  new_values  JSONB,
  ip_address  INET,
  user_agent  TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─── SYSTEM SETTINGS ─────────────────────────────────────────────────────────

CREATE TABLE public.system_settings (
  key         TEXT PRIMARY KEY,
  value       TEXT NOT NULL,
  description TEXT,
  updated_by  UUID REFERENCES public.profiles(id),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Default settings
INSERT INTO public.system_settings (key, value, description) VALUES
  ('maintenance_mode', 'false', 'Put platform in maintenance mode'),
  ('registration_open', 'true', 'Allow new registrations'),
  ('gst_rate', '18', 'GST percentage applied to subscriptions'),
  ('max_images_per_aspirant', '10', 'Max portfolio images'),
  ('max_videos_per_aspirant', '5', 'Max portfolio videos'),
  ('trust_score_deduction', '10', 'Trust score deducted per confirmed complaint'),
  ('subscription_reminder_days', '7,3', 'Days before expiry to send reminders');

-- ─── UPDATED_AT TRIGGER ───────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER aspirant_profiles_updated_at BEFORE UPDATE ON aspirant_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER agency_profiles_updated_at BEFORE UPDATE ON agency_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER casting_calls_updated_at BEFORE UPDATE ON casting_calls FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER support_tickets_updated_at BEFORE UPDATE ON support_tickets FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER email_templates_updated_at BEFORE UPDATE ON email_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─── ROW LEVEL SECURITY ──────────────────────────────────────────────────────

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aspirant_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agency_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.casting_calls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.auditions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shortlisted_talents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_casting_calls ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read their own, admins can read all
CREATE POLICY "profiles_own_read" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_own_update" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Aspirant profiles: public approved profiles are readable by all logged-in users
CREATE POLICY "aspirant_profiles_public_read" ON aspirant_profiles
  FOR SELECT USING (verification_status = 'approved' OR user_id = auth.uid());
CREATE POLICY "aspirant_profiles_own_write" ON aspirant_profiles
  FOR ALL USING (user_id = auth.uid());

-- Agency profiles: public approved profiles readable by logged-in users
CREATE POLICY "agency_profiles_public_read" ON agency_profiles
  FOR SELECT USING (verification_status = 'approved' OR user_id = auth.uid());
CREATE POLICY "agency_profiles_own_write" ON agency_profiles
  FOR ALL USING (user_id = auth.uid());

-- Casting calls: active ones are public, drafts/closed only by owning agency
CREATE POLICY "casting_calls_public_read" ON casting_calls
  FOR SELECT USING (status = 'active' OR agency_id IN (SELECT id FROM agency_profiles WHERE user_id = auth.uid()));
CREATE POLICY "casting_calls_agency_write" ON casting_calls
  FOR ALL USING (agency_id IN (SELECT id FROM agency_profiles WHERE user_id = auth.uid()));

-- Applications: aspirant can read/write their own; agency can read for their casting calls
CREATE POLICY "applications_aspirant" ON applications
  FOR ALL USING (aspirant_id IN (SELECT id FROM aspirant_profiles WHERE user_id = auth.uid()));
CREATE POLICY "applications_agency_read" ON applications
  FOR SELECT USING (agency_id IN (SELECT id FROM agency_profiles WHERE user_id = auth.uid()));

-- Messages: participants only
CREATE POLICY "conversations_participants" ON conversations
  FOR ALL USING (participant_1_id = auth.uid() OR participant_2_id = auth.uid());
CREATE POLICY "messages_participants" ON messages
  FOR ALL USING (conversation_id IN (
    SELECT id FROM conversations WHERE participant_1_id = auth.uid() OR participant_2_id = auth.uid()
  ));

-- Notifications: own only
CREATE POLICY "notifications_own" ON notifications
  FOR ALL USING (user_id = auth.uid());

-- Subscriptions: own only
CREATE POLICY "subscriptions_own" ON subscriptions
  FOR ALL USING (user_id = auth.uid());

-- ─── INDEXES ─────────────────────────────────────────────────────────────────

CREATE INDEX idx_aspirant_profiles_verification ON aspirant_profiles(verification_status);
CREATE INDEX idx_aspirant_profiles_category ON aspirant_profiles(category);
CREATE INDEX idx_aspirant_profiles_city ON aspirant_profiles(city);
CREATE INDEX idx_agency_profiles_verification ON agency_profiles(verification_status);
CREATE INDEX idx_casting_calls_status ON casting_calls(status);
CREATE INDEX idx_casting_calls_agency ON casting_calls(agency_id);
CREATE INDEX idx_casting_calls_deadline ON casting_calls(last_application_date);
CREATE INDEX idx_applications_casting_call ON applications(casting_call_id);
CREATE INDEX idx_applications_aspirant ON applications(aspirant_id);
CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_notifications_user ON notifications(user_id, is_read);
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at DESC);
