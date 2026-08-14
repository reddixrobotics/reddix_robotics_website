import { PrismaService } from '../prisma/prisma.service';
import { CreateContactMessageDto } from './dto/contact.dto';
import { MessageStatus } from '@prisma/client';
export declare class ContactService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateContactMessageDto): Promise<{
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
    updateStatus(id: string, status: MessageStatus): Promise<{
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
    remove(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
