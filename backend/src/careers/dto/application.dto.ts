import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { ApplicationType, ApplicationStatus } from '@prisma/client';

export class CreateApplicationDto {
  @IsEnum(ApplicationType)
  type: ApplicationType;

  @IsString()
  @IsOptional()
  jobId?: string;

  @IsString()
  @IsOptional()
  internshipId?: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  resumeUrl: string;

  @IsString()
  @IsOptional()
  coverLetter?: string;
}

export class UpdateApplicationStatusDto {
  @IsEnum(ApplicationStatus)
  @IsNotEmpty()
  status: ApplicationStatus;
}
