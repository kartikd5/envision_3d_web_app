import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

if (!supabaseUrl) {
  console.warn("Supabase NEXT_PUBLIC_SUPABASE_URL is missing.");
}

// Public client for client components & read operations
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server-only admin client for bypass operations (e.g. storage bucket uploads, admin updates)
export const supabaseAdmin = typeof window === "undefined" 
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      }
    })
  : supabase;
