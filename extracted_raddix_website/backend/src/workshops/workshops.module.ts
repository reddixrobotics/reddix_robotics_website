import { Module } from '@nestjs/common';
import { WorkshopsService } from './workshops.service';
import { PublicWorkshopsController, AdminWorkshopsController } from './workshops.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  providers: [WorkshopsService],
  controllers: [PublicWorkshopsController, AdminWorkshopsController],
  exports: [WorkshopsService],
})
export class WorkshopsModule {}
