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
        createdAt: Date;
        updatedAt: Date;
        description: string;
        status: import("@prisma/client").$Enums.WorkshopStatus;
        title: string;
        location: string;
        duration: string;
        date: Date;
        time: string;
        capacity: number;
    }[]>;
    findOne(id: string): Promise<{
        registrations: {
            id: string;
            email: string;
            createdAt: Date;
            name: string;
            status: import("@prisma/client").$Enums.RegistrationStatus;
            phone: string;
            workshopId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        status: import("@prisma/client").$Enums.WorkshopStatus;
        title: string;
        location: string;
        duration: string;
        date: Date;
        time: string;
        capacity: number;
    }>;
    register(createRegistrationDto: CreateRegistrationDto): Promise<{
        workshop: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string;
            status: import("@prisma/client").$Enums.WorkshopStatus;
            title: string;
            location: string;
            duration: string;
            date: Date;
            time: string;
            capacity: number;
        };
    } & {
        id: string;
        email: string;
        createdAt: Date;
        name: string;
        status: import("@prisma/client").$Enums.RegistrationStatus;
        phone: string;
        workshopId: string;
    }>;
}
export declare class AdminWorkshopsController {
    private readonly workshopsService;
    private readonly auditLogService;
    constructor(workshopsService: WorkshopsService, auditLogService: AuditLogService);
    findAllWorkshops(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        status: import("@prisma/client").$Enums.WorkshopStatus;
        title: string;
        location: string;
        duration: string;
        date: Date;
        time: string;
        capacity: number;
    }[]>;
    findOneWorkshop(id: string): Promise<{
        registrations: {
            id: string;
            email: string;
            createdAt: Date;
            name: string;
            status: import("@prisma/client").$Enums.RegistrationStatus;
            phone: string;
            workshopId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        status: import("@prisma/client").$Enums.WorkshopStatus;
        title: string;
        location: string;
        duration: string;
        date: Date;
        time: string;
        capacity: number;
    }>;
    createWorkshop(createWorkshopDto: CreateWorkshopDto, session: SessionData, ip: string, userAgent: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        status: import("@prisma/client").$Enums.WorkshopStatus;
        title: string;
        location: string;
        duration: string;
        date: Date;
        time: string;
        capacity: number;
    }>;
    updateWorkshop(id: string, updateWorkshopDto: UpdateWorkshopDto, session: SessionData, ip: string, userAgent: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        status: import("@prisma/client").$Enums.WorkshopStatus;
        title: string;
        location: string;
        duration: string;
        date: Date;
        time: string;
        capacity: number;
    }>;
    removeWorkshop(id: string, session: SessionData, ip: string, userAgent: string): Promise<{
        success: boolean;
        message: string;
    }>;
    findAllRegistrations(): Promise<({
        workshop: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string;
            status: import("@prisma/client").$Enums.WorkshopStatus;
            title: string;
            location: string;
            duration: string;
            date: Date;
            time: string;
            capacity: number;
        };
    } & {
        id: string;
        email: string;
        createdAt: Date;
        name: string;
        status: import("@prisma/client").$Enums.RegistrationStatus;
        phone: string;
        workshopId: string;
    })[]>;
    findOneRegistration(id: string): Promise<{
        workshop: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string;
            status: import("@prisma/client").$Enums.WorkshopStatus;
            title: string;
            location: string;
            duration: string;
            date: Date;
            time: string;
            capacity: number;
        };
    } & {
        id: string;
        email: string;
        createdAt: Date;
        name: string;
        status: import("@prisma/client").$Enums.RegistrationStatus;
        phone: string;
        workshopId: string;
    }>;
    updateRegistrationStatus(id: string, updateStatusDto: UpdateRegistrationStatusDto, session: SessionData, ip: string, userAgent: string): Promise<{
        workshop: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string;
            status: import("@prisma/client").$Enums.WorkshopStatus;
            title: string;
            location: string;
            duration: string;
            date: Date;
            time: string;
            capacity: number;
        };
    } & {
        id: string;
        email: string;
        createdAt: Date;
        name: string;
        status: import("@prisma/client").$Enums.RegistrationStatus;
        phone: string;
        workshopId: string;
    }>;
}
