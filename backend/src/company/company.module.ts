import { Module } from '@nestjs/common';
import { CompanyService } from './company.service';
import { PublicCompanyController, AdminCompanyController } from './company.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  providers: [CompanyService],
  controllers: [PublicCompanyController, AdminCompanyController],
  exports: [CompanyService],
})
export class CompanyModule {}
