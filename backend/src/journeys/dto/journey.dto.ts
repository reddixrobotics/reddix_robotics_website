import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateJourneyDto {
  @IsString()
  @IsNotEmpty()
  year: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}

export class UpdateJourneyDto {
  @IsString()
  @IsOptional()
  year?: string;

  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;
}
