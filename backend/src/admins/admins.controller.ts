import { Controller, Get, Post, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { AdminsService } from './admins.service';
import { CreateAdminDto } from './dto/admin.dto';
import { AdminAuthGuard } from '../auth/guards/admin-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { AdminRole } from '@prisma/client';
import { CurrentSession } from '../auth/decorators/current-session.decorator';
import type { SessionData } from '../auth/session.service';

@Controller('api/admin/admins')
@UseGuards(AdminAuthGuard, RolesGuard)
@Roles(AdminRole.SUPER_ADMIN) // Only Super Admins can manage other admins
export class AdminsController {
  constructor(private readonly adminsService: AdminsService) {}

  @Get()
  async findAll() {
    return this.adminsService.findAll();
  }

  @Post()
  async create(@Body() createAdminDto: CreateAdminDto) {
    return this.adminsService.create(createAdminDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @CurrentSession() session: SessionData) {
    return this.adminsService.remove(id, session.adminId);
  }
}
