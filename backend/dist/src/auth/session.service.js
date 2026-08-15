"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const redis_service_1 = require("../redis/redis.service");
const crypto = __importStar(require("crypto"));
let SessionService = class SessionService {
    prisma;
    redis;
    SESSION_TTL = 24 * 60 * 60;
    constructor(prisma, redis) {
        this.prisma = prisma;
        this.redis = redis;
    }
    hashToken(token) {
        return crypto.createHash('sha256').update(token).digest('hex');
    }
    async createSession(adminId, role, authStatus, ipAddress, userAgent) {
        const token = crypto.randomBytes(32).toString('hex');
        const tokenHash = this.hashToken(token);
        const expiresAt = new Date(Date.now() + this.SESSION_TTL * 1000);
        const dbSession = await this.prisma.adminSession.create({
            data: {
                adminId,
                tokenHash,
                expiresAt,
                ipAddress,
                userAgent,
                authStatus,
            },
        });
        const session = {
            id: dbSession.id,
            adminId,
            role,
            authStatus,
            ipAddress,
            userAgent,
            createdAt: dbSession.createdAt.toISOString(),
            expiresAt: expiresAt.toISOString(),
        };
        await this.redis.set(`session:${token}`, JSON.stringify(session), this.SESSION_TTL);
        return { token, session };
    }
    async verifySession(token) {
        if (!token)
            return null;
        const cached = await this.redis.get(`session:${token}`);
        if (cached) {
            const session = JSON.parse(cached);
            if (new Date(session.expiresAt) > new Date()) {
                return session;
            }
            await this.invalidateSession(token);
            return null;
        }
        const tokenHash = this.hashToken(token);
        const dbSession = await this.prisma.adminSession.findUnique({
            where: { tokenHash },
            include: { admin: true },
        });
        if (!dbSession)
            return null;
        if (dbSession.expiresAt < new Date()) {
            await this.prisma.adminSession.delete({ where: { id: dbSession.id } });
            return null;
        }
        const session = {
            id: dbSession.id,
            adminId: dbSession.adminId,
            role: dbSession.admin.role,
            authStatus: dbSession.authStatus,
            ipAddress: dbSession.ipAddress || undefined,
            userAgent: dbSession.userAgent || undefined,
            createdAt: dbSession.createdAt.toISOString(),
            expiresAt: dbSession.expiresAt.toISOString(),
        };
        const remainingTtl = Math.max(0, Math.floor((dbSession.expiresAt.getTime() - Date.now()) / 1000));
        if (remainingTtl > 0) {
            await this.redis.set(`session:${token}`, JSON.stringify(session), remainingTtl);
        }
        return session;
    }
    async updateSession(token, data) {
        const session = await this.verifySession(token);
        if (!session)
            return null;
        const updatedSession = { ...session, ...data };
        const remainingTtl = Math.max(0, Math.floor((new Date(session.expiresAt).getTime() - Date.now()) / 1000));
        await this.redis.set(`session:${token}`, JSON.stringify(updatedSession), remainingTtl);
        if (data.authStatus) {
            const tokenHash = this.hashToken(token);
            await this.prisma.adminSession.update({
                where: { tokenHash },
                data: { authStatus: data.authStatus },
            });
        }
        return updatedSession;
    }
    async invalidateSession(token) {
        if (!token)
            return;
        await this.redis.del(`session:${token}`);
        const tokenHash = this.hashToken(token);
        try {
            await this.prisma.adminSession.delete({
                where: { tokenHash },
            });
        }
        catch (e) {
        }
    }
    async invalidateSessionById(adminId, id) {
        const session = await this.prisma.adminSession.findFirst({
            where: { id, adminId },
        });
        if (!session)
            return false;
        await this.prisma.adminSession.delete({ where: { id } });
        const keys = await this.redis.keys('session:*');
        for (const key of keys) {
            const data = await this.redis.get(key);
            if (data) {
                const cached = JSON.parse(data);
                if (cached.id === id) {
                    await this.redis.del(key);
                    break;
                }
            }
        }
        return true;
    }
    async listAdminSessions(adminId) {
        const dbSessions = await this.prisma.adminSession.findMany({
            where: {
                adminId,
                expiresAt: { gt: new Date() },
            },
            orderBy: { createdAt: 'desc' },
        });
        return dbSessions.map((s) => ({
            id: s.id,
            adminId: s.adminId,
            ipAddress: s.ipAddress || undefined,
            userAgent: s.userAgent || undefined,
            createdAt: s.createdAt.toISOString(),
            expiresAt: s.expiresAt.toISOString(),
        }));
    }
    async invalidateAllExcept(adminId, currentToken) {
        const currentTokenHash = this.hashToken(currentToken);
        const activeSessions = await this.prisma.adminSession.findMany({
            where: {
                adminId,
                tokenHash: { not: currentTokenHash },
            },
        });
        const keys = await this.redis.keys('session:*');
        for (const key of keys) {
            const data = await this.redis.get(key);
            if (data) {
                const cached = JSON.parse(data);
                if (cached.adminId === adminId && key !== `session:${currentToken}`) {
                    await this.redis.del(key);
                }
            }
        }
        await this.prisma.adminSession.deleteMany({
            where: {
                adminId,
                tokenHash: { not: currentTokenHash },
            },
        });
    }
    async invalidateAllSessions(adminId) {
        const keys = await this.redis.keys('session:*');
        for (const key of keys) {
            const data = await this.redis.get(key);
            if (data) {
                const cached = JSON.parse(data);
                if (cached.adminId === adminId) {
                    await this.redis.del(key);
                }
            }
        }
        await this.prisma.adminSession.deleteMany({
            where: { adminId },
        });
    }
};
exports.SessionService = SessionService;
exports.SessionService = SessionService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        redis_service_1.RedisService])
], SessionService);
//# sourceMappingURL=session.service.js.map