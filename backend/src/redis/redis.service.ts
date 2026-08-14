import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: Redis;

  onModuleInit() {
    const host = process.env.REDIS_HOST || 'localhost';
    const port = parseInt(process.env.REDIS_PORT || '6379', 10);
    const password = process.env.REDIS_PASSWORD || undefined;

    this.client = new Redis({
      host,
      port,
      password: password === '' ? undefined : password,
      // Prevent crash if Redis server is down during init
      maxRetriesPerRequest: 3,
    });
  }

  onModuleDestroy() {
    this.client.disconnect();
  }

  /**
   * Get a value by key.
   */
  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  /**
   * Set a key to hold a string value with optional TTL (in seconds).
   */
  async set(key: string, value: string, ttlSeconds?: number): Promise<string> {
    if (ttlSeconds !== undefined && ttlSeconds > 0) {
      return this.client.set(key, value, 'EX', ttlSeconds);
    }
    return this.client.set(key, value);
  }

  /**
   * Delete one or more keys.
   */
  async del(key: string | string[]): Promise<number> {
    if (Array.isArray(key)) {
      if (key.length === 0) return 0;
      return this.client.del(...key);
    }
    return this.client.del(key);
  }

  /**
   * Find all keys matching a pattern.
   */
  async keys(pattern: string): Promise<string[]> {
    return this.client.keys(pattern);
  }

  /**
   * Directly expose client if custom commands are needed.
   */
  getClient(): Redis {
    return this.client;
  }
}
