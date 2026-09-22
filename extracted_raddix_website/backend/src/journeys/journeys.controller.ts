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
import { JourneysService } from './journeys.service';
import { CreateJourneyDto, UpdateJourneyDto } from './dto/journey.dto';
import { AdminAuthGuard } from '../auth/guards/admin-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { AdminRole } from '@prisma/client';
import { CurrentSession } from '../auth/decorators/current-session.decorator';
import type { SessionData } from '../auth/session.service';
import { AuditLogService } from '../audit/audit-log.service';

@Controller('api/journeys')
export class PublicJourneysController {
  constructor(private readonly journeysService: JourneysService) {}

  @Get()
  async findAll() {
    return this.journeysService.findAll();
  }
}

@Controller('api/admin/journeys')
@UseGuards(AdminAuthGuard, RolesGuard)
export class AdminJourneysController {
  constructor(
    private readonly journeysService: JourneysService,
    private readonly auditLogService: AuditLogService,
  ) {}

  @Get()
  async findAll() {
    return this.journeysService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.journeysService.findOne(id);
  }

  @Post()
  @Roles(AdminRole.SUPER_ADMIN, AdminRole.ADMIN, AdminRole.CONTENT_MANAGER)
  async create(
    @Body() createJourneyDto: CreateJourneyDto,
    @CurrentSession() session: SessionData,
    @Ip() ip: string,
    @Headers('user-agent') userAgent: string,
  ) {
    const journey = await this.journeysService.create(createJourneyDto);
    await this.auditLogService.logAction(
      session.adminId,
      'CREATE_JOURNEY',
      'Journey',
      journey.id,
      ip,
      userAgent,
    );
    return journey;
  }

  @Patch(':id')
  @Roles(AdminRole.SUPER_ADMIN, AdminRole.ADMIN, AdminRole.CONTENT_MANAGER)
  async update(
    @Param('id') id: string,
    @Body() updateJourneyDto: UpdateJourneyDto,
    @CurrentSession() session: SessionData,
    @Ip() ip: string,
    @Headers('user-agent') userAgent: string,
  ) {
    const journey = await this.journeysService.update(id, updateJourneyDto);
    await this.auditLogService.logAction(
      session.adminId,
      'UPDATE_JOURNEY',
      'Journey',
      id,
      ip,
      userAgent,
    );
    return journey;
  }

  @Delete(':id')
  @Roles(AdminRole.SUPER_ADMIN, AdminRole.ADMIN, AdminRole.CONTENT_MANAGER)
  async remove(
    @Param('id') id: string,
    @CurrentSession() session: SessionData,
    @Ip() ip: string,
    @Headers('user-agent') userAgent: string,
  ) {
    const result = await this.journeysService.remove(id);
    await this.auditLogService.logAction(
      session.adminId,
      'DELETE_JOURNEY',
      'Journey',
      id,
      ip,
      userAgent,
    );
    return result;
  }
}
