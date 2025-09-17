export type MeResponse = {
  ok: boolean;
  user?: { id: string; email: string | null; fullName: string | null };
  profile?: {
    status: 'active' | 'inactive';
    role: string | null;
    department: string | null;
  };
  error?: string;
};
