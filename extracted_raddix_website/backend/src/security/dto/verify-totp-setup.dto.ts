import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';

export class VerifyTotpSetupDto {
  @IsString()
  @IsNotEmpty()
  @Length(6, 6, { message: 'TOTP token must be exactly 6 characters long' })
  @Matches(/^\d{6}$/, { message: 'TOTP token must contain only digits' })
  token: string;
}
