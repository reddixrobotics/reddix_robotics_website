import { PrismaService } from '../prisma/prisma.service';
import { CreateContractorDto, UpdateContractorDto } from './dto/contractor.dto';
export declare class ContractorsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateContractorDto): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        country: string;
        logoUrl: string;
        website: string | null;
        contactInfo: string | null;
    }>;
    findAll(): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        country: string;
        logoUrl: string;
        website: string | null;
        contactInfo: string | null;
    }[]>;
    findOne(id: string): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        country: string;
        logoUrl: string;
        website: string | null;
        contactInfo: string | null;
    }>;
    update(id: string, dto: UpdateContractorDto): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
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
