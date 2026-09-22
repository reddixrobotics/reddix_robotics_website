import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private pool: Pool;

  constructor() {
    const rawConnectionString = process.env.DATABASE_URL || '';
    const connectionString = PrismaService.getDirectDatabaseUrl(rawConnectionString);
    
    const pool = new Pool({ connectionString });
    const adapter = new PrismaPg(pool);
    
    super({ adapter });
    this.pool = pool;
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
    await this.pool.end();
  }

  /**
   * Decodes and extracts the underlying direct PostgreSQL connection string
   * if the URL is a prisma+postgres token containing an encoded api_key.
   */
  private static getDirectDatabaseUrl(url: string): string {
    if (url.startsWith('prisma+postgres://')) {
      try {
        const urlObj = new URL(url);
        const apiKey = urlObj.searchParams.get('api_key');
        if (apiKey) {
          const decoded = Buffer.from(apiKey, 'base64').toString('utf8');
          const parsed = JSON.parse(decoded);
          if (parsed && parsed.databaseUrl) {
            return parsed.databaseUrl;
          }
        }
      } catch (error) {
        // Fallback to original URL on parse failure
      }
    }
    return url;
  }
}
