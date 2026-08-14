import { PrismaService } from '../prisma/prisma.service';
import { CreateEmployeeDto, UpdateEmployeeDto } from './dto/employee.dto';
export declare class EmployeesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateEmployeeDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string;
        position: string;
        experience: string;
        linkedInUrl: string | null;
        priority: number;
        profilePhoto: string;
    }>;
    findAll(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string;
        position: string;
        experience: string;
        linkedInUrl: string | null;
        priority: number;
        profilePhoto: string;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string;
        position: string;
        experience: string;
        linkedInUrl: string | null;
        priority: number;
        profilePhoto: string;
    }>;
    update(id: string, dto: UpdateEmployeeDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string;
        position: string;
        experience: string;
        linkedInUrl: string | null;
        priority: number;
        profilePhoto: string;
    }>;
    remove(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
