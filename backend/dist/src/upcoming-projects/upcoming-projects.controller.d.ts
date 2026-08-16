import { UpcomingProjectsService } from './upcoming-projects.service';
import { CreateUpcomingProjectDto, UpdateUpcomingProjectDto } from './dto/upcoming-project.dto';
import type { SessionData } from '../auth/session.service';
import { AuditLogService } from '../audit/audit-log.service';
export declare class PublicUpcomingProjectsController {
    private readonly upcomingProjectsService;
    constructor(upcomingProjectsService: UpcomingProjectsService);
    findAll(): Promise<{
        id: string;
        description: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        title: string;
        team: string;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        description: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        title: string;
        team: string;
    }>;
}
export declare class AdminUpcomingProjectsController {
    private readonly upcomingProjectsService;
    private readonly auditLogService;
    constructor(upcomingProjectsService: UpcomingProjectsService, auditLogService: AuditLogService);
    findAll(): Promise<{
        id: string;
        description: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        title: string;
        team: string;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        description: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        title: string;
        team: string;
    }>;
    create(createDto: CreateUpcomingProjectDto, session: SessionData, ip: string, userAgent: string): Promise<{
        id: string;
        description: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        title: string;
        team: string;
    }>;
    update(id: string, updateDto: UpdateUpcomingProjectDto, session: SessionData, ip: string, userAgent: string): Promise<{
        id: string;
        description: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        title: string;
        team: string;
    }>;
    remove(id: string, session: SessionData, ip: string, userAgent: string): Promise<{
        id: string;
        description: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        title: string;
        team: string;
    }>;
}
