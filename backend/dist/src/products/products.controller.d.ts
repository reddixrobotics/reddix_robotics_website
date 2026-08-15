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
}
export declare class AdminProductsController {
    private readonly productsService;
    private readonly auditLogService;
    constructor(productsService: ProductsService, auditLogService: AuditLogService);
    findAll(search?: string, category?: string, minPrice?: string, maxPrice?: string, availability?: string): Promise<({
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
    create(createProductDto: CreateProductDto, session: SessionData, ip: string, userAgent: string): Promise<{
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
    update(id: string, updateProductDto: UpdateProductDto, session: SessionData, ip: string, userAgent: string): Promise<({
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
    remove(id: string, session: SessionData, ip: string, userAgent: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
