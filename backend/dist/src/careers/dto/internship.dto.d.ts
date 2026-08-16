import { CareerStatus } from '@prisma/client';
export declare class CreateInternshipDto {
    title: string;
    description: string;
    department: string;
    duration: string;
    stipend?: string;
    requirements: string[];
    skills?: string[];
    company?: string;
    location?: string;
    type?: string;
    applicationLink?: string;
    imageUrl?: string;
    deadline?: string;
    status?: CareerStatus;
}
export declare class UpdateInternshipDto {
    title?: string;
    description?: string;
    department?: string;
    duration?: string;
    stipend?: string;
    requirements?: string[];
    skills?: string[];
    company?: string;
    location?: string;
    type?: string;
    applicationLink?: string;
    imageUrl?: string;
    deadline?: string;
    status?: CareerStatus;
}
