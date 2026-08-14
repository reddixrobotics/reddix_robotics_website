import { RegistrationStatus } from '@prisma/client';
export declare class CreateRegistrationDto {
    workshopId: string;
    name: string;
    email: string;
    phone: string;
}
export declare class UpdateRegistrationStatusDto {
    status: RegistrationStatus;
}
