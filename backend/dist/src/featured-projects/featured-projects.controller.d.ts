import { FeaturedProjectsService } from './featured-projects.service';
import { CreateFeaturedProjectDto, UpdateFeaturedProjectDto } from './dto/featured-project.dto';
export declare class PublicFeaturedProjectsController {
    private readonly featuredProjectsService;
    constructor(featuredProjectsService: FeaturedProjectsService);
    findAll(): Promise<{
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
}
export declare class AdminFeaturedProjectsController {
    private readonly featuredProjectsService;
    constructor(featuredProjectsService: FeaturedProjectsService);
    findAll(): Promise<{
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
    create(createFeaturedProjectDto: CreateFeaturedProjectDto): Promise<{
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
    update(id: string, updateFeaturedProjectDto: UpdateFeaturedProjectDto): Promise<{
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
