import { createClient, SupabaseClient } from '@supabase/supabase-js';

// These Vite env vars are injected at build time.
// VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are the ONLY
// Supabase credentials permitted in frontend source.
//
// The service-role key MUST NEVER appear here.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '[Supabase] VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY is not set. ' +
    'Supabase Auth features will not work. Set these in frontend/.env.staging.',
  );
}

/**
 * Browser-safe Supabase client.
 * Uses the publishable/anon key only.
 * Subject to RLS — cannot bypass policies.
 * Safe to use in React components.
 */
export const supabase: SupabaseClient = createClient(
  supabaseUrl ?? '',
  supabaseAnonKey ?? '',
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  },
);

export default supabase;
