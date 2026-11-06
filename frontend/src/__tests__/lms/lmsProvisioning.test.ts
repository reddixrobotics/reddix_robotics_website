import { describe, it, expect } from 'vitest';

export function generateTemporaryPassword(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let pass = 'Rx-';
  for (let i = 0; i < 8; i++) pass += chars.charAt(Math.floor(Math.random() * chars.length));
  return pass + '!';
}

export function buildProvisionPayload(email: string, password: string, courseId?: string) {
  if (!email || !password) {
    throw new Error('Email and password are required');
  }
  return {
    email: email.trim().toLowerCase(),
    password,
    courseId: courseId || null,
  };
}

describe('LMS Student Provisioning & Management', () => {
  it('generates secure temporary passwords adhering to Reddix Robotics LMS policy', () => {
    const password = generateTemporaryPassword();
    expect(password.startsWith('Rx-')).toBe(true);
    expect(password.endsWith('!')).toBe(true);
    expect(password.length).toBe(12);
  });

  it('correctly constructs student provisioning payload with assigned course', () => {
    const payload = buildProvisionPayload('NewStudent@Reddix.com', 'Rx-Test1234!', 'course-ros2');
    expect(payload.email).toBe('newstudent@reddix.com');
    expect(payload.password).toBe('Rx-Test1234!');
    expect(payload.courseId).toBe('course-ros2');
  });

  it('correctly constructs student provisioning payload without course', () => {
    const payload = buildProvisionPayload('student@test.com', 'Rx-Pass1234!');
    expect(payload.courseId).toBeNull();
  });

  it('throws error if required provisioning fields are missing', () => {
    expect(() => buildProvisionPayload('', 'pass')).toThrow();
    expect(() => buildProvisionPayload('test@test.com', '')).toThrow();
  });
});
