import { Module } from '@nestjs/common';
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

@Module({
  imports: [
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
    ContractorsModule,
    CompanyModule,
    ContactModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

