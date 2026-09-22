import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsInt,
  Min,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { WorkshopStatus } from '@prisma/client';

export class CreateWorkshopDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsDateString()
  date: string;

  @IsString()
  @IsNotEmpty()
  time: string;

  @IsString()
  @IsNotEmpty()
  duration: string;

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsInt()
  @Min(1)
  capacity: number;

  @IsEnum(WorkshopStatus)
  @IsOptional()
  status?: WorkshopStatus;

  @IsString()
  @IsOptional()
  posterUrl?: string;

  @IsString()
  @IsOptional()
  externalUrl?: string;
}

export class UpdateWorkshopDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  @IsOptional()
  date?: string;

  @IsString()
  @IsOptional()
  time?: string;

  @IsString()
  @IsOptional()
  duration?: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsInt()
  @Min(1)
  @IsOptional()
  capacity?: number;

  @IsEnum(WorkshopStatus)
  @IsOptional()
  status?: WorkshopStatus;

  @IsString()
  @IsOptional()
  posterUrl?: string;

  @IsString()
  @IsOptional()
  externalUrl?: string;
}
