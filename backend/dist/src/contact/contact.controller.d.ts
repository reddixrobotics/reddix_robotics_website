import { ContactService } from './contact.service';
import { CreateContactMessageDto, UpdateContactMessageStatusDto } from './dto/contact.dto';
import type { SessionData } from '../auth/session.service';
import { AuditLogService } from '../audit/audit-log.service';
export declare class PublicContactController {
    private readonly contactService;
    constructor(contactService: ContactService);
    create(createContactMessageDto: CreateContactMessageDto): Promise<{
        id: string;
        email: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        message: string;
        status: import("@prisma/client").$Enums.MessageStatus;
        phone: string | null;
        subject: string;
    }>;
}
export declare class AdminContactController {
    private readonly contactService;
    private readonly auditLogService;
    constructor(contactService: ContactService, auditLogService: AuditLogService);
    findAll(): Promise<{
        id: string;
        email: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        message: string;
        status: import("@prisma/client").$Enums.MessageStatus;
        phone: string | null;
        subject: string;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        email: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        message: string;
        status: import("@prisma/client").$Enums.MessageStatus;
        phone: string | null;
        subject: string;
    }>;
    updateStatus(id: string, updateStatusDto: UpdateContactMessageStatusDto, session: SessionData, ip: string, userAgent: string): Promise<{
        id: string;
        email: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        message: string;
        status: import("@prisma/client").$Enums.MessageStatus;
        phone: string | null;
        subject: string;
    }>;
    remove(id: string, session: SessionData, ip: string, userAgent: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
