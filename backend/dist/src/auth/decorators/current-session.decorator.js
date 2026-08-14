"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurrentSessionToken = exports.CurrentSession = void 0;
const common_1 = require("@nestjs/common");
exports.CurrentSession = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    return request['session'];
});
exports.CurrentSessionToken = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    return request['sessionToken'];
});
//# sourceMappingURL=current-session.decorator.js.map