import { IsString, IsNotEmpty, IsEmail, IsEnum, IsOptional } from 'class-validator';
import { RegistrationStatus } from '@prisma/client';

export class CreateRegistrationDto {
  @IsString()
  @IsNotEmpty()
  workshopId: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  phone: string;
}

export class UpdateRegistrationStatusDto {
  @IsEnum(RegistrationStatus)
  @IsNotEmpty()
  status: RegistrationStatus;
}
