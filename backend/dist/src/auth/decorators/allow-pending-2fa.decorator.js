"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllowPending2FA = exports.IS_ALLOW_PENDING_2FA_KEY = void 0;
const common_1 = require("@nestjs/common");
exports.IS_ALLOW_PENDING_2FA_KEY = 'isAllowPending2FA';
const AllowPending2FA = () => (0, common_1.SetMetadata)(exports.IS_ALLOW_PENDING_2FA_KEY, true);
exports.AllowPending2FA = AllowPending2FA;
//# sourceMappingURL=allow-pending-2fa.decorator.js.map