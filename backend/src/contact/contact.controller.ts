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
import { ContactService } from './contact.service';
import { CreateContactMessageDto, UpdateContactMessageStatusDto, ReplyContactMessageDto } from './dto/contact.dto';
import { AdminAuthGuard } from '../auth/guards/admin-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { AdminRole } from '@prisma/client';
import { CurrentSession } from '../auth/decorators/current-session.decorator';
import type { SessionData } from '../auth/session.service';
import { AuditLogService } from '../audit/audit-log.service';

// ─── Public Contact Controller ───────────────────────────────────────────────
@Controller('api/contact')
export class PublicContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  async create(@Body() createContactMessageDto: CreateContactMessageDto) {
    return this.contactService.create(createContactMessageDto);
  }
}

// ─── Admin Contact Controller ────────────────────────────────────────────────
@Controller('api/admin/contact')
@UseGuards(AdminAuthGuard, RolesGuard)
export class AdminContactController {
  constructor(
    private readonly contactService: ContactService,
    private readonly auditLogService: AuditLogService,
  ) {}

  @Get()
  async findAll() {
    return this.contactService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.contactService.findOne(id);
  }

  @Patch(':id/status')
  @Roles(AdminRole.SUPER_ADMIN, AdminRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  async updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateContactMessageStatusDto,
    @CurrentSession() session: SessionData,
    @Ip() ip: string,
    @Headers('user-agent') userAgent: string,
  ) {
    const message = await this.contactService.updateStatus(id, updateStatusDto.status);
    await this.auditLogService.logAction(
      session.adminId,
      'UPDATE_CONTACT_MESSAGE_STATUS',
      'ContactMessage',
      id,
      ip,
      userAgent,
    );
    return message;
  }

  @Post(':id/reply')
  @Roles(AdminRole.SUPER_ADMIN, AdminRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  async replyToMessage(
    @Param('id') id: string,
    @Body() replyDto: ReplyContactMessageDto,
    @CurrentSession() session: SessionData,
    @Ip() ip: string,
    @Headers('user-agent') userAgent: string,
  ) {
    const result = await this.contactService.replyToMessage(id, replyDto.message);
    await this.auditLogService.logAction(
      session.adminId,
      'REPLY_CONTACT_MESSAGE',
      'ContactMessage',
      id,
      ip,
      userAgent,
    );
    return result;
  }

  @Delete(':id')
  @Roles(AdminRole.SUPER_ADMIN, AdminRole.ADMIN)
  async remove(
    @Param('id') id: string,
    @CurrentSession() session: SessionData,
    @Ip() ip: string,
    @Headers('user-agent') userAgent: string,
  ) {
    const result = await this.contactService.remove(id);
    await this.auditLogService.logAction(
      session.adminId,
      'DELETE_CONTACT_MESSAGE',
      'ContactMessage',
      id,
      ip,
      userAgent,
    );
    return result;
  }
}
