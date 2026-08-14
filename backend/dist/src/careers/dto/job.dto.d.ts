import { CareerStatus } from '@prisma/client';
export declare class CreateJobDto {
    title: string;
    description: string;
    department: string;
    location: string;
    type: string;
    experienceLevel: string;
    requirements: string[];
    responsibilities: string[];
    status?: CareerStatus;
}
export declare class UpdateJobDto {
    title?: string;
    description?: string;
    department?: string;
    location?: string;
    type?: string;
    experienceLevel?: string;
    requirements?: string[];
    responsibilities?: string[];
    status?: CareerStatus;
}
