import {
  IsString,
  IsNotEmpty,
  IsArray,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { CareerStatus } from '@prisma/client';

export class CreateInternshipDto {
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
  duration: string;

  @IsString()
  @IsOptional()
  stipend?: string;

  @IsArray()
  @IsString({ each: true })
  requirements: string[];

  @IsEnum(CareerStatus)
  @IsOptional()
  status?: CareerStatus;
}

export class UpdateInternshipDto {
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
  duration?: string;

  @IsString()
  @IsOptional()
  stipend?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  requirements?: string[];

  @IsEnum(CareerStatus)
  @IsOptional()
  status?: CareerStatus;
}
