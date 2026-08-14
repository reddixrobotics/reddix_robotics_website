import { CareerStatus } from '@prisma/client';
export declare class CreateInternshipDto {
    title: string;
    description: string;
    department: string;
    duration: string;
    stipend?: string;
    requirements: string[];
    status?: CareerStatus;
}
export declare class UpdateInternshipDto {
    title?: string;
    description?: string;
    department?: string;
    duration?: string;
    stipend?: string;
    requirements?: string[];
    status?: CareerStatus;
}
