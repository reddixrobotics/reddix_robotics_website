import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SessionService } from './session.service';
import { UserSessionService } from './user-session.service';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [MailModule],
  controllers: [AuthController],
  providers: [AuthService, SessionService, UserSessionService],
  exports: [AuthService, SessionService, UserSessionService],
})
export class AuthModule {}
