'use client';
import { useState } from 'react';
import { signIn, getAccessToken } from '../../services/auth';
import type { MeResponse } from '../../types/domain';

/**
 * Simple login page.
 * - Only email/password (role is fetched from backend after login).
 * - On success, shows role + department; we’ll add routing next.
 */
export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [pwd, setPwd] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    try {
      setLoading(true);

      // 1) Sign in (client – Supabase Auth)
      await signIn(email.trim(), pwd);

      // 2) Get token and ask the server for role/department
      const token = await getAccessToken();
      if (!token) throw new Error('No session');

      const res = await fetch('/api/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data: MeResponse = await res.json();
      if (!data.ok) throw new Error(data.error || 'Failed to fetch profile');

      // 3) Respect status and show role
      if (data.profile?.status !== 'active') {
        setMsg('Your account is inactive. Please contact admin.');
        return;
      }

      setMsg(
        `Signed in as ${data.profile?.role} — ${data.profile?.department}`
      );

      // TODO: route by role, e.g.:
      // if (data.profile?.role === "RM") window.location.href = "/dashboard";
    } catch (err: any) {
      setMsg(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen grid place-items-center bg-gradient-to-br from-sky-50 via-white to-sky-100">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white shadow-xl p-6">
        <h1 className="text-xl font-semibold mb-1">Sign in</h1>
        <p className="text-sm text-slate-500 mb-4">
          Role comes from backend after login.
        </p>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-slate-700">Email</label>
            <input
              className="mt-1 w-full rounded-2xl border border-slate-300 px-3 py-2"
              type="email"
              placeholder="sali@bdb-bh.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-sm text-slate-700">Password</label>
            <input
              className="mt-1 w-full rounded-2xl border border-slate-300 px-3 py-2"
              type="password"
              placeholder="••••••••"
              value={pwd}
              onChange={(e) => setPwd(e.target.value)}
              required
              minLength={8}
            />
          </div>

          <button
            disabled={loading}
            className="w-full rounded-2xl bg-sky-600 px-4 py-2 font-medium text-white hover:bg-sky-700 disabled:opacity-60"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>

          {msg && <p className="text-sm text-slate-700">{msg}</p>}
        </form>
      </div>
    </div>
  );
}
