import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateCompanyInfoDto } from './dto/company.dto';

@Injectable()
export class CompanyService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Fetch company information, creating a default record if none exists.
   */
  async getInfo() {
    let info = await this.prisma.companyInformation.findFirst();
    if (!info) {
      info = await this.prisma.companyInformation.create({
        data: {
          name: 'Reddix Robotics',
          aboutContent: 'Reddix Robotics designs and deploys next-generation robotics systems.',
          email: 'contact@reddixrobotics.com',
          phone: '+91-9876543210',
          address: '456 Robotic Avenue, Industrial Zone',
          city: 'Bangalore',
          state: 'Karnataka',
          country: 'India',
          latitude: 12.9716,
          longitude: 77.5946,
          socialLinks: {
            linkedin: 'https://linkedin.com/company/reddix-robotics',
            twitter: 'https://twitter.com/reddix_robotics',
          },
        },
      });
    }
    return info;
  }

  /**
   * Update the single company information record.
   */
  async updateInfo(dto: UpdateCompanyInfoDto) {
    const info = await this.getInfo();
    return this.prisma.companyInformation.update({
      where: { id: info.id },
      data: dto,
    });
  }
}
