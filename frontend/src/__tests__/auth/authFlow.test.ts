import { describe, it, expect } from 'vitest';

export function extractUserRole(user: { app_metadata?: { role?: string }; user_metadata?: { role?: string } } | null): string {
  if (!user) return 'ANONYMOUS';
  return user.app_metadata?.role || user.user_metadata?.role || 'USER';
}

export function isUserAdmin(role: string): boolean {
  return ['SUPER_ADMIN', 'ADMIN', 'CONTENT_MANAGER', 'ORDER_MANAGER', 'CAREER_MANAGER'].includes(role);
}

export function isUserTeacher(role: string): boolean {
  return ['SUPER_ADMIN', 'ADMIN', 'TEACHER'].includes(role);
}

describe('Authentication & Role Validation', () => {
  it('returns ANONYMOUS when user is null', () => {
    expect(extractUserRole(null)).toBe('ANONYMOUS');
  });

  it('correctly extracts student USER role', () => {
    const studentUser = {
      app_metadata: { role: 'USER' },
      user_metadata: { name: 'Test Student' },
    };
    expect(extractUserRole(studentUser)).toBe('USER');
    expect(isUserAdmin('USER')).toBe(false);
    expect(isUserTeacher('USER')).toBe(false);
  });

  it('correctly identifies SUPER_ADMIN and ADMIN privileges', () => {
    const adminUser = {
      app_metadata: { role: 'ADMIN' },
    };
    const superAdminUser = {
      app_metadata: { role: 'SUPER_ADMIN' },
    };

    expect(extractUserRole(adminUser)).toBe('ADMIN');
    expect(isUserAdmin('ADMIN')).toBe(true);
    expect(isUserAdmin('SUPER_ADMIN')).toBe(true);
    expect(isUserTeacher('ADMIN')).toBe(true);
  });

  it('correctly identifies TEACHER role', () => {
    const teacherUser = {
      app_metadata: { role: 'TEACHER' },
    };
    expect(extractUserRole(teacherUser)).toBe('TEACHER');
    expect(isUserTeacher('TEACHER')).toBe(true);
    expect(isUserAdmin('TEACHER')).toBe(false);
  });
});
