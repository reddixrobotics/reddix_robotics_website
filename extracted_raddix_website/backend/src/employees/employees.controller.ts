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
import { EmployeesService } from './employees.service';
import { CreateEmployeeDto, UpdateEmployeeDto } from './dto/employee.dto';
import { AdminAuthGuard } from '../auth/guards/admin-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { AdminRole } from '@prisma/client';
import { CurrentSession } from '../auth/decorators/current-session.decorator';
import type { SessionData } from '../auth/session.service';
import { AuditLogService } from '../audit/audit-log.service';

// ─── Public Employees Controller ─────────────────────────────────────────────
@Controller('api/employees')
export class PublicEmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Get()
  async findAll() {
    return this.employeesService.findAll();
  }
}

// ─── Admin Employees Controller ──────────────────────────────────────────────
@Controller('api/admin/employees')
@UseGuards(AdminAuthGuard, RolesGuard)
export class AdminEmployeesController {
  constructor(
    private readonly employeesService: EmployeesService,
    private readonly auditLogService: AuditLogService,
  ) {}

  @Get()
  async findAll() {
    return this.employeesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.employeesService.findOne(id);
  }

  @Post()
  @Roles(AdminRole.SUPER_ADMIN, AdminRole.ADMIN, AdminRole.CONTENT_MANAGER)
  async create(
    @Body() createEmployeeDto: CreateEmployeeDto,
    @CurrentSession() session: SessionData,
    @Ip() ip: string,
    @Headers('user-agent') userAgent: string,
  ) {
    const employee = await this.employeesService.create(createEmployeeDto);
    await this.auditLogService.logAction(
      session.adminId,
      'CREATE_EMPLOYEE',
      'Employee',
      employee.id,
      ip,
      userAgent,
    );
    return employee;
  }

  @Patch(':id')
  @Roles(AdminRole.SUPER_ADMIN, AdminRole.ADMIN, AdminRole.CONTENT_MANAGER)
  async update(
    @Param('id') id: string,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
    @CurrentSession() session: SessionData,
    @Ip() ip: string,
    @Headers('user-agent') userAgent: string,
  ) {
    const employee = await this.employeesService.update(id, updateEmployeeDto);
    await this.auditLogService.logAction(
      session.adminId,
      'UPDATE_EMPLOYEE',
      'Employee',
      id,
      ip,
      userAgent,
    );
    return employee;
  }

  @Delete(':id')
  @Roles(AdminRole.SUPER_ADMIN, AdminRole.ADMIN, AdminRole.CONTENT_MANAGER)
  async remove(
    @Param('id') id: string,
    @CurrentSession() session: SessionData,
    @Ip() ip: string,
    @Headers('user-agent') userAgent: string,
  ) {
    const result = await this.employeesService.remove(id);
    await this.auditLogService.logAction(
      session.adminId,
      'DELETE_EMPLOYEE',
      'Employee',
      id,
      ip,
      userAgent,
    );
    return result;
  }
}
