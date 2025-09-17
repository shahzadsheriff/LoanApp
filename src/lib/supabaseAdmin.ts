import { createClient } from '@supabase/supabase-js';

/**
 * Server-only Supabase admin client.
 * Uses the SERVICE ROLE key. Never import this in client components.
 */
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string
);
