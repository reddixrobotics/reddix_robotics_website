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
exports.JourneysService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let JourneysService = class JourneysService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll() {
        return this.prisma.journey.findMany({
            orderBy: { year: 'asc' },
        });
    }
    async findOne(id) {
        const journey = await this.prisma.journey.findUnique({
            where: { id },
        });
        if (!journey) {
            throw new common_1.NotFoundException(`Journey with ID ${id} not found`);
        }
        return journey;
    }
    async create(createJourneyDto) {
        return this.prisma.journey.create({
            data: createJourneyDto,
        });
    }
    async update(id, updateJourneyDto) {
        await this.findOne(id);
        return this.prisma.journey.update({
            where: { id },
            data: updateJourneyDto,
        });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.journey.delete({
            where: { id },
        });
    }
};
exports.JourneysService = JourneysService;
exports.JourneysService = JourneysService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], JourneysService);
//# sourceMappingURL=journeys.service.js.map