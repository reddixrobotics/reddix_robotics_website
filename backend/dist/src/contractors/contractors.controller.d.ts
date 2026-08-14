import { ContractorsService } from './contractors.service';
import { CreateContractorDto, UpdateContractorDto } from './dto/contractor.dto';
import type { SessionData } from '../auth/session.service';
import { AuditLogService } from '../audit/audit-log.service';
export declare class PublicContractorsController {
    private readonly contractorsService;
    constructor(contractorsService: ContractorsService);
    findAll(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string;
        country: string;
        logoUrl: string;
        website: string | null;
        contactInfo: string | null;
    }[]>;
}
export declare class AdminContractorsController {
    private readonly contractorsService;
    private readonly auditLogService;
    constructor(contractorsService: ContractorsService, auditLogService: AuditLogService);
    findAll(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string;
        country: string;
        logoUrl: string;
        website: string | null;
        contactInfo: string | null;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string;
        country: string;
        logoUrl: string;
        website: string | null;
        contactInfo: string | null;
    }>;
    create(createContractorDto: CreateContractorDto, session: SessionData, ip: string, userAgent: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string;
        country: string;
        logoUrl: string;
        website: string | null;
        contactInfo: string | null;
    }>;
    update(id: string, updateContractorDto: UpdateContractorDto, session: SessionData, ip: string, userAgent: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string;
        country: string;
        logoUrl: string;
        website: string | null;
        contactInfo: string | null;
    }>;
    remove(id: string, session: SessionData, ip: string, userAgent: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
