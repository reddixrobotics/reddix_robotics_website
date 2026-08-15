import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
export declare class ProductsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(filters: {
        search?: string;
        category?: string;
        minPrice?: number;
        maxPrice?: number;
        availability?: boolean;
    }): Promise<({
        images: {
            url: string;
            id: string;
            createdAt: Date;
            productId: string;
            isPrimary: boolean;
        }[];
    } & {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        category: string;
        description: string;
        price: number;
        features: string[];
        technicalSpecifications: import("@prisma/client/runtime/client").JsonValue | null;
        availability: boolean;
    })[]>;
    findOne(id: string): Promise<{
        images: {
            url: string;
            id: string;
            createdAt: Date;
            productId: string;
            isPrimary: boolean;
        }[];
    } & {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        category: string;
        description: string;
        price: number;
        features: string[];
        technicalSpecifications: import("@prisma/client/runtime/client").JsonValue | null;
        availability: boolean;
    }>;
    create(dto: CreateProductDto): Promise<({
        images: {
            url: string;
            id: string;
            createdAt: Date;
            productId: string;
            isPrimary: boolean;
        }[];
    } & {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        category: string;
        description: string;
        price: number;
        features: string[];
        technicalSpecifications: import("@prisma/client/runtime/client").JsonValue | null;
        availability: boolean;
    }) | null>;
    update(id: string, dto: UpdateProductDto): Promise<({
        images: {
            url: string;
            id: string;
            createdAt: Date;
            productId: string;
            isPrimary: boolean;
        }[];
    } & {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        category: string;
        description: string;
        price: number;
        features: string[];
        technicalSpecifications: import("@prisma/client/runtime/client").JsonValue | null;
        availability: boolean;
    }) | null>;
    remove(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
