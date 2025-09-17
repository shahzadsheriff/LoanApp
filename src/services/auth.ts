'use client';
import { supabase } from '../lib/supabaseClient';

/** Sign in with email/password using Supabase Auth. */
export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw new Error(error.message);
  return data.user;
}

/** Grab the current access token for calling server routes. */
export async function getAccessToken() {
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token || null;
}
