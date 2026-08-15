import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
export declare class RedisService implements OnModuleInit, OnModuleDestroy {
    private memoryFallback;
    private readonly logger;
    onModuleInit(): void;
    onModuleDestroy(): void;
    private cleanFallback;
    get(key: string): Promise<string | null>;
    set(key: string, value: string, ttlSeconds?: number): Promise<string>;
    del(key: string | string[]): Promise<number>;
    keys(pattern: string): Promise<string[]>;
    getClient(): any;
}
