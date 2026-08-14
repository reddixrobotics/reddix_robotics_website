"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CareersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let CareersService = class CareersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createJob(dto) {
        return this.prisma.job.create({
            data: dto,
        });
    }
    async findAllJobs(adminView = false) {
        return this.prisma.job.findMany({
            where: adminView ? {} : { status: client_1.CareerStatus.PUBLISHED },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOneJob(id) {
        const job = await this.prisma.job.findUnique({
            where: { id },
            include: { applications: true },
        });
        if (!job) {
            throw new common_1.NotFoundException(`Job posting ${id} not found`);
        }
        return job;
    }
    async updateJob(id, dto) {
        await this.findOneJob(id);
        return this.prisma.job.update({
            where: { id },
            data: dto,
        });
    }
    async removeJob(id) {
        await this.findOneJob(id);
        await this.prisma.job.delete({
            where: { id },
        });
        return { success: true, message: `Job posting ${id} has been deleted.` };
    }
    async createInternship(dto) {
        return this.prisma.internship.create({
            data: dto,
        });
    }
    async findAllInternships(adminView = false) {
        return this.prisma.internship.findMany({
            where: adminView ? {} : { status: client_1.CareerStatus.PUBLISHED },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOneInternship(id) {
        const internship = await this.prisma.internship.findUnique({
            where: { id },
            include: { applications: true },
        });
        if (!internship) {
            throw new common_1.NotFoundException(`Internship posting ${id} not found`);
        }
        return internship;
    }
    async updateInternship(id, dto) {
        await this.findOneInternship(id);
        return this.prisma.internship.update({
            where: { id },
            data: dto,
        });
    }
    async removeInternship(id) {
        await this.findOneInternship(id);
        await this.prisma.internship.delete({
            where: { id },
        });
        return { success: true, message: `Internship posting ${id} has been deleted.` };
    }
    async createApplication(dto) {
        if (dto.type === 'JOB') {
            if (!dto.jobId) {
                throw new common_1.BadRequestException('jobId is required for type JOB');
            }
            const job = await this.prisma.job.findUnique({ where: { id: dto.jobId } });
            if (!job || job.status !== client_1.CareerStatus.PUBLISHED) {
                throw new common_1.BadRequestException('Job posting is not active or does not exist');
            }
        }
        else if (dto.type === 'INTERNSHIP') {
            if (!dto.internshipId) {
                throw new common_1.BadRequestException('internshipId is required for type INTERNSHIP');
            }
            const internship = await this.prisma.internship.findUnique({ where: { id: dto.internshipId } });
            if (!internship || internship.status !== client_1.CareerStatus.PUBLISHED) {
                throw new common_1.BadRequestException('Internship posting is not active or does not exist');
            }
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
                status: client_1.ApplicationStatus.RECEIVED,
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
    async findOneApplication(id) {
        const application = await this.prisma.application.findUnique({
            where: { id },
            include: {
                job: true,
                internship: true,
            },
        });
        if (!application) {
            throw new common_1.NotFoundException(`Application ${id} not found`);
        }
        return application;
    }
    async updateApplicationStatus(id, status) {
        await this.findOneApplication(id);
        return this.prisma.application.update({
            where: { id },
            data: { status },
        });
    }
};
exports.CareersService = CareersService;
exports.CareersService = CareersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CareersService);
//# sourceMappingURL=careers.service.js.map