import { PrismaService } from '../prisma/prisma.service';
import { CreateContractorDto, UpdateContractorDto } from './dto/contractor.dto';
export declare class ContractorsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateContractorDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string;
        country: string;
        logoUrl: string;
        website: string | null;
        contactInfo: string | null;
    }>;
    findAll(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string;
        country: string;
        logoUrl: string;
        website: string | null;
        contactInfo: string | null;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string;
        country: string;
        logoUrl: string;
        website: string | null;
        contactInfo: string | null;
    }>;
    update(id: string, dto: UpdateContractorDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string;
        country: string;
        logoUrl: string;
        website: string | null;
        contactInfo: string | null;
    }>;
    remove(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
