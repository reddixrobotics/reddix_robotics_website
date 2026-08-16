import { PrismaService } from '../prisma/prisma.service';
import { CreateEmployeeDto, UpdateEmployeeDto } from './dto/employee.dto';
export declare class EmployeesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateEmployeeDto): Promise<{
        id: string;
        name: string;
        description: string;
        createdAt: Date;
        updatedAt: Date;
        priority: number;
        skills: string[];
        position: string;
        experience: string;
        linkedInUrl: string | null;
        profilePhoto: string;
    }>;
    findAll(): Promise<{
        id: string;
        name: string;
        description: string;
        createdAt: Date;
        updatedAt: Date;
        priority: number;
        skills: string[];
        position: string;
        experience: string;
        linkedInUrl: string | null;
        profilePhoto: string;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        name: string;
        description: string;
        createdAt: Date;
        updatedAt: Date;
        priority: number;
        skills: string[];
        position: string;
        experience: string;
        linkedInUrl: string | null;
        profilePhoto: string;
    }>;
    update(id: string, dto: UpdateEmployeeDto): Promise<{
        id: string;
        name: string;
        description: string;
        createdAt: Date;
        updatedAt: Date;
        priority: number;
        skills: string[];
        position: string;
        experience: string;
        linkedInUrl: string | null;
        profilePhoto: string;
    }>;
    remove(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
