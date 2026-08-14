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
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ProductsService = class ProductsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(filters) {
        const where = {};
        if (filters.search) {
            where.OR = [
                { name: { contains: filters.search, mode: 'insensitive' } },
                { description: { contains: filters.search, mode: 'insensitive' } },
            ];
        }
        if (filters.category) {
            where.category = filters.category;
        }
        if (filters.availability !== undefined) {
            where.availability = filters.availability;
        }
        if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
            where.price = {};
            if (filters.minPrice !== undefined) {
                where.price.gte = filters.minPrice;
            }
            if (filters.maxPrice !== undefined) {
                where.price.lte = filters.maxPrice;
            }
        }
        return this.prisma.product.findMany({
            where,
            include: {
                images: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(id) {
        const product = await this.prisma.product.findUnique({
            where: { id },
            include: {
                images: true,
            },
        });
        if (!product) {
            throw new common_1.NotFoundException(`Product with ID ${id} not found`);
        }
        return product;
    }
    async create(dto) {
        const existing = await this.prisma.product.findUnique({
            where: { id: dto.id },
        });
        if (existing) {
            throw new common_1.ConflictException(`Product with ID ${dto.id} already exists`);
        }
        const { images, ...productData } = dto;
        return this.prisma.$transaction(async (tx) => {
            const product = await tx.product.create({
                data: {
                    ...productData,
                    technicalSpecifications: productData.technicalSpecifications || undefined,
                },
            });
            if (images && images.length > 0) {
                await tx.productImage.createMany({
                    data: images.map((url, index) => ({
                        productId: product.id,
                        url,
                        isPrimary: index === 0,
                    })),
                });
            }
            return tx.product.findUnique({
                where: { id: product.id },
                include: { images: true },
            });
        });
    }
    async update(id, dto) {
        await this.findOne(id);
        const { images, ...productData } = dto;
        return this.prisma.$transaction(async (tx) => {
            const product = await tx.product.update({
                where: { id },
                data: {
                    ...productData,
                    technicalSpecifications: productData.technicalSpecifications || undefined,
                },
            });
            if (images !== undefined) {
                await tx.productImage.deleteMany({
                    where: { productId: id },
                });
                if (images.length > 0) {
                    await tx.productImage.createMany({
                        data: images.map((url, index) => ({
                            productId: id,
                            url,
                            isPrimary: index === 0,
                        })),
                    });
                }
            }
            return tx.product.findUnique({
                where: { id },
                include: { images: true },
            });
        });
    }
    async remove(id) {
        await this.findOne(id);
        await this.prisma.product.delete({
            where: { id },
        });
        return { success: true, message: `Product ${id} has been deleted.` };
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProductsService);
//# sourceMappingURL=products.service.js.map