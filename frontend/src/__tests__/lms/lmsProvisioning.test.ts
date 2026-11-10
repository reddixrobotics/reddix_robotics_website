import { describe, it, expect } from 'vitest';

export function generateTemporaryPassword(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let pass = 'Rx-';
  for (let i = 0; i < 8; i++) pass += chars.charAt(Math.floor(Math.random() * chars.length));
  return pass + '!';
}

export function buildProvisionPayload(email: string, password: string, courseId?: string, batchName?: string) {
  if (!email || !password) {
    throw new Error('Email and password are required');
  }
  return {
    email: email.trim().toLowerCase(),
    password,
    courseId: courseId || null,
    batchName: batchName?.trim() || 'Batch 1',
  };
}

export function filterMaterialsForStudentBatch(materials: any[], studentBatch: string): any[] {
  const target = (studentBatch || 'Batch 1').trim().toLowerCase();
  return materials.filter(m => {
    if (!m.batch_name || m.batch_name === 'ALL') return true;
    return m.batch_name.trim().toLowerCase() === target;
  });
}

describe('LMS Student Provisioning & Management', () => {
  it('generates secure temporary passwords adhering to Reddix Robotics LMS policy', () => {
    const password = generateTemporaryPassword();
    expect(password.startsWith('Rx-')).toBe(true);
    expect(password.endsWith('!')).toBe(true);
    expect(password.length).toBe(12);
  });

  it('correctly constructs student provisioning payload with assigned course and batch', () => {
    const payload = buildProvisionPayload('NewStudent@Reddix.com', 'Rx-Test1234!', 'course-ros2', 'Batch 2');
    expect(payload.email).toBe('newstudent@reddix.com');
    expect(payload.password).toBe('Rx-Test1234!');
    expect(payload.courseId).toBe('course-ros2');
    expect(payload.batchName).toBe('Batch 2');
  });

  it('defaults to Batch 1 when batchName is not explicitly provided', () => {
    const payload = buildProvisionPayload('student@test.com', 'Rx-Pass1234!');
    expect(payload.batchName).toBe('Batch 1');
    expect(payload.courseId).toBeNull();
  });

  it('throws error if required provisioning fields are missing', () => {
    expect(() => buildProvisionPayload('', 'pass')).toThrow();
    expect(() => buildProvisionPayload('test@test.com', '')).toThrow();
  });

  it('filters learning materials seamlessly so students only see their batch and common content', () => {
    const mockMaterials = [
      { id: 1, title: 'Course Syllabus', batch_name: 'ALL' },
      { id: 2, title: 'Batch 1 Live Q&A Recording', batch_name: 'Batch 1' },
      { id: 3, title: 'Batch 2 Live Q&A Recording', batch_name: 'Batch 2' },
      { id: 4, title: 'General Lab Guide', batch_name: null },
    ];

    const batch1Materials = filterMaterialsForStudentBatch(mockMaterials, 'Batch 1');
    expect(batch1Materials.map(m => m.id)).toEqual([1, 2, 4]);

    const batch2Materials = filterMaterialsForStudentBatch(mockMaterials, 'Batch 2');
    expect(batch2Materials.map(m => m.id)).toEqual([1, 3, 4]);
  });
});
