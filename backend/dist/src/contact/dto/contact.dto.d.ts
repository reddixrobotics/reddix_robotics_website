import { MessageStatus } from '@prisma/client';
export declare class CreateContactMessageDto {
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
}
export declare class UpdateContactMessageStatusDto {
    status: MessageStatus;
}
