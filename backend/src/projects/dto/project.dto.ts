import { IsString, IsNotEmpty, IsArray, IsOptional } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsArray()
  @IsString({ each: true })
  images: string[];

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsArray()
  @IsString({ each: true })
  technologies: string[];

  @IsString()
  @IsNotEmpty()
  status: string;

  @IsString()
  @IsNotEmpty()
  date: string;
}

export class UpdateProjectDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];

  @IsString()
  @IsOptional()
  category?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  technologies?: string[];

  @IsString()
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  date?: string;
}
