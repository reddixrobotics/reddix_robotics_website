import { PrismaService } from '../prisma/prisma.service';
import { CreateJourneyDto, UpdateJourneyDto } from './dto/journey.dto';
export declare class JourneysService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        id: string;
        description: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        year: string;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        description: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        year: string;
    }>;
    create(createJourneyDto: CreateJourneyDto): Promise<{
        id: string;
        description: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        year: string;
    }>;
    update(id: string, updateJourneyDto: UpdateJourneyDto): Promise<{
        id: string;
        description: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        year: string;
    }>;
    remove(id: string): Promise<{
        id: string;
        description: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        year: string;
    }>;
}
