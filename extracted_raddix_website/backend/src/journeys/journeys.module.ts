import { Module } from '@nestjs/common';
import { AdminJourneysController, PublicJourneysController } from './journeys.controller';
import { JourneysService } from './journeys.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AuditLogModule } from '../audit/audit-log.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PrismaModule, AuditLogModule, AuthModule],
  controllers: [AdminJourneysController, PublicJourneysController],
  providers: [JourneysService]
})
export class JourneysModule {}
