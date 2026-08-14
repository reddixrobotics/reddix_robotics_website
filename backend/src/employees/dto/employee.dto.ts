import { IsString, IsNotEmpty, IsOptional, IsInt, IsUrl } from 'class-validator';

export class CreateEmployeeDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  position: string;

  @IsString()
  @IsNotEmpty()
  experience: string;

  @IsString()
  @IsOptional()
  linkedInUrl?: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsInt()
  @IsOptional()
  priority?: number;

  @IsString()
  @IsNotEmpty()
  profilePhoto: string;
}

export class UpdateEmployeeDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  position?: string;

  @IsString()
  @IsOptional()
  experience?: string;

  @IsString()
  @IsOptional()
  linkedInUrl?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsInt()
  @IsOptional()
  priority?: number;

  @IsString()
  @IsOptional()
  profilePhoto?: string;
}
