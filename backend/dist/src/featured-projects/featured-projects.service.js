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
exports.FeaturedProjectsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let FeaturedProjectsService = class FeaturedProjectsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto) {
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
    async findOne(id) {
        const project = await this.prisma.featuredProject.findUnique({
            where: { id },
        });
        if (!project) {
            throw new common_1.NotFoundException(`Featured project ${id} not found`);
        }
        return project;
    }
    async update(id, dto) {
        await this.findOne(id);
        return this.prisma.featuredProject.update({
            where: { id },
            data: dto,
        });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.featuredProject.delete({
            where: { id },
        });
    }
};
exports.FeaturedProjectsService = FeaturedProjectsService;
exports.FeaturedProjectsService = FeaturedProjectsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], FeaturedProjectsService);
//# sourceMappingURL=featured-projects.service.js.map