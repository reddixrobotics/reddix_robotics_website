import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuditLogService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Log critical administrative actions into the database AuditLog table.
   */
  async logAction(
    adminId: string,
    action: string,
    resource: string,
    resourceId?: string,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<void> {
    await this.prisma.auditLog.create({
      data: {
        adminId,
        action,
        resource,
        resourceId: resourceId || null,
        ipAddress: ipAddress || null,
        userAgent: userAgent || null,
      },
    });
  }
}
