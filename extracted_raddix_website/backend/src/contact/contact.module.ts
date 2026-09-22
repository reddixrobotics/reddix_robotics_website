import { Module } from '@nestjs/common';
import { ContactService } from './contact.service';
import { PublicContactController, AdminContactController } from './contact.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  providers: [ContactService],
  controllers: [PublicContactController, AdminContactController],
  exports: [ContactService],
})
export class ContactModule {}
