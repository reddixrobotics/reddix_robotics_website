import { CompanyService } from './company.service';
import { UpdateCompanyInfoDto } from './dto/company.dto';
import type { SessionData } from '../auth/session.service';
import { AuditLogService } from '../audit/audit-log.service';
export declare class PublicCompanyController {
    private readonly companyService;
    constructor(companyService: CompanyService);
    getInfo(): Promise<{
        name: string;
        id: string;
        email: string;
        createdAt: Date;
        updatedAt: Date;
        phone: string;
        country: string;
        aboutContent: string;
        address: string;
        city: string;
        state: string;
        latitude: number | null;
        longitude: number | null;
        socialLinks: import("@prisma/client/runtime/client").JsonValue | null;
    }>;
}
export declare class AdminCompanyController {
    private readonly companyService;
    private readonly auditLogService;
    constructor(companyService: CompanyService, auditLogService: AuditLogService);
    getInfo(): Promise<{
        name: string;
        id: string;
        email: string;
        createdAt: Date;
        updatedAt: Date;
        phone: string;
        country: string;
        aboutContent: string;
        address: string;
        city: string;
        state: string;
        latitude: number | null;
        longitude: number | null;
        socialLinks: import("@prisma/client/runtime/client").JsonValue | null;
    }>;
    update(updateDto: UpdateCompanyInfoDto, session: SessionData, ip: string, userAgent: string): Promise<{
        name: string;
        id: string;
        email: string;
        createdAt: Date;
        updatedAt: Date;
        phone: string;
        country: string;
        aboutContent: string;
        address: string;
        city: string;
        state: string;
        latitude: number | null;
        longitude: number | null;
        socialLinks: import("@prisma/client/runtime/client").JsonValue | null;
    }>;
}
