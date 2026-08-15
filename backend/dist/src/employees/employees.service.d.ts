import { PrismaService } from '../prisma/prisma.service';
import { CreateEmployeeDto, UpdateEmployeeDto } from './dto/employee.dto';
export declare class EmployeesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateEmployeeDto): Promise<{
        name: string;
        priority: number;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        position: string;
        experience: string;
        linkedInUrl: string | null;
        profilePhoto: string;
    }>;
    findAll(): Promise<{
        name: string;
        priority: number;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        position: string;
        experience: string;
        linkedInUrl: string | null;
        profilePhoto: string;
    }[]>;
    findOne(id: string): Promise<{
        name: string;
        priority: number;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        position: string;
        experience: string;
        linkedInUrl: string | null;
        profilePhoto: string;
    }>;
    update(id: string, dto: UpdateEmployeeDto): Promise<{
        name: string;
        priority: number;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
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
