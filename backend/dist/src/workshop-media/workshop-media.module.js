"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkshopMediaModule = void 0;
const common_1 = require("@nestjs/common");
const workshop_media_service_1 = require("./workshop-media.service");
const workshop_media_controller_1 = require("./workshop-media.controller");
const auth_module_1 = require("../auth/auth.module");
let WorkshopMediaModule = class WorkshopMediaModule {
};
exports.WorkshopMediaModule = WorkshopMediaModule;
exports.WorkshopMediaModule = WorkshopMediaModule = __decorate([
    (0, common_1.Module)({
        imports: [auth_module_1.AuthModule],
        providers: [workshop_media_service_1.WorkshopMediaService],
        controllers: [workshop_media_controller_1.PublicWorkshopMediaController, workshop_media_controller_1.AdminWorkshopMediaController],
        exports: [workshop_media_service_1.WorkshopMediaService],
    })
], WorkshopMediaModule);
//# sourceMappingURL=workshop-media.module.js.map