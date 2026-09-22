import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUpcomingProjectDto, UpdateUpcomingProjectDto } from './dto/upcoming-project.dto';

@Injectable()
export class UpcomingProjectsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.upcomingProject.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const project = await this.prisma.upcomingProject.findUnique({
      where: { id },
    });

    if (!project) {
      throw new NotFoundException(`UpcomingProject with ID ${id} not found`);
    }

    return project;
  }

  async create(createUpcomingProjectDto: CreateUpcomingProjectDto) {
    return this.prisma.upcomingProject.create({
      data: createUpcomingProjectDto,
    });
  }

  async update(id: string, updateUpcomingProjectDto: UpdateUpcomingProjectDto) {
    await this.findOne(id); // Check existence

    return this.prisma.upcomingProject.update({
      where: { id },
      data: updateUpcomingProjectDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id); // Check existence

    return this.prisma.upcomingProject.delete({
      where: { id },
    });
  }
}
