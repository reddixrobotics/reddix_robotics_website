import { ApplicationType, ApplicationStatus } from '@prisma/client';
export declare class CreateApplicationDto {
    type: ApplicationType;
    jobId?: string;
    internshipId?: string;
    name: string;
    email: string;
    phone: string;
    resumeUrl: string;
    coverLetter?: string;
}
export declare class UpdateApplicationStatusDto {
    status: ApplicationStatus;
}
