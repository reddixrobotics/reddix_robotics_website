import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { RedisModule } from './redis/redis.module';
import { CryptoModule } from './crypto/crypto.module';
import { MailModule } from './mail/mail.module';
import { AuthModule } from './auth/auth.module';
import { SecurityModule } from './security/security.module';
import { AuditLogModule } from './audit/audit-log.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { PaymentsModule } from './payments/payments.module';
import { CareersModule } from './careers/careers.module';
import { WorkshopsModule } from './workshops/workshops.module';
import { EmployeesModule } from './employees/employees.module';
import { ProjectsModule } from './projects/projects.module';
import { ContractorsModule } from './contractors/contractors.module';
import { CompanyModule } from './company/company.module';
import { ContactModule } from './contact/contact.module';
import { CartModule } from './cart/cart.module';
import { WishlistModule } from './wishlist/wishlist.module';
import { FeaturedProjectsModule } from './featured-projects/featured-projects.module';
import { UploadsController } from './uploads/uploads.controller';
import { JourneysModule } from './journeys/journeys.module';
import { UpcomingProjectsModule } from './upcoming-projects/upcoming-projects.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { WorkshopMediaModule } from './workshop-media/workshop-media.module';

@Module({
  imports: [
    // Global rate limiting — 60 requests per 60 seconds per IP (baseline)
    // Auth endpoints override this with stricter @Throttle() decorators
    ThrottlerModule.forRoot([
      {
        name: 'global',
        ttl: 60_000, // 60 seconds window
        limit: 60,   // 60 requests per window (baseline for all routes)
      },
    ]),
    PrismaModule,
    RedisModule,
    CryptoModule,
    MailModule,
    AuthModule,
    SecurityModule,
    AuditLogModule,
    ProductsModule,
    OrdersModule,
    PaymentsModule,
    CareersModule,
    WorkshopsModule,
    EmployeesModule,
    ProjectsModule,
    FeaturedProjectsModule,
    ContractorsModule,
    CompanyModule,
    ContactModule,
    CartModule,
    WishlistModule,
    JourneysModule,
    UpcomingProjectsModule,
    DashboardModule,
    WorkshopMediaModule,
  ],
  controllers: [AppController, UploadsController],
  providers: [
    AppService,
    // Apply ThrottlerGuard globally to all routes
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
