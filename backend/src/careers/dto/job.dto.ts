import {
  IsString,
  IsNotEmpty,
  IsArray,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { CareerStatus } from '@prisma/client';

export class CreateJobDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  department: string;

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsString()
  @IsNotEmpty()
  experienceLevel: string;

  @IsArray()
  @IsString({ each: true })
  requirements: string[];

  @IsArray()
  @IsString({ each: true })
  responsibilities: string[];

  @IsEnum(CareerStatus)
  @IsOptional()
  status?: CareerStatus;
}

export class UpdateJobDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  department?: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsString()
  @IsOptional()
  type?: string;

  @IsString()
  @IsOptional()
  experienceLevel?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  requirements?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  responsibilities?: string[];

  @IsEnum(CareerStatus)
  @IsOptional()
  status?: CareerStatus;
}
