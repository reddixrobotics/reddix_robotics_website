import {
  IsString,
  IsNumber,
  IsArray,
  IsOptional,
  IsBoolean,
  Min,
} from 'class-validator';

export class UpdateProductDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  price?: number;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  features?: string[];

  @IsOptional()
  technicalSpecifications?: any;

  @IsBoolean()
  @IsOptional()
  availability?: boolean;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];
}
