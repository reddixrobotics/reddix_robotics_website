import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateJourneyDto, UpdateJourneyDto } from './dto/journey.dto';

@Injectable()
export class JourneysService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.journey.findMany({
      orderBy: { year: 'asc' },
    });
  }

  async findOne(id: string) {
    const journey = await this.prisma.journey.findUnique({
      where: { id },
    });
    if (!journey) {
      throw new NotFoundException(`Journey with ID ${id} not found`);
    }
    return journey;
  }

  async create(createJourneyDto: CreateJourneyDto) {
    return this.prisma.journey.create({
      data: createJourneyDto,
    });
  }

  async update(id: string, updateJourneyDto: UpdateJourneyDto) {
    await this.findOne(id);
    return this.prisma.journey.update({
      where: { id },
      data: updateJourneyDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.journey.delete({
      where: { id },
    });
  }
}
