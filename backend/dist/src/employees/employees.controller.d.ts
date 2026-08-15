import { EmployeesService } from './employees.service';
import { CreateEmployeeDto, UpdateEmployeeDto } from './dto/employee.dto';
import type { SessionData } from '../auth/session.service';
import { AuditLogService } from '../audit/audit-log.service';
export declare class PublicEmployeesController {
    private readonly employeesService;
    constructor(employeesService: EmployeesService);
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
}
export declare class AdminEmployeesController {
    private readonly employeesService;
    private readonly auditLogService;
    constructor(employeesService: EmployeesService, auditLogService: AuditLogService);
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
    create(createEmployeeDto: CreateEmployeeDto, session: SessionData, ip: string, userAgent: string): Promise<{
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
    update(id: string, updateEmployeeDto: UpdateEmployeeDto, session: SessionData, ip: string, userAgent: string): Promise<{
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
    remove(id: string, session: SessionData, ip: string, userAgent: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
