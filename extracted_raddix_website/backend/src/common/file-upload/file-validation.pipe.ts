import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { ALLOWED_MIMES } from './file-upload.utils';

@Injectable()
export class FileValidationPipe implements PipeTransform {
  /**
   * Validate uploaded file type and size.
   * Max Size: 5MB for images, 10MB for PDFs.
   */
  transform(file: any) {
    if (!file) {
      return null;
    }

    // Verify mimetype
    if (!ALLOWED_MIMES.includes(file.mimetype)) {
      throw new BadRequestException('MIME type not allowed');
    }

    const isImage = file.mimetype.startsWith('image/');
    const maxSize = isImage ? 5 * 1024 * 1024 : 10 * 1024 * 1024; // 5MB vs 10MB

    if (file.size > maxSize) {
      const typeStr = isImage ? 'Images' : 'PDF files';
      const limitStr = isImage ? '5MB' : '10MB';
      throw new BadRequestException(`${typeStr} must not exceed ${limitStr}.`);
    }

    return file;
  }
}
