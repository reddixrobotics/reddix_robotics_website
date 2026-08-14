import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Ip,
  Headers,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { AdminAuthGuard } from '../auth/guards/admin-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { AdminRole } from '@prisma/client';
import { CurrentSession } from '../auth/decorators/current-session.decorator';
import type { SessionData } from '../auth/session.service';
import { AuditLogService } from '../audit/audit-log.service';

@Controller('api/admin/payments')
@UseGuards(AdminAuthGuard, RolesGuard)
export class PaymentsController {
  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly auditLogService: AuditLogService,
  ) {}

  @Get()
  async findAll() {
    return this.paymentsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.paymentsService.findOne(id);
  }

  @Post()
  @Roles(AdminRole.SUPER_ADMIN, AdminRole.ADMIN, AdminRole.ORDER_MANAGER)
  async create(
    @Body() createPaymentDto: CreatePaymentDto,
    @CurrentSession() session: SessionData,
    @Ip() ip: string,
    @Headers('user-agent') userAgent: string,
  ) {
    const payment = await this.paymentsService.create(createPaymentDto);
    await this.auditLogService.logAction(
      session.adminId,
      'RECORD_PAYMENT',
      'Payment',
      payment.id,
      ip,
      userAgent,
    );
    return payment;
  }
}
