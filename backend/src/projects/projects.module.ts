import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { PublicProjectsController, AdminProjectsController } from './projects.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  providers: [ProjectsService],
  controllers: [PublicProjectsController, AdminProjectsController],
  exports: [ProjectsService],
})
export class ProjectsModule {}
