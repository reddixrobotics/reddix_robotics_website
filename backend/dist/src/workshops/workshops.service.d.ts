import { PrismaService } from '../prisma/prisma.service';
import { CreateWorkshopDto, UpdateWorkshopDto } from './dto/workshop.dto';
import { CreateRegistrationDto } from './dto/registration.dto';
import { RegistrationStatus } from '@prisma/client';
export declare class WorkshopsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createWorkshop(dto: CreateWorkshopDto): Promise<{
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
    findAllWorkshops(adminView?: boolean): Promise<{
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
    updateWorkshop(id: string, dto: UpdateWorkshopDto): Promise<{
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
    removeWorkshop(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    register(dto: CreateRegistrationDto): Promise<{
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
    updateRegistrationStatus(id: string, status: RegistrationStatus): Promise<{
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
