"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileValidationPipe = void 0;
const common_1 = require("@nestjs/common");
const file_upload_utils_1 = require("./file-upload.utils");
let FileValidationPipe = class FileValidationPipe {
    transform(file) {
        if (!file) {
            return null;
        }
        if (!file_upload_utils_1.ALLOWED_MIMES.includes(file.mimetype)) {
            throw new common_1.BadRequestException('MIME type not allowed');
        }
        const isImage = file.mimetype.startsWith('image/');
        const maxSize = isImage ? 5 * 1024 * 1024 : 10 * 1024 * 1024;
        if (file.size > maxSize) {
            const typeStr = isImage ? 'Images' : 'PDF files';
            const limitStr = isImage ? '5MB' : '10MB';
            throw new common_1.BadRequestException(`${typeStr} must not exceed ${limitStr}.`);
        }
        return file;
    }
};
exports.FileValidationPipe = FileValidationPipe;
exports.FileValidationPipe = FileValidationPipe = __decorate([
    (0, common_1.Injectable)()
], FileValidationPipe);
//# sourceMappingURL=file-validation.pipe.js.map