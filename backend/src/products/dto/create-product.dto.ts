import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsArray,
  IsOptional,
  IsBoolean,
  Min,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsArray()
  @IsString({ each: true })
  features: string[];

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
