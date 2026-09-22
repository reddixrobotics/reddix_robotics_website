import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Ip,
  Headers,
} from '@nestjs/common';
import { ContractorsService } from './contractors.service';
import { CreateContractorDto, UpdateContractorDto } from './dto/contractor.dto';
import { AdminAuthGuard } from '../auth/guards/admin-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { AdminRole } from '@prisma/client';
import { CurrentSession } from '../auth/decorators/current-session.decorator';
import type { SessionData } from '../auth/session.service';
import { AuditLogService } from '../audit/audit-log.service';

// ─── Public Contractors Controller ───────────────────────────────────────────
@Controller('api/contractors')
export class PublicContractorsController {
  constructor(private readonly contractorsService: ContractorsService) {}

  @Get()
  async findAll() {
    return this.contractorsService.findAll();
  }
}

// ─── Admin Contractors Controller ────────────────────────────────────────────
@Controller('api/admin/contractors')
@UseGuards(AdminAuthGuard, RolesGuard)
export class AdminContractorsController {
  constructor(
    private readonly contractorsService: ContractorsService,
    private readonly auditLogService: AuditLogService,
  ) {}

  @Get()
  async findAll() {
    return this.contractorsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.contractorsService.findOne(id);
  }

  @Post()
  @Roles(AdminRole.SUPER_ADMIN, AdminRole.ADMIN, AdminRole.CONTENT_MANAGER)
  async create(
    @Body() createContractorDto: CreateContractorDto,
    @CurrentSession() session: SessionData,
    @Ip() ip: string,
    @Headers('user-agent') userAgent: string,
  ) {
    const contractor = await this.contractorsService.create(createContractorDto);
    await this.auditLogService.logAction(
      session.adminId,
      'CREATE_CONTRACTOR',
      'Contractor',
      contractor.id,
      ip,
      userAgent,
    );
    return contractor;
  }

  @Patch(':id')
  @Roles(AdminRole.SUPER_ADMIN, AdminRole.ADMIN, AdminRole.CONTENT_MANAGER)
  async update(
    @Param('id') id: string,
    @Body() updateContractorDto: UpdateContractorDto,
    @CurrentSession() session: SessionData,
    @Ip() ip: string,
    @Headers('user-agent') userAgent: string,
  ) {
    const contractor = await this.contractorsService.update(id, updateContractorDto);
    await this.auditLogService.logAction(
      session.adminId,
      'UPDATE_CONTRACTOR',
      'Contractor',
      id,
      ip,
      userAgent,
    );
    return contractor;
  }

  @Delete(':id')
  @Roles(AdminRole.SUPER_ADMIN, AdminRole.ADMIN, AdminRole.CONTENT_MANAGER)
  async remove(
    @Param('id') id: string,
    @CurrentSession() session: SessionData,
    @Ip() ip: string,
    @Headers('user-agent') userAgent: string,
  ) {
    const result = await this.contractorsService.remove(id);
    await this.auditLogService.logAction(
      session.adminId,
      'DELETE_CONTRACTOR',
      'Contractor',
      id,
      ip,
      userAgent,
    );
    return result;
  }
}
