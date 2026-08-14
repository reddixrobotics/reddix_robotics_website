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
exports.UpdateWorkshopDto = exports.CreateWorkshopDto = void 0;
const class_validator_1 = require("class-validator");
const client_1 = require("@prisma/client");
class CreateWorkshopDto {
    title;
    description;
    date;
    time;
    duration;
    location;
    capacity;
    status;
}
exports.CreateWorkshopDto = CreateWorkshopDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateWorkshopDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateWorkshopDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateWorkshopDto.prototype, "date", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateWorkshopDto.prototype, "time", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateWorkshopDto.prototype, "duration", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateWorkshopDto.prototype, "location", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateWorkshopDto.prototype, "capacity", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(client_1.WorkshopStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateWorkshopDto.prototype, "status", void 0);
class UpdateWorkshopDto {
    title;
    description;
    date;
    time;
    duration;
    location;
    capacity;
    status;
}
exports.UpdateWorkshopDto = UpdateWorkshopDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateWorkshopDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateWorkshopDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateWorkshopDto.prototype, "date", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateWorkshopDto.prototype, "time", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateWorkshopDto.prototype, "duration", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateWorkshopDto.prototype, "location", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateWorkshopDto.prototype, "capacity", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(client_1.WorkshopStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateWorkshopDto.prototype, "status", void 0);
//# sourceMappingURL=workshop.dto.js.map