import { ProjectsService } from './projects.service';
import { CreateProjectDto, UpdateProjectDto } from './dto/project.dto';
import type { SessionData } from '../auth/session.service';
import { AuditLogService } from '../audit/audit-log.service';
export declare class PublicProjectsController {
    private readonly projectsService;
    constructor(projectsService: ProjectsService);
    findAll(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        category: string;
        description: string;
        images: string[];
        status: string;
        date: string;
        technologies: string[];
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        category: string;
        description: string;
        images: string[];
        status: string;
        date: string;
        technologies: string[];
    }>;
}
export declare class AdminProjectsController {
    private readonly projectsService;
    private readonly auditLogService;
    constructor(projectsService: ProjectsService, auditLogService: AuditLogService);
    findAll(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        category: string;
        description: string;
        images: string[];
        status: string;
        date: string;
        technologies: string[];
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        category: string;
        description: string;
        images: string[];
        status: string;
        date: string;
        technologies: string[];
    }>;
    create(createProjectDto: CreateProjectDto, session: SessionData, ip: string, userAgent: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        category: string;
        description: string;
        images: string[];
        status: string;
        date: string;
        technologies: string[];
    }>;
    update(id: string, updateProjectDto: UpdateProjectDto, session: SessionData, ip: string, userAgent: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        category: string;
        description: string;
        images: string[];
        status: string;
        date: string;
        technologies: string[];
    }>;
    remove(id: string, session: SessionData, ip: string, userAgent: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
