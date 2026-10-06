import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getApiAdmin, getApiSession } from '@/lib/auth/utils';

// Mock next-auth
vi.mock('next-auth', () => ({
  getServerSession: vi.fn(),
}));

// Mock next/server response
vi.mock('next/server', () => ({
  NextResponse: {
    json: vi.fn().mockImplementation((body, init) => {
      return { body, status: init?.status };
    }),
  }
}));

import { getServerSession } from 'next-auth';

describe('RBAC Security Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('STUDENT cannot access admin API (403)', async () => {
    vi.mocked(getServerSession).mockResolvedValue({
      user: { id: 'user-1', role: 'STUDENT' },
      expires: '9999'
    } as any);

    const { session, errorResponse } = await getApiAdmin();
    expect(session).toBeNull();
    expect(errorResponse).toEqual({ body: { error: 'Forbidden' }, status: 403 });
  });

  it('Unauthenticated user cannot access protected API (401)', async () => {
    vi.mocked(getServerSession).mockResolvedValue(null);

    const { session, errorResponse } = await getApiSession();
    expect(session).toBeNull();
    expect(errorResponse).toEqual({ body: { error: 'Unauthorized' }, status: 401 });
  });

  it('ADMIN can access admin API', async () => {
    vi.mocked(getServerSession).mockResolvedValue({
      user: { id: 'admin-1', role: 'ADMIN' },
      expires: '9999'
    } as any);

    const { session, errorResponse } = await getApiAdmin();
    expect(errorResponse).toBeNull();
    expect((session?.user as any).role).toBe('ADMIN');
  });

  it('SUPER_ADMIN can access admin API', async () => {
    vi.mocked(getServerSession).mockResolvedValue({
      user: { id: 'super-1', role: 'SUPER_ADMIN' },
      expires: '9999'
    } as any);

    const { session, errorResponse } = await getApiAdmin();
    expect(errorResponse).toBeNull();
    expect((session?.user as any).role).toBe('SUPER_ADMIN');
  });
});
