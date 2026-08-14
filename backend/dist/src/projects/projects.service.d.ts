import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto, UpdateProjectDto } from './dto/project.dto';
export declare class ProjectsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateProjectDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        category: string;
        description: string;
        images: string[];
        status: string;
        date: string;
        technologies: string[];
    }>;
    findAll(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        category: string;
        description: string;
        images: string[];
        status: string;
        date: string;
        technologies: string[];
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        category: string;
        description: string;
        images: string[];
        status: string;
        date: string;
        technologies: string[];
    }>;
    update(id: string, dto: UpdateProjectDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        category: string;
        description: string;
        images: string[];
        status: string;
        date: string;
        technologies: string[];
    }>;
    remove(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
