import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import { CreateContactMessageDto } from './dto/contact.dto';
import { MessageStatus } from '@prisma/client';
export declare class ContactService {
    private readonly prisma;
    private readonly mailService;
    constructor(prisma: PrismaService, mailService: MailService);
    create(dto: CreateContactMessageDto): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        subject: string;
        email: string;
        phone: string | null;
        message: string;
        status: import("@prisma/client").$Enums.MessageStatus;
    }>;
    findAll(): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        subject: string;
        email: string;
        phone: string | null;
        message: string;
        status: import("@prisma/client").$Enums.MessageStatus;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        subject: string;
        email: string;
        phone: string | null;
        message: string;
        status: import("@prisma/client").$Enums.MessageStatus;
    }>;
    updateStatus(id: string, status: MessageStatus): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        subject: string;
        email: string;
        phone: string | null;
        message: string;
        status: import("@prisma/client").$Enums.MessageStatus;
    }>;
    remove(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    replyToMessage(id: string, replyMessage: string): Promise<{
        success: boolean;
        message: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            subject: string;
            email: string;
            phone: string | null;
            message: string;
            status: import("@prisma/client").$Enums.MessageStatus;
        };
    }>;
}
