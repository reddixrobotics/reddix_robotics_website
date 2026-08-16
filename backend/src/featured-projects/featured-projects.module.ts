import { Module } from '@nestjs/common';
import { FeaturedProjectsService } from './featured-projects.service';
import { PublicFeaturedProjectsController, AdminFeaturedProjectsController } from './featured-projects.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [PublicFeaturedProjectsController, AdminFeaturedProjectsController],
  providers: [FeaturedProjectsService],
  exports: [FeaturedProjectsService],
})
export class FeaturedProjectsModule {}
