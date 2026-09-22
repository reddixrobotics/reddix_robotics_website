import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards } from '@nestjs/common';
import { FeaturedProjectsService } from './featured-projects.service';
import { CreateFeaturedProjectDto, UpdateFeaturedProjectDto } from './dto/featured-project.dto';
import { AdminAuthGuard } from '../auth/guards/admin-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

// Public API
@Controller('api/featured-projects')
export class PublicFeaturedProjectsController {
  constructor(private readonly featuredProjectsService: FeaturedProjectsService) {}

  @Get()
  findAll() {
    return this.featuredProjectsService.findAll(true); // onlyPublished = true
  }
}

// Admin API
@Controller('api/admin/featured-projects')
// @UseGuards(AdminAuthGuard, RolesGuard)
export class AdminFeaturedProjectsController {
  constructor(private readonly featuredProjectsService: FeaturedProjectsService) {}

  @Get()
  @Roles('SUPER_ADMIN', 'ADMIN')
  findAll() {
    return this.featuredProjectsService.findAll(false); // all projects
  }

  @Post()
  @Roles('SUPER_ADMIN', 'ADMIN')
  create(@Body() createFeaturedProjectDto: CreateFeaturedProjectDto) {
    console.log('RECEIVED DTO:', createFeaturedProjectDto);
    return this.featuredProjectsService.create(createFeaturedProjectDto);
  }

  @Put(':id')
  @Roles('SUPER_ADMIN', 'ADMIN')
  update(@Param('id') id: string, @Body() updateFeaturedProjectDto: UpdateFeaturedProjectDto) {
    return this.featuredProjectsService.update(id, updateFeaturedProjectDto);
  }

  @Delete(':id')
  @Roles('SUPER_ADMIN', 'ADMIN')
  remove(@Param('id') id: string) {
    return this.featuredProjectsService.remove(id);
  }
}
