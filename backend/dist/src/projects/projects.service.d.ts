import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto, UpdateProjectDto } from './dto/project.dto';
export declare class ProjectsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateProjectDto): Promise<{
        id: string;
        name: string;
        category: string;
        description: string;
        createdAt: Date;
        updatedAt: Date;
        images: string[];
        date: string;
        status: string;
        technologies: string[];
    }>;
    findAll(): Promise<{
        id: string;
        name: string;
        category: string;
        description: string;
        createdAt: Date;
        updatedAt: Date;
        images: string[];
        date: string;
        status: string;
        technologies: string[];
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        name: string;
        category: string;
        description: string;
        createdAt: Date;
        updatedAt: Date;
        images: string[];
        date: string;
        status: string;
        technologies: string[];
    }>;
    update(id: string, dto: UpdateProjectDto): Promise<{
        id: string;
        name: string;
        category: string;
        description: string;
        createdAt: Date;
        updatedAt: Date;
        images: string[];
        date: string;
        status: string;
        technologies: string[];
    }>;
    remove(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
