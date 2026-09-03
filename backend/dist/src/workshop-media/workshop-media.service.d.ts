import { PrismaService } from '../prisma/prisma.service';
import { UpsertWorkshopMediaDto } from './dto/workshop-media.dto';
export declare class WorkshopMediaService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        createdAt: Date;
        updatedAt: Date;
        title: string;
        posterUrl: string | null;
        mediaUrl: string | null;
        mediaType: string;
        altText: string | null;
        isActive: boolean;
        displayOrder: number;
        sectionKey: string;
    }[]>;
    findByKey(sectionKey: string): Promise<{
        createdAt: Date;
        updatedAt: Date;
        title: string;
        posterUrl: string | null;
        mediaUrl: string | null;
        mediaType: string;
        altText: string | null;
        isActive: boolean;
        displayOrder: number;
        sectionKey: string;
    }>;
    upsert(sectionKey: string, dto: UpsertWorkshopMediaDto): Promise<{
        createdAt: Date;
        updatedAt: Date;
        title: string;
        posterUrl: string | null;
        mediaUrl: string | null;
        mediaType: string;
        altText: string | null;
        isActive: boolean;
        displayOrder: number;
        sectionKey: string;
    }>;
    remove(sectionKey: string): Promise<{
        createdAt: Date;
        updatedAt: Date;
        title: string;
        posterUrl: string | null;
        mediaUrl: string | null;
        mediaType: string;
        altText: string | null;
        isActive: boolean;
        displayOrder: number;
        sectionKey: string;
    }>;
}
