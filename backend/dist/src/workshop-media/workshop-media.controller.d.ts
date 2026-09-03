import { WorkshopMediaService } from './workshop-media.service';
import { UpsertWorkshopMediaDto } from './dto/workshop-media.dto';
export declare class PublicWorkshopMediaController {
    private readonly workshopMediaService;
    constructor(workshopMediaService: WorkshopMediaService);
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
    findOne(key: string): Promise<{
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
export declare class AdminWorkshopMediaController {
    private readonly workshopMediaService;
    constructor(workshopMediaService: WorkshopMediaService);
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
    upsert(key: string, dto: UpsertWorkshopMediaDto): Promise<{
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
    remove(key: string): Promise<{
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
