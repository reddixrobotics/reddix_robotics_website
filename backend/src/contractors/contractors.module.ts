import { Module } from '@nestjs/common';
import { ContractorsService } from './contractors.service';
import { PublicContractorsController, AdminContractorsController } from './contractors.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  providers: [ContractorsService],
  controllers: [PublicContractorsController, AdminContractorsController],
  exports: [ContractorsService],
})
export class ContractorsModule {}
