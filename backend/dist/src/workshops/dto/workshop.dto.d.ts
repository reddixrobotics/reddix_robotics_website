import { WorkshopStatus } from '@prisma/client';
export declare class CreateWorkshopDto {
    title: string;
    description: string;
    date: string;
    time: string;
    duration: string;
    location: string;
    capacity: number;
    status?: WorkshopStatus;
}
export declare class UpdateWorkshopDto {
    title?: string;
    description?: string;
    date?: string;
    time?: string;
    duration?: string;
    location?: string;
    capacity?: number;
    status?: WorkshopStatus;
}
