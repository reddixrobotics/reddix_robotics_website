import { Module } from '@nestjs/common';
import { WorkshopMediaService } from './workshop-media.service';
import {
  PublicWorkshopMediaController,
  AdminWorkshopMediaController,
} from './workshop-media.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  providers: [WorkshopMediaService],
  controllers: [PublicWorkshopMediaController, AdminWorkshopMediaController],
  exports: [WorkshopMediaService],
})
export class WorkshopMediaModule {}
