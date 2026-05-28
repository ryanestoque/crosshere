import { create } from "zustand";
import { createClient } from "@/lib/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

export type Role = "student" | "clinic" | "parent" | "admin" | null;

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  role: Role;
  avatar_url: string | null;
  is_active: boolean;
}

interface AuthState {
  user: User | null;
  profile: Profile | null;
  role: Role;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  // Actions
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, fullName: string, role: Role) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  logout: () => Promise<void>; // alias for signOut
  resetPassword: (email: string) => Promise<{ error: string | null }>;
  setSession: (user: User | null, session: Session | null) => Promise<void>;
  setRole: (role: Role) => Promise<{ error: string | null }>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  role: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  signIn: async (email, password) => {
    const supabase = createClient();
    set({ isLoading: true, error: null });

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      set({ isLoading: false, error: error.message });
      return { error: error.message };
    }

    if (data.user) {
      // Fetch profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", data.user.id)
        .single();

      set({
        user: data.user,
        profile,
        role: (profile?.role ?? data.user.user_metadata?.role ?? "student") as Role,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    }

    return { error: null };
  },

  signUp: async (email, password, fullName, role) => {
    const supabase = createClient();
    set({ isLoading: true, error: null });

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: role ?? "student",
        },
      },
    });

    if (error) {
      set({ isLoading: false, error: error.message });
      return { error: error.message };
    }

    set({ isLoading: false });
    return { error: null };
  },

  signOut: async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    set({
      user: null,
      profile: null,
      role: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  },

  resetPassword: async (email) => {
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) return { error: error.message };
    return { error: null };
  },

  setSession: async (user, _session) => {
    if (!user) {
      set({ user: null, profile: null, role: null, isAuthenticated: false, isLoading: false });
      return;
    }

    const supabase = createClient();
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    set({
      user,
      profile,
      role: (profile?.role ?? user.user_metadata?.role ?? "student") as Role,
      isAuthenticated: true,
      isLoading: false,
    });
  },

  setRole: async (role) => {
    const supabase = createClient();
    const state = get();
    const user = state.user;
    
    if (!user) return { error: "Not authenticated" };

    set({ isLoading: true, error: null });

    // 1. Update user metadata
    const { error: metadataError } = await supabase.auth.updateUser({
      data: { role },
    });

    if (metadataError) {
      set({ isLoading: false, error: metadataError.message });
      return { error: metadataError.message };
    }

    // 2. Update profiles table
    const { error: profileError } = await supabase
      .from("profiles")
      .update({ role })
      .eq("id", user.id);

    if (profileError) {
      set({ isLoading: false, error: profileError.message });
      return { error: profileError.message };
    }

    // Fetch updated profile just in case
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    set({
      role,
      profile,
      isLoading: false,
    });

    return { error: null };
  },

  logout: async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    set({
      user: null,
      profile: null,
      role: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  },

  clearError: () => set({ error: null }),
}));
