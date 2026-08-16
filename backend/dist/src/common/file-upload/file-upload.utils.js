"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.secureMulterOptions = exports.ALLOWED_MIMES = void 0;
const common_1 = require("@nestjs/common");
const multer_1 = require("multer");
const path_1 = require("path");
const fs_1 = require("fs");
exports.ALLOWED_MIMES = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'application/pdf',
];
exports.secureMulterOptions = {
    storage: (0, multer_1.diskStorage)({
        destination: (req, file, cb) => {
            const uploadDir = (0, path_1.join)(__dirname, '../../../uploads');
            if (!(0, fs_1.existsSync)(uploadDir)) {
                (0, fs_1.mkdirSync)(uploadDir, { recursive: true });
            }
            cb(null, uploadDir);
        },
        filename: (req, file, cb) => {
            const safeSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
            const ext = (0, path_1.extname)(file.originalname).toLowerCase();
            if (!['.jpg', '.jpeg', '.png', '.webp', '.pdf'].includes(ext)) {
                return cb(new common_1.BadRequestException('Invalid file extension'), '');
            }
            cb(null, `${file.fieldname}-${safeSuffix}${ext}`);
        },
    }),
    fileFilter: (req, file, cb) => {
        if (!exports.ALLOWED_MIMES.includes(file.mimetype)) {
            return cb(new common_1.BadRequestException('MIME type not allowed. Supported formats: JPEG, PNG, WEBP, and PDF.'), false);
        }
        cb(null, true);
    },
    limits: {
        fileSize: 10 * 1024 * 1024,
    },
};
//# sourceMappingURL=file-upload.utils.js.map