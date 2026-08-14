import { PrismaService } from '../prisma/prisma.service';
import { CreateWorkshopDto, UpdateWorkshopDto } from './dto/workshop.dto';
import { CreateRegistrationDto } from './dto/registration.dto';
import { RegistrationStatus } from '@prisma/client';
export declare class WorkshopsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createWorkshop(dto: CreateWorkshopDto): Promise<{
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
    findAllWorkshops(adminView?: boolean): Promise<{
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
    updateWorkshop(id: string, dto: UpdateWorkshopDto): Promise<{
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
    removeWorkshop(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    register(dto: CreateRegistrationDto): Promise<{
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
    updateRegistrationStatus(id: string, status: RegistrationStatus): Promise<{
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
