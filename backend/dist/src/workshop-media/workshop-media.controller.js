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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminWorkshopMediaController = exports.PublicWorkshopMediaController = void 0;
const common_1 = require("@nestjs/common");
const workshop_media_service_1 = require("./workshop-media.service");
const workshop_media_dto_1 = require("./dto/workshop-media.dto");
const admin_auth_guard_1 = require("../auth/guards/admin-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const client_1 = require("@prisma/client");
let PublicWorkshopMediaController = class PublicWorkshopMediaController {
    workshopMediaService;
    constructor(workshopMediaService) {
        this.workshopMediaService = workshopMediaService;
    }
    async findAll() {
        return this.workshopMediaService.findAll();
    }
    async findOne(key) {
        return this.workshopMediaService.findByKey(key);
    }
};
exports.PublicWorkshopMediaController = PublicWorkshopMediaController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PublicWorkshopMediaController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':key'),
    __param(0, (0, common_1.Param)('key')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PublicWorkshopMediaController.prototype, "findOne", null);
exports.PublicWorkshopMediaController = PublicWorkshopMediaController = __decorate([
    (0, common_1.Controller)('api/workshop-media'),
    __metadata("design:paramtypes", [workshop_media_service_1.WorkshopMediaService])
], PublicWorkshopMediaController);
let AdminWorkshopMediaController = class AdminWorkshopMediaController {
    workshopMediaService;
    constructor(workshopMediaService) {
        this.workshopMediaService = workshopMediaService;
    }
    async findAll() {
        return this.workshopMediaService.findAll();
    }
    async upsert(key, dto) {
        return this.workshopMediaService.upsert(key, dto);
    }
    async remove(key) {
        return this.workshopMediaService.remove(key);
    }
};
exports.AdminWorkshopMediaController = AdminWorkshopMediaController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminWorkshopMediaController.prototype, "findAll", null);
__decorate([
    (0, common_1.Put)(':key'),
    (0, roles_decorator_1.Roles)(client_1.AdminRole.SUPER_ADMIN, client_1.AdminRole.ADMIN, client_1.AdminRole.CONTENT_MANAGER),
    __param(0, (0, common_1.Param)('key')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, workshop_media_dto_1.UpsertWorkshopMediaDto]),
    __metadata("design:returntype", Promise)
], AdminWorkshopMediaController.prototype, "upsert", null);
__decorate([
    (0, common_1.Delete)(':key'),
    (0, roles_decorator_1.Roles)(client_1.AdminRole.SUPER_ADMIN, client_1.AdminRole.ADMIN, client_1.AdminRole.CONTENT_MANAGER),
    __param(0, (0, common_1.Param)('key')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminWorkshopMediaController.prototype, "remove", null);
exports.AdminWorkshopMediaController = AdminWorkshopMediaController = __decorate([
    (0, common_1.Controller)('api/admin/workshop-media'),
    (0, common_1.UseGuards)(admin_auth_guard_1.AdminAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [workshop_media_service_1.WorkshopMediaService])
], AdminWorkshopMediaController);
//# sourceMappingURL=workshop-media.controller.js.map