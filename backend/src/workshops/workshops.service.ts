import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWorkshopDto, UpdateWorkshopDto } from './dto/workshop.dto';
import { CreateRegistrationDto } from './dto/registration.dto';
import { WorkshopStatus, RegistrationStatus } from '@prisma/client';

@Injectable()
export class WorkshopsService {
  constructor(private readonly prisma: PrismaService) {}

  // ─── Workshop Operations ───────────────────────────────────────────────────
  async createWorkshop(dto: CreateWorkshopDto) {
    return this.prisma.workshop.create({
      data: {
        ...dto,
        date: new Date(dto.date),
      },
    });
  }

  async findAllWorkshops(adminView = false) {
    return this.prisma.workshop.findMany({
      where: adminView ? {} : { status: WorkshopStatus.PUBLISHED },
      orderBy: { date: 'asc' },
    });
  }

  async findOneWorkshop(id: string) {
    const workshop = await this.prisma.workshop.findUnique({
      where: { id },
      include: { registrations: true },
    });
    if (!workshop) {
      throw new NotFoundException(`Workshop ${id} not found`);
    }
    return workshop;
  }

  async updateWorkshop(id: string, dto: UpdateWorkshopDto) {
    await this.findOneWorkshop(id);
    return this.prisma.workshop.update({
      where: { id },
      data: {
        ...dto,
        date: dto.date ? new Date(dto.date) : undefined,
      },
    });
  }

  async removeWorkshop(id: string) {
    await this.findOneWorkshop(id);
    await this.prisma.workshop.delete({
      where: { id },
    });
    return { success: true, message: `Workshop ${id} has been deleted.` };
  }

  // ─── Registration Operations ────────────────────────────────────────────────
  async register(dto: CreateRegistrationDto) {
    const workshop = await this.prisma.workshop.findUnique({
      where: { id: dto.workshopId },
      include: { registrations: true },
    });

    if (!workshop || workshop.status !== WorkshopStatus.PUBLISHED) {
      throw new NotFoundException(`Workshop with ID ${dto.workshopId} not found or not active`);
    }

    // Capacity check
    const activeRegistrationsCount = workshop.registrations.filter(
      (r) => r.status === RegistrationStatus.CONFIRMED,
    ).length;

    if (activeRegistrationsCount >= workshop.capacity) {
      throw new BadRequestException('Workshop is fully booked');
    }

    return this.prisma.workshopRegistration.create({
      data: {
        workshopId: dto.workshopId,
        name: dto.name,
        email: dto.email,
        phone: dto.phone,
        status: RegistrationStatus.CONFIRMED,
      },
      include: { workshop: true },
    });
  }

  async findAllRegistrations() {
    return this.prisma.workshopRegistration.findMany({
      include: { workshop: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOneRegistration(id: string) {
    const registration = await this.prisma.workshopRegistration.findUnique({
      where: { id },
      include: { workshop: true },
    });
    if (!registration) {
      throw new NotFoundException(`Workshop registration ${id} not found`);
    }
    return registration;
  }

  async updateRegistrationStatus(id: string, status: RegistrationStatus) {
    await this.findOneRegistration(id);
    return this.prisma.workshopRegistration.update({
      where: { id },
      data: { status },
      include: { workshop: true },
    });
  }
}
