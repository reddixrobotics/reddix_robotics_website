import { PrismaService } from '../prisma/prisma.service';
import { CreateUpcomingProjectDto, UpdateUpcomingProjectDto } from './dto/upcoming-project.dto';
export declare class UpcomingProjectsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        id: string;
        description: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        title: string;
        team: string;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        description: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        title: string;
        team: string;
    }>;
    create(createUpcomingProjectDto: CreateUpcomingProjectDto): Promise<{
        id: string;
        description: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        title: string;
        team: string;
    }>;
    update(id: string, updateUpcomingProjectDto: UpdateUpcomingProjectDto): Promise<{
        id: string;
        description: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        title: string;
        team: string;
    }>;
    remove(id: string): Promise<{
        id: string;
        description: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        title: string;
        team: string;
    }>;
}
