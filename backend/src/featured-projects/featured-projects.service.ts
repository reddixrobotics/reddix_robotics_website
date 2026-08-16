import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFeaturedProjectDto, UpdateFeaturedProjectDto } from './dto/featured-project.dto';

@Injectable()
export class FeaturedProjectsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateFeaturedProjectDto) {
    return this.prisma.featuredProject.create({
      data: dto,
    });
  }

  async findAll(onlyPublished = false) {
    return this.prisma.featuredProject.findMany({
      where: onlyPublished ? { status: 'PUBLISHED' } : undefined,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const project = await this.prisma.featuredProject.findUnique({
      where: { id },
    });
    if (!project) {
      throw new NotFoundException(`Featured project ${id} not found`);
    }
    return project;
  }

  async update(id: string, dto: UpdateFeaturedProjectDto) {
    await this.findOne(id); // verify exists
    return this.prisma.featuredProject.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    await this.findOne(id); // verify exists
    return this.prisma.featuredProject.delete({
      where: { id },
    });
  }
}
