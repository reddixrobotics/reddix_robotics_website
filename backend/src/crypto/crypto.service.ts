import { Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';
import * as crypto from 'crypto';

@Injectable()
export class CryptoService {
  private readonly encryptionKey: Buffer;

  constructor() {
    const rawKey = process.env.TOTP_ENCRYPTION_KEY || '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';
    
    // Check if the key is a 64-character hex string (representing 32 bytes)
    if (rawKey.length === 64 && /^[0-9a-fA-F]+$/.test(rawKey)) {
      this.encryptionKey = Buffer.from(rawKey, 'hex');
    } else {
      // Fallback/safe measure: hash whatever secret is provided to get a robust 32-byte key
      this.encryptionKey = crypto.createHash('sha256').update(rawKey).digest();
    }
  }

  /**
   * Hash a password using argon2id.
   */
  async hashPassword(password: string): Promise<string> {
    return argon2.hash(password, {
      type: argon2.argon2id,
    });
  }

  /**
   * Verify a password against an argon2id hash.
   */
  async verifyPassword(hash: string, plain: string): Promise<boolean> {
    return argon2.verify(hash, plain);
  }

  /**
   * Encrypt a string using AES-256-GCM.
   * Returns a format of `iv:tag:ciphertext` in hex.
   */
  encrypt(plaintext: string): string {
    const iv = crypto.randomBytes(12); // GCM standard IV size is 12 bytes
    const cipher = crypto.createCipheriv('aes-256-gcm', this.encryptionKey, iv);
    
    let encrypted = cipher.update(plaintext, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const tag = cipher.getAuthTag();
    
    return `${iv.toString('hex')}:${tag.toString('hex')}:${encrypted}`;
  }

  /**
   * Decrypt a string using AES-256-GCM.
   * Expects input formatted as `iv:tag:ciphertext` in hex.
   */
  decrypt(encryptedPayload: string): string {
    const parts = encryptedPayload.split(':');
    if (parts.length !== 3) {
      throw new Error('Invalid encrypted payload format');
    }

    const [ivHex, tagHex, ciphertextHex] = parts;
    const iv = Buffer.from(ivHex, 'hex');
    const tag = Buffer.from(tagHex, 'hex');
    
    const decipher = crypto.createDecipheriv('aes-256-gcm', this.encryptionKey, iv);
    decipher.setAuthTag(tag);
    
    let decrypted = decipher.update(ciphertextHex, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  }
}
