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
            productId: string;
            id: string;
            createdAt: Date;
            url: string;
            isPrimary: boolean;
        }[];
    } & {
        id: string;
        name: string;
        category: string;
        description: string;
        price: number;
        depositPercentage: number;
        stock: number;
        features: string[];
        technicalSpecifications: import("@prisma/client/runtime/client").JsonValue | null;
        availability: boolean;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    findOne(id: string): Promise<{
        images: {
            productId: string;
            id: string;
            createdAt: Date;
            url: string;
            isPrimary: boolean;
        }[];
    } & {
        id: string;
        name: string;
        category: string;
        description: string;
        price: number;
        depositPercentage: number;
        stock: number;
        features: string[];
        technicalSpecifications: import("@prisma/client/runtime/client").JsonValue | null;
        availability: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    create(dto: CreateProductDto): Promise<({
        images: {
            productId: string;
            id: string;
            createdAt: Date;
            url: string;
            isPrimary: boolean;
        }[];
    } & {
        id: string;
        name: string;
        category: string;
        description: string;
        price: number;
        depositPercentage: number;
        stock: number;
        features: string[];
        technicalSpecifications: import("@prisma/client/runtime/client").JsonValue | null;
        availability: boolean;
        createdAt: Date;
        updatedAt: Date;
    }) | null>;
    update(id: string, dto: UpdateProductDto): Promise<({
        images: {
            productId: string;
            id: string;
            createdAt: Date;
            url: string;
            isPrimary: boolean;
        }[];
    } & {
        id: string;
        name: string;
        category: string;
        description: string;
        price: number;
        depositPercentage: number;
        stock: number;
        features: string[];
        technicalSpecifications: import("@prisma/client/runtime/client").JsonValue | null;
        availability: boolean;
        createdAt: Date;
        updatedAt: Date;
    }) | null>;
    remove(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
