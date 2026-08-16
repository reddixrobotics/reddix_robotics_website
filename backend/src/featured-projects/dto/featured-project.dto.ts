import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { FeaturedProjectStatus } from '@prisma/client';

export class CreateFeaturedProjectDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  imageUrl: string;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsString()
  @IsOptional()
  projectUrl?: string;

  @IsEnum(FeaturedProjectStatus)
  @IsOptional()
  status?: FeaturedProjectStatus;
}

export class UpdateFeaturedProjectDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsString()
  @IsOptional()
  projectUrl?: string;

  @IsEnum(FeaturedProjectStatus)
  @IsOptional()
  status?: FeaturedProjectStatus;
}
