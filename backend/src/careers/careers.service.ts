import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateJobDto, UpdateJobDto } from './dto/job.dto';
import { CreateInternshipDto, UpdateInternshipDto } from './dto/internship.dto';
import { CreateApplicationDto } from './dto/application.dto';
import { CareerStatus, ApplicationStatus } from '@prisma/client';

@Injectable()
export class CareersService {
  constructor(private readonly prisma: PrismaService) {}

  // ─── Job Operations ────────────────────────────────────────────────────────
  async createJob(dto: CreateJobDto) {
    return this.prisma.job.create({
      data: dto,
    });
  }

  async findAllJobs(adminView = false) {
    return this.prisma.job.findMany({
      where: adminView ? {} : { status: CareerStatus.PUBLISHED },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOneJob(id: string) {
    const job = await this.prisma.job.findUnique({
      where: { id },
      include: { applications: true },
    });
    if (!job) {
      throw new NotFoundException(`Job posting ${id} not found`);
    }
    return job;
  }

  async updateJob(id: string, dto: UpdateJobDto) {
    await this.findOneJob(id);
    return this.prisma.job.update({
      where: { id },
      data: dto,
    });
  }

  async removeJob(id: string) {
    await this.findOneJob(id);
    await this.prisma.job.delete({
      where: { id },
    });
    return { success: true, message: `Job posting ${id} has been deleted.` };
  }

  // ─── Internship Operations ──────────────────────────────────────────────────
  async createInternship(dto: CreateInternshipDto) {
    return this.prisma.internship.create({
      data: dto,
    });
  }

  async findAllInternships(adminView = false) {
    return this.prisma.internship.findMany({
      where: adminView ? {} : { status: CareerStatus.PUBLISHED },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOneInternship(id: string) {
    const internship = await this.prisma.internship.findUnique({
      where: { id },
      include: { applications: true },
    });
    if (!internship) {
      throw new NotFoundException(`Internship posting ${id} not found`);
    }
    return internship;
  }

  async updateInternship(id: string, dto: UpdateInternshipDto) {
    await this.findOneInternship(id);
    return this.prisma.internship.update({
      where: { id },
      data: dto,
    });
  }

  async removeInternship(id: string) {
    await this.findOneInternship(id);
    await this.prisma.internship.delete({
      where: { id },
    });
    return { success: true, message: `Internship posting ${id} has been deleted.` };
  }

  // ─── Application Operations ─────────────────────────────────────────────────
  async createApplication(dto: CreateApplicationDto) {
    if (dto.type === 'JOB') {
      if (!dto.jobId) {
        throw new BadRequestException('jobId is required for type JOB');
      }
      const job = await this.prisma.job.findUnique({ where: { id: dto.jobId } });
      if (!job || job.status !== CareerStatus.PUBLISHED) {
        throw new BadRequestException('Job posting is not active or does not exist');
      }
    } else if (dto.type === 'INTERNSHIP') {
      if (!dto.internshipId) {
        throw new BadRequestException('internshipId is required for type INTERNSHIP');
      }
      const internship = await this.prisma.internship.findUnique({ where: { id: dto.internshipId } });
      if (!internship || internship.status !== CareerStatus.PUBLISHED) {
        throw new BadRequestException('Internship posting is not active or does not exist');
      }
    }

    const existingApplication = await this.prisma.application.findFirst({
      where: {
        email: dto.email,
        jobId: dto.type === 'JOB' ? dto.jobId : null,
        internshipId: dto.type === 'INTERNSHIP' ? dto.internshipId : null,
      }
    });

    if (existingApplication) {
      throw new BadRequestException(`You have already applied for this ${dto.type.toLowerCase()} using this email address.`);
    }

    return this.prisma.application.create({
      data: {
        type: dto.type,
        jobId: dto.type === 'JOB' ? dto.jobId : null,
        internshipId: dto.type === 'INTERNSHIP' ? dto.internshipId : null,
        name: dto.name,
        email: dto.email,
        phone: dto.phone,
        resumeUrl: dto.resumeUrl,
        coverLetter: dto.coverLetter || null,
        status: ApplicationStatus.RECEIVED,
      },
    });
  }

  async findAllApplications() {
    return this.prisma.application.findMany({
      include: {
        job: true,
        internship: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOneApplication(id: string) {
    const application = await this.prisma.application.findUnique({
      where: { id },
      include: {
        job: true,
        internship: true,
      },
    });
    if (!application) {
      throw new NotFoundException(`Application ${id} not found`);
    }
    return application;
  }

  async updateApplicationStatus(id: string, status: ApplicationStatus) {
    await this.findOneApplication(id);
    return this.prisma.application.update({
      where: { id },
      data: { status },
    });
  }
}
