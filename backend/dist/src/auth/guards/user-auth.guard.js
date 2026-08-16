"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserAuthGuard = void 0;
const common_1 = require("@nestjs/common");
const user_session_service_1 = require("../user-session.service");
let UserAuthGuard = class UserAuthGuard {
    userSessionService;
    constructor(userSessionService) {
        this.userSessionService = userSessionService;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const token = request.cookies['user_session'];
        if (!token) {
            throw new common_1.UnauthorizedException('Authentication session missing');
        }
        const session = await this.userSessionService.verifySession(token);
        if (!session) {
            throw new common_1.UnauthorizedException('Invalid or expired session');
        }
        if (session.authStatus !== 'AUTHENTICATED') {
            throw new common_1.UnauthorizedException('User not fully authenticated');
        }
        request['user'] = { id: session.userId };
        request['session'] = session;
        request['sessionToken'] = token;
        return true;
    }
};
exports.UserAuthGuard = UserAuthGuard;
exports.UserAuthGuard = UserAuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_session_service_1.UserSessionService])
], UserAuthGuard);
//# sourceMappingURL=user-auth.guard.js.map