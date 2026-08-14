import { Module } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { PublicEmployeesController, AdminEmployeesController } from './employees.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  providers: [EmployeesService],
  controllers: [PublicEmployeesController, AdminEmployeesController],
  exports: [EmployeesService],
})
export class EmployeesModule {}
