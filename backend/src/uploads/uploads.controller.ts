import {
  Controller, Post, UseInterceptors, UploadedFile,
  BadRequestException, InternalServerErrorException, UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AdminAuthGuard } from '../auth/guards/admin-auth.guard';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { memoryStorage } from 'multer';

// ─── Multer: store in RAM, no temp files on disk ──────────────────────────────
const ALLOWED_MIMES = [
  'image/jpeg', 'image/png', 'image/webp',
  'application/pdf',
  'video/mp4', 'video/webm', 'video/ogg',
  'video/quicktime', 'video/x-msvideo', 'video/x-matroska',
];

const ALLOWED_EXTS = [
  '.jpg', '.jpeg', '.png', '.webp', '.pdf',
  '.mp4', '.webm', '.ogg', '.mov', '.avi', '.mkv',
];

const memoryMulterOptions = {
  storage: memoryStorage(),
  fileFilter: (_req: any, file: any, cb: any) => {
    if (!ALLOWED_MIMES.includes(file.mimetype)) {
      return cb(new BadRequestException('MIME type not allowed. Supported: JPEG, PNG, WEBP, PDF, Video.'), false);
    }
    const ext = require('path').extname(file.originalname).toLowerCase();
    if (!ALLOWED_EXTS.includes(ext)) {
      return cb(new BadRequestException('Invalid file extension.'), false);
    }
    cb(null, true);
  },
  limits: { fileSize: 150 * 1024 * 1024 }, // 150 MB
};

// ─── Controller ───────────────────────────────────────────────────────────────
@Controller('api/upload')
export class UploadsController {
  @Post()
  @UseGuards(AdminAuthGuard)
  @UseInterceptors(FileInterceptor('file', memoryMulterOptions))
  async uploadFile(@UploadedFile() file: any) {
    if (!file || !file.buffer) {
      throw new BadRequestException('No file uploaded');
    }

    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    try {
      // Pipe the in-memory buffer directly to Cloudinary — no disk I/O, no ENOENT.
      const result = await new Promise<UploadApiResponse>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'raddix_website', resource_type: 'auto' },
          (error, result) => {
            if (error) return reject(error);
            resolve(result!);
          },
        );
        stream.end(file.buffer);
      });

      return {
        url: result.secure_url,
        originalname: file.originalname,
        size: file.size,
      };
    } catch (error) {
      console.error('Cloudinary Upload Error:', error);
      throw new InternalServerErrorException('Failed to upload file to Cloudinary');
    }
  }
}

