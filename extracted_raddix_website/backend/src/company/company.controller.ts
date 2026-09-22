import {
  Controller,
  Get,
  Patch,
  Body,
  UseGuards,
  Ip,
  Headers,
} from '@nestjs/common';
import { CompanyService } from './company.service';
import { UpdateCompanyInfoDto } from './dto/company.dto';
import { AdminAuthGuard } from '../auth/guards/admin-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { AdminRole } from '@prisma/client';
import { CurrentSession } from '../auth/decorators/current-session.decorator';
import type { SessionData } from '../auth/session.service';
import { AuditLogService } from '../audit/audit-log.service';

// ─── Public Company Controller ───────────────────────────────────────────────
@Controller('api/company')
export class PublicCompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Get()
  async getInfo() {
    return this.companyService.getInfo();
  }
}

// ─── Admin Company Controller ────────────────────────────────────────────────
@Controller('api/admin/company')
@UseGuards(AdminAuthGuard, RolesGuard)
export class AdminCompanyController {
  constructor(
    private readonly companyService: CompanyService,
    private readonly auditLogService: AuditLogService,
  ) {}

  @Get()
  async getInfo() {
    return this.companyService.getInfo();
  }

  @Patch()
  @Roles(AdminRole.SUPER_ADMIN, AdminRole.ADMIN)
  async update(
    @Body() updateDto: UpdateCompanyInfoDto,
    @CurrentSession() session: SessionData,
    @Ip() ip: string,
    @Headers('user-agent') userAgent: string,
  ) {
    const info = await this.companyService.updateInfo(updateDto);
    await this.auditLogService.logAction(
      session.adminId,
      'UPDATE_COMPANY_INFO',
      'CompanyInformation',
      info.id,
      ip,
      userAgent,
    );
    return info;
  }
}
