import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegenerateBackupCodesDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password: string;
}
