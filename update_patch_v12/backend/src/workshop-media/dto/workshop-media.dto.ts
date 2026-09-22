import { IsString, IsOptional, IsBoolean, IsInt, IsIn, ValidateIf } from 'class-validator';

export class UpsertWorkshopMediaDto {
  @IsString()
  @IsOptional()
  title?: string;

  @ValidateIf((o, val) => val !== null)
  @IsString()
  @IsOptional()
  mediaUrl?: string;

  @ValidateIf((o, val) => val !== null)
  @IsString()
  @IsOptional()
  posterUrl?: string;

  @IsString()
  @IsOptional()
  @IsIn(['video', 'image'])
  mediaType?: string;

  @IsString()
  @IsOptional()
  altText?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsInt()
  @IsOptional()
  displayOrder?: number;
}
