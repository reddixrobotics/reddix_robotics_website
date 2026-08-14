import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
  Ip,
  Headers,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { AdminAuthGuard } from '../auth/guards/admin-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { AdminRole } from '@prisma/client';
import { CurrentSession } from '../auth/decorators/current-session.decorator';
import type { SessionData } from '../auth/session.service';
import { AuditLogService } from '../audit/audit-log.service';

@Controller('api/admin/orders')
@UseGuards(AdminAuthGuard, RolesGuard)
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly auditLogService: AuditLogService,
  ) {}

  @Get()
  async findAll() {
    return this.ordersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @Post()
  @Roles(AdminRole.SUPER_ADMIN, AdminRole.ADMIN, AdminRole.ORDER_MANAGER)
  async create(
    @Body() createOrderDto: CreateOrderDto,
    @CurrentSession() session: SessionData,
    @Ip() ip: string,
    @Headers('user-agent') userAgent: string,
  ) {
    const order = await this.ordersService.create(createOrderDto);
    if (!order) {
      throw new BadRequestException('Order could not be created');
    }
    await this.auditLogService.logAction(
      session.adminId,
      'CREATE_ORDER',
      'Order',
      order.id,
      ip,
      userAgent,
    );
    return order;
  }

  @Patch(':id/status')
  @Roles(AdminRole.SUPER_ADMIN, AdminRole.ADMIN, AdminRole.ORDER_MANAGER)
  @HttpCode(HttpStatus.OK)
  async updateStatus(
    @Param('id') id: string,
    @Body() updateOrderStatusDto: UpdateOrderStatusDto,
    @CurrentSession() session: SessionData,
    @Ip() ip: string,
    @Headers('user-agent') userAgent: string,
  ) {
    const order = await this.ordersService.updateStatus(id, updateOrderStatusDto.status);
    await this.auditLogService.logAction(
      session.adminId,
      'UPDATE_ORDER_STATUS',
      'Order',
      id,
      ip,
      userAgent,
    );
    return order;
  }
}
