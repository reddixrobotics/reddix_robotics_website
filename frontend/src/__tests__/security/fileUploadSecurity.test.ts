import { describe, it, expect } from 'vitest';

const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'pdf', 'mp4', 'ppt', 'pptx', 'doc', 'docx'];
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

export function validateUploadFile(fileName: string, fileSize: number): { isValid: boolean; error?: string } {
  const ext = fileName.split('.').pop()?.toLowerCase() || '';
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    return { isValid: false, error: `File type .${ext} is not allowed for security reasons.` };
  }
  if (fileSize > MAX_FILE_SIZE) {
    return { isValid: false, error: 'File exceeds the maximum allowed upload size of 50MB.' };
  }
  return { isValid: true };
}

describe('File Upload Security Whitelist', () => {
  it('permits safe images, documents, and videos', () => {
    expect(validateUploadFile('profile.jpg', 1024 * 1024).isValid).toBe(true);
    expect(validateUploadFile('slides.pdf', 2 * 1024 * 1024).isValid).toBe(true);
    expect(validateUploadFile('demo.mp4', 15 * 1024 * 1024).isValid).toBe(true);
    expect(validateUploadFile('syllabus.pptx', 3 * 1024 * 1024).isValid).toBe(true);
  });

  it('strictly blocks dangerous executable, script, and web files', () => {
    expect(validateUploadFile('malicious.html', 1024).isValid).toBe(false);
    expect(validateUploadFile('script.js', 1024).isValid).toBe(false);
    expect(validateUploadFile('exploit.svg', 1024).isValid).toBe(false);
    expect(validateUploadFile('payload.exe', 1024).isValid).toBe(false);
    expect(validateUploadFile('shell.php', 1024).isValid).toBe(false);
  });

  it('rejects files exceeding the 50MB ceiling', () => {
    expect(validateUploadFile('huge_video.mp4', 60 * 1024 * 1024).isValid).toBe(false);
  });
});
