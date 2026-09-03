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
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { WorkshopsService } from './workshops.service';
import { CreateWorkshopDto, UpdateWorkshopDto } from './dto/workshop.dto';
import { CreateRegistrationDto, UpdateRegistrationStatusDto } from './dto/registration.dto';
import { AdminAuthGuard } from '../auth/guards/admin-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { AdminRole } from '@prisma/client';
import { CurrentSession } from '../auth/decorators/current-session.decorator';
import type { SessionData } from '../auth/session.service';
import { AuditLogService } from '../audit/audit-log.service';

// ─── Public Workshops Controller ─────────────────────────────────────────────
@Controller('api/workshops')
export class PublicWorkshopsController {
  constructor(private readonly workshopsService: WorkshopsService) {}

  @Get()
  async findAll() {
    return this.workshopsService.findAllWorkshops(false);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.workshopsService.findOneWorkshop(id);
  }

  @Post('register')
  async register(@Body() createRegistrationDto: CreateRegistrationDto) {
    return this.workshopsService.register(createRegistrationDto);
  }
}

// ─── Admin Workshops Controller ──────────────────────────────────────────────
@Controller('api/admin/workshops')
@UseGuards(AdminAuthGuard, RolesGuard)
export class AdminWorkshopsController {
  constructor(
    private readonly workshopsService: WorkshopsService,
    private readonly auditLogService: AuditLogService,
  ) {}

  // --- Workshops CRUD ---
  @Get()
  async findAllWorkshops() {
    return this.workshopsService.findAllWorkshops(true);
  }

  // --- Registrations ---
  @Get('registrations')
  @Roles(AdminRole.SUPER_ADMIN, AdminRole.ADMIN, AdminRole.CONTENT_MANAGER)
  async findAllRegistrations() {
    return this.workshopsService.findAllRegistrations();
  }

  @Get('registrations/:id')
  @Roles(AdminRole.SUPER_ADMIN, AdminRole.ADMIN, AdminRole.CONTENT_MANAGER)
  async findOneRegistration(@Param('id') id: string) {
    return this.workshopsService.findOneRegistration(id);
  }

  @Patch('registrations/:id/status')
  @Roles(AdminRole.SUPER_ADMIN, AdminRole.ADMIN, AdminRole.CONTENT_MANAGER)
  @HttpCode(HttpStatus.OK)
  async updateRegistrationStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateRegistrationStatusDto,
    @CurrentSession() session: SessionData,
    @Ip() ip: string,
    @Headers('user-agent') userAgent: string,
  ) {
    const registration = await this.workshopsService.updateRegistrationStatus(id, updateStatusDto.status);
    await this.auditLogService.logAction(
      session.adminId,
      'UPDATE_REGISTRATION_STATUS',
      'WorkshopRegistration',
      id,
      ip,
      userAgent,
    );
    return registration;
  }

  @Get(':id')
  async findOneWorkshop(@Param('id') id: string) {
    return this.workshopsService.findOneWorkshop(id);
  }

  @Post()
  @Roles(AdminRole.SUPER_ADMIN, AdminRole.ADMIN, AdminRole.CONTENT_MANAGER)
  async createWorkshop(
    @Body() createWorkshopDto: CreateWorkshopDto,
    @CurrentSession() session: SessionData,
    @Ip() ip: string,
    @Headers('user-agent') userAgent: string,
  ) {
    const workshop = await this.workshopsService.createWorkshop(createWorkshopDto);
    await this.auditLogService.logAction(
      session.adminId,
      'CREATE_WORKSHOP',
      'Workshop',
      workshop.id,
      ip,
      userAgent,
    );
    return workshop;
  }

  @Patch(':id')
  @Roles(AdminRole.SUPER_ADMIN, AdminRole.ADMIN, AdminRole.CONTENT_MANAGER)
  async updateWorkshop(
    @Param('id') id: string,
    @Body() updateWorkshopDto: UpdateWorkshopDto,
    @CurrentSession() session: SessionData,
    @Ip() ip: string,
    @Headers('user-agent') userAgent: string,
  ) {
    const workshop = await this.workshopsService.updateWorkshop(id, updateWorkshopDto);
    await this.auditLogService.logAction(
      session.adminId,
      'UPDATE_WORKSHOP',
      'Workshop',
      id,
      ip,
      userAgent,
    );
    return workshop;
  }

  @Delete(':id')
  @Roles(AdminRole.SUPER_ADMIN, AdminRole.ADMIN, AdminRole.CONTENT_MANAGER)
  async removeWorkshop(
    @Param('id') id: string,
    @CurrentSession() session: SessionData,
    @Ip() ip: string,
    @Headers('user-agent') userAgent: string,
  ) {
    const result = await this.workshopsService.removeWorkshop(id);
    await this.auditLogService.logAction(
      session.adminId,
      'DELETE_WORKSHOP',
      'Workshop',
      id,
      ip,
      userAgent,
    );
    return result;
  }
}
