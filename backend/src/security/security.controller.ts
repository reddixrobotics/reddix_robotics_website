import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { SecurityService } from './security.service';
import { AdminAuthGuard } from '../auth/guards/admin-auth.guard';
import { CurrentSession, CurrentSessionToken } from '../auth/decorators/current-session.decorator';
import type { SessionData } from '../auth/session.service';
import { VerifyTotpSetupDto } from './dto/verify-totp-setup.dto';
import { DisableTotpDto } from './dto/disable-totp.dto';
import { RegenerateBackupCodesDto } from './dto/regenerate-backup-codes.dto';

@Controller('api/admin/security')
@UseGuards(AdminAuthGuard)
export class SecurityController {
  constructor(private readonly securityService: SecurityService) {}

  @Post('2fa/setup')
  @HttpCode(HttpStatus.OK)
  async setup2fa(@CurrentSession() session: SessionData) {
    return this.securityService.setup2fa(session.adminId);
  }

  @Post('2fa/verify')
  @HttpCode(HttpStatus.OK)
  async verify2faSetup(
    @CurrentSession() session: SessionData,
    @Body() verifyTotpSetupDto: VerifyTotpSetupDto,
  ) {
    return this.securityService.verify2faSetup(
      session.adminId,
      verifyTotpSetupDto.token,
    );
  }

  @Post('2fa/disable')
  @HttpCode(HttpStatus.OK)
  async disable2fa(
    @CurrentSession() session: SessionData,
    @Body() disableTotpDto: DisableTotpDto,
  ) {
    return this.securityService.disable2fa(
      session.adminId,
      disableTotpDto.code,
    );
  }

  @Post('backup-codes/regenerate')
  @HttpCode(HttpStatus.OK)
  async regenerateBackupCodes(
    @CurrentSession() session: SessionData,
    @Body() regenerateDto: RegenerateBackupCodesDto,
  ) {
    return this.securityService.regenerateBackupCodes(
      session.adminId,
      regenerateDto.password,
    );
  }

  @Get('sessions')
  async listActiveSessions(
    @CurrentSession() session: SessionData,
    @CurrentSessionToken() token: string,
  ) {
    return this.securityService.listActiveSessions(session.adminId, token);
  }

  @Delete('sessions/:id')
  @HttpCode(HttpStatus.OK)
  async terminateSession(
    @CurrentSession() session: SessionData,
    @Param('id') sessionId: string,
  ) {
    await this.securityService.terminateSession(session.adminId, sessionId);
    return { message: 'Session terminated successfully.' };
  }
}
