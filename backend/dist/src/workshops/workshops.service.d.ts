import { PrismaService } from '../prisma/prisma.service';
import { CreateWorkshopDto, UpdateWorkshopDto } from './dto/workshop.dto';
import { CreateRegistrationDto } from './dto/registration.dto';
import { RegistrationStatus } from '@prisma/client';
export declare class WorkshopsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createWorkshop(dto: CreateWorkshopDto): Promise<{
        date: Date;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        status: import("@prisma/client").$Enums.WorkshopStatus;
        title: string;
        location: string;
        duration: string;
        time: string;
        capacity: number;
    }>;
    findAllWorkshops(adminView?: boolean): Promise<{
        date: Date;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        status: import("@prisma/client").$Enums.WorkshopStatus;
        title: string;
        location: string;
        duration: string;
        time: string;
        capacity: number;
    }[]>;
    findOneWorkshop(id: string): Promise<{
        registrations: {
            name: string;
            id: string;
            email: string;
            createdAt: Date;
            phone: string;
            status: import("@prisma/client").$Enums.RegistrationStatus;
            workshopId: string;
        }[];
    } & {
        date: Date;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        status: import("@prisma/client").$Enums.WorkshopStatus;
        title: string;
        location: string;
        duration: string;
        time: string;
        capacity: number;
    }>;
    updateWorkshop(id: string, dto: UpdateWorkshopDto): Promise<{
        date: Date;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
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
            date: Date;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string;
            status: import("@prisma/client").$Enums.WorkshopStatus;
            title: string;
            location: string;
            duration: string;
            time: string;
            capacity: number;
        };
    } & {
        name: string;
        id: string;
        email: string;
        createdAt: Date;
        phone: string;
        status: import("@prisma/client").$Enums.RegistrationStatus;
        workshopId: string;
    }>;
    findAllRegistrations(): Promise<({
        workshop: {
            date: Date;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string;
            status: import("@prisma/client").$Enums.WorkshopStatus;
            title: string;
            location: string;
            duration: string;
            time: string;
            capacity: number;
        };
    } & {
        name: string;
        id: string;
        email: string;
        createdAt: Date;
        phone: string;
        status: import("@prisma/client").$Enums.RegistrationStatus;
        workshopId: string;
    })[]>;
    findOneRegistration(id: string): Promise<{
        workshop: {
            date: Date;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string;
            status: import("@prisma/client").$Enums.WorkshopStatus;
            title: string;
            location: string;
            duration: string;
            time: string;
            capacity: number;
        };
    } & {
        name: string;
        id: string;
        email: string;
        createdAt: Date;
        phone: string;
        status: import("@prisma/client").$Enums.RegistrationStatus;
        workshopId: string;
    }>;
    updateRegistrationStatus(id: string, status: RegistrationStatus): Promise<{
        workshop: {
            date: Date;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string;
            status: import("@prisma/client").$Enums.WorkshopStatus;
            title: string;
            location: string;
            duration: string;
            time: string;
            capacity: number;
        };
    } & {
        name: string;
        id: string;
        email: string;
        createdAt: Date;
        phone: string;
        status: import("@prisma/client").$Enums.RegistrationStatus;
        workshopId: string;
    }>;
}
