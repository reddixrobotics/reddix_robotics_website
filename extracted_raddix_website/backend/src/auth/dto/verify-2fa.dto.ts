import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class Verify2faDto {
  /**
   * Accepts either:
   *   - A 6-digit TOTP token (e.g. "123456")
   *   - An 8-character hex backup code (e.g. "a1b2c3d4")
   */
  @IsString()
  @IsNotEmpty()
  @Matches(/^(\d{6}|[0-9a-fA-F]{8})$/, {
    message: 'Token must be a 6-digit TOTP code or an 8-character hex backup code',
  })
  token: string;
}
