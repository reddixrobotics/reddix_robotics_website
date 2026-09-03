import {
  Controller,
  Get,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { WorkshopMediaService } from './workshop-media.service';
import { UpsertWorkshopMediaDto } from './dto/workshop-media.dto';
import { AdminAuthGuard } from '../auth/guards/admin-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { AdminRole } from '@prisma/client';

// ─── Public ───────────────────────────────────────────────────────────────────
@Controller('api/workshop-media')
export class PublicWorkshopMediaController {
  constructor(private readonly workshopMediaService: WorkshopMediaService) {}

  @Get()
  async findAll() {
    return this.workshopMediaService.findAll();
  }

  @Get(':key')
  async findOne(@Param('key') key: string) {
    return this.workshopMediaService.findByKey(key);
  }
}

// ─── Admin ────────────────────────────────────────────────────────────────────
@Controller('api/admin/workshop-media')
@UseGuards(AdminAuthGuard, RolesGuard)
export class AdminWorkshopMediaController {
  constructor(private readonly workshopMediaService: WorkshopMediaService) {}

  @Get()
  async findAll() {
    return this.workshopMediaService.findAll();
  }

  @Put(':key')
  @Roles(AdminRole.SUPER_ADMIN, AdminRole.ADMIN, AdminRole.CONTENT_MANAGER)
  async upsert(
    @Param('key') key: string,
    @Body() dto: UpsertWorkshopMediaDto,
  ) {
    return this.workshopMediaService.upsert(key, dto);
  }

  @Delete(':key')
  @Roles(AdminRole.SUPER_ADMIN, AdminRole.ADMIN, AdminRole.CONTENT_MANAGER)
  async remove(@Param('key') key: string) {
    return this.workshopMediaService.remove(key);
  }
}
