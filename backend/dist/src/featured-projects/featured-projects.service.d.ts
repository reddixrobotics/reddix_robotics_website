import { PrismaService } from '../prisma/prisma.service';
import { CreateFeaturedProjectDto, UpdateFeaturedProjectDto } from './dto/featured-project.dto';
export declare class FeaturedProjectsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateFeaturedProjectDto): Promise<{
        id: string;
        category: string;
        description: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.FeaturedProjectStatus;
        title: string;
        imageUrl: string;
        projectUrl: string | null;
    }>;
    findAll(onlyPublished?: boolean): Promise<{
        id: string;
        category: string;
        description: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.FeaturedProjectStatus;
        title: string;
        imageUrl: string;
        projectUrl: string | null;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        category: string;
        description: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.FeaturedProjectStatus;
        title: string;
        imageUrl: string;
        projectUrl: string | null;
    }>;
    update(id: string, dto: UpdateFeaturedProjectDto): Promise<{
        id: string;
        category: string;
        description: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.FeaturedProjectStatus;
        title: string;
        imageUrl: string;
        projectUrl: string | null;
    }>;
    remove(id: string): Promise<{
        id: string;
        category: string;
        description: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.FeaturedProjectStatus;
        title: string;
        imageUrl: string;
        projectUrl: string | null;
    }>;
}
