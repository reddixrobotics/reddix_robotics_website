"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var RedisService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisService = void 0;
const common_1 = require("@nestjs/common");
let RedisService = RedisService_1 = class RedisService {
    memoryFallback = new Map();
    logger = new common_1.Logger(RedisService_1.name);
    onModuleInit() {
        this.logger.warn('Redis is disabled for local development. Using in-memory fallback.');
    }
    onModuleDestroy() {
        this.memoryFallback.clear();
    }
    cleanFallback() {
        const now = Date.now();
        for (const [key, data] of this.memoryFallback.entries()) {
            if (data.expiresAt !== null && data.expiresAt < now) {
                this.memoryFallback.delete(key);
            }
        }
    }
    async get(key) {
        this.cleanFallback();
        const data = this.memoryFallback.get(key);
        if (!data)
            return null;
        if (data.expiresAt !== null && data.expiresAt < Date.now()) {
            this.memoryFallback.delete(key);
            return null;
        }
        return data.value;
    }
    async set(key, value, ttlSeconds) {
        const expiresAt = ttlSeconds ? Date.now() + ttlSeconds * 1000 : null;
        this.memoryFallback.set(key, { value, expiresAt });
        return 'OK';
    }
    async del(key) {
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
    async keys(pattern) {
        this.cleanFallback();
        if (pattern === '*')
            return Array.from(this.memoryFallback.keys());
        if (pattern.endsWith('*')) {
            const prefix = pattern.slice(0, -1);
            return Array.from(this.memoryFallback.keys()).filter(k => k.startsWith(prefix));
        }
        return this.memoryFallback.has(pattern) ? [pattern] : [];
    }
    getClient() {
        return null;
    }
};
exports.RedisService = RedisService;
exports.RedisService = RedisService = RedisService_1 = __decorate([
    (0, common_1.Injectable)()
], RedisService);
//# sourceMappingURL=redis.service.js.map