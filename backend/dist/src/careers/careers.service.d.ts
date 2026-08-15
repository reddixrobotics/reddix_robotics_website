import { PrismaService } from '../prisma/prisma.service';
import { CreateJobDto, UpdateJobDto } from './dto/job.dto';
import { CreateInternshipDto, UpdateInternshipDto } from './dto/internship.dto';
import { CreateApplicationDto } from './dto/application.dto';
import { ApplicationStatus } from '@prisma/client';
export declare class CareersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createJob(dto: CreateJobDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        type: string;
        description: string;
        status: import("@prisma/client").$Enums.CareerStatus;
        title: string;
        department: string;
        location: string;
        experienceLevel: string;
        requirements: string[];
        responsibilities: string[];
    }>;
    findAllJobs(adminView?: boolean): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        type: string;
        description: string;
        status: import("@prisma/client").$Enums.CareerStatus;
        title: string;
        department: string;
        location: string;
        experienceLevel: string;
        requirements: string[];
        responsibilities: string[];
    }[]>;
    findOneJob(id: string): Promise<{
        applications: {
            name: string;
            id: string;
            email: string;
            createdAt: Date;
            updatedAt: Date;
            type: import("@prisma/client").$Enums.ApplicationType;
            phone: string;
            status: import("@prisma/client").$Enums.ApplicationStatus;
            jobId: string | null;
            internshipId: string | null;
            resumeUrl: string;
            coverLetter: string | null;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        type: string;
        description: string;
        status: import("@prisma/client").$Enums.CareerStatus;
        title: string;
        department: string;
        location: string;
        experienceLevel: string;
        requirements: string[];
        responsibilities: string[];
    }>;
    updateJob(id: string, dto: UpdateJobDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        type: string;
        description: string;
        status: import("@prisma/client").$Enums.CareerStatus;
        title: string;
        department: string;
        location: string;
        experienceLevel: string;
        requirements: string[];
        responsibilities: string[];
    }>;
    removeJob(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    createInternship(dto: CreateInternshipDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        status: import("@prisma/client").$Enums.CareerStatus;
        title: string;
        department: string;
        requirements: string[];
        duration: string;
        stipend: string | null;
    }>;
    findAllInternships(adminView?: boolean): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        status: import("@prisma/client").$Enums.CareerStatus;
        title: string;
        department: string;
        requirements: string[];
        duration: string;
        stipend: string | null;
    }[]>;
    findOneInternship(id: string): Promise<{
        applications: {
            name: string;
            id: string;
            email: string;
            createdAt: Date;
            updatedAt: Date;
            type: import("@prisma/client").$Enums.ApplicationType;
            phone: string;
            status: import("@prisma/client").$Enums.ApplicationStatus;
            jobId: string | null;
            internshipId: string | null;
            resumeUrl: string;
            coverLetter: string | null;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        status: import("@prisma/client").$Enums.CareerStatus;
        title: string;
        department: string;
        requirements: string[];
        duration: string;
        stipend: string | null;
    }>;
    updateInternship(id: string, dto: UpdateInternshipDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        status: import("@prisma/client").$Enums.CareerStatus;
        title: string;
        department: string;
        requirements: string[];
        duration: string;
        stipend: string | null;
    }>;
    removeInternship(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    createApplication(dto: CreateApplicationDto): Promise<{
        name: string;
        id: string;
        email: string;
        createdAt: Date;
        updatedAt: Date;
        type: import("@prisma/client").$Enums.ApplicationType;
        phone: string;
        status: import("@prisma/client").$Enums.ApplicationStatus;
        jobId: string | null;
        internshipId: string | null;
        resumeUrl: string;
        coverLetter: string | null;
    }>;
    findAllApplications(): Promise<({
        job: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            type: string;
            description: string;
            status: import("@prisma/client").$Enums.CareerStatus;
            title: string;
            department: string;
            location: string;
            experienceLevel: string;
            requirements: string[];
            responsibilities: string[];
        } | null;
        internship: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string;
            status: import("@prisma/client").$Enums.CareerStatus;
            title: string;
            department: string;
            requirements: string[];
            duration: string;
            stipend: string | null;
        } | null;
    } & {
        name: string;
        id: string;
        email: string;
        createdAt: Date;
        updatedAt: Date;
        type: import("@prisma/client").$Enums.ApplicationType;
        phone: string;
        status: import("@prisma/client").$Enums.ApplicationStatus;
        jobId: string | null;
        internshipId: string | null;
        resumeUrl: string;
        coverLetter: string | null;
    })[]>;
    findOneApplication(id: string): Promise<{
        job: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            type: string;
            description: string;
            status: import("@prisma/client").$Enums.CareerStatus;
            title: string;
            department: string;
            location: string;
            experienceLevel: string;
            requirements: string[];
            responsibilities: string[];
        } | null;
        internship: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string;
            status: import("@prisma/client").$Enums.CareerStatus;
            title: string;
            department: string;
            requirements: string[];
            duration: string;
            stipend: string | null;
        } | null;
    } & {
        name: string;
        id: string;
        email: string;
        createdAt: Date;
        updatedAt: Date;
        type: import("@prisma/client").$Enums.ApplicationType;
        phone: string;
        status: import("@prisma/client").$Enums.ApplicationStatus;
        jobId: string | null;
        internshipId: string | null;
        resumeUrl: string;
        coverLetter: string | null;
    }>;
    updateApplicationStatus(id: string, status: ApplicationStatus): Promise<{
        name: string;
        id: string;
        email: string;
        createdAt: Date;
        updatedAt: Date;
        type: import("@prisma/client").$Enums.ApplicationType;
        phone: string;
        status: import("@prisma/client").$Enums.ApplicationStatus;
        jobId: string | null;
        internshipId: string | null;
        resumeUrl: string;
        coverLetter: string | null;
    }>;
}
