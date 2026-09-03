"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const throttler_1 = require("@nestjs/throttler");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const prisma_module_1 = require("./prisma/prisma.module");
const redis_module_1 = require("./redis/redis.module");
const crypto_module_1 = require("./crypto/crypto.module");
const mail_module_1 = require("./mail/mail.module");
const auth_module_1 = require("./auth/auth.module");
const security_module_1 = require("./security/security.module");
const audit_log_module_1 = require("./audit/audit-log.module");
const products_module_1 = require("./products/products.module");
const orders_module_1 = require("./orders/orders.module");
const payments_module_1 = require("./payments/payments.module");
const careers_module_1 = require("./careers/careers.module");
const workshops_module_1 = require("./workshops/workshops.module");
const employees_module_1 = require("./employees/employees.module");
const projects_module_1 = require("./projects/projects.module");
const contractors_module_1 = require("./contractors/contractors.module");
const company_module_1 = require("./company/company.module");
const contact_module_1 = require("./contact/contact.module");
const cart_module_1 = require("./cart/cart.module");
const wishlist_module_1 = require("./wishlist/wishlist.module");
const featured_projects_module_1 = require("./featured-projects/featured-projects.module");
const uploads_controller_1 = require("./uploads/uploads.controller");
const journeys_module_1 = require("./journeys/journeys.module");
const upcoming_projects_module_1 = require("./upcoming-projects/upcoming-projects.module");
const dashboard_module_1 = require("./dashboard/dashboard.module");
const workshop_media_module_1 = require("./workshop-media/workshop-media.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            throttler_1.ThrottlerModule.forRoot([
                {
                    name: 'global',
                    ttl: 60_000,
                    limit: 60,
                },
            ]),
            prisma_module_1.PrismaModule,
            redis_module_1.RedisModule,
            crypto_module_1.CryptoModule,
            mail_module_1.MailModule,
            auth_module_1.AuthModule,
            security_module_1.SecurityModule,
            audit_log_module_1.AuditLogModule,
            products_module_1.ProductsModule,
            orders_module_1.OrdersModule,
            payments_module_1.PaymentsModule,
            careers_module_1.CareersModule,
            workshops_module_1.WorkshopsModule,
            employees_module_1.EmployeesModule,
            projects_module_1.ProjectsModule,
            featured_projects_module_1.FeaturedProjectsModule,
            contractors_module_1.ContractorsModule,
            company_module_1.CompanyModule,
            contact_module_1.ContactModule,
            cart_module_1.CartModule,
            wishlist_module_1.WishlistModule,
            journeys_module_1.JourneysModule,
            upcoming_projects_module_1.UpcomingProjectsModule,
            dashboard_module_1.DashboardModule,
            workshop_media_module_1.WorkshopMediaModule,
        ],
        controllers: [app_controller_1.AppController, uploads_controller_1.UploadsController],
        providers: [
            app_service_1.AppService,
            {
                provide: core_1.APP_GUARD,
                useClass: throttler_1.ThrottlerGuard,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map