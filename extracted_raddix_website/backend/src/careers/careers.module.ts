import { Module } from '@nestjs/common';
import { CareersService } from './careers.service';
import { PublicCareersController, AdminCareersController } from './careers.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  providers: [CareersService],
  controllers: [PublicCareersController, AdminCareersController],
  exports: [CareersService],
})
export class CareersModule {}
