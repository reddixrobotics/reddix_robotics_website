"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkshopsModule = void 0;
const common_1 = require("@nestjs/common");
const workshops_service_1 = require("./workshops.service");
const workshops_controller_1 = require("./workshops.controller");
const auth_module_1 = require("../auth/auth.module");
let WorkshopsModule = class WorkshopsModule {
};
exports.WorkshopsModule = WorkshopsModule;
exports.WorkshopsModule = WorkshopsModule = __decorate([
    (0, common_1.Module)({
        imports: [auth_module_1.AuthModule],
        providers: [workshops_service_1.WorkshopsService],
        controllers: [workshops_controller_1.PublicWorkshopsController, workshops_controller_1.AdminWorkshopsController],
        exports: [workshops_service_1.WorkshopsService],
    })
], WorkshopsModule);
//# sourceMappingURL=workshops.module.js.map