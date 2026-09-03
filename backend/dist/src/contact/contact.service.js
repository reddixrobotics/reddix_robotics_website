"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const mail_service_1 = require("../mail/mail.service");
const client_1 = require("@prisma/client");
let ContactService = class ContactService {
    prisma;
    mailService;
    constructor(prisma, mailService) {
        this.prisma = prisma;
        this.mailService = mailService;
    }
    async create(dto) {
        return this.prisma.contactMessage.create({
            data: dto,
        });
    }
    async findAll() {
        return this.prisma.contactMessage.findMany({
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(id) {
        const message = await this.prisma.contactMessage.findUnique({
            where: { id },
        });
        if (!message) {
            throw new common_1.NotFoundException(`Contact message ${id} not found`);
        }
        return message;
    }
    async updateStatus(id, status) {
        await this.findOne(id);
        return this.prisma.contactMessage.update({
            where: { id },
            data: { status },
        });
    }
    async remove(id) {
        await this.findOne(id);
        await this.prisma.contactMessage.delete({
            where: { id },
        });
        return { success: true, message: `Contact message ${id} deleted successfully.` };
    }
    async replyToMessage(id, replyMessage) {
        const message = await this.findOne(id);
        await this.mailService.sendMail(message.email, `Re: ${message.subject}`, replyMessage);
        const updated = await this.prisma.contactMessage.update({
            where: { id },
            data: { status: client_1.MessageStatus.RESPONDED },
        });
        return { success: true, message: updated };
    }
};
exports.ContactService = ContactService;
exports.ContactService = ContactService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        mail_service_1.MailService])
], ContactService);
//# sourceMappingURL=contact.service.js.map