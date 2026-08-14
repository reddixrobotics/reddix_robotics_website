import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateContractorDto, UpdateContractorDto } from './dto/contractor.dto';

@Injectable()
export class ContractorsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateContractorDto) {
    return this.prisma.contractor.create({
      data: dto,
    });
  }

  async findAll() {
    return this.prisma.contractor.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const contractor = await this.prisma.contractor.findUnique({
      where: { id },
    });
    if (!contractor) {
      throw new NotFoundException(`Contractor ${id} not found`);
    }
    return contractor;
  }

  async update(id: string, dto: UpdateContractorDto) {
    await this.findOne(id);
    return this.prisma.contractor.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.contractor.delete({
      where: { id },
    });
    return { success: true, message: `Contractor ${id} deleted successfully.` };
  }
}
