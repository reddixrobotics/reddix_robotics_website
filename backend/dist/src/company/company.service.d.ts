import { PrismaService } from '../prisma/prisma.service';
import { UpdateCompanyInfoDto } from './dto/company.dto';
export declare class CompanyService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getInfo(): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
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
    updateInfo(dto: UpdateCompanyInfoDto): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
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
