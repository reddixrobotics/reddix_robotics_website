import { PrismaService } from '../prisma/prisma.service';
export declare class AuditLogService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    logAction(adminId: string, action: string, resource: string, resourceId?: string, ipAddress?: string, userAgent?: string): Promise<void>;
}
