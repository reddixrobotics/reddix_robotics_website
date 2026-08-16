import { FeaturedProjectStatus } from '@prisma/client';
export declare class CreateFeaturedProjectDto {
    title: string;
    description: string;
    imageUrl: string;
    category: string;
    projectUrl?: string;
    status?: FeaturedProjectStatus;
}
export declare class UpdateFeaturedProjectDto {
    title?: string;
    description?: string;
    imageUrl?: string;
    category?: string;
    projectUrl?: string;
    status?: FeaturedProjectStatus;
}
