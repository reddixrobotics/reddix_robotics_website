import { BadRequestException } from '@nestjs/common';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';

export const ALLOWED_MIMES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/pdf',
];

/**
 * Secure Multer Configuration Options.
 * Prevents path traversal by ignoring client-side filenames and generating unique secure names.
 * Restricts mimetypes and sets global limits.
 */
export const secureMulterOptions = {
  storage: diskStorage({
    destination: (req, file, cb) => {
      const uploadDir = join(__dirname, '../../../uploads');
      if (!existsSync(uploadDir)) {
        mkdirSync(uploadDir, { recursive: true });
      }
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const safeSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = extname(file.originalname).toLowerCase();
      
      // Strict whitelist check for extensions
      if (!['.jpg', '.jpeg', '.png', '.webp', '.pdf'].includes(ext)) {
        return cb(new BadRequestException('Invalid file extension'), '');
      }

      cb(null, `${file.fieldname}-${safeSuffix}${ext}`);
    },
  }),
  fileFilter: (req, file, cb) => {
    if (!ALLOWED_MIMES.includes(file.mimetype)) {
      return cb(
        new BadRequestException(
          'MIME type not allowed. Supported formats: JPEG, PNG, WEBP, and PDF.',
        ),
        false,
      );
    }
    cb(null, true);
  },
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB global ceiling
  },
};
