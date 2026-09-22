import { IsNotEmpty, IsString } from 'class-validator';

export class DisableTotpDto {
  @IsString()
  @IsNotEmpty()
  code: string;
}
