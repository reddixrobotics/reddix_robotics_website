import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private memoryFallback = new Map<string, { value: string; expiresAt: number | null }>();
  private readonly logger = new Logger(RedisService.name);

  onModuleInit() {
    this.logger.warn('Redis is disabled for local development. Using in-memory fallback.');
  }

  onModuleDestroy() {
    this.memoryFallback.clear();
  }

  private cleanFallback() {
    const now = Date.now();
    for (const [key, data] of this.memoryFallback.entries()) {
      if (data.expiresAt !== null && data.expiresAt < now) {
        this.memoryFallback.delete(key);
      }
    }
  }

  async get(key: string): Promise<string | null> {
    this.cleanFallback();
    const data = this.memoryFallback.get(key);
    if (!data) return null;
    if (data.expiresAt !== null && data.expiresAt < Date.now()) {
      this.memoryFallback.delete(key);
      return null;
    }
    return data.value;
  }

  async set(key: string, value: string, ttlSeconds?: number): Promise<string> {
    const expiresAt = ttlSeconds ? Date.now() + ttlSeconds * 1000 : null;
    this.memoryFallback.set(key, { value, expiresAt });
    return 'OK';
  }

  async del(key: string | string[]): Promise<number> {
    const keys = Array.isArray(key) ? key : [key];
    let deleted = 0;
    for (const k of keys) {
      if (this.memoryFallback.has(k)) {
        this.memoryFallback.delete(k);
        deleted++;
      }
    }
    return deleted;
  }

  async keys(pattern: string): Promise<string[]> {
    this.cleanFallback();
    if (pattern === '*') return Array.from(this.memoryFallback.keys());
    if (pattern.endsWith('*')) {
      const prefix = pattern.slice(0, -1);
      return Array.from(this.memoryFallback.keys()).filter(k => k.startsWith(prefix));
    }
    return this.memoryFallback.has(pattern) ? [pattern] : [];
  }

  getClient(): any {
    return null;
  }
}
