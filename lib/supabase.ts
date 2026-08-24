// lib/supabase.ts

import { createClient } from '@supabase/supabase-js'

const supabaseUrl     = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// ✅ Client-side Supabase — safe for browser, use in all 'use client' components
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// ✅ Server-side Supabase — only created when the service key actually exists
// In the browser this key is undefined, so supabaseAdmin is null there
// In API routes (server), the key exists and it works fully
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

export const supabaseAdmin = supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : null