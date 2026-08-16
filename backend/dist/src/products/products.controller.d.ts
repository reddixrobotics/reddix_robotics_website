import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import type { SessionData } from '../auth/session.service';
import { AuditLogService } from '../audit/audit-log.service';
export declare class PublicProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    findAll(search?: string, category?: string, minPrice?: string, maxPrice?: string, availability?: string): Promise<({
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
}
export declare class AdminProductsController {
    private readonly productsService;
    private readonly auditLogService;
    constructor(productsService: ProductsService, auditLogService: AuditLogService);
    findAll(search?: string, category?: string, minPrice?: string, maxPrice?: string, availability?: string): Promise<({
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
    create(createProductDto: CreateProductDto, session: SessionData, ip: string, userAgent: string): Promise<{
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
    update(id: string, updateProductDto: UpdateProductDto, session: SessionData, ip: string, userAgent: string): Promise<({
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
    remove(id: string, session: SessionData, ip: string, userAgent: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
