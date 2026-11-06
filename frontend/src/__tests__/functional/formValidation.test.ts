import { describe, it, expect } from 'vitest';

export function validateEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

export function validatePassword(password: string): { isValid: boolean; reason?: string } {
  if (password.length < 8) {
    return { isValid: false, reason: 'Password must be at least 8 characters long' };
  }
  return { isValid: true };
}

describe('Form Validation Utilities', () => {
  it('validates proper email formats', () => {
    expect(validateEmail('student@reddixrobotics.com')).toBe(true);
    expect(validateEmail('admin.test@gmail.com')).toBe(true);
    expect(validateEmail('invalid-email')).toBe(false);
    expect(validateEmail('@domain.com')).toBe(false);
    expect(validateEmail('user@')).toBe(false);
    expect(validateEmail('')).toBe(false);
  });

  it('enforces password security constraints', () => {
    expect(validatePassword('1234567').isValid).toBe(false);
    expect(validatePassword('short').reason).toContain('8 characters');
    expect(validatePassword('SecurePass123!').isValid).toBe(true);
    expect(validatePassword('Rx-Test1234!').isValid).toBe(true);
  });
});
