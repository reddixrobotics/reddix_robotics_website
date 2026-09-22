import { Module } from '@nestjs/common';
import { UpcomingProjectsService } from './upcoming-projects.service';
import {
  PublicUpcomingProjectsController,
  AdminUpcomingProjectsController,
} from './upcoming-projects.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AuditLogModule } from '../audit/audit-log.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PrismaModule, AuditLogModule, AuthModule],
  controllers: [PublicUpcomingProjectsController, AdminUpcomingProjectsController],
  providers: [UpcomingProjectsService],
  exports: [UpcomingProjectsService],
})
export class UpcomingProjectsModule {}
