import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { PublicProductsController, AdminProductsController } from './products.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  providers: [ProductsService],
  controllers: [PublicProductsController, AdminProductsController],
  exports: [ProductsService],
})
export class ProductsModule {}
