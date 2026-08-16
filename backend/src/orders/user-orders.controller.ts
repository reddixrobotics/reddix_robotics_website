import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UserAuthGuard } from '../auth/guards/user-auth.guard';
import { Request } from 'express';

interface RequestWithUser extends Request {
  user: {
    id: string;
    email: string;
    role: string;
  };
}

@Controller('api/orders')
@UseGuards(UserAuthGuard)
export class UserOrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  async getMyOrders(@Req() req: RequestWithUser) {
    return this.ordersService.findByUser(req.user.id);
  }

  @Post()
  async createMyOrder(@Req() req: RequestWithUser, @Body() createOrderDto: CreateOrderDto) {
    // Force the customer ID to be the authenticated user's ID
    createOrderDto.customerId = req.user.id;
    
    const order = await this.ordersService.create(createOrderDto);
    if (!order) {
      throw new BadRequestException('Order could not be created');
    }
    
    return order;
  }
}
