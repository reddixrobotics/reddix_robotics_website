import { Module } from '@nestjs/common';
import { SecurityService } from './security.service';
import { SecurityController } from './security.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  providers: [SecurityService],
  controllers: [SecurityController],
})
export class SecurityModule {}
