"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";

const DEFAULT_AVATAR = "https://i.pravatar.cc/200?img=12";

function getAuthClient(token: string) {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { global: { headers: { Authorization: "Bearer " + token } } }
  );
}

type AdminProfile = {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  designation: string;
  employeeId: string;
  avatarUrl: string;
  memberSince: string;
  lastLogin: string;
  twoFaEnabled: boolean;
};

type AdminProfileContextType = {
  profile: AdminProfile | null;
  loading: boolean;
  refreshProfile: () => Promise<void>;
  updateProfile: (updates: Partial<AdminProfile>) => void;
};

const defaultProfile: AdminProfile = {
  id: "",
  name: "Admin",
  firstName: "Admin",
  lastName: "",
  email: "admin@silverscreens.in",
  phone: "",
  designation: "Super Administrator",
  employeeId: "SS-ADM-001",
  avatarUrl: DEFAULT_AVATAR,
  memberSince: "—",
  lastLogin: "—",
  twoFaEnabled: false,
};

const AdminProfileContext = createContext<AdminProfileContextType>({
  profile: null,
  loading: true,
  refreshProfile: async function() {},
  updateProfile: function() {},
});

export function AdminProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshProfile = useCallback(async function() {
    setLoading(true);
    try {
      const stored = localStorage.getItem("ss_user");
      if (!stored) { setProfile(defaultProfile); setLoading(false); return; }

      const parsed = JSON.parse(stored);
      const uid   = parsed?.id || parsed?.user?.id || parsed?.userId;
      const token = parsed?.token;

      if (!uid || !token) { setProfile(defaultProfile); setLoading(false); return; }

      const client = getAuthClient(token);
      const { data, error } = await client
        .from("profiles")
        .select("id, name, email, phone, profile_number, two_fa_enabled, created_at, last_login_at, avatar_url")
        .eq("id", uid)
        .single();

      if (error || !data) { setProfile(defaultProfile); setLoading(false); return; }

      const nameParts = (data.name || "").trim().split(" ");
      const firstName = nameParts[0] || "Admin";
      const lastName  = nameParts.slice(1).join(" ") || "";

      setProfile({
        id:          data.id || "",
        name:        data.name || firstName,
        firstName,
        lastName,
        email:       data.email || "",
        phone:       data.phone || "",
        designation: "Super Administrator",
        employeeId:  data.profile_number || "SS-ADM-001",
        avatarUrl:   data.avatar_url || DEFAULT_AVATAR,
        memberSince: data.created_at
          ? new Date(data.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
          : "—",
        lastLogin: data.last_login_at
          ? new Date(data.last_login_at).toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })
          : "—",
        twoFaEnabled: data.two_fa_enabled || false,
      });
    } catch (err) {
      console.error("AdminProfileContext load error:", err);
      setProfile(defaultProfile);
    }
    setLoading(false);
  }, []);

  function updateProfile(updates: Partial<AdminProfile>) {
    setProfile(function(prev) {
      if (!prev) return prev;
      const next = { ...prev, ...updates };
      if (updates.firstName !== undefined || updates.lastName !== undefined) {
        next.name = ((updates.firstName ?? prev.firstName) + " " + (updates.lastName ?? prev.lastName)).trim();
      }
      return next;
    });
  }

  useEffect(function() { refreshProfile(); }, [refreshProfile]);

  return (
    <AdminProfileContext.Provider value={{ profile, loading, refreshProfile, updateProfile }}>
      {children}
    </AdminProfileContext.Provider>
  );
}

export function useAdminProfile() {
  return useContext(AdminProfileContext);
}