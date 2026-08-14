import { IsString, IsEmail, IsOptional, IsNumber } from 'class-validator';

export class UpdateCompanyInfoDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  aboutContent?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  city?: string;

  @IsString()
  @IsOptional()
  state?: string;

  @IsString()
  @IsOptional()
  country?: string;

  @IsNumber()
  @IsOptional()
  latitude?: number;

  @IsNumber()
  @IsOptional()
  longitude?: number;

  @IsOptional()
  socialLinks?: any;
}
