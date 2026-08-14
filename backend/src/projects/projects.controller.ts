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
import { ProjectsService } from './projects.service';
import { CreateProjectDto, UpdateProjectDto } from './dto/project.dto';
import { AdminAuthGuard } from '../auth/guards/admin-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { AdminRole } from '@prisma/client';
import { CurrentSession } from '../auth/decorators/current-session.decorator';
import type { SessionData } from '../auth/session.service';
import { AuditLogService } from '../audit/audit-log.service';

// ─── Public Projects Controller ──────────────────────────────────────────────
@Controller('api/projects')
export class PublicProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  async findAll() {
    return this.projectsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.projectsService.findOne(id);
  }
}

// ─── Admin Projects Controller ───────────────────────────────────────────────
@Controller('api/admin/projects')
@UseGuards(AdminAuthGuard, RolesGuard)
export class AdminProjectsController {
  constructor(
    private readonly projectsService: ProjectsService,
    private readonly auditLogService: AuditLogService,
  ) {}

  @Get()
  async findAll() {
    return this.projectsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.projectsService.findOne(id);
  }

  @Post()
  @Roles(AdminRole.SUPER_ADMIN, AdminRole.ADMIN, AdminRole.CONTENT_MANAGER)
  async create(
    @Body() createProjectDto: CreateProjectDto,
    @CurrentSession() session: SessionData,
    @Ip() ip: string,
    @Headers('user-agent') userAgent: string,
  ) {
    const project = await this.projectsService.create(createProjectDto);
    await this.auditLogService.logAction(
      session.adminId,
      'CREATE_PROJECT',
      'Project',
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
    @Body() updateProjectDto: UpdateProjectDto,
    @CurrentSession() session: SessionData,
    @Ip() ip: string,
    @Headers('user-agent') userAgent: string,
  ) {
    const project = await this.projectsService.update(id, updateProjectDto);
    await this.auditLogService.logAction(
      session.adminId,
      'UPDATE_PROJECT',
      'Project',
      id,
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
    const result = await this.projectsService.remove(id);
    await this.auditLogService.logAction(
      session.adminId,
      'DELETE_PROJECT',
      'Project',
      id,
      ip,
      userAgent,
    );
    return result;
  }
}
