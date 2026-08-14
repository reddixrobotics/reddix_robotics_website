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
import { CareersService } from './careers.service';
import { CreateJobDto, UpdateJobDto } from './dto/job.dto';
import { CreateInternshipDto, UpdateInternshipDto } from './dto/internship.dto';
import { CreateApplicationDto, UpdateApplicationStatusDto } from './dto/application.dto';
import { AdminAuthGuard } from '../auth/guards/admin-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { AdminRole } from '@prisma/client';
import { CurrentSession } from '../auth/decorators/current-session.decorator';
import type { SessionData } from '../auth/session.service';
import { AuditLogService } from '../audit/audit-log.service';

// ─── Public Careers Controller ──────────────────────────────────────────────
@Controller('api/careers')
export class PublicCareersController {
  constructor(private readonly careersService: CareersService) {}

  @Get('jobs')
  async findAllJobs() {
    return this.careersService.findAllJobs(false);
  }

  @Get('jobs/:id')
  async findOneJob(@Param('id') id: string) {
    return this.careersService.findOneJob(id);
  }

  @Get('internships')
  async findAllInternships() {
    return this.careersService.findAllInternships(false);
  }

  @Get('internships/:id')
  async findOneInternship(@Param('id') id: string) {
    return this.careersService.findOneInternship(id);
  }

  @Post('apply')
  async apply(@Body() createApplicationDto: CreateApplicationDto) {
    return this.careersService.createApplication(createApplicationDto);
  }
}

// ─── Admin Careers Controller ───────────────────────────────────────────────
@Controller('api/admin/careers')
@UseGuards(AdminAuthGuard, RolesGuard)
export class AdminCareersController {
  constructor(
    private readonly careersService: CareersService,
    private readonly auditLogService: AuditLogService,
  ) {}

  // --- Jobs ---
  @Get('jobs')
  async findAllJobs() {
    return this.careersService.findAllJobs(true);
  }

  @Get('jobs/:id')
  async findOneJob(@Param('id') id: string) {
    return this.careersService.findOneJob(id);
  }

  @Post('jobs')
  @Roles(AdminRole.SUPER_ADMIN, AdminRole.ADMIN, AdminRole.CAREER_MANAGER)
  async createJob(
    @Body() createJobDto: CreateJobDto,
    @CurrentSession() session: SessionData,
    @Ip() ip: string,
    @Headers('user-agent') userAgent: string,
  ) {
    const job = await this.careersService.createJob(createJobDto);
    await this.auditLogService.logAction(
      session.adminId,
      'CREATE_JOB',
      'Job',
      job.id,
      ip,
      userAgent,
    );
    return job;
  }

  @Patch('jobs/:id')
  @Roles(AdminRole.SUPER_ADMIN, AdminRole.ADMIN, AdminRole.CAREER_MANAGER)
  async updateJob(
    @Param('id') id: string,
    @Body() updateJobDto: UpdateJobDto,
    @CurrentSession() session: SessionData,
    @Ip() ip: string,
    @Headers('user-agent') userAgent: string,
  ) {
    const job = await this.careersService.updateJob(id, updateJobDto);
    await this.auditLogService.logAction(
      session.adminId,
      'UPDATE_JOB',
      'Job',
      id,
      ip,
      userAgent,
    );
    return job;
  }

  @Delete('jobs/:id')
  @Roles(AdminRole.SUPER_ADMIN, AdminRole.ADMIN, AdminRole.CAREER_MANAGER)
  async removeJob(
    @Param('id') id: string,
    @CurrentSession() session: SessionData,
    @Ip() ip: string,
    @Headers('user-agent') userAgent: string,
  ) {
    const result = await this.careersService.removeJob(id);
    await this.auditLogService.logAction(
      session.adminId,
      'DELETE_JOB',
      'Job',
      id,
      ip,
      userAgent,
    );
    return result;
  }

  // --- Internships ---
  @Get('internships')
  async findAllInternships() {
    return this.careersService.findAllInternships(true);
  }

  @Get('internships/:id')
  async findOneInternship(@Param('id') id: string) {
    return this.careersService.findOneInternship(id);
  }

  @Post('internships')
  @Roles(AdminRole.SUPER_ADMIN, AdminRole.ADMIN, AdminRole.CAREER_MANAGER)
  async createInternship(
    @Body() createInternshipDto: CreateInternshipDto,
    @CurrentSession() session: SessionData,
    @Ip() ip: string,
    @Headers('user-agent') userAgent: string,
  ) {
    const internship = await this.careersService.createInternship(createInternshipDto);
    await this.auditLogService.logAction(
      session.adminId,
      'CREATE_INTERNSHIP',
      'Internship',
      internship.id,
      ip,
      userAgent,
    );
    return internship;
  }

  @Patch('internships/:id')
  @Roles(AdminRole.SUPER_ADMIN, AdminRole.ADMIN, AdminRole.CAREER_MANAGER)
  async updateInternship(
    @Param('id') id: string,
    @Body() updateInternshipDto: UpdateInternshipDto,
    @CurrentSession() session: SessionData,
    @Ip() ip: string,
    @Headers('user-agent') userAgent: string,
  ) {
    const internship = await this.careersService.updateInternship(id, updateInternshipDto);
    await this.auditLogService.logAction(
      session.adminId,
      'UPDATE_INTERNSHIP',
      'Internship',
      id,
      ip,
      userAgent,
    );
    return internship;
  }

  @Delete('internships/:id')
  @Roles(AdminRole.SUPER_ADMIN, AdminRole.ADMIN, AdminRole.CAREER_MANAGER)
  async removeInternship(
    @Param('id') id: string,
    @CurrentSession() session: SessionData,
    @Ip() ip: string,
    @Headers('user-agent') userAgent: string,
  ) {
    const result = await this.careersService.removeInternship(id);
    await this.auditLogService.logAction(
      session.adminId,
      'DELETE_INTERNSHIP',
      'Internship',
      id,
      ip,
      userAgent,
    );
    return result;
  }

  // --- Applications ---
  @Get('applications')
  @Roles(AdminRole.SUPER_ADMIN, AdminRole.ADMIN, AdminRole.CAREER_MANAGER)
  async findAllApplications() {
    return this.careersService.findAllApplications();
  }

  @Get('applications/:id')
  @Roles(AdminRole.SUPER_ADMIN, AdminRole.ADMIN, AdminRole.CAREER_MANAGER)
  async findOneApplication(@Param('id') id: string) {
    return this.careersService.findOneApplication(id);
  }

  @Patch('applications/:id/status')
  @Roles(AdminRole.SUPER_ADMIN, AdminRole.ADMIN, AdminRole.CAREER_MANAGER)
  @HttpCode(HttpStatus.OK)
  async updateApplicationStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateApplicationStatusDto,
    @CurrentSession() session: SessionData,
    @Ip() ip: string,
    @Headers('user-agent') userAgent: string,
  ) {
    const application = await this.careersService.updateApplicationStatus(id, updateStatusDto.status);
    await this.auditLogService.logAction(
      session.adminId,
      'UPDATE_APPLICATION_STATUS',
      'Application',
      id,
      ip,
      userAgent,
    );
    return application;
  }
}
