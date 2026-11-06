import { describe, it, expect } from 'vitest';

interface ResourceAccessRequest {
  callerId: string;
  callerRole: string;
  resourceOwnerId: string;
  resourceType: 'Enrollment' | 'UserSession' | 'Order' | 'AdminSettings';
}

export function canAccessResource(req: ResourceAccessRequest): boolean {
  // Super admin and admin can access all resources
  if (['SUPER_ADMIN', 'ADMIN'].includes(req.callerRole)) {
    return true;
  }

  // Admin settings are strictly blocked for non-admins
  if (req.resourceType === 'AdminSettings') {
    return false;
  }

  // Row Level Security: A user can ONLY access their own resource
  return req.callerId === req.resourceOwnerId;
}

describe('Row Level Security (RLS) Isolation Rules', () => {
  const studentA = 'user-uuid-1111';
  const studentB = 'user-uuid-2222';
  const admin = 'admin-uuid-9999';

  it('allows student A to access their own enrollment', () => {
    const allowed = canAccessResource({
      callerId: studentA,
      callerRole: 'USER',
      resourceOwnerId: studentA,
      resourceType: 'Enrollment',
    });
    expect(allowed).toBe(true);
  });

  it('strictly blocks student A from accessing student B enrollment', () => {
    const allowed = canAccessResource({
      callerId: studentA,
      callerRole: 'USER',
      resourceOwnerId: studentB,
      resourceType: 'Enrollment',
    });
    expect(allowed).toBe(false);
  });

  it('strictly blocks student from accessing admin settings', () => {
    const allowed = canAccessResource({
      callerId: studentA,
      callerRole: 'USER',
      resourceOwnerId: admin,
      resourceType: 'AdminSettings',
    });
    expect(allowed).toBe(false);
  });

  it('allows administrator to access any user records for management', () => {
    const allowed = canAccessResource({
      callerId: admin,
      callerRole: 'ADMIN',
      resourceOwnerId: studentA,
      resourceType: 'Enrollment',
    });
    expect(allowed).toBe(true);
  });
});
