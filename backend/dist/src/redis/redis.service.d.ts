import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';
export declare class RedisService implements OnModuleInit, OnModuleDestroy {
    private client;
    onModuleInit(): void;
    onModuleDestroy(): void;
    get(key: string): Promise<string | null>;
    set(key: string, value: string, ttlSeconds?: number): Promise<string>;
    del(key: string | string[]): Promise<number>;
    keys(pattern: string): Promise<string[]>;
    getClient(): Redis;
}
