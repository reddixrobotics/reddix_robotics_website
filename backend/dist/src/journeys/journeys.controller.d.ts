import { JourneysService } from './journeys.service';
import { CreateJourneyDto, UpdateJourneyDto } from './dto/journey.dto';
import type { SessionData } from '../auth/session.service';
import { AuditLogService } from '../audit/audit-log.service';
export declare class PublicJourneysController {
    private readonly journeysService;
    constructor(journeysService: JourneysService);
    findAll(): Promise<{
        id: string;
        description: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        year: string;
    }[]>;
}
export declare class AdminJourneysController {
    private readonly journeysService;
    private readonly auditLogService;
    constructor(journeysService: JourneysService, auditLogService: AuditLogService);
    findAll(): Promise<{
        id: string;
        description: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        year: string;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        description: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        year: string;
    }>;
    create(createJourneyDto: CreateJourneyDto, session: SessionData, ip: string, userAgent: string): Promise<{
        id: string;
        description: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        year: string;
    }>;
    update(id: string, updateJourneyDto: UpdateJourneyDto, session: SessionData, ip: string, userAgent: string): Promise<{
        id: string;
        description: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        year: string;
    }>;
    remove(id: string, session: SessionData, ip: string, userAgent: string): Promise<{
        id: string;
        description: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        year: string;
    }>;
}
