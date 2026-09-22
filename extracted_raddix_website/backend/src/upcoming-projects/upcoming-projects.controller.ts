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
import { UpcomingProjectsService } from './upcoming-projects.service';
import { CreateUpcomingProjectDto, UpdateUpcomingProjectDto } from './dto/upcoming-project.dto';
import { AdminAuthGuard } from '../auth/guards/admin-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { AdminRole } from '@prisma/client';
import { CurrentSession } from '../auth/decorators/current-session.decorator';
import type { SessionData } from '../auth/session.service';
import { AuditLogService } from '../audit/audit-log.service';

// ─── Public Controller ────────────────────────────────────────────────────────
@Controller('api/upcoming-projects')
export class PublicUpcomingProjectsController {
  constructor(private readonly upcomingProjectsService: UpcomingProjectsService) {}

  @Get()
  async findAll() {
    return this.upcomingProjectsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.upcomingProjectsService.findOne(id);
  }
}

// ─── Admin Controller ─────────────────────────────────────────────────────────
@Controller('api/admin/upcoming-projects')
@UseGuards(AdminAuthGuard, RolesGuard)
export class AdminUpcomingProjectsController {
  constructor(
    private readonly upcomingProjectsService: UpcomingProjectsService,
    private readonly auditLogService: AuditLogService,
  ) {}

  @Get()
  @Roles(AdminRole.SUPER_ADMIN, AdminRole.ADMIN, AdminRole.CONTENT_MANAGER)
  async findAll() {
    return this.upcomingProjectsService.findAll();
  }

  @Get(':id')
  @Roles(AdminRole.SUPER_ADMIN, AdminRole.ADMIN, AdminRole.CONTENT_MANAGER)
  async findOne(@Param('id') id: string) {
    return this.upcomingProjectsService.findOne(id);
  }

  @Post()
  @Roles(AdminRole.SUPER_ADMIN, AdminRole.ADMIN, AdminRole.CONTENT_MANAGER)
  async create(
    @Body() createDto: CreateUpcomingProjectDto,
    @CurrentSession() session: SessionData,
    @Ip() ip: string,
    @Headers('user-agent') userAgent: string,
  ) {
    const project = await this.upcomingProjectsService.create(createDto);
    await this.auditLogService.logAction(
      session.adminId,
      'CREATE_UPCOMING_PROJECT',
      'UpcomingProject',
      project.id,
      ip,
      userAgent,
    );
    return project;
  }

  @Patch(':id')
  @Roles(AdminRole.SUPER_ADMIN, AdminRole.ADMIN, AdminRole.CONTENT_MANAGER)
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateUpcomingProjectDto,
    @CurrentSession() session: SessionData,
    @Ip() ip: string,
    @Headers('user-agent') userAgent: string,
  ) {
    const project = await this.upcomingProjectsService.update(id, updateDto);
    await this.auditLogService.logAction(
      session.adminId,
      'UPDATE_UPCOMING_PROJECT',
      'UpcomingProject',
      project.id,
      ip,
      userAgent,
    );
    return project;
  }

  @Delete(':id')
  @Roles(AdminRole.SUPER_ADMIN, AdminRole.ADMIN, AdminRole.CONTENT_MANAGER)
  async remove(
    @Param('id') id: string,
    @CurrentSession() session: SessionData,
    @Ip() ip: string,
    @Headers('user-agent') userAgent: string,
  ) {
    const result = await this.upcomingProjectsService.remove(id);
    await this.auditLogService.logAction(
      session.adminId,
      'DELETE_UPCOMING_PROJECT',
      'UpcomingProject',
      id,
      ip,
      userAgent,
    );
    return result;
  }
}
