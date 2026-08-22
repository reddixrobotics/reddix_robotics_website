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
exports.WorkshopsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let WorkshopsService = class WorkshopsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createWorkshop(dto) {
        return this.prisma.workshop.create({
            data: {
                ...dto,
                date: new Date(dto.date),
            },
        });
    }
    async findAllWorkshops(adminView = false) {
        return this.prisma.workshop.findMany({
            where: adminView ? {} : { status: client_1.WorkshopStatus.PUBLISHED },
            orderBy: { date: 'asc' },
        });
    }
    async findOneWorkshop(id) {
        const workshop = await this.prisma.workshop.findUnique({
            where: { id },
            include: { registrations: true },
        });
        if (!workshop) {
            throw new common_1.NotFoundException(`Workshop ${id} not found`);
        }
        return workshop;
    }
    async updateWorkshop(id, dto) {
        await this.findOneWorkshop(id);
        return this.prisma.workshop.update({
            where: { id },
            data: {
                ...dto,
                date: dto.date ? new Date(dto.date) : undefined,
            },
        });
    }
    async removeWorkshop(id) {
        await this.findOneWorkshop(id);
        await this.prisma.workshop.delete({
            where: { id },
        });
        return { success: true, message: `Workshop ${id} has been deleted.` };
    }
    async register(dto) {
        const workshop = await this.prisma.workshop.findUnique({
            where: { id: dto.workshopId },
            include: { registrations: true },
        });
        if (!workshop || workshop.status !== client_1.WorkshopStatus.PUBLISHED) {
            throw new common_1.NotFoundException(`Workshop with ID ${dto.workshopId} not found or not active`);
        }
        const activeRegistrationsCount = workshop.registrations.filter((r) => r.status === client_1.RegistrationStatus.CONFIRMED).length;
        if (activeRegistrationsCount >= workshop.capacity) {
            throw new common_1.BadRequestException('Workshop is fully booked');
        }
        const existingRegistration = await this.prisma.workshopRegistration.findFirst({
            where: {
                workshopId: dto.workshopId,
                email: dto.email,
            }
        });
        if (existingRegistration) {
            throw new common_1.BadRequestException('You have already registered for this workshop with this email address.');
        }
        return this.prisma.workshopRegistration.create({
            data: {
                workshopId: dto.workshopId,
                name: dto.name,
                email: dto.email,
                phone: dto.phone,
                status: client_1.RegistrationStatus.CONFIRMED,
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
    async findOneRegistration(id) {
        const registration = await this.prisma.workshopRegistration.findUnique({
            where: { id },
            include: { workshop: true },
        });
        if (!registration) {
            throw new common_1.NotFoundException(`Workshop registration ${id} not found`);
        }
        return registration;
    }
    async updateRegistrationStatus(id, status) {
        await this.findOneRegistration(id);
        return this.prisma.workshopRegistration.update({
            where: { id },
            data: { status },
            include: { workshop: true },
        });
    }
};
exports.WorkshopsService = WorkshopsService;
exports.WorkshopsService = WorkshopsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], WorkshopsService);
//# sourceMappingURL=workshops.service.js.map