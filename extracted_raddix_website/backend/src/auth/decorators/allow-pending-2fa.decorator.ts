import { SetMetadata } from '@nestjs/common';

export const IS_ALLOW_PENDING_2FA_KEY = 'isAllowPending2FA';
export const AllowPending2FA = () => SetMetadata(IS_ALLOW_PENDING_2FA_KEY, true);
