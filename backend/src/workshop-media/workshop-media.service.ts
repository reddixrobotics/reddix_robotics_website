import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpsertWorkshopMediaDto } from './dto/workshop-media.dto';

@Injectable()
export class WorkshopMediaService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.workshopMedia.findMany({
      orderBy: { displayOrder: 'asc' },
    });
  }

  async findByKey(sectionKey: string) {
    const media = await this.prisma.workshopMedia.findUnique({
      where: { sectionKey },
    });
    if (!media) {
      throw new NotFoundException(`Workshop media for section "${sectionKey}" not found`);
    }
    return media;
  }

  async upsert(sectionKey: string, dto: UpsertWorkshopMediaDto) {
    return this.prisma.workshopMedia.upsert({
      where: { sectionKey },
      update: {
        ...dto,
        updatedAt: new Date(),
      },
      create: {
        sectionKey,
        title: dto.title ?? sectionKey,
        mediaUrl: dto.mediaUrl,
        posterUrl: dto.posterUrl,
        mediaType: dto.mediaType ?? 'video',
        altText: dto.altText ?? '',
        isActive: dto.isActive ?? true,
        displayOrder: dto.displayOrder ?? 0,
      },
    });
  }

  async remove(sectionKey: string) {
    await this.findByKey(sectionKey);
    return this.prisma.workshopMedia.update({
      where: { sectionKey },
      data: { mediaUrl: null, posterUrl: null, isActive: false },
    });
  }
}
