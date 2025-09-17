import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../lib/supabaseAdmin';
import type { MeResponse } from '../../../types/domain';

/**
 * GET /api/me
 * Server route reads the caller from the Supabase access token, then joins:
 *   user_profiles -> roles -> departments
 * Returns role, department, and status for the logged-in user.
 */
export async function GET(req: Request) {
  const auth = req.headers.get('authorization') || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  if (!token)
    return NextResponse.json<MeResponse>(
      { ok: false, error: 'Missing token' },
      { status: 401 }
    );

  const { data: userData, error: userErr } = await supabaseAdmin.auth.getUser(
    token
  );
  if (userErr || !userData?.user) {
    return NextResponse.json<MeResponse>(
      { ok: false, error: 'Invalid token' },
      { status: 401 }
    );
  }

  const uid = userData.user.id;

  // Join user profile to role and department
  const { data: prof, error: pErr } = await supabaseAdmin
    .from('user_profiles')
    .select(
      'status, full_name, roles:role_id(name, departments:department_id(name))'
    )
    .eq('user_id', uid)
    .single();

  if (pErr) {
    return NextResponse.json<MeResponse>(
      { ok: false, error: pErr.message },
      { status: 400 }
    );
  }

  return NextResponse.json<MeResponse>({
    ok: true,
    user: {
      id: uid,
      email: userData.user.email,
      fullName: prof?.full_name ?? null,
    },
    profile: {
      status: (prof?.status as 'active' | 'inactive') ?? 'inactive',
      role: prof?.roles?.name ?? null,
      department: prof?.roles?.departments?.name ?? null,
    },
  });
}
