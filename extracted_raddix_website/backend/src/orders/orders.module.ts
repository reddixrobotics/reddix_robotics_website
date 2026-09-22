import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { UserOrdersController } from './user-orders.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  providers: [OrdersService],
  controllers: [OrdersController, UserOrdersController],
  exports: [OrdersService],
})
export class OrdersModule {}
