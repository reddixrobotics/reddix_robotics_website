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
exports.CompanyService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let CompanyService = class CompanyService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getInfo() {
        let info = await this.prisma.companyInformation.findFirst();
        if (!info) {
            info = await this.prisma.companyInformation.create({
                data: {
                    name: 'Reddix Robotics',
                    aboutContent: 'Reddix Robotics designs and deploys next-generation robotics systems.',
                    email: 'contact@reddixrobotics.com',
                    phone: '+91-9876543210',
                    address: '456 Robotic Avenue, Industrial Zone',
                    city: 'Bangalore',
                    state: 'Karnataka',
                    country: 'India',
                    latitude: 12.9716,
                    longitude: 77.5946,
                    socialLinks: {
                        linkedin: 'https://linkedin.com/company/reddix-robotics',
                        twitter: 'https://twitter.com/reddix_robotics',
                    },
                },
            });
        }
        return info;
    }
    async updateInfo(dto) {
        const info = await this.getInfo();
        return this.prisma.companyInformation.update({
            where: { id: info.id },
            data: dto,
        });
    }
};
exports.CompanyService = CompanyService;
exports.CompanyService = CompanyService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CompanyService);
//# sourceMappingURL=company.service.js.map