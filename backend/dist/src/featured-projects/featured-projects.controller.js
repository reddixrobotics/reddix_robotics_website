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
exports.AdminFeaturedProjectsController = exports.PublicFeaturedProjectsController = void 0;
const common_1 = require("@nestjs/common");
const featured_projects_service_1 = require("./featured-projects.service");
const featured_project_dto_1 = require("./dto/featured-project.dto");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
let PublicFeaturedProjectsController = class PublicFeaturedProjectsController {
    featuredProjectsService;
    constructor(featuredProjectsService) {
        this.featuredProjectsService = featuredProjectsService;
    }
    findAll() {
        return this.featuredProjectsService.findAll(true);
    }
};
exports.PublicFeaturedProjectsController = PublicFeaturedProjectsController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PublicFeaturedProjectsController.prototype, "findAll", null);
exports.PublicFeaturedProjectsController = PublicFeaturedProjectsController = __decorate([
    (0, common_1.Controller)('api/featured-projects'),
    __metadata("design:paramtypes", [featured_projects_service_1.FeaturedProjectsService])
], PublicFeaturedProjectsController);
let AdminFeaturedProjectsController = class AdminFeaturedProjectsController {
    featuredProjectsService;
    constructor(featuredProjectsService) {
        this.featuredProjectsService = featuredProjectsService;
    }
    findAll() {
        return this.featuredProjectsService.findAll(false);
    }
    create(createFeaturedProjectDto) {
        console.log('RECEIVED DTO:', createFeaturedProjectDto);
        return this.featuredProjectsService.create(createFeaturedProjectDto);
    }
    update(id, updateFeaturedProjectDto) {
        return this.featuredProjectsService.update(id, updateFeaturedProjectDto);
    }
    remove(id) {
        return this.featuredProjectsService.remove(id);
    }
};
exports.AdminFeaturedProjectsController = AdminFeaturedProjectsController;
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)('SUPER_ADMIN', 'ADMIN'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminFeaturedProjectsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)('SUPER_ADMIN', 'ADMIN'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [featured_project_dto_1.CreateFeaturedProjectDto]),
    __metadata("design:returntype", void 0)
], AdminFeaturedProjectsController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, roles_decorator_1.Roles)('SUPER_ADMIN', 'ADMIN'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, featured_project_dto_1.UpdateFeaturedProjectDto]),
    __metadata("design:returntype", void 0)
], AdminFeaturedProjectsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)('SUPER_ADMIN', 'ADMIN'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminFeaturedProjectsController.prototype, "remove", null);
exports.AdminFeaturedProjectsController = AdminFeaturedProjectsController = __decorate([
    (0, common_1.Controller)('api/admin/featured-projects'),
    __metadata("design:paramtypes", [featured_projects_service_1.FeaturedProjectsService])
], AdminFeaturedProjectsController);
//# sourceMappingURL=featured-projects.controller.js.map