import { CareersService } from './careers.service';
import { CreateJobDto, UpdateJobDto } from './dto/job.dto';
import { CreateInternshipDto, UpdateInternshipDto } from './dto/internship.dto';
import { CreateApplicationDto, UpdateApplicationStatusDto } from './dto/application.dto';
import type { SessionData } from '../auth/session.service';
import { AuditLogService } from '../audit/audit-log.service';
export declare class PublicCareersController {
    private readonly careersService;
    constructor(careersService: CareersService);
    findAllJobs(): Promise<{
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
    findAllInternships(): Promise<{
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
    apply(createApplicationDto: CreateApplicationDto): Promise<{
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
export declare class AdminCareersController {
    private readonly careersService;
    private readonly auditLogService;
    constructor(careersService: CareersService, auditLogService: AuditLogService);
    findAllJobs(): Promise<{
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
    createJob(createJobDto: CreateJobDto, session: SessionData, ip: string, userAgent: string): Promise<{
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
    updateJob(id: string, updateJobDto: UpdateJobDto, session: SessionData, ip: string, userAgent: string): Promise<{
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
    removeJob(id: string, session: SessionData, ip: string, userAgent: string): Promise<{
        success: boolean;
        message: string;
    }>;
    findAllInternships(): Promise<{
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
    createInternship(createInternshipDto: CreateInternshipDto, session: SessionData, ip: string, userAgent: string): Promise<{
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
    updateInternship(id: string, updateInternshipDto: UpdateInternshipDto, session: SessionData, ip: string, userAgent: string): Promise<{
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
    removeInternship(id: string, session: SessionData, ip: string, userAgent: string): Promise<{
        success: boolean;
        message: string;
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
    updateApplicationStatus(id: string, updateStatusDto: UpdateApplicationStatusDto, session: SessionData, ip: string, userAgent: string): Promise<{
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
