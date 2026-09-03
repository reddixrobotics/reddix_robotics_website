import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import { CreateContactMessageDto } from './dto/contact.dto';
import { MessageStatus } from '@prisma/client';

@Injectable()
export class ContactService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
  ) {}

  async create(dto: CreateContactMessageDto) {
    return this.prisma.contactMessage.create({
      data: dto,
    });
  }

  async findAll() {
    return this.prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const message = await this.prisma.contactMessage.findUnique({
      where: { id },
    });

    if (!message) {
      throw new NotFoundException(`Contact message ${id} not found`);
    }

    return message;
  }

  async updateStatus(id: string, status: MessageStatus) {
    await this.findOne(id);
    return this.prisma.contactMessage.update({
      where: { id },
      data: { status },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.contactMessage.delete({
      where: { id },
    });
    return { success: true, message: `Contact message ${id} deleted successfully.` };
  }

  async replyToMessage(id: string, replyMessage: string) {
    const message = await this.findOne(id);
    
    // Send email using MailService
    await this.mailService.sendMail(
      message.email,
      `Re: ${message.subject}`,
      replyMessage
    );

    // Update status to RESPONDED
    const updated = await this.prisma.contactMessage.update({
      where: { id },
      data: { status: MessageStatus.RESPONDED },
    });

    return { success: true, message: updated };
  }
}
