import { createClient } from '@supabase/supabase-js';

/**
 * Browser Supabase client.
 * Uses public anon key (safe) + RLS on the database for protection.
 */
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
);
