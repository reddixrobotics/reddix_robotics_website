import { Controller, Post, UseInterceptors, UploadedFile, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { secureMulterOptions } from '../common/file-upload/file-upload.utils';
import { v2 as cloudinary } from 'cloudinary';
import { unlink } from 'fs/promises';

// Cloudinary configuration (credentials loaded from environment variables)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

@Controller('api/upload')
export class UploadsController {
  @Post()
  @UseInterceptors(FileInterceptor('file', secureMulterOptions))
  async uploadFile(@UploadedFile() file: any) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    try {
      const result = await cloudinary.uploader.upload_large(file.path, {
        folder: 'raddix_website',
        resource_type: 'auto',
      }) as any;

      // Remove the local file since it is now in Cloudinary
      await unlink(file.path).catch(console.error);

      return {
        url: result.secure_url,
        originalname: file.originalname,
        filename: file.filename,
        size: file.size,
      };
    } catch (error) {
      console.error('Cloudinary Upload Error:', error);
      
      // Cleanup local file if Cloudinary upload fails
      await unlink(file.path).catch(console.error);

      throw new InternalServerErrorException('Failed to upload image to Cloudinary');
    }
  }
}
