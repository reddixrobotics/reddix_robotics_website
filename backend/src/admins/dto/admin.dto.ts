import { IsEmail, IsEnum, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { AdminRole } from '@prisma/client';

export class CreateAdminDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @IsEnum(AdminRole)
  @IsNotEmpty()
  role: AdminRole;
}
