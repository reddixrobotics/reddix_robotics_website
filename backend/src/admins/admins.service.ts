import { Injectable, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAdminDto } from './dto/admin.dto';
import * as argon2 from 'argon2';
import { AdminRole } from '@prisma/client';

@Injectable()
export class AdminsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.admin.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        twoFactorEnabled: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(dto: CreateAdminDto) {
    const existing = await this.prisma.admin.findUnique({
      where: { email: dto.email },
    });
    if (existing) {
      throw new ConflictException('Admin with this email already exists.');
    }

    const passwordHash = await argon2.hash(dto.password, {
      type: argon2.argon2id,
      memoryCost: 65536,
      timeCost: 3,
      parallelism: 4,
    });

    const newAdmin = await this.prisma.admin.create({
      data: {
        email: dto.email,
        passwordHash,
        role: dto.role,
      },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
      }
    });

    return newAdmin;
  }

  async remove(id: string, currentAdminId: string) {
    if (id === currentAdminId) {
      throw new BadRequestException('You cannot delete your own account.');
    }
    const admin = await this.prisma.admin.findUnique({ where: { id } });
    if (!admin) {
      throw new NotFoundException('Admin not found.');
    }
    
    if (admin.role === AdminRole.SUPER_ADMIN) {
      const superAdmins = await this.prisma.admin.count({ where: { role: AdminRole.SUPER_ADMIN } });
      if (superAdmins <= 1) {
        throw new BadRequestException('Cannot delete the last Super Admin.');
      }
    }

    await this.prisma.admin.delete({ where: { id } });
    return { success: true };
  }
}
