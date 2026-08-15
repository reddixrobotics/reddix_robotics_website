import { PrismaService } from '../prisma/prisma.service';
import { CreateContactMessageDto } from './dto/contact.dto';
import { MessageStatus } from '@prisma/client';
export declare class ContactService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateContactMessageDto): Promise<{
        name: string;
        subject: string;
        id: string;
        email: string;
        createdAt: Date;
        updatedAt: Date;
        phone: string | null;
        message: string;
        status: import("@prisma/client").$Enums.MessageStatus;
    }>;
    findAll(): Promise<{
        name: string;
        subject: string;
        id: string;
        email: string;
        createdAt: Date;
        updatedAt: Date;
        phone: string | null;
        message: string;
        status: import("@prisma/client").$Enums.MessageStatus;
    }[]>;
    findOne(id: string): Promise<{
        name: string;
        subject: string;
        id: string;
        email: string;
        createdAt: Date;
        updatedAt: Date;
        phone: string | null;
        message: string;
        status: import("@prisma/client").$Enums.MessageStatus;
    }>;
    updateStatus(id: string, status: MessageStatus): Promise<{
        name: string;
        subject: string;
        id: string;
        email: string;
        createdAt: Date;
        updatedAt: Date;
        phone: string | null;
        message: string;
        status: import("@prisma/client").$Enums.MessageStatus;
    }>;
    remove(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
