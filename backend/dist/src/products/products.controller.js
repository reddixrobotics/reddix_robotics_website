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
exports.AdminProductsController = exports.PublicProductsController = void 0;
const common_1 = require("@nestjs/common");
const products_service_1 = require("./products.service");
const create_product_dto_1 = require("./dto/create-product.dto");
const update_product_dto_1 = require("./dto/update-product.dto");
const admin_auth_guard_1 = require("../auth/guards/admin-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const client_1 = require("@prisma/client");
const current_session_decorator_1 = require("../auth/decorators/current-session.decorator");
const audit_log_service_1 = require("../audit/audit-log.service");
let PublicProductsController = class PublicProductsController {
    productsService;
    constructor(productsService) {
        this.productsService = productsService;
    }
    async findAll(search, category, minPrice, maxPrice, availability) {
        return this.productsService.findAll({
            search,
            category,
            minPrice: minPrice ? parseFloat(minPrice) : undefined,
            maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
            availability: availability === 'true' ? true : availability === 'false' ? false : undefined,
        });
    }
    async findOne(id) {
        return this.productsService.findOne(id);
    }
};
exports.PublicProductsController = PublicProductsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('search')),
    __param(1, (0, common_1.Query)('category')),
    __param(2, (0, common_1.Query)('minPrice')),
    __param(3, (0, common_1.Query)('maxPrice')),
    __param(4, (0, common_1.Query)('availability')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], PublicProductsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PublicProductsController.prototype, "findOne", null);
exports.PublicProductsController = PublicProductsController = __decorate([
    (0, common_1.Controller)('api/products'),
    __metadata("design:paramtypes", [products_service_1.ProductsService])
], PublicProductsController);
let AdminProductsController = class AdminProductsController {
    productsService;
    auditLogService;
    constructor(productsService, auditLogService) {
        this.productsService = productsService;
        this.auditLogService = auditLogService;
    }
    async findAll(search, category, minPrice, maxPrice, availability) {
        return this.productsService.findAll({
            search,
            category,
            minPrice: minPrice ? parseFloat(minPrice) : undefined,
            maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
            availability: availability === 'true' ? true : availability === 'false' ? false : undefined,
        });
    }
    async findOne(id) {
        return this.productsService.findOne(id);
    }
    async create(createProductDto, session, ip, userAgent) {
        const product = await this.productsService.create(createProductDto);
        if (!product) {
            throw new common_1.BadRequestException('Product could not be created');
        }
        await this.auditLogService.logAction(session.adminId, 'CREATE_PRODUCT', 'Product', product.id, ip, userAgent);
        return product;
    }
    async update(id, updateProductDto, session, ip, userAgent) {
        const product = await this.productsService.update(id, updateProductDto);
        await this.auditLogService.logAction(session.adminId, 'UPDATE_PRODUCT', 'Product', id, ip, userAgent);
        return product;
    }
    async remove(id, session, ip, userAgent) {
        const result = await this.productsService.remove(id);
        await this.auditLogService.logAction(session.adminId, 'DELETE_PRODUCT', 'Product', id, ip, userAgent);
        return result;
    }
};
exports.AdminProductsController = AdminProductsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('search')),
    __param(1, (0, common_1.Query)('category')),
    __param(2, (0, common_1.Query)('minPrice')),
    __param(3, (0, common_1.Query)('maxPrice')),
    __param(4, (0, common_1.Query)('availability')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], AdminProductsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminProductsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(client_1.AdminRole.SUPER_ADMIN, client_1.AdminRole.ADMIN, client_1.AdminRole.CONTENT_MANAGER),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_session_decorator_1.CurrentSession)()),
    __param(2, (0, common_1.Ip)()),
    __param(3, (0, common_1.Headers)('user-agent')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_product_dto_1.CreateProductDto, Object, String, String]),
    __metadata("design:returntype", Promise)
], AdminProductsController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(client_1.AdminRole.SUPER_ADMIN, client_1.AdminRole.ADMIN, client_1.AdminRole.CONTENT_MANAGER),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_session_decorator_1.CurrentSession)()),
    __param(3, (0, common_1.Ip)()),
    __param(4, (0, common_1.Headers)('user-agent')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_product_dto_1.UpdateProductDto, Object, String, String]),
    __metadata("design:returntype", Promise)
], AdminProductsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(client_1.AdminRole.SUPER_ADMIN, client_1.AdminRole.ADMIN, client_1.AdminRole.CONTENT_MANAGER),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_session_decorator_1.CurrentSession)()),
    __param(2, (0, common_1.Ip)()),
    __param(3, (0, common_1.Headers)('user-agent')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, String, String]),
    __metadata("design:returntype", Promise)
], AdminProductsController.prototype, "remove", null);
exports.AdminProductsController = AdminProductsController = __decorate([
    (0, common_1.Controller)('api/admin/products'),
    (0, common_1.UseGuards)(admin_auth_guard_1.AdminAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [products_service_1.ProductsService,
        audit_log_service_1.AuditLogService])
], AdminProductsController);
//# sourceMappingURL=products.controller.js.map