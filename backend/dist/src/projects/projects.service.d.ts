import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto, UpdateProjectDto } from './dto/project.dto';
export declare class ProjectsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateProjectDto): Promise<{
        name: string;
        date: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        category: string;
        description: string;
        images: string[];
        status: string;
        technologies: string[];
    }>;
    findAll(): Promise<{
        name: string;
        date: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        category: string;
        description: string;
        images: string[];
        status: string;
        technologies: string[];
    }[]>;
    findOne(id: string): Promise<{
        name: string;
        date: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        category: string;
        description: string;
        images: string[];
        status: string;
        technologies: string[];
    }>;
    update(id: string, dto: UpdateProjectDto): Promise<{
        name: string;
        date: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        category: string;
        description: string;
        images: string[];
        status: string;
        technologies: string[];
    }>;
    remove(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
