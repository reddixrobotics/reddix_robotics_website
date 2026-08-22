import { WorkshopsService } from './workshops.service';
import { CreateWorkshopDto, UpdateWorkshopDto } from './dto/workshop.dto';
import { CreateRegistrationDto, UpdateRegistrationStatusDto } from './dto/registration.dto';
import type { SessionData } from '../auth/session.service';
import { AuditLogService } from '../audit/audit-log.service';
export declare class PublicWorkshopsController {
    private readonly workshopsService;
    constructor(workshopsService: WorkshopsService);
    findAll(): Promise<{
        id: string;
        description: string;
        createdAt: Date;
        updatedAt: Date;
        date: Date;
        status: import("@prisma/client").$Enums.WorkshopStatus;
        title: string;
        location: string;
        duration: string;
        time: string;
        capacity: number;
    }[]>;
    findOne(id: string): Promise<{
        registrations: {
            id: string;
            name: string;
            createdAt: Date;
            email: string;
            phone: string;
            status: import("@prisma/client").$Enums.RegistrationStatus;
            workshopId: string;
        }[];
    } & {
        id: string;
        description: string;
        createdAt: Date;
        updatedAt: Date;
        date: Date;
        status: import("@prisma/client").$Enums.WorkshopStatus;
        title: string;
        location: string;
        duration: string;
        time: string;
        capacity: number;
    }>;
    register(createRegistrationDto: CreateRegistrationDto): Promise<{
        workshop: {
            id: string;
            description: string;
            createdAt: Date;
            updatedAt: Date;
            date: Date;
            status: import("@prisma/client").$Enums.WorkshopStatus;
            title: string;
            location: string;
            duration: string;
            time: string;
            capacity: number;
        };
    } & {
        id: string;
        name: string;
        createdAt: Date;
        email: string;
        phone: string;
        status: import("@prisma/client").$Enums.RegistrationStatus;
        workshopId: string;
    }>;
}
export declare class AdminWorkshopsController {
    private readonly workshopsService;
    private readonly auditLogService;
    constructor(workshopsService: WorkshopsService, auditLogService: AuditLogService);
    findAllWorkshops(): Promise<{
        id: string;
        description: string;
        createdAt: Date;
        updatedAt: Date;
        date: Date;
        status: import("@prisma/client").$Enums.WorkshopStatus;
        title: string;
        location: string;
        duration: string;
        time: string;
        capacity: number;
    }[]>;
    findAllRegistrations(): Promise<({
        workshop: {
            id: string;
            description: string;
            createdAt: Date;
            updatedAt: Date;
            date: Date;
            status: import("@prisma/client").$Enums.WorkshopStatus;
            title: string;
            location: string;
            duration: string;
            time: string;
            capacity: number;
        };
    } & {
        id: string;
        name: string;
        createdAt: Date;
        email: string;
        phone: string;
        status: import("@prisma/client").$Enums.RegistrationStatus;
        workshopId: string;
    })[]>;
    findOneRegistration(id: string): Promise<{
        workshop: {
            id: string;
            description: string;
            createdAt: Date;
            updatedAt: Date;
            date: Date;
            status: import("@prisma/client").$Enums.WorkshopStatus;
            title: string;
            location: string;
            duration: string;
            time: string;
            capacity: number;
        };
    } & {
        id: string;
        name: string;
        createdAt: Date;
        email: string;
        phone: string;
        status: import("@prisma/client").$Enums.RegistrationStatus;
        workshopId: string;
    }>;
    updateRegistrationStatus(id: string, updateStatusDto: UpdateRegistrationStatusDto, session: SessionData, ip: string, userAgent: string): Promise<{
        workshop: {
            id: string;
            description: string;
            createdAt: Date;
            updatedAt: Date;
            date: Date;
            status: import("@prisma/client").$Enums.WorkshopStatus;
            title: string;
            location: string;
            duration: string;
            time: string;
            capacity: number;
        };
    } & {
        id: string;
        name: string;
        createdAt: Date;
        email: string;
        phone: string;
        status: import("@prisma/client").$Enums.RegistrationStatus;
        workshopId: string;
    }>;
    findOneWorkshop(id: string): Promise<{
        registrations: {
            id: string;
            name: string;
            createdAt: Date;
            email: string;
            phone: string;
            status: import("@prisma/client").$Enums.RegistrationStatus;
            workshopId: string;
        }[];
    } & {
        id: string;
        description: string;
        createdAt: Date;
        updatedAt: Date;
        date: Date;
        status: import("@prisma/client").$Enums.WorkshopStatus;
        title: string;
        location: string;
        duration: string;
        time: string;
        capacity: number;
    }>;
    createWorkshop(createWorkshopDto: CreateWorkshopDto, session: SessionData, ip: string, userAgent: string): Promise<{
        id: string;
        description: string;
        createdAt: Date;
        updatedAt: Date;
        date: Date;
        status: import("@prisma/client").$Enums.WorkshopStatus;
        title: string;
        location: string;
        duration: string;
        time: string;
        capacity: number;
    }>;
    updateWorkshop(id: string, updateWorkshopDto: UpdateWorkshopDto, session: SessionData, ip: string, userAgent: string): Promise<{
        id: string;
        description: string;
        createdAt: Date;
        updatedAt: Date;
        date: Date;
        status: import("@prisma/client").$Enums.WorkshopStatus;
        title: string;
        location: string;
        duration: string;
        time: string;
        capacity: number;
    }>;
    removeWorkshop(id: string, session: SessionData, ip: string, userAgent: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
