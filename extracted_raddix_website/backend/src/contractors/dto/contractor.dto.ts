import { IsString, IsNotEmpty, IsOptional, IsUrl } from 'class-validator';

export class CreateContractorDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  country: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  logoUrl: string;

  @IsString()
  @IsUrl()
  @IsOptional()
  website?: string;

  @IsString()
  @IsOptional()
  contactInfo?: string;
}

export class UpdateContractorDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  country?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  logoUrl?: string;

  @IsString()
  @IsUrl()
  @IsOptional()
  website?: string;

  @IsString()
  @IsOptional()
  contactInfo?: string;
}
