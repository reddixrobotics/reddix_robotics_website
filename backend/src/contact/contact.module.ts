import { Module } from '@nestjs/common';
import { ContactService } from './contact.service';
import { PublicContactController, AdminContactController } from './contact.controller';
import { AuthModule } from '../auth/auth.module';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [AuthModule, MailModule],
  providers: [ContactService],
  controllers: [PublicContactController, AdminContactController],
  exports: [ContactService],
})
export class ContactModule {}
