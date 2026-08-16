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
exports.UpcomingProjectsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let UpcomingProjectsService = class UpcomingProjectsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll() {
        return this.prisma.upcomingProject.findMany({
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(id) {
        const project = await this.prisma.upcomingProject.findUnique({
            where: { id },
        });
        if (!project) {
            throw new common_1.NotFoundException(`UpcomingProject with ID ${id} not found`);
        }
        return project;
    }
    async create(createUpcomingProjectDto) {
        return this.prisma.upcomingProject.create({
            data: createUpcomingProjectDto,
        });
    }
    async update(id, updateUpcomingProjectDto) {
        await this.findOne(id);
        return this.prisma.upcomingProject.update({
            where: { id },
            data: updateUpcomingProjectDto,
        });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.upcomingProject.delete({
            where: { id },
        });
    }
};
exports.UpcomingProjectsService = UpcomingProjectsService;
exports.UpcomingProjectsService = UpcomingProjectsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UpcomingProjectsService);
//# sourceMappingURL=upcoming-projects.service.js.map