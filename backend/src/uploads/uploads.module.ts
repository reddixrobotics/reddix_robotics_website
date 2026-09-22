import { Module } from '@nestjs/common';
import { UploadsController } from './uploads.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule], // provides SessionService & UserSessionService needed by AdminAuthGuard
  controllers: [UploadsController],
})
export class UploadsModule {}
